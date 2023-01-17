export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
  timestamp?: number;
};

export type Tag = {
  id: string;
  label: string;
};

export type Note = {
  id: string;
} & NoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
  timestamp: number;
};

export type RawNote = {
  id: string;
} & RawNoteData;

export type SimpliedNote = {
  tags: Tag[];
  title: string;
  id: string;
};

export type notesFromBackend = {
  id: string;
  title: string;
  markdown: string;
  tag_ids: string;
  timestamp: number;
};
