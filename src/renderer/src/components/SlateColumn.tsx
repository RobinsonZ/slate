import { Draggable, Droppable } from "react-beautiful-dnd";
import { RefObject, createRef, useRef, useState } from "react";
import { useElectronStore } from "../util/useElectronStore";
import SlateCard from "./SlateCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareMinus } from "@fortawesome/free-regular-svg-icons";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import ContentEditable from "react-contenteditable";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { useSlateReducer } from "@renderer/context/context";
import { SlateDate } from "./SlateDate";
import { v4 as uuidv4 } from "uuid";

export default function SlateColumnView(props: SlateColumn) {
  const { name, id, cards } = props;

  const [data, dispatch] = useSlateReducer();

  const [collapsed, setCollapsed] = useState(false);

  let index = 0;

  const removeGroup = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the column "${name}"?`
    );

    if (confirmDelete) {
      dispatch({
        type: "delete_column",
        columnId: id,
      });
    }
  };
  const titleEditRef = createRef<HTMLElement>();
  let lastRef: RefObject<HTMLElement>;
  return (
    <div className="bg-white shadow-lg hover:shadow-xl rounded break-after-column min-w-[300px] max-w-[300px] max-h-full overflow-y-scroll">
      <div className="flex justify-between m-4 text-xl">
        <ContentEditable
          className="font-sans font-semibold"
          innerRef={titleEditRef}
          html={name}
          onChange={(e) =>
            dispatch({
              type: "rename_column",
              columnId: id,
              name: e.target.value,
            })
          }
          tagName="h1"
        />
        <div>
          {!collapsed && (
            <FontAwesomeIcon
              className="mt-1 mr-1 cursor-pointer"
              icon={faSquareMinus}
              onClick={() => setCollapsed((collapse) => !collapse)}
            />
          )}
          {collapsed && (
            <FontAwesomeIcon
              className="mt-1 mr-1 cursor-pointer"
              icon={faSquarePlus}
              onClick={() => setCollapsed((collapse) => !collapse)}
            />
          )}

          <FontAwesomeIcon
            className="mt-1 cursor-pointer"
            icon={faTrashCan}
            onClick={removeGroup}
          />
        </div>
      </div>

      {!collapsed && <hr className="font-sans h-0.5 mb-2" />}

      {!collapsed && (
        <div className="p-2">
          <Droppable droppableId={id} key={id}>
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <>
                  {cards.map((item, index) => {
                    if (item.type == "day") {
                      return (
                        <SlateDate
                          columnId={id}
                          key={item.id}
                          index={index++}
                          isDragDisabled={true}
                        >
                          {(provided, snapshot) => {
                            const [dateEdit, setDateEdit] = useState(false);

                            return (
                              <div
                                ref={provided.innerRef}
                                className="min-h-[34px] mb-1"
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {/* <ContentEditable
                                  className="font-subheader text-lg italic mb-1 text-blue-500"
                                  innerRef={innerEditRef}
                                  html={item.day}
                                  onChange={(e) =>
                                    onInnerNameChange(item.id, e.target.value)
                                  }
                                  tagName="h1"
                                /> */}
                                {dateEdit ? (
                                  <DatePicker
                                    onChange={(newval) => {
                                      setDateEdit(false);
                                      onInnerNameChange(
                                        item.id,
                                        newval?.toString() || ""
                                      );
                                    }}
                                    onCalendarClose={() => setDateEdit(false)}
                                    value={item.day}
                                    isOpen={true}
                                  />
                                ) : (
                                  <h1
                                    className="font-sans text-lg mb-1 cursor-pointer"
                                    onClick={() => setDateEdit(true)}
                                  >
                                    {new Date(item.day).toLocaleString(
                                      "en-US",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                      }
                                    )}
                                  </h1>
                                )}

                                {/* <hr className="bg-blue-500 h-0.5 mb-2" /> */}
                              </div>
                            );
                          }}
                        </Draggable>
                          {...item}
                        />
                      );
                    } else {
                      return (
                        <SlateCard
                          columnId={id}
                          key={item.id}
                          index={index++}
                          {...item}
                          allowEdit
                        />
                      );
                    }
                  })}
                </>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div
            className="cursor-pointer text-center"
            onClick={() => {
              dispatch({
                type: "add_col_entry",
                index: "end",
                columnId: id,
                newEntry: {
                  type: "day",
                  id: uuidv4(),
                  day: new Date().toString(),
                },
              });
            }}
          >
            <h1 className="font-sans m-2 text-gray-400 inline-block">
              Add date
            </h1>
            {/* <hr className="bg-blue-500 h-0.5 mb-2" /> */}
          </div>
        </div>
      )}
    </div>
  );
}
