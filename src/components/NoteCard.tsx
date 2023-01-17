import { ReactElement } from "react";
import { Badge, Card, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SimpliedNote } from "../types/types";
import styles from "./NoteCard.module.css";

export function NoteCard({ id, tags, title }: SimpliedNote): ReactElement {
  return (
    <Card
      as={Link}
      to={`/${id}`}
      className={`bg-dark border-secondary h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack
          gap={2}
          className="h-100 align-items-center justify-content-center"
        >
          <span className="fs-5">{title}</span>
          {tags.length > 0 && (
            <Stack
              gap={1}
              direction="horizontal"
              className="justify-content-center flex-wrap"
            >
              {tags.map((tag) => (
                <Badge key={tag.id} className="text-truncate">
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
}
