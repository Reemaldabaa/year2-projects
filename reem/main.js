const API_URL = 'https://fakestoreapi.com/products';

const cartItemsContainer = document.getElementById('cartItems');
const totalAmountSpan = document.getElementById('totalAmount');
const addItemBtn = document.getElementById('addItem');

let cart = [];

async function fetchItems() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        cart = data.slice(0, 5); // نعرض أول 5 منتجات بس
        renderCart();
    } catch (err) {
        console.error('Error fetching data:', err);
    }
}

function renderCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${item.title} - $${item.price} × ${item.quantity || 1}</span>
            <div>
                <button class="edit-btn" onclick="editItem(${item.id})">Edit</button>
                <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
        total += item.price * (item.quantity || 1);
    });

    totalAmountSpan.textContent = total.toFixed(2);
}

addItemBtn.addEventListener('click', async () => {
    const name = document.getElementById('itemName').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    const quantity = parseInt(document.getElementById('itemQuantity').value);

    if (!name || !price || !quantity) return alert('Please fill all fields');

    const newItem = {
        title: name,
        price,
        description: "Custom item",
        image: "https://via.placeholder.com/150",
        category: "misc",
        quantity
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(newItem),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        cart.push(data);
        renderCart();
    } catch (err) {
        console.error('Error adding item:', err);
    }
});

async function deleteItem(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        cart = cart.filter(item => item.id !== id);
        renderCart();
    } catch (err) {
        console.error('Error deleting item:', err);
    }
}

function editItem(id) {
    const item = cart.find(i => i.id === id);
    const newName = prompt("Edit name:", item.title);
    const newPrice = parseFloat(prompt("Edit price:", item.price));
    const newQuantity = parseInt(prompt("Edit quantity:", item.quantity || 1));

    if (!newName || isNaN(newPrice) || isNaN(newQuantity)) return;

    updateItem(id, newName, newPrice, newQuantity);
}

async function updateItem(id, name, price, quantity) {
    const updatedItem = {
        title: name,
        price,
        description: "Updated item",
        image: "https://via.placeholder.com/150",
        category: "misc",
        quantity
    };

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedItem),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        cart = cart.map(item => item.id === id ? data : item);
        renderCart();
    } catch (err) {
        console.error('Error updating item:', err);
    }
}

fetchItems();
