export default function fakeCardData(): FileDatabase {
  return {
    columns: [
      {
        name: "english",
        id: "english",
        cards: [
          {
            type: "day",
            id: "a-day-sept19",
            day: "sept 19",
          },
          {
            type: "file",
            id: "a1",
            fileName: "a1",
            filePath: "fake",
            fileType: "docx",
            tags: [],
          },
          {
            type: "file",
            id: "a2",
            fileName: "a2",
            filePath: "fake",
            fileType: "pptx",
            tags: [],
          },
          {
            type: "day",
            id: "a-day-sept20",
            day: "sept 20",
          },
          {
            type: "file",
            id: "a3",
            fileName: "a3",
            filePath: "fake",
            fileType: "pdf",
            tags: [],
          },
        ],
      },
      {
        name: "science",
        id: "science",
        cards: [
          {
            type: "day",
            id: "b-day-sept19",
            day: "sept 19",
          },
          {
            type: "file",
            id: "b1",
            fileName: "b1",
            filePath: "fake",
            fileType: "docx",
            tags: [],
          },
          {
            type: "file",
            id: "b2",
            fileName: "b2",
            filePath: "fake",
            fileType: "pdf",
            tags: [],
          },
          {
            type: "file",
            id: "b3",
            fileName: "b3",
            filePath: "fake",
            fileType: "docx",
            tags: [],
          },
        ],
      },
    ],
  };
}
