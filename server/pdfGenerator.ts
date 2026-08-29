// server/pdfGenerator.ts
// Generates professional corporate A4 quotation PDF for JAI OCTG Inspection Services Pte Ltd
import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { QuotationData } from './quotation.js';
import { JAI_OCTG_LOGO_JPEG } from './logoBase64.js';

interface LogoSvgInfo {
  dataUrl: string;
  format: 'PNG' | 'JPEG';
  width: number;
  height: number;
  aspectRatio: number;
}

/**
 * Loads and rasterizes /logo.svg directly as the single source of truth for the corporate logo.
 * Uses sharp to convert the SVG at high resolution (300 DPI) into a PNG data URL for jsPDF.
 * Seamlessly falls back to embedded base64 logo in serverless environments.
 */
async function loadLogoSvgInfo(): Promise<LogoSvgInfo | null> {
  const svgPath = path.join(process.cwd(), 'public', 'logo.svg');
  if (fs.existsSync(svgPath)) {
    try {
      const svgBuffer = fs.readFileSync(svgPath);
      // Convert /logo.svg at 300 DPI to crisp PNG buffer
      const pngBuffer = await sharp(svgBuffer, { density: 300 })
        .png({ quality: 100 })
        .toBuffer();

      const metadata = await sharp(pngBuffer).metadata();
      const width = metadata.width || 240;
      const height = metadata.height || 200;
      const aspectRatio = width / height;

      return {
        dataUrl: `data:image/png;base64,${pngBuffer.toString('base64')}`,
        format: 'PNG',
        width,
        height,
        aspectRatio: aspectRatio > 0 ? aspectRatio : 1.2
      };
    } catch (err) {
      console.warn('[PDF Generator] Error loading /logo.svg with sharp, using embedded fallback:', err);
    }
  }

  // Fallback to embedded base64 logo (works in all serverless environments without filesystem access)
  return {
    dataUrl: JAI_OCTG_LOGO_JPEG,
    format: 'JPEG',
    width: 240,
    height: 200,
    aspectRatio: 1.2
  };
}

/**
 * Generates an A4 corporate quotation PDF matching exact corporate requirements
 * Strictly NO financial information (no price, amount, rate, taxes, or currencies).
 */
export async function generateQuotationPDF(data: QuotationData): Promise<Buffer> {
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
  const ACCENT_GREEN = [107, 155, 0];  // #6B9B00 / Complementary green matching logo
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
  const logoInfo = await loadLogoSvgInfo();
  const rightX = pageWidth - marginX;

  // Maximum bounding box for the logo in the header
  const maxBoxWidth = 32;  // mm
  const maxBoxHeight = 25; // mm
  const boxX = marginX;
  const boxY = headerTopY;

  if (logoInfo) {
    const ar = logoInfo.aspectRatio > 0 ? logoInfo.aspectRatio : 1.2;

    // Preserve aspect ratio using object-contain
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
      console.error('[PDF Generator] Error embedding /logo.svg image into PDF:', e);
    }
  }

  // Right: Company Branding & Contact Details (Aligned to Right Margin)
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

  let currentY = headerDividerY + 6.5;

  // =========================================================================
  // 2. QUOTATION TITLE & METADATA
  // =========================================================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.text('QUOTATION', marginX, currentY + 3);

  // Metadata Box on Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(`Quotation No. : ${data.quotationNumber}`, rightX, currentY, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(`Quotation Date: ${data.quotationDate}`, rightX, currentY + 4.5, { align: 'right' });

  currentY += 10;

  // =========================================================================
  // 3. CUSTOMER DETAILS (Boxed section)
  // =========================================================================
  const custBoxY = currentY;
  const custBoxHeight = 24;

  doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
  doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
  doc.setLineWidth(0.2);
  doc.roundedRect(marginX, custBoxY, contentWidth, custBoxHeight, 1.5, 1.5, 'FD');

  // Blue header accent tag inside card
  doc.setFillColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.rect(marginX, custBoxY, 2.5, custBoxHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.text('CUSTOMER DETAILS', marginX + 6, custBoxY + 5);

  // Grid details inside card
  const col1X = marginX + 6;
  const col2X = marginX + 96;

  doc.setFontSize(8);
  // Row 1
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('Customer Name:', col1X, custBoxY + 11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(data.customerName || 'Client Representative', col1X + 26, custBoxY + 11);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('Company Name:', col2X, custBoxY + 11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(data.companyName || 'Operating Company', col2X + 26, custBoxY + 11);

  // Row 2
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('Email:', col1X, custBoxY + 16.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(data.email || 'N/A', col1X + 26, custBoxY + 16.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('Phone:', col2X, custBoxY + 16.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(data.phone || 'N/A', col2X + 26, custBoxY + 16.5);

  // Row 3
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('Address / Yard:', col1X, custBoxY + 21.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(data.address || 'Singapore Base Yard', col1X + 26, custBoxY + 21.5);

  currentY = custBoxY + custBoxHeight + 6;

  // =========================================================================
  // 4. ABOUT THIS QUOTATION (Informational section)
  // =========================================================================
  const aboutBoxY = currentY;
  const aboutBoxHeight = 16;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.setLineWidth(0.2);
  doc.roundedRect(marginX, aboutBoxY, contentWidth, aboutBoxHeight, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.text('ABOUT THIS QUOTATION', marginX + 4, aboutBoxY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text('Thank you for your interest in our inspection services.', marginX + 4, aboutBoxY + 9.5);
  doc.text(
    'Please find below the inspection requirements submitted by you. Our technical team will review your requirements and get back to you with the next steps.',
    marginX + 4,
    aboutBoxY + 13.5
  );

  currentY = aboutBoxY + aboutBoxHeight + 6;

  // =========================================================================
  // 5. REQUESTED INSPECTION SERVICES TABLE
  // =========================================================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.text('REQUESTED INSPECTION SERVICES', marginX, currentY);

  currentY += 3;

  // Column widths: S.No (14mm), Description (76mm), Standard (56mm), Quantity (36mm) = 182mm
  const colW = { sNo: 14, desc: 76, std: 56, qty: 36 };
  const colXPos = {
    sNo: marginX,
    desc: marginX + colW.sNo,
    std: marginX + colW.sNo + colW.desc,
    qty: marginX + colW.sNo + colW.desc + colW.std
  };

  // Table Header Row
  const thHeight = 7;
  doc.setFillColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.rect(marginX, currentY, contentWidth, thHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('S.No.', colXPos.sNo + (colW.sNo / 2), currentY + 4.8, { align: 'center' });
  doc.text('Inspection / Service Description', colXPos.desc + 3, currentY + 4.8);
  doc.text('Standard / Specification', colXPos.std + 3, currentY + 4.8);
  doc.text('Quantity', colXPos.qty + 3, currentY + 4.8);

  currentY += thHeight;

  // Table Data Rows
  const rawServices = (data.services && data.services.length > 0)
    ? data.services
    : [{ sNo: 1, description: 'DRILLPIPE INSPECTION', standard: 'DS-1 CAT4 / DS-1 CAT5', quantity: 'As Requested' }];

  rawServices.forEach((item: any, index: number) => {
    const rowHeight = 7.5;
    const isAlt = index % 2 === 1;

    // Background
    if (isAlt) {
      doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
      doc.rect(marginX, currentY, contentWidth, rowHeight, 'F');
    } else {
      doc.setFillColor(255, 255, 255);
      doc.rect(marginX, currentY, contentWidth, rowHeight, 'F');
    }

    // Border line below row
    doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
    doc.setLineWidth(0.15);
    doc.rect(marginX, currentY, contentWidth, rowHeight, 'S');

    const sNoStr = String(item.sNo || item.itemNo || index + 1);
    const descStr = String(item.description || item.serviceDescription || item.title || item.name || 'TUBULAR INSPECTION SERVICE');
    const stdStr = String(item.standard || item.specification || item.specs || 'DS-1 / API Compliant');
    const qtyStr = String(item.quantity || item.estimatedQuantity || 'As Requested');

    // Text content
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text(sNoStr, colXPos.sNo + (colW.sNo / 2), currentY + 4.8, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    const truncatedDesc = descStr.length > 48 ? descStr.substring(0, 46) + '...' : descStr;
    doc.text(truncatedDesc, colXPos.desc + 3, currentY + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    const truncatedStd = stdStr.length > 34 ? stdStr.substring(0, 32) + '...' : stdStr;
    doc.text(truncatedStd, colXPos.std + 3, currentY + 4.8);

    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    const truncatedQty = qtyStr.length > 22 ? qtyStr.substring(0, 20) + '...' : qtyStr;
    doc.text(truncatedQty, colXPos.qty + 3, currentY + 4.8);

    currentY += rowHeight;
  });

  currentY += 6;

  // =========================================================================
  // 6. ADDITIONAL INFORMATION & TERMS (Side-by-Side or Two Structured Cards)
  // =========================================================================
  const notesCardWidth = (contentWidth - 6) / 2; // 88mm each

  // Card 1: Additional Information
  doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
  doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
  doc.setLineWidth(0.2);
  const cardHeight = 28;
  doc.roundedRect(marginX, currentY, notesCardWidth, cardHeight, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.text('ADDITIONAL INFORMATION', marginX + 4, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  const addInfoBullets = [
    '• This quotation is based on the information provided by the customer.',
    '• The scope of inspection will be finalized after technical review.',
    '• Any additional requirements will be communicated separately.',
    '• Further details will be confirmed by the inspection team.'
  ];
  let bulletY = currentY + 9.5;
  addInfoBullets.forEach(b => {
    const lines = doc.splitTextToSize(b, notesCardWidth - 8);
    doc.text(lines, marginX + 4, bulletY);
    bulletY += lines.length * 3.8;
  });

  // Card 2: Terms & Conditions (Strictly NO price/payment terms)
  const card2X = marginX + notesCardWidth + 6;
  doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
  doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
  doc.roundedRect(card2X, currentY, notesCardWidth, cardHeight, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.text('TERMS & CONDITIONS', card2X + 4, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  const termsBullets = [
    '• Inspection will be carried out as per the applicable standards.',
    '• The final scope and deliverables will be confirmed upon mutual agreement.',
    '• Confidentiality of all customer information will be strictly maintained.',
    '• For any clarification, please contact our team.'
  ];
  let termY = currentY + 9.5;
  termsBullets.forEach(t => {
    const lines = doc.splitTextToSize(t, notesCardWidth - 8);
    doc.text(lines, card2X + 4, termY);
    termY += lines.length * 3.8;
  });

  currentY += cardHeight + 8;

  // =========================================================================
  // 7. SIGNATORY & CLOSING
  // =========================================================================
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text('Thank you for choosing JAI OCTG Inspection Services Pte Ltd.', marginX, currentY);
  doc.text('We look forward to working with you.', marginX, currentY + 4.5);

  // Signatory Box on Right
  const sigX = rightX - 60;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.text('For JAI OCTG Inspection Services Pte Ltd', sigX, currentY);

  // Placeholder for signature spacing
  doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
  doc.setLineWidth(0.3);
  doc.line(sigX, currentY + 14, rightX, currentY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('Authorized Signatory', sigX, currentY + 18);

  // =========================================================================
  // 8. BRANDED FOOTER BARS
  // =========================================================================
  const footerY = pageHeight - 8;
  doc.setFillColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.rect(0, footerY, pageWidth, 5, 'F');
  doc.setFillColor(ACCENT_GREEN[0], ACCENT_GREEN[1], ACCENT_GREEN[2]);
  doc.rect(0, footerY - 1.5, pageWidth, 1.5, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text(
    'JAI OCTG Inspection Services Pte Ltd • 40 Upper Dickson Rd, Singapore 207498 • Phone: +65 9697 4165 • Web: www.jaioctginspection.com',
    pageWidth / 2,
    footerY + 3.2,
    { align: 'center' }
  );

  // Return as Node Buffer
  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}
