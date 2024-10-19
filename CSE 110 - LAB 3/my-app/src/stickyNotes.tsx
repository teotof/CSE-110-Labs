import { Label, Note } from "./types"; // Import the Label type from the appropriate module
import { dummyNotesList } from "./constants"; // Import the dummyNotesList from the appropriate module
import { ToggleTheme, FavoriteNotes } from "./hooksExercise";
import React, { useState, useEffect, useContext } from 'react';
import { themes, ThemeContext } from "./themeContext";
import EditIcon from './pencil.svg';
import SaveIcon from './save.svg';
import './App.css';

export const StickyNotes = () => {
    const [favorites, setFavorites] = useState<Set<number>>(new Set<number>());
    const [theme, setTheme] = useState(themes.light);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === themes.light ? themes.dark : themes.light);
    };

    const toggleFavorite = (noteId: number) => {
        setFavorites(prevFavorites => {
            const newFavorites = new Set(prevFavorites);
            if (prevFavorites.has(noteId)) {
                newFavorites.delete(noteId);
            } else {
                newFavorites.add(noteId);
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
                    note.id === selectedNote.id ? { ...note, ...selectedNote } : note
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
                    <div><textarea placeholder="Note Content" value={createNote.content}
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
                            {Array.from(favorites).map(favoriteId => {
                                const note = notes.find(note => note.id === favoriteId);
                                return note ? <li key={favoriteId}>{note.title}</li> : null;
                            })}
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
                                    isFavorite={favorites.has(note.id)}
                                    onToggle={() => toggleFavorite(note.id)}
                                />
                                <button onClick={() => handleEditNote(note)}
                                    data-testid={`edit-note-${note.id}`}>
                                    <img src={EditIcon} alt="Edit" />
                                </button>
                                <button onClick={() => handleSaveChanges()}
                                    data-testid={`save-note-${note.id}`}>
                                    <img src={SaveIcon} alt="Save" />
                                </button>
                                <button data-testid={`delete-note-${note.id}`}
                                    onClick={() => handleDeleteNote(note.id)}
                                >
                                    x
                                </button>
                            </div>
                            {selectedNote && selectedNote.id === note.id ? (
                                <>
                                    <div
                                        data-testid={`note-title-${note.id}`}
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) => handleChange(e.target.innerText, 'title')}
                                    >
                                        {selectedNote.title}
                                    </div>
                                    <div
                                        data-testid={`note-content-${note.id}`}
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) => handleChange(e.target.innerText, 'content')}
                                    >
                                        {selectedNote.content}
                                    </div>
                                    <select
                                        data-testid={`note-label-${note.id}`}
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
                                    <h2 data-testid={`note-title-${note.id}`}>{note.title}</h2>
                                    <p data-testid={`note-content-${note.id}`}>{note.content}</p>
                                    <p data-testid={`note-label-${note.id}`}>{note.label}</p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </ThemeContext.Provider>
    );
}

