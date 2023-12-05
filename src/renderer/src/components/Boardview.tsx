import React, { useContext } from 'react';
import { SlateDataContext, useSlateReducer } from '@renderer/context/context';
import SlateCard from './SlateCard';
import SlateDate from './SlateDate';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

export default function BoardView() {
  const { columns } = useContext(SlateDataContext);
  const [data, dispatch] = useSlateReducer();

  // Handle drag end
  const onDragEnd = (result) => {
    // Logic to reorder cards on drag end
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {columns.map((column, columnIndex) => (
        <Droppable droppableId={column.id} key={column.id}>
          {(provided, snapshot) => (
            <div 
              ref={provided.innerRef} 
              {...provided.droppableProps}
              className="column-container"
            >
              <h2>{column.name}</h2>
              {column.cards.map((card, cardIndex) => {
                if (card.type === 'day') {
                  // Render SlateDate if the card is of type 'day'
                  return <SlateDate key={card.id} {...card} columnId={column.id} index={cardIndex} />;
                } else {
                  // Render SlateCard for other types
                  return <SlateCard key={card.id} {...card} columnId={column.id} index={cardIndex} allowEdit={true} />;
                }
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  );
}