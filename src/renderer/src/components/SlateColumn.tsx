import { Draggable, Droppable } from "react-beautiful-dnd";
import { createRef, useState } from "react";
import { useElectronStore } from "../util/useElectronStore";
import SlateCard from "./SlateCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareMinus } from "@fortawesome/free-regular-svg-icons";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import ContentEditable from "react-contenteditable";

export default function SlateColumn(props: SlateColumn & {onNameChange: ((newName: string) => void)}) {
  const { name, id, cards, onNameChange } = props;
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useElectronStore<FileDatabase>("cards");

  let index = 0;

  const removeGroup = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the group "${id}"?`
    );

    if (confirmDelete) {
      const dataCopy = JSON.parse(JSON.stringify(data)) as FileDatabase;

      dataCopy.columns = dataCopy.columns.filter((column) => column.id !== id);

      setData(dataCopy);
    }
  };
  const editableRef = createRef<HTMLElement>();
  return (
    <div className="bg-slate-100 rounded break-after-column min-w-[250px]">
      <div className="flex justify-between m-2 text-blue-500 text-xl">
        <ContentEditable
          className="font-header"
          innerRef={editableRef}
          html={name}
          onChange={(e) => onNameChange(e.target.value)}
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

      {!collapsed && <hr className="bg-blue-500 h-0.5 mb-2" />}

      {!collapsed && (
        <div className="p-2">
          <Droppable droppableId={id} key={id}>
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <>
                  {cards.map((item) => {
                    if (item.type == "day") {
                      return (
                        <Draggable
                          draggableId={item.id}
                          key={item.id}
                          index={index++}
                          isDragDisabled={item.type === "day"}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <h1 className="text-lg font-subheader italic mb-1 text-blue-500">
                                {item.day}
                              </h1>
                              <hr className="bg-blue-500 h-0.5 mb-2" />
                            </div>
                          )}
                        </Draggable>
                      );
                    } else {
                      return (
                        <SlateCard key={item.id} index={index++} {...item} />
                      );
                    }
                  })}
                </>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </div>
  );
}
