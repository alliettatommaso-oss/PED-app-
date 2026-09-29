import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export async function extractPdfText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageTexts: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();

    let lastY: number | null = null;
    let currentLine = '';
    const lines: string[] = [];

    for (const item of content.items) {
      if (!('str' in item)) {
        continue;
      }
      const y = item.transform[5];
      if (lastY !== null && Math.abs(y - lastY) > 1) {
        lines.push(currentLine);
        currentLine = '';
      }
      currentLine += item.str;
      lastY = y;
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    pageTexts.push(lines.join('\n'));
  }

  return pageTexts.join('\n\n');
}
