import { Injectable } from '@angular/core';
//@ts-ignore
import * as html2pdf from 'html2pdf.js';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  constructor() {}

  downloadAsPDF(htmlContent: string, fileName: string): void {
    const pdfSettings = {
      margin: 10,
      fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().from(htmlContent).set(pdfSettings).save();
  }
}
