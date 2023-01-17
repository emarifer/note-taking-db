import { useOutletContext } from "react-router-dom";
import { Note } from "../types/types";

export function useNote() {
  return useOutletContext<Note>();
}
