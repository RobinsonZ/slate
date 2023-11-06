import { Draggable, Droppable } from "react-beautiful-dnd";
import SlateCard, { SlateCardData } from "./SlateCard";

interface SlateColumnProps {
  name: string;
  id: string;
  items: [
    | {
        type: "day";
        id: string;
        day: string;
      }
    | ({ type: "file" } & SlateCardData),
  ];
}

export default function SlateColumn(props: SlateColumnProps) {
  const { name, id, items } = props;

  let index = 0;

  return (
    <div className="bg-slate-100 rounded break-after-column min-w-[250px]">
      <h1 className="text-xl mb-1 text-blue-500 m-2 font-header">{name}</h1>
      <hr className="bg-blue-500 h-0.5 mb-2" />
      <div className="p-2">
        <Droppable droppableId={id} key={id}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <>
                {items.map((item) => {
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
    </div>
  );
}
