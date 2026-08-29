import { jsPDF } from 'jspdf';

export const downloadRunGuidePDF = () => {
  const doc = new jsPDF();

  // Primary Header Accent Bar
  doc.setFillColor(245, 158, 11); // Amber accent
  doc.rect(0, 0, 210, 8, 'F');

  // Title Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // Dark slate
  doc.text('Project Setup & Execution Guide', 14, 22);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Full-Stack Express + React 19 + TypeScript Application', 14, 29);
  doc.text(`Generated Date: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}`, 14, 34);

  let y = 44;

  const addSectionHeading = (title: string) => {
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y - 4, 182, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(title, 16, y + 1);
    y += 10;
  };

  const addParagraph = (text: string, isCode = false) => {
    doc.setFont('helvetica', isCode ? 'bold' : 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(isCode ? 217 : 51, isCode ? 119 : 65, isCode ? 6 : 85);
    const lines = doc.splitTextToSize(text, 178);
    doc.text(lines, 16, y);
    y += lines.length * 5 + 2;
  };

  // Section 1: Prerequisites
  addSectionHeading('1. System Requirements & Prerequisites');
  addParagraph('• Node.js: Version 18.0.0 or higher (v20+ recommended)');
  addParagraph('• Package Manager: npm v9.0.0 or higher');
  addParagraph('• Operating System: Linux, macOS, or Windows (WSL / PowerShell supported)');
  y += 4;

  // Section 2: Quick Start Instructions
  addSectionHeading('2. Step-by-Step Installation & Quick Start');
  addParagraph('Step 1: Open terminal in the root directory of the project.');
  addParagraph('Step 2: Install all required Node packages:');
  addParagraph('npm install', true);
  addParagraph('Step 3: Create local environment configuration file:');
  addParagraph('cp .env.example .env   # On macOS/Linux\ncopy .env.example .env  # On Windows PowerShell', true);
  addParagraph('Step 4: Launch local development server:');
  addParagraph('npm run dev', true);
  addParagraph('Step 5: Open your browser and navigate to:');
  addParagraph('http://localhost:3000', true);
  y += 4;

  // Section 3: Available NPM Scripts
  addSectionHeading('3. NPM Scripts Reference');
  addParagraph('• npm run dev: Launches live dev server using tsx and Express middleware on port 3000.');
  addParagraph('• npm run build: Builds Vite frontend and compiles server.ts into dist/server.cjs using esbuild.');
  addParagraph('• npm run start: Launches the compiled production server (node dist/server.cjs).');
  addParagraph('• npm run lint: Performs TypeScript static type checking without generating build output.');
  y += 4;

  // Section 4: Production Deployment
  addSectionHeading('4. Production Deployment & Containerization');
  addParagraph('To run the production bundle locally or in Docker:');
  addParagraph('npm run build\nnpm run start', true);
  addParagraph('Environment configuration variables required in .env or Cloud Run settings:');
  addParagraph('PORT=3000\nNODE_ENV=production\nGEMINI_API_KEY=your_optional_api_key', true);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('OmniEnterprise Application Guide • Page 1 of 1', 14, 285);

  doc.save('Project_Run_Guide.pdf');
};
