import { invoke } from "@tauri-apps/api";
import { notesFromBackend, RawNote, Tag } from "../types/types";

const showNotes = async (): Promise<RawNote[]> => {
  return new Promise((resolve, reject) => {
    invoke("get_notes")
      .then((data) => {
        const mappedData: RawNote[] = (data as notesFromBackend[]).map(
          (note) => {
            return {
              id: note.id,
              title: note.title,
              markdown: note.markdown,
              tagIds: JSON.parse(note.tag_ids) as string[],
              timestamp: note.timestamp,
            };
          }
        );
        return resolve(mappedData);
      })
      .catch((err) => reject(err as string));
  });
};

const showTags = async (): Promise<Tag[]> =>
  (await invoke("get_tags")) as Tag[];

const addNote = async (note: RawNote): Promise<string> => {
  const mappedNote = {
    id: note.id,
    title: note.title,
    markdown: note.markdown,
    tag_ids: JSON.stringify(note.tagIds),
    timestamp: note.timestamp,
  };

  return (await invoke("insert_note", { data: mappedNote })) as string;
};

const addTag = async (tag: Tag): Promise<string> => {
  return (await invoke("insert_tag", { data: tag })) as string;
};

const deleteNote = async (id: string): Promise<string> =>
  (await invoke("delete_note_by_id", { id: id })) as string;

const deleteTag = async (id: string): Promise<string> =>
  (await invoke("delete_tag_by_id", { id: id })) as string;

const updateNote = async (note: RawNote): Promise<string> => {
  const mappedNote = {
    id: note.id,
    title: note.title,
    markdown: note.markdown,
    tag_ids: JSON.stringify(note.tagIds),
    timestamp: note.timestamp,
  };

  return (await invoke("update_note_by_id", { note: mappedNote })) as string;
};

const updateTag = async (tag: Tag): Promise<string> =>
  (await invoke("update_tag_by_id", { tag: tag })) as string;

export {
  showNotes,
  showTags,
  addNote,
  addTag,
  deleteNote,
  deleteTag,
  updateNote,
  updateTag,
};
