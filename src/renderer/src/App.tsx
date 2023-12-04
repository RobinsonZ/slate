import { SlateDataProvider, TestContext, TestMode } from "./context/context";
import { SlateDragManager } from "./components/SlateDragManager";

function App(): JSX.Element {
  return (
    /* tailwind doesn't pick up classes in the index.html for some reason so I'm using bg-gray-500 here too,
    so that it'll get compiled into the built css */
    <div className="bg-[#f6f7fa] max-h-full">
      {/* this is its own component so it can consume the reducer context */}
      <SlateDataProvider>
        <SlateDragManager />
      </SlateDataProvider>
    </div>
  );
}

export default App;
