import { Label, Note } from "./types"; // Import the Label type from the appropriate module
import { dummyNotesList } from "./constants"; // Import the dummyNotesList from the appropriate module
import { ToggleTheme, FavoriteNotes } from "./hooksExercise";
import React, { useState, useEffect, useContext } from 'react';
import { themes, ThemeContext } from "./themeContext";
import './App.css';

function App() {

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [theme, setTheme] = useState(themes.light);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === themes.light ? themes.dark : themes.light);
  };

  const toggleFavorite = (noteTitle: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (prevFavorites.has(noteTitle)) {
        newFavorites.delete(noteTitle);
      } else {
        newFavorites.add(noteTitle);
      }
      return newFavorites;
    });
  };

  useEffect(() => {
    console.log("Favorites updated: ", Array.from(favorites));
  }, [favorites]);

  const [notes, setNotes] = useState(dummyNotesList);
  const initialNote = {
    id: -1,
    title: "",
    content: "",
    label: Label.other,
  };
  const [createNote, setCreateNote] = useState(initialNote);
  const [selectedNote, setSelectedNote] = useState<Note | null>(initialNote);

  const createNoteHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const newNote = {
      ...createNote,
      id: notes.length + 1
    };

    setNotes(prevNotes => [newNote, ...prevNotes]);
    setCreateNote({ ...initialNote });
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
  };

  const handleChange = (value: string, field: 'title' | 'content' | 'label') => {
    if (selectedNote) {
      setSelectedNote({
        ...selectedNote,
        [field]: field === 'label' ? value as Label : value
      });
    }
  };

  const handleSaveChanges = () => {
    if (selectedNote) {
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === selectedNote.id ? selectedNote : note
        )
      );
      setSelectedNote(null);
    }
  };

  const handleDeleteNote = (noteId: number) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div className='app-container' style={{ backgroundColor: theme.background, color: theme.foreground }}>

        <form className="note-form" onSubmit={createNoteHandler}>
          <div><input placeholder="Note Title"
            value={createNote.title}
            onChange={(event) => setCreateNote({ ...createNote, title: event.target.value })}
            style={{ backgroundColor: theme.noteBackground, color: theme.foreground, borderColor: theme.foreground }}
            required>
          </input>
          </div>
          <div><textarea value={createNote.content}
            onChange={(event) => setCreateNote({ ...createNote, content: event.target.value })}
            style={{ backgroundColor: theme.noteBackground, color: theme.foreground, borderColor: theme.foreground }}
            required>
          </textarea>
          </div>

          <div>
            <select
              onChange={(event) =>
                setCreateNote({ ...createNote, label: event.target.value as Label })}
              required>
              <option value={Label.personal}>Personal</option>
              <option value={Label.study}>Study</option>
              <option value={Label.work}>Work</option>
              <option value={Label.other}>Other</option>
            </select>

          </div>

          <div><button type="submit">Create Note</button></div>
          <ToggleTheme toggleTheme={toggleTheme} />
          <div className="fav-list">
            <h2>Favorite List:</h2>
            <ul>
              {Array.from(favorites).map(favorite => (
                <li key={favorite}>{favorite}</li>
              ))}
            </ul>
          </div>
        </form>

        <div className="notes-grid">
          {notes.map((note) => (
            <div
              key={note.id}
              className="note-item"
              style={{ backgroundColor: theme.noteBackground, color: theme.foreground }}>

              <div className="notes-header">
                <FavoriteNotes
                  isFavorite={favorites.has(note.title)}
                  onToggle={() => toggleFavorite(note.title)}
                />
                <button onClick={() => handleEditNote(note)}>Edit</button>
                <button onClick={() => handleSaveChanges()}>Save</button>
                <button onClick={() => handleDeleteNote(note.id)}>x</button>
              </div>
              {selectedNote && selectedNote.id === note.id ? (
                <>
                  <div
                    contentEditable
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleChange(e.target.innerText, 'title')}
                  >
                    {selectedNote.title}
                  </div>
                  <div
                    contentEditable
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleChange(e.target.innerText, 'content')}
                  >
                    {selectedNote.content}
                  </div>
                  <select
                    value={selectedNote.label}
                    onChange={(e) => handleChange(e.target.value, 'label')}
                    onBlur={() => handleSaveChanges()}
                  >
                    <option value={Label.personal}>Personal</option>
                    <option value={Label.study}>Study</option>
                    <option value={Label.work}>Work</option>
                    <option value={Label.other}>Other</option>
                  </select>
                </>
              ) : (
                <>
                  <h2>{note.title}</h2>
                  <p>{note.content}</p>
                  <p>{note.label}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
