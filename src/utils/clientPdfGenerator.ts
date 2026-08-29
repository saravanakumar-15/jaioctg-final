// src/utils/clientPdfGenerator.ts
// Generates identical professional corporate A4 quotation PDF on the client side
// Used when hosted as a static SPA (e.g. Netlify) or when backend /api/quotes/:id/pdf is unavailable.
import { jsPDF } from 'jspdf';

export interface ClientQuotationServiceItem {
  sNo: number;
  description: string;
  standard: string;
  quantity: string;
}

export interface ClientQuotationData {
  quotationNumber: string;
  quotationDate?: string;
  customerName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  services?: string[] | ClientQuotationServiceItem[];
  pipeSpecs?: string;
  estimatedJoints?: number | string;
  status?: string;
}

/**
 * Resolved logo image structure
 */
interface ResolvedLogoImage {
  dataUrl: string;
  format: 'PNG';
  width: number;
  height: number;
  aspectRatio: number;
}

/**
 * Loads /logo.svg directly as the single source of truth for the corporate logo in the PDF.
 * Ensures /logo.svg is loaded and rasterized via Canvas at high resolution before PDF generation starts.
 */
async function loadLogoSvgImage(): Promise<ResolvedLogoImage | null> {
  const LOGO_SRC = '/logo.svg';
  const SVG_DEFAULT_WIDTH = 240;
  const SVG_DEFAULT_HEIGHT = 200;
  const ASPECT_RATIO = SVG_DEFAULT_WIDTH / SVG_DEFAULT_HEIGHT; // 1.2

  if (typeof window === 'undefined') {
    return null;
  }

  // 1. First, check if <img src="/logo.svg"> is already present and loaded in the DOM
  if (typeof document !== 'undefined') {
    const domImg = document.querySelector('img[src="/logo.svg"]') as HTMLImageElement | null;
    if (domImg) {
      try {
        if (!domImg.complete || domImg.naturalWidth === 0) {
          if ('decode' in domImg) {
            try {
              await domImg.decode();
            } catch {
              await new Promise<void>((resolve) => {
                domImg.onload = () => resolve();
                domImg.onerror = () => resolve();
                setTimeout(resolve, 300);
              });
            }
          }
        }

        const natW = domImg.naturalWidth || SVG_DEFAULT_WIDTH;
        const natH = domImg.naturalHeight || SVG_DEFAULT_HEIGHT;
        const canvas = document.createElement('canvas');
        canvas.width = natW * 3;
        canvas.height = natH * 3;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(domImg, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/png');
          if (dataUrl && dataUrl.length > 500) {
            return {
              dataUrl,
              format: 'PNG',
              width: natW,
              height: natH,
              aspectRatio: natW / natH
            };
          }
        }
      } catch (domErr) {
        console.warn('[Client PDF Generator] DOM logo capture warning:', domErr);
      }
    }
  }

  // 2. Fetch /logo.svg directly, ensuring it is fully loaded and rasterized
  try {
    const res = await fetch(LOGO_SRC);
    if (res.ok) {
      const svgText = await res.text();
      if (svgText && svgText.includes('<svg')) {
        // Create clean SVG data URL
        const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
        const img = new Image();
        img.crossOrigin = 'anonymous';

        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = svgDataUrl;
          setTimeout(resolve, 1500);
        });

        if ('decode' in img) {
          try {
            await img.decode();
          } catch {}
        }

        const width = SVG_DEFAULT_WIDTH;
        const height = SVG_DEFAULT_HEIGHT;
        const canvas = document.createElement('canvas');
        canvas.width = width * 3; // 720px
        canvas.height = height * 3; // 600px
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/png');
          if (dataUrl && dataUrl.length > 500) {
            return {
              dataUrl,
              format: 'PNG',
              width,
              height,
              aspectRatio: ASPECT_RATIO
            };
          }
        }
      }
    }
  } catch (fetchErr) {
    console.error('[Client PDF Generator] Error fetching /logo.svg directly:', fetchErr);
  }

  return null;
}

export async function generateClientQuotationPDF(data: ClientQuotationData): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 14;
  const contentWidth = pageWidth - (marginX * 2); // 182mm

  // Brand Palette
  const PRIMARY_BLUE = [33, 84, 165]; // #2154A5
  const ACCENT_GREEN = [107, 155, 0];  // #6B9B00
  const CYAN_WAVE = [0, 174, 239];    // #00AEEF
  const TEXT_DARK = [15, 23, 42];     // #0F172A
  const TEXT_MUTED = [100, 116, 139]; // #64748B
  const BG_LIGHT = [248, 250, 252];   // #F8FAFC
  const BORDER_COLOR = [203, 213, 225]; // #CBD5E1

  // Top Accent Banner (Background level)
  doc.setFillColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.rect(0, 0, pageWidth, 4.5, 'F');
  doc.setFillColor(ACCENT_GREEN[0], ACCENT_GREEN[1], ACCENT_GREEN[2]);
  doc.rect(0, 4.5, pageWidth, 1.5, 'F');

  // =========================================================================
  // 1. HEADER SECTION (Logo on LEFT + Company Info on RIGHT)
  // =========================================================================
  const headerTopY = 8.5;
  const rightX = pageWidth - marginX;

  // Maximum bounding box for the logo in the header
  const maxBoxWidth = 32;  // mm
  const maxBoxHeight = 25; // mm
  const boxX = marginX;
  const boxY = headerTopY;

  // Load /logo.svg with aspect-ratio preservation (object-contain)
  const logoInfo = await loadLogoSvgImage();

  if (logoInfo) {
    const ar = logoInfo.aspectRatio > 0 ? logoInfo.aspectRatio : 1.2;

    // Calculate object-contain dimensions without stretching or cropping
    let renderWidth = maxBoxWidth;
    let renderHeight = maxBoxWidth / ar;
    if (renderHeight > maxBoxHeight) {
      renderHeight = maxBoxHeight;
      renderWidth = maxBoxHeight * ar;
    }

    const logoX = boxX;
    const logoY = boxY + (maxBoxHeight - renderHeight) / 2;

    // Render on front/visible layer (stacking order after top accent banner, no overlay on top)
    try {
      doc.addImage(logoInfo.dataUrl, logoInfo.format, logoX, logoY, renderWidth, renderHeight, undefined, 'FAST');
    } catch (e) {
      console.error('[Client PDF Generator] Error rendering /logo.svg image into PDF:', e);
    }
  }

  // Right: Company Information & Contact Details (Aligned to Right Margin)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.text('JAI OCTG INSPECTION SERVICES PTE LTD', rightX, headerTopY + 4.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('Precision in Inspection. Confidence in Quality.', rightX, headerTopY + 9, { align: 'right' });

  doc.setFontSize(7);
  doc.setTextColor(ACCENT_GREEN[0], ACCENT_GREEN[1], ACCENT_GREEN[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('API & DS-1 COMPLIANT TUBULAR INSPECTION SERVICES', rightX, headerTopY + 13.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text('40 Upper Dickson Rd, Singapore 207498  |  Phone: +65 9697 4165', rightX, headerTopY + 18.5, { align: 'right' });
  doc.text('Email: jsankar@jaioctginspection.com  |  Website: www.jaioctginspection.com', rightX, headerTopY + 23, { align: 'right' });

  // Header Divider
  const headerDividerY = headerTopY + 27;
  doc.setDrawColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.setLineWidth(0.6);
  doc.line(marginX, headerDividerY, rightX, headerDividerY);
  doc.setDrawColor(ACCENT_GREEN[0], ACCENT_GREEN[1], ACCENT_GREEN[2]);
  doc.setLineWidth(0.3);
  doc.line(marginX, headerDividerY + 1, rightX, headerDividerY + 1);

  // Document Title Banner: "OFFICIAL INSPECTION QUOTATION"
  const bannerY = headerDividerY + 6;
  doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
  doc.roundedRect(marginX, bannerY, contentWidth, 12, 1.5, 1.5, 'F');
  doc.setDrawColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(marginX, bannerY, contentWidth, 12, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.text('OFFICIAL INSPECTION QUOTATION', marginX + 4, bannerY + 8);

  const qNum = data.quotationNumber || 'JAI-QTN-2026-0001';
  const qDate = data.quotationDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  doc.setFontSize(10.5);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(`Ref: ${qNum}`, rightX - 4, bannerY + 8, { align: 'right' });

  // Two-Column Info Cards
  const cardY = 60;
  const colWidth = (contentWidth - 6) / 2; // 88mm

  // Client Details Card
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(marginX, cardY, colWidth, 40, 1.5, 1.5, 'F');
  doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, cardY, colWidth, 40, 1.5, 1.5, 'S');

  doc.setFillColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.roundedRect(marginX, cardY, colWidth, 6.5, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('CLIENT DETAILS', marginX + 3, cardY + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('Contact Person:', marginX + 3, cardY + 11);
  doc.text('Company Name:', marginX + 3, cardY + 17);
  doc.text('Email Address:', marginX + 3, cardY + 23);
  doc.text('Phone Number:', marginX + 3, cardY + 29);
  doc.text('Location / Yard:', marginX + 3, cardY + 35);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(String(data.customerName || 'Valued Client Representative').substring(0, 32), marginX + 27, cardY + 11);
  doc.text(String(data.companyName || 'Operating Energy Corporation').substring(0, 32), marginX + 27, cardY + 17);
  doc.text(String(data.email || 'contact@client.com').substring(0, 32), marginX + 27, cardY + 23);
  doc.text(String(data.phone || '+65 9697 4165').substring(0, 32), marginX + 27, cardY + 29);
  doc.text(String(data.address || 'Singapore Base Yard').substring(0, 32), marginX + 27, cardY + 35);

  // Quotation Metadata Card
  const col2X = marginX + colWidth + 6;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(col2X, cardY, colWidth, 40, 1.5, 1.5, 'F');
  doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(col2X, cardY, colWidth, 40, 1.5, 1.5, 'S');

  doc.setFillColor(ACCENT_GREEN[0], ACCENT_GREEN[1], ACCENT_GREEN[2]);
  doc.roundedRect(col2X, cardY, colWidth, 6.5, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('QUOTATION METADATA', col2X + 3, cardY + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('Quotation No:', col2X + 3, cardY + 11);
  doc.text('Date of Issue:', col2X + 3, cardY + 17);
  doc.text('Validity Period:', col2X + 3, cardY + 23);
  doc.text('Pipe / Tubing Spec:', col2X + 3, cardY + 29);
  doc.text('NDT Level / QA:', col2X + 3, cardY + 35);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(qNum, col2X + 30, cardY + 11);
  doc.text(qDate, col2X + 30, cardY + 17);
  doc.text('30 Days from Issue', col2X + 30, cardY + 23);
  doc.text(String(data.pipeSpecs || '5" 19.5# S-135 NC50 Range 2').substring(0, 30), col2X + 30, cardY + 29);
  doc.text('ASNT SNT-TC-1A / DS-1 Level II', col2X + 30, cardY + 35);

  // Scope of Work / Inspection Services Table
  let currentY = 105;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.text('SCOPE OF INSPECTION SERVICES', marginX, currentY);

  currentY += 4;
  const colWidths = [14, 98, 42, 28]; // Total 182mm
  const colX = [
    marginX,
    marginX + colWidths[0],
    marginX + colWidths[0] + colWidths[1],
    marginX + colWidths[0] + colWidths[1] + colWidths[2]
  ];

  // Table Header
  doc.setFillColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.rect(marginX, currentY, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('S.NO', colX[0] + 3, currentY + 4.8);
  doc.text('DESCRIPTION OF INSPECTION ACTIVITY', colX[1] + 3, currentY + 4.8);
  doc.text('STANDARD / SPECIFICATION', colX[2] + 3, currentY + 4.8);
  doc.text('EST. QUANTITY', colX[3] + 3, currentY + 4.8);

  currentY += 7;

  // Resolve rows
  const rawServices = data.services || ['DRILLPIPE INSPECTION (DS-1 CAT4)'];
  const rows: ClientQuotationServiceItem[] = Array.isArray(rawServices)
    ? rawServices.map((s, idx) => {
        if (typeof s === 'object' && s !== null && 'description' in s) {
          return s as ClientQuotationServiceItem;
        }
        const str = String(s);
        let standard = 'DS-1 CAT4 / API RP 7G-2';
        if (str.toUpperCase().includes('CAT5')) standard = 'TH Hill DS-1 Standard CAT5';
        else if (str.toUpperCase().includes('BHA')) standard = 'DS-1 CAT3-5 / API Spec 7-1';
        else if (str.toUpperCase().includes('CASING')) standard = 'API 5CT / API 5A5';
        else if (str.toUpperCase().includes('TUBING')) standard = 'API RP 7G-2 / API 5A5';
        else if (str.toUpperCase().includes('PUP')) standard = 'DS-1 CAT3-5';
        else if (str.toUpperCase().includes('FISHING')) standard = 'DS-1 VOL4';
        else if (str.toUpperCase().includes('HANDLING')) standard = 'API RP 8B / 8C';

        return {
          sNo: idx + 1,
          description: str.toUpperCase(),
          standard,
          quantity: data.estimatedJoints ? `${data.estimatedJoints} Joints / As Specified` : 'Per Rig Program / Lot'
        };
      })
    : [];

  // Render Table Rows
  rows.forEach((item, index) => {
    const isEven = index % 2 === 0;
    const rowHeight = 8;

    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(marginX, currentY, contentWidth, rowHeight, 'F');
    doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
    doc.setLineWidth(0.2);
    doc.rect(marginX, currentY, contentWidth, rowHeight, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
    doc.text(String(item.sNo || index + 1).padStart(2, '0'), colX[0] + 4, currentY + 5.2);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text(item.description.substring(0, 60), colX[1] + 3, currentY + 5.2);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(item.standard.substring(0, 26), colX[2] + 3, currentY + 5.2);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(ACCENT_GREEN[0], ACCENT_GREEN[1], ACCENT_GREEN[2]);
    doc.text(item.quantity.substring(0, 18), colX[3] + 3, currentY + 5.2);

    currentY += rowHeight;
  });

  // Business Terms & Standards Notes Box
  currentY += 5;
  doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
  doc.roundedRect(marginX, currentY, contentWidth, 34, 1.5, 1.5, 'F');
  doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, currentY, contentWidth, 34, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.text('TECHNICAL EXECUTION & STANDARD TERMS', marginX + 3, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);

  const terms = [
    '1. Inspection conducted in strict accordance with TH Hill DS-1 (Vol 3/4) and API standards by certified ASNT Level II inspectors.',
    '2. Calibrated inspection instruments (EMI multi-channel units, UT gauges, fluorescent MPI yokes) with valid traceable calibration certificates.',
    '3. Comprehensive digital inspection reports and QA certificate documentation provided upon completion of tubular tally.',
    '4. Pipe storage, thread cleaning, solvent degreasing, and application of approved high-grade thread compound per client spec.',
    '5. Official commercial rates, volume discounts, and mobilization schedules will be finalized upon formal RFP acceptance.'
  ];

  let termY = currentY + 10;
  terms.forEach(term => {
    doc.text(term, marginX + 3, termY);
    termY += 4.6;
  });

  // Corporate Authorization Sign-off Section
  const signY = 196;
  doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
  doc.setLineWidth(0.3);
  doc.line(marginX, signY, rightX, signY);

  const signColWidth = (contentWidth - 10) / 2;

  // JAI OCTG Authorization
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.text('ISSUED ON BEHALF OF JAI OCTG INSPECTION SERVICES PTE LTD', marginX, signY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('Technical Operations & QA Department', marginX, signY + 11);

  doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
  doc.setLineDashPattern([1, 1], 0);
  doc.line(marginX, signY + 28, marginX + signColWidth, signY + 28);
  doc.setLineDashPattern([], 0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text('Authorized Technical Signature / Stamp', marginX, signY + 32);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${qDate}`, marginX, signY + 36);

  // Client Acceptance
  const clientSignX = marginX + signColWidth + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.text('CLIENT ACCEPTANCE & CONFIRMATION', clientSignX, signY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('Authorized Representative Sign & Company Seal', clientSignX, signY + 11);

  doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
  doc.setLineDashPattern([1, 1], 0);
  doc.line(clientSignX, signY + 28, rightX, signY + 28);
  doc.setLineDashPattern([], 0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text('Authorized Client Representative Signature', clientSignX, signY + 32);
  doc.setFont('helvetica', 'normal');
  doc.text('Date & Company Stamp:', clientSignX, signY + 36);

  // Page Footer
  const footerY = pageHeight - 14;
  doc.setFillColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.rect(0, footerY + 6, pageWidth, 8, 'F');
  doc.setFillColor(ACCENT_GREEN[0], ACCENT_GREEN[1], ACCENT_GREEN[2]);
  doc.rect(0, footerY + 4, pageWidth, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('JAI OCTG INSPECTION SERVICES PTE LTD • SINGAPORE • STRICTLY CONFIDENTIAL', marginX, footerY + 1);
  doc.text('Page 1 of 1', rightX, footerY + 1, { align: 'right' });

  return doc.output('blob');
}
