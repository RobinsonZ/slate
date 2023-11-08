interface SlateFile {
  id: string;
  type: "file";
  fileName: string;
  filePath: string;
  fileType: "pptx" | "docx" | "pdf";
  tags: string[];
}

interface SlateDayHeader {
  id: string;
  type: "day";
  day: string;
}

interface SlateColumn {
  name: string;
  id: string;
  cards: (SlateDayHeader | SlateFile)[];
}

interface FileDatabase {
  columns: SlateColumn[]
}