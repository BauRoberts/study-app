// Define the PDF.js types
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export async function extractTextFromFile(file: File): Promise<string> {
  try {
    if (file.type === "text/plain") {
      return await file.text();
    }

    if (file.type === "application/pdf") {
      // Make sure PDF.js is loaded
      if (!window.pdfjsLib) {
        throw new Error("PDF.js library not loaded");
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer })
        .promise;
      let fullText = "";

      // Extract text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n";
      }

      return fullText;
    }

    throw new Error(
      `Unsupported file type: ${file.type}. Please upload a PDF or text file.`
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error reading file: ${error.message}`);
    }
    throw new Error("Error reading file");
  }
}
