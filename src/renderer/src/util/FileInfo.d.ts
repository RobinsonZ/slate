interface SlateFile {
  id: string;
  type: "file";
  fileName: string;
  filePath: string;
  fileType: string;
  tags: string[];
}

interface SlateDayHeader {
  id: string;
  type: "day";
  day: string;
}

interface SlateNote {
  id: string;
  type: "note";
  text: string;
}

interface SlateColumn {
  name: string;
  id: string;
  cards: (SlateDayHeader | SlateFile | SlateNote)[];
}

interface FileDatabase {
  columns: SlateColumn[];
  importerFiles: SlateFile[];
}
