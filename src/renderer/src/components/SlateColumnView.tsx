import { Droppable } from "react-beautiful-dnd";
import { RefObject, createRef, useEffect, useRef, useState } from "react";
import SlateCard from "./SlateCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSquareMinus } from "@fortawesome/free-regular-svg-icons";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { useSlateReducer } from "@renderer/context/context";
import { SlateDate } from "./SlateDate";
import { v4 as uuidv4 } from "uuid";
import SlateEdiText from "./SlateEdiText";

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
      <div className="flex justify-between m-4 ml-2 text-xl">
        <SlateEdiText
          className="font-sans font-semibold grow"
          type="text"
          onSave={(newval) => {
            dispatch({
              type: "rename_column",
              columnId: id,
              name: newval,
            });
          }}
          inputProps={{
            className:
              "p-0.5 bg-transparent grow",
          }}
          viewProps={{
            className: "self-start h-full p-0.5 w-full cursor-pointer",
          }}
          submitOnEnter
          cancelButtonClassName="nothing"
          cancelButtonContent={""}
          saveButtonClassName="nothing"
          saveButtonContent={""}
          // editContainerClassName="flex flex-row"
          editButtonContent={
            <>edit&ensp;
              <FontAwesomeIcon icon={faEdit} />
            </>
          }
          editButtonClassName="rounded w-16 p-1.5 font-label text-sm text-black italic bg-opacity-50"
          value={name}
          showButtonsOnHover
          renderValue={(value) => (
            <h1>{value}</h1>
          )}
        />
        {/* <ContentEditable
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
        /> */}
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
              Add date...
            </h1>
          </div>
        </div>
      )}
    </div>
  );
}
