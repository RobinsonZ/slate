import {
  TestContext,
  TestMode,
  useSlateReducer,
} from "@renderer/context/context";
import fakeCardData from "@renderer/util/fakeCardData";
import classNames from "classnames";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import SlateColumnView from "./SlateColumnView";
import SlateImporter from "./SlateImporter";
import { useKeyPress } from "react-use";
import { v4 as uuidv4 } from "uuid";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faFolderOpen } from "@fortawesome/free-regular-svg-icons";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { faNoteSticky } from "@fortawesome/free-regular-svg-icons";

export function SlateDragManager(props: {}) {
  const [dragging, setDragging] = useState(false);
  const [isImporting, setImporting] = useState(false);
  const [testMode, setTestMode] = useState<TestMode>("button");
  const [showDev] = useKeyPress("Alt");

  const [data, dispatch] = useSlateReducer();

  const onDragEnd: OnDragEndResponder = (val) => {
    setDragging(false);
    const { draggableId, source, destination } = val;

    if (destination != null) {
      const sourceColumn =
        source.droppableId === "_IMPORTER"
          ? data.importerFiles
          : data.columns.find((column) => column.id === source.droppableId)
              ?.cards;

      if (!sourceColumn) {
        console.log(`Source column ${source.droppableId} didn't exist`);
        return;
      }
      const movingTask = sourceColumn.find(
        (c) => c.id === draggableId
      ) as SlateFile; // day headers are not draggable

      if (!movingTask) {
        console.log(`Column entry ${draggableId} does not exist`);
      }

      if (source.droppableId === "_IMPORTER") {
        dispatch({
          type: "remove_import",
          id: draggableId,
        });
      } else {
        dispatch({
          type: "remove_card",
          cardId: draggableId,
          columnId: source.droppableId,
        });
      }

      if (destination.droppableId != "_TRASH") {
        dispatch({
          type: "add_col_entry",
          columnId: destination.droppableId,
          index: destination.index,
          newEntry: movingTask,
        });
      }
    }
  };

  return (
    <DragDropContext
      onDragStart={() => setDragging(true)}
      onDragEnd={onDragEnd}
    >
      <TestContext.Provider value={testMode}>
        <header className="bg-[#f6f7fa] shadow fixed w-screen z-20">
          {/* no overflow-x-scroll as this needs to be handled by the browser, see https://github.com/atlassian/react-beautiful-dnd/issues/131#issuecomment-1144736558*/}
          <div className="mx-auto py-4 px-8">
            <h1 className="flex justify-between text-2xl font-sans font-bold tracking-tight text-gray-900">
              <div className="text-3xl p-1">Slate</div>

              <div>
                <button
                  className={classNames("inline mx-4 p-1 px-2 rounded text-xl", {
                    "bg-gray-200": isImporting,
                    "": !isImporting,
                  })}
                  onClick={() => {
                    dispatch({
                      type: "set_imports",
                      newImports: [],
                    });
                    setImporting((importing) => !importing);
                  }}
                >
                  <FontAwesomeIcon className="mr-2" icon={faNoteSticky} />
                  New Card
                </button>

                <button
                  className="inline mx-4 py-2 rounded text-xl"
                  onClick={() =>
                    dispatch({
                      type: "add_col",
                      newCol: {
                        name: "New Column",
                        id: uuidv4(),
                        cards: [
                          {
                            type: "day",
                            id: uuidv4(),
                            day: new Date().toString(),
                          },
                        ],
                      },
                    })
                  }
                >
                  <FontAwesomeIcon className="mr-2" icon={faSquarePlus} />
                  New Column
                </button>

                {showDev && (
                  <button
                    className="bg-blue-200 inline mx-2 p-1 py-2 rounded text-xl"
                    onClick={() =>
                      dispatch({
                        type: "set_columns",
                        newColumns: fakeCardData(),
                      })
                    }
                  >
                    reset cards
                  </button>
                )}

                {showDev && (
                  <button
                    className={classNames("inline mx-2 p-1 rounded text-xl", {
                      "bg-blue-500": testMode == "doubleclick",
                      "bg-blue-200": testMode != "doubleclick",
                    })}
                    onClick={() =>
                      setTestMode((mode) =>
                        mode == "doubleclick" ? "button" : "doubleclick"
                      )
                    }
                  >
                    Mode: {testMode}
                  </button>
                )}
              </div>
            </h1>
          </div>
        </header>
        <header
          className={classNames(
            "fixed z-10 top-0 left-0 h-screen w-[350px] ps-4 bg-white pt-[6rem] ease-in-out transition-transform p-4 overflow-scroll box-shadow",
            { "translate-x-[-350px]": !isImporting }
          )}
        >
          <SlateImporter />
        </header>
        {/* again, funny hack with the margins because we can't just have this be a child of an
 overarching thing containing the import screen */}
        <main
          className={classNames("min-h-screen max-h-screen absolute pt-20")}
        >
          <div className="absolute top-0 left-0 mx-auto pt-24 px-8 h-[100vh] pb-6 max-h-full w-full">
            <div className="fixed bottom-5 left-5 z-50">
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
                  "ml-[335px]": isImporting,
                }
              )}
            >
              {data?.columns?.map &&
                data?.columns.map((colData, index) => (
                  <SlateColumnView
                    name={colData.name}
                    id={colData.id}
                    key={colData.id}
                    cards={colData.cards}
                  />
                ))}
            </div>
          </div>
        </main>
      </TestContext.Provider>
    </DragDropContext>
  );
}
