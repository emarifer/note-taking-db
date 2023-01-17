import { ReactElement } from "react";
import { useNote } from "../hooks/useNote";
import { NoteForm } from "./NoteForm";

export function EditNote(): ReactElement {
  const note = useNote();

  return (
    <>
      <h1 className="mb-4">Edit Note</h1>

      <NoteForm
        title={note.title}
        markdown={note.markdown}
        tags={note.tags}
        isEditing={true}
      />
    </>
  );
}
