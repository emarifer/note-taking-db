import { ReactElement, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Tag, RawNote } from "../types/types";
import { EditTagsModal } from "./EditTagsModal";
import { NoteCard } from "./NoteCard";
import { reactSelectStyles } from "../react-select-styles.js";
import { convertNotes, errorAlert, queryNote, queryTag } from "../helpers";

export function NoteList(): ReactElement {
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

  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);

  const filteredNotes = (notes: RawNote[], tags: Tag[]) => {
    const convertedNotes = convertNotes(notes!, tags!);

    return convertedNotes.filter((note) => {
      return (
        (title === "" ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) =>
            note.tags.some((noteTag) => noteTag.id === tag.id)
          ))
      );
    });
  };

  if (isLoadingNotes || isLoadingTags) return <div>Loading…</div>;

  if (errorNotes) errorAlert(errorNotes);

  if (errorTags) errorAlert(errorTags);

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Notes</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/new">
              <Button variant="primary">Create</Button>
            </Link>
            <Button
              onClick={() => setEditTagsModalIsOpen(true)}
              variant="outline-secondary"
            >
              Edit Tags
            </Button>
          </Stack>
        </Col>
      </Row>

      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                className="bg-dark text-white"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelect
                styles={reactSelectStyles}
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                options={tags?.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return { label: tag.label, id: tag.value };
                    })
                  );
                }}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes(notes!, tags!).map((note) => (
          <Col key={note.id}>
            <NoteCard
              id={note.id}
              title={note.title}
              tags={note.tags}
              timestamp={note.timestamp}
            />
          </Col>
        ))}
      </Row>

      <EditTagsModal
        show={editTagsModalIsOpen}
        handleClose={() => setEditTagsModalIsOpen(false)}
        availableTags={tags!}
      />
    </>
  );
}
