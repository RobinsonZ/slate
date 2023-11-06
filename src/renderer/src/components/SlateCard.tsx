import { Draggable } from "react-beautiful-dnd";

export interface SlateCardData {
  id: string;
  fileName: string;
  fileType: "pdf" | "docx";
  tags: [string];
}

export default function SlateCard(props: SlateCardData & {index: number}) {
  const {
    id, fileName, fileType, tags, index
  } = props;

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className="bg-blue-500 rounded p-1 mb-2"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <p>{fileName}</p>        
        </div>
      )}
    </Draggable>
  );
}
