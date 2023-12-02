import { Draft } from "immer";
import {
  Dispatch,
  PropsWithChildren,
  Reducer,
  createContext,
  useContext,
  useReducer,
} from "react";
import { ImmerReducer, useImmerReducer } from "use-immer";

export type TestMode = "doubleclick" | "button";

export const TestContext = createContext<TestMode>("doubleclick");

type SlateAction =
  | {
      type: "set_columns";
      newColumns: SlateColumn[];
    }
  | {
      type: "set_imports";
      newImports: SlateFile[];
    }
  | {
      type: "remove_card";
      columnId: string;
      cardId: string;
    }
  | {
      type: "remove_import";
      id: string;
    }
  | {
      type: "add_col";
      newCol: SlateColumn;
    }
  | {
      type: "add_col_entry";
      columnId: string;
      index: number | "end";
      newEntry: SlateFile | SlateDayHeader;
    }
  | {
      type: "modify_entry";
      columnId: string;
      cardId: string;
      targetType: "file" | "day";
      newValue: string;
    }
  | {
      type: "rename_column";
      columnId: string;
      name: string;
    }
  | {
      type: "delete_column";
      columnId: string;
    };

const slateDataReducer: ImmerReducer<FileDatabase, SlateAction> = (
  draft: Draft<FileDatabase>,
  action: SlateAction
) => {
  switch (action.type) {
    case "set_columns": {
      draft.columns = action.newColumns;
      return draft;
    }
    case "set_imports": {
      draft.importerFiles = action.newImports;
      return draft;
    }
    case "remove_card": {
      const removeCol = draft.columns.find((col) => col.id == action.columnId);
      if (removeCol) {
        removeCol.cards = removeCol.cards.filter(
          (card) => card.id !== action.cardId
        );
      } else {
        console.error(
          `Tried to add entry to nonexistent column ${action.columnId}`
        );
      }
      return draft;
    }
    case "remove_import": {
      draft.importerFiles = draft.importerFiles.filter(
        (file) => file.id !== action.id
      );
      return draft;
    }
    case "add_col": {
      draft.columns.push(action.newCol);
      return draft;
    }
    case "add_col_entry": {
      const addingCol = draft.columns.find((col) => col.id == action.columnId);
      if (addingCol) {
        if (action.index == "end") {
          addingCol.cards.push(action.newEntry);
        } else {
          addingCol.cards.splice(action.index, 0, action.newEntry);
        }
      } else {
        console.error(
          `Tried to add entry to nonexistent column ${action.columnId}`
        );
      }
      return draft;
    }
    case "modify_entry": {
      const col = draft.columns.find((col) => col.id == action.columnId);
      if (col) {
        const card = col.cards.find((card) => card.id === action.cardId);

        if (!card || card.type !== action.targetType) {
          console.error(
            `Tried to change name of ${action.cardId} in ${action.columnId}, but that card doesn't exist or is the wrong type`
          );
        } else {
          if (card.type === "file") {
            card.fileName = action.newValue;
          } else {
            card.day = action.newValue;
          }
        }
      } else {
        console.error(
          `tried to rename card in nonexistent column ${action.columnId}`
        );
      }
      return draft;
    }
    case "rename_column": {
      const col = draft.columns.find((col) => col.id == action.columnId);
      if (col) {
        col.name = action.name;
      } else {
        console.error(
          `tried to rename card in nonexistent column ${action.columnId}`
        );
      }
      return draft;
    }
    case "delete_column": {
      const index = draft.columns.findIndex(
        (col) => col.id === action.columnId
      );
      if (index == -1) {
        console.error(`tried to delete nonexistent column ${action.columnId}`);
      } else {
        draft.columns.splice(index, 1);
      }

      return draft;
    }
  }
};

export const SlateDispatchContext = createContext<Dispatch<SlateAction>>(
  () => {} // no-op by default; will be filled in later
);

export const SlateDataContext = createContext<FileDatabase>({
  columns: [],
  importerFiles: [],
});

export function SlateDataProvider(props: PropsWithChildren) {
  const { children } = props;
  const [data, dispatch] = useImmerReducer<FileDatabase, SlateAction>(
    slateDataReducer,
    {
      columns: [],
      importerFiles: [],
    }
  );

  return (
    <SlateDataContext.Provider value={data}>
      <SlateDispatchContext.Provider value={dispatch}>
        {children}
      </SlateDispatchContext.Provider>
    </SlateDataContext.Provider>
  );
}

export function useSlateReducer(): [FileDatabase, Dispatch<SlateAction>] {
  return [useContext(SlateDataContext), useContext(SlateDispatchContext)];
}
