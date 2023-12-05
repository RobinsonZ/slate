import { useSlateReducer } from "@renderer/context/context";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import DatePicker from "react-date-picker";
import EdiText from "react-editext";
import SlateEdiText from "./SlateEdiText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

interface SlateDateProps {
  columnId: string;
  index: number;
}

// stupid stupid stupid https://stackoverflow.com/a/33909265/13644774
function parseISOLocal(s: any) {
  var b = s.split(/-/);
  console.log(b);
  return new Date(b[0], b[1] - 1, b[2]);
}

export function SlateDate(props: SlateDayHeader & SlateDateProps) {
  const { columnId, id, index, day } = props;
  const [data, dispatch] = useSlateReducer();

  return (
    <Draggable draggableId={id} key={id} index={index} isDragDisabled={true}>
      {(provided, snapshot) => {
        const [dateEdit, setDateEdit] = useState(false);

        return (
          <div
            ref={provided.innerRef}
            className="min-h-[34px] mb-2"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <SlateEdiText
              type="date"
              onSave={(newval) => {
                // on blur this sends the full date string with a timezone.
                // on save button click it sends "2023-01-01" for example.
                // I hate this.

                let parsed = /\d{4}-\d{2}-\d{2}/.test(newval)
                  ? parseISOLocal(newval)
                  : new Date(newval);
                console.log(newval, parsed);
                dispatch({
                  type: "modify_entry",
                  targetType: "day",
                  columnId: columnId,
                  cardId: id,
                  newValue: parsed.toISOString() || "",
                });
              }}
              inputProps={{
                value: new Date(day).toISOString().substring(0, 10),
                className:
                  "h-full p-0.5 outline-none bg-transparent resize-none text-lg grow mb-0.5",
              }}
              cancelButtonClassName="nothing"
              cancelButtonContent={""}
              saveButtonClassName="self-end p-0.5 text-lg mb-1"
              editContainerClassName="flex flex-row"
              editButtonContent={
                <>
                  edit&ensp;
                  <FontAwesomeIcon icon={faEdit} />
                </>
              }
              editButtonClassName="h-full w-28 text-end rounded p-1.5 font-label text-sm text-black italic bg-opacity-50 self-end"
              value={new Date(day).toISOString().substring(0, 10)}
              showButtonsOnHover
              renderValue={(value) => (
                <h1 className="font-sans text-lg mb-1 cursor-pointer">
                  {new Date(value).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    timeZone: "utc"
                  })}
                </h1>
              )}
            />
            <hr className="h-0.5 mb-2" />
          </div>
        );
      }}
    </Draggable>
  );
}
