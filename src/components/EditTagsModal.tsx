import { ReactElement } from "react";
import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTag, updateTag } from "../backend";
import { Tag } from "../types/types";
import { successAlert, errorAlert } from "../helpers";

interface EditTagsModalProps {
  show: boolean;
  handleClose: () => void;
  availableTags: Tag[];
}

export function EditTagsModal({
  show,
  handleClose,
  availableTags,
}: EditTagsModalProps): ReactElement {
  const queryClient = useQueryClient();

  const deleteTagMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries(["tags"]);
      successAlert();
    },
    onError: (error) => errorAlert(error as Error),
  });

  const updateTagMutation = useMutation({
    mutationFn: updateTag,
    onSuccess: () => queryClient.invalidateQueries(["tags"]),
  });

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header className="bg-dark" closeButton closeVariant="white">
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark">
        <Form>
          <Stack gap={2}>
            {availableTags.map((tag) => (
              <Row key={tag.id}>
                <Col>
                  <Form.Control
                    className="bg-primary text-white"
                    type="text"
                    value={tag.label}
                    onChange={(e) => {
                      const updateTag: Tag = {
                        id: tag.id,
                        label: e.target.value,
                      };

                      updateTagMutation.mutate(updateTag);
                    }}
                  />
                </Col>

                <Col xs="auto">
                  <Button
                    onClick={() => deleteTagMutation.mutate(tag.id)}
                    variant="outline-danger"
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
