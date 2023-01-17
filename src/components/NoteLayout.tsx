import { ReactElement } from "react";
import { Outlet, useParams } from "react-router-dom";
import { convertNotes, errorAlert, queryNote, queryTag } from "../helpers";

export function NoteLayout(): ReactElement {
  const { id } = useParams();

  const {
    isLoading: isLoadingTags,
    data: tags, // renombramos el objeto «data»
    error: errorTags,
  } = queryTag();

  const {
    isLoading: isLoadingNotes,
    data: notes, // renombramos el objeto «data»
    error: errorNotes,
  } = queryNote();

  if (isLoadingNotes || isLoadingTags) return <div>Loading…</div>;

  if (errorNotes) errorAlert(errorNotes);

  if (errorTags) errorAlert(errorTags);

  if (convertNotes(notes!, tags!).find((nt) => nt.id === id) == undefined) {
    return <></>;
  }

  return (
    <Outlet context={convertNotes(notes!, tags!).find((nt) => nt.id === id)} />
  );
}
