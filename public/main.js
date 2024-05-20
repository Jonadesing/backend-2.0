// public/scripts/main.js

// Función para actualizar el contador del carrito
function updateCartCount() {
    fetch('/api/cart/count')
        .then(response => response.json())
        .then(data => {
            document.getElementById('cart-count').innerText = data.count;
        })
        .catch(error => console.error('Error al actualizar el contador del carrito:', error));
}

// Llamar a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', updateCartCount);

// Función para agregar un producto al carrito
function addToCart(button) {
    const productCard = button.closest('.product-card');
    const productId = productCard.getAttribute('data-id');
    
    fetch(`/api/cart/add/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            updateCartCount();
        } else {
            alert('Error al agregar el producto al carrito');
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('Error al agregar el producto al carrito');
    });
}

// Función para quitar un producto del carrito
function removeFromCart(button) {
    const productCard = button.closest('.product-card');
    const productId = productCard.getAttribute('data-id');
    
    fetch(`/api/cart/remove/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            updateCartCount();
        } else {
            alert('Error al quitar el producto del carrito');
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('Error al quitar el producto del carrito');
    });
}
