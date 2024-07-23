// Array to store shopping list items
let shoppingList = [];

// DOM elements
const itemInput = document.getElementById('item-input');
const addBtn = document.getElementById('add-btn');
const shoppingListEl = document.getElementById('shopping-list');
const clearBtn = document.getElementById('clear-btn');

// Load items from local storage
function loadItems() {
    const storedItems = localStorage.getItem('shoppingList');
    if (storedItems) {
        shoppingList = JSON.parse(storedItems);
        renderList();
    }
}

// Save items to local storage
function saveItems() {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

// Render the shopping list
function renderList() {
    shoppingListEl.innerHTML = '';
    shoppingList.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="${item.purchased ? 'purchased' : ''}">${item.name}</span>
            <div>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
                <button class="toggle-btn">${item.purchased ? 'Unpurchase' : 'Purchase'}</button>
            </div>
        `;
        shoppingListEl.appendChild(li);

        // Edit button event listener
        li.querySelector('.edit-btn').addEventListener('click', () => editItem(index));

        // Delete button event listener
        li.querySelector('.delete-btn').addEventListener('click', () => deleteItem(index));

        // Toggle purchase status event listener
        li.querySelector('.toggle-btn').addEventListener('click', () => togglePurchaseStatus(index));
    });
}

// Add new item to the list
function addItem() {
    const itemName = itemInput.value.trim();
    if (itemName) {
        shoppingList.push({ name: itemName, purchased: false });
        itemInput.value = '';
        saveItems();
        renderList();
    }
}

// Edit an item
function editItem(index) {
    const li = shoppingListEl.children[index];
    const span = li.querySelector('span');
    const currentText = span.textContent;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'edit-input';

    li.insertBefore(input, span);
    li.removeChild(span);

    input.focus();

    input.addEventListener('blur', function() {
        const newText = input.value.trim();
        if (newText) {
            shoppingList[index].name = newText;
            saveItems();
            renderList();
        } else {
            li.insertBefore(span, input);
            li.removeChild(input);
        }
    });

    input.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            input.blur();
        }
    });
}

// Delete an item
function deleteItem(index) {
    shoppingList.splice(index, 1);
    saveItems();
    renderList();
}

// Toggle purchase status
function togglePurchaseStatus(index) {
    shoppingList[index].purchased = !shoppingList[index].purchased;
    saveItems();
    renderList();
}

// Clear the entire list
function clearList() {
    shoppingList = [];
    saveItems();
    renderList();
}

// Event listeners
addBtn.addEventListener('click', addItem);
clearBtn.addEventListener('click', clearList);
itemInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        addItem();
    }
});

// Initial load
loadItems();

