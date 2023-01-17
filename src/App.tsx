import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { EditNote, NewNote, Note, NoteLayout, NoteList } from "./components";
import { appWindow } from "@tauri-apps/api/window";

import "sweetalert2/dist/sweetalert2.min.css";
import styles from "./App.module.css";

function App() {
  const location = useLocation();

  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransistionStage] = useState(styles.fadeIn);

  useEffect(() => {
    if (location !== displayLocation) setTransistionStage(styles.fadeOut);
  }, [location, displayLocation]);

  return (
    <Container
      tabIndex={0}
      onKeyUp={(e: React.KeyboardEvent<HTMLElement>) => {
        if (e.ctrlKey && e.key === "q") appWindow.close();
      }}
      className={`my-4 ${transitionStage}`}
      onAnimationEnd={() => {
        if (transitionStage === styles.fadeOut) {
          setTransistionStage(styles.fadeIn);
          setDisplayLocation(location);
        }
      }}
    >
      <Routes location={displayLocation}>
        <Route path="/" element={<NoteList />} />

        <Route path="/new" element={<NewNote />} />
        <Route path="/:id" element={<NoteLayout />}>
          <Route index element={<Note />} />

          <Route path="edit" element={<EditNote />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;

/*
 * MODIFICAR ELEMENTOS PADRES EN BOOTSTRAP. VER:
 * https://stackoverflow.com/questions/42464888/how-do-i-change-the-background-color-of-the-body
 */
