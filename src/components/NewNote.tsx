import { ReactElement } from "react";
import { NoteForm } from "./NoteForm";

export function NewNote(): ReactElement {
  return (
    <>
      <h1 className="mb-4">New Note</h1>

      <NoteForm isEditing={false} />
    </>
  );
}
