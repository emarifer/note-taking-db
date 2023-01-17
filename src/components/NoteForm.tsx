import { ReactElement, FormEvent, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useNote } from "../hooks/useNote";
import CreatableReactSelect from "react-select/creatable";
import { NoteData, Tag, RawNote } from "../types/types";

import { reactSelectStyles } from "../react-select-styles.js";
import { addNote, addTag, updateNote } from "../backend";
import { errorAlert, queryTag, successAlert } from "../helpers";

type NoteFormProps = { isEditing: boolean } & Partial<NoteData>;
// Con «Partial» los datos adicionales serán opcionales

export function NoteForm({
  title = "",
  markdown = "",
  tags = [],
  isEditing,
}: NoteFormProps): ReactElement {
  const note = useNote();

  const {
    isLoading: isLoadingTags,
    data: availableTags, // renombramos el objeto «data»
  } = queryTag();

  const queryClient = useQueryClient();

  const addNoteMutation = useMutation({
    mutationFn: addNote,
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
      successAlert();
    },
    onError: (error) => errorAlert(error as Error),
  });

  const addTagMutation = useMutation({
    mutationFn: addTag,
    onSuccess: () => queryClient.invalidateQueries(["tags"]),
    onError: (error) => errorAlert(error as Error),
  });

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
      successAlert();
    },
    onError: (error) => errorAlert(error as Error),
  });

  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);

  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);

  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!isEditing) {
      const newNote: RawNote = {
        id: crypto.randomUUID(),
        title: titleRef.current!.value,
        markdown: markdownRef.current!.value,
        tagIds: selectedTags.map((tag) => tag.id),
        timestamp: Date.now(),
      };

      addNoteMutation.mutate(newNote);
    } else {
      const updateNote: RawNote = {
        id: note.id,
        title: titleRef.current!.value,
        markdown: markdownRef.current!.value,
        tagIds: selectedTags.map((tag) => tag.id),
        timestamp: note.timestamp!,
      };

      updateNoteMutation.mutate(updateNote);
    }

    navigate("..");
  };

  if (isLoadingTags) return <div>Loading…</div>;

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <Row>
            <Col>
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  className="bg-dark text-white"
                  ref={titleRef}
                  required
                  defaultValue={title}
                  autoFocus
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="tags">
                <Form.Label>Tags</Form.Label>
                <CreatableReactSelect
                  styles={reactSelectStyles}
                  onCreateOption={(label) => {
                    const newTag: Tag = { id: crypto.randomUUID(), label };
                    addTagMutation.mutate(newTag);
                    setSelectedTags((prevTags) => [...prevTags, newTag]);
                  }}
                  value={selectedTags.map((tag) => {
                    // Hacemos una conversión al valor que espera el «Select»
                    return { label: tag.label, value: tag.id };
                  })}
                  options={availableTags!.map((tag) => {
                    // Hacemos una conversión al valor que espera el «Select»
                    return { label: tag.label, value: tag.id };
                  })}
                  onChange={(tags) => {
                    setSelectedTags(
                      tags.map((tag) => {
                        // Deshacemos la conversión anterior, para rehacer nuestro tipo «Tag»
                        return { label: tag.label, id: tag.value };
                      })
                    );
                  }}
                  isMulti
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="markdown">
            <Form.Label>Body</Form.Label>
            <Form.Control
              className="bg-dark text-white"
              ref={markdownRef}
              required
              defaultValue={markdown}
              as="textarea"
              rows={15}
            />
          </Form.Group>
          <Stack direction="horizontal" gap={2} className="justify-content-end">
            <Button type="submit" variant="primary">
              Save
            </Button>
            <Link to="..">
              <Button type="button" variant="outline-secondary">
                Cancel
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Form>
    </>
  );
}

/*
 * CUSTUMIZACIÓN DE REACT-SELECT. VER:
 * https://react-select.com/styles#styles
 * https://blog.logrocket.com/getting-started-react-select/
 * https://www.youtube.com/watch?v=3u_ulMvTYZI
 * https://www.mamd4.com/colores-bootstrap-hexadecimales
 */
