// =====================================================
// HIGHWAY CAFE
// COMPLETE CUSTOMER ORDERING SYSTEM
// =====================================================


// =====================================================
// SUPABASE
// =====================================================

const SUPABASE_URL =
    "https://qfnjegsbyxxqsdaelqqa.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_ttu1AyOaylp3J4x7iTqaNg_1VLOdHoE";

let supabaseClient = null;


// =====================================================
// GENERAL SETTINGS
// =====================================================

const DELIVERY_FEE = 20;

const EXTRA_ESPRESSO_PRICE = 30;
const EXTRA_MATCHA_PRICE = 30;
const EXTRA_CHOCOLATE_PRICE = 30;

const EXTRA_EGG_PRICE = 10;
const EXTRA_RICE_PRICE = 15;


// =====================================================
// CART
// =====================================================

let cart = [];


// =====================================================
// PRODUCT STATE
// =====================================================

let selectedProduct = "";
let selectedCategory = "";

let price8 = 0;
let price12 = 0;
let price16 = 0;
let price22 = 0;

let sizeType = "";
let selectedSize = 16;

let espressoAvailable = false;
let matchaAvailable = false;
let chocolateAvailable = false;

let extraEspresso = false;
let extraMatcha = false;
let extraChocolate = false;

let quantity = 1;


// =====================================================
// SNACK STATE
// =====================================================

let selectedSnackName = "";
let selectedSnackCategory = "";
let selectedSnackChoice = null;
let selectedSnackFlavor = "";

let snackChoices = [];
let snackFlavorChoices = [];

let snackQuantity = 1;


// =====================================================
// MEAL STATE
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
// CHECKOUT STATE
// =====================================================

let selectedOrderType = "";
let selectedPaymentMethod = "";


// =====================================================
// SUPABASE INITIALIZATION
// =====================================================

function initializeSupabase() {

    try {

        if (
            window.supabase &&
            typeof window.supabase.createClient === "function"
        ) {

            supabaseClient =
                window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_KEY
                );

            console.log(
                "Highway Cafe Supabase initialized."
            );

        } else {

            console.warn(
                "Supabase library is not available."
            );
        }

    } catch (error) {

        console.error(
            "Supabase initialization error:",
            error
        );
    }
}


// =====================================================
// START ORDER
// =====================================================

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


// =====================================================
// DRINK DATABASE
// =====================================================

const DRINKS = {

    // -------------------------------------------------
    // ICED COFFEE
    // -------------------------------------------------

    americano: {
        name: "Americano",
        category: "Iced Coffee",
        sizeType: "size16-22",
        price16: 70,
        price22: 80,
        addons: ["espresso"]
    },

    vanillaLatte: {
        name: "Vanilla Latte",
        category: "Iced Coffee",
        sizeType: "size16-22",
        price16: 75,
        price22: 89,
        addons: ["espresso"]
    },

    spanishLatte: {
        name: "Spanish Latte",
        category: "Iced Coffee",
        sizeType: "size16-22",
        price16: 75,
        price22: 89,
        addons: ["espresso"]
    },

    mochaLatte: {
        name: "Mocha Latte",
        category: "Iced Coffee",
        sizeType: "size16-22",
        price16: 75,
        price22: 89,
        addons: [
            "espresso",
            "chocolate"
        ]
    },

    dirtyMatcha: {
        name: "Dirty Matcha",
        category: "Iced Coffee",
        sizeType: "size16-22",
        price16: 85,
        price22: 100,
        addons: [
            "espresso",
            "matcha"
        ]
    },

    saltedCaramel: {
        name: "Salted Caramel",
        category: "Iced Coffee",
        sizeType: "size16-22",
        price16: 75,
        price22: 89,
        addons: ["espresso"]
    },

    caramelMacchiato: {
        name: "Caramel Macchiato",
        category: "Iced Coffee",
        sizeType: "size16-22",
        price16: 75,
        price22: 89,
        addons: ["espresso"]
    },


    // -------------------------------------------------
    // HOT COFFEE
    // -------------------------------------------------

    hotChoco: {
        name: "Hot Choco",
        category: "Hot Coffee",
        sizeType: "size8",
        price8: 70,
        addons: ["chocolate"]
    },

    hotAmericano: {
        name: "Americano",
        category: "Hot Coffee",
        sizeType: "size8",
        price8: 70,
        addons: ["espresso"]
    },

    hotSpanishLatte: {
        name: "Spanish Latte",
        category: "Hot Coffee",
        sizeType: "size8",
        price8: 80,
        addons: ["espresso"]
    },

    cafeLatte: {
        name: "Cafe Latte",
        category: "Hot Coffee",
        sizeType: "size8",
        price8: 80,
        addons: ["espresso"]
    },


    // -------------------------------------------------
    // SODA
    // -------------------------------------------------

    greenApple: {
        name: "Green Apple",
        category: "Soda Series",
        sizeType: "size12-16-22",
        price12: 29,
        price16: 39,
        price22: 59,
        addons: []
    },

    lychee: {
        name: "Lychee",
        category: "Soda Series",
        sizeType: "size12-16-22",
        price12: 29,
        price16: 39,
        price22: 59,
        addons: []
    },

    strawberrySoda: {
        name: "Strawberry",
        category: "Soda Series",
        sizeType: "size12-16-22",
        price12: 29,
        price16: 39,
        price22: 59,
        addons: []
    },

    blueberrySoda: {
        name: "Blueberry",
        category: "Soda Series",
        sizeType: "size12-16-22",
        price12: 29,
        price16: 39,
        price22: 59,
        addons: []
    },


    // -------------------------------------------------
    // MILK
    // -------------------------------------------------

    strawberryMilk: {
        name: "Strawberry Milk",
        category: "Milk Series",
        sizeType: "size16-22",
        price16: 65,
        price22: 80,
        addons: []
    },

    blueberryMilk: {
        name: "Blueberry Milk",
        category: "Milk Series",
        sizeType: "size16-22",
        price16: 65,
        price22: 80,
        addons: []
    },

    chocolateMilk: {
        name: "Chocolate Milk",
        category: "Milk Series",
        sizeType: "size16-22",
        price16: 65,
        price22: 80,
        addons: ["chocolate"]
    },

    matchaLatte: {
        name: "Matcha Latte",
        category: "Milk Series",
        sizeType: "size16-22",
        price16: 80,
        price22: 95,
        addons: ["matcha"]
    },

    cookiesCream: {
        name: "Cookies and Cream",
        category: "Milk Series",
        sizeType: "size16-22",
        price16: 65,
        price22: 80,
        addons: []
    }

};


// =====================================================
// OPEN DRINK
// =====================================================

function openDrink(key) {

    const drink =
        DRINKS[key];

    if (!drink) {

        console.error(
            "Drink key not found:",
            key
        );

        return;
    }

    openProduct(
        drink.name,
        drink.category,
        drink.sizeType,
        drink.price16 || 0,
        drink.price22 || 0,
        drink.addons || [],
        drink.price12 || 0,
        drink.price8 || 0
    );
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
    thirdPrice = 0,
    eighthPrice = 0
) {

    selectedProduct =
        productName;

    selectedCategory =
        category;

    sizeType =
        productSizeType;


    // -------------------------------------------------
    // RESET PRICES
    // -------------------------------------------------

    price8 = 0;
    price12 = 0;
    price16 = 0;
    price22 = 0;


    // -------------------------------------------------
    // SET PRICES
    // -------------------------------------------------

    if (sizeType === "size8") {

        price8 =
            eighthPrice || firstPrice || 0;

    }

    else if (sizeType === "size16-22") {

        price16 =
            firstPrice || 0;

        price22 =
            secondPrice || 0;

    }

    else if (sizeType === "size12-16-22") {

        price12 =
            thirdPrice || 0;

        price16 =
            firstPrice || 0;

        price22 =
            secondPrice || 0;
    }


    // -------------------------------------------------
    // RESET SELECTIONS
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

    }

    else if (sizeType === "size16-22") {

        selectedSize = 16;

    }

    else if (sizeType === "size12-16-22") {

        selectedSize = 12;

    }


    // -------------------------------------------------
    // ADD-ONS
    // -------------------------------------------------

    let addons = [];

    if (Array.isArray(addOnType)) {

        addons = addOnType;

    }

    else if (typeof addOnType === "string") {

        addons = [
            addOnType
        ];

    }


    addons.forEach(function(addon) {

        if (addon === "espresso") {

            espressoAvailable = true;

        }

        if (addon === "matcha") {

            matchaAvailable = true;

        }

        if (addon === "chocolate") {

            chocolateAvailable = true;

        }

        if (addon === "both") {

            espressoAvailable = true;
            matchaAvailable = true;

        }

        if (addon === "espresso-chocolate") {

            espressoAvailable = true;
            chocolateAvailable = true;

        }

    });


    // -------------------------------------------------
    // UPDATE POPUP
    // -------------------------------------------------

    const title =
        document.getElementById(
            "selectedProduct"
        );

    const categoryDisplay =
        document.getElementById(
            "selectedCategory"
        );

    const quantityDisplay =
        document.getElementById(
            "quantity"
        );


    if (title) {

        title.textContent =
            selectedProduct;

    }

    if (categoryDisplay) {

        categoryDisplay.textContent =
            selectedCategory;

    }

    if (quantityDisplay) {

        quantityDisplay.textContent =
            quantity;

    }


    updateSizeDisplay();

    updateAddOnDisplay();

    resetAddOnButtons();


    // -------------------------------------------------
    // SHOW PRODUCT POPUP
    // -------------------------------------------------

    showProductPopup();
}


// =====================================================
// SHOW PRODUCT POPUP
// =====================================================

function showProductPopup() {

    const overlay =
        document.getElementById(
            "productOverlay"
        );

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


    if (!overlay) {

        console.error(
            "ERROR: #productOverlay not found."
        );

        return;
    }


    overlay.style.display =
        "flex";


    if (productPopup) {

        productPopup.style.display =
            "block";

    }

    if (snackPopup) {

        snackPopup.style.display =
            "none";

    }

    if (mealPopup) {

        mealPopup.style.display =
            "none";

    }
}


// =====================================================
// SIZE DISPLAY
// =====================================================

function updateSizeDisplay() {

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

    const sizeTitle =
        document.getElementById(
            "sizeTitle"
        );


    if (!size12Button ||
        !size16Button ||
        !size22Button ||
        !sizeTitle) {

        return;
    }


    size12Button.style.display =
        "none";

    size16Button.style.display =
        "none";

    size22Button.style.display =
        "none";


    size12Button.classList.remove(
        "selected-size"
    );

    size16Button.classList.remove(
        "selected-size"
    );

    size22Button.classList.remove(
        "selected-size"
    );


    // -------------------------------------------------
    // 8OZ
    // -------------------------------------------------

    if (sizeType === "size8") {

        sizeTitle.textContent =
            "Size: 8oz";

    }


    // -------------------------------------------------
    // 16 / 22
    // -------------------------------------------------

    else if (
        sizeType === "size16-22"
    ) {

        sizeTitle.textContent =
            "Choose Size";

        size16Button.style.display =
            "inline-block";

        size22Button.style.display =
            "inline-block";


        if (selectedSize === 16) {

            size16Button.classList.add(
                "selected-size"
            );

        }

        if (selectedSize === 22) {

            size22Button.classList.add(
                "selected-size"
            );

        }
    }


    // -------------------------------------------------
    // 12 / 16 / 22
    // -------------------------------------------------

    else if (
        sizeType === "size12-16-22"
    ) {

        sizeTitle.textContent =
            "Choose Size";

        size12Button.style.display =
            "inline-block";

        size16Button.style.display =
            "inline-block";

        size22Button.style.display =
            "inline-block";


        if (selectedSize === 12) {

            size12Button.classList.add(
                "selected-size"
            );

        }

        if (selectedSize === 16) {

            size16Button.classList.add(
                "selected-size"
            );

        }

        if (selectedSize === 22) {

            size22Button.classList.add(
                "selected-size"
            );

        }
    }
}


// =====================================================
// SELECT SIZE
// =====================================================

function selectSize(size) {

    selectedSize =
        Number(size);

    updateSizeDisplay();
}


// =====================================================
// ADD-ON DISPLAY
// =====================================================

function updateAddOnDisplay() {

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
}


// =====================================================
// RESET ADD-ON BUTTONS
// =====================================================

function resetAddOnButtons() {

    const espressoButton =
        document.getElementById(
            "espressoButton"
        );

    const matchaButton =
        document.getElementById(
            "matchaButton"
        );

    const chocolateButton =
        document.getElementById(
            "chocolateButton"
        );


    if (espressoButton) {

        espressoButton.textContent =
            "Extra Espresso +₱" +
            EXTRA_ESPRESSO_PRICE;

        espressoButton.classList.remove(
            "selected-size"
        );

    }

    if (matchaButton) {

        matchaButton.textContent =
            "Extra Matcha +₱" +
            EXTRA_MATCHA_PRICE;

        matchaButton.classList.remove(
            "selected-size"
        );

    }

    if (chocolateButton) {

        chocolateButton.textContent =
            "Extra Chocolate +₱" +
            EXTRA_CHOCOLATE_PRICE;

        chocolateButton.classList.remove(
            "selected-size"
        );

    }
}


// =====================================================
// TOGGLE ESPRESSO
// =====================================================

function toggleEspresso() {

    if (!espressoAvailable) {

        return;
    }

    extraEspresso =
        !extraEspresso;


    const button =
        document.getElementById(
            "espressoButton"
        );


    if (!button) {

        return;
    }


    if (extraEspresso) {

        button.textContent =
            "✓ Extra Espresso +₱" +
            EXTRA_ESPRESSO_PRICE;

        button.classList.add(
            "selected-size"
        );

    }

    else {

        button.textContent =
            "Extra Espresso +₱" +
            EXTRA_ESPRESSO_PRICE;

        button.classList.remove(
            "selected-size"
        );
    }
}


// =====================================================
// TOGGLE MATCHA
// =====================================================

function toggleMatcha() {

    if (!matchaAvailable) {

        return;
    }

    extraMatcha =
        !extraMatcha;


    const button =
        document.getElementById(
            "matchaButton"
        );


    if (!button) {

        return;
    }


    if (extraMatcha) {

        button.textContent =
            "✓ Extra Matcha +₱" +
            EXTRA_MATCHA_PRICE;

        button.classList.add(
            "selected-size"
        );

    }

    else {

        button.textContent =
            "Extra Matcha +₱" +
            EXTRA_MATCHA_PRICE;

        button.classList.remove(
            "selected-size"
        );
    }
}


// =====================================================
// TOGGLE CHOCOLATE
// =====================================================

function toggleChocolate() {

    if (!chocolateAvailable) {

        return;
    }

    extraChocolate =
        !extraChocolate;


    const button =
        document.getElementById(
            "chocolateButton"
        );


    if (!button) {

        return;
    }


    if (extraChocolate) {

        button.textContent =
            "✓ Extra Chocolate +₱" +
            EXTRA_CHOCOLATE_PRICE;

        button.classList.add(
            "selected-size"
        );

    }

    else {

        button.textContent =
            "Extra Chocolate +₱" +
            EXTRA_CHOCOLATE_PRICE;

        button.classList.remove(
            "selected-size"
        );
    }
}


// =====================================================
// CHANGE PRODUCT QUANTITY
// =====================================================

function changeQuantity(amount) {

    quantity +=
        Number(amount) || 0;


    if (quantity < 1) {

        quantity = 1;

    }


    const display =
        document.getElementById(
            "quantity"
        );


    if (display) {

        display.textContent =
            quantity;

    }
}


// =====================================================
// GET PRODUCT PRICE
// =====================================================

function getSelectedProductPrice() {

    if (selectedSize === 8) {

        return price8;

    }

    if (selectedSize === 12) {

        return price12;

    }

    if (selectedSize === 16) {

        return price16;

    }

    if (selectedSize === 22) {

        return price22;

    }

    return 0;
}


// =====================================================
// ADD PRODUCT TO CART
// =====================================================

function addSelectedProduct() {

    const basePrice =
        getSelectedProductPrice();


    if (basePrice <= 0) {

        alert(
            "The selected product does not have a valid price."
        );

        return;
    }


    let finalPrice =
        basePrice;


    if (extraEspresso) {

        finalPrice +=
            EXTRA_ESPRESSO_PRICE;

    }

    if (extraMatcha) {

        finalPrice +=
            EXTRA_MATCHA_PRICE;

    }

    if (extraChocolate) {

        finalPrice +=
            EXTRA_CHOCOLATE_PRICE;

    }


    const cartKey =
        [
            selectedProduct,
            selectedCategory,
            selectedSize,
            extraEspresso,
            extraMatcha,
            extraChocolate
        ].join("|");


    const existing =
        cart.find(function(item) {

            return item.key === cartKey;

        });


    if (existing) {

        existing.quantity +=
            quantity;

    }

    else {

        cart.push({

            key:
                cartKey,

            name:
                selectedProduct,

            category:
                selectedCategory,

            size:
                selectedSize + "oz",

            extraEspresso:
                extraEspresso,

            extraMatcha:
                extraMatcha,

            extraChocolate:
                extraChocolate,

            price:
                finalPrice,

            quantity:
                quantity

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

    const container =
        document.getElementById(
            "sideCartItems"
        );

    const totalDisplay =
        document.getElementById(
            "sideCartTotal"
        );

    const countDisplay =
        document.getElementById(
            "cartCount"
        );


    if (!container ||
        !totalDisplay ||
        !countDisplay) {

        console.error(
            "Cart HTML elements are missing."
        );

        return;
    }


    container.innerHTML = "";


    let total = 0;
    let itemCount = 0;


    cart.forEach(function(item, index) {

        const itemTotal =
            Number(item.price) *
            Number(item.quantity);


        total +=
            itemTotal;

        itemCount +=
            Number(item.quantity);


        let options = [];


        if (item.size) {

            options.push(
                item.size
            );

        }

        if (item.extraEspresso) {

            options.push(
                "Extra Espresso"
            );

        }

        if (item.extraMatcha) {

            options.push(
                "Extra Matcha"
            );

        }

        if (item.extraChocolate) {

            options.push(
                "Extra Chocolate"
            );

        }


        if (
            item.size &&
            item.category === "Snack Detour"
        ) {

            // Snack size/options are
            // already stored in item.size.

        }


        const itemElement =
            document.createElement(
                "div"
            );


        itemElement.className =
            "cart-item";


        itemElement.innerHTML = `

            <div class="cart-item-name">
                ${escapeHtml(item.name)}
            </div>

            <div class="cart-item-options">
                ${escapeHtml(options.join(" • "))}
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
        `;


        container.appendChild(
            itemElement
        );

    });


    if (cart.length === 0) {

        container.innerHTML =
            "<p>Your cart is empty.</p>";

    }


    totalDisplay.textContent =
        total;


    countDisplay.textContent =
        itemCount +
        (
            itemCount === 1
                ? " item"
                : " items"
        );


    updateCheckoutSummary();
}


// =====================================================
// CHANGE CART QUANTITY
// =====================================================

function changeCartQuantity(
    index,
    amount
) {

    if (!cart[index]) {

        return;
    }


    cart[index].quantity +=
        Number(amount);


    if (
        cart[index].quantity <= 0
    ) {

        cart.splice(
            index,
            1
        );

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


    cart.splice(
        index,
        1
    );


    updateCart();
}


// =====================================================
// ORDER NOTICE
// =====================================================

function showOrderNotice() {

    const notice =
        document.getElementById(
            "orderNotice"
        );


    if (!notice) {

        return;
    }


    notice.style.display =
        "block";


    setTimeout(function() {

        notice.style.display =
            "none";

    }, 2000);
}


// =====================================================
// CLOSE PRODUCT
// =====================================================

function closeProduct() {

    closeAllMenuPopups();
}


// =====================================================
// SNACK DATA
// =====================================================

const SNACKS = {

    nachos: {
        name: "Nacho's",
        category: "Snack Detour",
        choices: [
            {
                name: "Regular",
                price: 75
            },
            {
                name: "Overload",
                price: 125
            }
        ]
    },

    fries: {
        name: "French Fries",
        category: "Snack Detour",
        choices: [
            {
                name: "Regular",
                price: 25
            },
            {
                name: "Large",
                price: 40
            }
        ],
        flavors: [
            "BBQ",
            "Sour Cream",
            "Cheese"
        ]
    },

    hashbrown: {
        name: "Hashbrown",
        category: "Snack Detour",
        choices: [
            {
                name: "1 pc",
                price: 25
            },
            {
                name: "3 pcs",
                price: 65
            }
        ]
    },

    steamedSiomai: {
        name: "Steamed Siomai",
        category: "Snack Detour",
        choices: [
            {
                name: "5 pcs",
                price: 25
            },
            {
                name: "11 pcs",
                price: 50
            }
        ]
    },

    japaneseSiomai: {
        name: "Japanese Siomai",
        category: "Snack Detour",
        choices: [
            {
                name: "1 pc",
                price: 10
            }
        ]
    },

    tofu: {
        name: "Tofu Squares",
        category: "Snack Detour",
        choices: [
            {
                name: "4 pcs",
                price: 25
            },
            {
                name: "11 pcs",
                price: 50
            }
        ]
    },

    flyingSaucer: {
        name: "Flying Saucer",
        category: "Snack Detour",
        choices: [
            {
                name: "Ham & Cheese",
                price: 25
            },
            {
                name: "Hotdog & Cheese",
                price: 25
            },
            {
                name: "Egg & Cheese",
                price: 30
            },
            {
                name: "Tuna & Cheese",
                price: 30
            }
        ]
    },

    shanghai: {
        name: "Shanghai",
        category: "Snack Detour",
        choices: [
            {
                name: "1 pc",
                price: 10
            },
            {
                name: "11 pcs",
                price: 100
            }
        ]
    },

    donuts: {
        name: "Donuts",
        category: "Snack Detour",
        choices: [
            {
                name: "1 pc",
                price: 10
            }
        ],
        flavors: [
            "Vanilla",
            "Caramel",
            "Chocolate"
        ]
    },

    tubeIce: {
        name: "Tube Ice",
        category: "Snack Detour",
        choices: [
            {
                name: "1 pc",
                price: 15
            }
        ]
    }

};


// =====================================================
// OPEN SNACK BY KEY
// =====================================================

function openSnackByKey(key) {

    const snack =
        SNACKS[key];


    if (!snack) {

        console.error(
            "Snack key not found:",
            key
        );

        return;
    }


    openSnack(
        snack.name,
        snack.category,
        "choice",
        snack.choices,
        snack.flavors || []
    );
}


// =====================================================
// OPEN SNACK
// Supports BOTH old and new signatures
// =====================================================

function openSnack(
    snackName,
    category,
    typeOrChoices,
    choicesOrFlavors,
    flavors = []
) {

    let choices = [];
    let actualFlavors = [];


    // -------------------------------------------------
    // CURRENT STYLE:
    // openSnack(name, category, "choice", choices, flavors)
    // -------------------------------------------------

    if (
        typeof typeOrChoices === "string" &&
        Array.isArray(choicesOrFlavors)
    ) {

        choices =
            choicesOrFlavors;

        actualFlavors =
            Array.isArray(flavors)
                ? flavors
                : [];

    }


    // -------------------------------------------------
    // OLD STYLE:
    // openSnack(name, category, choices, flavors)
    // -------------------------------------------------

    else if (
        Array.isArray(typeOrChoices)
    ) {

        choices =
            typeOrChoices;

        actualFlavors =
            Array.isArray(choicesOrFlavors)
                ? choicesOrFlavors
                : [];
    }


    selectedSnackName =
        snackName;

    selectedSnackCategory =
        category;

    snackChoices =
        choices || [];

    snackFlavorChoices =
        actualFlavors || [];


    selectedSnackChoice =
        null;

    selectedSnackFlavor =
        "";

    snackQuantity =
        1;


    const title =
        document.getElementById(
            "selectedSnack"
        );

    const categoryDisplay =
        document.getElementById(
            "selectedSnackCategory"
        );

    const quantityDisplay =
        document.getElementById(
            "snackQuantity"
        );


    if (title) {

        title.textContent =
            snackName;

    }

    if (categoryDisplay) {

        categoryDisplay.textContent =
            category;

    }

    if (quantityDisplay) {

        quantityDisplay.textContent =
            snackQuantity;

    }


    // -------------------------------------------------
    // CHOICES
    // -------------------------------------------------

    const choiceContainer =
        document.getElementById(
            "snackChoiceButtons"
        );


    if (!choiceContainer) {

        console.error(
            "#snackChoiceButtons not found."
        );

        return;
    }


    choiceContainer.innerHTML =
        "";


    snackChoices.forEach(
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


            button.className =
                "snack-choice-button";


            button.onclick =
                function() {

                    selectSnackChoice(
                        index
                    );

                };


            choiceContainer.appendChild(
                button
            );

        }
    );


    // -------------------------------------------------
    // FLAVORS
    // -------------------------------------------------

    const flavorContainer =
        document.getElementById(
            "snackFlavorButtons"
        );

    const flavorSection =
        document.getElementById(
            "snackFlavors"
        );


    if (flavorContainer) {

        flavorContainer.innerHTML =
            "";

    }


    if (
        snackFlavorChoices.length > 0
    ) {

        if (flavorSection) {

            flavorSection.style.display =
                "block";

        }


        snackFlavorChoices.forEach(
            function(flavor, index) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.textContent =
                    flavor;


                button.className =
                    "snack-flavor-button";


                button.onclick =
                    function() {

                        selectSnackFlavor(
                            index
                        );

                    };


                flavorContainer.appendChild(
                    button
                );

            }
        );

    }

    else {

        if (flavorSection) {

            flavorSection.style.display =
                "none";

        }
    }


    // -------------------------------------------------
    // SHOW POPUP
    // -------------------------------------------------

    const overlay =
        document.getElementById(
            "productOverlay"
        );

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


    if (!overlay ||
        !snackPopup) {

        console.error(
            "Snack popup elements are missing."
        );

        return;
    }


    overlay.style.display =
        "flex";


    if (productPopup) {

        productPopup.style.display =
            "none";

    }

    if (mealPopup) {

        mealPopup.style.display =
            "none";

    }


    snackPopup.style.display =
        "block";
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


    buttons.forEach(
        function(button, i) {

            button.classList.toggle(
                "selected-snack",
                i === index
            );

        }
    );
}


// =====================================================
// SELECT SNACK FLAVOR
// =====================================================

function selectSnackFlavor(index) {

    if (
        !snackFlavorChoices[index]
    ) {

        return;
    }


    selectedSnackFlavor =
        snackFlavorChoices[index];


    const buttons =
        document.querySelectorAll(
            ".snack-flavor-button"
        );


    buttons.forEach(
        function(button, i) {

            button.classList.toggle(
                "selected-snack",
                i === index
            );

        }
    );
}


// =====================================================
// CHANGE SNACK QUANTITY
// =====================================================

function changeSnackQuantity(amount) {

    snackQuantity +=
        Number(amount) || 0;


    if (snackQuantity < 1) {

        snackQuantity = 1;

    }


    const display =
        document.getElementById(
            "snackQuantity"
        );


    if (display) {

        display.textContent =
            snackQuantity;

    }
}


// =====================================================
// ADD SNACK TO CART
// =====================================================

function addSnackToCart() {

    if (!selectedSnackChoice) {

        alert(
            "Please choose an option first."
        );

        return;
    }


    if (
        snackFlavorChoices.length > 0 &&
        !selectedSnackFlavor
    ) {

        alert(
            "Please choose a flavor first."
        );

        return;
    }


    let optionText =
        selectedSnackChoice.name;


    if (selectedSnackFlavor) {

        optionText +=
            " • " +
            selectedSnackFlavor;

    }


    const price =
        Number(
            selectedSnackChoice.price
        );


    const cartKey =
        selectedSnackName +
        "|" +
        optionText;


    const existing =
        cart.find(function(item) {

            return item.key === cartKey;

        });


    if (existing) {

        existing.quantity +=
            snackQuantity;

    }

    else {

        cart.push({

            key:
                cartKey,

            name:
                selectedSnackName,

            category:
                selectedSnackCategory,

            size:
                optionText,

            price:
                price,

            quantity:
                snackQuantity

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

    closeAllMenuPopups();

    selectedSnackChoice =
        null;

    selectedSnackFlavor =
        "";
}


// =====================================================
// MEAL DATA
// =====================================================

const MEALS = {

    chickenMeal: {
        name: "Chicken Rice Meal",
        choices: [
            {
                name: "1 pc Chicken",
                price: 50
            },
            {
                name: "2 pcs Chicken",
                price: 80
            }
        ]
    },

    shanghaiMeal: {
        name: "Shanghai Rice Meal",
        choices: [
            {
                name: "4 pcs Shanghai",
                price: 50
            }
        ]
    },

    siomaiMeal: {
        name: "Siomai Rice Meal",
        choices: [
            {
                name: "6 pcs Steamed Siomai",
                price: 45
            }
        ]
    },

    hotdogMeal: {
        name: "Hotdog Rice Meal",
        choices: [
            {
                name: "2 pcs Hotdog",
                price: 50
            }
        ]
    },

    meatloafMeal: {
        name: "Meatloaf Rice Meal",
        choices: [
            {
                name: "3 pcs Meatloaf",
                price: 55
            }
        ]
    },

    longganisaMeal: {
        name: "Skinless Longganisa",
        choices: [
            {
                name: "2 pcs",
                price: 55
            }
        ]
    }

};


// =====================================================
// OPEN MEAL BY KEY
// =====================================================

function openMealByKey(key) {

    const meal =
        MEALS[key];


    if (!meal) {

        console.error(
            "Meal key not found:",
            key
        );

        return;
    }


    openMeal(
        meal.name,
        meal.choices
    );
}


// =====================================================
// OPEN MEAL
// =====================================================

function openMeal(
    mealName,
    choices
) {

    selectedMealName =
        mealName;

    mealChoices =
        choices || [];

    selectedMealChoice =
        null;

    selectedMealCooler =
        "None";

    mealCoolerPrice =
        0;

    extraEgg =
        false;

    extraRice =
        false;

    mealQuantity =
        1;


    const title =
        document.getElementById(
            "selectedMeal"
        );

    const category =
        document.getElementById(
            "selectedMealCategory"
        );

    const quantityDisplay =
        document.getElementById(
            "mealQuantity"
        );

    const choiceContainer =
        document.getElementById(
            "mealChoiceButtons"
        );


    if (!title ||
        !category ||
        !quantityDisplay ||
        !choiceContainer) {

        console.error(
            "Meal popup elements are missing."
        );

        return;
    }


    title.textContent =
        mealName;

    category.textContent =
        "Pit Stop Plates";

    quantityDisplay.textContent =
        mealQuantity;


    // -------------------------------------------------
    // MEAL CHOICES
    // -------------------------------------------------

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


            button.className =
                "meal-option-button";


            button.onclick =
                function() {

                    selectMealChoice(
                        index
                    );

                };


            choiceContainer.appendChild(
                button
            );

        }
    );


    resetMealCooler();

    resetMealAddons();


    // -------------------------------------------------
    // SHOW MEAL POPUP
    // -------------------------------------------------

    const overlay =
        document.getElementById(
            "productOverlay"
        );

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


    if (!overlay ||
        !mealPopup) {

        console.error(
            "Meal popup elements are missing."
        );

        return;
    }


    overlay.style.display =
        "flex";


    if (productPopup) {

        productPopup.style.display =
            "none";

    }

    if (snackPopup) {

        snackPopup.style.display =
            "none";

    }


    mealPopup.style.display =
        "block";
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


    buttons.forEach(
        function(button, i) {

            button.classList.toggle(
                "selected-meal",
                i === index
            );

        }
    );
}


// =====================================================
// SELECT MEAL COOLER
// =====================================================

function selectMealCooler(
    name,
    price = 0
) {

    selectedMealCooler =
        name;

    mealCoolerPrice =
        Number(price) || 0;


    const buttons =
        document.querySelectorAll(
            "#mealCooler .meal-option-button"
        );


    buttons.forEach(
        function(button) {

            button.classList.remove(
                "selected-meal"
            );

        }
    );


    if (
        name === "None"
    ) {

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
        name ===
        "Highway Cooler 16oz"
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
        name ===
        "Highway Cooler 22oz"
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
// RESET MEAL COOLER
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

    extraEgg =
        !extraEgg;


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
            "Extra Egg +₱" +
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

    extraRice =
        !extraRice;


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
            "Extra Rice +₱" +
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

    extraEgg =
        false;

    extraRice =
        false;


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
            "Extra Egg +₱" +
            EXTRA_EGG_PRICE;

        eggButton.classList.remove(
            "selected-meal"
        );

    }


    if (riceButton) {

        riceButton.textContent =
            "Extra Rice +₱" +
            EXTRA_RICE_PRICE;

        riceButton.classList.remove(
            "selected-meal"
        );

    }
}


// =====================================================
// CHANGE MEAL QUANTITY
// =====================================================

function changeMealQuantity(amount) {

    mealQuantity +=
        Number(amount) || 0;


    if (mealQuantity < 1) {

        mealQuantity = 1;

    }


    const display =
        document.getElementById(
            "mealQuantity"
        );


    if (display) {

        display.textContent =
            mealQuantity;

    }
}


// =====================================================
// ADD MEAL TO CART
// =====================================================

function addMealToCart() {

    if (!selectedMealChoice) {

        alert(
            "Please choose a meal option first."
        );

        return;
    }


    let finalPrice =
        Number(
            selectedMealChoice.price
        );


    let optionText =
        selectedMealChoice.name;


    if (
        selectedMealCooler !==
        "None"
    ) {

        finalPrice +=
            mealCoolerPrice;

        optionText +=
            " • " +
            selectedMealCooler;

    }


    if (extraEgg) {

        finalPrice +=
            EXTRA_EGG_PRICE;

        optionText +=
            " • Extra Egg";

    }


    if (extraRice) {

        finalPrice +=
            EXTRA_RICE_PRICE;

        optionText +=
            " • Extra Rice";

    }


    const cartKey =
        selectedMealName +
        "|" +
        optionText;


    const existing =
        cart.find(function(item) {

            return item.key === cartKey;

        });


    if (existing) {

        existing.quantity +=
            mealQuantity;

    }

    else {

        cart.push({

            key:
                cartKey,

            name:
                selectedMealName,

            category:
                "Pit Stop Plates",

            size:
                optionText,

            price:
                finalPrice,

            quantity:
                mealQuantity

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

    closeAllMenuPopups();

    selectedMealChoice =
        null;
}


// =====================================================
// CLOSE ALL MENU POPUPS
// =====================================================

function closeAllMenuPopups() {

    const overlay =
        document.getElementById(
            "productOverlay"
        );

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


    if (overlay) {

        overlay.style.display =
            "none";

    }

    if (productPopup) {

        productPopup.style.display =
            "none";

    }

    if (snackPopup) {

        snackPopup.style.display =
            "none";

    }

    if (mealPopup) {

        mealPopup.style.display =
            "none";

    }
}


// =====================================================
// CHECKOUT
// =====================================================

function openCheckout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty. Please add an item first."
        );

        return;
    }


    const overlay =
        document.getElementById(
            "checkoutOverlay"
        );


    if (!overlay) {

        console.error(
            "ERROR: #checkoutOverlay not found."
        );

        return;
    }


    selectedOrderType =
        "";

    selectedPaymentMethod =
        "";


    const customerName =
        document.getElementById(
            "customerName"
        );

    const customerPhone =
        document.getElementById(
            "customerPhone"
        );

    const deliveryAddress =
        document.getElementById(
            "deliveryAddress"
        );

    const pickupTime =
        document.getElementById(
            "pickupTime"
        );

    const orderNotes =
        document.getElementById(
            "orderNotes"
        );

    const paymentReference =
        document.getElementById(
            "paymentReference"
        );


    if (customerName) {

        customerName.value =
            "";

    }

    if (customerPhone) {

        customerPhone.value =
            "";

    }

    if (deliveryAddress) {

        deliveryAddress.value =
            "";

    }

    if (pickupTime) {

        pickupTime.value =
            "";

    }

    if (orderNotes) {

        orderNotes.value =
            "";

    }

    if (paymentReference) {

        paymentReference.value =
            "";

    }


    const deliveryDetails =
        document.getElementById(
            "deliveryDetails"
        );

    const pickupDetails =
        document.getElementById(
            "pickupDetails"
        );

    const gcashDetails =
        document.getElementById(
            "gcashDetails"
        );


    if (deliveryDetails) {

        deliveryDetails.style.display =
            "none";

    }

    if (pickupDetails) {

        pickupDetails.style.display =
            "none";

    }

    if (gcashDetails) {

        gcashDetails.style.display =
            "none";

    }


    updateCheckoutButtons();

    updateCheckoutSummary();


    overlay.style.display =
        "flex";
}


// =====================================================
// CLOSE CHECKOUT
// =====================================================

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


// =====================================================
// SELECT ORDER TYPE
// HTML USES lowercase values:
// delivery / pickup
// =====================================================

function selectOrderType(type) {

    const normalized =
        String(type)
            .toLowerCase();


    if (
        normalized ===
        "delivery"
    ) {

        selectedOrderType =
            "Delivery";

    }

    else if (
        normalized ===
        "pickup"
    ) {

        selectedOrderType =
            "Pickup";

    }

    else {

        selectedOrderType =
            type;

    }


    const deliveryDetails =
        document.getElementById(
            "deliveryDetails"
        );

    const pickupDetails =
        document.getElementById(
            "pickupDetails"
        );


    if (
        selectedOrderType ===
        "Delivery"
    ) {

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

        if (deliveryDetails) {

            deliveryDetails.style.display =
                "none";

        }

        if (pickupDetails) {

            pickupDetails.style.display =
                "block";

        }
    }


    updateCheckoutButtons();

    updateCheckoutSummary();
}


// =====================================================
// SELECT PAYMENT
// HTML USES lowercase:
// cash / gcash
// =====================================================

function selectPaymentMethod(method) {

    const normalized =
        String(method)
            .toLowerCase();


    if (
        normalized ===
        "cash"
    ) {

        selectedPaymentMethod =
            "Cash";

    }

    else if (
        normalized ===
        "gcash"
    ) {

        selectedPaymentMethod =
            "GCash";

    }

    else {

        selectedPaymentMethod =
            method;

    }


    const gcashDetails =
        document.getElementById(
            "gcashDetails"
        );

    const paymentReference =
        document.getElementById(
            "paymentReference"
        );


    if (
        selectedPaymentMethod ===
        "GCash"
    ) {

        if (gcashDetails) {

            gcashDetails.style.display =
                "block";

        }

    }

    else {

        if (gcashDetails) {

            gcashDetails.style.display =
                "none";

        }

        if (paymentReference) {

            paymentReference.value =
                "";

        }
    }


    updateCheckoutButtons();
}


// =====================================================
// CHECKOUT BUTTON DISPLAY
// =====================================================

function updateCheckoutButtons() {

    const buttons = {

        delivery:
            document.getElementById(
                "deliveryButton"
            ),

        pickup:
            document.getElementById(
                "pickupButton"
            ),

        cash:
            document.getElementById(
                "cashButton"
            ),

        gcash:
            document.getElementById(
                "gcashButton"
            )

    };


    Object.values(buttons)
        .forEach(function(button) {

            if (button) {

                button.classList.remove(
                    "selected-checkout"
                );

            }

        });


    if (
        selectedOrderType ===
        "Delivery" &&
        buttons.delivery
    ) {

        buttons.delivery.classList.add(
            "selected-checkout"
        );

    }


    if (
        selectedOrderType ===
        "Pickup" &&
        buttons.pickup
    ) {

        buttons.pickup.classList.add(
            "selected-checkout"
        );

    }


    if (
        selectedPaymentMethod ===
        "Cash" &&
        buttons.cash
    ) {

        buttons.cash.classList.add(
            "selected-checkout"
        );

    }


    if (
        selectedPaymentMethod ===
        "GCash" &&
        buttons.gcash
    ) {

        buttons.gcash.classList.add(
            "selected-checkout"
        );

    }
}


// =====================================================
// CALCULATE CART SUBTOTAL
// =====================================================

function getCartSubtotal() {

    return cart.reduce(
        function(total, item) {

            return total +
                (
                    Number(item.price) *
                    Number(item.quantity)
                );

        },
        0
    );
}


// =====================================================
// CHECKOUT SUMMARY
// =====================================================

function updateCheckoutSummary() {

    const summary =
        document.getElementById(
            "checkoutSummary"
        );

    const totalDisplay =
        document.getElementById(
            "checkoutTotal"
        );


    if (!summary ||
        !totalDisplay) {

        return;
    }


    if (cart.length === 0) {

        summary.innerHTML =
            "<p>Your cart is empty.</p>";

        totalDisplay.textContent =
            "0";

        return;
    }


    let subtotal =
        0;


    let html =
        "";


    cart.forEach(function(item) {

        const itemTotal =
            Number(item.price) *
            Number(item.quantity);


        subtotal +=
            itemTotal;


        let options =
            [];


        if (item.size) {

            options.push(
                item.size
            );

        }

        if (item.extraEspresso) {

            options.push(
                "Extra Espresso"
            );

        }

        if (item.extraMatcha) {

            options.push(
                "Extra Matcha"
            );

        }

        if (item.extraChocolate) {

            options.push(
                "Extra Chocolate"
            );

        }


        html += `

            <div class="checkout-item">

                <div>

                    <strong>
                        ${item.quantity}x
                        ${escapeHtml(item.name)}
                    </strong>

                    <small>
                        ${escapeHtml(
                            options.join(" • ")
                        )}
                    </small>

                </div>

                <strong>
                    ₱${itemTotal}
                </strong>

            </div>

        `;

    });


    let deliveryFee =
        0;


    if (
        selectedOrderType ===
        "Delivery"
    ) {

        deliveryFee =
            DELIVERY_FEE;

    }


    const grandTotal =
        subtotal +
        deliveryFee;


    html += `

        <div class="checkout-item">

            <div>
                <strong>Subtotal</strong>
            </div>

            <strong>
                ₱${subtotal}
            </strong>

        </div>

        <div class="checkout-item">

            <div>
                <strong>Delivery Fee</strong>
            </div>

            <strong>
                ₱${deliveryFee}
            </strong>

        </div>

    `;


    summary.innerHTML =
        html;


    totalDisplay.textContent =
        grandTotal;
}


// =====================================================
// BUILD ORDER ITEMS TEXT
// =====================================================

function buildOrderedItemsText() {

    return cart.map(
        function(item) {

            let text =
                item.quantity +
                " x " +
                item.name;


            if (item.size) {

                text +=
                    " — " +
                    item.size;

            }


            if (item.extraEspresso) {

                text +=
                    " — Extra Espresso";

            }


            if (item.extraMatcha) {

                text +=
                    " — Extra Matcha";

            }


            if (item.extraChocolate) {

                text +=
                    " — Extra Chocolate";

            }


            return text;

        }
    ).join("\n");
}


// =====================================================
// GENERATE ORDER NUMBER
// =====================================================

function generateOrderNumber() {

    const now =
        new Date();


    const date =
        String(
            now.getFullYear()
        ).slice(-2) +
        String(
            now.getMonth() + 1
        ).padStart(2, "0") +
        String(
            now.getDate()
        ).padStart(2, "0");


    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    return (
        "HC-" +
        date +
        "-" +
        random
    );
}


// =====================================================
// PLACE ORDER
// =====================================================

async function placeOrder() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;
    }


    const customerNameElement =
        document.getElementById(
            "customerName"
        );

    const customerPhoneElement =
        document.getElementById(
            "customerPhone"
        );

    const deliveryAddressElement =
        document.getElementById(
            "deliveryAddress"
        );

    const pickupTimeElement =
        document.getElementById(
            "pickupTime"
        );

    const orderNotesElement =
        document.getElementById(
            "orderNotes"
        );

    const paymentReferenceElement =
        document.getElementById(
            "paymentReference"
        );


    const customerName =
        customerNameElement
            ? customerNameElement.value.trim()
            : "";

    const customerPhone =
        customerPhoneElement
            ? customerPhoneElement.value.trim()
            : "";

    const deliveryAddress =
        deliveryAddressElement
            ? deliveryAddressElement.value.trim()
            : "";

    const pickupTime =
        pickupTimeElement
            ? pickupTimeElement.value
            : "";

    const orderNotes =
        orderNotesElement
            ? orderNotesElement.value.trim()
            : "";

    const paymentReference =
        paymentReferenceElement
            ? paymentReferenceElement.value.trim()
            : "";


    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!selectedOrderType) {

        alert(
            "Please choose Delivery or Pickup."
        );

        return;
    }


    if (!customerName) {

        alert(
            "Please enter your name."
        );

        return;
    }


    if (!customerPhone) {

        alert(
            "Please enter your mobile number."
        );

        return;
    }


    if (
        selectedOrderType ===
        "Delivery" &&
        !deliveryAddress
    ) {

        alert(
            "Please enter your delivery address."
        );

        return;
    }


    if (
        selectedOrderType ===
        "Pickup" &&
        !pickupTime
    ) {

        alert(
            "Please choose your preferred pickup time."
        );

        return;
    }


    if (!selectedPaymentMethod) {

        alert(
            "Please choose a payment method."
        );

        return;
    }


    if (
        selectedPaymentMethod ===
        "GCash" &&
        !paymentReference
    ) {

        alert(
            "Please enter your GCash payment reference number."
        );

        return;
    }


    // -------------------------------------------------
    // TOTALS
    // -------------------------------------------------

    const subtotal =
        getCartSubtotal();


    const deliveryFee =
        selectedOrderType ===
        "Delivery"
            ? DELIVERY_FEE
            : 0;


    const grandTotal =
        subtotal +
        deliveryFee;


    const orderNumber =
        generateOrderNumber();


    const orderedItems =
        buildOrderedItemsText();


    // -------------------------------------------------
    // SUPABASE ORDER
    // -------------------------------------------------

    const orderData = {

        order_number:
            orderNumber,

        customer_name:
            customerName,

        phone:
            customerPhone,

        order_type:
            selectedOrderType,

        delivery_address:
            selectedOrderType === "Delivery"
                ? deliveryAddress
                : "",

        pickup_time:
            selectedOrderType === "Pickup"
                ? pickupTime
                : "",

        payment_method:
            selectedPaymentMethod,

        gcash_reference:
            selectedPaymentMethod === "GCash"
                ? paymentReference
                : "",

        ordered_items:
            orderedItems,

        order_notes:
            orderNotes,

        subtotal:
            subtotal,

        delivery_fee:
            deliveryFee,

        grand_total:
            grandTotal,

        status:
            "New"
    };


    const button =
        document.getElementById(
            "placeOrderButton"
        );


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "PLACING ORDER...";

    }


    try {

        if (!supabaseClient) {

            initializeSupabase();

        }


        if (!supabaseClient) {

            throw new Error(
                "Supabase could not be initialized."
            );

        }


        const result =
            await supabaseClient
                .from("orders")
                .insert([
                    orderData
                ]);


        if (result.error) {

            throw result.error;

        }


        // -------------------------------------------------
        // EMAIL FORM
        // -------------------------------------------------

        prepareEmailForm(
            orderData
        );


        const emailForm =
            document.getElementById(
                "orderEmailForm"
            );


        if (emailForm) {

            try {

                emailForm.submit();

            } catch (emailError) {

                console.warn(
                    "Email form submission warning:",
                    emailError
                );

            }

        }


        // -------------------------------------------------
        // SHOW CONFIRMATION
        // -------------------------------------------------

        showConfirmation(
            orderData
        );


    }

    catch (error) {

        console.error(
            "ORDER SUBMISSION ERROR:",
            error
        );


        alert(
            "We could not place your order.\n\n" +
            (
                error.message ||
                "Please try again."
            )
        );

    }

    finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                "Place Order";

        }

    }
}


// =====================================================
// PREPARE EMAIL FORM
// =====================================================

function prepareEmailForm(order) {

    setValue(
        "emailSubject",
        "HIGHWAY CAFE ORDER " +
        order.order_number
    );

    setValue(
        "emailOrderNumber",
        order.order_number
    );

    setValue(
        "emailCustomerName",
        order.customer_name
    );

    setValue(
        "emailCustomerPhone",
        order.phone
    );

    setValue(
        "emailOrderType",
        order.order_type
    );

    setValue(
        "emailDeliveryAddress",
        order.delivery_address
    );

    setValue(
        "emailPickupTime",
        order.pickup_time
    );

    setValue(
        "emailPaymentMethod",
        order.payment_method
    );

    setValue(
        "emailPaymentReference",
        order.gcash_reference
    );

    setValue(
        "emailItems",
        order.ordered_items
    );

    setValue(
        "emailNotes",
        order.order_notes
    );

    setValue(
        "emailTotal",
        "₱" +
        order.grand_total
    );
}


// =====================================================
// SET VALUE HELPER
// =====================================================

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.value =
            value || "";

    }
}


// =====================================================
// SHOW CONFIRMATION
// =====================================================

function showConfirmation(order) {

    const checkoutPopup =
        document.getElementById(
            "checkoutPopup"
        );

    const confirmationPopup =
        document.getElementById(
            "orderConfirmationPopup"
        );

    const orderNumber =
        document.getElementById(
            "confirmationOrderNumber"
        );

    const summary =
        document.getElementById(
            "confirmationOrderSummary"
        );

    const total =
        document.getElementById(
            "confirmationTotal"
        );


    if (checkoutPopup) {

        checkoutPopup.style.display =
            "none";

    }


    if (orderNumber) {

        orderNumber.textContent =
            order.order_number;

    }


    if (summary) {

        let text =
            "";


        text +=
            "Customer: " +
            order.customer_name +
            "\n";

        text +=
            "Phone: " +
            order.phone +
            "\n";

        text +=
            "Order Type: " +
            order.order_type +
            "\n";

        text +=
            "Payment: " +
            order.payment_method +
            "\n";


        if (
            order.order_type ===
            "Delivery"
        ) {

            text +=
                "Address: " +
                order.delivery_address +
                "\n";

        }

        else {

            text +=
                "Pickup Time: " +
                order.pickup_time +
                "\n";

        }


        text +=
            "\nItems:\n" +
            order.ordered_items +
            "\n";


        text +=
            "\nSubtotal: ₱" +
            order.subtotal;


        if (
            Number(
                order.delivery_fee
            ) > 0
        ) {

            text +=
                "\nDelivery Fee: ₱" +
                order.delivery_fee;

        }


        text +=
            "\nTotal: ₱" +
            order.grand_total;


        summary.textContent =
            text;

    }


    if (total) {

        total.textContent =
            "₱" +
            order.grand_total;

    }


    if (confirmationPopup) {

        confirmationPopup.style.display =
            "block";

    }
}


// =====================================================
// FINISH ORDER
// =====================================================

function finishOrder() {

    const overlay =
        document.getElementById(
            "checkoutOverlay"
        );


    if (overlay) {

        overlay.style.display =
            "none";

    }


    cart = [];


    updateCart();


    selectedOrderType =
        "";

    selectedPaymentMethod =
        "";


    const confirmationPopup =
        document.getElementById(
            "orderConfirmationPopup"
        );


    if (confirmationPopup) {

        confirmationPopup.style.display =
            "none";

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });
}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

    return String(
        value == null
            ? ""
            : value
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// =====================================================
// SHOP STATUS
// =====================================================

let shopIsOpen =
    true;


async function loadShopStatusForCustomer() {

    if (!supabaseClient) {

        return;

    }


    try {

        const result =
            await supabaseClient
                .from("shop_settings")
                .select("*")
                .limit(1)
                .maybeSingle();


        if (result.error) {

            console.warn(
                "Shop status could not be loaded:",
                result.error.message
            );

            return;
        }


        if (result.data) {

            if (
                typeof result.data.is_open !==
                "undefined"
            ) {

                shopIsOpen =
                    Boolean(
                        result.data.is_open
                    );

            }

            else if (
                typeof result.data.open !==
                "undefined"
            ) {

                shopIsOpen =
                    Boolean(
                        result.data.open
                    );

            }

        }


        updateCustomerShopDisplay();

    }

    catch (error) {

        console.warn(
            "Shop status error:",
            error
        );

    }
}


// =====================================================
// SHOP STATUS DISPLAY
// =====================================================

function updateCustomerShopDisplay() {

    const header =
        document.querySelector(
            "header"
        );


    if (!header) {

        return;
    }


    let notice =
        document.getElementById(
            "customerShopStatus"
        );


    if (!notice) {

        notice =
            document.createElement(
                "div"
            );

        notice.id =
            "customerShopStatus";

        notice.style.margin =
            "10px 0";

        notice.style.fontWeight =
            "bold";


        header.appendChild(
            notice
        );

    }


    if (shopIsOpen) {

        notice.textContent =
            "🟢 SHOP IS OPEN";

        notice.style.color =
            "green";

    }

    else {

        notice.textContent =
            "🔴 SHOP IS CLOSED";

        notice.style.color =
            "#b00020";

    }
}


// =====================================================
// MENU AVAILABILITY
// =====================================================

let menuAvailability =
    {};


async function loadMenuAvailabilityForCustomer() {

    if (!supabaseClient) {

        return;

    }


    try {

        const result =
            await supabaseClient
                .from("menu_items")
                .select("*");


        if (result.error) {

            console.warn(
                "Menu availability could not be loaded:",
                result.error.message
            );

            return;
        }


        menuAvailability =
            {};


        (
            result.data || []
        ).forEach(function(item) {

            const key =
                makeMenuKey(
                    item.name,
                    item.category
                );


            menuAvailability[key] =
                item.available !== false;

        });


        applyCustomerAvailabilityButtonsOnly();

    }

    catch (error) {

        console.warn(
            "Menu availability error:",
            error
        );

    }
}


// =====================================================
// MENU KEY
// =====================================================

function makeMenuKey(
    name,
    category
) {

    return (
        String(category || "")
            .trim()
            .toLowerCase() +
        "|" +
        String(name || "")
            .trim()
            .toLowerCase()
    );
}


// =====================================================
// IS MENU ITEM AVAILABLE
// =====================================================

function isMenuItemAvailable(
    name,
    category
) {

    const key =
        makeMenuKey(
            name,
            category
        );


    if (
        Object.prototype.hasOwnProperty.call(
            menuAvailability,
            key
        )
    ) {

        return menuAvailability[key];

    }


    return true;
}


// =====================================================
// APPLY AVAILABILITY TO BUTTONS
// =====================================================

function applyCustomerAvailabilityButtonsOnly() {

    const buttons =
        document.querySelectorAll(
            ".menu-item"
        );


    buttons.forEach(function(button) {

        const onclick =
            button.getAttribute(
                "onclick"
            );


        if (!onclick) {

            return;
        }


        let key =
            null;


        const drinkMatch =
            onclick.match(
                /openDrink\(['"]([^'"]+)['"]\)/
            );


        if (drinkMatch) {

            const drink =
                DRINKS[
                    drinkMatch[1]
                ];


            if (drink) {

                key =
                    makeMenuKey(
                        drink.name,
                        drink.category
                    );

            }

        }


        const snackMatch =
            onclick.match(
                /openSnackByKey\(['"]([^'"]+)['"]\)/
            );


        if (snackMatch) {

            const snack =
                SNACKS[
                    snackMatch[1]
                ];


            if (snack) {

                key =
                    makeMenuKey(
                        snack.name,
                        snack.category
                    );

            }

        }


        const mealMatch =
            onclick.match(
                /openMealByKey\(['"]([^'"]+)['"]\)/
            );


        if (mealMatch) {

            const meal =
                MEALS[
                    mealMatch[1]
                ];


            if (meal) {

                key =
                    makeMenuKey(
                        meal.name,
                        "Pit Stop Plates"
                    );

            }

        }


        if (!key) {

            return;
        }


        const available =
            menuAvailability[key];


        if (
            typeof available !==
            "boolean"
        ) {

            return;
        }


        if (!available) {

            button.disabled =
                true;

            button.classList.add(
                "sold-out"
            );


            const existing =
                button.querySelector(
                    ".sold-out-label"
                );


            if (!existing) {

                const label =
                    document.createElement(
                        "small"
                    );


                label.className =
                    "sold-out-label";

                label.textContent =
                    " SOLD OUT";


                button.appendChild(
                    label
                );

            }

        }

        else {

            button.disabled =
                false;

            button.classList.remove(
                "sold-out"
            );

            const label =
                button.querySelector(
                    ".sold-out-label"
                );


            if (label) {

                label.remove();

            }

        }

    });
}


// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        initializeSupabase();

        updateCart();

        setupPopupOverlay();

        loadShopStatusForCustomer();

        loadMenuAvailabilityForCustomer();

    }
);


// =====================================================
// POPUP OVERLAY
// =====================================================

function setupPopupOverlay() {

    const overlay =
        document.getElementById(
            "productOverlay"
        );


    if (!overlay) {

        return;
    }


    overlay.addEventListener(
        "click",
        function(event) {

            if (
                event.target !==
                overlay
            ) {

                return;
            }


            closeAllMenuPopups();

        }
    );
}
