import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TestContext, useSlateReducer } from "@renderer/context/context";
import { createRef, useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import ContentEditable from "react-contenteditable";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export default function SlateCard(
  props: SlateFile & {
    index: number;
    columnId: string;
    allowEdit?: boolean
  }
) {
  const { id, fileName, fileType, tags, index, filePath, columnId, allowEdit } =
    props;

  const [data, dispatch] = useSlateReducer();

  const testMode = useContext(TestContext);

  // SlateCard.tsx
  const bgColorClass =
    fileType === "pdf"
      ? "bg-cardPdf"
      : fileType === "docx"
      ? "bg-cardDocx"
      : "bg-cardDefault";

  const ref = createRef<HTMLElement>();

  const handleDoubleClick = () => {
    if (testMode === "doubleclick") {
      window.files.openExternally(filePath);
    }
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          onDoubleClick={handleDoubleClick}
          ref={provided.innerRef}
          className={`rounded p-2 mb-2 flex items-center justify-between z-30 ${bgColorClass} ${
            snapshot.isDragging ? "opacity-75" : "opacity-100"
          } shadow`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="flex flex-col justify-between w-full h-full">
            {allowEdit ? (
              <ContentEditable
                className="self-start font-detail mb-1"
                innerRef={ref}
                html={fileName}
                onChange={(e) => dispatch({
                  type: "modify_entry",
                  targetType: "file",
                  columnId: columnId,
                  cardId: id,
                  newValue: e.target.value
                })}
                tagName="h1"
              />
            ) : (
              <p className="self-start font-detail mb-1">{fileName}</p>
            )}
            {/* Spacer to push filetype to the bottom */}
            <div className="flex-grow"></div>
            <div className="flex flex-row">
              <div className="flex-grow" />
              {testMode == "button" ? (
                <button
                  className="rounded w-16 p-1 font-label text-sm text-white italic bg-slate-500 bg-opacity-50"
                  onClick={() => window.files.openExternally(filePath)}
                >
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} /> .
                  {fileType}
                </button>
              ) : (
                <div className="rounded p-1.5 font-label text-sm text-white italic bg-slate-500 bg-opacity-50">
                  <p>.{fileType}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
