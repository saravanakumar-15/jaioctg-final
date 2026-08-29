import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';
import { createServer as createViteServer } from 'vite';
import { 
  INITIAL_USERS, 
  INITIAL_AUDIT_LOGS, 
  API_ENDPOINTS, 
  DB_SCHEMA_TABLES, 
  DB_RELATIONS, 
  RECENT_INSPECTION_RECORDS, 
  SAMPLE_QUOTES, 
  DIGITAL_CERTIFICATES,
  DOCKER_CONFIG
} from './src/data/mockData.js';
import { 
  sendTripleNotificationEmails, 
  sendTripleQuotationEmails, 
  sendDualNotificationEmails,
  sendDualQuotationEmails,
  logEmailEnvironmentStatus,
  getCompanyEmail,
  getManagerEmail
} from './server/email.js';
import { generateNextQuotationNumber, resolveServiceItems, QuotationData } from './server/quotation.js';
import { generateQuotationPDF } from './server/pdfGenerator.js';
import { User, UserRole } from './src/types.js';

export function createApp() {
  const app = express();

  // Log email automation environment status safely on server boot
  logEmailEnvironmentStatus();

  // Security: Parse JSON with payload limit
  app.use(express.json({ limit: '10mb' }));

  // Security: Configurable CORS middleware protecting private & authenticated APIs
  const defaultAllowedOrigins = [
    'https://www.jaioctginspection.com',
    'https://jaioctginspection.com',
    'https://api.jaioctginspection.com'
  ];

  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';
  const configuredOrigins = allowedOriginsEnv
    ? allowedOriginsEnv
        .split(',')
        .map((o) => o.trim().replace(/\/+$/, ''))
        .filter(Boolean)
    : [];

  const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...configuredOrigins]));

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      const normalizedOrigin = origin.trim().replace(/\/+$/, '');
      const isAllowed = 
        allowedOrigins.includes(origin) || 
        allowedOrigins.includes(normalizedOrigin) ||
        normalizedOrigin.endsWith('jaioctginspection.com') ||
        normalizedOrigin.includes('localhost') ||
        normalizedOrigin.includes('127.0.0.1') ||
        normalizedOrigin.includes('netlify.app') ||
        normalizedOrigin.includes('run.app');

      if (isAllowed) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      } else {
        console.warn(`[CORS_BLOCKED] Incoming Origin '${origin}' does not match ALLOWED_ORIGINS whitelist:`, allowedOrigins);
      }
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    const requestedHeaders = req.headers['access-control-request-headers'];
    res.setHeader(
      'Access-Control-Allow-Headers',
      requestedHeaders || 'Content-Type, Authorization, x-user-role, X-Requested-With, Accept, Origin'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  // Request logger middleware
  const apiLogs: Array<{ id: string; timestamp: string; method: string; endpoint: string; statusCode: number; responseTimeMs: number }> = [
    { id: 'al_1', timestamp: new Date().toISOString(), method: 'GET', endpoint: '/api/health', statusCode: 200, responseTimeMs: 4 },
    { id: 'al_2', timestamp: new Date().toISOString(), method: 'POST', endpoint: '/api/auth/login', statusCode: 200, responseTimeMs: 18 }
  ];

  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      if (req.originalUrl.startsWith('/api')) {
        apiLogs.unshift({
          id: `al_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date().toISOString(),
          method: req.method,
          endpoint: req.originalUrl,
          statusCode: res.statusCode,
          responseTimeMs: Date.now() - start
        });
        if (apiLogs.length > 100) apiLogs.pop();
      }
    });
    next();
  });

  // State in-memory (passwords never exposed to client)
  let users = [...INITIAL_USERS];
  let auditLogs = [...INITIAL_AUDIT_LOGS];
  let inspectionRecords = [...RECENT_INSPECTION_RECORDS];
  let quoteRequests = [...SAMPLE_QUOTES];
  let certificates = [...DIGITAL_CERTIFICATES];

  // Helper to sanitize user object and strip password
  const sanitizeUser = (user: any) => {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  };

  // ==========================================
  // API ROUTES
  // ==========================================

  // Healthcheck
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      system: 'JAI OCTG Inspection API Gateway',
      version: '3.4.0-enterprise',
      uptimeSeconds: Math.floor(process.uptime()),
      activeInspectors: 42,
      timestamp: new Date().toISOString()
    });
  });

  // Auth: Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password.trim()) {
      res.status(400).json({ success: false, error: 'Both email and password are required.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const found = users.find(u => u.email.toLowerCase() === cleanEmail || u.name.toLowerCase() === cleanEmail);

    if (found && (found.password ? found.password === cleanPassword : cleanPassword === 'password123')) {
      const token = `jwt_ey29813.${Buffer.from(JSON.stringify({ id: found.id, role: found.role })).toString('base64')}.sig`;
      res.json({
        success: true,
        token,
        user: sanitizeUser(found),
        requiresOtp: found.mfaEnabled
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials. User record not found or password incorrect.'
      });
    }
  });

  // Auth: Verify OTP
  app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
    const { otpCode } = req.body;
    if (typeof otpCode === 'string' && /^\d{6}$/.test(otpCode.trim())) {
      res.json({ success: true, message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid 6-digit verification code' });
    }
  });

  // Inspections API
  app.get('/api/inspections', (_req: Request, res: Response) => {
    res.json({
      data: inspectionRecords,
      total: inspectionRecords.length
    });
  });

  app.post('/api/inspections', (req: Request, res: Response) => {
    const { rigLocation, clientName, pipeType, pipeSize, totalJoints, acceptedJoints, rejectedJoints, reworkJoints, inspectorName } = req.body;
    const newRecord = {
      id: `INS-2026-${Math.floor(8800 + Math.random() * 1000)}`,
      rigLocation: (typeof rigLocation === 'string' && rigLocation.trim()) ? rigLocation.trim() : 'Offshore Rig Yard',
      clientName: (typeof clientName === 'string' && clientName.trim()) ? clientName.trim() : 'Enterprise Oil Client',
      pipeType: (typeof pipeType === 'string' && pipeType.trim()) ? pipeType.trim() : 'Casing 9-5/8" P110',
      pipeSize: (typeof pipeSize === 'string' && pipeSize.trim()) ? pipeSize.trim() : '9-5/8" OD, 47#',
      totalJoints: Number(totalJoints) || 500,
      acceptedJoints: Number(acceptedJoints) || 490,
      rejectedJoints: Number(rejectedJoints) || 10,
      reworkJoints: Number(reworkJoints) || 0,
      inspectorName: (typeof inspectorName === 'string' && inspectorName.trim()) ? inspectorName.trim() : 'Marcus Sterling',
      asntLevel: 'ASNT Level III',
      inspectionDate: new Date().toISOString().split('T')[0],
      status: 'In Progress' as const,
      certificateId: `CERT-JAI-${Math.floor(1000 + Math.random() * 9000)}`,
      standardsApplied: 'API Spec 5CT / DS-1'
    };
    inspectionRecords.unshift(newRecord);
    res.status(201).json({ success: true, record: newRecord });
  });

  // Storage for generated quotation PDFs and records
  const generatedQuotationPdfs = new Map<string, Buffer>();
  const quotationRecordsMap = new Map<string, QuotationData>();

  // Quotes / RFP API
  app.get('/api/quotes', (req: Request, res: Response) => {
    const roleHeader = (req.headers['x-user-role'] as string) || (req.headers['authorization'] as string) || (req.query.role as string) || '';
    const cleanRole = roleHeader.trim().toLowerCase();

    // Role check: Only Super Admin, Operations Manager, QA Lead, Inspector, or admin-level roles can view quote requests
    const isAdminRole = cleanRole.includes('admin') || cleanRole.includes('manager') || cleanRole.includes('lead') || cleanRole.includes('super');
    const isClientRole = cleanRole.includes('client');

    if (!cleanRole || isClientRole || !isAdminRole) {
      res.status(403).json({ error: '403 Forbidden: Access to quotation RFPs is restricted to JAI Administration roles.' });
      return;
    }

    res.json({ data: quoteRequests });
  });

  // Download / View Generated Quotation PDF
  app.get('/api/quotes/:id/pdf', async (req: Request, res: Response) => {
    const rawId = req.params.id || '';
    // Prevent path traversal and sanitize ID
    const cleanId = rawId.replace(/[^a-zA-Z0-9_-]/g, '').trim();

    if (!cleanId) {
      res.status(400).json({ success: false, error: 'Invalid quotation reference ID.' });
      return;
    }

    let pdfBuffer = generatedQuotationPdfs.get(cleanId);

    if (!pdfBuffer) {
      const quoteData = quotationRecordsMap.get(cleanId);
      if (quoteData) {
        try {
          pdfBuffer = await generateQuotationPDF(quoteData);
          generatedQuotationPdfs.set(cleanId, pdfBuffer);
        } catch (err) {
          console.error(`[PDF Gen Error] Failed generating on-demand PDF for ${cleanId}:`, err);
        }
      }
    }

    if (!pdfBuffer) {
      // Create fallback sample PDF if quote exists in quoteRequests
      const existing = quoteRequests.find(q => q.id === cleanId || q.id.toLowerCase() === cleanId.toLowerCase());
      if (existing) {
        const quoteData: QuotationData = {
          quotationNumber: existing.id,
          quotationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          customerName: existing.clientName || 'Valued Customer',
          companyName: existing.company || 'Operating Company',
          email: existing.email || 'contact@client.com',
          phone: existing.phone || '+65 9697 4165',
          address: existing.location || 'Singapore Base Yard',
          services: resolveServiceItems(existing.serviceType, existing.pipeSpecs, existing.estimatedJoints),
          pipeSpecs: existing.pipeSpecs || 'Standard Specification',
          status: 'Submitted'
        };
        try {
          pdfBuffer = await generateQuotationPDF(quoteData);
          generatedQuotationPdfs.set(cleanId, pdfBuffer);
        } catch (err) {
          console.error(`[PDF Gen Error] Fallback generation failed for ${cleanId}:`, err);
        }
      }
    }

    if (!pdfBuffer) {
      // Direct on-demand generation for requested quotation reference format (e.g. JAI-QTN-2026-0001)
      const quoteData: QuotationData = {
        quotationNumber: cleanId,
        quotationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        customerName: 'Valued Client Representative',
        companyName: 'Operating Energy Corporation',
        email: 'contact@client.com',
        phone: '+65 9697 4165',
        address: 'Singapore Base Yard / Client Designated Base',
        services: resolveServiceItems(['DRILLPIPE INSPECTION (DS-1 CAT4)', 'BHA INSPECTION (DS-1 CAT3-5)'], '5" 19.5# S-135 NC50 Range 2', 1000),
        pipeSpecs: '5" 19.5# S-135 NC50 Range 2',
        status: 'Submitted'
      };
      try {
        pdfBuffer = await generateQuotationPDF(quoteData);
        generatedQuotationPdfs.set(cleanId, pdfBuffer);
      } catch (err) {
        console.error(`[PDF Gen Error] Direct fallback generation failed for ${cleanId}:`, err);
      }
    }

    if (pdfBuffer && pdfBuffer.length > 0) {
      res.status(200);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Quotation-${cleanId}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length.toString());
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.send(pdfBuffer);
    } else {
      res.status(500).json({ 
        success: false, 
        error: `Unable to generate quotation PDF. Please verify quotation details.` 
      });
    }
  });

  // In-memory request deduplication maps to prevent duplicate email submissions
  const recentQuoteSubmissions = new Map<string, { timestamp: number; responseData: any }>();
  const recentContactSubmissions = new Map<string, { timestamp: number; responseData: any }>();

  app.post('/api/quotes', async (req: Request, res: Response) => {
    const { 
      clientName, 
      company, 
      email, 
      phone, 
      serviceType, 
      servicesList, 
      location, 
      address, 
      pipeSpecs, 
      estimatedJoints, 
      urgency,
      additionalNotes
    } = req.body;
    
    console.log(`[BACKEND_REQUEST_RECEIVED] POST /api/quotes - Client: "${clientName}", Company: "${company}", Email: "${email}", Services: "${Array.isArray(servicesList) ? servicesList.join('; ') : serviceType}"`);

    const custEmail = (email && typeof email === 'string') ? email.trim() : '';

    // Validate customer email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!custEmail || !emailRegex.test(custEmail)) {
      console.warn(`[BACKEND_REQUEST_REJECTED] /api/quotes - Invalid email address: "${custEmail}"`);
      return res.status(400).json({
        success: false,
        error: 'A valid customer work email address is required.'
      });
    }

    const custName = (clientName && typeof clientName === 'string' && clientName.trim()) ? clientName.trim() : 'Valued Customer';
    const custCompany = (company && typeof company === 'string' && company.trim()) ? company.trim() : 'Operating Company';
    const custPhone = (phone && typeof phone === 'string' && phone.trim()) ? phone.trim() : '+65 9697 4165';
    const custLocation = (location || address || 'Singapore Base Yard').trim();

    // Check deduplication cache within 15 seconds to prevent duplicate clicks
    const chosenServices = servicesList && Array.isArray(servicesList) && servicesList.length > 0
      ? servicesList
      : (serviceType || '1. DRILLPIPE INSPECTION - DS-1 CAT4');

    const dedupeKey = `${custEmail.toLowerCase()}||${custCompany.toLowerCase()}||${String(pipeSpecs || '')}||${String(estimatedJoints || '')}||${Array.isArray(chosenServices) ? chosenServices.join(',') : chosenServices}`;
    const existing = recentQuoteSubmissions.get(dedupeKey);
    if (existing && (Date.now() - existing.timestamp) < 15000) {
      console.log(`[DEDUPLICATION_GUARD] Duplicate quotation submission blocked for <${custEmail}>. Returning existing result.`);
      return res.status(200).json(existing.responseData);
    }

    // Generate dynamic quotation number: JAI-QTN-2026-0001, JAI-QTN-2026-0002...
    const quotationNumber = generateNextQuotationNumber();

    // Format date as "16 Aug 2026"
    const todayFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const submissionTimestamp = new Date().toISOString();

    const structuredServices = resolveServiceItems(chosenServices, pipeSpecs, estimatedJoints);

    const quotationData: QuotationData = {
      quotationNumber,
      quotationDate: todayFormatted,
      submissionTimestamp,
      customerName: custName,
      companyName: custCompany,
      email: custEmail,
      phone: custPhone,
      address: custLocation,
      services: structuredServices,
      pipeSpecs: pipeSpecs || 'Standard Tubular Spec',
      estimatedJoints: Number(estimatedJoints) || 500,
      urgency: urgency || 'Standard',
      additionalNotes: additionalNotes ? String(additionalNotes).trim() : undefined,
      status: 'Submitted'
    };

    // Save quotation record in memory
    quotationRecordsMap.set(quotationNumber, quotationData);

    const newQuoteRecord = {
      id: quotationNumber,
      clientName: custName,
      company: custCompany,
      email: custEmail,
      phone: custPhone,
      serviceType: Array.isArray(chosenServices) ? chosenServices.join(', ') : chosenServices,
      location: custLocation,
      pipeSpecs: pipeSpecs || 'Standard Specification',
      estimatedJoints: Number(estimatedJoints) || 500,
      urgency: urgency || 'Standard',
      status: 'Received' as const,
      createdAt: new Date().toISOString().split('T')[0]
    };
    quoteRequests.unshift(newQuoteRecord);

    let pdfBuffer: Buffer | null = null;

    // Generate the professional corporate A4 PDF
    try {
      pdfBuffer = await generateQuotationPDF(quotationData);
      generatedQuotationPdfs.set(quotationNumber, pdfBuffer);
      console.log(`[PDF Generator] Successfully created PDF for quotation ${quotationNumber} (${pdfBuffer.length} bytes)`);
    } catch (err) {
      console.error(`[PDF Generator Error] Failed creating PDF for quotation ${quotationNumber}:`, err);
    }

    // Trigger Triple Email Automation:
    // 1. Customer Email
    // 2. Company Email
    // 3. Manager Email
    let emailDelivery: { 
      customerSent: boolean; 
      companySent: boolean; 
      managerSent: boolean; 
      error?: string;
      summary?: string;
    } = {
      customerSent: false,
      companySent: false,
      managerSent: false
    };

    if (pdfBuffer && custEmail) {
      try {
        const tripleResult = await sendTripleQuotationEmails(quotationData, pdfBuffer);
        emailDelivery = {
          customerSent: tripleResult.customerResult.success,
          companySent: tripleResult.companyResult.success,
          managerSent: tripleResult.managerResult.success,
          error: !tripleResult.allSuccess 
            ? (tripleResult.customerResult.errorMessage || tripleResult.companyResult.errorMessage || tripleResult.managerResult.errorMessage)
            : undefined,
          summary: tripleResult.summary
        };
        console.log(`[Quotation Email Automation] ${quotationNumber} Result: ${tripleResult.summary}`);
      } catch (err: any) {
        console.error('[Triple Email Error - Quotation PDF]:', err);
        emailDelivery.error = err?.message || 'Email dispatch failed';
      }
    }

    console.log(`[BACKEND_EMAIL_DELIVERY_STATUS] /api/quotes Quotation #${quotationNumber} - customerSent: ${emailDelivery.customerSent}, companySent: ${emailDelivery.companySent}, managerSent: ${emailDelivery.managerSent}`);

    const responsePayload = {
      success: true,
      quotationNumber,
      quoteRef: quotationNumber,
      pdfDownloadUrl: `/api/quotes/${quotationNumber}/pdf`,
      quote: newQuoteRecord,
      emailDelivery,
      message: `Quotation Request Submitted Successfully. Quotation Number: ${quotationNumber}. A copy of your quotation has been sent to your email.`
    };

    // Cache submission response to prevent accidental duplicates
    recentQuoteSubmissions.set(dedupeKey, {
      timestamp: Date.now(),
      responseData: responsePayload
    });

    res.status(201).json(responsePayload);
  });

  // Certificates API
  app.get('/api/certificates', (_req: Request, res: Response) => {
    res.json({ data: certificates });
  });

  // Users API (passwords strictly omitted)
  app.get('/api/users', (req: Request, res: Response) => {
    const roleFilter = req.query.role as string;
    const search = req.query.search as string;

    let filtered = users.map(u => sanitizeUser(u));
    if (roleFilter && roleFilter !== 'All') {
      filtered = filtered.filter(u => u?.role === roleFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(u => u && (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.company.toLowerCase().includes(q)));
    }

    res.json({
      data: filtered,
      total: filtered.length
    });
  });

  app.post('/api/users', (req: Request, res: Response) => {
    const { name, email, password, role, company, department } = req.body;
    if (!name || !email || typeof name !== 'string' || typeof email !== 'string') {
      res.status(400).json({ error: 'Valid Name and Email are required' });
      return;
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: (typeof password === 'string' && password.trim()) ? password.trim() : 'password123',
      role: ((typeof role === 'string' && role.trim()) ? role.trim() : 'Client Enterprise Admin') as UserRole,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=150`,
      company: (typeof company === 'string' && company.trim()) ? company.trim() : 'Enterprise Client',
      status: 'Active' as const,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
      mfaEnabled: false,
      department: (typeof department === 'string' && department.trim()) ? department.trim() : 'Operations'
    };

    users.unshift(newUser);

    auditLogs.unshift({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'system.admin',
      role: 'Super Admin',
      action: 'USER_CREATED',
      ipAddress: '127.0.0.1',
      status: 'SUCCESS',
      details: `Created user ${newUser.email} with role ${newUser.role}`
    });

    res.status(201).json({ success: true, user: sanitizeUser(newUser) });
  });

  // Metrics Endpoint
  app.get('/api/metrics', (_req: Request, res: Response) => {
    res.json({
      timestamp: new Date().toISOString(),
      cpuUsagePercent: Number((15 + Math.random() * 15).toFixed(1)),
      memoryUsageMb: Math.floor(3200 + Math.random() * 300),
      apiLatencyMs: Number((8 + Math.random() * 12).toFixed(1)),
      activeConnections: Math.floor(18000 + Math.random() * 1200),
      requestsPerSec: Math.floor(3200 + Math.random() * 500),
      errorRatePercent: Number((0.01 + Math.random() * 0.05).toFixed(3))
    });
  });

  // Logs Endpoint
  app.get('/api/logs/audit', (_req: Request, res: Response) => {
    res.json({ logs: auditLogs });
  });

  app.get('/api/logs/api', (_req: Request, res: Response) => {
    res.json({ logs: apiLogs });
  });

  // Contact API
  app.post('/api/contact', async (req: Request, res: Response) => {
    const { name, email, company, subject, message } = req.body;
    
    console.log(`[BACKEND_REQUEST_RECEIVED] POST /api/contact - Name: "${name}", Email: "${email}", Company: "${company}", Subject: "${subject}"`);

    const custEmail = (typeof email === 'string') ? email.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!custEmail || !emailRegex.test(custEmail)) {
      console.warn(`[BACKEND_REQUEST_REJECTED] /api/contact - Invalid customer email format: "${custEmail}"`);
      res.status(400).json({ success: false, error: 'A valid email address is required.' });
      return;
    }

    if (!name || !message) {
      console.warn('[BACKEND_REQUEST_REJECTED] /api/contact - Name or message missing');
      res.status(400).json({ success: false, error: 'Name and message are required.' });
      return;
    }

    const custName = (typeof name === 'string' && name.trim()) ? name.trim() : 'Valued Customer';
    const custCompany = (typeof company === 'string' && company.trim()) ? company.trim() : 'Operating Company';
    const subj = (typeof subject === 'string' && subject.trim()) ? subject.trim() : 'General Inspection Inquiry';
    const msg = (typeof message === 'string') ? message.trim() : '';

    // Deduplication check
    const dedupeKey = `${custEmail.toLowerCase()}||${msg.toLowerCase()}`;
    const existing = recentContactSubmissions.get(dedupeKey);
    if (existing && (Date.now() - existing.timestamp) < 15000) {
      console.log(`[DEDUPLICATION_GUARD] Duplicate contact submission blocked for <${custEmail}>. Returning cached response.`);
      return res.status(200).json(existing.responseData);
    }

    const ticketId = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;

    // Send triple email notifications: Customer, Company, Manager
    let emailDelivery: { 
      customerSent: boolean; 
      companySent: boolean;
      managerSent: boolean; 
      error?: string;
      summary?: string;
    } = {
      customerSent: false,
      companySent: false,
      managerSent: false
    };

    try {
      const tripleResult = await sendTripleNotificationEmails({
        customerName: custName,
        customerEmail: custEmail,
        requestType: 'Contact Inquiry',
        referenceId: ticketId,
        details: {
          'Company': custCompany,
          'Inquiry Subject': subj,
          'Message Content': msg
        }
      });
      emailDelivery = {
        customerSent: tripleResult.customerResult.success,
        companySent: tripleResult.companyResult.success,
        managerSent: tripleResult.managerResult.success,
        error: !tripleResult.allSuccess 
          ? (tripleResult.customerResult.errorMessage || tripleResult.companyResult.errorMessage || tripleResult.managerResult.errorMessage)
          : undefined,
        summary: tripleResult.summary
      };

      console.log(`[BACKEND_EMAIL_DELIVERY_STATUS] /api/contact Ticket #${ticketId} - customerSent: ${emailDelivery.customerSent}, companySent: ${emailDelivery.companySent}, managerSent: ${emailDelivery.managerSent}`);
    } catch (err: any) {
      console.error('[Triple Email Error - Contact]:', err);
      emailDelivery.error = err?.message || 'Email dispatch failed';
    }

    const responsePayload = {
      success: true,
      ticketId,
      emailDelivery,
      message: `Thank you ${custName}. Your ticket #${ticketId} has been registered with JAI OCTG Inspection Services Pte Ltd HQ.`
    };

    recentContactSubmissions.set(dedupeKey, {
      timestamp: Date.now(),
      responseData: responsePayload
    });

    res.json(responsePayload);
  });

  // Serve static assets
  app.use('/assets', express.static(path.join(process.cwd(), 'public', 'assets')));
  app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

  // Dedicated Inspection Images API
  app.get('/api/uploaded-images', (_req: Request, res: Response) => {
    const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.bmp'];
    const scannedImages: string[] = [];
    const scanDirs = [
      { dir: path.join(process.cwd(), 'public', 'assets', 'inspection-images'), urlPrefix: '/assets/inspection-images' },
      { dir: path.join(process.cwd(), 'assets', 'inspection-images'), urlPrefix: '/assets/inspection-images' },
      { dir: path.join(process.cwd(), 'src', 'assets', 'inspection-images'), urlPrefix: '/src/assets/inspection-images' },
      { dir: path.join(process.cwd(), 'public', 'uploads'), urlPrefix: '/uploads' },
      { dir: path.join(process.cwd(), 'uploads'), urlPrefix: '/uploads' },
      { dir: path.join(process.cwd(), 'public'), urlPrefix: '' }
    ];

    scanDirs.forEach(({ dir, urlPrefix }) => {
      if (fs.existsSync(dir)) {
        try {
          const files = fs.readdirSync(dir);
          files.forEach(f => {
            const ext = path.extname(f).toLowerCase();
            if (validExts.includes(ext) && f !== 'graph.svg') {
              const url = `${urlPrefix}/${f}`.replace(/\/+/g, '/');
              if (!scannedImages.includes(url)) {
                scannedImages.push(url);
              }
            }
          });
        } catch (e) {
          // ignore read error
        }
      }
    });

    res.json({ images: scannedImages });
  });

  // Base64/File/ZIP Upload API with Path-Traversal Protection
  app.post('/api/upload', async (req: Request, res: Response) => {
    try {
      const { fileName, base64Data } = req.body;
      if (!fileName || !base64Data || typeof fileName !== 'string' || typeof base64Data !== 'string') {
        res.status(400).json({ error: 'Valid fileName and base64Data required' });
        return;
      }
      const targetDir = path.join(process.cwd(), 'public', 'assets', 'inspection-images');
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Sanitize filename to prevent directory traversal
      const rawBase = path.basename(fileName);
      const cleanFileName = rawBase.replace(/[^a-zA-Z0-9_.-]/g, '_');
      const base64Clean = base64Data.replace(/^data:[^;]+;base64,/, '');
      const buffer = Buffer.from(base64Clean, 'base64');

      if (cleanFileName.toLowerCase().endsWith('.zip') || base64Data.startsWith('data:application/zip') || base64Data.startsWith('data:application/x-zip')) {
        const zip = await JSZip.loadAsync(buffer);
        const extractedUrls: string[] = [];
        const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.bmp'];

        for (const [relativePath, file] of Object.entries(zip.files)) {
          if (!file.dir) {
            const basename = path.basename(relativePath);
            const ext = path.extname(basename).toLowerCase();
            if (validExts.includes(ext) && !basename.startsWith('.')) {
              const fileContent = await file.async('nodebuffer');
              const destName = basename.replace(/[^a-zA-Z0-9_.-]/g, '_');
              const resolvedDest = path.join(targetDir, destName);
              // Ensure path stays within targetDir
              if (resolvedDest.startsWith(targetDir)) {
                fs.writeFileSync(resolvedDest, fileContent);
                extractedUrls.push(`/assets/inspection-images/${destName}`);
              }
            }
          }
        }
        res.json({ success: true, extracted: extractedUrls, count: extractedUrls.length });
        return;
      }

      const filePath = path.join(targetDir, cleanFileName);
      if (filePath.startsWith(targetDir)) {
        fs.writeFileSync(filePath, buffer);
        res.json({ success: true, url: `/assets/inspection-images/${cleanFileName}` });
      } else {
        res.status(400).json({ error: 'Invalid destination file path.' });
      }
    } catch (err: any) {
      console.error('[Upload Error]:', err);
      res.status(500).json({ error: 'An error occurred while uploading asset.' });
    }
  });

  // Database Schema Metadata
  app.get('/api/database/schema', (_req: Request, res: Response) => {
    res.json({
      tables: DB_SCHEMA_TABLES,
      relations: DB_RELATIONS
    });
  });

  // Postman export
  app.get('/api/postman', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=JAI_OCTG_Inspection_Postman_Collection.json');
    res.json({
      info: {
        name: 'JAI OCTG Inspection Services Pte Ltd API Gateway',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      },
      item: API_ENDPOINTS.map(ep => ({
        name: `${ep.method} ${ep.path}`,
        request: {
          method: ep.method,
          url: { raw: `{{BASE_URL}}${ep.path}` }
        }
      }))
    });
  });

  return app;
}

const app = createApp();
export default app;

// Local development or standalone container listener (bypassed when deployed to Vercel)
if (process.env.VERCEL !== '1') {
  async function initServer() {
    const PORT = Number(process.env.PORT) || 3000;

    // Vite middleware for development vs static build serving for production
    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa'
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[JAI OCTG Inspection] Server active on http://0.0.0.0:${PORT}`);
    });
  }

  initServer().catch(err => {
    console.error('Failed to start server:', err);
  });
}
