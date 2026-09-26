import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = workerUrl;

export async function openPdf(data: ArrayBuffer): Promise<PDFDocumentProxy> {
  const task = getDocument({
    data: new Uint8Array(data),
    disableRange: true,
    disableStream: true,
    isEvalSupported: false,
  });
  return task.promise;
}
