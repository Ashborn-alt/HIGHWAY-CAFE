// =====================================================
// HIGHWAY CAFE
// COMPLETE CUSTOMER ORDERING SYSTEM
// =====================================================


// =====================================================
// SUPABASE CONFIGURATION
// =====================================================

const SUPABASE_URL =
    "https://qfnjegsbyxxqsdaelqqa.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_ttu1AyOaylp3J4x7iTqaNg_1VLOdHoE";

let supabaseClient = null;
let supabaseReadyPromise = null;


// =====================================================
// PRICES
// =====================================================

const DELIVERY_FEE = 20;

const ESPRESSO_PRICE = 30;
const MATCHA_PRICE = 30;
const CHOCOLATE_PRICE = 30;

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

let snackChoices = [];
let snackFlavors = [];

let selectedSnackChoice = null;
let selectedSnackFlavor = "";

let snackQuantity = 1;


// =====================================================
// MEAL STATE
// =====================================================

let selectedMealName = "";
let selectedMealCategory = "Pit Stop Plates";

let mealChoices = [];
let selectedMealChoice = null;

let mealQuantity = 1;

let selectedMealCoolerName = "None";
let selectedMealCoolerPrice = 0;

let extraEgg = false;
let extraRice = false;


// =====================================================
// CHECKOUT STATE
// =====================================================

let selectedOrderType = "delivery";
let selectedPaymentMethodValue = "cash";

let currentOrderNumber = "";


// =====================================================
// SHOP / MENU STATE
// =====================================================

let shopIsOpen = true;
let menuAvailability = {};


// =====================================================
// BASIC HELPERS
// =====================================================

function $(id) {
    return document.getElementById(id);
}


function money(value) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return number;
}


function formatMoney(value) {
    return money(value).toFixed(2);
}


// =====================================================
// SAFE TEXT HELPER
// =====================================================

function safeText(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value);
}


// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    initializeSupabase();

    initializeCustomerPage();

});


function initializeCustomerPage() {

    hideAllPopups();

    selectOrderType("delivery");

    selectPaymentMethod("cash");

    updateCart();

    setTimeout(function () {

        loadShopStatusForCustomer();

        loadMenuAvailabilityForCustomer();

    }, 500);

}


// =====================================================
// SUPABASE INITIALIZATION
// =====================================================

function loadSupabaseLibrary() {

    return new Promise(function (resolve, reject) {

        if (window.supabase) {

            resolve();

            return;
        }


        const existingScript =
            document.querySelector(
                'script[src*="supabase"]'
            );


        if (existingScript) {

            existingScript.addEventListener(
                "load",
                function () {

                    if (window.supabase) {
                        resolve();
                    } else {
                        reject(
                            new Error(
                                "Supabase library loaded but was not found."
                            )
                        );
                    }

                }
            );


            existingScript.addEventListener(
                "error",
                function () {

                    reject(
                        new Error(
                            "Unable to load Supabase library."
                        )
                    );

                }
            );


            return;
        }


        const script = document.createElement("script");

        script.src =
            "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

        script.async = true;


        script.onload = function () {

            if (window.supabase) {

                resolve();

            } else {

                reject(
                    new Error(
                        "Supabase library was not found."
                    )
                );

            }

        };


        script.onerror = function () {

            reject(
                new Error(
                    "Unable to load Supabase library."
                )
            );

        };


        document.head.appendChild(script);

    });

}


async function initializeSupabase() {

    if (supabaseClient) {
        return supabaseClient;
    }


    if (supabaseReadyPromise) {
        return supabaseReadyPromise;
    }


    supabaseReadyPromise = (async function () {

        try {

            await loadSupabaseLibrary();


            supabaseClient =
                window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_KEY
                );


            console.log(
                "HIGHWAY CAFE: Supabase initialized."
            );


            return supabaseClient;

        } catch (error) {

            console.error(
                "HIGHWAY CAFE: Supabase initialization failed:",
                error
            );


            supabaseClient = null;

            return null;

        }

    })();


    return supabaseReadyPromise;
}


// =====================================================
// SHOP STATUS
// =====================================================

async function loadShopStatusForCustomer() {

    const client = await initializeSupabase();

    if (!client) {
        return;
    }


    try {

        const result =
            await client
                .from("shop_settings")
                .select("*")
                .limit(1)
                .maybeSingle();


        if (result.error) {

            console.warn(
                "Unable to load shop status:",
                result.error
            );

            return;
        }


        if (result.data) {

            const data = result.data;


            if (
                typeof data.is_open !== "undefined"
            ) {

                shopIsOpen =
                    Boolean(data.is_open);

            }


            if (
                typeof data.shop_is_open !== "undefined"
            ) {

                shopIsOpen =
                    Boolean(data.shop_is_open);

            }


            if (
                typeof data.status !== "undefined"
            ) {

                const status =
                    String(data.status)
                        .toLowerCase();


                if (
                    status === "open" ||
                    status === "opened"
                ) {

                    shopIsOpen = true;

                }


                if (
                    status === "closed" ||
                    status === "close"
                ) {

                    shopIsOpen = false;

                }

            }


            updateCustomerShopDisplay();

        }

    } catch (error) {

        console.error(
            "Shop status error:",
            error
        );

    }

}


function updateCustomerShopDisplay() {

    const startButton =
        document.querySelector(
            'button[onclick="startOrder()"]'
        );


    if (!startButton) {
        return;
    }


    if (shopIsOpen) {

        startButton.disabled = false;

        startButton.textContent =
            "Order Now";

        startButton.style.opacity = "1";

        startButton.style.cursor =
            "pointer";

    } else {

        startButton.disabled = true;

        startButton.textContent =
            "Shop Closed";

        startButton.style.opacity = "0.6";

        startButton.style.cursor =
            "not-allowed";

    }

}


function isShopOpenForOrdering() {

    return shopIsOpen !== false;

}


// =====================================================
// START ORDER
// =====================================================

function startOrder() {

    if (!isShopOpenForOrdering()) {

        alert(
            "Sorry, HIGHWAY CAFE is currently closed."
        );

        return;
    }


    const menu =
        $("menu");


    if (menu) {

        menu.style.display = "block";


        menu.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// =====================================================
// MENU AVAILABILITY
// =====================================================

async function loadMenuAvailabilityForCustomer() {

    const client = await initializeSupabase();

    if (!client) {
        return;
    }


    try {

        const result =
            await client
                .from("menu_availability")
                .select("*");


        if (result.error) {

            console.warn(
                "Unable to load menu availability:",
                result.error
            );

            return;
        }


        menuAvailability = {};


        if (Array.isArray(result.data)) {

            result.data.forEach(function (item) {

                const key =
                    makeMenuKey(
                        item.category,
                        item.item_name ||
                        item.name ||
                        item.product_name
                    );


                if (key) {

                    menuAvailability[key] =
                        item.is_available !== false;

                }

            });

        }


        applyCustomerAvailability();

    } catch (error) {

        console.error(
            "Menu availability error:",
            error
        );

    }

}


function makeMenuKey(category, name) {

    return (
        safeText(category)
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ") +
        "|" +
        safeText(name)
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ")
    );

}


function isMenuItemAvailable(category, name) {

    const key =
        makeMenuKey(category, name);


    if (
        Object.prototype.hasOwnProperty.call(
            menuAvailability,
            key
        )
    ) {

        return menuAvailability[key] !== false;

    }


    return true;

}


function applyCustomerAvailability() {

    const buttons =
        document.querySelectorAll(
            ".menu-item"
        );


    buttons.forEach(function (button) {

        button.disabled = false;

        button.style.opacity = "1";

        button.style.cursor =
            "pointer";

    });

}


async function refreshCustomerAvailability() {

    await loadShopStatusForCustomer();

    await loadMenuAvailabilityForCustomer();

}


// =====================================================
// POPUP HELPERS
// =====================================================

function hideAllPopups() {

    const ids = [
        "productPopup",
        "snackPopup",
        "mealPopup",
        "checkoutPopup",
        "orderConfirmationPopup"
    ];


    ids.forEach(function (id) {

        const element = $(id);

        if (element) {
            element.style.display = "none";
        }

    });


    const overlay =
        $("productOverlay");


    if (overlay) {
        overlay.style.display = "none";
    }


    const checkoutOverlay =
        $("checkoutOverlay");


    if (checkoutOverlay) {
        checkoutOverlay.style.display = "none";
    }

}


function showPopup(overlayId, popupId) {

    hideAllPopups();


    const overlay = $(overlayId);

    const popup = $(popupId);


    if (overlay) {

        overlay.style.display =
            "flex";

    }


    if (popup) {

        popup.style.display =
            "block";

    }

}


// =====================================================
// DRINK DATA
// =====================================================

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
        addons: ["espresso", "chocolate"]
    },

    dirtyMatcha: {
        name: "Dirty Matcha",
        category: "Iced Coffee",
        p16: 85,
        p22: 100,
        addons: ["espresso", "matcha"]
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


    // -------------------------------
    // HOT COFFEE
    // -------------------------------

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


    // -------------------------------
    // SODA SERIES
    // -------------------------------

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


    // -------------------------------
    // MILK SERIES
    // -------------------------------

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


// =====================================================
// OPEN DRINK
// =====================================================

function openDrink(key) {

    if (!isShopOpenForOrdering()) {

        alert(
            "Sorry, HIGHWAY CAFE is currently closed."
        );

        return;
    }


    const drink = DRINKS[key];


    if (!drink) {

        console.error(
            "Drink not found:",
            key
        );

        return;
    }


    if (
        !isMenuItemAvailable(
            drink.category,
            drink.name
        )
    ) {

        alert(
            drink.name +
            " is currently unavailable."
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


    extraEspresso = false;
    extraMatcha = false;
    extraChocolate = false;

    quantity = 1;


    if (drink.category === "Hot Coffee") {

        selectedSize = 8;

    } else if (
        drink.category === "Soda Series"
    ) {

        selectedSize = 12;

    } else {

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


// =====================================================
// PRODUCT POPUP
// =====================================================

function updateProductPopup() {

    const product =
        $("selectedProduct");

    const category =
        $("selectedCategory");


    if (product) {
        product.textContent =
            selectedProduct;
    }


    if (category) {
        category.textContent =
            selectedCategory;
    }


    updateSizeButtons();

    updateAddonButtons();

    updateQuantityDisplay();

    updateSelectedProductPrice();

}


function updateSizeButtons() {

    const button12 =
        $("size12Button");

    const button16 =
        $("size16Button");

    const button22 =
        $("size22Button");

    const title =
        $("sizeTitle");


    if (selectedCategory === "Hot Coffee") {

        if (button12) {
            button12.style.display = "none";
        }

        if (button16) {
            button16.style.display = "none";
        }

        if (button22) {
            button22.style.display = "none";
        }

        if (title) {
            title.textContent =
                "Size: 8oz";
        }

        return;
    }


    if (button12) {

        button12.style.display =
            price12 > 0
                ? "inline-block"
                : "none";

    }


    if (button16) {

        button16.style.display =
            price16 > 0
                ? "inline-block"
                : "none";

    }


    if (button22) {

        button22.style.display =
            price22 > 0
                ? "inline-block"
                : "none";

    }


    if (title) {
        title.textContent =
            "Choose Size";
    }


    updateSizeSelectionOutline();

}


function updateSizeSelectionOutline() {

    const buttons = [
        $("size12Button"),
        $("size16Button"),
        $("size22Button")
    ];


    buttons.forEach(function (button) {

        if (!button) {
            return;
        }


        button.classList.remove(
            "selected-size"
        );


        button.style.outline = "";

        button.style.outlineOffset = "";

        button.style.fontWeight = "";


        const buttonSize =
            Number(
                button.dataset.size ||
                (
                    button.id === "size12Button"
                        ? 12
                        : button.id === "size16Button"
                            ? 16
                            : 22
                )
            );


        if (
            buttonSize ===
            Number(selectedSize)
        ) {

            button.classList.add(
                "selected-size"
            );


            // Force the selection outline
            // even if CSS is not loaded correctly.

            button.style.outline =
                "3px solid #8B4513";

            button.style.outlineOffset =
                "3px";

            button.style.fontWeight =
                "bold";

        }

    });

}


function selectSize(size) {

    const number =
        Number(size);


    if (![8, 12, 16, 22].includes(number)) {
        return;
    }


    if (
        number === 8 &&
        selectedCategory !== "Hot Coffee"
    ) {
        return;
    }


    if (
        number === 12 &&
        price12 <= 0
    ) {
        return;
    }


    if (
        number === 16 &&
        price16 <= 0
    ) {
        return;
    }


    if (
        number === 22 &&
        price22 <= 0
    ) {
        return;
    }


    selectedSize = number;


    updateSizeSelectionOutline();

    updateSelectedProductPrice();

}


// =====================================================
// PRODUCT PRICE
// =====================================================

function getSelectedProductBasePrice() {

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


function getSelectedProductUnitPrice() {

    return (
        getSelectedProductBasePrice() +
        getProductAddonTotal()
    );

}


function getSelectedProductTotal() {

    return (
        getSelectedProductUnitPrice() *
        quantity
    );

}


function updateSelectedProductPrice() {

    const button =
        $("addToCartButton");


    if (!button) {
        return;
    }


    button.textContent =
        "Add to Cart - ₱" +
        formatMoney(
            getSelectedProductTotal()
        );

}


// =====================================================
// PRODUCT ADDONS
// =====================================================

function updateAddonButtons() {

    const espressoOption =
        $("espressoOption");

    const espressoButton =
        $("espressoButton");

    const matchaOption =
        $("matchaOption");

    const matchaButton =
        $("matchaButton");

    const chocolateOption =
        $("chocolateOption");

    const chocolateButton =
        $("chocolateButton");


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


    updateAddonButton(
        espressoButton,
        extraEspresso,
        "Extra Espresso +₱30"
    );


    updateAddonButton(
        matchaButton,
        extraMatcha,
        "Extra Matcha +₱30"
    );


    updateAddonButton(
        chocolateButton,
        extraChocolate,
        "Extra Chocolate +₱30"
    );

}


function updateAddonButton(
    button,
    selected,
    defaultText
) {

    if (!button) {
        return;
    }


    button.classList.remove(
        "selected-size"
    );


    button.style.outline = "";

    button.style.outlineOffset = "";

    button.style.fontWeight = "";


    if (selected) {

        button.classList.add(
            "selected-size"
        );


        button.style.outline =
            "3px solid #8B4513";

        button.style.outlineOffset =
            "3px";

        button.style.fontWeight =
            "bold";

        button.textContent =
            "✓ " + defaultText;

    } else {

        button.textContent =
            defaultText;

    }

}


function toggleEspresso() {

    if (!espressoAvailable) {
        return;
    }


    extraEspresso =
        !extraEspresso;


    updateAddonButtons();

    updateSelectedProductPrice();

}


function toggleMatcha() {

    if (!matchaAvailable) {
        return;
    }


    extraMatcha =
        !extraMatcha;


    updateAddonButtons();

    updateSelectedProductPrice();

}


function toggleChocolate() {

    if (!chocolateAvailable) {
        return;
    }


    extraChocolate =
        !extraChocolate;


    updateAddonButtons();

    updateSelectedProductPrice();

}


// =====================================================
// PRODUCT QUANTITY
// =====================================================

function changeQuantity(amount) {

    quantity +=
        Number(amount);


    if (quantity < 1) {
        quantity = 1;
    }


    if (quantity > 99) {
        quantity = 99;
    }


    updateQuantityDisplay();

    updateSelectedProductPrice();

}


function updateQuantityDisplay() {

    const element =
        $("quantity");


    if (element) {

        element.textContent =
            String(quantity);

    }

}


// =====================================================
// ADD DRINK TO CART
// =====================================================

function addSelectedProduct() {

    const unitPrice =
        getSelectedProductUnitPrice();


    if (unitPrice <= 0) {

        alert(
            "Please select a valid product size."
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


    let sizeText = "";


    if (selectedSize === 8) {
        sizeText = "8oz";
    }

    if (selectedSize === 12) {
        sizeText = "12oz";
    }

    if (selectedSize === 16) {
        sizeText = "16oz";
    }

    if (selectedSize === 22) {
        sizeText = "22oz";
    }


    const item = {

        type: "drink",

        name: selectedProduct,

        category: selectedCategory,

        size: sizeText,

        choice: sizeText,

        addons: addons,

        addonsText:
            addons.join(", "),

        quantity: quantity,

        unitPrice: unitPrice,

        total:
            unitPrice * quantity

    };


    addCartItem(item);

    closeProduct();

    showOrderNotice();

}


// =====================================================
// CLOSE PRODUCT
// =====================================================

function closeProduct() {

    const popup =
        $("productPopup");

    if (popup) {
        popup.style.display =
            "none";
    }


    const overlay =
        $("productOverlay");

    if (overlay) {
        overlay.style.display =
            "none";
    }

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


    // =================================================
    // TUBE ICE
    // =================================================

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


// =====================================================
// OPEN SNACK BY KEY
// =====================================================

function openSnackByKey(key) {

    if (!isShopOpenForOrdering()) {

        alert(
            "Sorry, HIGHWAY CAFE is currently closed."
        );

        return;
    }


    const snack =
        SNACKS[key];


    if (!snack) {

        console.error(
            "Snack not found:",
            key
        );

        return;
    }


    if (
        !isMenuItemAvailable(
            snack.category,
            snack.name
        )
    ) {

        alert(
            snack.name +
            " is currently unavailable."
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


// =====================================================
// OPEN SNACK
// Supports BOTH:
// openSnack(name, category, choices, flavors)
// and
// openSnack(name, category, "choice", choices)
// =====================================================

function openSnack(
    snackName,
    category,
    choicesOrType,
    flavorsOrChoices
) {

    if (!isShopOpenForOrdering()) {

        alert(
            "Sorry, HIGHWAY CAFE is currently closed."
        );

        return;
    }


    // -----------------------------------------------
    // Availability check
    // -----------------------------------------------

    if (
        !isMenuItemAvailable(
            category,
            snackName
        )
    ) {

        alert(
            snackName +
            " is currently unavailable."
        );

        return;
    }


    selectedSnackName =
        snackName;

    selectedSnackCategory =
        category;


    // -----------------------------------------------
    // Support Tube Ice's current HTML:
    //
    // openSnack(
    //   'Tube Ice',
    //   'Snack Detour',
    //   'choice',
    //   [{ name:'1 pc', price:15 }]
    // )
    // -----------------------------------------------

    if (
        choicesOrType === "choice" &&
        Array.isArray(flavorsOrChoices)
    ) {

        snackChoices =
            flavorsOrChoices.slice();

        snackFlavors = [];

    } else {

        snackChoices =
            Array.isArray(
                choicesOrType
            )
                ? choicesOrType.slice()
                : [];


        snackFlavors =
            Array.isArray(
                flavorsOrChoices
            )
                ? flavorsOrChoices.slice()
                : [];

    }


    // -----------------------------------------------
    // Japanese Siomai special case
    // -----------------------------------------------

    if (
        snackName === "Japanese Siomai" &&
        snackChoices.length === 0
    ) {

        snackChoices = [
            {
                name: "1 pc",
                price: 10
            }
        ];

    }


    selectedSnackChoice =
        null;

    selectedSnackFlavor =
        "";

    snackQuantity = 1;


    renderSnackPopup();

    showPopup(
        "productOverlay",
        "snackPopupContent"
    );

}


// =====================================================
// SNACK POPUP
// =====================================================

function renderSnackPopup() {

    const name =
        $("selectedSnack");

    const category =
        $("selectedSnackCategory");


    if (name) {

        name.textContent =
            selectedSnackName;

    }


    if (category) {

        category.textContent =
            selectedSnackCategory;

    }


    renderSnackChoices();

    renderSnackFlavors();

    updateSnackQuantityDisplay();

}


// =====================================================
// SNACK CHOICES
// =====================================================

function renderSnackChoices() {

    const container =
        $("snackChoiceButtons");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (snackChoices.length === 0) {

        container.style.display =
            "none";

        return;
    }


    container.style.display =
        "flex";


    snackChoices.forEach(
        function (choice, index) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.textContent =
                choice.name +
                " - ₱" +
                formatMoney(
                    choice.price
                );


            button.onclick =
                function () {

                    selectedSnackChoice =
                        choice;

                    updateSnackChoiceButtons();

                };


            button.dataset.index =
                String(index);


            container.appendChild(
                button
            );

        }
    );


    updateSnackChoiceButtons();

}


// =====================================================
// SNACK CHOICE OUTLINE
// =====================================================

function updateSnackChoiceButtons() {

    const container =
        $("snackChoiceButtons");


    if (!container) {
        return;
    }


    const buttons =
        container.querySelectorAll(
            "button"
        );


    buttons.forEach(
        function (button, index) {

            const isSelected =
                selectedSnackChoice ===
                snackChoices[index];


            button.classList.toggle(
                "selected-size",
                isSelected
            );


            button.style.outline =
                isSelected
                    ? "3px solid #8B4513"
                    : "";

            button.style.outlineOffset =
                isSelected
                    ? "3px"
                    : "";

            button.style.fontWeight =
                isSelected
                    ? "bold"
                    : "";

        }
    );

}


// =====================================================
// SNACK FLAVORS
// =====================================================

function renderSnackFlavors() {

    const container =
        $("snackFlavors");

    const buttonsContainer =
        $("snackFlavorButtons");


    if (!container) {
        return;
    }


    if (
        !Array.isArray(snackFlavors) ||
        snackFlavors.length === 0
    ) {

        container.style.display =
            "none";

        if (buttonsContainer) {
            buttonsContainer.innerHTML =
                "";
        }

        return;
    }


    container.style.display =
        "block";


    if (!buttonsContainer) {
        return;
    }


    buttonsContainer.innerHTML =
        "";


    snackFlavors.forEach(
        function (flavor) {

            const button =
                document.createElement(
                    "button"
                );


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


            buttonsContainer.appendChild(
                button
            );

        }
    );


    updateSnackFlavorButtons();

}


// =====================================================
// SNACK FLAVOR OUTLINE
// =====================================================

function updateSnackFlavorButtons() {

    const container =
        $("snackFlavorButtons");


    if (!container) {
        return;
    }


    const buttons =
        container.querySelectorAll(
            "button"
        );


    buttons.forEach(
        function (button) {

            const selected =
                button.textContent ===
                selectedSnackFlavor;


            button.classList.toggle(
                "selected-size",
                selected
            );


            button.style.outline =
                selected
                    ? "3px solid #8B4513"
                    : "";

            button.style.outlineOffset =
                selected
                    ? "3px"
                    : "";

            button.style.fontWeight =
                selected
                    ? "bold"
                    : "";

        }
    );

}


// =====================================================
// SNACK QUANTITY
// =====================================================

function changeSnackQuantity(amount) {

    snackQuantity +=
        Number(amount);


    if (snackQuantity < 1) {
        snackQuantity = 1;
    }


    if (snackQuantity > 99) {
        snackQuantity = 99;
    }


    updateSnackQuantityDisplay();

}


function updateSnackQuantityDisplay() {

    const element =
        $("snackQuantity");


    if (element) {

        element.textContent =
            String(snackQuantity);

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
        snackFlavors.length > 0 &&
        !selectedSnackFlavor
    ) {

        alert(
            "Please choose a flavor first."
        );

        return;
    }


    const unitPrice =
        money(
            selectedSnackChoice.price
        );


    const addons = [];


    if (selectedSnackFlavor) {

        addons.push(
            selectedSnackFlavor
        );

    }


    const item = {

        type: "snack",

        name: selectedSnackName,

        category: selectedSnackCategory,

        choice:
            selectedSnackChoice.name,

        size:
            selectedSnackChoice.name,

        flavor:
            selectedSnackFlavor,

        addons: addons,

        addonsText:
            addons.join(", "),

        quantity:
            snackQuantity,

        unitPrice:
            unitPrice,

        total:
            unitPrice *
            snackQuantity

    };


    addCartItem(item);

    closeSnack();

    showOrderNotice();

}


// =====================================================
// CLOSE SNACK
// =====================================================

function closeSnack() {

    const popup =
        $("snackPopupContent");


    if (popup) {

        popup.style.display =
            "none";

    }


    const overlay =
        $("productOverlay");


    if (overlay) {

        overlay.style.display =
            "none";

    }

}


// =====================================================
// MEAL DATA
// =====================================================

const MEALS = {

    chickenMeal: {

        name: "Chicken Rice Meal",

        category: "Pit Stop Plates",

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

        category: "Pit Stop Plates",

        choices: [

            {
                name: "4 pcs Shanghai",
                price: 50
            }

        ]

    },


    siomaiMeal: {

        name: "Siomai Rice Meal",

        category: "Pit Stop Plates",

        choices: [

            {
                name: "6 pcs Steamed Siomai",
                price: 45
            }

        ]

    },


    hotdogMeal: {

        name: "Hotdog Rice Meal",

        category: "Pit Stop Plates",

        choices: [

            {
                name: "2 pcs Hotdog",
                price: 50
            }

        ]

    },


    meatloafMeal: {

        name: "Meatloaf Rice Meal",

        category: "Pit Stop Plates",

        choices: [

            {
                name: "3 pcs Meatloaf",
                price: 55
            }

        ]

    },


    longganisaMeal: {

        name: "Skinless Longganisa",

        category: "Pit Stop Plates",

        choices: [

            {
                name: "2 pcs Skinless Longganisa",
                price: 55
            }

        ]

    }

};


// =====================================================
// OPEN MEAL BY KEY
// =====================================================

function openMealByKey(key) {

    if (!isShopOpenForOrdering()) {

        alert(
            "Sorry, HIGHWAY CAFE is currently closed."
        );

        return;
    }


    const meal =
        MEALS[key];


    if (!meal) {

        console.error(
            "Meal not found:",
            key
        );

        return;
    }


    if (
        !isMenuItemAvailable(
            meal.category,
            meal.name
        )
    ) {

        alert(
            meal.name +
            " is currently unavailable."
        );

        return;
    }


    selectedMealName =
        meal.name;

    selectedMealCategory =
        meal.category;


    mealChoices =
        meal.choices.slice();


    selectedMealChoice =
        null;


    mealQuantity = 1;


    selectedMealCoolerName =
        "None";

    selectedMealCoolerPrice =
        0;


    extraEgg = false;

    extraRice = false;


    renderMealPopup();


    showPopup(
        "productOverlay",
        "mealPopupContent"
    );

}


// =====================================================
// COMPATIBILITY MEAL FUNCTION
// =====================================================

function openMeal(
    mealName,
    choices
) {

    if (!isShopOpenForOrdering()) {

        alert(
            "Sorry, HIGHWAY CAFE is currently closed."
        );

        return;
    }


    selectedMealName =
        mealName;

    selectedMealCategory =
        "Pit Stop Plates";


    mealChoices =
        Array.isArray(choices)
            ? choices.slice()
            : [];


    selectedMealChoice =
        null;


    mealQuantity = 1;


    selectedMealCoolerName =
        "None";

    selectedMealCoolerPrice =
        0;


    extraEgg = false;

    extraRice = false;


    renderMealPopup();


    showPopup(
        "productOverlay",
        "mealPopupContent"
    );

}


// =====================================================
// MEAL POPUP
// =====================================================

function renderMealPopup() {

    const name =
        $("selectedMeal");


    if (name) {

        name.textContent =
            selectedMealName;

    }


    renderMealChoices();

    updateMealCoolerButtons();

    updateMealExtraButtons();

    updateMealQuantityDisplay();

    updateMealTotal();

}


// =====================================================
// MEAL CHOICES
// =====================================================

function renderMealChoices() {

    const container =
        $("mealChoiceButtons");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    mealChoices.forEach(
        function (choice, index) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.textContent =
                choice.name +
                " - ₱" +
                formatMoney(
                    choice.price
                );


            button.dataset.index =
                String(index);


            button.onclick =
                function () {

                    selectMealChoice(index);

                };


            container.appendChild(
                button
            );

        }
    );


    updateMealChoiceButtons();

}


// =====================================================
// FIXED MEAL CHOICE FUNCTION
// =====================================================

function selectMealChoice(indexOrChoice) {

    if (
        typeof indexOrChoice ===
        "number"
    ) {

        if (
            mealChoices[indexOrChoice]
        ) {

            selectedMealChoice =
                mealChoices[indexOrChoice];

        }

    } else if (
        typeof indexOrChoice ===
        "string"
    ) {

        const index =
            Number(indexOrChoice);


        if (
            Number.isInteger(index) &&
            mealChoices[index]
        ) {

            selectedMealChoice =
                mealChoices[index];

        }

    } else if (
        indexOrChoice &&
        typeof indexOrChoice ===
        "object"
    ) {

        selectedMealChoice =
            indexOrChoice;

    }


    updateMealChoiceButtons();

    updateMealTotal();

}


// =====================================================
// MEAL CHOICE OUTLINE
// =====================================================

function updateMealChoiceButtons() {

    const container =
        $("mealChoiceButtons");


    if (!container) {
        return;
    }


    const buttons =
        container.querySelectorAll(
            "button"
        );


    buttons.forEach(
        function (button, index) {

            const selected =
                selectedMealChoice ===
                mealChoices[index];


            button.classList.toggle(
                "selected-size",
                selected
            );


            button.style.outline =
                selected
                    ? "3px solid #8B4513"
                    : "";

            button.style.outlineOffset =
                selected
                    ? "3px"
                    : "";

            button.style.fontWeight =
                selected
                    ? "bold"
                    : "";

        }
    );

}


// =====================================================
// MEAL COOLER
// =====================================================

function selectMealCooler(
    name,
    price = 0
) {

    const value =
        safeText(name)
            .trim();


    if (
        value === "16oz" ||
        value ===
        "Highway Cooler 16oz"
    ) {

        selectedMealCoolerName =
            "Highway Cooler 16oz";

        selectedMealCoolerPrice =
            35;

    } else if (
        value === "22oz" ||
        value ===
        "Highway Cooler 22oz"
    ) {

        selectedMealCoolerName =
            "Highway Cooler 22oz";

        selectedMealCoolerPrice =
            55;

    } else {

        selectedMealCoolerName =
            "None";

        selectedMealCoolerPrice =
            0;

    }


    updateMealCoolerButtons();

    updateMealTotal();

}


function updateMealCoolerButtons() {

    const noneButton =
        $("coolerNoneButton");

    const button16 =
        $("cooler16Button");

    const button22 =
        $("cooler22Button");


    const buttons = [
        {
            element: noneButton,
            selected:
                selectedMealCoolerName ===
                "None"
        },
        {
            element: button16,
            selected:
                selectedMealCoolerName ===
                "Highway Cooler 16oz"
        },
        {
            element: button22,
            selected:
                selectedMealCoolerName ===
                "Highway Cooler 22oz"
        }
    ];


    buttons.forEach(
        function (item) {

            if (!item.element) {
                return;
            }


            item.element.classList.toggle(
                "selected-size",
                item.selected
            );


            item.element.style.outline =
                item.selected
                    ? "3px solid #8B4513"
                    : "";

            item.element.style.outlineOffset =
                item.selected
                    ? "3px"
                    : "";

            item.element.style.fontWeight =
                item.selected
                    ? "bold"
                    : "";

        }
    );

}


// =====================================================
// MEAL EXTRAS
// =====================================================

function toggleExtraEgg() {

    extraEgg =
        !extraEgg;


    updateMealExtraButtons();

    updateMealTotal();

}


function toggleExtraRice() {

    extraRice =
        !extraRice;


    updateMealExtraButtons();

    updateMealTotal();

}


function toggleMealExtra(type) {

    if (type === "egg") {

        toggleExtraEgg();

        return;
    }


    if (type === "rice") {

        toggleExtraRice();

    }

}


function updateMealExtraButtons() {

    const eggButton =
        $("extraEggButton");

    const riceButton =
        $("extraRiceButton");


    updateAddonButton(
        eggButton,
        extraEgg,
        "Extra Egg +₱10"
    );


    updateAddonButton(
        riceButton,
        extraRice,
        "Extra Rice +₱15"
    );

}


// =====================================================
// MEAL QUANTITY
// =====================================================

function changeMealQuantity(amount) {

    mealQuantity +=
        Number(amount);


    if (mealQuantity < 1) {
        mealQuantity = 1;
    }


    if (mealQuantity > 99) {
        mealQuantity = 99;
    }


    updateMealQuantityDisplay();

    updateMealTotal();

}


function updateMealQuantityDisplay() {

    const element =
        $("mealQuantity");


    if (element) {

        element.textContent =
            String(mealQuantity);

    }

}


// =====================================================
// MEAL PRICE
// =====================================================

function getMealUnitPrice() {

    if (!selectedMealChoice) {
        return 0;
    }


    let price =
        money(
            selectedMealChoice.price
        );


    if (extraEgg) {

        price +=
            EXTRA_EGG_PRICE;

    }


    if (extraRice) {

        price +=
            EXTRA_RICE_PRICE;

    }


    price +=
        money(
            selectedMealCoolerPrice
        );


    return price;

}


function getMealTotal() {

    return (
        getMealUnitPrice() *
        mealQuantity
    );

}


function updateMealTotal() {

    const total =
        $("mealTotal");


    const button =
        $("addMealToCartButton");


    if (total) {

        total.textContent =
            "₱" +
            formatMoney(
                getMealTotal()
            );

    }


    if (button) {

        button.textContent =
            "Add to Cart - ₱" +
            formatMoney(
                getMealTotal()
            );

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


    const unitPrice =
        getMealUnitPrice();


    if (unitPrice <= 0) {

        alert(
            "Unable to calculate meal price."
        );

        return;
    }


    const addons = [];


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


    if (
        selectedMealCoolerName !==
        "None"
    ) {

        addons.push(
            selectedMealCoolerName
        );

    }


    const item = {

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
            addons.join(", "),

        quantity:
            mealQuantity,

        unitPrice:
            unitPrice,

        total:
            unitPrice *
            mealQuantity

    };


    addCartItem(item);

    closeMeal();

    showOrderNotice();

}


// =====================================================
// CLOSE MEAL
// =====================================================

function closeMeal() {

    const popup =
        $("mealPopupContent");


    if (popup) {

        popup.style.display =
            "none";

    }


    const overlay =
        $("productOverlay");


    if (overlay) {

        overlay.style.display =
            "none";

    }

}


// =====================================================
// CART KEY
// =====================================================

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


// =====================================================
// ADD ITEM TO CART
// =====================================================

function addCartItem(item) {

    item.quantity =
        Math.max(
            1,
            Number(item.quantity) || 1
        );


    item.unitPrice =
        money(item.unitPrice);


    item.total =
        item.unitPrice *
        item.quantity;


    const newKey =
        getCartItemKey(item);


    const existingIndex =
        cart.findIndex(
            function (cartItem) {

                return (
                    getCartItemKey(
                        cartItem
                    ) === newKey
                );

            }
        );


    if (existingIndex >= 0) {

        cart[existingIndex].quantity +=
            item.quantity;


        cart[existingIndex].total =
            cart[existingIndex].unitPrice *
            cart[existingIndex].quantity;

    } else {

        cart.push(item);

    }


    updateCart();

}


// =====================================================
// UPDATE CART
// =====================================================

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
            "Your cart is empty.";


        if (countElement) {

            countElement.textContent =
                "0 items";

        }


        if (totalElement) {

            totalElement.textContent =
                "₱0.00";

        }


        updateCheckoutButton();

        return;
    }


    container.innerHTML =
        "";


    let itemCount = 0;

    let cartTotal = 0;


    cart.forEach(
        function (item, index) {

            itemCount +=
                Number(item.quantity) || 0;


            const unitPrice =
                money(
                    item.unitPrice
                );


            const quantity =
                Math.max(
                    1,
                    Number(item.quantity) || 1
                );


            const lineTotal =
                unitPrice *
                quantity;


            cartTotal +=
                lineTotal;


            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "cart-item";


            const details = [];


            if (item.choice) {

                details.push(
                    item.choice
                );

            } else if (
                item.size
            ) {

                details.push(
                    item.size
                );

            }


            if (item.flavor) {

                details.push(
                    item.flavor
                );

            }


            if (item.addonsText) {

                details.push(
                    item.addonsText
                );

            }


            wrapper.innerHTML = `

                <div class="cart-item-name">
                    ${safeText(item.name)}
                </div>

                <div class="cart-item-details">
                    ${safeText(details.join(" • "))}
                </div>

                <div class="cart-item-price">
                    ₱${formatMoney(unitPrice)}
                    x ${quantity}
                </div>

                <div class="cart-item-controls">

                    <button
                        type="button"
                        onclick="changeCartQuantity(${index}, -1)"
                    >
                        −
                    </button>

                    <span>
                        ${quantity}
                    </span>

                    <button
                        type="button"
                        onclick="changeCartQuantity(${index}, 1)"
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

                <div class="cart-item-total">
                    ₱${formatMoney(lineTotal)}
                </div>

            `;


            container.appendChild(
                wrapper
            );

        }
    );


    if (countElement) {

        countElement.textContent =
            itemCount +
            (
                itemCount === 1
                    ? " item"
                    : " items"
            );

    }


    if (totalElement) {

        totalElement.textContent =
            "₱" +
            formatMoney(
                cartTotal
            );

    }


    updateCheckoutButton();

}


// =====================================================
// CART QUANTITY
// =====================================================

function changeCartQuantity(
    index,
    delta
) {

    if (!cart[index]) {
        return;
    }


    cart[index].quantity +=
        Number(delta);


    if (
        cart[index].quantity <= 0
    ) {

        cart.splice(
            index,
            1
        );

    } else {

        cart[index].total =
            cart[index].unitPrice *
            cart[index].quantity;

    }


    updateCart();

}


// =====================================================
// REMOVE CART ITEM
// =====================================================

function removeCartItem(index) {

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
// CART SUBTOTAL
// =====================================================

function getCartSubtotal() {

    return cart.reduce(
        function (total, item) {

            return (
                total +
                (
                    money(item.unitPrice) *
                    (
                        Number(item.quantity) || 0
                    )
                )
            );

        },
        0
    );

}


// =====================================================
// CHECKOUT BUTTON
// =====================================================

function updateCheckoutButton() {

    const button =
        $("checkoutButton");


    if (!button) {
        return;
    }


    button.disabled =
        cart.length === 0;


    button.style.opacity =
        cart.length === 0
            ? "0.5"
            : "1";


    button.style.cursor =
        cart.length === 0
            ? "not-allowed"
            : "pointer";

}


// =====================================================
// ORDER NOTICE
// =====================================================

function showOrderNotice() {

    const notice =
        $("orderNotice");


    if (!notice) {
        return;
    }


    notice.textContent =
        "✓ Order added to cart!";


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


// =====================================================
// CHECKOUT
// =====================================================

function openCheckout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;
    }


    updateCheckoutSummary();

    selectOrderType(
        selectedOrderType
    );

    selectPaymentMethod(
        selectedPaymentMethodValue
    );


    const overlay =
        $("checkoutOverlay");

    const popup =
        $("checkoutPopup");


    if (overlay) {

        overlay.style.display =
            "flex";

    }


    if (popup) {

        popup.style.display =
            "block";

    }

}


function closeCheckout() {

    const overlay =
        $("checkoutOverlay");


    const popup =
        $("checkoutPopup");


    if (overlay) {

        overlay.style.display =
            "none";

    }


    if (popup) {

        popup.style.display =
            "none";

    }

}


// =====================================================
// ORDER TYPE
// =====================================================

function selectOrderType(type) {

    if (
        type !== "delivery" &&
        type !== "pickup"
    ) {

        type = "delivery";

    }


    selectedOrderType =
        type;


    const deliveryButton =
        $("deliveryButton");

    const pickupButton =
        $("pickupButton");

    const deliveryDetails =
        $("deliveryDetails");

    const pickupDetails =
        $("pickupDetails");


    setSelectionButton(
        deliveryButton,
        type === "delivery"
    );


    setSelectionButton(
        pickupButton,
        type === "pickup"
    );


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


// =====================================================
// PAYMENT METHOD
// =====================================================

function selectPaymentMethod(method) {

    if (
        method !== "cash" &&
        method !== "gcash"
    ) {

        method = "cash";

    }


    selectedPaymentMethodValue =
        method;


    const cashButton =
        $("cashButton");

    const gcashButton =
        $("gcashButton");

    const gcashDetails =
        $("gcashDetails");


    setSelectionButton(
        cashButton,
        method === "cash"
    );


    setSelectionButton(
        gcashButton,
        method === "gcash"
    );


    if (gcashDetails) {

        gcashDetails.style.display =
            method === "gcash"
                ? "block"
                : "none";

    }


    updateCheckoutSummary();

}


// =====================================================
// GENERIC SELECTION BUTTON
// =====================================================

function setSelectionButton(
    button,
    selected
) {

    if (!button) {
        return;
    }


    button.classList.toggle(
        "selected-size",
        selected
    );


    button.style.outline =
        selected
            ? "3px solid #8B4513"
            : "";

    button.style.outlineOffset =
        selected
            ? "3px"
            : "";

    button.style.fontWeight =
        selected
            ? "bold"
            : "";

}


// =====================================================
// CHECKOUT TOTAL
// =====================================================

function getCheckoutTotal() {

    const subtotal =
        getCartSubtotal();


    const deliveryFee =
        selectedOrderType ===
        "delivery"
            ? DELIVERY_FEE
            : 0;


    return (
        subtotal +
        deliveryFee
    );

}


// =====================================================
// CHECKOUT SUMMARY
// =====================================================

function updateCheckoutSummary() {

    const summary =
        $("checkoutSummary");

    const total =
        $("checkoutTotal");


    if (!summary && !total) {
        return;
    }


    const subtotal =
        getCartSubtotal();


    const deliveryFee =
        selectedOrderType ===
        "delivery"
            ? DELIVERY_FEE
            : 0;


    const grandTotal =
        subtotal +
        deliveryFee;


    if (summary) {

        summary.innerHTML = `

            <div>
                <strong>Subtotal:</strong>
                ₱${formatMoney(subtotal)}
            </div>

            <div>
                <strong>Delivery Fee:</strong>
                ₱${formatMoney(deliveryFee)}
            </div>

            <div>
                <strong>Total:</strong>
                ₱${formatMoney(grandTotal)}
            </div>

        `;

    }


    if (total) {

        total.textContent =
            "₱" +
            formatMoney(
                grandTotal
            );

    }

}


// =====================================================
// CHECKOUT VALIDATION
// =====================================================

function validateCheckout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return false;
    }


    const customerName =
        $("customerName");


    const customerPhone =
        $("customerPhone");


    if (
        !customerName ||
        !customerName.value.trim()
    ) {

        alert(
            "Please enter your name."
        );

        if (customerName) {
            customerName.focus();
        }

        return false;
    }


    if (
        !customerPhone ||
        !customerPhone.value.trim()
    ) {

        alert(
            "Please enter your phone number."
        );

        if (customerPhone) {
            customerPhone.focus();
        }

        return false;
    }


    if (
        selectedOrderType ===
        "delivery"
    ) {

        const address =
            $("deliveryAddress");


        if (
            !address ||
            !address.value.trim()
        ) {

            alert(
                "Please enter your delivery address."
            );

            if (address) {
                address.focus();
            }

            return false;
        }

    }


    if (
        selectedOrderType ===
        "pickup"
    ) {

        const pickupTime =
            $("pickupTime");


        if (
            !pickupTime ||
            !pickupTime.value
        ) {

            alert(
                "Please select a pickup time."
            );

            if (pickupTime) {
                pickupTime.focus();
            }

            return false;
        }

    }


    if (
        selectedPaymentMethodValue ===
        "gcash"
    ) {

        const reference =
            $("paymentReference");


        if (
            !reference ||
            !reference.value.trim()
        ) {

            alert(
                "Please enter your GCash reference number."
            );

            if (reference) {
                reference.focus();
            }

            return false;
        }

    }


    return true;

}


// =====================================================
// ORDER NUMBER
// =====================================================

function generateOrderNumber() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            now.getDate()
        ).padStart(2, "0");


    const random =
        Math.floor(
            1000 +
            Math.random() *
            9000
        );


    return (
        "HC-" +
        year +
        month +
        day +
        "-" +
        random
    );

}


// =====================================================
// ORDER ITEMS TEXT
// =====================================================

function buildOrderItemsText() {

    return cart.map(
        function (item) {

            const details = [];


            if (item.choice) {

                details.push(
                    item.choice
                );

            } else if (
                item.size
            ) {

                details.push(
                    item.size
                );

            }


            if (item.flavor) {

                details.push(
                    item.flavor
                );

            }


            if (item.addonsText) {

                details.push(
                    item.addonsText
                );

            }


            const detailText =
                details.length > 0
                    ? " (" +
                      details.join(", ") +
                      ")"
                    : "";


            return (
                item.name +
                detailText +
                " x " +
                item.quantity +
                " = ₱" +
                formatMoney(
                    money(item.unitPrice) *
                    Number(item.quantity)
                )
            );

        }
    ).join("\n");

}


// =====================================================
// BUILD ORDER DATA
// =====================================================

function buildOrderData() {

    const customerName =
        $("customerName");


    const customerPhone =
        $("customerPhone");


    const deliveryAddress =
        $("deliveryAddress");


    const pickupTime =
        $("pickupTime");


    const paymentReference =
        $("paymentReference");


    const orderNotes =
        $("orderNotes");


    const subtotal =
        getCartSubtotal();


    const deliveryFee =
        selectedOrderType ===
        "delivery"
            ? DELIVERY_FEE
            : 0;


    const total =
        subtotal +
        deliveryFee;


    return {

        order_number:
            currentOrderNumber,

        customer_name:
            customerName
                ? customerName.value.trim()
                : "",

        customer_phone:
            customerPhone
                ? customerPhone.value.trim()
                : "",

        order_type:
            selectedOrderType,

        delivery_address:
            selectedOrderType ===
            "delivery" &&
            deliveryAddress
                ? deliveryAddress.value.trim()
                : "",

        pickup_time:
            selectedOrderType ===
            "pickup" &&
            pickupTime
                ? pickupTime.value
                : "",

        payment_method:
            selectedPaymentMethodValue,

        payment_reference:
            selectedPaymentMethodValue ===
            "gcash" &&
            paymentReference
                ? paymentReference.value.trim()
                : "",

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
            orderNotes
                ? orderNotes.value.trim()
                : "",

        status:
            "Pending"

    };

}


// =====================================================
// SAVE ORDER TO SUPABASE
// =====================================================

async function saveOrderToSupabase(
    orderData
) {

    const client =
        await initializeSupabase();


    if (!client) {

        console.error(
            "Supabase is unavailable."
        );


        return {
            success: false,
            error:
                new Error(
                    "Supabase is unavailable."
                )
        };

    }


    try {

        console.log(
            "Saving order to Supabase:",
            orderData
        );


        const result =
            await client
                .from("orders")
                .insert([
                    orderData
                ])
                .select();


        if (result.error) {

            console.error(
                "SUPABASE ORDER INSERT ERROR:",
                result.error
            );


            console.error(
                "Supabase error message:",
                result.error.message
            );


            console.error(
                "Supabase error details:",
                result.error.details
            );


            console.error(
                "Supabase error hint:",
                result.error.hint
            );


            return {
                success: false,
                error: result.error
            };

        }


        console.log(
            "ORDER SAVED TO SUPABASE:",
            result.data
        );


        return {
            success: true,
            data: result.data
        };

    } catch (error) {

        console.error(
            "Unexpected Supabase save error:",
            error
        );


        return {
            success: false,
            error: error
        };

    }

}


// =====================================================
// SEND ORDER EMAIL
// =====================================================

function sendOrderEmail(
    orderData
) {

    const form =
        $("orderEmailForm");


    if (!form) {

        console.error(
            "orderEmailForm not found."
        );

        return;

    }


    const fields = {

        emailSubject:
            "HIGHWAY CAFE Order " +
            orderData.order_number,

        emailOrderNumber:
            orderData.order_number,

        emailCustomerName:
            orderData.customer_name,

        emailCustomerPhone:
            orderData.customer_phone,

        emailOrderType:
            orderData.order_type,

        emailDeliveryAddress:
            orderData.delivery_address,

        emailPickupTime:
            orderData.pickup_time,

        emailPaymentMethod:
            orderData.payment_method,

        emailPaymentReference:
            orderData.payment_reference,

        emailItems:
            orderData.items_text,

        emailNotes:
            orderData.order_notes,

        emailTotal:
            "₱" +
            formatMoney(
                orderData.total
            )

    };


    Object.keys(fields).forEach(
        function (id) {

            const element =
                $(id);


            if (element) {

                element.value =
                    fields[id];

            }

        }
    );


    try {

        form.submit();

        console.log(
            "Order email submitted."
        );

    } catch (error) {

        console.error(
            "Order email submission failed:",
            error
        );

    }

}


// =====================================================
// PLACE ORDER
// =====================================================

async function placeOrder() {

    if (!validateCheckout()) {
        return;
    }


    const placeButton =
        $("placeOrderButton");


    if (placeButton) {

        placeButton.disabled =
            true;

        placeButton.textContent =
            "Processing Order...";

    }


    try {

        currentOrderNumber =
            generateOrderNumber();


        const orderData =
            buildOrderData();


        console.log(
            "Preparing order:",
            orderData
        );


        // -------------------------------------------
        // SAVE TO ADMIN DASHBOARD / SUPABASE
        // -------------------------------------------

        const saveResult =
            await saveOrderToSupabase(
                orderData
            );


        // -------------------------------------------
        // IMPORTANT:
        // If Supabase fails, do not silently pretend
        // the admin dashboard received the order.
        // -------------------------------------------

        if (!saveResult.success) {

            console.error(
                "Order was NOT saved to the admin dashboard.",
                saveResult.error
            );


            const errorMessage =
                saveResult.error &&
                saveResult.error.message
                    ? saveResult.error.message
                    : "Unknown Supabase error.";


            alert(
                "The order could not be saved to the admin dashboard.\n\n" +
                "Please try again.\n\n" +
                "Technical error:\n" +
                errorMessage
            );


            if (placeButton) {

                placeButton.disabled =
                    false;

                placeButton.textContent =
                    "Place Order";

            }


            return;

        }


        // -------------------------------------------
        // SEND EMAIL AFTER SUPABASE SUCCESS
        // -------------------------------------------

        sendOrderEmail(
            orderData
        );


        // -------------------------------------------
        // SHOW CONFIRMATION
        // -------------------------------------------

        showOrderConfirmation(
            orderData
        );


    } catch (error) {

        console.error(
            "PLACE ORDER ERROR:",
            error
        );


        alert(
            "Something went wrong while placing your order.\n\n" +
            "Please try again."
        );


    } finally {

        if (placeButton) {

            placeButton.disabled =
                false;

            placeButton.textContent =
                "Place Order";

        }

    }

}


// =====================================================
// ORDER CONFIRMATION
// =====================================================

function showOrderConfirmation(
    orderData
) {

    closeCheckout();


    const popup =
        $("orderConfirmationPopup");


    if (!popup) {
        return;
    }


    const orderNumber =
        $("confirmationOrderNumber");


    const total =
        $("confirmationTotal");


    const summary =
        $("confirmationOrderSummary");


    if (orderNumber) {

        orderNumber.textContent =
            orderData.order_number;

    }


    if (total) {

        total.textContent =
            "₱" +
            formatMoney(
                orderData.total
            );

    }


    if (summary) {

        summary.textContent =
            orderData.items_text;

    }


    popup.style.display =
        "block";

}


// =====================================================
// FINISH ORDER
// =====================================================

function finishOrder() {

    cart = [];


    updateCart();


    const fields = [

        "customerName",

        "customerPhone",

        "deliveryAddress",

        "pickupTime",

        "gcashNumber",

        "paymentReference",

        "orderNotes"

    ];


    fields.forEach(
        function (id) {

            const element =
                $(id);


            if (!element) {
                return;
            }


            if (
                element.tagName ===
                "SELECT"
            ) {

                element.selectedIndex =
                    0;

            } else {

                element.value =
                    "";

            }

        }
    );


    const confirmation =
        $("orderConfirmationPopup");


    if (confirmation) {

        confirmation.style.display =
            "none";

    }


    const overlay =
        $("productOverlay");


    if (overlay) {

        overlay.style.display =
            "none";

    }


    const checkoutOverlay =
        $("checkoutOverlay");


    if (checkoutOverlay) {

        checkoutOverlay.style.display =
            "none";

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// =====================================================
// GLOBAL FUNCTION EXPORTS
// =====================================================
//
// Your HTML uses inline onclick="..." handlers.
// These functions MUST be available globally.
// =====================================================

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


window.changeCartQuantity =
    changeCartQuantity;

window.removeCartItem =
    removeCartItem;


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


// =====================================================
// FINAL DEBUG MESSAGE
// =====================================================

console.log(
    "HIGHWAY CAFE customer script loaded successfully."
);
