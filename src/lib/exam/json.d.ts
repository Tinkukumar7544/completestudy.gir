declare module "*.html?raw" {
  const html: string;
  export default html;
}

declare module "pdfjs-dist/build/pdf.worker.min.mjs?url" {
  const src: string;
  export default src;
}

