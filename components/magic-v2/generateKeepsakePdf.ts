'use client';

/** Rasterizes the offscreen certificate DOM node and drops it into an A4
 * PDF. Dynamically imported so html2canvas/jsPDF never enter the initial
 * client bundle for a route most visitors will spend most of their time
 * on stages 1-3 of. */
export async function generateKeepsakePdf(node: HTMLElement, filename: string) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#fdf6e3',
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgRatio = canvas.height / canvas.width;
  let renderWidth = pageWidth;
  let renderHeight = pageWidth * imgRatio;
  if (renderHeight > pageHeight) {
    renderHeight = pageHeight;
    renderWidth = pageHeight / imgRatio;
  }
  const offsetX = (pageWidth - renderWidth) / 2;
  const offsetY = (pageHeight - renderHeight) / 2;

  pdf.addImage(imgData, 'JPEG', offsetX, offsetY, renderWidth, renderHeight);
  pdf.save(filename);
}
