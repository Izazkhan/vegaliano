// Ensure the script runs after the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {

    const quantityInputs = document.querySelectorAll('input[type="number"][name="updates[]"]');

    quantityInputs.forEach(input => {
        input.addEventListener('input', function (event) {
            const max = parseInt(input.getAttribute('max'), 10);
            const min = parseInt(input.getAttribute('min'), 10) || 1;
            let value = parseInt(input.value, 10);

            // Enforce min and max values
            if (value > max) {
                input.value = max;
            } else if (value < min) {
                input.value = min;
            }
        });
    });

    // Function to update quantity
    window.updateQuantity = function (button, change) {
        console.log(change);
        const cartItem = button.closest('tr');  // Find the closest cart-item container
        const input = cartItem.querySelector('.cart-item__quantity input[type="number"]');  // Find the input field
        let currentValue = parseInt(input.value) || 1;  // Get the current value, default to 1 if invalid
        const newValue = currentValue + change;  // Calculate the new value

        // Ensure the value is within bounds (min 1)
        if (newValue >= parseInt(input.min || 1)) {
            input.value = newValue;  // Update the value of the input field

            // Trigger a change event to update the cart
            input.dispatchEvent(new Event('change'));

            // Optionally update the cart on the server using AJAX (see below for AJAX update)
            updateCartItem(cartItem.getAttribute('data-item-key'), newValue);
        }
    };

    // Function to update the cart item on the server (Shopify API)
    function updateCartItem(itemKey, quantity) {
        fetch('/cart/change.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: itemKey,  // The line item key
                quantity: quantity,  // New quantity
            }),
        })
            .then(response => response.json())
            .then(cart => {
                console.log('Cart updated:', cart);

                // Update the UI with the new cart state
                updateCartUI(cart);
            })
            .catch(error => console.error('Error:', error));
    }

    // Function to update the cart UI after AJAX update
    function updateCartUI(cart) {
        cart.items.forEach(item => {
            let cartItem = document.querySelector(`tr[data-item-key="${item.key}"]`);
            const linePriceElement = cartItem.querySelector(`.cart-item__total`);
            const quantityElement = cartItem.querySelector(`.quantity-input`);

            if (linePriceElement) {
                linePriceElement.textContent = Shopify.formatMoney(item.line_price); // Update price
            }

            if (quantityElement) {
                quantityElement.value = item.quantity; // Update quantity input
            }
        });

        // Optionally update cart totals
        const totalPriceElement = document.querySelector('#cart-total-price');
        if (totalPriceElement) {
            totalPriceElement.textContent = Shopify.formatMoney(cart.total_price);
        }
    }

});