import { Droppable } from "react-beautiful-dnd";
import SlateCard from "./SlateCard";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import path from "path-browserify";
import { v4 as uuidv4 } from "uuid";
import { useSlateReducer } from "@renderer/context/context";

export default function SlateImporter() {
  const [{ importerFiles }, dispatch] = useSlateReducer();

  const [openLocation, setOpenLocation] = useState<string>();
  let index = 0;

  useEffect(() => {
    if (importerFiles.length == 0) {
      setOpenLocation(undefined);
    }
  }, [importerFiles]);

  return (
    <>
      <h2 className="font-header text-xl mb-2">Import Files</h2>
      {importerFiles.length == 0 && (
        <button
          className="font-subheader text-lg p-1 w-full rounded bg-cardDefault"
          onClick={() =>
            window.files.askForImport().then((value) => {
              console.log(value);
              if (value.length != 0) {
                const importFiles: SlateFile[] = value.map((filepath) => ({
                  fileName: path.basename(filepath),
                  filePath: filepath,
                  id: uuidv4(),
                  fileType: path.extname(filepath).slice(1),
                  type: "file",
                  tags: [],
                }));
                dispatch({
                  type: "set_imports",
                  newImports: importFiles,
                });
                setOpenLocation(path.dirname(value[0]));
              } else {
                dispatch({
                  type: "set_imports",
                  newImports: [],
                });
                setOpenLocation(undefined);
              }
            })
          }
        >
          Import local files
        </button>
      )}
      {openLocation && (
        <>
          <p className="font-detail mb-2">
            Importing from ../{path.basename(openLocation)}
          </p>
          <button
            className="font-subheader text-md p-1 w-full rounded bg-cardDefault mb-2"
            onClick={() => dispatch({
              type: "set_imports",
              newImports: [],
            })}
          >
            Change
          </button>
          <hr className="bg-black h-0.5 mb-2" />
          <Droppable droppableId={"_IMPORTER"} isDropDisabled={true}>
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <>
                  {importerFiles.map((item) => (
                    <SlateCard
                      columnId="_IMPORTER"
                      key={item.id}
                      index={index++}
                      {...item}
                    />
                  ))}
                </>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </>
      )}
    </>
  );
}
