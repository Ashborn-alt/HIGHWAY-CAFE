// ============================================================
// HIGHWAY CAFE
// COMPLETE CUSTOMER ORDERING SYSTEM
// NEW SCRIPT.JS
// Designed specifically for the current index.html
// ============================================================


// ============================================================
// SUPABASE CONFIGURATION
// ============================================================

const SUPABASE_URL =
    "https://qfnjegsbyxxqsdaelqqa.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_ttu1AyOaylp3J4x7iTqaNg_1VLOdHoE";

let supabaseClient = null;


// ============================================================
// GENERAL SETTINGS
// ============================================================

const DELIVERY_FEE = 20;

const ESPRESSO_PRICE = 30;
const MATCHA_PRICE = 30;
const CHOCOLATE_PRICE = 30;

const EXTRA_EGG_PRICE = 10;
const EXTRA_RICE_PRICE = 15;


// ============================================================
// CART
// ============================================================

let cart = [];


// ============================================================
// PRODUCT STATE
// ============================================================

let selectedProduct = "";
let selectedCategory = "";

let price8 = 0;
let price12 = 0;
let price16 = 0;
let price22 = 0;

let selectedSize = 16;

let espressoAvailable = false;
let matchaAvailable = false;
let chocolateAvailable = false;

let extraEspresso = false;
let extraMatcha = false;
let extraChocolate = false;

let quantity = 1;


// ============================================================
// SNACK STATE
// ============================================================

let selectedSnackName = "";
let selectedSnackCategory = "";

let snackChoices = [];
let snackFlavors = [];

let selectedSnackChoice = null;
let selectedSnackFlavor = "";

let snackQuantity = 1;


// ============================================================
// MEAL STATE
// ============================================================

let selectedMealName = "";
let selectedMealCategory = "Pit Stop Plates";

let mealChoices = [];

let selectedMealChoice = null;

let mealQuantity = 1;

let selectedMealCoolerName = "None";
let selectedMealCoolerPrice = 0;

let extraEgg = false;
let extraRice = false;


// ============================================================
// CHECKOUT STATE
// ============================================================

let selectedOrderType = "delivery";
let selectedPaymentMethodValue = "cash";

let currentOrderNumber = "";


// ============================================================
// SHOP STATE
// ============================================================

let shopIsOpen = true;

let menuAvailability = {};


// ============================================================
// SAFE DOM HELPER
// ============================================================

function $(id) {
    return document.getElementById(id);
}


// ============================================================
// NUMBER HELPER
// ============================================================

function money(value) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return number;
}


// ============================================================
// FORMAT MONEY
// ============================================================

function formatMoney(value) {
    return money(value).toFixed(2);
}


// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    initializeSupabase();

    initializeCustomerPage();

});


// ============================================================
// CUSTOMER PAGE INITIALIZATION
// ============================================================

function initializeCustomerPage() {

    // Hide popups when page loads
    hideAllPopups();

    // Default checkout state
    selectOrderType("delivery");
    selectPaymentMethod("cash");

    // Render empty cart
    updateCart();

    // Try loading shop information
    setTimeout(function () {

        loadShopStatusForCustomer();

        loadMenuAvailabilityForCustomer();

    }, 500);
}


// ============================================================
// HIDE ALL POPUPS
// ============================================================

function hideAllPopups() {

    const overlays = [
        "productOverlay",
        "checkoutOverlay"
    ];

    overlays.forEach(function (id) {

        const element = $(id);

        if (element) {
            element.style.display = "none";
        }

    });

    const popupIds = [
        "productPopup",
        "snackPopupContent",
        "mealPopupContent",
        "checkoutPopup",
        "orderConfirmationPopup"
    ];

    popupIds.forEach(function (id) {

        const element = $(id);

        if (element) {
            element.style.display = "none";
        }

    });
}


// ============================================================
// SUPABASE INITIALIZATION
// ============================================================

function loadSupabaseLibrary() {

    return new Promise(function (resolve) {

        if (window.supabase) {
            resolve(true);
            return;
        }

        const existing =
            document.querySelector(
                'script[src*="supabase-js"]'
            );

        if (existing) {

            existing.addEventListener(
                "load",
                function () {
                    resolve(!!window.supabase);
                }
            );

            existing.addEventListener(
                "error",
                function () {
                    resolve(false);
                }
            );

            return;
        }

        const script =
            document.createElement("script");

        script.src =
            "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

        script.onload = function () {
            resolve(!!window.supabase);
        };

        script.onerror = function () {
            console.warn(
                "Supabase library could not be loaded."
            );

            resolve(false);
        };

        document.head.appendChild(script);

    });
}


// ============================================================
// INITIALIZE SUPABASE
// ============================================================

async function initializeSupabase() {

    try {

        const loaded =
            await loadSupabaseLibrary();

        if (
            !loaded ||
            !window.supabase ||
            !window.supabase.createClient
        ) {
            console.warn(
                "Supabase is unavailable."
            );

            return;
        }

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );

        console.log(
            "Highway Cafe Supabase initialized."
        );

    } catch (error) {

        console.error(
            "Supabase initialization error:",
            error
        );

    }
}


// ============================================================
// SHOP STATUS
// ============================================================

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
                result.error
            );

            return;
        }

        if (!result.data) {
            return;
        }

        const data = result.data;

        if (
            typeof data.is_open !== "undefined"
        ) {

            shopIsOpen =
                data.is_open === true;

        }

        updateCustomerShopDisplay();

    } catch (error) {

        console.warn(
            "Shop status error:",
            error
        );

    }
}


// ============================================================
// UPDATE SHOP DISPLAY
// ============================================================

function updateCustomerShopDisplay() {

    const orderButton =
        document.querySelector(
            'header button[onclick="startOrder()"]'
        );

    if (!orderButton) {
        return;
    }

    if (shopIsOpen) {

        orderButton.disabled = false;
        orderButton.textContent = "Order Now";

    } else {

        orderButton.disabled = true;
        orderButton.textContent = "Shop Closed";

    }
}


// ============================================================
// SHOP OPEN CHECK
// ============================================================

function isShopOpenForOrdering() {

    if (!shopIsOpen) {

        alert(
            "Highway Cafe is currently closed."
        );

        return false;
    }

    return true;
}


// ============================================================
// START ORDER
// ============================================================

function startOrder() {

    if (!isShopOpenForOrdering()) {
        return;
    }

    const menu =
        $("menu");

    if (menu) {

        menu.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
}


// ============================================================
// MENU AVAILABILITY
// ============================================================

async function loadMenuAvailabilityForCustomer() {

    if (!supabaseClient) {
        return;
    }

    try {

        const result =
            await supabaseClient
                .from("menu_availability")
                .select("*");

        if (result.error) {

            console.warn(
                "Menu availability could not be loaded:",
                result.error
            );

            return;
        }

        menuAvailability = {};

        if (Array.isArray(result.data)) {

            result.data.forEach(function (item) {

                const key =
                    makeMenuKey(
                        item.name,
                        item.category
                    );

                menuAvailability[key] =
                    item.is_available !== false;

            });

        }

        applyCustomerAvailability();

    } catch (error) {

        console.warn(
            "Menu availability error:",
            error
        );

    }
}


// ============================================================
// MAKE MENU KEY
// ============================================================

function makeMenuKey(name, category) {

    return (
        String(category || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ")
        +
        "::" +
        String(name || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ")
    );

}


// ============================================================
// CHECK ITEM AVAILABILITY
// ============================================================

function isMenuItemAvailable(name, category) {

    const key =
        makeMenuKey(name, category);

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


// ============================================================
// APPLY AVAILABILITY
// ============================================================

function applyCustomerAvailability() {

    // Availability is also checked directly
    // when the customer clicks an item.

    const buttons =
        document.querySelectorAll(
            ".menu-item"
        );

    buttons.forEach(function (button) {

        button.disabled = false;

    });

}


// ============================================================
// REFRESH AVAILABILITY
// ============================================================

async function refreshCustomerAvailability() {

    await loadMenuAvailabilityForCustomer();

}


// ============================================================
// POPUP HELPER
// ============================================================

function showPopup(
    overlayId,
    popupId
) {

    const overlay = $(overlayId);

    const popup = $(popupId);

    if (!overlay) {
        return;
    }

    overlay.style.display = "flex";

    if (popup) {
        popup.style.display = "block";
    }

}


// ============================================================
// CLOSE PRODUCT
// ============================================================

function closeProduct() {

    const overlay =
        $("productOverlay");

    if (overlay) {
        overlay.style.display = "none";
    }

    const popup =
        $("productPopup");

    if (popup) {
        popup.style.display = "none";
    }

}


// ============================================================
// DRINK DATA
// ============================================================

const DRINKS = {

    americano: {
        name: "Americano",
        category: "Iced Coffee",
        p16: 70,
        p22: 80,
        addons: ["espresso"]
    },

    vanillaLatte: {
        name: "Vanilla Latte",
        category: "Iced Coffee",
        p16: 75,
        p22: 89,
        addons: ["espresso"]
    },

    spanishLatte: {
        name: "Spanish Latte",
        category: "Iced Coffee",
        p16: 75,
        p22: 89,
        addons: ["espresso"]
    },

    mochaLatte: {
        name: "Mocha Latte",
        category: "Iced Coffee",
        p16: 75,
        p22: 89,
        addons: [
            "espresso",
            "chocolate"
        ]
    },

    dirtyMatcha: {
        name: "Dirty Matcha",
        category: "Iced Coffee",
        p16: 85,
        p22: 100,
        addons: [
            "espresso",
            "matcha"
        ]
    },

    saltedCaramel: {
        name: "Salted Caramel",
        category: "Iced Coffee",
        p16: 75,
        p22: 89,
        addons: ["espresso"]
    },

    caramelMacchiato: {
        name: "Caramel Macchiato",
        category: "Iced Coffee",
        p16: 75,
        p22: 89,
        addons: ["espresso"]
    },


    // HOT COFFEE

    hotChoco: {
        name: "Hot Choco",
        category: "Hot Coffee",
        p8: 70,
        addons: ["chocolate"]
    },

    hotAmericano: {
        name: "Americano",
        category: "Hot Coffee",
        p8: 70,
        addons: ["espresso"]
    },

    hotSpanishLatte: {
        name: "Spanish Latte",
        category: "Hot Coffee",
        p8: 80,
        addons: ["espresso"]
    },

    cafeLatte: {
        name: "Cafe Latte",
        category: "Hot Coffee",
        p8: 80,
        addons: ["espresso"]
    },


    // SODA

    greenApple: {
        name: "Green Apple",
        category: "Soda Series",
        p12: 29,
        p16: 39,
        p22: 59,
        addons: []
    },

    lychee: {
        name: "Lychee",
        category: "Soda Series",
        p12: 29,
        p16: 39,
        p22: 59,
        addons: []
    },

    strawberrySoda: {
        name: "Strawberry",
        category: "Soda Series",
        p12: 29,
        p16: 39,
        p22: 59,
        addons: []
    },

    blueberrySoda: {
        name: "Blueberry",
        category: "Soda Series",
        p12: 29,
        p16: 39,
        p22: 59,
        addons: []
    },


    // MILK SERIES

    strawberryMilk: {
        name: "Strawberry Milk",
        category: "Milk Series",
        p16: 65,
        p22: 80,
        addons: []
    },

    blueberryMilk: {
        name: "Blueberry Milk",
        category: "Milk Series",
        p16: 65,
        p22: 80,
        addons: []
    },

    chocolateMilk: {
        name: "Chocolate Milk",
        category: "Milk Series",
        p16: 65,
        p22: 80,
        addons: ["chocolate"]
    },

    matchaLatte: {
        name: "Matcha Latte",
        category: "Milk Series",
        p16: 80,
        p22: 95,
        addons: ["matcha"]
    },

    cookiesCream: {
        name: "Cookies and Cream",
        category: "Milk Series",
        p16: 65,
        p22: 80,
        addons: []
    }

};


// ============================================================
// OPEN DRINK
// ============================================================

function openDrink(key) {

    if (!isShopOpenForOrdering()) {
        return;
    }

    const drink =
        DRINKS[key];

    if (!drink) {

        console.error(
            "Drink key not found:",
            key
        );

        return;
    }

    if (
        !isMenuItemAvailable(
            drink.name,
            drink.category
        )
    ) {

        alert(
            `${drink.name} is currently unavailable.`
        );

        return;
    }

    selectedProduct =
        drink.name;

    selectedCategory =
        drink.category;

    price8 =
        money(drink.p8);

    price12 =
        money(drink.p12);

    price16 =
        money(drink.p16);

    price22 =
        money(drink.p22);

    selectedSize =
        16;

    quantity =
        1;

    extraEspresso =
        false;

    extraMatcha =
        false;

    extraChocolate =
        false;


    // HOT COFFEE

    if (drink.category === "Hot Coffee") {

        if (price8 <= 0) {
            price8 = price16;
        }

        selectedSize = 8;

    }


    // SODA

    else if (
        drink.category === "Soda Series"
    ) {

        selectedSize = 12;

    }


    // NORMAL ICED / MILK

    else {

        selectedSize = 16;

    }


    espressoAvailable =
        drink.addons.includes("espresso");

    matchaAvailable =
        drink.addons.includes("matcha");

    chocolateAvailable =
        drink.addons.includes("chocolate");


    updateProductPopup();

    showPopup(
        "productOverlay",
        "productPopup"
    );

}


// ============================================================
// UPDATE PRODUCT POPUP
// ============================================================

function updateProductPopup() {

    if ($("selectedProduct")) {
        $("selectedProduct").textContent =
            selectedProduct;
    }

    if ($("selectedCategory")) {
        $("selectedCategory").textContent =
            selectedCategory;
    }

    updateSizeButtons();

    updateAddonButtons();

    updateQuantityDisplay();

    updateSelectedProductPrice();

}


// ============================================================
// SIZE BUTTONS
// ============================================================

function updateSizeButtons() {

    const size12 =
        $("size12Button");

    const size16 =
        $("size16Button");

    const size22 =
        $("size22Button");

    const sizeTitle =
        $("sizeTitle");


    if (selectedCategory === "Hot Coffee") {

        if (sizeTitle) {
            sizeTitle.textContent =
                "Size: 8oz";
        }

        if (size12) {
            size12.style.display = "none";
        }

        if (size16) {
            size16.style.display = "none";
        }

        if (size22) {
            size22.style.display = "none";
        }

        return;

    }


    if (sizeTitle) {
        sizeTitle.textContent =
            "Choose Size";
    }


    if (size12) {

        size12.style.display =
            price12 > 0
                ? "inline-block"
                : "none";

    }


    if (size16) {

        size16.style.display =
            price16 > 0
                ? "inline-block"
                : "none";

    }


    if (size22) {

        size22.style.display =
            price22 > 0
                ? "inline-block"
                : "none";

    }


    if (size12) {
        size12.classList.toggle(
            "selected-size",
            selectedSize === 12
        );
    }

    if (size16) {
        size16.classList.toggle(
            "selected-size",
            selectedSize === 16
        );
    }

    if (size22) {
        size22.classList.toggle(
            "selected-size",
            selectedSize === 22
        );
    }

}


// ============================================================
// SELECT SIZE
// ============================================================

function selectSize(size) {

    size =
        Number(size);

    if (
        selectedCategory === "Hot Coffee"
    ) {
        selectedSize = 8;
        updateSelectedProductPrice();
        return;
    }

    if (size === 12 && price12 > 0) {
        selectedSize = 12;
    }

    else if (
        size === 16 &&
        price16 > 0
    ) {
        selectedSize = 16;
    }

    else if (
        size === 22 &&
        price22 > 0
    ) {
        selectedSize = 22;
    }

    updateSizeButtons();
    updateSelectedProductPrice();

}


// ============================================================
// GET SELECTED PRODUCT BASE PRICE
// ============================================================

function getSelectedProductBasePrice() {

    if (selectedSize === 8) {
        return price8;
    }

    if (selectedSize === 12) {
        return price12;
    }

    if (selectedSize === 22) {
        return price22;
    }

    return price16;
}


// ============================================================
// PRODUCT ADD-ON TOTAL
// ============================================================

function getProductAddonTotal() {

    let total = 0;

    if (extraEspresso) {
        total += ESPRESSO_PRICE;
    }

    if (extraMatcha) {
        total += MATCHA_PRICE;
    }

    if (extraChocolate) {
        total += CHOCOLATE_PRICE;
    }

    return total;
}


// ============================================================
// PRODUCT UNIT PRICE
// ============================================================

function getSelectedProductUnitPrice() {

    return (
        getSelectedProductBasePrice()
        +
        getProductAddonTotal()
    );

}


// ============================================================
// PRODUCT TOTAL
// ============================================================

function getSelectedProductTotal() {

    return (
        getSelectedProductUnitPrice()
        *
        quantity
    );

}


// ============================================================
// UPDATE PRODUCT PRICE
// ============================================================

function updateSelectedProductPrice() {

    // There is no dedicated price element in the current
    // HTML, so we only update the button text.

    const addButton =
        $("addToCartButton");

    if (addButton) {

        addButton.textContent =
            `Add to Cart - ₱${formatMoney(
                getSelectedProductTotal()
            )}`;

    }

}


// ============================================================
// ADDON BUTTON DISPLAY
// ============================================================

function updateAddonButtons() {

    const espressoOption =
        $("espressoOption");

    const matchaOption =
        $("matchaOption");

    const chocolateOption =
        $("chocolateOption");


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


    const espressoButton =
        $("espressoButton");

    const matchaButton =
        $("matchaButton");

    const chocolateButton =
        $("chocolateButton");


    if (espressoButton) {

        espressoButton.classList.toggle(
            "selected",
            extraEspresso
        );

    }


    if (matchaButton) {

        matchaButton.classList.toggle(
            "selected",
            extraMatcha
        );

    }


    if (chocolateButton) {

        chocolateButton.classList.toggle(
            "selected",
            extraChocolate
        );

    }

}


// ============================================================
// TOGGLE ESPRESSO
// ============================================================

function toggleEspresso() {

    if (!espressoAvailable) {
        return;
    }

    extraEspresso =
        !extraEspresso;

    updateAddonButtons();
    updateSelectedProductPrice();

}


// ============================================================
// TOGGLE MATCHA
// ============================================================

function toggleMatcha() {

    if (!matchaAvailable) {
        return;
    }

    extraMatcha =
        !extraMatcha;

    updateAddonButtons();
    updateSelectedProductPrice();

}


// ============================================================
// TOGGLE CHOCOLATE
// ============================================================

function toggleChocolate() {

    if (!chocolateAvailable) {
        return;
    }

    extraChocolate =
        !extraChocolate;

    updateAddonButtons();
    updateSelectedProductPrice();

}


// ============================================================
// PRODUCT QUANTITY
// ============================================================

function changeQuantity(delta) {

    delta =
        Number(delta) || 0;

    quantity += delta;

    if (quantity < 1) {
        quantity = 1;
    }

    updateQuantityDisplay();

    updateSelectedProductPrice();

}


// ============================================================
// PRODUCT QUANTITY DISPLAY
// ============================================================

function updateQuantityDisplay() {

    const element =
        $("quantity");

    if (element) {
        element.textContent =
            quantity;
    }

}


// ============================================================
// ADD SELECTED PRODUCT
// ============================================================

function addSelectedProduct() {

    if (!selectedProduct) {
        return;
    }

    const basePrice =
        getSelectedProductBasePrice();

    if (basePrice <= 0) {

        alert(
            "Please choose a valid size."
        );

        return;
    }


    const addons = [];

    if (extraEspresso) {
        addons.push("Extra Espresso");
    }

    if (extraMatcha) {
        addons.push("Extra Matcha");
    }

    if (extraChocolate) {
        addons.push("Extra Chocolate");
    }


    const addonText =
        addons.length > 0
            ? addons.join(", ")
            : "";


    let sizeText = "";

    if (selectedSize === 8) {
        sizeText = "8oz";
    }

    else if (selectedSize === 12) {
        sizeText = "12oz";
    }

    else if (selectedSize === 16) {
        sizeText = "16oz";
    }

    else if (selectedSize === 22) {
        sizeText = "22oz";
    }


    const unitPrice =
        getSelectedProductUnitPrice();


    addCartItem({

        type: "drink",

        name: selectedProduct,

        category: selectedCategory,

        size: sizeText,

        choice: sizeText,

        addons: addons,

        addonsText: addonText,

        quantity: quantity,

        unitPrice: unitPrice,

        total:
            unitPrice * quantity

    });


    closeProduct();

    showOrderNotice();

}


// ============================================================
// SNACK DATA
// ============================================================

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

        ],

        flavors: []

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

        ],

        flavors: []

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

        ],

        flavors: []

    },


    japaneseSiomai: {

        name: "Japanese Siomai",

        category: "Snack Detour",

        choices: [],

        flavors: []

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

        ],

        flavors: []

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

        ],

        flavors: []

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

        ],

        flavors: []

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

        ],

        flavors: []

    }

};


// ============================================================
// OPEN SNACK BY KEY
// ============================================================

function openSnackByKey(key) {

    if (!isShopOpenForOrdering()) {
        return;
    }

    const snack =
        SNACKS[key];

    if (!snack) {

        console.error(
            "Snack key not found:",
            key
        );

        return;
    }


    if (
        !isMenuItemAvailable(
            snack.name,
            snack.category
        )
    ) {

        alert(
            `${snack.name} is currently unavailable.`
        );

        return;
    }


    openSnack(
        snack.name,
        snack.category,
        snack.choices,
        snack.flavors
    );

}


// ============================================================
// OPEN SNACK
//
// Supports both:
// openSnack(name, category, choices, flavors)
// AND:
// openSnack(name, category, "choice", choices)
// ============================================================

function openSnack(
    snackName,
    category,
    choicesOrType,
    flavorsOrChoices
) {

    if (!isShopOpenForOrdering()) {
        return;
    }


    selectedSnackName =
        snackName;

    selectedSnackCategory =
        category || "Snack Detour";


    snackQuantity =
        1;

    selectedSnackChoice =
        null;

    selectedSnackFlavor =
        "";


    // New Tube Ice format
    if (
        choicesOrType === "choice" &&
        Array.isArray(flavorsOrChoices)
    ) {

        snackChoices =
            flavorsOrChoices;

        snackFlavors =
            [];

    }

    // Normal format
    else {

        snackChoices =
            Array.isArray(choicesOrType)
                ? choicesOrType
                : [];

        snackFlavors =
            Array.isArray(flavorsOrChoices)
                ? flavorsOrChoices
                : [];

    }


    // Japanese Siomai special case
    if (
        selectedSnackName ===
        "Japanese Siomai" &&
        snackChoices.length === 0
    ) {

        snackChoices = [

            {
                name: "1 pc",
                price: 10
            }

        ];

    }


    renderSnackPopup();

    showPopup(
        "productOverlay",
        "snackPopupContent"
    );

}


// ============================================================
// RENDER SNACK POPUP
// ============================================================

function renderSnackPopup() {

    if ($("selectedSnack")) {

        $("selectedSnack").textContent =
            selectedSnackName;

    }

    if ($("selectedSnackCategory")) {

        $("selectedSnackCategory").textContent =
            selectedSnackCategory;

    }


    renderSnackChoices();

    renderSnackFlavors();

    updateSnackQuantityDisplay();

}


// ============================================================
// RENDER SNACK CHOICES
// ============================================================

function renderSnackChoices() {

    const container =
        $("snackChoiceButtons");

    if (!container) {
        return;
    }


    container.innerHTML = "";


    snackChoices.forEach(
        function (choice, index) {

            const button =
                document.createElement("button");

            button.type =
                "button";

            button.textContent =
                `${choice.name} - ₱${formatMoney(
                    choice.price
                )}`;

            button.onclick =
                function () {

                    selectedSnackChoice =
                        choice;

                    updateSnackChoiceButtons();

                };


            container.appendChild(
                button
            );

        }
    );

}


// ============================================================
// UPDATE SNACK CHOICE BUTTONS
// ============================================================

function updateSnackChoiceButtons() {

    const buttons =
        document.querySelectorAll(
            "#snackChoiceButtons button"
        );

    buttons.forEach(
        function (button, index) {

            const choice =
                snackChoices[index];

            button.classList.toggle(
                "selected",
                selectedSnackChoice === choice
            );

        }
    );

}


// ============================================================
// RENDER SNACK FLAVORS
// ============================================================

function renderSnackFlavors() {

    const wrapper =
        $("snackFlavors");

    const container =
        $("snackFlavorButtons");

    if (!wrapper || !container) {
        return;
    }


    container.innerHTML = "";


    if (
        !Array.isArray(snackFlavors) ||
        snackFlavors.length === 0
    ) {

        wrapper.style.display =
            "none";

        return;
    }


    wrapper.style.display =
        "block";


    snackFlavors.forEach(
        function (flavor) {

            const button =
                document.createElement("button");

            button.type =
                "button";

            button.textContent =
                flavor;

            button.onclick =
                function () {

                    selectedSnackFlavor =
                        flavor;

                    updateSnackFlavorButtons();

                };


            container.appendChild(
                button
            );

        }
    );

}


// ============================================================
// UPDATE SNACK FLAVOR BUTTONS
// ============================================================

function updateSnackFlavorButtons() {

    const buttons =
        document.querySelectorAll(
            "#snackFlavorButtons button"
        );

    buttons.forEach(
        function (button) {

            button.classList.toggle(
                "selected",
                button.textContent ===
                selectedSnackFlavor
            );

        }
    );

}


// ============================================================
// SNACK QUANTITY
// ============================================================

function changeSnackQuantity(delta) {

    delta =
        Number(delta) || 0;

    snackQuantity += delta;

    if (snackQuantity < 1) {
        snackQuantity = 1;
    }

    updateSnackQuantityDisplay();

}


// ============================================================
// SNACK QUANTITY DISPLAY
// ============================================================

function updateSnackQuantityDisplay() {

    const element =
        $("snackQuantity");

    if (element) {

        element.textContent =
            snackQuantity;

    }

}


// ============================================================
// ADD SNACK TO CART
// ============================================================

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


    const addons = [];

    if (selectedSnackFlavor) {
        addons.push(
            selectedSnackFlavor
        );
    }


    const addonText =
        addons.join(", ");


    const unitPrice =
        money(
            selectedSnackChoice.price
        );


    addCartItem({

        type: "snack",

        name: selectedSnackName,

        category:
            selectedSnackCategory,

        choice:
            selectedSnackChoice.name,

        size:
            selectedSnackChoice.name,

        flavor:
            selectedSnackFlavor,

        addons:
            addons,

        addonsText:
            addonText,

        quantity:
            snackQuantity,

        unitPrice:
            unitPrice,

        total:
            unitPrice * snackQuantity

    });


    closeSnack();

    showOrderNotice();

}


// ============================================================
// CLOSE SNACK
// ============================================================

function closeSnack() {

    const overlay =
        $("productOverlay");

    if (overlay) {
        overlay.style.display =
            "none";
    }

    const popup =
        $("snackPopupContent");

    if (popup) {
        popup.style.display =
            "none";
    }

}


// ============================================================
// MEAL DATA
// ============================================================

const MEALS = {

    chickenMeal: {

        name:
            "Chicken Rice Meal",

        category:
            "Pit Stop Plates",

        choices: [

            {
                name:
                    "1 pc Chicken",
                price:
                    50
            },

            {
                name:
                    "2 pcs Chicken",
                price:
                    80
            }

        ]

    },


    shanghaiMeal: {

        name:
            "Shanghai Rice Meal",

        category:
            "Pit Stop Plates",

        choices: [

            {
                name:
                    "4 pcs Shanghai",
                price:
                    50
            }

        ]

    },


    siomaiMeal: {

        name:
            "Siomai Rice Meal",

        category:
            "Pit Stop Plates",

        choices: [

            {
                name:
                    "6 pcs Steamed Siomai",
                price:
                    45
            }

        ]

    },


    hotdogMeal: {

        name:
            "Hotdog Rice Meal",

        category:
            "Pit Stop Plates",

        choices: [

            {
                name:
                    "2 pcs Hotdog",
                price:
                    50
            }

        ]

    },


    meatloafMeal: {

        name:
            "Meatloaf Rice Meal",

        category:
            "Pit Stop Plates",

        choices: [

            {
                name:
                    "3 pcs Meatloaf",
                price:
                    55
            }

        ]

    },


    longganisaMeal: {

        name:
            "Skinless Longganisa",

        category:
            "Pit Stop Plates",

        choices: [

            {
                name:
                    "2 pcs Skinless Longganisa",
                price:
                    55
            }

        ]

    }

};


// ============================================================
// OPEN MEAL BY KEY
// ============================================================

function openMealByKey(key) {

    if (!isShopOpenForOrdering()) {
        return;
    }


    const meal =
        MEALS[key];

    if (!meal) {

        console.error(
            "Meal key not found:",
            key
        );

        return;
    }


    if (
        !isMenuItemAvailable(
            meal.name,
            meal.category
        )
    ) {

        alert(
            `${meal.name} is currently unavailable.`
        );

        return;
    }


    selectedMealName =
        meal.name;

    selectedMealCategory =
        meal.category;

    mealChoices =
        meal.choices || [];

    mealQuantity =
        1;

    selectedMealChoice =
        null;

    selectedMealCoolerName =
        "None";

    selectedMealCoolerPrice =
        0;

    extraEgg =
        false;

    extraRice =
        false;


    renderMealPopup();

    showPopup(
        "productOverlay",
        "mealPopupContent"
    );

}


// ============================================================
// OLD COMPATIBILITY OPEN MEAL
// ============================================================

function openMeal(
    mealName,
    choices
) {

    selectedMealName =
        mealName;

    selectedMealCategory =
        "Pit Stop Plates";

    mealChoices =
        Array.isArray(choices)
            ? choices
            : [];

    mealQuantity =
        1;

    selectedMealChoice =
        null;

    selectedMealCoolerName =
        "None";

    selectedMealCoolerPrice =
        0;

    extraEgg =
        false;

    extraRice =
        false;


    renderMealPopup();

    showPopup(
        "productOverlay",
        "mealPopupContent"
    );

}


// ============================================================
// RENDER MEAL POPUP
// ============================================================

function renderMealPopup() {

    if ($("selectedMeal")) {

        $("selectedMeal").textContent =
            selectedMealName;

    }


    const container =
        $("mealChoiceButtons");

    if (container) {

        container.innerHTML =
            "";

        mealChoices.forEach(
            function (choice) {

                const button =
                    document.createElement("button");

                button.type =
                    "button";

                button.textContent =
                    `${choice.name} - ₱${formatMoney(
                        choice.price
                    )}`;

                button.onclick =
                    function () {

                        selectedMealChoice =
                            choice;

                        updateMealChoiceButtons();

                        updateMealTotal();

                    };


                container.appendChild(
                    button
                );

            }
        );

    }


    updateMealChoiceButtons();

    updateMealCoolerButtons();

    updateMealExtraButtons();

    updateMealQuantityDisplay();

    updateMealTotal();

}


// ============================================================
// UPDATE MEAL CHOICE BUTTONS
// ============================================================

function updateMealChoiceButtons() {

    const buttons =
        document.querySelectorAll(
            "#mealChoiceButtons button"
        );

    buttons.forEach(
        function (button, index) {

            button.classList.toggle(
                "selected",
                mealChoices[index] ===
                selectedMealChoice
            );

        }
    );

}


// ============================================================
// SELECT MEAL COOLER
// ============================================================

function selectMealCooler(
    name,
    price = 0
) {

    name =
        String(name || "None");


    if (
        name === "16oz" ||
        name === "Highway Cooler 16oz"
    ) {

        selectedMealCoolerName =
            "Highway Cooler 16oz";

        selectedMealCoolerPrice =
            35;

    }

    else if (
        name === "22oz" ||
        name === "Highway Cooler 22oz"
    ) {

        selectedMealCoolerName =
            "Highway Cooler 22oz";

        selectedMealCoolerPrice =
            55;

    }

    else {

        selectedMealCoolerName =
            "None";

        selectedMealCoolerPrice =
            0;

    }


    updateMealCoolerButtons();

    updateMealTotal();

}


// ============================================================
// UPDATE MEAL COOLER BUTTONS
// ============================================================

function updateMealCoolerButtons() {

    const noneButton =
        $("coolerNoneButton");

    const button16 =
        $("cooler16Button");

    const button22 =
        $("cooler22Button");


    if (noneButton) {

        noneButton.classList.toggle(
            "selected",
            selectedMealCoolerName ===
            "None"
        );

    }


    if (button16) {

        button16.classList.toggle(
            "selected",
            selectedMealCoolerName ===
            "Highway Cooler 16oz"
        );

    }


    if (button22) {

        button22.classList.toggle(
            "selected",
            selectedMealCoolerName ===
            "Highway Cooler 22oz"
        );

    }

}


// ============================================================
// TOGGLE EXTRA EGG
// ============================================================

function toggleExtraEgg() {

    extraEgg =
        !extraEgg;

    updateMealExtraButtons();

    updateMealTotal();

}


// ============================================================
// TOGGLE EXTRA RICE
// ============================================================

function toggleExtraRice() {

    extraRice =
        !extraRice;

    updateMealExtraButtons();

    updateMealTotal();

}


// ============================================================
// COMPATIBILITY TOGGLE MEAL EXTRA
// ============================================================

function toggleMealExtra(type) {

    if (type === "egg") {

        extraEgg =
            !extraEgg;

    }

    else if (type === "rice") {

        extraRice =
            !extraRice;

    }

    updateMealExtraButtons();

    updateMealTotal();

}


// ============================================================
// UPDATE MEAL EXTRA BUTTONS
// ============================================================

function updateMealExtraButtons() {

    const eggButton =
        $("extraEggButton");

    const riceButton =
        $("extraRiceButton");


    if (eggButton) {

        eggButton.classList.toggle(
            "selected",
            extraEgg
        );

        eggButton.textContent =
            extraEgg
                ? "✓ Extra Egg +₱10"
                : "Extra Egg +₱10";

    }


    if (riceButton) {

        riceButton.classList.toggle(
            "selected",
            extraRice
        );

        riceButton.textContent =
            extraRice
                ? "✓ Extra Rice +₱15"
                : "Extra Rice +₱15";

    }

}


// ============================================================
// MEAL QUANTITY
// ============================================================

function changeMealQuantity(delta) {

    delta =
        Number(delta) || 0;

    mealQuantity += delta;

    if (mealQuantity < 1) {
        mealQuantity = 1;
    }

    updateMealQuantityDisplay();

    updateMealTotal();

}


// ============================================================
// MEAL QUANTITY DISPLAY
// ============================================================

function updateMealQuantityDisplay() {

    const element =
        $("mealQuantity");

    if (element) {

        element.textContent =
            mealQuantity;

    }

}


// ============================================================
// GET MEAL UNIT PRICE
// ============================================================

function getMealUnitPrice() {

    let total = 0;


    if (selectedMealChoice) {

        total +=
            money(
                selectedMealChoice.price
            );

    }


    total +=
        money(
            selectedMealCoolerPrice
        );


    if (extraEgg) {
        total += EXTRA_EGG_PRICE;
    }


    if (extraRice) {
        total += EXTRA_RICE_PRICE;
    }


    return total;

}


// ============================================================
// MEAL TOTAL
// ============================================================

function getMealTotal() {

    return (
        getMealUnitPrice()
        *
        mealQuantity
    );

}


// ============================================================
// UPDATE MEAL TOTAL
// ============================================================

function updateMealTotal() {

    // Current HTML does not contain a dedicated
    // mealTotal element. This function is kept safe
    // for compatibility.

    const total =
        getMealTotal();

    const totalElement =
        $("mealTotal");

    if (totalElement) {

        totalElement.textContent =
            `₱${formatMoney(total)}`;

    }

}


// ============================================================
// ADD MEAL TO CART
// ============================================================

function addMealToCart() {

    if (!selectedMealChoice) {

        alert(
            "Please choose a meal option first."
        );

        return;
    }


    const addons = [];


    if (
        selectedMealCoolerName !==
        "None"
    ) {

        addons.push(
            selectedMealCoolerName
        );

    }


    if (extraEgg) {

        addons.push(
            "Extra Egg"
        );

    }


    if (extraRice) {

        addons.push(
            "Extra Rice"
        );

    }


    const addonText =
        addons.join(", ");


    const unitPrice =
        getMealUnitPrice();


    addCartItem({

        type: "meal",

        name:
            selectedMealName,

        category:
            selectedMealCategory,

        choice:
            selectedMealChoice.name,

        size:
            selectedMealChoice.name,

        addons:
            addons,

        addonsText:
            addonText,

        quantity:
            mealQuantity,

        unitPrice:
            unitPrice,

        total:
            unitPrice * mealQuantity

    });


    closeMeal();

    showOrderNotice();

}


// ============================================================
// CLOSE MEAL
// ============================================================

function closeMeal() {

    const overlay =
        $("productOverlay");

    if (overlay) {

        overlay.style.display =
            "none";

    }


    const popup =
        $("mealPopupContent");

    if (popup) {

        popup.style.display =
            "none";

    }

}


// ============================================================
// CART ITEM KEY
// ============================================================

function getCartItemKey(item) {

    return [

        item.type || "",

        item.name || "",

        item.choice || "",

        item.size || "",

        item.addonsText || "",

        item.flavor || ""

    ].join("|");

}


// ============================================================
// ADD CART ITEM
// ============================================================

function addCartItem(item) {

    const newItem = {

        ...item,

        quantity:
            Math.max(
                1,
                Number(item.quantity) || 1
            ),

        unitPrice:
            money(item.unitPrice),

        total:
            money(item.unitPrice)
            *
            Math.max(
                1,
                Number(item.quantity) || 1
            )

    };


    const newKey =
        getCartItemKey(newItem);


    const existingIndex =
        cart.findIndex(
            function (cartItem) {

                return (
                    getCartItemKey(cartItem)
                    ===
                    newKey
                );

            }
        );


    if (existingIndex !== -1) {

        cart[existingIndex].quantity +=
            newItem.quantity;

        cart[existingIndex].total =
            cart[existingIndex].unitPrice
            *
            cart[existingIndex].quantity;

    }

    else {

        cart.push(
            newItem
        );

    }


    updateCart();

}


// ============================================================
// UPDATE CART
// ============================================================

function updateCart() {

    const container =
        $("sideCartItems");

    const countElement =
        $("cartCount");

    const totalElement =
        $("sideCartTotal");

    if (!container) {
        return;
    }


    if (cart.length === 0) {

        container.innerHTML =
            "<p>Your cart is empty.</p>";

        if (countElement) {
            countElement.textContent =
                "0 items";
        }

        if (totalElement) {
            totalElement.textContent =
                "0";
        }

        updateCheckoutButton();

        return;
    }


    let total =
        0;

    let itemCount =
        0;


    container.innerHTML =
        "";


    cart.forEach(
        function (item, index) {

            const quantity =
                Math.max(
                    1,
                    Number(item.quantity) || 1
                );

            const itemTotal =
                money(
                    item.unitPrice
                )
                *
                quantity;


            item.total =
                itemTotal;


            total +=
                itemTotal;

            itemCount +=
                quantity;


            const wrapper =
                document.createElement(
                    "div"
                );

            wrapper.className =
                "cart-item";


            const name =
                document.createElement(
                    "strong"
                );

            name.textContent =
                item.name;


            wrapper.appendChild(
                name
            );


            const details =
                document.createElement(
                    "div"
                );


            let detailsText =
                "";


            if (item.choice) {

                detailsText +=
                    item.choice;

            }

            else if (item.size) {

                detailsText +=
                    item.size;

            }


            if (item.flavor) {

                if (detailsText) {
                    detailsText += " • ";
                }

                detailsText +=
                    item.flavor;

            }


            if (item.addonsText) {

                if (detailsText) {
                    detailsText += " • ";
                }

                detailsText +=
                    item.addonsText;

            }


            details.textContent =
                detailsText;


            wrapper.appendChild(
                details
            );


            const price =
                document.createElement(
                    "div"
                );


            price.textContent =
                `₱${formatMoney(
                    item.unitPrice
                )} x ${quantity}`;


            wrapper.appendChild(
                price
            );


            const controls =
                document.createElement(
                    "div"
                );

            controls.className =
                "cart-controls";


            const minus =
                document.createElement(
                    "button"
                );

            minus.type =
                "button";

            minus.textContent =
                "−";

            minus.onclick =
                function () {

                    changeCartQuantity(
                        index,
                        -1
                    );

                };


            const plus =
                document.createElement(
                    "button"
                );

            plus.type =
                "button";

            plus.textContent =
                "+";

            plus.onclick =
                function () {

                    changeCartQuantity(
                        index,
                        1
                    );

                };


            const remove =
                document.createElement(
                    "button"
                );

            remove.type =
                "button";

            remove.textContent =
                "Remove";

            remove.onclick =
                function () {

                    removeCartItem(
                        index
                    );

                };


            controls.appendChild(
                minus
            );

            controls.appendChild(
                plus
            );

            controls.appendChild(
                remove
            );


            wrapper.appendChild(
                controls
            );


            const lineTotal =
                document.createElement(
                    "div"
                );

            lineTotal.textContent =
                `₱${formatMoney(
                    itemTotal
                )}`;

            wrapper.appendChild(
                lineTotal
            );


            container.appendChild(
                wrapper
            );

        }
    );


    if (countElement) {

        countElement.textContent =
            `${itemCount} ${
                itemCount === 1
                    ? "item"
                    : "items"
            }`;

    }


    if (totalElement) {

        totalElement.textContent =
            formatMoney(total);

    }


    updateCheckoutButton();

}


// ============================================================
// CHANGE CART QUANTITY
// ============================================================

function changeCartQuantity(
    index,
    delta
) {

    if (!cart[index]) {
        return;
    }


    cart[index].quantity +=
        Number(delta) || 0;


    if (cart[index].quantity <= 0) {

        cart.splice(
            index,
            1
        );

    }

    else {

        cart[index].total =
            cart[index].unitPrice
            *
            cart[index].quantity;

    }


    updateCart();

}


// ============================================================
// REMOVE CART ITEM
// ============================================================

function removeCartItem(index) {

    if (
        index < 0 ||
        index >= cart.length
    ) {
        return;
    }


    cart.splice(
        index,
        1
    );


    updateCart();

}


// ============================================================
// CART TOTAL
// ============================================================

function getCartSubtotal() {

    return cart.reduce(
        function (sum, item) {

            return (
                sum
                +
                (
                    money(item.unitPrice)
                    *
                    Number(item.quantity || 0)
                )
            );

        },
        0
    );

}


// ============================================================
// UPDATE CHECKOUT BUTTON
// ============================================================

function updateCheckoutButton() {

    const button =
        $("checkoutButton");

    if (!button) {
        return;
    }


    button.disabled =
        cart.length === 0;

}


// ============================================================
// ORDER NOTICE
// ============================================================

function showOrderNotice() {

    const notice =
        $("orderNotice");

    if (!notice) {
        return;
    }


    notice.style.display =
        "block";


    setTimeout(
        function () {

            notice.style.display =
                "none";

        },
        1800
    );

}


// ============================================================
// CHECKOUT
// ============================================================

function openCheckout() {

    if (!isShopOpenForOrdering()) {
        return;
    }


    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;
    }


    const overlay =
        $("checkoutOverlay");

    const checkout =
        $("checkoutPopup");

    const confirmation =
        $("orderConfirmationPopup");


    if (overlay) {

        overlay.style.display =
            "flex";

    }


    if (checkout) {

        checkout.style.display =
            "block";

    }


    if (confirmation) {

        confirmation.style.display =
            "none";

    }


    selectOrderType(
        selectedOrderType
    );

    selectPaymentMethod(
        selectedPaymentMethodValue
    );


    updateCheckoutSummary();

}


// ============================================================
// CLOSE CHECKOUT
// ============================================================

function closeCheckout() {

    const overlay =
        $("checkoutOverlay");

    if (overlay) {

        overlay.style.display =
            "none";

    }

}


// ============================================================
// SELECT ORDER TYPE
// ============================================================

function selectOrderType(type) {

    if (
        type !== "delivery" &&
        type !== "pickup"
    ) {

        type =
            "delivery";

    }


    selectedOrderType =
        type;


    const deliveryButton =
        $("deliveryButton");

    const pickupButton =
        $("pickupButton");


    if (deliveryButton) {

        deliveryButton.classList.toggle(
            "selected",
            type === "delivery"
        );

    }


    if (pickupButton) {

        pickupButton.classList.toggle(
            "selected",
            type === "pickup"
        );

    }


    const deliveryDetails =
        $("deliveryDetails");

    const pickupDetails =
        $("pickupDetails");


    if (deliveryDetails) {

        deliveryDetails.style.display =
            type === "delivery"
                ? "block"
                : "none";

    }


    if (pickupDetails) {

        pickupDetails.style.display =
            type === "pickup"
                ? "block"
                : "none";

    }


    updateCheckoutSummary();

}


// ============================================================
// SELECT PAYMENT METHOD
// ============================================================

function selectPaymentMethod(method) {

    if (
        method !== "cash" &&
        method !== "gcash"
    ) {

        method =
            "cash";

    }


    selectedPaymentMethodValue =
        method;


    const cashButton =
        $("cashButton");

    const gcashButton =
        $("gcashButton");


    if (cashButton) {

        cashButton.classList.toggle(
            "selected",
            method === "cash"
        );

    }


    if (gcashButton) {

        gcashButton.classList.toggle(
            "selected",
            method === "gcash"
        );

    }


    const gcashDetails =
        $("gcashDetails");


    if (gcashDetails) {

        gcashDetails.style.display =
            method === "gcash"
                ? "block"
                : "none";

    }


    updateCheckoutSummary();

}


// ============================================================
// CHECKOUT TOTAL
// ============================================================

function getCheckoutTotal() {

    let total =
        getCartSubtotal();


    if (
        selectedOrderType ===
        "delivery"
    ) {

        total +=
            DELIVERY_FEE;

    }


    return total;

}


// ============================================================
// UPDATE CHECKOUT SUMMARY
// ============================================================

function updateCheckoutSummary() {

    const summary =
        $("checkoutSummary");

    const totalElement =
        $("checkoutTotal");


    if (!summary) {
        return;
    }


    summary.innerHTML =
        "";


    cart.forEach(
        function (item) {

            const row =
                document.createElement(
                    "div"
                );


            const quantity =
                Number(
                    item.quantity || 0
                );


            let description =
                item.name;


            if (item.choice) {

                description +=
                    ` - ${item.choice}`;

            }

            else if (item.size) {

                description +=
                    ` - ${item.size}`;

            }


            if (item.flavor) {

                description +=
                    ` - ${item.flavor}`;

            }


            if (item.addonsText) {

                description +=
                    ` - ${item.addonsText}`;

            }


            row.textContent =
                `${description} x ${quantity} - ₱${formatMoney(
                    item.unitPrice * quantity
                )}`;


            summary.appendChild(
                row
            );

        }
    );


    const subtotal =
        document.createElement(
            "div"
        );


    subtotal.textContent =
        `Subtotal: ₱${formatMoney(
            getCartSubtotal()
        )}`;


    summary.appendChild(
        subtotal
    );


    if (
        selectedOrderType ===
        "delivery"
    ) {

        const delivery =
            document.createElement(
                "div"
            );


        delivery.textContent =
            `Delivery Fee: ₱${formatMoney(
                DELIVERY_FEE
            )}`;


        summary.appendChild(
            delivery
        );

    }


    if (totalElement) {

        totalElement.textContent =
            formatMoney(
                getCheckoutTotal()
            );

    }

}


// ============================================================
// VALIDATE CHECKOUT
// ============================================================

function validateCheckout() {

    const name =
        $("customerName")?.value.trim() || "";

    const phone =
        $("customerPhone")?.value.trim() || "";


    if (!name) {

        alert(
            "Please enter your name."
        );

        return false;

    }


    if (!phone) {

        alert(
            "Please enter your phone number."
        );

        return false;

    }


    if (
        selectedOrderType ===
        "delivery"
    ) {

        const address =
            $("deliveryAddress")?.value.trim() || "";


        if (!address) {

            alert(
                "Please enter your delivery address."
            );

            return false;

        }

    }


    if (
        selectedOrderType ===
        "pickup"
    ) {

        const pickupTime =
            $("pickupTime")?.value || "";


        if (!pickupTime) {

            alert(
                "Please choose a preferred pickup time."
            );

            return false;

        }

    }


    if (
        selectedPaymentMethodValue ===
        "gcash"
    ) {

        const reference =
            $("paymentReference")?.value.trim() || "";


        if (!reference) {

            alert(
                "Please enter your GCash reference number."
            );

            return false;

        }

    }


    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return false;

    }


    return true;

}


// ============================================================
// GENERATE ORDER NUMBER
// ============================================================

function generateOrderNumber() {

    const now =
        new Date();

    const datePart =
        String(
            now.getFullYear()
        ).slice(-2)
        +
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        )
        +
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    return (
        "HC-"
        +
        datePart
        +
        "-"
        +
        random
    );

}


// ============================================================
// BUILD ORDER ITEMS TEXT
// ============================================================

function buildOrderItemsText() {

    return cart.map(
        function (item) {

            let text =
                `${item.name}`;


            if (item.choice) {

                text +=
                    ` - ${item.choice}`;

            }

            else if (item.size) {

                text +=
                    ` - ${item.size}`;

            }


            if (item.flavor) {

                text +=
                    ` - ${item.flavor}`;

            }


            if (item.addonsText) {

                text +=
                    ` - ${item.addonsText}`;

            }


            text +=
                ` x ${item.quantity}`;


            text +=
                ` = ₱${formatMoney(
                    item.unitPrice *
                    item.quantity
                )}`;


            return text;

        }
    ).join("\n");

}


// ============================================================
// BUILD ORDER OBJECT
// ============================================================

function buildOrderData() {

    const name =
        $("customerName")?.value.trim() || "";

    const phone =
        $("customerPhone")?.value.trim() || "";

    const address =
        $("deliveryAddress")?.value.trim() || "";

    const pickupTime =
        $("pickupTime")?.value || "";

    const reference =
        $("paymentReference")?.value.trim() || "";

    const notes =
        $("orderNotes")?.value.trim() || "";


    const subtotal =
        getCartSubtotal();


    const deliveryFee =
        selectedOrderType === "delivery"
            ? DELIVERY_FEE
            : 0;


    const total =
        subtotal +
        deliveryFee;


    return {

        order_number:
            currentOrderNumber,

        customer_name:
            name,

        customer_phone:
            phone,

        order_type:
            selectedOrderType,

        delivery_address:
            address,

        pickup_time:
            pickupTime,

        payment_method:
            selectedPaymentMethodValue,

        payment_reference:
            reference,

        items:
            cart,

        items_text:
            buildOrderItemsText(),

        subtotal:
            subtotal,

        delivery_fee:
            deliveryFee,

        total:
            total,

        order_notes:
            notes,

        status:
            "Pending"

    };

}


// ============================================================
// SAVE ORDER TO SUPABASE
// ============================================================

async function saveOrderToSupabase(
    orderData
) {

    if (!supabaseClient) {

        console.warn(
            "Supabase is not connected. Order will continue locally."
        );

        return {
            success: false,
            error: "Supabase unavailable"
        };

    }


    try {

        const result =
            await supabaseClient
                .from("orders")
                .insert([
                    orderData
                ]);


        if (result.error) {

            console.error(
                "Supabase order insert error:",
                result.error
            );

            return {
                success: false,
                error:
                    result.error
            };

        }


        return {
            success: true,
            data:
                result.data
        };


    } catch (error) {

        console.error(
            "Order save error:",
            error
        );

        return {
            success: false,
            error:
                error
        };

    }

}


// ============================================================
// SEND ORDER EMAIL
// ============================================================

function sendOrderEmail(
    orderData
) {

    try {

        const form =
            $("orderEmailForm");

        if (!form) {
            return;
        }


        if ($("emailSubject")) {

            $("emailSubject").value =
                `HIGHWAY CAFE ORDER ${orderData.order_number}`;

        }


        if ($("emailOrderNumber")) {

            $("emailOrderNumber").value =
                orderData.order_number;

        }


        if ($("emailCustomerName")) {

            $("emailCustomerName").value =
                orderData.customer_name;

        }


        if ($("emailCustomerPhone")) {

            $("emailCustomerPhone").value =
                orderData.customer_phone;

        }


        if ($("emailOrderType")) {

            $("emailOrderType").value =
                orderData.order_type;

        }


        if ($("emailDeliveryAddress")) {

            $("emailDeliveryAddress").value =
                orderData.delivery_address;

        }


        if ($("emailPickupTime")) {

            $("emailPickupTime").value =
                orderData.pickup_time;

        }


        if ($("emailPaymentMethod")) {

            $("emailPaymentMethod").value =
                orderData.payment_method;

        }


        if ($("emailPaymentReference")) {

            $("emailPaymentReference").value =
                orderData.payment_reference;

        }


        if ($("emailItems")) {

            $("emailItems").value =
                orderData.items_text;

        }


        if ($("emailNotes")) {

            $("emailNotes").value =
                orderData.order_notes;

        }


        if ($("emailTotal")) {

            $("emailTotal").value =
                `₱${formatMoney(
                    orderData.total
                )}`;

        }


        form.submit();


    } catch (error) {

        console.warn(
            "Email form could not be submitted:",
            error
        );

    }

}


// ============================================================
// PLACE ORDER
// ============================================================

async function placeOrder() {

    if (!validateCheckout()) {
        return;
    }


    const button =
        $("placeOrderButton");


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "Processing...";

    }


    try {

        currentOrderNumber =
            generateOrderNumber();


        const orderData =
            buildOrderData();


        // Save to Supabase
        await saveOrderToSupabase(
            orderData
        );


        // Send email
        sendOrderEmail(
            orderData
        );


        showOrderConfirmation(
            orderData
        );


    } catch (error) {

        console.error(
            "Place order error:",
            error
        );

        alert(
            "There was a problem processing your order. Please try again."
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


// ============================================================
// SHOW ORDER CONFIRMATION
// ============================================================

function showOrderConfirmation(
    orderData
) {

    const checkout =
        $("checkoutPopup");

    const confirmation =
        $("orderConfirmationPopup");


    if (checkout) {

        checkout.style.display =
            "none";

    }


    if (confirmation) {

        confirmation.style.display =
            "block";

    }


    if ($("confirmationOrderNumber")) {

        $("confirmationOrderNumber").textContent =
            orderData.order_number;

    }


    if ($("confirmationTotal")) {

        $("confirmationTotal").textContent =
            `₱${formatMoney(
                orderData.total
            )}`;

    }


    if ($("confirmationOrderSummary")) {

        let summary =
            "";


        summary +=
            `Customer: ${orderData.customer_name}\n`;

        summary +=
            `Order Type: ${orderData.order_type}\n`;

        summary +=
            `Payment: ${orderData.payment_method}\n\n`;


        summary +=
            orderData.items_text;


        if (
            orderData.order_type ===
            "delivery"
        ) {

            summary +=
                `\n\nDelivery Fee: ₱${formatMoney(
                    orderData.delivery_fee
                )}`;

        }


        summary +=
            `\n\nTOTAL: ₱${formatMoney(
                orderData.total
            )}`;


        $("confirmationOrderSummary").textContent =
            summary;

    }

}


// ============================================================
// FINISH ORDER
// ============================================================

function finishOrder() {

    cart = [];

    currentOrderNumber =
        "";


    updateCart();


    // Reset customer information

    if ($("customerName")) {
        $("customerName").value = "";
    }

    if ($("customerPhone")) {
        $("customerPhone").value = "";
    }

    if ($("deliveryAddress")) {
        $("deliveryAddress").value = "";
    }

    if ($("pickupTime")) {
        $("pickupTime").value = "";
    }

    if ($("paymentReference")) {
        $("paymentReference").value = "";
    }

    if ($("orderNotes")) {
        $("orderNotes").value = "";
    }


    const confirmation =
        $("orderConfirmationPopup");

    const checkout =
        $("checkoutPopup");

    const overlay =
        $("checkoutOverlay");


    if (confirmation) {

        confirmation.style.display =
            "none";

    }


    if (checkout) {

        checkout.style.display =
            "none";

    }


    if (overlay) {

        overlay.style.display =
            "none";

    }


    // Return to top

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ============================================================
// GLOBAL FUNCTION EXPORTS
//
// VERY IMPORTANT:
// The HTML uses onclick="functionName()"
// so every function must be available on window.
// ============================================================

window.startOrder =
    startOrder;

window.openDrink =
    openDrink;

window.closeProduct =
    closeProduct;

window.selectSize =
    selectSize;

window.toggleEspresso =
    toggleEspresso;

window.toggleMatcha =
    toggleMatcha;

window.toggleChocolate =
    toggleChocolate;

window.changeQuantity =
    changeQuantity;

window.addSelectedProduct =
    addSelectedProduct;


window.openSnackByKey =
    openSnackByKey;

window.openSnack =
    openSnack;

window.closeSnack =
    closeSnack;

window.changeSnackQuantity =
    changeSnackQuantity;

window.addSnackToCart =
    addSnackToCart;


window.openMealByKey =
    openMealByKey;

window.openMeal =
    openMeal;

window.closeMeal =
    closeMeal;

window.selectMealChoice =
    selectMealChoice;

window.selectMealCooler =
    selectMealCooler;

window.toggleExtraEgg =
    toggleExtraEgg;

window.toggleExtraRice =
    toggleExtraRice;

window.toggleMealExtra =
    toggleMealExtra;

window.changeMealQuantity =
    changeMealQuantity;

window.addMealToCart =
    addMealToCart;


window.openCheckout =
    openCheckout;

window.closeCheckout =
    closeCheckout;

window.selectOrderType =
    selectOrderType;

window.selectPaymentMethod =
    selectPaymentMethod;

window.placeOrder =
    placeOrder;

window.finishOrder =
    finishOrder;


// ============================================================
// END OF SCRIPT
// ============================================================

console.log(
    "HIGHWAY CAFE script.js loaded successfully."
);
