import { useSlateReducer } from "@renderer/context/context";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import DatePicker from "react-date-picker";

interface SlateDateProps {
  columnId: string;
  index: number;
}

export function SlateDate(props: SlateDayHeader & SlateDateProps) {
  const {  columnId, id, index, day } = props;
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
            {dateEdit ? (
              <DatePicker
                onChange={(newval) => {
                  setDateEdit(false);
                  dispatch({
                    type: "modify_entry",
                    targetType: "day",
                    columnId: columnId,
                    cardId: id,
                    newValue: newval?.toString() || "",
                  });
                }}
                onCalendarClose={() => setDateEdit(false)}
                value={day}
                isOpen={true}
              />
            ) : (
              <h1
                className="font-sans text-lg mb-1 cursor-pointer"
                onClick={() => setDateEdit(true)}
              >
                {new Date(day).toLocaleString("en-US", {
                  day: "2-digit",
                  month: "short",
                })}
              </h1>
            )}

            <hr className="h-0.5 mb-2" />
          </div>
        );
      }}
    </Draggable>
  );
}
