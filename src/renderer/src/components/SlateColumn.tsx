import { Droppable } from "react-beautiful-dnd";
import SlateCard, { SlateCardData } from "./SlateCard";
import { StrictModeDroppable } from "./StrictModeDroppable";

interface SlateColumnProps {
  name: string;
  id: string;
  dayData: [
    {
      date: string;
      cards: [SlateCardData];
    },
  ];
}

export default function SlateColumn(props: SlateColumnProps) {
  const { name, id, dayData } = props;

  return (
    <div className="p-2 bg-slate-100 rounded max-w-xs">
      <h1 className="text-xl font-serif mb-1 text-blue-500">{name}</h1>
      <hr className="stroke-blue-500 stroke-2" />
      <div>
        {dayData.map((day) => {
          const { date, cards } = day;

          return (
            <StrictModeDroppable droppableId={id + "&" + date} key={id + "&" + date}>
              {(provided, snapshot) => (
                <div
                  key={id + "&" + date}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h1 className="text-lg font-sans mb-1 text-blue-500">
                    {date}
                  </h1>
                  <hr className="stroke-blue-500 stroke-2" />
                  {cards.map((card) => (
                    <SlateCard key={card.id} data={card}></SlateCard>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </StrictModeDroppable>
          );
        })}
      </div>
    </div>
  );
}
