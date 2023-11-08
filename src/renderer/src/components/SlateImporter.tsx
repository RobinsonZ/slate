import { Droppable } from "react-beautiful-dnd";
import SlateCard from "./SlateCard";

interface SlateImporterProps {
  data: FileDatabase;
  importerFiles: SlateFile[];
}

export default function SlateImporter(props: SlateImporterProps) {
  const { data, importerFiles } = props;
  let index = 0;

  return (
    <>
      <h2 className="font-header text-xl mb-2">Import Files</h2>
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
  );
}
