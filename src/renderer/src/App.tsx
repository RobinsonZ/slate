import { DragDropContext, OnDragEndResponder } from "react-beautiful-dnd";
import { useElectronStore } from "./util/useElectronStore";
import SlateColumn from "./components/SlateColumn";
import fakeCardData from "./util/fakeCardData";

function App(): JSX.Element {
  const [data, setData] = useElectronStore<FileDatabase>("cards");

  // copied from https://codesandbox.io/s/react-beautiful-dnd-experiment-4k722
  // which I found on https://stackoverflow.com/a/60092971/13644774
  const onDragEnd: OnDragEndResponder = (val) => {
    const { draggableId, source, destination } = val;
    const dataCopy = JSON.parse(JSON.stringify(data)) as FileDatabase; // stupid deep copy
    // first find the source column, then the day: split the ID by "&" and search
    // const [sourceColumnId] = source.droppableId
    const [sourceColumn] = dataCopy.columns.filter(
      (column) => column.name === source.droppableId
    );
    // same with destination column

    // Destination might be `null`: when a task is
    // dropped outside any drop area. In this case the
    // task reamins in the same column so `destination` is same as `source`
    if (destination != null) {
      const [destinationColumn] = dataCopy.columns.filter(
        (column) => column.name === destination.droppableId
      );

      // We save the task we are moving
      const [movingTask] = sourceColumn.cards.filter(
        (c) => c.id === draggableId
      );

      const newSourceCards = sourceColumn.cards.toSpliced(source.index, 1);
      const newDestinationCards = (
        source.droppableId === destination.droppableId
          ? newSourceCards
          : destinationColumn.cards
      ).toSpliced(destination.index, 0, movingTask);

      sourceColumn.cards = newSourceCards;
      destinationColumn.cards = newDestinationCards;
    }
    setData(dataCopy);
  };

  return (
    /* tailwind doesn't pick up classes in the index.html for some reason so I'm using bg-gray-500 here too,
    so that it'll get compiled into the built css */
    <div className="bg-gray-500">
      <header className="bg-white shadow fixed w-screen">
        {/* no overflow-x-scroll as this needs to be handled by the browser, see https://github.com/atlassian/react-beautiful-dnd/issues/131#issuecomment-1144736558*/}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1
            className="text-2xl font-bold tracking-tight text-gray-900 font-title"
          >
            TimeFinder
            <button
              className="bg-blue-500 inline mx-2 p-1 rounded text-xl"
              onClick={() => setData(fakeCardData())}
            >
              reset cards
            </button>
          </h1>
        </div>
      </header>
      <main className="min-h-full absolute top-16">
        <div className="mx-auto py-6 sm:px-6 lg:px-8">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="w-[200%] h-full columns-xs gap-4 flex items-start pb-16 overflow-y-hidden select-none">
              {data?.columns?.map && data?.columns.map((colData) => (
                <SlateColumn
                  name={colData.name}
                  id={colData.name}
                  key={colData.name}
                  cards={colData.cards}
                />
              ))}
            </div>
          </DragDropContext>
        </div>
      </main>
    </div>
  );
}

export default App;
