import { DragDropContext, OnDragEndResponder } from "react-beautiful-dnd";
import { useElectronStore } from "./util/useElectronStore";
import SlateColumn from "./components/SlateColumn";

function App(): JSX.Element {
  const [data, setData] = useElectronStore("cards");

  // if (!data) {
  //   setData([
  //     {
  //       name: "english",
  //       dayData: [
  //         {
  //           date: "Sept 18",
  //           cards: [
  //             {
  //               id: "aaaaa",
  //               fileName: "fooo1",
  //               fileType: "docx",
  //               tags: [],
  //               index: 0,
  //             },
  //             {
  //               id: "aaaaa2",
  //               fileName: "fooo2",
  //               fileType: "pdf",
  //               tags: [],
  //               index: 1,
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ]);
  // }

  // copied from https://codesandbox.io/s/react-beautiful-dnd-experiment-4k722
  // which I found on https://stackoverflow.com/a/60092971/13644774
  const onDragEnd: OnDragEndResponder = (val) => {
    const { draggableId, source, destination } = val;
    const dataCopy = JSON.parse(JSON.stringify(data)); // stupid deep copy
    // first find the source column, then the day: split the ID by "&" and search
    const [sourceColumnId, sourceDate] = source.droppableId.split("&");
    const [sourceColumn] = dataCopy.filter(
      (column) => column.name === sourceColumnId
    );
    // then find the date
    const [sourceDay] = sourceColumn.dayData.filter(
      (day) => day.date === sourceDate
    );
    console.log(sourceColumn, sourceDay)
    // same with destination column
    const [destColumnId, destDate] = destination?.droppableId?.split("&") || [
      null,
      null,
    ];
    // Destination might be `null`: when a task is
    // dropped outside any drop area. In this case the
    // task reamins in the same column so `destination` is same as `source`
    if (destination != null) {
        const [destinationColumn] = dataCopy.filter(
          (column) => column.name === destColumnId
        );
        const [destinationDay] = destinationColumn.dayData.filter(
          (day) => day.date === destDate
        );
        console.log(destinationColumn, destinationDay)
        // We save the task we are moving
        const [movingTask] = sourceDay.cards.filter(
          (c) => c.id === draggableId
        );
        console.log(movingTask)

        console.log(source, destination)
        const newSourceCards = sourceDay.cards.toSpliced(source.index, 1);
        const newDestinationCards = (source.droppableId === destination.droppableId ? newSourceCards : destinationDay.cards).toSpliced(
          destination.index,
          0,
          movingTask
        );
        console.log(dataCopy);
        sourceDay.cards = newSourceCards;
        destinationDay.cards = newDestinationCards;
        console.log(dataCopy);
      // Mapping over the task lists means that you can easily
      // add new columns
      // const newTaskList = dataCopy.map((column) => {
      //   if (column.name === sourceColumnId || column.name === destColumnId) {
      //     return {
      //       name: column.name,
      //       dayData: column.dayData.map((day) => {
      //         if (day.date === sourceDate) {
      //           return {
      //             date: day.date,
      //             cards: newSourceCards
      //           }
      //         }
      //         if (day.date === destDate) {
      //           return {
      //             date: day.date,
      //             cards: newDestinationCards
      //           }
      //         }
      //         return day;
      //       }),
      //     };
      //   }
      //   return column;
      // });
    }
    setData(dataCopy);
  };

  return (
    /* tailwind doesn't pick up classes in the index.html for some reason so I'm using bg-gray-500 here too,
    so that it'll get compiled into the built css */
    <div className="bg-gray-500">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1
            className="text-2xl font-bold tracking-tight text-gray-900"
            onClick={(_e) => setData("spam")}
          >
            TimeFinder
          </h1>
        </div>
      </header>
      <main className="min-h-full">
        <div className="mx-auto py-6 sm:px-6 lg:px-8">
          <DragDropContext onDragEnd={onDragEnd}>
            {data.map((colData) => (
              <SlateColumn
                name="English"
                id={colData.name}
                key={colData.name}
                dayData={colData.dayData}
              />
            ))}
          </DragDropContext>
        </div>
      </main>
    </div>
  );
}

export default App;
