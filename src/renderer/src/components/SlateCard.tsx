import { Draggable } from "react-beautiful-dnd";

export interface SlateCardData {
  id: string;
  fileName: string;
  fileType: "pdf" | "docx";
  tags: [string];
  index: number;
}

export default function SlateCard(props: { data: SlateCardData }) {
  const {
    data: { id, fileName, fileType, tags, index },
  } = props;

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className="bg-blue-500 rounded p-1 m-1"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <p>{fileName}</p>        
        </div>
      )}
    </Draggable>
  );
}
