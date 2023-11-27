import { createContext } from "react";

export type TestMode = "doubleclick" | "button"

export const TestContext = createContext<TestMode>(
  "doubleclick"
);
