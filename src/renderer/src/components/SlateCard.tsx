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

  // SlateCard.tsx
  const bgColorClass = fileType === "pdf" ? "bg-cardPdf" : fileType === "docx" ? "bg-cardDocx" : "bg-cardDefault";

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          // Apply flex container, space between items, and dynamic background color class
          className={`rounded p-1 mb-2 flex justify-between ${bgColorClass} ${snapshot.isDragging ? "opacity-75" : "opacity-100"}`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="flex justify-between w-full">
            <p>{fileName}</p>
            {/* <p>.{fileType.toUpperCase()}</p>  Not sure I love the uppercase*/}
            <p>.{fileType}</p>
          </div>
        </div>
      )}
    </Draggable>
  );
}
