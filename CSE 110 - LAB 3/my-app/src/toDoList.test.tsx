import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { dummyGroceryList } from './constants';
import { ToDoList } from "./toDoList";
import { BrowserRouter, useParams } from "react-router-dom";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
}));

describe("Display Items on Screen", () => {
    // Mock implementation for useParams
    beforeEach(() => {
        (useParams as jest.Mock).mockReturnValue({ name: "Theo" });
    });

    test('displays all list items', () => {
        render(
            <BrowserRouter>
                <ToDoList />
            </BrowserRouter>
        );
        const listItemElements = screen.getAllByRole('checkbox');
        expect(listItemElements.length).toBe(dummyGroceryList.length);
    });

    test('correctly displays the number of purchased items', async () => {
        render(
            <BrowserRouter>
                <ToDoList />
            </BrowserRouter>
        );

        // All checkboxed elements
        const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];

        // Initial state (all unchecked)
        checkboxes.forEach((checkbox) => {
            expect(checkbox).not.toBeChecked();
        });

        // Assertion of initial count = 0
        expect(screen.getByText(/Items bought: 0/)).toBeInTheDocument();

        // Simulate checking the first item
        fireEvent.click(checkboxes[0]);

        // Assert checkbox and item count
        await waitFor(() => {
            expect(checkboxes[0]).toBeChecked();
            expect(screen.getByText(/Items bought: 1/)).toBeInTheDocument();
        });

        // Simulate checking the second item
        fireEvent.click(checkboxes[1]);

        // Assert checkbox and item count
        await waitFor(() => {
            expect(checkboxes[1]).toBeChecked();
            expect(screen.getByText(/Items bought: 2/)).toBeInTheDocument();
        });

        // Simulate unchecking the first item
        fireEvent.click(checkboxes[0]);

        // Assert checkbox and item count
        await waitFor(() => {
            expect(checkboxes[0]).not.toBeChecked();
            expect(screen.getByText(/Items bought: 1/)).toBeInTheDocument();
        });
    });
});