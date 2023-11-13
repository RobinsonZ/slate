import { DragDropContext, OnDragEndResponder } from "react-beautiful-dnd";
import { useElectronStore } from "./util/useElectronStore";
import SlateColumn from "./components/SlateColumn";
import fakeCardData from "./util/fakeCardData";
import { useState } from "react";
import classNames from "classnames";
import SlateImporter from "./components/SlateImporter";
import { v4 as uuidv4 } from "uuid";

function App(): JSX.Element {
  const [data, setData] = useElectronStore<FileDatabase>("cards");
  const [isImporting, setImporting] = useState(false);

  const [importerFiles, setImporterFiles] = useState<SlateColumn>({
    name: "magic import column",
    id: "_IMPORTER",
    cards: [
      {
        fileName: "import test file 1",
        id: uuidv4(),
        filePath: "test",
        fileType: "pptx",
        type: "file",
        tags: [],
      },
      {
        fileName: "import test file 2",
        id: uuidv4(),
        filePath: "test",
        fileType: "docx",
        type: "file",
        tags: [],
      },
    ],
  });

  // copied from https://codesandbox.io/s/react-beautiful-dnd-experiment-4k722
  // which I found on https://stackoverflow.com/a/60092971/13644774
  const onDragEnd: OnDragEndResponder = (val) => {
    const { draggableId, source, destination } = val;
    const dataCopy = JSON.parse(JSON.stringify(data)) as FileDatabase; // stupid deep copy
    // first find the source column, then the day: split the ID by "&" and search
    // special case: importing

    const [sourceColumn] =
      source.droppableId === "_IMPORTER"
        ? [importerFiles]
        : dataCopy.columns.filter(
            (column) => column.id === source.droppableId
          );
    // same with destination column

    // Destination might be `null`: when a task is
    // dropped outside any drop area. In this case the
    // task reamins in the same column so `destination` is same as `source`
    if (destination != null) {
      const [destinationColumn] = dataCopy.columns.filter(
        (column) => column.id === destination.droppableId
      );

      // We save the task we are moving
      const [movingTask] = sourceColumn.cards.filter(
        (c) => c.id === draggableId
      );

      const newSourceCards = sourceColumn.cards.toSpliced(source.index, 1);
      const newDestinationCards = (
        source.droppableId === destination.droppableId
          ? newSourceCards
          : destinationColumn.cards
      ).toSpliced(destination.index, 0, movingTask);

      sourceColumn.cards = newSourceCards;
      destinationColumn.cards = newDestinationCards;
    }
    setData(dataCopy);
  };

  const addNewGroup = () => {
    const newColumn: SlateColumn = {
      name: "newGroup", // Avi: Not sure how we want to handle naming new columns
      id: uuidv4(),
      cards: [
        {
          type: "day",
          id: uuidv4(),
          day: "sept 19",
        },
        {
          type: "file",
          id: uuidv4(),
          fileName: "sample file",
          filePath: "fake",
          fileType: "docx",
          tags: [],
        },
      ],
    };

    setData(data => ({
      ...data,
      columns: data.columns.concat(newColumn)
    }));
  };

  return (
    /* tailwind doesn't pick up classes in the index.html for some reason so I'm using bg-gray-500 here too,
    so that it'll get compiled into the built css */
    <div className="bg-gray-500">
      <DragDropContext onDragEnd={onDragEnd}>
        <header className="bg-white shadow fixed w-screen z-10">
          {/* no overflow-x-scroll as this needs to be handled by the browser, see https://github.com/atlassian/react-beautiful-dnd/issues/131#issuecomment-1144736558*/}
          <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-title">
              Slate
              <button
                className="bg-blue-200 inline mx-2 p-1 rounded text-xl"
                onClick={() => setData(fakeCardData())}
              >
                reset cards
              </button>
              <button
                className={classNames("inline mx-2 p-1 rounded text-xl", {
                  "bg-blue-500": isImporting,
                  "bg-blue-200": !isImporting,
                })}
                onClick={() => setImporting((importing) => !importing)}
              >
                import
              </button>
              <button
                className="bg-blue-200 inline mx-2 p-1 rounded text-xl"
                onClick={addNewGroup}
              >
                add group
              </button>
            </h1>
          </div>
        </header>
        <header
          className={classNames(
            "absolute min-h-full w-64 bg-white top-[5.25rem] ease-in-out transition-all p-4",
            { "hidden opacity-0": !isImporting }
          )}
        >
          <SlateImporter
            importerFiles={importerFiles.cards as SlateFile[]}
            setImporterFiles={setImporterFiles}
            data={data}
          />
        </header>
        {/* again, funny hack with the margins because we can't just have this be a child of an
       overarching thing containing the import screen */}
        <main
          className={classNames(
            "min-h-full absolute top-20 ease-in-out transition-all ",
            { "ml-72": isImporting }
          )}
        >
          <div className="mx-auto py-6 sm:px-6 lg:px-8">
            <div className="w-[200%] h-full columns-xs gap-4 flex items-start pb-16 overflow-y-hidden select-none">
              {data?.columns?.map &&
                data?.columns.map((colData) => (
                  <SlateColumn
                    name={colData.name}
                    id={colData.id}
                    key={colData.id}
                    cards={colData.cards}
                  />
                ))}
            </div>
          </div>
        </main>
      </DragDropContext>
    </div>
  );
}

export default App;
