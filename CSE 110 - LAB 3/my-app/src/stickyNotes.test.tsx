import { render, screen, fireEvent } from "@testing-library/react";
import { StickyNotes } from "./stickyNotes";
import { dummyNotesList } from './constants';

describe("Create, Display, Edit, Delete Stickynote", () => {
    test("renders create note form", () => {
        render(<StickyNotes />);

        const createNoteButton = screen.getByText("Create Note");
        expect(createNoteButton).toBeInTheDocument();
    });

    test("creates a new note", () => {
        render(<StickyNotes />);

        const createNoteTitleInput = screen.getByPlaceholderText("Note Title");
        const createNoteContentTextarea =
            screen.getByPlaceholderText("Note Content");
        const createNoteButton = screen.getByText("Create Note");

        fireEvent.change(createNoteTitleInput, { target: { value: "New Note" } });
        fireEvent.change(createNoteContentTextarea, {
            target: { value: "Note content" },
        });
        fireEvent.click(createNoteButton);

        const newNoteTitle = screen.getByText("New Note");
        const newNoteContent = screen.getByText("Note content");

        expect(newNoteTitle).toBeInTheDocument();
        expect(newNoteContent).toBeInTheDocument();
    });

    test('displays all notes', () => {
        render(<StickyNotes />);
        dummyNotesList.forEach(note => {
            expect(screen.getByText(new RegExp(note.title, 'i'))).toBeInTheDocument();
            expect(screen.getByText(new RegExp(note.content, 'i'))).toBeInTheDocument();
        });
    });


    test('allows editing and saving of a note', () => {
        render(<StickyNotes />);

        // Access edit button
        const initialNote = dummyNotesList[0];
        const editButton = screen.getByTestId(`edit-note-${initialNote.id}`);

        // Simulate clicking button
        fireEvent.click(editButton);

        // Fields to be changed
        const noteTitle = screen.getByTestId(`note-title-${initialNote.id}`);
        const noteContent = screen.getByTestId(`note-content-${initialNote.id}`);
        const noteLabelSelect = screen.getByTestId(`note-label-${initialNote.id}`) as HTMLSelectElement;;
        const saveButton = screen.getByTestId(`save-note-${initialNote.id}`);

        // Update fields
        fireEvent.blur(noteTitle, { target: { innerText: 'Updated Note Title' } });
        fireEvent.blur(noteContent, { target: { innerText: 'Updated Note Content' } });
        fireEvent.change(noteLabelSelect, { target: { value: 'work' } });

        // Simulate clicking save
        fireEvent.click(saveButton);

        // Assertions
        expect(noteTitle.innerHTML).toBe('Updated Note Title');
        expect(noteContent.innerHTML).toBe('Updated Note Content');
        expect(noteLabelSelect.value).toBe('work');
    });

    test('deletes a note correctly', () => {
        render(<StickyNotes />);

        // First Note's Delete Button
        const initialNote = dummyNotesList[0];
        const deleteButton = screen.getByTestId(`delete-note-${initialNote.id}`);

        // Count number of notes
        const initialNotes = screen.getAllByTestId(/note-title-/);
        const initialCount = initialNotes.length;

        // Simulate clicking delete button
        fireEvent.click(deleteButton);

        // Check that the deleted note's title is no longer in document
        const deletedNoteTitle = screen.queryByText(initialNote.title);
        expect(deletedNoteTitle).not.toBeInTheDocument();

        // Verify count of notes is -1
        const updatedNotes = screen.getAllByTestId(/note-title-/);
        expect(updatedNotes.length).toBe(initialCount - 1);
    });
});