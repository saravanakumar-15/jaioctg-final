import { QuotationData } from './quotation.js';

// ============================================================================
// SERVER EMAIL AUTOMATION SERVICE (server/email.ts)
// Microsoft Graph API with Microsoft Entra ID (OAuth 2.0 Client Credentials Flow)
// Strictly Server-Side Only. Mailbox passwords & SMTP credentials removed.
// ============================================================================

/**
 * Log environment variable status safely without leaking secrets
 */
export function logEmailEnvironmentStatus(): void {
  console.log('[EMAIL_ENV_CHECK] Safe Environment Variable Audit:');
  console.log(`  MICROSOFT_TENANT_ID: ${process.env.MICROSOFT_TENANT_ID ? 'configured' : 'MISSING'}`);
  console.log(`  MICROSOFT_CLIENT_ID: ${process.env.MICROSOFT_CLIENT_ID ? 'configured' : 'MISSING'}`);
  console.log(`  MICROSOFT_CLIENT_SECRET: ${process.env.MICROSOFT_CLIENT_SECRET ? 'configured' : 'MISSING'}`);
  console.log(`  MICROSOFT_SENDER_EMAIL: ${process.env.MICROSOFT_SENDER_EMAIL ? 'configured' : 'MISSING'}`);
  console.log(`  COMPANY_EMAIL: ${process.env.COMPANY_EMAIL ? 'configured' : 'using default'}`);
  console.log(`  MANAGER_EMAIL: ${process.env.MANAGER_EMAIL ? 'configured' : 'using default'}`);
}

/**
 * In-memory token cache for Microsoft Graph API access tokens
 */
interface TokenCache {
  accessToken: string;
  expiresAt: number; // Unix timestamp in milliseconds
}

let cachedToken: TokenCache | null = null;

/**
 * Resolves the company notifications email address strictly from server environment.
 */
export function getCompanyEmail(): string {
  return (
    process.env.COMPANY_EMAIL ||
    process.env.MICROSOFT_SENDER_EMAIL ||
    'jsankar@jaioctginspection.com'
  );
}

/**
 * Resolves the fixed manager notification email address strictly from server environment.
 * Never exposed to frontend or client browser.
 */
export function getManagerEmail(): string {
  return (
    process.env.MANAGER_EMAIL ||
    'sakesankar@yahoo.com.sg'
  );
}

export const FIXED_MANAGER_EMAIL = getManagerEmail();

/**
 * Resolves the sender email address from server environment variables
 */
export function getSenderEmail(): string {
  return (
    process.env.MICROSOFT_SENDER_EMAIL ||
    'jsankar@jaioctginspection.com'
  );
}

/**
 * Securely acquires an application access token from Microsoft Entra ID (Azure AD)
 * using the OAuth 2.0 client credentials grant.
 * 
 * Required Azure App Registration Permission:
 * Microsoft Graph -> Application permissions -> Mail.Send (with Admin Consent granted)
 */
async function getMicrosoftGraphAccessToken(): Promise<{ token: string | null; error?: string }> {
  const tenantId = process.env.MICROSOFT_TENANT_ID;
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    const missing = [
      !tenantId && 'MICROSOFT_TENANT_ID',
      !clientId && 'MICROSOFT_CLIENT_ID',
      !clientSecret && 'MICROSOFT_CLIENT_SECRET'
    ].filter(Boolean).join(', ');
    return { token: null, error: `Missing required environment variables: ${missing}` };
  }

  // Return cached token if still valid (with 60-second safety buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
    return { token: cachedToken.accessToken };
  }

  console.log('[MICROSOFT_GRAPH_TOKEN_REQUEST_STARTED] Requesting access token from Microsoft Entra ID...');

  try {
    const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('scope', 'https://graph.microsoft.com/.default');
    params.append('grant_type', 'client_credentials');

    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const errorDescription = (errBody as any)?.error_description || (errBody as any)?.error || `HTTP ${res.status}`;
      console.error(`[MICROSOFT_GRAPH_TOKEN_FAILED] Token acquisition failed (HTTP ${res.status}):`, errorDescription);
      return { token: null, error: `Entra ID Token Error (${res.status}): ${errorDescription}` };
    }

    const data = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!data.access_token) {
      console.error('[MICROSOFT_GRAPH_TOKEN_FAILED] No access_token returned by Microsoft Entra ID');
      return { token: null, error: 'No access_token in token endpoint response' };
    }

    const expiresIn = Number(data.expires_in) || 3600;
    cachedToken = {
      accessToken: data.access_token,
      expiresAt: Date.now() + expiresIn * 1000
    };

    console.log(`[MICROSOFT_GRAPH_TOKEN_SUCCESS] Acquired Microsoft Graph access token. Expires in ${expiresIn}s.`);
    return { token: data.access_token };
  } catch (err: any) {
    const message = err?.message || 'Network error connecting to Microsoft Entra ID';
    console.error('[MICROSOFT_GRAPH_TOKEN_FAILED] Exception during token request:', message);
    return { token: null, error: message };
  }
}

/**
 * Microsoft Graph Email Attachment Interface
 */
export interface GraphAttachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

/**
 * Microsoft Graph Send Mail Options
 */
export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: GraphAttachment[];
  referenceId?: string;
}

/**
 * Structured result of an email send operation
 */
export interface EmailSendResult {
  success: boolean;
  httpStatus?: number;
  graphErrorCode?: string;
  errorMessage?: string;
  recipient: string;
  referenceId?: string;
}

/**
 * Structured result of a 3-way email broadcast (Customer, Company, Manager)
 */
export interface TripleEmailResult {
  customerResult: EmailSendResult;
  companyResult: EmailSendResult;
  managerResult: EmailSendResult;
  allSuccess: boolean;
  summary: string;
}

/**
 * Sends an email via Microsoft Graph API (/v1.0/users/{sender}/sendMail)
 */
export async function sendMicrosoftGraphMail(options: SendMailOptions): Promise<EmailSendResult> {
  const { to, subject, html, attachments, referenceId } = options;
  const senderEmail = getSenderEmail();
  const refTag = referenceId ? `[Ref: ${referenceId}]` : '';

  console.log(`[EMAIL_AUTOMATION_STARTED] ${refTag} Starting email dispatch to <${to}> via Microsoft Graph API`);

  // 1. Acquire Access Token
  const tokenResult = await getMicrosoftGraphAccessToken();
  if (!tokenResult.token) {
    const errMsg = tokenResult.error || 'Failed to acquire Microsoft Graph access token';
    console.error(`[EMAIL_SEND_FAILED] ${refTag} Destination: <${to}> - Reason: ${errMsg}`);
    return {
      success: false,
      recipient: to,
      referenceId,
      errorMessage: errMsg
    };
  }

  // 2. Construct Microsoft Graph SendMail Payload
  console.log(`[EMAIL_PAYLOAD_CREATED] ${refTag} Assembling JSON payload for <${to}> (Subject: "${subject}")`);

  const messagePayload: any = {
    subject,
    body: {
      contentType: 'HTML',
      content: html
    },
    toRecipients: [
      {
        emailAddress: {
          address: to
        }
      }
    ]
  };

  if (attachments && attachments.length > 0) {
    messagePayload.attachments = attachments
      .filter((att) => att && Buffer.isBuffer(att.content) && att.content.length > 0)
      .map((att) => ({
        '@odata.type': '#microsoft.graph.fileAttachment',
        name: att.filename,
        contentType: att.contentType || 'application/pdf',
        contentBytes: att.content.toString('base64')
      }));
    console.log(`[EMAIL_PAYLOAD_CREATED] ${refTag} Attached ${messagePayload.attachments.length} file(s): ${messagePayload.attachments.map((a: any) => a.name).join(', ')}`);
  }

  const requestBody = {
    message: messagePayload,
    saveToSentItems: true
  };

  // 3. Dispatch to Microsoft Graph API
  const graphEndpoint = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(senderEmail)}/sendMail`;
  console.log(`[EMAIL_SEND_STARTED] ${refTag} Dispatching POST request to Microsoft Graph endpoint: /v1.0/users/${senderEmail}/sendMail`);

  try {
    const res = await fetch(graphEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenResult.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    // 202 Accepted or 200 OK confirms email accepted for delivery
    if (res.status === 202 || res.status === 200 || res.ok) {
      console.log(`[EMAIL_SEND_SUCCESS] ${refTag} Email successfully accepted by Microsoft Graph (HTTP ${res.status}) for delivery to <${to}>.`);
      return {
        success: true,
        httpStatus: res.status,
        recipient: to,
        referenceId
      };
    }

    // Handle Graph API Error Response
    const errBody = await res.json().catch(() => ({}));
    const graphError = (errBody as any)?.error;
    const errorCode = graphError?.code || 'UnknownGraphError';
    const errorMsg = graphError?.message || `HTTP ${res.status}`;

    console.error(`[EMAIL_SEND_FAILED] ${refTag} Destination: <${to}> - Microsoft Graph returned HTTP ${res.status} [${errorCode}]: ${errorMsg}`);
    
    // Provide explicit admin consent / permission diagnostic guidance
    if (res.status === 403 || errorCode === 'ErrorAccessDenied' || errorCode === 'Authorization_RequestDenied') {
      console.error(`[AZURE_ENTRA_ACTION_REQUIRED] Azure App Registration requires 'Mail.Send' Application Permission with 'Grant admin consent' in Azure Portal (App ID: ${process.env.MICROSOFT_CLIENT_ID}). Sender: ${senderEmail}`);
    }

    return {
      success: false,
      httpStatus: res.status,
      graphErrorCode: errorCode,
      errorMessage: `Microsoft Graph returned HTTP ${res.status} [${errorCode}]: ${errorMsg}`,
      recipient: to,
      referenceId
    };
  } catch (err: any) {
    const msg = err?.message || 'Network error communicating with Microsoft Graph';
    console.error(`[EMAIL_SEND_FAILED] ${refTag} Destination: <${to}> - Exception: ${msg}`);
    return {
      success: false,
      errorMessage: msg,
      recipient: to,
      referenceId
    };
  }
}

export interface EmailRequestData {
  customerName: string;
  customerEmail: string;
  requestType: 'Quotation Request' | 'Contact Inquiry';
  referenceId: string;
  details: Record<string, string | number | undefined>;
}

// ============================================================================
// 1. QUOTATION EMAILS WITH ATTACHED PDF
// Strictly NO amount / price / financial information in emails or attachments.
// ============================================================================

/**
 * 1. Customer Quotation Email
 * - Thanks customer for submitting request
 * - Includes full submitted details
 * - Attaches quotation PDF
 * - NEVER exposes internal manager or company notification addresses
 */
export async function sendCustomerQuotationEmail(
  data: QuotationData,
  pdfBuffer: Buffer
): Promise<EmailSendResult> {
  const pdfFilename = `JAI-OCTG-Quotation-${data.quotationNumber}.pdf`;
  const subject = `JAI OCTG – Quotation ${data.quotationNumber}`;

  const servicesText = data.services && data.services.length > 0
    ? data.services.map(s => `• ${s.description} (${s.standard})`).join('\n')
    : '• Standard OCTG Tubular Inspection';

  const textBody = `Dear ${data.customerName || 'Customer'},

Thank you for contacting JAI OCTG Inspection Services Pte Ltd.

Your quotation request has been successfully received.

Quotation Number: ${data.quotationNumber}
Date: ${data.quotationDate}

--- Submitted Scope Summary ---
Customer Name: ${data.customerName || 'N/A'}
Company Name: ${data.companyName || 'N/A'}
Phone: ${data.phone || 'N/A'}
Operating Location / Yard: ${data.address || 'Singapore Base Yard'}
Pipe Specifications: ${data.pipeSpecs || 'Standard Specification'}
Estimated Joints: ${data.estimatedJoints || 'Standard Batch'} Joints
Urgency: ${data.urgency || 'Standard'}
${data.additionalNotes ? `Additional Notes: ${data.additionalNotes}\n` : ''}
Services Requested:
${servicesText}

Please find the official quotation document attached for your reference.

Our technical team will review the submitted inspection requirements and get back to you with the next steps.

Regards,
JAI OCTG Inspection Services Pte Ltd
40 Upper Dickson Rd, Singapore 207498
Phone: +65 9697 4165
Website: https://www.jaioctginspection.com`;

  const servicesHtml = data.services && data.services.length > 0
    ? data.services.map(s => `<li style="margin-bottom: 4px;"><strong>${s.description}</strong> <span style="color: #64748b; font-size: 11px;">[${s.standard}]</span></li>`).join('')
    : '<li>Standard OCTG Tubular Inspection</li>';

  const htmlBody = `
    <div style="font-family: Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #2154A5; padding: 22px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 19px; font-weight: bold; letter-spacing: 0.5px;">JAI OCTG INSPECTION SERVICES PTE LTD</h1>
        <p style="color: #cbd5e1; margin: 4px 0 0 0; font-size: 12px;">Precision in Inspection. Confidence in Quality.</p>
      </div>
      
      <div style="padding: 26px;">
        <p style="font-size: 15px; color: #0f172a; margin-top: 0;">Dear ${data.customerName || 'Customer'},</p>
        
        <p style="font-size: 14px; color: #334155;">Thank you for contacting JAI OCTG Inspection Services Pte Ltd.</p>
        <p style="font-size: 14px; color: #334155;">Your quotation request has been successfully received and registered.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #2154A5; border-radius: 6px; padding: 14px 18px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #0f172a;"><strong>Quotation Number:</strong> <span style="color: #2154A5; font-weight: bold;">${data.quotationNumber}</span></p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Quotation Date: ${data.quotationDate}</p>
        </div>

        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 18px 0;">
          <h4 style="margin: 0 0 10px 0; font-size: 12px; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #f1f5f9; pb-2;">Submitted Details</h4>
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; color: #64748b; width: 140px; font-weight: 500;">Customer Name:</td>
              <td style="padding: 4px 0; color: #0f172a; font-weight: bold;">${data.customerName || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Company Name:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.companyName || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Phone:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.phone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Location / Yard:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.address || 'Singapore Base Yard'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Pipe Specifications:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.pipeSpecs || 'Standard Specification'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Estimated Quantity:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.estimatedJoints || '500'} Joints</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Delivery Urgency:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.urgency || 'Standard'}</td>
            </tr>
            ${data.additionalNotes ? `
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500; vertical-align: top;">Additional Notes:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.additionalNotes}</td>
            </tr>` : ''}
          </table>

          <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #e2e8f0;">
            <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b; font-weight: 600;">Selected Services:</p>
            <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #1e293b;">
              ${servicesHtml}
            </ul>
          </div>
        </div>
        
        <p style="font-size: 14px; color: #334155;">Please find the official quotation document attached for your reference.</p>
        <p style="font-size: 14px; color: #334155;">Our team will review the submitted inspection requirements and get back to you with the next steps.</p>
        
        <p style="font-size: 14px; color: #0f172a; margin-bottom: 0; margin-top: 24px;">
          Regards,<br/>
          <strong>JAI OCTG Inspection Services Pte Ltd</strong>
        </p>
      </div>

      <div style="background-color: #f1f5f9; padding: 14px 24px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0;">40 Upper Dickson Rd, Singapore 207498 &bull; Phone: +65 9697 4165 &bull; <a href="https://www.jaioctginspection.com" style="color: #2154A5; text-decoration: none;">www.jaioctginspection.com</a></p>
      </div>
    </div>
  `;

  return await sendMicrosoftGraphMail({
    to: data.email,
    subject,
    text: textBody,
    html: htmlBody,
    referenceId: data.quotationNumber,
    attachments: [
      {
        filename: pdfFilename,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  });
}

/**
 * 2. Company Quotation Email (Company internal record)
 * - Sent to COMPANY_EMAIL
 * - Includes customer info, phone, email, full form inputs, submission timestamp
 * - Attaches quotation PDF
 */
export async function sendCompanyQuotationEmail(
  data: QuotationData,
  pdfBuffer: Buffer
): Promise<EmailSendResult> {
  const companyEmail = getCompanyEmail();
  const pdfFilename = `JAI-OCTG-Quotation-${data.quotationNumber}.pdf`;
  const subject = `[Company Record] New Quotation Request – ${data.quotationNumber} (${data.companyName || data.customerName})`;
  const timestamp = data.submissionTimestamp || new Date().toISOString();

  const servicesText = data.services && data.services.length > 0
    ? data.services.map(s => `• ${s.description} [${s.standard}]`).join('\n')
    : '• Standard Inspection';

  const textBody = `[Company Quotation Record]

A new quotation request has been submitted by a customer.

Quotation Number: ${data.quotationNumber}
Submission Timestamp: ${timestamp}

Customer Name: ${data.customerName || 'N/A'}
Company Name: ${data.companyName || 'N/A'}
Customer Email: ${data.email || 'N/A'}
Customer Phone: ${data.phone || 'N/A'}
Operating Address / Yard: ${data.address || 'Singapore Base Yard'}
Pipe Specifications: ${data.pipeSpecs || 'Standard Specification'}
Estimated Joints: ${data.estimatedJoints || '500'}
Urgency / Timeline: ${data.urgency || 'Standard'}
${data.additionalNotes ? `Additional Notes: ${data.additionalNotes}\n` : ''}
Services:
${servicesText}

Quotation PDF is attached for company records.

JAI OCTG Operations System`;

  const servicesHtml = data.services && data.services.length > 0
    ? data.services.map(s => `<li style="margin-bottom: 4px;"><strong>${s.description}</strong> <span style="color: #64748b; font-size: 11px;">[${s.standard}]</span></li>`).join('')
    : '<li>Standard OCTG Tubular Inspection</li>';

  const htmlBody = `
    <div style="font-family: Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #1e293b; padding: 20px; text-align: left;">
        <span style="background-color: #0284c7; color: #ffffff; font-size: 10px; font-weight: bold; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">Company Record</span>
        <h2 style="color: #ffffff; margin: 8px 0 0 0; font-size: 17px; font-weight: bold;">New Quotation Request Registered</h2>
      </div>
      
      <div style="padding: 24px;">
        <p style="font-size: 14px; color: #334155; margin-top: 0;">A new customer quotation request has been recorded into the system.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #0f172a;"><strong>Quotation Number:</strong> <span style="color: #2154A5; font-weight: bold;">${data.quotationNumber}</span></p>
          <p style="margin: 0 0 12px 0; font-size: 12px; color: #64748b;"><strong>Submission Time:</strong> ${timestamp}</p>
          
          <h4 style="margin: 12px 0 6px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Customer Submission Details:</h4>
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; color: #64748b; width: 140px; font-weight: 500;">Customer Name:</td>
              <td style="padding: 4px 0; color: #0f172a; font-weight: bold;">${data.customerName || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Company Name:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.companyName || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Customer Email:</td>
              <td style="padding: 4px 0; color: #0f172a;"><a href="mailto:${data.email}" style="color: #2154A5; font-weight: bold;">${data.email || 'N/A'}</a></td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Phone:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.phone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Operating Yard / Location:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.address || 'Singapore Base Yard'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Pipe Specifications:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.pipeSpecs || 'Standard Specification'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Estimated Joints:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.estimatedJoints || '500'} Joints</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Urgency:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.urgency || 'Standard'}</td>
            </tr>
            ${data.additionalNotes ? `
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500; vertical-align: top;">Additional Notes:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.additionalNotes}</td>
            </tr>` : ''}
          </table>

          <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #cbd5e1;">
            <p style="margin: 0 0 6px 0; font-size: 12px; color: #475569; font-weight: 600;">Selected Services:</p>
            <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #1e293b;">
              ${servicesHtml}
            </ul>
          </div>
        </div>
        
        <p style="font-size: 13px; color: #64748b;">The generated quotation PDF is attached for company records.</p>
      </div>
    </div>
  `;

  return await sendMicrosoftGraphMail({
    to: companyEmail,
    subject,
    text: textBody,
    html: htmlBody,
    referenceId: data.quotationNumber,
    attachments: [
      {
        filename: pdfFilename,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  });
}

/**
 * 3. Manager Quotation Email (Operational review alert)
 * - Sent to MANAGER_EMAIL
 * - Includes customer info, phone, email, full form inputs, submission timestamp
 * - Attaches quotation PDF
 */
export async function sendManagerQuotationEmail(
  data: QuotationData,
  pdfBuffer: Buffer
): Promise<EmailSendResult> {
  const managerEmail = getManagerEmail();
  const pdfFilename = `JAI-OCTG-Quotation-${data.quotationNumber}.pdf`;
  const subject = `[Manager Alert] New Quotation Request – ${data.quotationNumber} (${data.companyName || data.customerName})`;
  const timestamp = data.submissionTimestamp || new Date().toISOString();

  const servicesText = data.services && data.services.length > 0
    ? data.services.map(s => `• ${s.description} [${s.standard}]`).join('\n')
    : '• Standard Inspection';

  const textBody = `Dear Manager,

A new quotation request has been submitted and requires operational review.

Quotation Number: ${data.quotationNumber}
Submission Timestamp: ${timestamp}

Customer Details:
Customer Name: ${data.customerName || 'N/A'}
Company Name: ${data.companyName || 'N/A'}
Customer Email: ${data.email || 'N/A'}
Customer Phone: ${data.phone || 'N/A'}
Operating Address / Yard: ${data.address || 'Singapore Base Yard'}
Pipe Specifications: ${data.pipeSpecs || 'Standard Specification'}
Estimated Joints: ${data.estimatedJoints || '500'}
Urgency / Timeline: ${data.urgency || 'Standard'}
${data.additionalNotes ? `Additional Notes: ${data.additionalNotes}\n` : ''}
Services:
${servicesText}

Please review the attached quotation document and coordinate inspector assignment.

Regards,
JAI OCTG Inspection Services Pte Ltd`;

  const servicesHtml = data.services && data.services.length > 0
    ? data.services.map(s => `<li style="margin-bottom: 4px;"><strong>${s.description}</strong> <span style="color: #64748b; font-size: 11px;">[${s.standard}]</span></li>`).join('')
    : '<li>Standard OCTG Tubular Inspection</li>';

  const htmlBody = `
    <div style="font-family: Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #0f172a; padding: 20px; text-align: left;">
        <span style="background-color: #f59e0b; color: #0f172a; font-size: 10px; font-weight: bold; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">Manager Action Required</span>
        <h2 style="color: #ffffff; margin: 8px 0 0 0; font-size: 17px; font-weight: bold;">New Quotation Request Submitted</h2>
      </div>
      
      <div style="padding: 24px;">
        <p style="font-size: 14px; color: #334155; margin-top: 0;">Dear Manager,</p>
        <p style="font-size: 14px; color: #334155;">A new customer quotation request has been submitted for operational review.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #0f172a;"><strong>Quotation Number:</strong> <span style="color: #2154A5; font-weight: bold;">${data.quotationNumber}</span></p>
          <p style="margin: 0 0 12px 0; font-size: 12px; color: #64748b;"><strong>Submission Time:</strong> ${timestamp}</p>
          
          <h4 style="margin: 12px 0 6px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Customer Submission Details:</h4>
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; color: #64748b; width: 140px; font-weight: 500;">Customer Name:</td>
              <td style="padding: 4px 0; color: #0f172a; font-weight: bold;">${data.customerName || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Company Name:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.companyName || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Email:</td>
              <td style="padding: 4px 0; color: #0f172a;"><a href="mailto:${data.email}" style="color: #2154A5; font-weight: bold;">${data.email || 'N/A'}</a></td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Phone:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.phone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Address / Yard:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.address || 'Singapore Base Yard'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Pipe Specifications:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.pipeSpecs || 'Standard Specification'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Estimated Quantity:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.estimatedJoints || '500'} Joints</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Urgency:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.urgency || 'Standard'}</td>
            </tr>
            ${data.additionalNotes ? `
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500; vertical-align: top;">Additional Notes:</td>
              <td style="padding: 4px 0; color: #0f172a;">${data.additionalNotes}</td>
            </tr>` : ''}
          </table>

          <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #cbd5e1;">
            <p style="margin: 0 0 6px 0; font-size: 12px; color: #475569; font-weight: 600;">Selected Services:</p>
            <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #1e293b;">
              ${servicesHtml}
            </ul>
          </div>
        </div>
        
        <p style="font-size: 14px; color: #334155;">Inspection requirements have been included in the attached quotation PDF.</p>
        <p style="font-size: 14px; color: #334155;">Please review the attached document and assign inspector schedules.</p>
        
        <p style="font-size: 14px; color: #0f172a; margin-bottom: 0; margin-top: 20px;">
          Regards,<br/>
          <strong>JAI OCTG Inspection Services Pte Ltd</strong>
        </p>
      </div>
    </div>
  `;

  return await sendMicrosoftGraphMail({
    to: managerEmail,
    subject,
    text: textBody,
    html: htmlBody,
    referenceId: data.quotationNumber,
    attachments: [
      {
        filename: pdfFilename,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  });
}

/**
 * Sends quotation emails to all 3 destinations:
 * 1. Customer Email
 * 2. Company Email
 * 3. Manager Email
 */
export async function sendTripleQuotationEmails(
  data: QuotationData,
  pdfBuffer: Buffer
): Promise<TripleEmailResult> {
  console.log(`[TRIPLE_EMAIL_AUTOMATION_TRIGGERED] Dispatching quotation ${data.quotationNumber} to Customer (${data.email}), Company (${getCompanyEmail()}), and Manager (${getManagerEmail()})`);

  const [customerResult, companyResult, managerResult] = await Promise.all([
    sendCustomerQuotationEmail(data, pdfBuffer),
    sendCompanyQuotationEmail(data, pdfBuffer),
    sendManagerQuotationEmail(data, pdfBuffer)
  ]);

  const allSuccess = customerResult.success && companyResult.success && managerResult.success;
  const summary = `Customer: ${customerResult.success ? 'Delivered' : 'Failed'}, Company: ${companyResult.success ? 'Delivered' : 'Failed'}, Manager: ${managerResult.success ? 'Delivered' : 'Failed'}`;

  console.log(`[TRIPLE_EMAIL_AUTOMATION_COMPLETED] Quotation ${data.quotationNumber} results: ${summary}`);

  return {
    customerResult,
    companyResult,
    managerResult,
    allSuccess,
    summary
  };
}

// Backward compatibility alias
export const sendDualQuotationEmails = async (data: QuotationData, pdfBuffer: Buffer) => {
  const result = await sendTripleQuotationEmails(data, pdfBuffer);
  return {
    customerResult: result.customerResult,
    managerResult: result.managerResult
  };
};

// ============================================================================
// 2. CONTACT FORM INQUIRY EMAILS
// ============================================================================

export function renderCustomerEmailContent(data: EmailRequestData): { subject: string; text: string; html: string } {
  const { customerName, referenceId, requestType, details } = data;
  const subject = `Confirmation: ${requestType} Received [Ref: ${referenceId}]`;

  const text = `Hi ${customerName},

Thank you for contacting JAI OCTG Inspection Services Pte Ltd.
We have received your request successfully.

Reference ID: ${referenceId}
Request Type: ${requestType}

Our team will review your request and get back to you shortly.

--- Summary of Submitted Request ---
${Object.entries(details)
  .filter(([_, v]) => v !== undefined && v !== '')
  .map(([k, v]) => `${k}: ${v}`)
  .join('\n')}

For urgent inquiries, please contact us at +65 9697 4165.

Regards,
JAI OCTG Inspection Services Pte Ltd
40 Upper Dickson Rd, Singapore 207498
Phone: +65 9697 4165
Website: https://www.jaioctginspection.com`;

  const html = `
    <div style="font-family: Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #2154A5; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold;">JAI OCTG INSPECTION SERVICES PTE LTD</h1>
        <p style="color: #cbd5e1; margin: 6px 0 0 0; font-size: 12px;">Precision in Inspection. Confidence in Quality.</p>
      </div>
      
      <div style="padding: 28px;">
        <p style="font-size: 16px; font-weight: 600; color: #0f172a; margin-top: 0;">Hi ${customerName},</p>
        <p style="font-size: 14px; color: #334155;">Thank you for contacting us. We have received your request successfully.</p>
        <p style="font-size: 14px; color: #334155;">Our team will review your request and get back to you shortly.</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #2154A5; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #0f172a; font-weight: bold;">Summary of Submitted Request</h3>
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; color: #64748b; width: 140px; font-weight: 500;">Reference ID:</td>
              <td style="padding: 4px 0; color: #0f172a; font-weight: bold;">${referenceId}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Request Type:</td>
              <td style="padding: 4px 0; color: #0f172a;">${requestType}</td>
            </tr>
            ${Object.entries(details)
              .filter(([_, v]) => v !== undefined && v !== '')
              .map(
                ([k, v]) => `
                <tr>
                  <td style="padding: 4px 0; color: #64748b; font-weight: 500;">${k}:</td>
                  <td style="padding: 4px 0; color: #0f172a;">${v}</td>
                </tr>
              `
              )
              .join('')}
          </table>
        </div>

        <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">
          If you have urgent inquiries, feel free to contact us at <strong>+65 9697 4165</strong>.
        </p>
      </div>

      <div style="background-color: #f1f5f9; padding: 16px 28px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0;">JAI OCTG Inspection Services Pte Ltd &bull; 40 Upper Dickson Rd, Singapore 207498</p>
        <p style="margin: 4px 0 0 0;"><a href="https://www.jaioctginspection.com" style="color: #2154A5; text-decoration: none;">www.jaioctginspection.com</a></p>
      </div>
    </div>
  `;

  return { subject, text, html };
}

export async function sendCustomerConfirmationEmail(data: EmailRequestData): Promise<EmailSendResult> {
  const { subject, text, html } = renderCustomerEmailContent(data);

  return await sendMicrosoftGraphMail({
    to: data.customerEmail,
    subject,
    text,
    html,
    referenceId: data.referenceId
  });
}

export function renderCompanyEmailContent(data: EmailRequestData): { subject: string; text: string; html: string } {
  const { customerName, customerEmail, referenceId, requestType, details } = data;
  const subject = `[Company Record] New Contact Inquiry - [${customerName}] - ${referenceId}`;
  const timestamp = new Date().toISOString();

  const text = `[Company Contact Record]

Customer Name: ${customerName}
Customer Email: ${customerEmail}
Reference ID: ${referenceId}
Request Type: ${requestType}
Timestamp: ${timestamp}

--- Full Request Details ---
${Object.entries(details)
  .filter(([_, v]) => v !== undefined && v !== '')
  .map(([k, v]) => `${k}: ${v}`)
  .join('\n')}

JAI OCTG Operations System`;

  const html = `
    <div style="font-family: Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6; border: 1px solid #cbd5e1; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #1e293b; padding: 20px; text-align: left;">
        <span style="background-color: #0284c7; color: #ffffff; font-size: 10px; font-weight: bold; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">Company Record</span>
        <h2 style="color: #ffffff; margin: 8px 0 0 0; font-size: 18px; font-weight: bold;">New Customer Inquiry Registered</h2>
      </div>
      
      <div style="padding: 24px;">
        <p style="font-size: 14px; margin: 4px 0;"><strong>Customer Name:</strong> ${customerName}</p>
        <p style="font-size: 14px; margin: 4px 0;"><strong>Customer Email:</strong> <a href="mailto:${customerEmail}" style="color: #2154A5;">${customerEmail}</a></p>
        <p style="font-size: 12px; color: #64748b; margin: 4px 0;"><strong>Timestamp:</strong> ${timestamp}</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <h3 style="margin: 0 0 10px 0; font-size: 13px; color: #475569; text-transform: uppercase;">Inquiry Details</h3>
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; color: #64748b; width: 140px; font-weight: 500;">Reference ID:</td>
              <td style="padding: 5px 0; color: #0f172a; font-weight: bold;">${referenceId}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748b; font-weight: 500;">Request Type:</td>
              <td style="padding: 5px 0; color: #0f172a;">${requestType}</td>
            </tr>
            ${Object.entries(details)
              .filter(([_, v]) => v !== undefined && v !== '')
              .map(
                ([k, v]) => `
                <tr>
                  <td style="padding: 5px 0; color: #64748b; font-weight: 500;">${k}:</td>
                  <td style="padding: 5px 0; color: #0f172a; font-weight: 500;">${v}</td>
                </tr>
              `
              )
              .join('')}
          </table>
        </div>
      </div>
    </div>
  `;

  return { subject, text, html };
}

export async function sendCompanyNotificationEmail(data: EmailRequestData): Promise<EmailSendResult> {
  const companyEmail = getCompanyEmail();
  const { subject, text, html } = renderCompanyEmailContent(data);

  return await sendMicrosoftGraphMail({
    to: companyEmail,
    subject,
    text,
    html,
    referenceId: data.referenceId
  });
}

export function renderManagerEmailContent(data: EmailRequestData): { subject: string; text: string; html: string } {
  const { customerName, customerEmail, referenceId, requestType, details } = data;
  const subject = `[Manager Alert] New Customer Request - [${customerName}] - ${requestType}`;
  const timestamp = new Date().toISOString();

  const text = `New customer request received.

Customer Name: ${customerName}
Customer Email: ${customerEmail}

Please review the submitted request.

--- Full Request Details ---
Reference ID: ${referenceId}
Request Type: ${requestType}
Timestamp: ${timestamp}
Customer Name: ${customerName}
Customer Email: ${customerEmail}
${Object.entries(details)
  .filter(([_, v]) => v !== undefined && v !== '')
  .map(([k, v]) => `${k}: ${v}`)
  .join('\n')}

Action Required:
Please review and assign this inquiry to the duty operations manager.`;

  const html = `
    <div style="font-family: Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6; border: 1px solid #cbd5e1; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #0f172a; padding: 20px; text-align: left;">
        <span style="background-color: #f59e0b; color: #0f172a; font-size: 10px; font-weight: bold; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">Operations Alert</span>
        <h2 style="color: #ffffff; margin: 8px 0 0 0; font-size: 18px; font-weight: bold;">New Customer Inquiry Received</h2>
      </div>
      
      <div style="padding: 24px;">
        <p style="font-size: 14px; margin: 4px 0;"><strong>Customer Name:</strong> ${customerName}</p>
        <p style="font-size: 14px; margin: 4px 0;"><strong>Customer Email:</strong> <a href="mailto:${customerEmail}" style="color: #2154A5;">${customerEmail}</a></p>
        <p style="font-size: 12px; color: #64748b; margin: 4px 0;"><strong>Timestamp:</strong> ${timestamp}</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <h3 style="margin: 0 0 10px 0; font-size: 13px; color: #475569; text-transform: uppercase;">Inquiry Details</h3>
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; color: #64748b; width: 140px; font-weight: 500;">Reference ID:</td>
              <td style="padding: 5px 0; color: #0f172a; font-weight: bold;">${referenceId}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748b; font-weight: 500;">Request Type:</td>
              <td style="padding: 5px 0; color: #0f172a;">${requestType}</td>
            </tr>
            ${Object.entries(details)
              .filter(([_, v]) => v !== undefined && v !== '')
              .map(
                ([k, v]) => `
                <tr>
                  <td style="padding: 5px 0; color: #64748b; font-weight: 500;">${k}:</td>
                  <td style="padding: 5px 0; color: #0f172a; font-weight: 500;">${v}</td>
                </tr>
              `
              )
              .join('')}
          </table>
        </div>
      </div>
    </div>
  `;

  return { subject, text, html };
}

export async function sendManagerNotificationEmail(data: EmailRequestData): Promise<EmailSendResult> {
  const managerEmail = getManagerEmail();
  const { subject, text, html } = renderManagerEmailContent(data);

  return await sendMicrosoftGraphMail({
    to: managerEmail,
    subject,
    text,
    html,
    referenceId: data.referenceId
  });
}

/**
 * Sends contact inquiry notifications to:
 * 1. Customer Email
 * 2. Company Email
 * 3. Manager Email
 */
export async function sendTripleNotificationEmails(
  data: EmailRequestData
): Promise<TripleEmailResult> {
  console.log(`[TRIPLE_CONTACT_AUTOMATION_TRIGGERED] Processing inquiry ${data.referenceId} for Customer (${data.customerEmail}), Company (${getCompanyEmail()}), and Manager (${getManagerEmail()})`);

  const [customerResult, companyResult, managerResult] = await Promise.all([
    sendCustomerConfirmationEmail(data),
    sendCompanyNotificationEmail(data),
    sendManagerNotificationEmail(data)
  ]);

  const allSuccess = customerResult.success && companyResult.success && managerResult.success;
  const summary = `Customer: ${customerResult.success ? 'Delivered' : 'Failed'}, Company: ${companyResult.success ? 'Delivered' : 'Failed'}, Manager: ${managerResult.success ? 'Delivered' : 'Failed'}`;

  console.log(`[TRIPLE_CONTACT_AUTOMATION_COMPLETED] Inquiry ${data.referenceId} results: ${summary}`);

  return {
    customerResult,
    companyResult,
    managerResult,
    allSuccess,
    summary
  };
}

// Backward compatibility alias
export const sendDualNotificationEmails = async (data: EmailRequestData) => {
  const result = await sendTripleNotificationEmails(data);
  return {
    customerResult: result.customerResult,
    managerResult: result.managerResult
  };
};
