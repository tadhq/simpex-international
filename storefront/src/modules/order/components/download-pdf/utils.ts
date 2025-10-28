import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';

export const createPdf = async ({
  target,
  filename = 'order',
}: {
  target: string;
  filename: string;
}) => {
  const elem = document.querySelector(target) as HTMLElement;

  if (!elem) return;

  // Workaround to load fonts by performing the first conversion
  await htmlToImage.toPng(elem);
  // Workaround to load image
  await htmlToImage.toPng(elem);

  // Here comes the real image to be placed on the PDF
  const img = await htmlToImage.toPng(elem);

  // Initialize the PDF
  const pdf = new jsPDF({ orientation: 'portrait', format: 'a4', unit: 'pt' });

  // Get image properties
  const imgProperties = pdf.getImageProperties(img);

  // Set a custom width for the PDF (e.g., match the content width)
  const customWidth = imgProperties.width;
  const customHeight = imgProperties.height;

  // Create a PDF with a custom page size
  const pdfWithCustomSize = new jsPDF({
    orientation: 'portrait',
    format: [customWidth, customHeight],
    unit: 'pt',
  });

  // Add the image to the PDF
  pdfWithCustomSize.addImage(
    img,
    'PNG',
    0, // x position
    0, // y position
    customWidth,
    customHeight
  );

  // Save the PDF
  pdfWithCustomSize.save(filename.concat('.pdf'));
};
