/* =====================================================
   HIGHWAY CAFE
   COMPLETE ORDERING SYSTEM
===================================================== */


/* =====================================================
   CART
===================================================== */

let cart = [];


/* =====================================================
   PRODUCT VARIABLES
===================================================== */

let selectedProduct = "";
let selectedCategory = "";

let price8 = 0;
let price12 = 0;
let price16 = 0;
let price22 = 0;

let sizeType = "";
let selectedSize = 16;


/* =====================================================
   ADD-ONS
===================================================== */

let espressoAvailable = false;
let matchaAvailable = false;
let chocolateAvailable = false;

let extraEspresso = false;
let extraMatcha = false;
let extraChocolate = false;

const ESPRESSO_PRICE = 30;
const MATCHA_PRICE = 30;
const CHOCOLATE_PRICE = 30;


/* =====================================================
   GENERAL
===================================================== */

let quantity = 1;

const DELIVERY_FEE = 20;


/* =====================================================
   SNACK VARIABLES
===================================================== */

let selectedSnack = "";
let selectedSnackCategory = "";

let snackChoices = [];
let snackFlavors = [];

let selectedSnackChoice = null;
let selectedSnackFlavor = "";

let snackQuantity = 1;


/* =====================================================
   MEAL VARIABLES
===================================================== */

let selectedMeal = "";

let mealChoices = [];
let selectedMealChoice = null;

let selectedMealCooler = "None";
let selectedMealCoolerPrice = 0;

let extraEgg = false;
let extraRice = false;

let mealQuantity = 1;


/* =====================================================
   CHECKOUT VARIABLES
===================================================== */

let orderType = "pickup";
let paymentMethod = "cash";


/* =====================================================
   START ORDER
===================================================== */

function startOrder() {

    const menu =
        document.getElementById("menu");

    if (!menu) {

        console.error(
            "ERROR: #menu was not found."
        );

        return;
    }

    menu.style.display = "block";

    menu.scrollIntoView({
        behavior: "smooth"
    });
}


/* =====================================================
   PRODUCT POPUP
===================================================== */

function openProduct(
    productName,
    category,
    p16,
    p22,
    addons,
    p12 = 0,
    p8 = 0
) {

    selectedProduct = productName;
    selectedCategory = category;

    price8 = Number(p8) || 0;
    price12 = Number(p12) || 0;
    price16 = Number(p16) || 0;
    price22 = Number(p22) || 0;


    /* ---------------------------------------------
       DETERMINE SIZE TYPE
    --------------------------------------------- */

    if (category === "Hot Coffee") {

        sizeType = "size8";

        selectedSize = 8;

    }

    else if (category === "Soda Series") {

        sizeType = "size12-16-22";

        price12 = 29;

        selectedSize = 12;

    }

    else {

        sizeType = "size16-22";

        selectedSize = 16;

    }


    /* ---------------------------------------------
       RESET QUANTITY
    --------------------------------------------- */

    quantity = 1;

    const quantityInput =
        document.getElementById("quantity");

    if (quantityInput) {
        quantityInput.value = 1;
    }


    /* ---------------------------------------------
       RESET ADD-ONS
    --------------------------------------------- */

    extraEspresso = false;
    extraMatcha = false;
    extraChocolate = false;


    /* ---------------------------------------------
       DETERMINE AVAILABLE ADD-ONS
    --------------------------------------------- */

    let addonList = [];

    if (Array.isArray(addons)) {
        addonList = addons;
    }

    else if (typeof addons === "string") {
        addonList = [addons];
    }


    espressoAvailable =
        addonList.includes("espresso");

    matchaAvailable =
        addonList.includes("matcha");

    chocolateAvailable =
        addonList.includes("chocolate");


    /* ---------------------------------------------
       DISPLAY PRODUCT
    --------------------------------------------- */

    const productDisplay =
        document.getElementById(
            "selectedProduct"
        );

    if (productDisplay) {

        productDisplay.textContent =
            selectedProduct;
    }


    const categoryDisplay =
        document.getElementById(
            "selectedCategory"
        );

    if (categoryDisplay) {

        categoryDisplay.textContent =
            selectedCategory;
    }


    /* ---------------------------------------------
       SIZE BUTTONS
    --------------------------------------------- */

    const size12Button =
        document.getElementById(
            "size12Button"
        );

    const size16Button =
        document.getElementById(
            "size16Button"
        );

    const size22Button =
        document.getElementById(
            "size22Button"
        );


    /* 12oz */

    if (size12Button) {

        if (sizeType === "size12-16-22") {

            size12Button.style.display =
                "inline-block";

            size12Button.textContent =
                "12oz - ₱" + price12;

        }

        else {

            size12Button.style.display =
                "none";
        }
    }


    /* 16oz / 8oz */

    if (size16Button) {

        size16Button.style.display =
            "inline-block";

        if (sizeType === "size8") {

            size16Button.textContent =
                "8oz - ₱" + price8;

        }

        else {

            size16Button.textContent =
                "16oz - ₱" + price16;
        }
    }


    /* 22oz */

    if (size22Button) {

        if (
            sizeType === "size16-22" ||
            sizeType === "size12-16-22"
        ) {

            size22Button.style.display =
                "inline-block";

            size22Button.textContent =
                "22oz - ₱" + price22;

        }

        else {

            size22Button.style.display =
                "none";
        }
    }


    /* ---------------------------------------------
       SIZE TITLE
    --------------------------------------------- */

    const sizeTitle =
        document.getElementById(
            "sizeTitle"
        );

    if (sizeTitle) {

        sizeTitle.textContent =
            sizeType === "size8"
                ? "Size"
                : "Choose Size";
    }


    /* ---------------------------------------------
       ADD-ON VISIBILITY
    --------------------------------------------- */

    const espressoOption =
        document.getElementById(
            "espressoOption"
        );

    const matchaOption =
        document.getElementById(
            "matchaOption"
        );

    const chocolateOption =
        document.getElementById(
            "chocolateOption"
        );


    if (espressoOption) {

        espressoOption.style.display =
            espressoAvailable
                ? "block"
                : "none";
    }


    if (matchaOption) {

        matchaOption.style.display =
            matchaAvailable
                ? "block"
                : "none";
    }


    if (chocolateOption) {

        chocolateOption.style.display =
            chocolateAvailable
                ? "block"
                : "none";
    }


    resetAddonButtons();

    updateSelectedProductPrice();

    showPopup(
        "productOverlay",
        "productPopup"
    );
}


/* =====================================================
   PRODUCT PRICE
===================================================== */

function getBasePriceForSize(size) {

    if (sizeType === "size8") {
        return price8;
    }

    if (size === 12) {
        return price12;
    }

    if (size === 16) {
        return price16;
    }

    if (size === 22) {
        return price22;
    }

    return 0;
}


function selectSize(size) {

    if (
        size === 12 &&
        sizeType !== "size12-16-22"
    ) {
        return;
    }


    if (
        size === 22 &&
        sizeType !== "size16-22" &&
        sizeType !== "size12-16-22"
    ) {
        return;
    }


    if (
        size === 8 &&
        sizeType !== "size8"
    ) {
        return;
    }


    selectedSize = size;


    const buttons = [

        document.getElementById(
            "size12Button"
        ),

        document.getElementById(
            "size16Button"
        ),

        document.getElementById(
            "size22Button"
        )
    ];


    buttons.forEach(function(button) {

        if (button) {

            button.classList.remove(
                "selected-option"
            );
        }
    });


    let selectedButton = null;


    if (size === 12) {

        selectedButton =
            document.getElementById(
                "size12Button"
            );
    }

    else if (
        size === 16 ||
        size === 8
    ) {

        selectedButton =
            document.getElementById(
                "size16Button"
            );
    }

    else if (size === 22) {

        selectedButton =
            document.getElementById(
                "size22Button"
            );
    }


    if (selectedButton) {

        selectedButton.classList.add(
            "selected-option"
        );
    }


    updateSelectedProductPrice();
}


/* =====================================================
   PRODUCT PRICE UPDATE
===================================================== */

function updateSelectedProductPrice() {

    const priceDisplay =
        document.getElementById(
            "selectedProductPrice"
        );

    if (!priceDisplay) {
        return;
    }


    let finalPrice =
        getBasePriceForSize(
            selectedSize
        );


    if (extraEspresso) {
        finalPrice += ESPRESSO_PRICE;
    }

    if (extraMatcha) {
        finalPrice += MATCHA_PRICE;
    }

    if (extraChocolate) {
        finalPrice += CHOCOLATE_PRICE;
    }


    priceDisplay.textContent =
        finalPrice;
}


/* =====================================================
   ADD-ONS
===================================================== */

function toggleAddon(type) {

    if (type === "espresso") {

        toggleEspresso();

    }

    else if (type === "matcha") {

        toggleMatcha();

    }

    else if (type === "chocolate") {

        toggleChocolate();

    }
}


function toggleEspresso() {

    if (!espressoAvailable) {
        return;
    }

    extraEspresso =
        !extraEspresso;

    updateAddonButton(
        "espressoButton",
        extraEspresso
    );

    updateSelectedProductPrice();
}


function toggleMatcha() {

    if (!matchaAvailable) {
        return;
    }

    extraMatcha =
        !extraMatcha;

    updateAddonButton(
        "matchaButton",
        extraMatcha
    );

    updateSelectedProductPrice();
}


function toggleChocolate() {

    if (!chocolateAvailable) {
        return;
    }

    extraChocolate =
        !extraChocolate;

    updateAddonButton(
        "chocolateButton",
        extraChocolate
    );

    updateSelectedProductPrice();
}


function updateAddonButton(
    id,
    selected
) {

    const button =
        document.getElementById(id);

    if (!button) {
        return;
    }

    button.classList.toggle(
        "selected-option",
        selected
    );
}


function resetAddonButtons() {

    updateAddonButton(
        "espressoButton",
        false
    );

    updateAddonButton(
        "matchaButton",
        false
    );

    updateAddonButton(
        "chocolateButton",
        false
    );
}


/* =====================================================
   PRODUCT QUANTITY
===================================================== */

function getProductQuantity() {

    const input =
        document.getElementById(
            "quantity"
        );

    if (!input) {
        return 1;
    }


    let value =
        parseInt(
            input.value,
            10
        );


    if (
        isNaN(value) ||
        value < 1
    ) {
        value = 1;
    }


    quantity = value;

    input.value = value;

    return value;
}


/* =====================================================
   ADD PRODUCT TO CART
===================================================== */

function addSelectedProduct() {

    const selectedQuantity =
        getProductQuantity();


    let finalPrice =
        getBasePriceForSize(
            selectedSize
        );


    if (extraEspresso) {
        finalPrice += ESPRESSO_PRICE;
    }

    if (extraMatcha) {
        finalPrice += MATCHA_PRICE;
    }

    if (extraChocolate) {
        finalPrice += CHOCOLATE_PRICE;
    }


    const sizeText =
        sizeType === "size8"
            ? "8oz"
            : selectedSize + "oz";


    const item = {

        name: selectedProduct,

        category: selectedCategory,

        size: sizeText,

        price: finalPrice,

        quantity: selectedQuantity,

        extraEspresso:
            extraEspresso,

        extraMatcha:
            extraMatcha,

        extraChocolate:
            extraChocolate
    };


    addItemToCart(item);

    closeProduct();

    showOrderNotice();
}


/* =====================================================
   ADD ITEM TO CART
===================================================== */

function addItemToCart(newItem) {

    const existing =
        cart.find(function(item) {

            return (

                item.name ===
                    newItem.name &&

                item.category ===
                    newItem.category &&

                item.size ===
                    newItem.size &&

                item.price ===
                    newItem.price &&

                item.option ===
                    newItem.option &&

                item.flavor ===
                    newItem.flavor &&

                item.cooler ===
                    newItem.cooler &&

                item.extraEspresso ===
                    newItem.extraEspresso &&

                item.extraMatcha ===
                    newItem.extraMatcha &&

                item.extraChocolate ===
                    newItem.extraChocolate &&

                item.extraEgg ===
                    newItem.extraEgg &&

                item.extraRice ===
                    newItem.extraRice
            );
        });


    if (existing) {

        existing.quantity +=
            Number(
                newItem.quantity || 1
            );

    }

    else {

        cart.push(newItem);
    }


    updateCart();
}


/* =====================================================
   POPUP SYSTEM
===================================================== */

function showPopup(
    overlayId,
    popupId
) {

    const allOverlays = [

        "productOverlay",

        "snackOverlay",

        "mealOverlay",

        "checkoutOverlay",

        "orderConfirmationPopup"
    ];


    allOverlays.forEach(function(id) {

        const overlay =
            document.getElementById(id);

        if (overlay) {

            overlay.style.display =
                "none";
        }
    });


    const overlay =
        document.getElementById(
            overlayId
        );

    const popup =
        document.getElementById(
            popupId
        );


    if (overlay) {

        overlay.style.display =
            "flex";
    }


    if (popup) {

        popup.style.display =
            "block";
    }
}


/* =====================================================
   CLOSE PRODUCT
===================================================== */

function closeProduct() {

    const overlay =
        document.getElementById(
            "productOverlay"
        );

    if (overlay) {

        overlay.style.display =
            "none";
    }
}


/* =====================================================
   ORDER NOTICE
===================================================== */

function showOrderNotice() {

    const notice =
        document.getElementById(
            "orderNotice"
        );

    if (!notice) {
        return;
    }


    notice.textContent =
        "✓ Order added to cart!";


    notice.style.display =
        "block";


    clearTimeout(
        window.highwayCafeNoticeTimer
    );


    window.highwayCafeNoticeTimer =
        setTimeout(function() {

            notice.style.display =
                "none";

        }, 1800);
}


/* =====================================================
   SNACK
===================================================== */

function openSnack(
    snackName,
    category,
    choices,
    flavors = []
) {

    selectedSnack =
        snackName;

    selectedSnackCategory =
        category;

    selectedSnackChoice =
        null;

    selectedSnackFlavor =
        "";

    snackQuantity = 1;

    snackChoices = [];


    /* ---------------------------------------------
       CONVERT CHOICES
    --------------------------------------------- */

    if (Array.isArray(choices)) {

        choices.forEach(function(choice) {

            if (Array.isArray(choice)) {

                snackChoices.push({

                    name: choice[0],

                    price:
                        Number(
                            choice[1]
                        ) || 0
                });

            }

            else if (
                choice &&
                typeof choice === "object"
            ) {

                snackChoices.push({

                    name: choice.name,

                    price:
                        Number(
                            choice.price
                        ) || 0
                });
            }
        });
    }


    snackFlavors =
        Array.isArray(flavors)
            ? flavors
            : [];


    /* ---------------------------------------------
       DISPLAY
    --------------------------------------------- */

    const snackDisplay =
        document.getElementById(
            "selectedSnack"
        );

    if (snackDisplay) {

        snackDisplay.textContent =
            selectedSnack;
    }


    const categoryDisplay =
        document.getElementById(
            "selectedSnackCategory"
        );

    if (categoryDisplay) {

        categoryDisplay.textContent =
            selectedSnackCategory;
    }


    const quantityInput =
        document.getElementById(
            "snackQuantity"
        );

    if (quantityInput) {

        quantityInput.value = 1;
    }


    /* ---------------------------------------------
       CHOICE BUTTONS
    --------------------------------------------- */

    const choiceContainer =
        document.getElementById(
            "snackChoiceButtons"
        );


    if (choiceContainer) {

        choiceContainer.innerHTML = "";


        snackChoices.forEach(
            function(choice, index) {

                const button =
                    document.createElement(
                        "button"
                    );

                button.type = "button";

                button.textContent =
                    choice.name +
                    " - ₱" +
                    choice.price;


                button.addEventListener(
                    "click",
                    function() {

                        selectSnackChoice(
                            index
                        );
                    }
                );


                choiceContainer.appendChild(
                    button
                );
            }
        );
    }


    /* ---------------------------------------------
       FLAVORS
    --------------------------------------------- */

    const flavorSection =
        document.getElementById(
            "snackFlavors"
        );

    const flavorContainer =
        document.getElementById(
            "snackFlavorButtons"
        );


    if (snackFlavors.length > 0) {

        if (flavorSection) {

            flavorSection.style.display =
                "block";
        }


        if (flavorContainer) {

            flavorContainer.innerHTML =
                "";


            snackFlavors.forEach(
                function(flavor) {

                    const button =
                        document.createElement(
                            "button"
                        );

                    button.type = "button";

                    button.textContent =
                        flavor;


                    button.addEventListener(
                        "click",
                        function() {

                            selectSnackFlavor(
                                flavor
                            );
                        }
                    );


                    flavorContainer.appendChild(
                        button
                    );
                }
            );
        }

    }

    else {

        if (flavorSection) {

            flavorSection.style.display =
                "none";
        }
    }


    /* ---------------------------------------------
       AUTO SELECT ONE CHOICE
    --------------------------------------------- */

    if (snackChoices.length === 1) {

        selectSnackChoice(0);
    }


    showPopup(
        "snackOverlay",
        "snackPopupContent"
    );
}


/* =====================================================
   SNACK CHOICE
===================================================== */

function selectSnackChoice(index) {

    if (!snackChoices[index]) {
        return;
    }


    selectedSnackChoice =
        snackChoices[index];


    const buttons =
        document.querySelectorAll(
            "#snackChoiceButtons button"
        );


    buttons.forEach(
        function(button, i) {

            button.classList.toggle(
                "selected-option",
                i === index
            );
        }
    );
}


/* =====================================================
   SNACK FLAVOR
===================================================== */

function selectSnackFlavor(flavor) {

    selectedSnackFlavor =
        flavor;


    const buttons =
        document.querySelectorAll(
            "#snackFlavorButtons button"
        );


    buttons.forEach(
        function(button) {

            button.classList.toggle(
                "selected-option",
                button.textContent ===
                    flavor
            );
        }
    );
}


/* =====================================================
   SNACK QUANTITY
===================================================== */

function getSnackQuantity() {

    const input =
        document.getElementById(
            "snackQuantity"
        );


    if (!input) {
        return 1;
    }


    let value =
        parseInt(
            input.value,
            10
        );


    if (
        isNaN(value) ||
        value < 1
    ) {

        value = 1;
    }


    snackQuantity =
        value;

    input.value =
        value;


    return value;
}


/* =====================================================
   ADD SNACK
===================================================== */

function addSnackToCart() {

    if (!selectedSnackChoice) {

        alert(
            "Please choose an option first."
        );

        return;
    }


    if (
        snackFlavors.length > 0 &&
        !selectedSnackFlavor
    ) {

        alert(
            "Please choose a flavor first."
        );

        return;
    }


    const selectedQuantity =
        getSnackQuantity();


    const item = {

        name: selectedSnack,

        category:
            selectedSnackCategory,

        option:
            selectedSnackChoice.name,

        flavor:
            selectedSnackFlavor,

        price:
            selectedSnackChoice.price,

        quantity:
            selectedQuantity
    };


    addItemToCart(item);

    closeSnack();

    showOrderNotice();
}


/* =====================================================
   CLOSE SNACK
===================================================== */

function closeSnack() {

    const overlay =
        document.getElementById(
            "snackOverlay"
        );

    if (overlay) {

        overlay.style.display =
            "none";
    }
}


/* =====================================================
   MEALS
===================================================== */

function openMeal(
    mealName,
    choices
) {

    selectedMeal =
        mealName;


    mealChoices = [];


    if (Array.isArray(choices)) {

        choices.forEach(function(choice) {

            if (Array.isArray(choice)) {

                mealChoices.push({

                    name: choice[0],

                    price:
                        Number(
                            choice[1]
                        ) || 0
                });

            }

            else if (
                choice &&
                typeof choice === "object"
            ) {

                mealChoices.push({

                    name: choice.name,

                    price:
                        Number(
                            choice.price
                        ) || 0
                });
            }
        });
    }


    selectedMealChoice =
        null;

    selectedMealCooler =
        "None";

    selectedMealCoolerPrice =
        0;

    extraEgg =
        false;

    extraRice =
        false;

    mealQuantity =
        1;


    const mealDisplay =
        document.getElementById(
            "selectedMeal"
        );


    if (mealDisplay) {

        mealDisplay.textContent =
            selectedMeal;
    }


    /* ---------------------------------------------
       MEAL CHOICES
    --------------------------------------------- */

    const choiceContainer =
        document.getElementById(
            "mealChoiceButtons"
        );


    if (choiceContainer) {

        choiceContainer.innerHTML =
            "";


        mealChoices.forEach(
            function(choice, index) {

                const button =
                    document.createElement(
                        "button"
                    );

                button.type =
                    "button";

                button.textContent =
                    choice.name +
                    " - ₱" +
                    choice.price;


                button.addEventListener(
                    "click",
                    function() {

                        selectMealChoice(
                            index
                        );
                    }
                );


                choiceContainer.appendChild(
                    button
                );
            }
        );
    }


    if (mealChoices.length === 1) {

        selectMealChoice(0);
    }


    resetMealOptions();


    const quantityInput =
        document.getElementById(
            "mealQuantity"
        );


    if (quantityInput) {

        quantityInput.value = 1;
    }


    showPopup(
        "mealOverlay",
        "mealPopupContent"
    );
}


/* =====================================================
   MEAL CHOICE
===================================================== */

function selectMealChoice(index) {

    if (!mealChoices[index]) {
        return;
    }


    selectedMealChoice =
        mealChoices[index];


    const buttons =
        document.querySelectorAll(
            "#mealChoiceButtons button"
        );


    buttons.forEach(
        function(button, i) {

            button.classList.toggle(
                "selected-option",
                i === index
            );
        }
    );
}


/* =====================================================
   MEAL COOLER
===================================================== */

function selectMealCooler(name) {

    let coolerName =
        "None";

    let coolerPrice =
        0;


    if (name === "16oz") {

        coolerName =
            "Highway Cooler 16oz";

        coolerPrice =
            35;
    }


    else if (name === "22oz") {

        coolerName =
            "Highway Cooler 22oz";

        coolerPrice =
            55;
    }


    selectedMealCooler =
        coolerName;

    selectedMealCoolerPrice =
        coolerPrice;


    const buttons =
        document.querySelectorAll(
            "#mealCooler button"
        );


    buttons.forEach(
        function(button) {

            button.classList.remove(
                "selected-option"
            );
        }
    );


    let selectedButton =
        null;


    if (coolerName === "None") {

        selectedButton =
            document.getElementById(
                "coolerNoneButton"
            );
    }

    else if (
        coolerName ===
        "Highway Cooler 16oz"
    ) {

        selectedButton =
            document.getElementById(
                "cooler16Button"
            );
    }

    else if (
        coolerName ===
        "Highway Cooler 22oz"
    ) {

        selectedButton =
            document.getElementById(
                "cooler22Button"
            );
    }


    if (selectedButton) {

        selectedButton.classList.add(
            "selected-option"
        );
    }
}


/* =====================================================
   MEAL EXTRAS
===================================================== */

function toggleMealExtra(type) {

    if (type === "egg") {

        extraEgg =
            !extraEgg;


        const button =
            document.getElementById(
                "extraEggButton"
            );


        if (button) {

            button.classList.toggle(
                "selected-option",
                extraEgg
            );
        }
    }


    else if (type === "rice") {

        extraRice =
            !extraRice;


        const button =
            document.getElementById(
                "extraRiceButton"
            );


        if (button) {

            button.classList.toggle(
                "selected-option",
                extraRice
            );
        }
    }
}


/* =====================================================
   RESET MEAL OPTIONS
===================================================== */

function resetMealOptions() {

    const buttons = [

        document.getElementById(
            "coolerNoneButton"
        ),

        document.getElementById(
            "cooler16Button"
        ),

        document.getElementById(
            "cooler22Button"
        ),

        document.getElementById(
            "extraEggButton"
        ),

        document.getElementById(
            "extraRiceButton"
        )
    ];


    buttons.forEach(
        function(button) {

            if (button) {

                button.classList.remove(
                    "selected-option"
                );
            }
        }
    );


    const noneButton =
        document.getElementById(
            "coolerNoneButton"
        );


    if (noneButton) {

        noneButton.classList.add(
            "selected-option"
        );
    }
}


/* =====================================================
   MEAL QUANTITY
===================================================== */

function getMealQuantity() {

    const input =
        document.getElementById(
            "mealQuantity"
        );


    if (!input) {
        return 1;
    }


    let value =
        parseInt(
            input.value,
            10
        );


    if (
        isNaN(value) ||
        value < 1
    ) {

        value = 1;
    }


    mealQuantity =
        value;

    input.value =
        value;


    return value;
}


/* =====================================================
   ADD MEAL
===================================================== */

function addMealToCart() {

    if (!selectedMealChoice) {

        alert(
            "Please choose a meal option first."
        );

        return;
    }


    const selectedQuantity =
        getMealQuantity();


    let finalPrice =
        selectedMealChoice.price;


    finalPrice +=
        selectedMealCoolerPrice;


    if (extraEgg) {

        finalPrice += 10;
    }


    if (extraRice) {

        finalPrice += 15;
    }


    const item = {

        name:
            selectedMeal,

        category:
            "Pit Stop Plates",

        option:
            selectedMealChoice.name,

        cooler:
            selectedMealCooler,

        price:
            finalPrice,

        quantity:
            selectedQuantity,

        extraEgg:
            extraEgg,

        extraRice:
            extraRice
    };


    addItemToCart(item);

    closeMeal();

    showOrderNotice();
}


/* =====================================================
   CLOSE MEAL
===================================================== */

function closeMeal() {

    const overlay =
        document.getElementById(
            "mealOverlay"
        );


    if (overlay) {

        overlay.style.display =
            "none";
    }
}


/* =====================================================
   CART
===================================================== */

function updateCart() {

    const cartItems =
        document.getElementById(
            "sideCartItems"
        );

    const cartCount =
        document.getElementById(
            "cartCount"
        );

    const cartTotal =
        document.getElementById(
            "sideCartTotal"
        );


    if (!cartItems) {
        return;
    }


    if (cart.length === 0) {

        cartItems.innerHTML =
            "Your cart is empty.";


        if (cartCount) {

            cartCount.textContent =
                "0 items";
        }


        if (cartTotal) {

            cartTotal.textContent =
                "0";
        }


        return;
    }


    let html = "";

    let total = 0;

    let totalItems = 0;


    cart.forEach(
        function(item, index) {

            const itemQuantity =
                Number(
                    item.quantity || 1
                );


            const itemPrice =
                Number(
                    item.price || 0
                );


            const itemTotal =
                itemQuantity *
                itemPrice;


            total +=
                itemTotal;


            totalItems +=
                itemQuantity;


            html += `

                <div class="cart-item">

                    <strong>
                        ${itemQuantity} x
                        ${item.name}
                    </strong>

                    ${
                        item.size
                            ? `<br>${item.size}`
                            : ""
                    }

                    ${
                        item.option
                            ? `<br>${item.option}`
                            : ""
                    }

                    ${
                        item.flavor
                            ? `<br>Flavor: ${item.flavor}`
                            : ""
                    }

                    ${
                        item.cooler &&
                        item.cooler !== "None"
                            ? `<br>${item.cooler}`
                            : ""
                    }

                    ${
                        item.extraEspresso
                            ? `<br>Extra Espresso`
                            : ""
                    }

                    ${
                        item.extraMatcha
                            ? `<br>Extra Matcha`
                            : ""
                    }

                    ${
                        item.extraChocolate
                            ? `<br>Extra Chocolate`
                            : ""
                    }

                    ${
                        item.extraEgg
                            ? `<br>Extra Egg`
                            : ""
                    }

                    ${
                        item.extraRice
                            ? `<br>Extra Rice`
                            : ""
                    }

                    <br>

                    <strong>
                        ₱${itemTotal}
                    </strong>

                    <br>

                    <button
                        type="button"
                        onclick="decreaseCartItem(${index})"
                    >
                        −
                    </button>

                    <button
                        type="button"
                        onclick="increaseCartItem(${index})"
                    >
                        +
                    </button>

                    <button
                        type="button"
                        onclick="removeCartItem(${index})"
                    >
                        Remove
                    </button>

                </div>

                <hr>
            `;
        }
    );


    cartItems.innerHTML =
        html;


    if (cartCount) {

        cartCount.textContent =
            totalItems +
            (
                totalItems === 1
                    ? " item"
                    : " items"
            );
    }


    if (cartTotal) {

        cartTotal.textContent =
            total;
    }
}


/* =====================================================
   CART + / -
===================================================== */

function increaseCartItem(index) {

    if (!cart[index]) {
        return;
    }


    cart[index].quantity =
        Number(
            cart[index].quantity || 1
        ) + 1;


    updateCart();
}


function decreaseCartItem(index) {

    if (!cart[index]) {
        return;
    }


    cart[index].quantity =
        Number(
            cart[index].quantity || 1
        ) - 1;


    if (
        cart[index].quantity <= 0
    ) {

        cart.splice(index, 1);
    }


    updateCart();
}


function removeCartItem(index) {

    if (!cart[index]) {
        return;
    }


    cart.splice(index, 1);

    updateCart();
}


/* =====================================================
   TOTALS
===================================================== */

function getCartTotal() {

    let total = 0;


    cart.forEach(
        function(item) {

            total +=
                Number(
                    item.price || 0
                ) *
                Number(
                    item.quantity || 1
                );
        }
    );


    return total;
}


function getDeliveryFee() {

    if (
        orderType === "delivery"
    ) {

        return DELIVERY_FEE;
    }


    return 0;
}


function getGrandTotal() {

    return (
        getCartTotal() +
        getDeliveryFee()
    );
}


/* =====================================================
   CHECKOUT
===================================================== */

function openCheckout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty. Please add an item first."
        );

        return;
    }


    clearCheckoutInputs();


    selectOrderType(
        "pickup"
    );


    selectPaymentMethod(
        "cash"
    );


    updateCheckoutSummary();

    updateCheckoutTotal();


    showPopup(
        "checkoutOverlay",
        "checkoutPopup"
    );
}


/* =====================================================
   CLEAR CHECKOUT
===================================================== */

function clearCheckoutInputs() {

    const ids = [

        "customerName",

        "customerPhone",

        "deliveryAddress",

        "orderNotes",

        "pickupTime",

        "paymentReference"
    ];


    ids.forEach(
        function(id) {

            const element =
                document.getElementById(id);


            if (element) {

                element.value = "";
            }
        }
    );
}


/* =====================================================
   ORDER TYPE
===================================================== */

function selectOrderType(type) {

    if (
        type !== "delivery" &&
        type !== "pickup"
    ) {

        type = "pickup";
    }


    orderType =
        type;


    const deliveryButton =
        document.getElementById(
            "deliveryButton"
        );

    const pickupButton =
        document.getElementById(
            "pickupButton"
        );

    const deliveryDetails =
        document.getElementById(
            "deliveryDetails"
        );

    const pickupDetails =
        document.getElementById(
            "pickupDetails"
        );


    if (deliveryButton) {

        deliveryButton.classList.remove(
            "selected-checkout"
        );
    }


    if (pickupButton) {

        pickupButton.classList.remove(
            "selected-checkout"
        );
    }


    if (type === "delivery") {

        if (deliveryButton) {

            deliveryButton.classList.add(
                "selected-checkout"
            );
        }


        if (deliveryDetails) {

            deliveryDetails.style.display =
                "block";
        }


        if (pickupDetails) {

            pickupDetails.style.display =
                "none";
        }
    }


    else {

        if (pickupButton) {

            pickupButton.classList.add(
                "selected-checkout"
            );
        }


        if (deliveryDetails) {

            deliveryDetails.style.display =
                "none";
        }


        if (pickupDetails) {

            pickupDetails.style.display =
                "block";
        }
    }


    updateCheckoutTotal();
}


/* =====================================================
   PAYMENT METHOD
===================================================== */

function selectPaymentMethod(
    method
) {

    if (
        method !== "cash" &&
        method !== "gcash"
    ) {

        method = "cash";
    }


    paymentMethod =
        method;


    const cashButton =
        document.getElementById(
            "cashButton"
        );

    const gcashButton =
        document.getElementById(
            "gcashButton"
        );

    const gcashDetails =
        document.getElementById(
            "gcashDetails"
        );


    if (cashButton) {

        cashButton.classList.remove(
            "selected-checkout"
        );
    }


    if (gcashButton) {

        gcashButton.classList.remove(
            "selected-checkout"
        );
    }


    if (method === "gcash") {

        if (gcashButton) {

            gcashButton.classList.add(
                "selected-checkout"
            );
        }


        if (gcashDetails) {

            gcashDetails.style.display =
                "block";
        }
    }


    else {

        if (cashButton) {

            cashButton.classList.add(
                "selected-checkout"
            );
        }


        if (gcashDetails) {

            gcashDetails.style.display =
                "none";
        }
    }
}


/* =====================================================
   CHECKOUT SUMMARY
===================================================== */

function updateCheckoutSummary() {

    const summary =
        document.getElementById(
            "checkoutSummary"
        );


    if (!summary) {
        return;
    }


    if (cart.length === 0) {

        summary.innerHTML =
            "<p>Your cart is empty.</p>";

        return;
    }


    let html = "";


    cart.forEach(
        function(item) {

            const itemQuantity =
                Number(
                    item.quantity || 1
                );


            const itemTotal =
                Number(
                    item.price || 0
                ) *
                itemQuantity;


            html += `

                <div class="checkout-item">

                    <div>

                        <strong>
                            ${itemQuantity} x
                            ${item.name}
                        </strong>

                        ${
                            item.size
                                ? `<small>${item.size}</small>`
                                : ""
                        }

                        ${
                            item.option
                                ? `<small>${item.option}</small>`
                                : ""
                        }

                        ${
                            item.flavor
                                ? `<small>Flavor: ${item.flavor}</small>`
                                : ""
                        }

                        ${
                            item.cooler &&
                            item.cooler !== "None"
                                ? `<small>${item.cooler}</small>`
                                : ""
                        }

                        ${
                            item.extraEspresso
                                ? `<small>Extra Espresso</small>`
                                : ""
                        }

                        ${
                            item.extraMatcha
                                ? `<small>Extra Matcha</small>`
                                : ""
                        }

                        ${
                            item.extraChocolate
                                ? `<small>Extra Chocolate</small>`
                                : ""
                        }

                        ${
                            item.extraEgg
                                ? `<small>Extra Egg</small>`
                                : ""
                        }

                        ${
                            item.extraRice
                                ? `<small>Extra Rice</small>`
                                : ""
                        }

                    </div>

                    <strong>
                        ₱${itemTotal}
                    </strong>

                </div>
            `;
        }
    );


    const subtotal =
        getCartTotal();

    const deliveryFee =
        getDeliveryFee();


    html += `

        <div class="checkout-total-line">

            <span>
                Subtotal
            </span>

            <strong>
                ₱${subtotal}
            </strong>

        </div>

        <div class="checkout-total-line">

            <span>
                Delivery Fee
            </span>

            <strong>
                ₱${deliveryFee}
            </strong>

        </div>
    `;


    summary.innerHTML =
        html;
}


/* =====================================================
   CHECKOUT TOTAL
===================================================== */

function updateCheckoutTotal() {

    const total =
        document.getElementById(
            "checkoutTotal"
        );


    if (total) {

        total.textContent =
            getGrandTotal();
    }


    updateCheckoutSummary();
}


/* =====================================================
   CLOSE CHECKOUT
===================================================== */

function closeCheckout() {

    const overlay =
        document.getElementById(
            "checkoutOverlay"
        );


    if (overlay) {

        overlay.style.display =
            "none";
    }
}


/* =====================================================
   PLACE ORDER
===================================================== */

async function placeOrder() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;
    }


    const nameInput =
        document.getElementById(
            "customerName"
        );

    const phoneInput =
        document.getElementById(
            "customerPhone"
        );

    const addressInput =
        document.getElementById(
            "deliveryAddress"
        );

    const notesInput =
        document.getElementById(
            "orderNotes"
        );

    const paymentReferenceInput =
        document.getElementById(
            "paymentReference"
        );

    const pickupTimeInput =
        document.getElementById(
            "pickupTime"
        );


    const name =
        nameInput
            ? nameInput.value.trim()
            : "";


    const phone =
        phoneInput
            ? phoneInput.value.trim()
            : "";


    const address =
        addressInput
            ? addressInput.value.trim()
            : "";


    const notes =
        notesInput
            ? notesInput.value.trim()
            : "";


    const paymentReference =
        paymentReferenceInput
            ? paymentReferenceInput.value.trim()
            : "";


    const pickupTime =
        pickupTimeInput
            ? pickupTimeInput.value
            : "";


    /* ---------------------------------------------
       VALIDATION
    --------------------------------------------- */

    if (!name) {

        alert(
            "Please enter your name."
        );

        if (nameInput) {
            nameInput.focus();
        }

        return;
    }


    if (!phone) {

        alert(
            "Please enter your phone number."
        );

        if (phoneInput) {
            phoneInput.focus();
        }

        return;
    }


    if (
        orderType === "delivery" &&
        !address
    ) {

        alert(
            "Please enter your delivery address."
        );

        if (addressInput) {
            addressInput.focus();
        }

        return;
    }


    if (
        paymentMethod === "gcash" &&
        !paymentReference
    ) {

        alert(
            "Please enter your GCash reference number."
        );

        if (paymentReferenceInput) {
            paymentReferenceInput.focus();
        }

        return;
    }


    /* ---------------------------------------------
       ORDER NUMBER
    --------------------------------------------- */

    const orderNumber =
        "HC-" +
        Date.now()
            .toString()
            .slice(-6);


    const subtotal =
        getCartTotal();

    const deliveryFee =
        getDeliveryFee();

    const total =
        getGrandTotal();


    /* ---------------------------------------------
       ORDER SUMMARY FOR CONFIRMATION
    --------------------------------------------- */

    let orderSummary =
        "HIGHWAY CAFE\n\n";


    orderSummary +=
        "Order #: " +
        orderNumber +
        "\n";


    orderSummary +=
        "Customer: " +
        name +
        "\n";


    orderSummary +=
        "Phone: " +
        phone +
        "\n";


    orderSummary +=
        "Order Type: " +
        (
            orderType === "delivery"
                ? "Delivery"
                : "Pickup"
        ) +
        "\n";


    if (
        orderType === "delivery"
    ) {

        orderSummary +=
            "Address: " +
            address +
            "\n";
    }


    if (
        orderType === "pickup" &&
        pickupTime
    ) {

        orderSummary +=
            "Pickup Time: " +
            pickupTime +
            "\n";
    }


    orderSummary +=
        "Payment: " +
        (
            paymentMethod === "gcash"
                ? "GCash / Online Payment"
                : "Cash"
        ) +
        "\n";


    if (
        paymentMethod === "gcash"
    ) {

        orderSummary +=
            "Reference: " +
            paymentReference +
            "\n";
    }


    orderSummary +=
        "\n--------------------------\n";

    orderSummary +=
        "ORDER ITEMS\n";

    orderSummary +=
        "--------------------------\n";


    cart.forEach(
        function(item) {

            const itemQuantity =
                Number(
                    item.quantity || 1
                );


            const itemTotal =
                Number(
                    item.price || 0
                ) *
                itemQuantity;


            orderSummary +=
                itemQuantity +
                " x " +
                item.name +
                "\n";


            if (item.size) {

                orderSummary +=
                    "   Size: " +
                    item.size +
                    "\n";
            }


            if (item.option) {

                orderSummary +=
                    "   Option: " +
                    item.option +
                    "\n";
            }


            if (item.flavor) {

                orderSummary +=
                    "   Flavor: " +
                    item.flavor +
                    "\n";
            }


            if (
                item.cooler &&
                item.cooler !== "None"
            ) {

                orderSummary +=
                    "   " +
                    item.cooler +
                    "\n";
            }


            if (item.extraEspresso) {

                orderSummary +=
                    "   Extra Espresso\n";
            }


            if (item.extraMatcha) {

                orderSummary +=
                    "   Extra Matcha\n";
            }


            if (item.extraChocolate) {

                orderSummary +=
                    "   Extra Chocolate\n";
            }


            if (item.extraEgg) {

                orderSummary +=
                    "   Extra Egg\n";
            }


            if (item.extraRice) {

                orderSummary +=
                    "   Extra Rice\n";
            }


            orderSummary +=
                "   Item Total: ₱" +
                itemTotal +
                "\n\n";
        }
    );


    orderSummary +=
        "--------------------------\n";


    orderSummary +=
        "Subtotal: ₱" +
        subtotal +
        "\n";


    orderSummary +=
        "Delivery Fee: ₱" +
        deliveryFee +
        "\n";


    orderSummary +=
        "GRAND TOTAL: ₱" +
        total +
        "\n";


    if (notes) {

        orderSummary +=
            "\nNote:\n" +
            notes +
            "\n";
    }


    if (
        paymentMethod === "gcash"
    ) {

        orderSummary +=
            "\nPayment Status: Waiting for GCash confirmation.";

    }

    else {

        orderSummary +=
            "\nPayment Status: Cash upon " +
            (
                orderType === "delivery"
                    ? "delivery."
                    : "pickup."
            );
    }


    /* ---------------------------------------------
       DISABLE BUTTON
    --------------------------------------------- */

    const placeButton =
        document.getElementById(
            "placeOrderButton"
        );


    if (placeButton) {

        placeButton.disabled =
            true;

        placeButton.textContent =
            "Sending Order...";
    }


    /* =================================================
       FORMSUBMIT

       IMPORTANT:
       We use "box" instead of "table".

       This makes the email much cleaner and prevents
       the long order summary from becoming a cramped
       table-style email.
    ================================================= */

    const formData =
        new FormData();


    formData.append(
        "_subject",
        "HIGHWAY CAFE - NEW ORDER #" +
        orderNumber
    );


    /* CLEANER EMAIL TEMPLATE */

    formData.append(
        "_template",
        "box"
    );


    formData.append(
        "_captcha",
        "false"
    );


    /* ---------------------------------------------
       ORDER INFORMATION
    --------------------------------------------- */

    formData.append(
        "ORDER NUMBER",
        orderNumber
    );


    formData.append(
        "CUSTOMER NAME",
        name
    );


    formData.append(
        "PHONE NUMBER",
        phone
    );


    formData.append(
        "ORDER TYPE",
        orderType === "delivery"
            ? "Delivery"
            : "Pickup"
    );


    formData.append(
        "DELIVERY ADDRESS",
        orderType === "delivery"
            ? address
            : "N/A - Pickup"
    );


    formData.append(
        "PICKUP TIME",
        orderType === "pickup"
            ? (
                pickupTime
                    ? pickupTime
                    : "Not specified"
            )
            : "N/A - Delivery"
    );


    formData.append(
        "PAYMENT METHOD",
        paymentMethod === "gcash"
            ? "GCash / Online Payment"
            : "Cash"
    );


    formData.append(
        "GCASH REFERENCE",
        paymentMethod === "gcash"
            ? paymentReference
            : "N/A"
    );


    /* ---------------------------------------------
       ORDER ITEMS

       Keep this as a separate field so the customer
       can easily read the complete order.
    --------------------------------------------- */

    formData.append(
        "ORDER ITEMS",
        orderSummary
    );


    /* ---------------------------------------------
       NOTES
    --------------------------------------------- */

    formData.append(
        "ORDER NOTES",
        notes
            ? notes
            : "No notes"
    );


    /* ---------------------------------------------
       TOTALS
    --------------------------------------------- */

    formData.append(
        "SUBTOTAL",
        "₱" + subtotal
    );


    formData.append(
        "DELIVERY FEE",
        "₱" + deliveryFee
    );


    formData.append(
        "GRAND TOTAL",
        "₱" + total
    );


    /* ---------------------------------------------
       PAYMENT STATUS
    --------------------------------------------- */

    formData.append(
        "PAYMENT STATUS",
        paymentMethod === "gcash"
            ? "Waiting for GCash confirmation."
            : (
                "Cash upon " +
                (
                    orderType === "delivery"
                        ? "delivery."
                        : "pickup."
                )
            )
    );


    /* ---------------------------------------------
       SEND EMAIL
    --------------------------------------------- */

    try {

        const response =
            await fetch(
                "https://formsubmit.co/ajax/highwaycafe14@gmail.com",
                {
                    method: "POST",

                    body: formData,

                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        const result =
            await response.json();


        console.log(
            "FormSubmit response:",
            result
        );


        /* -----------------------------------------
           SUCCESS
        ----------------------------------------- */

        if (
            response.ok &&
            result.success !== false
        ) {

            if (placeButton) {

                placeButton.disabled =
                    false;

                placeButton.textContent =
                    "Place Order";
            }


            showOrderConfirmation(
                orderNumber,
                orderSummary,
                total
            );


            return;
        }


        throw new Error(
            result.message ||
            "FormSubmit rejected the order."
        );

    }


    /* ---------------------------------------------
       ERROR
    --------------------------------------------- */

    catch (error) {

        console.error(
            "Order email error:",
            error
        );


        if (placeButton) {

            placeButton.disabled =
                false;

            placeButton.textContent =
                "Place Order";
        }


        alert(
            "We could not send your order email.\n\n" +
            "Your order has NOT been submitted.\n\n" +
            "Please try again."
        );
    }
}


/* =====================================================
   CONFIRMATION
===================================================== */

function showOrderConfirmation(
    orderNumber,
    orderSummary,
    total
) {

    const checkoutPopup =
        document.getElementById(
            "checkoutPopup"
        );


    const confirmationPopup =
        document.getElementById(
            "orderConfirmationPopup"
        );


    const orderNumberDisplay =
        document.getElementById(
            "confirmationOrderNumber"
        );


    const summaryDisplay =
        document.getElementById(
            "confirmationOrderSummary"
        );


    const totalDisplay =
        document.getElementById(
            "confirmationTotal"
        );


    if (checkoutPopup) {

        checkoutPopup.style.display =
            "none";
    }


    if (orderNumberDisplay) {

        orderNumberDisplay.textContent =
            orderNumber;
    }


    if (summaryDisplay) {

        summaryDisplay.textContent =
            orderSummary;
    }


    if (totalDisplay) {

        totalDisplay.textContent =
            total;
    }


    if (confirmationPopup) {

        confirmationPopup.style.display =
            "flex";
    }
}


/* =====================================================
   FINISH ORDER
===================================================== */

function finishOrder() {

    const confirmationPopup =
        document.getElementById(
            "orderConfirmationPopup"
        );


    if (confirmationPopup) {

        confirmationPopup.style.display =
            "none";
    }


    cart = [];


    updateCart();


    orderType =
        "pickup";


    paymentMethod =
        "cash";


    clearCheckoutInputs();


    alert(
        "Thank you for ordering from Highway Cafe!"
    );
}


/* =====================================================
   OVERLAY CLICK
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {


        /* ---------------------------------------------
           HIDE MENU AT START
        --------------------------------------------- */

        const menu =
            document.getElementById(
                "menu"
            );


        if (menu) {

            menu.style.display =
                "none";
        }


        /* ---------------------------------------------
           PRODUCT OVERLAY
        --------------------------------------------- */

        const productOverlay =
            document.getElementById(
                "productOverlay"
            );


        if (productOverlay) {

            productOverlay.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target ===
                        productOverlay
                    ) {

                        closeProduct();
                    }
                }
            );
        }


        /* ---------------------------------------------
           SNACK OVERLAY
        --------------------------------------------- */

        const snackOverlay =
            document.getElementById(
                "snackOverlay"
            );


        if (snackOverlay) {

            snackOverlay.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target ===
                        snackOverlay
                    ) {

                        closeSnack();
                    }
                }
            );
        }


        /* ---------------------------------------------
           MEAL OVERLAY
        --------------------------------------------- */

        const mealOverlay =
            document.getElementById(
                "mealOverlay"
            );


        if (mealOverlay) {

            mealOverlay.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target ===
                        mealOverlay
                    ) {

                        closeMeal();
                    }
                }
            );
        }


        /* ---------------------------------------------
           CHECKOUT OVERLAY
        --------------------------------------------- */

        const checkoutOverlay =
            document.getElementById(
                "checkoutOverlay"
            );


        if (checkoutOverlay) {

            checkoutOverlay.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target ===
                        checkoutOverlay
                    ) {

                        closeCheckout();
                    }
                }
            );
        }


        /* ---------------------------------------------
           ADD TO CART BUTTON
        --------------------------------------------- */

        const addToCartButton =
            document.getElementById(
                "addToCartButton"
            );


        if (addToCartButton) {

            addToCartButton.addEventListener(
                "click",
                addSelectedProduct
            );
        }


        /* ---------------------------------------------
           INITIAL CART
        --------------------------------------------- */

        updateCart();


        console.log(
            "HIGHWAY CAFE JavaScript loaded successfully."
        );

    }
);
