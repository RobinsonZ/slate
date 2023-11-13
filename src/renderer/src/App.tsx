import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import { useElectronStore } from "./util/useElectronStore";
import SlateColumn from "./components/SlateColumn";
import fakeCardData from "./util/fakeCardData";
import { useState } from "react";
import classNames from "classnames";
import SlateImporter from "./components/SlateImporter";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

import { useKeyPress } from "react-use";

function App(): JSX.Element {
  const [data, setData] = useElectronStore<FileDatabase>("cards");
  const [isImporting, setImporting] = useState(false);
  const [dragging, setDragging] = useState(false);

  const [showDev, setShowDev] = useKeyPress("Alt");

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
    setDragging(false);
    const { draggableId, source, destination } = val;
    const dataCopy = JSON.parse(JSON.stringify(data)) as FileDatabase; // stupid deep copy
    // first find the source column, then the day: split the ID by "&" and search
    // special case: importing

    const [sourceColumn] =
      source.droppableId === "_IMPORTER"
        ? [importerFiles]
        : dataCopy.columns.filter((column) => column.id === source.droppableId);
    // same with destination column

    // Destination might be `null`: when a task is
    // dropped outside any drop area. In this case the
    // task reamins in the same column so `destination` is same as `source`
    if (
      destination != null &&
      destination?.droppableId != "_TRASH" &&
      destination.droppableId != "_IMPORTER"
    ) {
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
    } else if (destination?.droppableId === "_TRASH") {
      const newSourceCards = sourceColumn.cards.toSpliced(source.index, 1);
      sourceColumn.cards = newSourceCards;
    }
    setData(dataCopy);
  };

  const addNewGroup = () => {
    const newColumn: SlateColumn = {
      name: "New Column",
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

    setData((data) => ({
      ...data,
      columns: data.columns.concat(newColumn),
    }));
  };

  return (
    /* tailwind doesn't pick up classes in the index.html for some reason so I'm using bg-gray-500 here too,
    so that it'll get compiled into the built css */
    <div className="bg-gray-500 max-h-full">
      <DragDropContext
        onDragStart={() => setDragging(true)}
        onDragEnd={onDragEnd}
      >
        <header className="bg-white shadow fixed w-screen z-10">
          {/* no overflow-x-scroll as this needs to be handled by the browser, see https://github.com/atlassian/react-beautiful-dnd/issues/131#issuecomment-1144736558*/}
          <div className="mx-auto py-6 px-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-title">
              Slate
              <button
                className={classNames("inline mx-2 p-1 rounded text-xl", {
                  "bg-blue-500": isImporting,
                  "bg-blue-200": !isImporting,
                })}
                onClick={() => setImporting((importing) => !importing)}
              >
                Import
              </button>
              <button
                className="bg-blue-200 inline mx-2 p-1 rounded text-xl"
                onClick={addNewGroup}
              >
                New Column
              </button>
              {showDev && <button
                className="bg-blue-200 inline mx-2 p-1 rounded text-xl"
                onClick={() => setData(fakeCardData())}
              >
                reset cards
              </button>}
            </h1>
          </div>
        </header>
        <header
          className={classNames(
            "absolute top-0 left-0 h-screen w-[250px] ps-6 bg-white pt-[6rem] ease-in-out transition-transform p-4 overflow-scroll",
            { "translate-x-[-250px]": !isImporting }
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
          className={classNames("min-h-screen max-h-screen absolute pt-20")}
        >
          <div className="absolute top-0 left-0 mx-auto pt-24 px-8 h-[100vh] pb-6 max-h-full w-full">
            <div className="fixed bottom-5 left-5">
              <Droppable droppableId="_TRASH">
                {(provider, snapshot) => (
                  <div
                    className={classNames(
                      "inline mx-2 p-1 rounded text-3xl font-detail h-100",
                      {
                        "opacity-0": !dragging,
                        "bg-red-200": !snapshot.isDraggingOver,
                        "bg-red-400": snapshot.isDraggingOver,
                      }
                    )}
                    ref={provider.innerRef}
                    {...provider.droppableProps}
                  >
                    <FontAwesomeIcon className="mt-1" icon={faTrashCan} />
                  </div>
                )}
              </Droppable>
            </div>
            <div
              className={classNames(
                "relative top-0 h-full w-[200vw] columns-xs gap-4 flex items-start overflow-y-hidden select-none transition-[margin-left] ease-in-out",
                {
                  "ml-[235px]": isImporting,
                }
              )}
            >
              {data?.columns?.map &&
                data?.columns.map((colData, index) => (
                  <SlateColumn
                    name={colData.name}
                    id={colData.id}
                    key={colData.id}
                    cards={colData.cards}
                    onNameChange={(newName) =>
                      setData((old) => ({
                        ...old,
                        columns: old.columns.toSpliced(index, 1, {
                          ...colData,
                          name: newName,
                        }),
                      }))
                    }
                    onInnerNameChange={(id, newName) =>
                      setData((old) => ({
                        ...old,
                        columns: old.columns.map((col) => {
                          if (col.id !== colData.id) {
                            return col;
                          }

                          return {
                            ...col,
                            cards: col.cards.map((card) => {
                              if (card.id !== id) {
                                return card;
                              }

                              if (card.type === "day") {
                                return {
                                  ...card,
                                  day: newName,
                                };
                              } else {
                                return {
                                  ...card,
                                  fileName: newName,
                                };
                              }
                            }),
                          };
                        }),
                      }))
                    }
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
