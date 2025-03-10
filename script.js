const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartItensContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkOutBtn = document.getElementById('checkout-btn');
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');

var cart = JSON.parse(localStorage.getItem("@cart")) || [];
updateCartModal();

//CONTROLAR HORÁRIO
function checkOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 8 && hora < 16;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkOpen();

if (isOpen) {
    spanItem.classList.remove("text-red-500");
    spanItem.classList.add("text-green-500");
} else {
    spanItem.classList.remove("text-green-500")
    spanItem.classList.add("text-red-500");
}

//CONTROLAR MODAL
cartBtn.addEventListener("click", () => {
    cartModal.style.display = "flex";
})

cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
})

closeModalBtn.addEventListener("click", () => {
    cartModal.style.display = "none";
})

menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parentButton.getAttribute("data-price");
        const weight = parentButton.getAttribute("data-weight");


        addToCart(name, price, weight);
    }
})

function addToCart(name, price, weight) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price: price,
            weight: weight,
            quantity: 1
        })
    }

    updateCartModal();
    salveDate();
}

function updateCartModal() {
    cartItensContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price}</p>
            </div>

            <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
            </button>

        </div>`;

        total += item.price * item.quantity;

        cartItensContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    cartCounter.innerHTML = cart.length;
}

//REMOVER ITEM DO CARRINHO
cartItensContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index != -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
        salveDate();
    }
}

function salveDate() {
    localStorage.setItem("@cart", JSON.stringify(cart));
}

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
});

//FINALIZAR COMPRA
checkOutBtn.addEventListener("click", function () {
    const isOpen = checkOpen();
    if (!isOpen) {
        Toastify({
            text: "Restaurante fechado no momento!",
            duration: 5000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço:${item.price} |`
        )
    }).join("");

    const message = encodeURIComponent(cartItems);
    const phone = "000000000";

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank");
    cart = [];
    updateCartModal();
    addressInput.value = "";

});