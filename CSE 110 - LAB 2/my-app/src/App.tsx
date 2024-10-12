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
      const newFavorites = new Set(prevFavorites); // Create a shallow copy
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

  return (
    <ThemeContext.Provider value={theme}>
      <div className='app-container' style={{ backgroundColor: theme.background, color: theme.foreground }}>

        <form className="note-form">
          <div><input placeholder="Note Title" style={{
            backgroundColor: theme.noteBackground,
            color: theme.foreground,
            borderColor: theme.foreground
          }}></input></div>
          <div><textarea style={{
            backgroundColor: theme.noteBackground,
            color: theme.foreground,
            borderColor: theme.foreground
          }}></textarea></div>

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
          {dummyNotesList.map((note) => (
            <div
              key={note.id}
              className="note-item"
              style={{ backgroundColor: theme.noteBackground, color: theme.foreground }}>
              <div className="notes-header">
                <FavoriteNotes
                  isFavorite={favorites.has(note.title)}
                  onToggle={() => toggleFavorite(note.title)}
                />
                <button>x</button>
              </div>
              <h2> {note.title} </h2>
              <p> {note.content} </p>
              <p> {note.label} </p>
            </div>
          ))}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
