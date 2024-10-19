import React, { ChangeEventHandler } from "react";
import "./App.css";
import { useState } from "react";
import { GroceryItem } from "./types";
import { dummyGroceryList } from "./constants";
import { useParams } from "react-router-dom";

export function ToDoList() {
    const [numRemainingItems, setNumRemainingItems] = useState(0);
    const { name } = useParams();

    let [items, setItems] = useState(dummyGroceryList);

    function handleCheckboxClick(e: React.ChangeEvent<HTMLInputElement>) {
        const checkbox: HTMLInputElement = e.target as HTMLInputElement;
        const itemName = checkbox.name;

        // Create a new array with the updated item status
        const updatedItems = items.map((item) =>
            item.name === itemName ? { ...item, isPurchased: checkbox.checked } : item
        );

        // Separate unchecked and checked items to reorder them
        const uncheckedItems = updatedItems.filter((item) => !item.isPurchased);
        const checkedItems = updatedItems.filter((item) => item.isPurchased);
        const reorderedItems = uncheckedItems.concat(checkedItems);

        // Update the state with the new reordered list
        setItems(reorderedItems);

        // Calculate the new count of purchased items
        const purchasedCount = reorderedItems.filter((item) => item.isPurchased).length;

        // Update the count of remaining items
        setNumRemainingItems(purchasedCount);
    }

    return (
        <div className="App">
            <div className="App-body to-do-list" >
                <h1>{name}'s To Do List</h1>
                <div className="items-bought">Items bought: {numRemainingItems}</div>
                <form action=".">
                    {items.map((item) => ListItem(item, handleCheckboxClick))}
                </form>
            </div>
        </div>
    );
}

function ListItem(item: GroceryItem, changeHandler: ChangeEventHandler) {
    return (
        <div className="list-item" key={item.name}>
            <input
                type="checkbox"
                onChange={changeHandler}
                checked={item.isPurchased}
                name={item.name}
            />
            {item.name}
        </div>
    );
}