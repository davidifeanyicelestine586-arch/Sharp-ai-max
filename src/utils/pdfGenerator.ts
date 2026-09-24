import { jsPDF } from 'jspdf';
import { HistoryItem } from '../types';

export function exportItemToPDF(item: HistoryItem) {
  // Initialize A4 page PDF document (portrait, mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 20;
  let cursorY = 20;

  // Colors
  const COLOR_PRIMARY = [79, 70, 229]; // Indigo Hex: #4f46e5
  const COLOR_SECONDARY = [109, 40, 217]; // Purple Hex: #6d28d9
  const COLOR_TEXT_DARK = [30, 41, 59]; // slate-800
  const COLOR_TEXT_LIGHT = [100, 116, 139]; // slate-500
  const COLOR_BG_LIGHT = [248, 250, 252]; // slate-50
  const COLOR_BORDER = [226, 232, 240]; // slate-200

  // Helper to draw clean page headers & footers
  let pageCount = 1;
  function drawPageTemplate() {
    // Top fine line accent
    doc.setDrawColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.setLineWidth(1.5);
    doc.line(marginX, 12, pageWidth - marginX, 12);

    // Header branding
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(COLOR_TEXT_LIGHT[0], COLOR_TEXT_LIGHT[1], COLOR_TEXT_LIGHT[2]);
    doc.text('SHARP AI CONTENT STUDIO', marginX, 10);
    doc.text('PROFESSIONAL CAMPAIGN EXPORT', pageWidth - marginX - 50, 10, { align: 'right' });

    // Footer divider line
    doc.setDrawColor(COLOR_BORDER[0], COLOR_BORDER[1], COLOR_BORDER[2]);
    doc.setLineWidth(0.5);
    doc.line(marginX, pageHeight - 15, pageWidth - marginX, pageHeight - 15);

    // Footer metadata
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Exported on ${new Date().toLocaleDateString()}`, marginX, pageHeight - 10);
    doc.text(`Page ${pageCount}`, pageWidth - marginX - 10, pageHeight - 10, { align: 'right' });
  }

  // Draw first page template
  drawPageTemplate();
  cursorY = 25;

  // Title of the entry
  doc.setFont('helvetica', 'bold');
  doc.setDrawColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  doc.setFontSize(20);
  doc.setTextColor(COLOR_TEXT_DARK[0], COLOR_TEXT_DARK[1], COLOR_TEXT_DARK[2]);
  
  // Wrap title to fit
  const wrappedTitle = doc.splitTextToSize(item.title, pageWidth - (marginX * 2));
  doc.text(wrappedTitle, marginX, cursorY);
  cursorY += (wrappedTitle.length * 8) + 2;

  // Metadata block (Tags, Type, Created At)
  doc.setFillColor(COLOR_BG_LIGHT[0], COLOR_BG_LIGHT[1], COLOR_BG_LIGHT[2]);
  doc.setDrawColor(COLOR_BORDER[0], COLOR_BORDER[1], COLOR_BORDER[2]);
  doc.setLineWidth(0.3);
  doc.rect(marginX, cursorY, pageWidth - (marginX * 2), 22, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(COLOR_TEXT_LIGHT[0], COLOR_TEXT_LIGHT[1], COLOR_TEXT_LIGHT[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Date Created:', marginX + 5, cursorY + 6);
  doc.text('Draft Format:', marginX + 5, cursorY + 12);
  doc.text('Assigned Labels:', marginX + 5, cursorY + 18);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLOR_TEXT_DARK[0], COLOR_TEXT_DARK[1], COLOR_TEXT_DARK[2]);
  doc.text(new Date(item.createdAt).toLocaleString(), marginX + 35, cursorY + 6);
  
  const formatName = item.type === 'single' ? `Single Channel (${item.contentType?.toUpperCase()})` : '5-in-1 Marketing Campaign Stack';
  doc.text(formatName, marginX + 35, cursorY + 12);

  const tagsString = item.tags && item.tags.length > 0 ? item.tags.join(', ') : 'None assigned';
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  doc.text(tagsString, marginX + 35, cursorY + 18);

  cursorY += 28;

  // Original concept prompt
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(COLOR_TEXT_LIGHT[0], COLOR_TEXT_LIGHT[1], COLOR_TEXT_LIGHT[2]);
  doc.text('ORIGINAL INPUT SPARK / CONCEPT', marginX, cursorY);
  cursorY += 5;

  doc.setFont('helvetica', 'oblique');
  doc.setFontSize(10);
  doc.setTextColor(COLOR_TEXT_DARK[0], COLOR_TEXT_DARK[1], COLOR_TEXT_DARK[2]);
  
  const wrappedInput = doc.splitTextToSize(`"${item.input}"`, pageWidth - (marginX * 2));
  doc.text(wrappedInput, marginX, cursorY);
  cursorY += (wrappedInput.length * 5) + 8;

  // Main thin separator
  doc.setDrawColor(COLOR_BORDER[0], COLOR_BORDER[1], COLOR_BORDER[2]);
  doc.setLineWidth(0.5);
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
  cursorY += 10;

  // Function to print long blocks of text with page breaks
  function printTextBlock(title: string, text: string) {
    // Check if we need a new page for the heading
    if (cursorY > pageHeight - 40) {
      doc.addPage();
      pageCount++;
      drawPageTemplate();
      cursorY = 25;
    }

    // Title / Header for the block
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.text(title.toUpperCase(), marginX, cursorY);
    cursorY += 6;

    // Split paragraphs
    const paragraphs = text.split('\n');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(COLOR_TEXT_DARK[0], COLOR_TEXT_DARK[1], COLOR_TEXT_DARK[2]);

    for (let p of paragraphs) {
      const trimmed = p.trim();
      if (!trimmed) {
        cursorY += 3; // blank paragraph spacer
        continue;
      }

      const lines = doc.splitTextToSize(trimmed, pageWidth - (marginX * 2));
      for (let line of lines) {
        if (cursorY > pageHeight - 25) {
          doc.addPage();
          pageCount++;
          drawPageTemplate();
          cursorY = 25;
          
          // Re-establish font settings on the new page
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(COLOR_TEXT_DARK[0], COLOR_TEXT_DARK[1], COLOR_TEXT_DARK[2]);
        }
        doc.text(line, marginX, cursorY);
        cursorY += 5.2; // Line spacing
      }
      cursorY += 3; // Gap between paragraphs
    }
    cursorY += 6; // Gap after block
  }

  // Handle single or stacked output rendering
  if (item.type === 'single') {
    const channelName = item.contentType ? `${item.contentType} content draft` : 'Draft Content';
    printTextBlock(channelName, item.data.singleOutput || '');
  } else {
    if (item.data.blogPost) {
      printTextBlock('1. SEO Blog Post', item.data.blogPost);
    }
    if (item.data.linkedinPost) {
      printTextBlock('2. LinkedIn Native Piece', item.data.linkedinPost);
    }
    if (item.data.xThread && item.data.xThread.length > 0) {
      const threadText = item.data.xThread.map((tweet, index) => `[Tweet ${index + 1}]\n${tweet}`).join('\n\n');
      printTextBlock('3. X Thread Sequence', threadText);
    }
    if (item.data.instagramCaption) {
      printTextBlock('4. Instagram Caption & Tags', item.data.instagramCaption);
    }
    if (item.data.emailNewsletter) {
      printTextBlock('5. Email Newsletter Broadcast', item.data.emailNewsletter);
    }
  }

  // Save the documents trigger
  const safeFilename = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'campaign-draft';
  doc.save(`${safeFilename}.pdf`);
}
