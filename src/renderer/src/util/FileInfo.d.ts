
interface SlateFile {
  id: string;
  type: "file";
  fileName: string;
  filePath: string;
  fileType: string;
  startDate: string;
  tags: string[];
}

export interface SlateDayHeader {
  id: string;
  type: "day";
  startDate: string;
}

export interface SlateNote {
  id: string;
  type: "note";
  text: string;
}

export interface SlateColumn {
  name: string;
  id: string;
  cards: (SlateDayHeader | SlateFile | SlateNote)[]; 
}

export interface FileDatabase {
  columns: SlateColumn[];
  importerFiles: (SlateFile | SlateNote)[];
}

