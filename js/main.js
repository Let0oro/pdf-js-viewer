import "../css/style.css";

(() => {

const PDF_PATH = "../docs/sample.pdf";

let pdfview;

// class pdfViewer;
class PdfViewer {
  constructor(
    url,
    idCanvas = "pdf-render",
    idCounter = "page-num",
    idTotal = "page-count",
    scale = 1.5
  ) {
    this.url = url;
    this.pdfDoc = null;
    this.canvas = document.querySelector(`#${idCanvas}`);
    this.counterPage = document.querySelector(`#${idCounter}`);
    this.totalPage = document.querySelector(`#${idTotal}`);
    this.ctx = this.canvas.getContext("2d");
    this.scale = scale;
    this.numPage = 1;
  }

  static preparation() {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.js";
  }

  static prevPage() {
    if (this.numPage === 1) {
      return;
    }
    this.numPage--;
    this.generatePDF(this.numPage);
  }

  static nextPage() {
    if (this.numPage >= this.pdfDoc.numPages) {
      return;
    }
    this.numPage++;
    this.generatePDF(this.numPage);
  }

  generatePDF(numPage) {
    this.pdfDoc.getPage(numPage).then((page) => {
      let viewport = page.getViewport({ scale: this.scale, dontFlip: false });
      this.canvas.height = viewport.height;
      this.canvas.width = viewport.width;
      let renderContext = {
        canvasContext: this.ctx,
        viewport: viewport,
      };
      page.render(renderContext);
    });
    this.counterPage.innerHTML = numPage;
  }

  pdfStart() {
    let loadingTask = pdfjsLib.getDocument(this.url);

    loadingTask.promise.then((pdfDoc_) => {
      this.pdfDoc = pdfDoc_;
      this.totalPage.innerHTML = this.pdfDoc.numPages;
      this.generatePDF(this.numPage);
    });
  }
}


// Initialise pdf viewer
function startPdfclass() {
    pdfview = new PdfViewer(PDF_PATH);
    PdfViewer.preparation();
    pdfview.pdfStart();
};

// Wait until window load to start
window.addEventListener("load", startPdfclass);

// Events
document.querySelector("#prev-page").addEventListener("click", PdfViewer.prevPage);
document.querySelector("#next-page").addEventListener("click", PdfViewer.nextPage);

})();