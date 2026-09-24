/* =====================================================
   SNACK
   ===================================================== */

function openSnack(
    snackName,
    category,
    choices,
    flavors = []
) {

    if (!shopIsOpen) {
        alert("HIGHWAY CAFE is currently closed.");
        return;
    }

    if (!isMenuItemAvailable(snackName, category)) {
        alert(snackName + " is currently sold out.");
        return;
    }

    selectedSnack = snackName;
    selectedSnackCategory = category;

    snackChoices = Array.isArray(choices) ? choices : [];
    snackFlavors = Array.isArray(flavors) ? flavors : [];

    selectedSnackChoice = snackChoices.length > 0 ? snackChoices[0] : null;
    selectedSnackFlavor = snackFlavors.length > 0 ? snackFlavors[0] : "";

    snackQuantity = 1;

    const quantityInput = document.getElementById("snackQuantity");
    if (quantityInput) {
        quantityInput.value = 1;
    }

    const titleDisplay = document.getElementById("selectedSnack");
    if (titleDisplay) {
        titleDisplay.textContent = selectedSnack;
    }

    const categoryDisplay = document.getElementById("selectedSnackCategory");
    if (categoryDisplay) {
        categoryDisplay.textContent = selectedSnackCategory;
    }

    renderSnackChoiceButtons();
    renderSnackFlavorSection();

    showPopup("snackOverlay", "snackPopupContent");
}


/* =====================================================
   RENDER SNACK CHOICES
   ===================================================== */

function renderSnackChoiceButtons() {

    const container = document.getElementById("snackChoiceButtons");
    if (!container) {
        return;
    }

    container.innerHTML = "";

    snackChoices.forEach(function(choice) {

        const name = choice[0];
        const price = choice[1];

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = name + " - ₱" + price;

        if (selectedSnackChoice && selectedSnackChoice[0] === name) {
            button.classList.add("selected-option");
        }

        button.onclick = function() {
            selectedSnackChoice = choice;
            renderSnackChoiceButtons();
        };

        container.appendChild(button);
    });
}


/* =====================================================
   RENDER SNACK FLAVORS
   ===================================================== */

function renderSnackFlavorSection() {

    const flavorWrapper = document.getElementById("snackFlavors");
    const container = document.getElementById("snackFlavorButtons");

    if (!flavorWrapper || !container) {
        return;
    }

    if (snackFlavors.length === 0) {
        flavorWrapper.style.display = "none";
        container.innerHTML = "";
        return;
    }

    flavorWrapper.style.display = "block";
    container.innerHTML = "";

    snackFlavors.forEach(function(flavor) {

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = flavor;

        if (selectedSnackFlavor === flavor) {
            button.classList.add("selected-option");
        }

        button.onclick = function() {
            selectedSnackFlavor = flavor;
            renderSnackFlavorSection();
        };

        container.appendChild(button);
    });
}


/* =====================================================
   CLOSE SNACK
   ===================================================== */

function closeSnack() {
    const overlay = document.getElementById("snackOverlay");
    if (overlay) {
        overlay.style.display = "none";
    }
}


/* =====================================================
   ADD SNACK TO CART
   ===================================================== */

function addSnackToCart() {

    if (!shopIsOpen) {
        alert("HIGHWAY CAFE is currently closed.");
        return;
    }

    if (!isMenuItemAvailable(selectedSnack, selectedSnackCategory)) {
        alert(selectedSnack + " is currently sold out.");
        closeSnack();
        return;
    }

    const input = document.getElementById("snackQuantity");
    let qty = input ? parseInt(input.value, 10) : 1;

    if (isNaN(qty) || qty < 1) {
        qty = 1;
    }

    if (!selectedSnackChoice) {
        alert("Please choose an option.");
        return;
    }

    const optionName = selectedSnackChoice[0];
    const optionPrice = selectedSnackChoice[1];

    const item = {
        name: selectedSnack,
        category: selectedSnackCategory,
        size: optionName,
        price: optionPrice,
        quantity: qty,
        option: optionName,
        flavor: selectedSnackFlavor
    };

    addItemToCart(item);
    closeSnack();
    showOrderNotice();
}


/* =====================================================
   MEAL
   ===================================================== */

function openMeal(mealName, choices) {

    if (!shopIsOpen) {
        alert("HIGHWAY CAFE is currently closed.");
        return;
    }

    if (!isMenuItemAvailable(mealName, "Pit Stop Plates")) {
        alert(mealName + " is currently sold out.");
        return;
    }

    selectedMeal = mealName;
    mealChoices = Array.isArray(choices) ? choices : [];
    selectedMealChoice = mealChoices.length > 0 ? mealChoices[0] : null;

    selectedMealCooler = "None";
    selectedMealCoolerPrice = 0;

    extraEgg = false;
    extraRice = false;
    mealQuantity = 1;

    const input = document.getElementById("mealQuantity");
    if (input) {
        input.value = 1;
    }

    const display = document.getElementById("selectedMeal");
    if (display) {
        display.textContent = selectedMeal;
    }

    renderMealChoiceButtons();
    resetMealCoolerButtons();
    resetMealExtraButtons();

    showPopup("mealOverlay", "mealPopupContent");
}


/* =====================================================
   RENDER MEAL CHOICES
   ===================================================== */

function renderMealChoiceButtons() {

    const container = document.getElementById("mealChoiceButtons");
    if (!container) {
        return;
    }

    container.innerHTML = "";

    mealChoices.forEach(function(choice) {

        const name = choice[0];
        const price = choice[1];

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = name + " - ₱" + price;

        if (selectedMealChoice && selectedMealChoice[0] === name) {
            button.classList.add("selected-option");
        }

        button.onclick = function() {
            selectedMealChoice = choice;
            renderMealChoiceButtons();
        };

        container.appendChild(button);
    });
}


/* =====================================================
   SELECT MEAL COOLER
   ===================================================== */

function selectMealCooler(type) {

    const noneBtn = document.getElementById("coolerNoneButton");
    const cooler16Btn = document.getElementById("cooler16Button");
    const cooler22Btn = document.getElementById("cooler22Button");

    if (noneBtn) noneBtn.classList.remove("selected-option");
    if (cooler16Btn) cooler16Btn.classList.remove("selected-option");
    if (cooler22Btn) cooler22Btn.classList.remove("selected-option");

    if (type === "none") {
        selectedMealCooler = "None";
        selectedMealCoolerPrice = 0;
        if (noneBtn) noneBtn.classList.add("selected-option");
    } else if (type === "16oz") {
        selectedMealCooler = "16oz Cooler";
        selectedMealCoolerPrice = 35;
        if (cooler16Btn) cooler16Btn.classList.add("selected-option");
    } else if (type === "22oz") {
        selectedMealCooler = "22oz Cooler";
        selectedMealCoolerPrice = 55;
        if (cooler22Btn) cooler22Btn.classList.add("selected-option");
    }
}

function resetMealCoolerButtons() {
    selectMealCooler("none");
}


/* =====================================================
   TOGGLE MEAL EXTRAS
   ===================================================== */

function toggleMealExtra(type) {

    if (type === "egg") {
        extraEgg = !extraEgg;
        updateAddonButton("extraEggButton", extraEgg);
    } else if (type === "rice") {
        extraRice = !extraRice;
        updateAddonButton("extraRiceButton", extraRice);
    }
}

function resetMealExtraButtons() {
    extraEgg = false;
    extraRice = false;
    updateAddonButton("extraEggButton", false);
    updateAddonButton("extraRiceButton", false);
}


/* =====================================================
   CLOSE MEAL
   ===================================================== */

function closeMeal() {
    const overlay = document.getElementById("mealOverlay");
    if (overlay) {
        overlay.style.display = "none";
    }
}


/* =====================================================
   ADD MEAL TO CART
   ===================================================== */

function addMealToCart() {

    if (!shopIsOpen) {
        alert("HIGHWAY CAFE is currently closed.");
        return;
    }

    if (!isMenuItemAvailable(selectedMeal, "Pit Stop Plates")) {
        alert(selectedMeal + " is currently sold out.");
        closeMeal();
        return;
    }

    const input = document.getElementById("mealQuantity");
    let qty = input ? parseInt(input.value, 10) : 1;

    if (isNaN(qty) || qty < 1) {
        qty = 1;
    }

    if (!selectedMealChoice) {
        alert("Please choose an option.");
        return;
    }

    let itemPrice = selectedMealChoice[1] + selectedMealCoolerPrice;
    if (extraEgg) itemPrice += 10;
    if (extraRice) itemPrice += 15;

    let sizeDescription = selectedMealChoice[0];
    if (selectedMealCooler !== "None") {
        sizeDescription += " + " + selectedMealCooler;
    }

    const item = {
        name: selectedMeal,
        category: "Pit Stop Plates",
        size: sizeDescription,
        price: itemPrice,
        quantity: qty,
        cooler: selectedMealCooler,
        extraEgg: extraEgg,
        extraRice: extraRice
    };

    addItemToCart(item);
    closeMeal();
    showOrderNotice();
}


/* =====================================================
   UPDATE CART DISPLAY
   ===================================================== */

function updateCart() {

    const sideCartItems = document.getElementById("sideCartItems");
    const cartCount = document.getElementById("cartCount");
    const sideCartTotal = document.getElementById("sideCartTotal");

    let totalItems = 0;
    let totalPrice = 0;

    if (!sideCartItems) return;

    if (cart.length === 0) {
        sideCartItems.innerHTML = "Your cart is empty.";
        if (cartCount) cartCount.textContent = "0 items";
        if (sideCartTotal) sideCartTotal.textContent = "0";
        return;
    }

    sideCartItems.innerHTML = "";

    cart.forEach(function(item, index) {
        totalItems += item.quantity;
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        const div = document.createElement("div");
        div.className = "cart-item";

        let details = item.size ? " (" + item.size + ")" : "";
        if (item.extraEspresso) details += " +Espresso";
        if (item.extraMatcha) details += " +Matcha";
        if (item.extraChocolate) details += " +Chocolate";
        if (item.extraEgg) details += " +Egg";
        if (item.extraRice) details += " +Rice";

        div.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.name}</strong>${details}
                <div>₱${item.price} × ${item.quantity} = ₱${itemTotal}</div>
            </div>
            <div class="cart-item-controls">
                <button type="button" onclick="changeQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button type="button" onclick="changeQuantity(${index}, 1)">+</button>
                <button type="button" class="remove-btn" onclick="removeCartItem(${index})">✕</button>
            </div>
        `;
        sideCartItems.appendChild(div);
    });

    if (cartCount) cartCount.textContent = totalItems + (totalItems === 1 ? " item" : " items");
    if (sideCartTotal) sideCartTotal.textContent = totalPrice;
}


/* =====================================================
   CHANGE QUANTITY & REMOVE
   ===================================================== */

function changeQuantity(index, amount) {
    if (cart[index]) {
        cart[index].quantity += amount;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        updateCart();
    }
}

function removeCartItem(index) {
    cart.splice(index, 1);
    updateCart();
}


/* =====================================================
   CHECKOUT SYSTEM
   ===================================================== */

function openCheckout() {
    if (!shopIsOpen) {
        alert("HIGHWAY CAFE is currently closed.");
        return;
    }

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    renderCheckoutSummary();
    showPopup("checkoutOverlay", "checkoutPopup");
}

function closeCheckout() {
    const overlay = document.getElementById("checkoutOverlay");
    if (overlay) overlay.style.display = "none";
}

function selectOrderType(type) {
    orderType = type;
    const pickupBtn = document.getElementById("pickupButton");
    const deliveryBtn = document.getElementById("deliveryButton");
    const pickupDetails = document.getElementById("pickupDetails");
    const deliveryDetails = document.getElementById("deliveryDetails");

    if (pickupBtn) pickupBtn.classList.remove("selected-option");
    if (deliveryBtn) deliveryBtn.classList.remove("selected-option");

    if (type === "pickup") {
        if (pickupBtn) pickupBtn.classList.add("selected-option");
        if (pickupDetails) pickupDetails.style.display = "block";
        if (deliveryDetails) deliveryDetails.style.display = "none";
    } else {
        if (deliveryBtn) deliveryBtn.classList.add("selected-option");
        if (pickupDetails) pickupDetails.style.display = "none";
        if (deliveryDetails) deliveryDetails.style.display = "block";
    }

    renderCheckoutSummary();
}

function selectPaymentMethod(method) {
    paymentMethod = method;
    const cashBtn = document.getElementById("cashButton");
    const gcashBtn = document.getElementById("gcashButton");
    const gcashDetails = document.getElementById("gcashDetails");

    if (cashBtn) cashBtn.classList.remove("selected-option");
    if (gcashBtn) gcashBtn.classList.remove("selected-option");

    if (method === "cash") {
        if (cashBtn) cashBtn.classList.add("selected-option");
        if (gcashDetails) gcashDetails.style.display = "none";
    } else {
        if (gcashBtn) gcashBtn.classList.add("selected-option");
        if (gcashDetails) gcashDetails.style.display = "block";
    }
}


/* =====================================================
   RENDER CHECKOUT SUMMARY
   ===================================================== */

function renderCheckoutSummary() {
    const summaryContainer = document.getElementById("checkoutSummary");
    const totalContainer = document.getElementById("checkoutTotal");

    if (!summaryContainer || !totalContainer) return;

    if (cart.length === 0) {
        summaryContainer.innerHTML = "Your cart is empty.";
        totalContainer.textContent = "0";
        return;
    }

    let html = "";
    let subtotal = 0;

    cart.forEach(function(item) {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `<div>${item.name} (${item.size}) x ${item.quantity} - ₱${itemTotal}</div>`;
    });

    let deliveryFee = orderType === "delivery" ? DELIVERY_FEE : 0;
    let finalTotal = subtotal + deliveryFee;

    if (orderType === "delivery") {
        html += `<div><strong>Delivery Fee: ₱${DELIVERY_FEE}</strong></div>`;
    }

    summaryContainer.innerHTML = html;
    totalContainer.textContent = finalTotal;
}


/* =====================================================
   PLACE ORDER
   ===================================================== */

async function placeOrder() {

    if (!shopIsOpen) {
        alert("HIGHWAY CAFE is currently closed.");
        return;
    }

    const name = document.getElementById("customerName")?.value.trim();
    const phone = document.getElementById("customerPhone")?.value.trim();

    if (!name || !phone) {
        alert("Please enter your name and phone number.");
        return;
    }

    if (orderType === "delivery") {
        const address = document.getElementById("deliveryAddress")?.value.trim();
        if (!address) {
            alert("Please enter your delivery address.");
            return;
        }
    }

    if (paymentMethod === "gcash") {
        const ref = document.getElementById("paymentReference")?.value.trim();
        if (!ref) {
            alert("Please enter your GCash reference number.");
            return;
        }
    }

    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let deliveryFee = orderType === "delivery" ? DELIVERY_FEE : 0;
    let finalTotal = subtotal + deliveryFee;

    let orderData = {
        customer_name: name,
        customer_phone: phone,
        order_type: orderType,
        delivery_address: orderType === "delivery" ? document.getElementById("deliveryAddress").value : null,
        pickup_time: orderType === "pickup" ? document.getElementById("pickupTime")?.value : null,
        order_notes: document.getElementById("orderNotes")?.value || null,
        payment_method: paymentMethod,
        payment_reference: paymentMethod === "gcash" ? document.getElementById("paymentReference").value : null,
        items: cart,
        total_price: finalTotal,
        status: "Pending"
    };

    if (supabaseClient && supabaseReady) {
        const { data, error } = await supabaseClient.from("orders").insert([orderData]).select();
        if (error) {
            console.error("Error saving order:", error);
            alert("There was an error placing your order. Please try again.");
            return;
        }
    }

    showOrderConfirmation(orderData);
    cart = [];
    updateCart();
    closeCheckout();
}


/* =====================================================
   ORDER CONFIRMATION DISPLAY
   ===================================================== */

function showOrderConfirmation(order) {
    const orderNumEl = document.getElementById("confirmationOrderNumber");
    const summaryEl = document.getElementById("confirmationOrderSummary");
    const totalEl = document.getElementById("confirmationTotal");

    if (orderNumEl) {
        orderNumEl.textContent = "HC-" + Math.floor(1000 + Math.random() * 9000);
    }

    if (summaryEl) {
        let html = "";
        order.items.forEach(function(item) {
            html += `<div>${item.name} (${item.size}) x ${item.quantity} - ₱${item.price * item.quantity}</div>`;
        });
        if (order.order_type === "delivery") {
            html += `<div>Delivery Fee: ₱${DELIVERY_FEE}</div>`;
        }
        summaryEl.innerHTML = html;
    }

    if (totalEl) {
        totalEl.textContent = order.total_price;
    }

    showPopup("orderConfirmationPopup", "");
}

function finishOrder() {
    const overlay = document.getElementById("orderConfirmationPopup");
    if (overlay) overlay.style.display = "none";
}


/* =====================================================
   AUTO INITIALIZATION ON LOAD
   ===================================================== */

window.addEventListener("DOMContentLoaded", function() {
    initializeSupabase();
});
