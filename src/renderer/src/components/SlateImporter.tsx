import { Droppable } from "react-beautiful-dnd";
import SlateCard from "./SlateCard";
import { useEffect, useState } from "react";
import path from "path-browserify";
import { v4 as uuidv4 } from "uuid";
import { useSlateReducer } from "@renderer/context/context";
import classNames from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faFolderOpen,
  faNoteSticky,
  faFile,
} from "@fortawesome/free-regular-svg-icons";

export default function SlateImporter() {
  const [{ importerFiles }, dispatch] = useSlateReducer();

  const [openLocation, setOpenLocation] = useState<string>();

  const [createFile, setCreateFile] = useState<boolean>(false);
  const [createFolder, setCreateFolder] = useState<boolean>(false);
  const [createNote, setCreateNote] = useState<boolean>(false);

  let index = 0;

  useEffect(() => {
    if (importerFiles.length == 0) {
      setOpenLocation(undefined);
    }
  }, [importerFiles]);

  function clearFiles() {
    dispatch({
      type: "set_imports",
      newImports: [],
    });
  }
  const showButtons = (importerFiles.length == 0 || createNote)
  return (
    <>
      {!openLocation && (
        <h2 className="font-sans font-bold text-xs mb-2 text-gray-800">
          Select Card Type
        </h2>
      )}

      <div className="flex justify-between mb-4">
        {showButtons && (
          <button
            className={classNames("inline mx-4 p-1.5 rounded font-bold", {
              "bg-gray-200": createFile,
            })}
            onClick={() => {
              setCreateFile((f) => !f);
              setCreateFolder(false);
              setCreateNote(false);
              clearFiles();
            }}
          >
            <FontAwesomeIcon className="mr-2" icon={faFile} />
            File
          </button>
        )}

        {showButtons && (
          <button
            className={classNames("inline mx-4 p-1.5 rounded font-bold", {
              "bg-gray-200": createFolder,
            })}
            onClick={() => {
              setCreateFile(false);
              setCreateFolder((c) => !c);
              setCreateNote(false);
              clearFiles();
            }}
          >
            <FontAwesomeIcon className="mr-2" icon={faFolder} />
            Folder
          </button>
        )}

        {showButtons && (
          <button
            className={classNames("inline mx-4 p-1.5 rounded font-bold", {
              "bg-gray-200": createNote,
            })}
            onClick={() => {
              setCreateFile(false);
              setCreateFolder(false);
              if (!createNote) {
                dispatch({
                  type: "set_imports",
                  newImports: [{
                    type: "note",
                    id: uuidv4(),
                    text: "This is a note!"
                  }],
                });
              } else {
                clearFiles();
              }
              setCreateNote((n) => !n);
            }}
          >
            <FontAwesomeIcon className="mr-2" icon={faNoteSticky} />
            Note
          </button>
        )}
      </div>

      {(createFile || createFolder) && !openLocation && (
        <button
          className={classNames(
            "font-sans font-bold text-md p-1 w-full rounded mb-2 bg-gray-200"
          )}
          onClick={() => {
            // Open file explorer
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
                clearFiles();
                setOpenLocation(undefined);
              }
            });
          }}
        >
          <FontAwesomeIcon className="mr-2" icon={faFolderOpen} />
          Open File Explorer
        </button>
      )}

      {(createFile || createFolder) && openLocation && (
        <>
          <p className="font-sans font-bold -mt-6 mb-2 text-md text-gray-800">
            Importing from ../{path.basename(openLocation)}
          </p>
          <button
            className="font-sans text-md font-bold p-1 w-full rounded mb-2 bg-gray-200"
            onClick={() =>
              dispatch({
                type: "set_imports",
                newImports: [],
              })
            }
          >
            Return
          </button>
          <hr className="bg-black h-0.5 mb-2" />
        </>
      )}

      {(openLocation || createNote) && (
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
      )}
    </>
  );
}
