import { Label, Note } from "./types";

export const dummyNotesList = [
    {
        id: 1,
        title: "Sticky Note 1",
        content: "To-Do",
        label: Label.other,
    },
    {
        id: 2,
        title: "Sticky Note 2",
        content: "Appointments",
        label: Label.personal,
    },
    {
        id: 3,
        title: "Sticky Note 3",
        content: "Meetings",
        label: Label.work,
    },
    {
        id: 4,
        title: "Sticky Note 4",
        content: "Test Dates",
        label: Label.study,
    },
    {
        id: 5,
        title: "Sticky Note 5",
        content: "Exam Dates",
        label: Label.study,
    },
    {
        id: 6,
        title: "Sticky Note 6",
        content: "Workout Details",
        label: Label.personal,
    },
]

export const dummyGroceryList = [
    { name: "Apples", isPurchased: false },
    { name: "Bananas", isPurchased: false },
]