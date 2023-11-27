import { TestContext } from "@renderer/context/context";
import { createRef, useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import ContentEditable from "react-contenteditable";

export default function SlateCard(
  props: SlateFile & {
    index: number;
    onInnerNameChange?: (id: string, newName: string) => void;
  }
) {
  const { id, fileName, fileType, tags, index, onInnerNameChange } = props;
  
  const testMode = useContext(TestContext)

  // SlateCard.tsx
  const bgColorClass =
    fileType === "pdf"
      ? "bg-cardPdf"
      : fileType === "docx"
      ? "bg-cardDocx"
      : "bg-cardDefault";

  const ref = createRef<HTMLElement>();
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className={`rounded p-2 mb-2 flex items-center justify-between ${bgColorClass} ${
            snapshot.isDragging ? "opacity-75" : "opacity-100"
          } shadow`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="flex flex-col justify-between w-full h-full">
            {onInnerNameChange ? (
              <ContentEditable
                className="self-start font-detail"
                innerRef={ref}
                html={fileName}
                onChange={(e) => onInnerNameChange(id, e.target.value)}
                tagName="h1"
              />
            ) : (
              <p className="self-start font-detail">{fileName}</p>
            )}
            {/* Spacer to push filetype to the bottom */}
            <div className="flex-grow"></div>
            {/* Align filetype label to the bottom-right */}
            <div className="self-end rounded bg-black bg-opacity-50 text-white p-1 font-label">
              <p>.{fileType}</p>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
