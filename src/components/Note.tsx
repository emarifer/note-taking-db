import { ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNote } from "../hooks/useNote";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Row, Col, Stack, Button, Badge } from "react-bootstrap";
import { deleteNote } from "../backend";
import { successAlert, errorAlert } from "../helpers";

export function Note(): ReactElement {
  const note = useNote();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
      successAlert();
    },
    onError: (error) => errorAlert(error as Error),
  });

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>{note.title}</h1>

          {note.tags.length > 0 && (
            <Stack gap={1} direction="horizontal" className="flex-wrap">
              {note.tags.map((tag) => (
                <Badge className="text-truncate" key={tag.id}>
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Col>

        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to={`/${note.id}/edit`}>
              <Button variant="primary">Edit</Button>
            </Link>

            <Button
              onClick={() => {
                deleteNoteMutation.mutate(note.id);
                navigate("/");
              }}
              variant="outline-danger"
            >
              Delete
            </Button>

            <Link to="/">
              <Button variant="outline-secondary">Back</Button>
            </Link>
          </Stack>
        </Col>
      </Row>

      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{note.markdown}</ReactMarkdown>
    </>
  );
}

/**
 * AÑADIDA LA OPCIÓN DE ESCRIBIR MARKDOWN Y ETIQUETAS HTML. VER:
 * https://stackoverflow.com/questions/70548725/any-way-to-render-html-in-react-markdown
 */
