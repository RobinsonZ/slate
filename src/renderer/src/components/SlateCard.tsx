import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TestContext, useSlateReducer } from "@renderer/context/context";
import { ReactNode, createRef, useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import SlateEdiText from "./SlateEdiText";
import Markdown from "react-markdown";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

export default function SlateCard(
  props: (SlateFile | SlateNote) & {
    index: number;
    columnId: string;
    allowEdit?: boolean;
  }
) {
  const { id, index, columnId, allowEdit, type, startDate } = props; 

  const [data, dispatch] = useSlateReducer();

  const testMode = useContext(TestContext);

  // SlateCard.tsx
  const bgColorClass =
    type === "file"
      ? props.fileType === "pdf"
      
        ? "bg-cardPdf"
        : props.fileType === "docx"
        ? "bg-cardDocx"
        : "bg-cardDefault"
      : "bg-cardDefault";

  const ref = createRef<HTMLElement>();

  const handleDoubleClick = () => {
    if (testMode === "doubleclick" && type == "file") {
      window.files.openExternally(props.fileType);
    }
  };

  let contents: ReactNode;

  if (type == "file") {
    const { fileName, fileType, tags, filePath, id } = props;
    const startDate = getStartDate(id); // Fetch startDate using getStartDate function

    contents = (
      <>
        <p className="self-start font-detail mb-1">{fileName}</p>
        {/* Spacer to push filetype to the bottom */}
        <div className="flex-grow"></div>
        <div className="flex flex-row">
          <div className="flex-grow" />
          {testMode == "button" ? (
            <button
              className="rounded w-16 p-1 font-label text-sm text-white italic bg-slate-500 bg-opacity-50"
              onClick={() => window.files.openExternally(filePath)}
            >
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} /> .{fileType}
            </button>
          ) : (
            <div className="rounded p-1.5 font-label text-sm text-white italic bg-slate-500 bg-opacity-50">
              <p>.{fileType}</p>
            </div>
          )}
        </div>{" "}
      </>
    );
  } else {
    const { text } = props;
    contents = (
      <SlateEdiText
        value={text}
        type="textarea"
        viewContainerClassName="flex flex-col items-end"
        inputProps={{
          className:
            "block w-full h-full p-0.5 outline-none bg-transparent resize-none font-mono text-sm",
          onFocus: (e: any) => {
            // absolutely horrendous hack but hey it works
            e.target.style.height = e.target.scrollHeight + "px";
          },
          onInput: (e: any) => {
            // absolutely horrendous hack but hey it works
            e.target.style.height = e.target.scrollHeight + "px";
          },
        }}
        saveButtonClassName="rounded h-full p-1.5 font-label text-white italic bg-slate-500 bg-opacity-50 self-end mr-2"
        cancelButtonClassName="rounded h-full p-1.5 font-label text-red-500 italic bg-slate-500 bg-opacity-50 self-end"
        editButtonClassName="h-full rounded w-16 p-1.5 font-label text-sm text-white italic bg-slate-500 bg-opacity-50 self-end"
        editButtonContent={
          <>
            <FontAwesomeIcon icon={faEdit} />
            &nbsp;&nbsp;note
          </>
        }
        renderValue={(value) => (
          <Markdown
            className="prose prose-neutral prose-blue prose-p:text-black prose-li:text-black prose-li:marker:text-black"
            // images are busted because I can't be bothered to figure out content security policy
            disallowedElements={["img"]}
            components={{
              h1: "h2",
              a: (props) => (
                <a href={props.href} target="_blank" rel="noreferrer">
                  {props.children}
                </a>
              ),
            }}
          >
            {value}
          </Markdown>
        )}
        hint="Try using Markdown!"
        onSave={(newVal) =>
          dispatch({
            type: "modify_entry",
            columnId: columnId,
            cardId: id,
            targetType: "note",
            newValue: newVal,
          })
        }
      />
    );
  }
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
            {contents}
          </div>
        </div>
      )}
    </Draggable>
  );
}
