// =====================================================
// HIGHWAY CAFE - ORDERING SYSTEM
// =====================================================

// =====================================================
// CART
// =====================================================

let cart = [];

// =====================================================
// DRINK / PRODUCT STATE
// =====================================================

let selectedProduct = "";
let selectedCategory = "";

let price12 = 0;
let price16 = 0;
let price22 = 0;

let sizeType = "";
let selectedSize = 16;

// =====================================================
// DRINK ADD-ONS
// =====================================================

let espressoAvailable = false;
let matchaAvailable = false;
let chocolateAvailable = false;

let extraEspresso = false;
let extraMatcha = false;
let extraChocolate = false;

// =====================================================
// DRINK QUANTITY
// =====================================================

let quantity = 1;

// =====================================================
// ADD-ON PRICES
// =====================================================

const EXTRA_ESPRESSO_PRICE = 30;
const EXTRA_MATCHA_PRICE = 30;
const EXTRA_CHOCOLATE_PRICE = 30;

// =====================================================
// START ORDER
// =====================================================

function startOrder() {

    const menu = document.getElementById("menu");

    if (!menu) {
        console.error("ERROR: #menu was not found.");
        return;
    }

    menu.style.display = "block";

    menu.scrollIntoView({
        behavior: "smooth"
    });
}

// =====================================================
// OPEN PRODUCT
// =====================================================

function openProduct(
    productName,
    category,
    productSizeType,
    firstPrice,
    secondPrice,
    addOnType,
    thirdPrice = 0
) {

    selectedProduct = productName;
    selectedCategory = category;
    sizeType = productSizeType;

    // -------------------------------------------------
    // PRICES
    // -------------------------------------------------

    if (sizeType === "size8") {

        price12 = firstPrice;
        price16 = 0;
        price22 = 0;

    } else if (sizeType === "size16-22") {

        price12 = 0;
        price16 = firstPrice;
        price22 = secondPrice;

    } else if (sizeType === "size12-16-22") {

        price12 = firstPrice;
        price16 = secondPrice;
        price22 = thirdPrice;

    } else {

        price12 = 0;
        price16 = 0;
        price22 = 0;
    }

    // -------------------------------------------------
    // RESET
    // -------------------------------------------------

    quantity = 1;

    extraEspresso = false;
    extraMatcha = false;
    extraChocolate = false;

    espressoAvailable = false;
    matchaAvailable = false;
    chocolateAvailable = false;

    // -------------------------------------------------
    // DEFAULT SIZE
    // -------------------------------------------------

    if (sizeType === "size8") {

        selectedSize = 8;

    } else if (sizeType === "size16-22") {

        selectedSize = 16;

    } else if (sizeType === "size12-16-22") {

        selectedSize = 12;
    }

    // -------------------------------------------------
    // AVAILABLE ADD-ONS
    // -------------------------------------------------

    if (addOnType === "espresso") {

        espressoAvailable = true;

    } else if (addOnType === "matcha") {

        matchaAvailable = true;

    } else if (addOnType === "chocolate") {

        chocolateAvailable = true;

    } else if (addOnType === "both") {

        espressoAvailable = true;
        matchaAvailable = true;

    } else if (addOnType === "espresso-chocolate") {

        espressoAvailable = true;
        chocolateAvailable = true;
    }

    // -------------------------------------------------
    // POPUP TEXT
    // -------------------------------------------------

    const productTitle =
        document.getElementById("selectedProduct");

    const productCategory =
        document.getElementById("selectedCategory");

    const quantityDisplay =
        document.getElementById("quantity");

    if (!productTitle) {
        console.error("ERROR: #selectedProduct was not found.");
        return;
    }

    if (!productCategory) {
        console.error("ERROR: #selectedCategory was not found.");
        return;
    }

    if (!quantityDisplay) {
        console.error("ERROR: #quantity was not found.");
        return;
    }

    productTitle.textContent = selectedProduct;
    productCategory.textContent = selectedCategory;
    quantityDisplay.textContent = quantity;

    updateSizeDisplay();
    updateAddOnDisplay();
    resetAddOnButtons();

    // -------------------------------------------------
    // SHOW PRODUCT POPUP
    // -------------------------------------------------

    const overlay =
        document.getElementById("productOverlay");

    const productPopup =
        document.getElementById("productPopup");

    const snackPopup =
        document.getElementById("snackPopupContent");

    const mealPopup =
        document.getElementById("mealPopupContent");

    if (!overlay) {
        console.error("ERROR: #productOverlay was not found.");
        return;
    }

    overlay.style.display = "flex";

    if (productPopup) {
        productPopup.style.display = "block";
    }

    if (snackPopup) {
        snackPopup.style.display = "none";
    }

    if (mealPopup) {
        mealPopup.style.display = "none";
    }
}

// =====================================================
// SIZE DISPLAY
// =====================================================

function updateSizeDisplay() {

    const size12Button =
        document.getElementById("size12Button");

    const size16Button =
        document.getElementById("size16Button");

    const size22Button =
        document.getElementById("size22Button");

    const sizeTitle =
        document.getElementById("sizeTitle");

    if (
        !size12Button ||
        !size16Button ||
        !size22Button ||
        !sizeTitle
    ) {

        console.error("ERROR: Size popup elements are missing.");
        return;
    }

    size12Button.style.display = "none";
    size16Button.style.display = "none";
    size22Button.style.display = "none";

    size12Button.classList.remove("selected-size");
    size16Button.classList.remove("selected-size");
    size22Button.classList.remove("selected-size");

    // 8oz
    if (sizeType === "size8") {

        sizeTitle.textContent = "Size: 8oz";

    }

    // 16oz / 22oz
    else if (sizeType === "size16-22") {

        sizeTitle.textContent = "Choose Size";

        size16Button.style.display = "inline-block";
        size22Button.style.display = "inline-block";

        if (selectedSize === 16) {
            size16Button.classList.add("selected-size");
        }

        if (selectedSize === 22) {
            size22Button.classList.add("selected-size");
        }

    }

    // 12oz / 16oz / 22oz
    else if (sizeType === "size12-16-22") {

        sizeTitle.textContent = "Choose Size";

        size12Button.style.display = "inline-block";
        size16Button.style.display = "inline-block";
        size22Button.style.display = "inline-block";

        if (selectedSize === 12) {
            size12Button.classList.add("selected-size");
        }

        if (selectedSize === 16) {
            size16Button.classList.add("selected-size");
        }

        if (selectedSize === 22) {
            size22Button.classList.add("selected-size");
        }
    }
}

// =====================================================
// SELECT SIZE
// =====================================================

function selectSize(size) {

    selectedSize = size;

    updateSizeDisplay();
}

// =====================================================
// ADD-ON DISPLAY
// =====================================================

function updateAddOnDisplay() {

    const espressoOption =
        document.getElementById("espressoOption");

    const matchaOption =
        document.getElementById("matchaOption");

    const chocolateOption =
        document.getElementById("chocolateOption");

    if (espressoOption) {
        espressoOption.style.display =
            espressoAvailable ? "block" : "none";
    }

    if (matchaOption) {
        matchaOption.style.display =
            matchaAvailable ? "block" : "none";
    }

    if (chocolateOption) {
        chocolateOption.style.display =
            chocolateAvailable ? "block" : "none";
    }
}

// =====================================================
// RESET ADD-ON BUTTONS
// =====================================================

function resetAddOnButtons() {

    const espressoButton =
        document.getElementById("espressoButton");

    const matchaButton =
        document.getElementById("matchaButton");

    const chocolateButton =
        document.getElementById("chocolateButton");

    if (espressoButton) {

        espressoButton.textContent =
            "+ Extra Espresso Shot ₱" +
            EXTRA_ESPRESSO_PRICE;

        espressoButton.classList.remove("selected-size");
    }

    if (matchaButton) {

        matchaButton.textContent =
            "+ Extra Matcha Shot ₱" +
            EXTRA_MATCHA_PRICE;

        matchaButton.classList.remove("selected-size");
    }

    if (chocolateButton) {

        chocolateButton.textContent =
            "+ Extra Chocolate Shot ₱" +
            EXTRA_CHOCOLATE_PRICE;

        chocolateButton.classList.remove("selected-size");
    }
}

// =====================================================
// TOGGLE ESPRESSO
// =====================================================

function toggleEspresso() {

    extraEspresso = !extraEspresso;

    const button =
        document.getElementById("espressoButton");

    if (!button) {
        return;
    }

    if (extraEspresso) {

        button.textContent =
            "✓ Extra Espresso Shot +₱" +
            EXTRA_ESPRESSO_PRICE;

        button.classList.add("selected-size");

    } else {

        button.textContent =
            "+ Extra Espresso Shot ₱" +
            EXTRA_ESPRESSO_PRICE;

        button.classList.remove("selected-size");
    }
}

// =====================================================
// TOGGLE MATCHA
// =====================================================

function toggleMatcha() {

    extraMatcha = !extraMatcha;

    const button =
        document.getElementById("matchaButton");

    if (!button) {
        return;
    }

    if (extraMatcha) {

        button.textContent =
            "✓ Extra Matcha Shot +₱" +
            EXTRA_MATCHA_PRICE;

        button.classList.add("selected-size");

    } else {

        button.textContent =
            "+ Extra Matcha Shot ₱" +
            EXTRA_MATCHA_PRICE;

        button.classList.remove("selected-size");
    }
}

// =====================================================
// TOGGLE CHOCOLATE
// =====================================================

function toggleChocolate() {

    extraChocolate = !extraChocolate;

    const button =
        document.getElementById("chocolateButton");

    if (!button) {
        return;
    }

    if (extraChocolate) {

        button.textContent =
            "✓ Extra Chocolate Shot +₱" +
            EXTRA_CHOCOLATE_PRICE;

        button.classList.add("selected-size");

    } else {

        button.textContent =
            "+ Extra Chocolate Shot ₱" +
            EXTRA_CHOCOLATE_PRICE;

        button.classList.remove("selected-size");
    }
}

// =====================================================
// PRODUCT QUANTITY
// =====================================================

function changeQuantity(amount) {

    quantity += amount;

    if (quantity < 1) {
        quantity = 1;
    }

    const quantityDisplay =
        document.getElementById("quantity");

    if (quantityDisplay) {
        quantityDisplay.textContent = quantity;
    }
}
// =====================================================
// ADD DRINK / PRODUCT TO CART
// =====================================================

function addSelectedProduct() {

    let basePrice = 0;

    // -------------------------------------------------
    // GET BASE PRICE
    // -------------------------------------------------

    if (selectedSize === 8) {
        basePrice = price12;
    }
    else if (selectedSize === 12) {
        basePrice = price12;
    }
    else if (selectedSize === 16) {
        basePrice = price16;
    }
    else if (selectedSize === 22) {
        basePrice = price22;
    }

    // -------------------------------------------------
    // ADD-ON PRICES
    // -------------------------------------------------

    let finalPrice = basePrice;

    if (extraEspresso) {
        finalPrice += EXTRA_ESPRESSO_PRICE;
    }

    if (extraMatcha) {
        finalPrice += EXTRA_MATCHA_PRICE;
    }

    if (extraChocolate) {
        finalPrice += EXTRA_CHOCOLATE_PRICE;
    }

    // -------------------------------------------------
    // CART KEY
    // -------------------------------------------------

    const cartKey =
        selectedProduct +
        "|" +
        selectedCategory +
        "|" +
        selectedSize +
        "|" +
        extraEspresso +
        "|" +
        extraMatcha +
        "|" +
        extraChocolate;

    // -------------------------------------------------
    // FIND EXISTING ITEM
    // -------------------------------------------------

    const existingItem = cart.find(function(item) {

        return item.key === cartKey;

    });

    // -------------------------------------------------
    // COMBINE IDENTICAL ITEM
    // -------------------------------------------------

    if (existingItem) {

        existingItem.quantity += quantity;

    }

    // -------------------------------------------------
    // ADD NEW ITEM
    // -------------------------------------------------

    else {

        cart.push({

            key: cartKey,

            name: selectedProduct,

            category: selectedCategory,

            size: selectedSize + "oz",

            extraEspresso: extraEspresso,

            extraMatcha: extraMatcha,

            extraChocolate: extraChocolate,

            price: finalPrice,

            quantity: quantity

        });

    }

    updateCart();

    closeProduct();

    showOrderNotice();
}


// =====================================================
// UPDATE CART
// =====================================================

function updateCart() {

    const cartDiv =
        document.getElementById("sideCartItems");

    const cartTotal =
        document.getElementById("sideCartTotal");

    const cartCount =
        document.getElementById("cartCount");

    if (!cartDiv || !cartTotal || !cartCount) {

        console.error(
            "ERROR: Cart HTML elements are missing."
        );

        return;
    }

    let total = 0;
    let itemCount = 0;

    cartDiv.innerHTML = "";

    // -------------------------------------------------
    // DISPLAY ITEMS
    // -------------------------------------------------

    cart.forEach(function(item, index) {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;

        itemCount += item.quantity;

        // -------------------------------------------------
        // BUILD OPTIONS
        // -------------------------------------------------

        let options = [];

        if (item.size) {
            options.push(item.size);
        }

        if (item.extraEspresso) {
            options.push("Extra Espresso");
        }

        if (item.extraMatcha) {
            options.push("Extra Matcha");
        }

        if (item.extraChocolate) {
            options.push("Extra Chocolate");
        }

        const optionText =
            options.join(" • ");

        // -------------------------------------------------
        // CREATE CART ITEM
        // -------------------------------------------------

        const itemElement =
            document.createElement("div");

        itemElement.innerHTML = `

            <div class="cart-item">

                <div class="cart-item-name">
                    ${item.name}
                </div>

                <div class="cart-item-options">
                    ${optionText}
                </div>

                <div class="cart-item-price">
                    ₱${itemTotal}
                </div>

                <div class="cart-controls">

                    <button
                        type="button"
                        onclick="changeCartQuantity(${index}, -1)">
                        −
                    </button>

                    <strong>
                        ${item.quantity}
                    </strong>

                    <button
                        type="button"
                        onclick="changeCartQuantity(${index}, 1)">
                        +
                    </button>

                    <button
                        type="button"
                        class="remove-button"
                        onclick="removeItem(${index})">
                        Remove
                    </button>

                </div>

            </div>

        `;

        cartDiv.appendChild(itemElement);

    });

    // -------------------------------------------------
    // EMPTY CART
    // -------------------------------------------------

    if (cart.length === 0) {

        cartDiv.innerHTML =
            "<p>Your cart is empty.</p>";

    }

    // -------------------------------------------------
    // TOTAL
    // -------------------------------------------------

    cartTotal.textContent = total;

    // -------------------------------------------------
    // COUNT
    // -------------------------------------------------

    cartCount.textContent =
        itemCount +
        (itemCount === 1 ? " item" : " items");
}


// =====================================================
// CHANGE CART QUANTITY
// =====================================================

function changeCartQuantity(index, amount) {

    if (!cart[index]) {
        return;
    }

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    updateCart();
}


// =====================================================
// REMOVE CART ITEM
// =====================================================

function removeItem(index) {

    if (!cart[index]) {
        return;
    }

    cart.splice(index, 1);

    updateCart();
}


// =====================================================
// CLOSE PRODUCT POPUP
// =====================================================

function closeProduct() {

    const overlay =
        document.getElementById("productOverlay");

    const productPopup =
        document.getElementById("productPopup");

    const snackPopup =
        document.getElementById("snackPopupContent");

    const mealPopup =
        document.getElementById("mealPopupContent");

    if (overlay) {

        overlay.style.display = "none";

    }

    if (productPopup) {

        productPopup.style.display = "none";

    }

    if (snackPopup) {

        snackPopup.style.display = "none";

    }

    if (mealPopup) {

        mealPopup.style.display = "none";

    }
}


// =====================================================
// ORDER NOTICE
// =====================================================

function showOrderNotice() {

    const notice =
        document.getElementById("orderNotice");

    if (!notice) {
        return;
    }

    notice.style.display = "block";

    setTimeout(function() {

        notice.style.display = "none";

    }, 2000);
}


// =====================================================
// SNACK SYSTEM
// =====================================================

let selectedSnackName = "";
let selectedSnackCategory = "";
let selectedSnackType = "";

let snackChoices = [];
let snackFlavors = [];

let selectedSnackChoice = null;
let selectedSnackFlavor = null;

let snackQuantity = 1;


// =====================================================
// OPEN SNACK
// =====================================================

function openSnack(
    snackName,
    category,
    type,
    choices,
    flavors = []
) {

    selectedSnackName = snackName;
    selectedSnackCategory = category;
    selectedSnackType = type;

    snackChoices = choices || [];
    snackFlavors = flavors || [];

    selectedSnackChoice = null;
    selectedSnackFlavor = null;

    snackQuantity = 1;

    // -------------------------------------------------
    // TEXT
    // -------------------------------------------------

    const snackTitle =
        document.getElementById("selectedSnack");

    const snackCategory =
        document.getElementById("selectedSnackCategory");

    const snackQuantityDisplay =
        document.getElementById("snackQuantity");

    if (snackTitle) {
        snackTitle.textContent = snackName;
    }

    if (snackCategory) {
        snackCategory.textContent = category;
    }

    if (snackQuantityDisplay) {
        snackQuantityDisplay.textContent = snackQuantity;
    }

    // -------------------------------------------------
    // CHOICES
    // -------------------------------------------------

    const choiceContainer =
        document.getElementById("snackChoiceButtons");

    const choicesSection =
        document.getElementById("snackChoices");

    if (!choiceContainer) {

        console.error(
            "ERROR: #snackChoiceButtons was not found."
        );

        return;
    }

    choiceContainer.innerHTML = "";

    if (snackChoices.length > 1) {

        if (choicesSection) {
            choicesSection.style.display = "block";
        }

        snackChoices.forEach(function(choice, index) {

            const button =
                document.createElement("button");

            button.type = "button";

            button.textContent =
                choice.name +
                " - ₱" +
                choice.price;

            button.classList.add(
                "snack-choice-button"
            );

            button.onclick = function() {

                selectSnackChoice(index);

            };

            choiceContainer.appendChild(button);

        });

    }
    else {

        if (choicesSection) {
            choicesSection.style.display = "none";
        }

        if (snackChoices.length === 1) {

            selectedSnackChoice =
                snackChoices[0];

        }
    }

    // -------------------------------------------------
    // FLAVORS
    // -------------------------------------------------

    const flavorContainer =
        document.getElementById("snackFlavorButtons");

    const flavorsSection =
        document.getElementById("snackFlavors");

    if (!flavorContainer) {

        console.error(
            "ERROR: #snackFlavorButtons was not found."
        );

        return;
    }

    flavorContainer.innerHTML = "";

    if (snackFlavors.length > 0) {

        if (flavorsSection) {
            flavorsSection.style.display = "block";
        }

        snackFlavors.forEach(function(flavor, index) {

            const button =
                document.createElement("button");

            button.type = "button";

            button.textContent = flavor;

            button.classList.add(
                "snack-flavor-button"
            );

            button.onclick = function() {

                selectSnackFlavor(index);

            };

            flavorContainer.appendChild(button);

        });

    }
    else {

        if (flavorsSection) {
            flavorsSection.style.display = "none";
        }
    }

    // -------------------------------------------------
    // SHOW SNACK POPUP
    // -------------------------------------------------

    const overlay =
        document.getElementById("productOverlay");

    const productPopup =
        document.getElementById("productPopup");

    const snackPopup =
        document.getElementById("snackPopupContent");

    const mealPopup =
        document.getElementById("mealPopupContent");

    if (!overlay || !snackPopup) {

        console.error(
            "ERROR: Snack popup elements are missing."
        );

        return;
    }

    overlay.style.display = "flex";

    if (productPopup) {
        productPopup.style.display = "none";
    }

    snackPopup.style.display = "block";

    if (mealPopup) {
        mealPopup.style.display = "none";
    }
}


// =====================================================
// SELECT SNACK CHOICE
// =====================================================

function selectSnackChoice(index) {

    if (!snackChoices[index]) {
        return;
    }

    selectedSnackChoice =
        snackChoices[index];

    const buttons =
        document.querySelectorAll(
            ".snack-choice-button"
        );

    buttons.forEach(function(button, i) {

        if (i === index) {

            button.classList.add(
                "selected-snack"
            );

        }
        else {

            button.classList.remove(
                "selected-snack"
            );

        }

    });
}


// =====================================================
// SELECT SNACK FLAVOR
// =====================================================

function selectSnackFlavor(index) {

    if (!snackFlavors[index]) {
        return;
    }

    selectedSnackFlavor =
        snackFlavors[index];

    const buttons =
        document.querySelectorAll(
            ".snack-flavor-button"
        );

    buttons.forEach(function(button, i) {

        if (i === index) {

            button.classList.add(
                "selected-snack"
            );

        }
        else {

            button.classList.remove(
                "selected-snack"
            );

        }

    });
}


// =====================================================
// SNACK QUANTITY
// =====================================================

function changeSnackQuantity(amount) {

    snackQuantity += amount;

    if (snackQuantity < 1) {
        snackQuantity = 1;
    }

    const quantityDisplay =
        document.getElementById("snackQuantity");

    if (quantityDisplay) {

        quantityDisplay.textContent =
            snackQuantity;

    }
}


// =====================================================
// ADD SNACK TO CART
// =====================================================

function addSnackToCart() {

    // -------------------------------------------------
    // REQUIRE CHOICE
    // -------------------------------------------------

    if (!selectedSnackChoice) {

        alert(
            "Please choose an option first."
        );

        return;
    }

    // -------------------------------------------------
    // REQUIRE FLAVOR
    // -------------------------------------------------

    if (
        snackFlavors.length > 0 &&
        !selectedSnackFlavor
    ) {

        alert(
            "Please choose a flavor first."
        );

        return;
    }

    // -------------------------------------------------
    // PRICE
    // -------------------------------------------------

    const finalPrice =
        selectedSnackChoice.price;

    // -------------------------------------------------
    // OPTION TEXT
    // -------------------------------------------------

    let optionText =
        selectedSnackChoice.name;

    if (selectedSnackFlavor) {

        optionText +=
            " • " +
            selectedSnackFlavor;

    }

    // -------------------------------------------------
    // CART KEY
    // -------------------------------------------------

    const cartKey =
        selectedSnackName +
        "|" +
        optionText;

    // -------------------------------------------------
    // CHECK EXISTING
    // -------------------------------------------------

    const existingItem =
        cart.find(function(item) {

            return item.key === cartKey;

        });

    if (existingItem) {

        existingItem.quantity +=
            snackQuantity;

    }
    else {

        cart.push({

            key: cartKey,

            name: selectedSnackName,

            category: selectedSnackCategory,

            size: optionText,

            addons: "",

            price: finalPrice,

            quantity: snackQuantity

        });
    }

    updateCart();

    closeSnack();

    showOrderNotice();
}


// =====================================================
// CLOSE SNACK
// =====================================================

function closeSnack() {

    const overlay =
        document.getElementById("productOverlay");

    const snackPopup =
        document.getElementById("snackPopupContent");

    const productPopup =
        document.getElementById("productPopup");

    const mealPopup =
        document.getElementById("mealPopupContent");

    if (overlay) {
        overlay.style.display = "none";
    }

    if (snackPopup) {
        snackPopup.style.display = "none";
    }

    if (mealPopup) {
        mealPopup.style.display = "none";
    }

    if (productPopup) {
        productPopup.style.display = "none";
    }

    selectedSnackChoice = null;
    selectedSnackFlavor = null;
}


// =====================================================
// RESET SNACK SELECTIONS
// =====================================================

function resetSnackSelections() {

    selectedSnackChoice = null;
    selectedSnackFlavor = null;

    document
        .querySelectorAll(".snack-choice-button")
        .forEach(function(button) {

            button.classList.remove(
                "selected-snack"
            );

        });

    document
        .querySelectorAll(".snack-flavor-button")
        .forEach(function(button) {

            button.classList.remove(
                "selected-snack"
            );

        });
}
// =====================================================
// MEAL SYSTEM
// =====================================================

let selectedMealName = "";
let selectedMealChoice = null;

let mealChoices = [];

let selectedMealCooler = "None";
let mealCoolerPrice = 0;

let extraEgg = false;
let extraRice = false;

let mealQuantity = 1;

// =====================================================
// MEAL ADD-ON PRICES
// =====================================================

const EXTRA_EGG_PRICE = 10;
const EXTRA_RICE_PRICE = 15;

// =====================================================
// OPEN MEAL
// =====================================================

function openMeal(mealName, choices) {

    selectedMealName = mealName;
    mealChoices = choices || [];

    selectedMealChoice = null;

    selectedMealCooler = "None";
    mealCoolerPrice = 0;

    extraEgg = false;
    extraRice = false;

    mealQuantity = 1;

    // -------------------------------------------------
    // GET ELEMENTS
    // -------------------------------------------------

    const mealTitle =
        document.getElementById("selectedMeal");

    const mealCategory =
        document.getElementById("selectedMealCategory");

    const mealQuantityDisplay =
        document.getElementById("mealQuantity");

    const choiceContainer =
        document.getElementById("mealChoiceButtons");

    if (!mealTitle) {

        console.error(
            "ERROR: #selectedMeal was not found."
        );

        return;
    }

    if (!mealCategory) {

        console.error(
            "ERROR: #selectedMealCategory was not found."
        );

        return;
    }

    if (!mealQuantityDisplay) {

        console.error(
            "ERROR: #mealQuantity was not found."
        );

        return;
    }

    if (!choiceContainer) {

        console.error(
            "ERROR: #mealChoiceButtons was not found."
        );

        return;
    }

    // -------------------------------------------------
    // UPDATE TEXT
    // -------------------------------------------------

    mealTitle.textContent =
        mealName;

    mealCategory.textContent =
        "Pit Stop Plates";

    mealQuantityDisplay.textContent =
        mealQuantity;

    // -------------------------------------------------
    // CREATE CHOICE BUTTONS
    // -------------------------------------------------

    choiceContainer.innerHTML = "";

    mealChoices.forEach(function(choice, index) {

        const button =
            document.createElement("button");

        button.type = "button";

        button.textContent =
            choice.name +
            " - ₱" +
            choice.price;

        button.classList.add(
            "meal-option-button"
        );

        button.onclick = function() {

            selectMealChoice(index);

        };

        choiceContainer.appendChild(button);

    });

    // -------------------------------------------------
    // RESET OPTIONS
    // -------------------------------------------------

    resetMealCooler();
    resetMealAddons();

    // -------------------------------------------------
    // SHOW MEAL POPUP
    // -------------------------------------------------

    const overlay =
        document.getElementById("productOverlay");

    const productPopup =
        document.getElementById("productPopup");

    const snackPopup =
        document.getElementById("snackPopupContent");

    const mealPopup =
        document.getElementById("mealPopupContent");

    if (!overlay || !mealPopup) {

        console.error(
            "ERROR: Meal popup elements are missing."
        );

        return;
    }

    overlay.style.display = "flex";

    if (productPopup) {
        productPopup.style.display = "none";
    }

    if (snackPopup) {
        snackPopup.style.display = "none";
    }

    mealPopup.style.display = "block";
}

// =====================================================
// SELECT MEAL CHOICE
// =====================================================

function selectMealChoice(index) {

    if (!mealChoices[index]) {
        return;
    }

    selectedMealChoice =
        mealChoices[index];

    const buttons =
        document.querySelectorAll(
            "#mealChoiceButtons .meal-option-button"
        );

    buttons.forEach(function(button, i) {

        if (i === index) {

            button.classList.add(
                "selected-meal"
            );

        }
        else {

            button.classList.remove(
                "selected-meal"
            );
        }

    });
}

// =====================================================
// SELECT HIGHWAY COOLER
// =====================================================

function selectMealCooler(
    coolerName,
    price
) {

    selectedMealCooler =
        coolerName;

    mealCoolerPrice =
        price;

    const buttons =
        document.querySelectorAll(
            "#mealCooler .meal-option-button"
        );

    buttons.forEach(function(button) {

        button.classList.remove(
            "selected-meal"
        );

    });

    if (coolerName === "None") {

        const button =
            document.getElementById(
                "coolerNoneButton"
            );

        if (button) {

            button.classList.add(
                "selected-meal"
            );

        }

    }

    else if (
        coolerName === "Highway Cooler 16oz"
    ) {

        const button =
            document.getElementById(
                "cooler16Button"
            );

        if (button) {

            button.classList.add(
                "selected-meal"
            );

        }

    }

    else if (
        coolerName === "Highway Cooler 22oz"
    ) {

        const button =
            document.getElementById(
                "cooler22Button"
            );

        if (button) {

            button.classList.add(
                "selected-meal"
            );

        }

    }
}

// =====================================================
// RESET HIGHWAY COOLER
// =====================================================

function resetMealCooler() {

    selectedMealCooler =
        "None";

    mealCoolerPrice =
        0;

    const noneButton =
        document.getElementById(
            "coolerNoneButton"
        );

    const button16 =
        document.getElementById(
            "cooler16Button"
        );

    const button22 =
        document.getElementById(
            "cooler22Button"
        );

    if (noneButton) {

        noneButton.classList.add(
            "selected-meal"
        );

    }

    if (button16) {

        button16.classList.remove(
            "selected-meal"
        );

    }

    if (button22) {

        button22.classList.remove(
            "selected-meal"
        );

    }
}

// =====================================================
// TOGGLE EXTRA EGG
// =====================================================

function toggleExtraEgg() {

    extraEgg = !extraEgg;

    const button =
        document.getElementById(
            "extraEggButton"
        );

    if (!button) {
        return;
    }

    if (extraEgg) {

        button.textContent =
            "✓ Extra Egg +₱" +
            EXTRA_EGG_PRICE;

        button.classList.add(
            "selected-meal"
        );

    }
    else {

        button.textContent =
            "+ Extra Egg ₱" +
            EXTRA_EGG_PRICE;

        button.classList.remove(
            "selected-meal"
        );

    }
}

// =====================================================
// TOGGLE EXTRA RICE
// =====================================================

function toggleExtraRice() {

    extraRice = !extraRice;

    const button =
        document.getElementById(
            "extraRiceButton"
        );

    if (!button) {
        return;
    }

    if (extraRice) {

        button.textContent =
            "✓ Extra Rice +₱" +
            EXTRA_RICE_PRICE;

        button.classList.add(
            "selected-meal"
        );

    }
    else {

        button.textContent =
            "+ Extra Rice ₱" +
            EXTRA_RICE_PRICE;

        button.classList.remove(
            "selected-meal"
        );

    }
}

// =====================================================
// RESET MEAL ADD-ONS
// =====================================================

function resetMealAddons() {

    extraEgg = false;
    extraRice = false;

    const eggButton =
        document.getElementById(
            "extraEggButton"
        );

    const riceButton =
        document.getElementById(
            "extraRiceButton"
        );

    if (eggButton) {

        eggButton.textContent =
            "+ Extra Egg ₱" +
            EXTRA_EGG_PRICE;

        eggButton.classList.remove(
            "selected-meal"
        );

    }

    if (riceButton) {

        riceButton.textContent =
            "+ Extra Rice ₱" +
            EXTRA_RICE_PRICE;

        riceButton.classList.remove(
            "selected-meal"
        );

    }
}

// =====================================================
// MEAL QUANTITY
// =====================================================

function changeMealQuantity(amount) {

    mealQuantity += amount;

    if (mealQuantity < 1) {
        mealQuantity = 1;
    }

    const quantityDisplay =
        document.getElementById(
            "mealQuantity"
        );

    if (quantityDisplay) {

        quantityDisplay.textContent =
            mealQuantity;

    }
}

// =====================================================
// ADD MEAL TO CART
// =====================================================

function addMealToCart() {

    // -------------------------------------------------
    // REQUIRE MEAL CHOICE
    // -------------------------------------------------

    if (!selectedMealChoice) {

        alert(
            "Please choose a meal option first."
        );

        return;
    }

    // -------------------------------------------------
    // CALCULATE PRICE
    // -------------------------------------------------

    let finalPrice =
        selectedMealChoice.price;

    finalPrice +=
        mealCoolerPrice;

    if (extraEgg) {

        finalPrice +=
            EXTRA_EGG_PRICE;

    }

    if (extraRice) {

        finalPrice +=
            EXTRA_RICE_PRICE;

    }

    // -------------------------------------------------
    // OPTION TEXT
    // -------------------------------------------------

    let optionText =
        selectedMealChoice.name;

    if (selectedMealCooler !== "None") {

        optionText +=
            " • " +
            selectedMealCooler;

    }

    if (extraEgg) {

        optionText +=
            " • Extra Egg";

    }

    if (extraRice) {

        optionText +=
            " • Extra Rice";

    }

    // -------------------------------------------------
    // CART KEY
    // -------------------------------------------------

    const cartKey =
        selectedMealName +
        "|" +
        optionText;

    // -------------------------------------------------
    // FIND EXISTING
    // -------------------------------------------------

    const existingItem =
        cart.find(function(item) {

            return item.key === cartKey;

        });

    if (existingItem) {

        existingItem.quantity +=
            mealQuantity;

    }
    else {

        cart.push({

            key: cartKey,

            name: selectedMealName,

            category: "Pit Stop Plates",

            size: optionText,

            addons: "",

            price: finalPrice,

            quantity: mealQuantity

        });
    }

    updateCart();

    closeMeal();

    showOrderNotice();
}

// =====================================================
// CLOSE MEAL
// =====================================================

function closeMeal() {

    const overlay =
        document.getElementById(
            "productOverlay"
        );

    const mealPopup =
        document.getElementById(
            "mealPopupContent"
        );

    const productPopup =
        document.getElementById(
            "productPopup"
        );

    const snackPopup =
        document.getElementById(
            "snackPopupContent"
        );

    if (overlay) {

        overlay.style.display =
            "none";

    }

    if (mealPopup) {

        mealPopup.style.display =
            "none";

    }

    if (snackPopup) {

        snackPopup.style.display =
            "none";

    }

    if (productPopup) {

        productPopup.style.display =
            "none";

    }

    selectedMealChoice =
        null;
}

// =====================================================
// POPUP OVERLAY CLICK
// =====================================================

function setupPopupOverlay() {

    const productOverlay =
        document.getElementById(
            "productOverlay"
        );

    if (!productOverlay) {

        console.warn(
            "WARNING: #productOverlay was not found."
        );

        return;
    }

    productOverlay.addEventListener(
        "click",
        function(event) {

            // Only close when clicking
            // directly on the overlay.

            if (event.target !== productOverlay) {
                return;
            }

            const productPopup =
                document.getElementById(
                    "productPopup"
                );

            const snackPopup =
                document.getElementById(
                    "snackPopupContent"
                );

            const mealPopup =
                document.getElementById(
                    "mealPopupContent"
                );

            // -------------------------------------------------
            // PRODUCT
            // -------------------------------------------------

            if (
                productPopup &&
                productPopup.style.display !== "none"
            ) {

                closeProduct();

                return;
            }

            // -------------------------------------------------
            // SNACK
            // -------------------------------------------------

            if (
                snackPopup &&
                snackPopup.style.display !== "none"
            ) {

                closeSnack();

                return;
            }

            // -------------------------------------------------
            // MEAL
            // -------------------------------------------------

            if (
                mealPopup &&
                mealPopup.style.display !== "none"
            ) {

                closeMeal();

            }

        }
    );
}

// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        setupPopupOverlay();

        updateCart();

    }
);