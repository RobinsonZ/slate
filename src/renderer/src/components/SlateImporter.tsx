import { Droppable } from "react-beautiful-dnd";
import SlateCard from "./SlateCard";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import path from "path-browserify";
import { v4 as uuidv4 } from "uuid";

interface SlateImporterProps {
  data: FileDatabase;
  importerFiles: SlateFile[];
  setImporterFiles: Dispatch<SetStateAction<SlateColumn>>;
}

export default function SlateImporter(props: SlateImporterProps) {
  const { data, importerFiles, setImporterFiles } = props;
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
      {!openLocation && (
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
                setImporterFiles((files) => ({
                  ...files,
                  cards: importFiles,
                }));
                setOpenLocation(path.dirname(value[0]));
              } else {
                setImporterFiles((files) => ({
                  ...files,
                  cards: [],
                }));
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
          className="font-subheader text-md p-1 w-full rounded bg-cardDefault mb-2" onClick={() => setOpenLocation(undefined)}>
            Change
          </button>
          <hr className="bg-black h-0.5 mb-2" />
          <Droppable droppableId={"_IMPORTER"}>
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <>
                  {importerFiles.map((item) => (
                    <SlateCard key={item.id} index={index++} {...item} />
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
