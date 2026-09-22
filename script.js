// =====================================================
// HIGHWAY CAFE
// COMPLETE ORDERING SYSTEM
// =====================================================


// =====================================================
// CART
// =====================================================

let cart = [];


// =====================================================
// PRODUCT VARIABLES
// =====================================================

let selectedProduct = "";
let selectedCategory = "";

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


// Add-on prices

const ESPRESSO_PRICE = 30;
const MATCHA_PRICE = 30;
const CHOCOLATE_PRICE = 30;


// =====================================================
// SNACK VARIABLES
// =====================================================

let selectedSnack = "";
let selectedSnackCategory = "";
let snackChoices = [];
let snackFlavors = [];

let selectedSnackChoice = null;
let selectedSnackFlavor = "";

let snackQuantity = 1;


// =====================================================
// MEAL VARIABLES
// =====================================================

let selectedMeal = "";

let mealChoices = [];

let selectedMealChoice = null;

let selectedMealCooler = "None";
let selectedMealCoolerPrice = 0;

let extraEgg = false;
let extraRice = false;

let mealQuantity = 1;


// =====================================================
// CHECKOUT VARIABLES
// =====================================================

let orderType = "pickup";
let paymentMethod = "cash";


// =====================================================
// START ORDER
// =====================================================

function startOrder() {

    const menu = document.getElementById("menu");

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
// DRINK DATA
// =====================================================

const drinkData = {

    americano: {
        name: "Americano",
        category: "Highway Brews",
        type: "size16-22",
        p16: 70,
        p22: 80,
        addons: "espresso"
    },

    vanillaLatte: {
        name: "Vanilla Latte",
        category: "Highway Brews",
        type: "size16-22",
        p16: 75,
        p22: 89,
        addons: "espresso"
    },

    spanishLatte: {
        name: "Spanish Latte",
        category: "Highway Brews",
        type: "size16-22",
        p16: 75,
        p22: 89,
        addons: "espresso"
    },

    mochaLatte: {
        name: "Mocha Latte",
        category: "Highway Brews",
        type: "size16-22",
        p16: 75,
        p22: 89,
        addons: "espresso-chocolate"
    },

    dirtyMatcha: {
        name: "Dirty Matcha",
        category: "Highway Brews",
        type: "size16-22",
        p16: 85,
        p22: 100,
        addons: "both"
    },

    saltedCaramel: {
        name: "Salted Caramel",
        category: "Highway Brews",
        type: "size16-22",
        p16: 75,
        p22: 89,
        addons: "espresso"
    },

    caramelMacchiato: {
        name: "Caramel Macchiato",
        category: "Highway Brews",
        type: "size16-22",
        p16: 75,
        p22: 89,
        addons: "espresso"
    },


    // HOT COFFEE

    hotChoco: {
        name: "Hot Choco",
        category: "Hot-Road Brews",
        type: "size8",
        p16: 70,
        p22: 0,
        addons: "chocolate"
    },

    hotAmericano: {
        name: "Americano",
        category: "Hot-Road Brews",
        type: "size8",
        p16: 70,
        p22: 0,
        addons: "espresso"
    },

    hotSpanishLatte: {
        name: "Spanish Latte",
        category: "Hot-Road Brews",
        type: "size8",
        p16: 80,
        p22: 0,
        addons: "espresso"
    },

    cafeLatte: {
        name: "Cafe Latte",
        category: "Hot-Road Brews",
        type: "size8",
        p16: 80,
        p22: 0,
        addons: "espresso"
    },


    // HIGHWAY COOLERS

    greenApple: {
        name: "Green Apple",
        category: "Highway Coolers",
        type: "size12-16-22",
        p12: 29,
        p16: 39,
        p22: 59,
        addons: "none"
    },

    lychee: {
        name: "Lychee",
        category: "Highway Coolers",
        type: "size12-16-22",
        p12: 29,
        p16: 39,
        p22: 59,
        addons: "none"
    },

    strawberrySoda: {
        name: "Strawberry",
        category: "Highway Coolers",
        type: "size12-16-22",
        p12: 29,
        p16: 39,
        p22: 59,
        addons: "none"
    },

    blueberrySoda: {
        name: "Blueberry",
        category: "Highway Coolers",
        type: "size12-16-22",
        p12: 29,
        p16: 39,
        p22: 59,
        addons: "none"
    },


    // MILK SERIES

    strawberryMilk: {
        name: "Strawberry Milk",
        category: "Creamline Express",
        type: "size16-22",
        p16: 65,
        p22: 80,
        addons: "none"
    },

    blueberryMilk: {
        name: "Blueberry Milk",
        category: "Creamline Express",
        type: "size16-22",
        p16: 65,
        p22: 80,
        addons: "none"
    },

    chocolateMilk: {
        name: "Chocolate Milk",
        category: "Creamline Express",
        type: "size16-22",
        p16: 65,
        p22: 80,
        addons: "chocolate"
    },

    matchaLatte: {
        name: "Matcha Latte",
        category: "Creamline Express",
        type: "size16-22",
        p16: 80,
        p22: 95,
        addons: "matcha"
    },

    cookiesCream: {
        name: "Cookies and Cream",
        category: "Creamline Express",
        type: "size16-22",
        p16: 65,
        p22: 80,
        addons: "none"
    }

};


// =====================================================
// OPEN DRINK
// =====================================================

function openDrink(key) {

    const drink = drinkData[key];

    if (!drink) {

        console.error(
            "Drink not found:",
            key
        );

        return;
    }


    if (drink.type === "size12-16-22") {

        openProduct(
            drink.name,
            drink.category,
            drink.type,
            drink.p16,
            drink.p22,
            drink.addons,
            drink.p12
        );

    }

    else {

        openProduct(
            drink.name,
            drink.category,
            drink.type,
            drink.p16,
            drink.p22,
            drink.addons
        );

    }
}


// =====================================================
// OPEN PRODUCT
// =====================================================

function openProduct(
    productName,
    category,
    type,
    p16,
    p22,
    addons,
    p12
) {

    selectedProduct = productName;

    selectedCategory = category;

    sizeType = type;


    price12 = p12 || 0;

    price16 = p16 || 0;

    price22 = p22 || 0;


    selectedSize = 16;

    quantity = 1;


    extraEspresso = false;
    extraMatcha = false;
    extraChocolate = false;


    espressoAvailable =
        addons === "espresso" ||
        addons === "espresso-chocolate" ||
        addons === "both";


    matchaAvailable =
        addons === "matcha" ||
        addons === "both";


    chocolateAvailable =
        addons === "chocolate" ||
        addons === "espresso-chocolate" ||
        addons === "both";


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


    // 12oz

    if (size12Button) {

        size12Button.style.display =
            type === "size12-16-22"
                ? "inline-block"
                : "none";

    }


    // 16oz

    if (size16Button) {

        size16Button.style.display =
            "inline-block";

        size16Button.textContent =
            type === "size8"
                ? "8oz"
                : "16oz";

    }


    // 22oz

    if (size22Button) {

        size22Button.style.display =
            (
                type === "size16-22" ||
                type === "size12-16-22"
            )
                ? "inline-block"
                : "none";

    }


    const sizeTitle =
        document.getElementById(
            "sizeTitle"
        );


    if (sizeTitle) {

        sizeTitle.textContent =
            type === "size8"
                ? "Size"
                : "Choose Size";

    }


    // Hide add-ons when unavailable

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

    updateQuantityDisplay();


    showOnlyPopup(
        "productPopup"
    );
}


// =====================================================
// SELECT SIZE
// =====================================================

function selectSize(size) {

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


    buttons.forEach(
        function(button) {

            if (button) {

                button.classList.remove(
                    "selected-option"
                );

            }

        }
    );


    let selectedButton = null;


    if (size === 12) {

        selectedButton =
            document.getElementById(
                "size12Button"
            );

    }


    if (size === 16) {

        selectedButton =
            document.getElementById(
                "size16Button"
            );

    }


    if (size === 22) {

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
}


// =====================================================
// ADD-ONS
// =====================================================

function toggleEspresso() {

    extraEspresso =
        !extraEspresso;


    updateAddonButton(
        "espressoButton",
        extraEspresso
    );
}


function toggleMatcha() {

    extraMatcha =
        !extraMatcha;


    updateAddonButton(
        "matchaButton",
        extraMatcha
    );
}


function toggleChocolate() {

    extraChocolate =
        !extraChocolate;


    updateAddonButton(
        "chocolateButton",
        extraChocolate
    );
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


    if (selected) {

        button.classList.add(
            "selected-option"
        );

    }

    else {

        button.classList.remove(
            "selected-option"
        );

    }
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


// =====================================================
// PRODUCT QUANTITY
// =====================================================

function changeQuantity(amount) {

    quantity += amount;


    if (quantity < 1) {

        quantity = 1;

    }


    updateQuantityDisplay();
}


function updateQuantityDisplay() {

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
// PRODUCT PRICE
// =====================================================

function getSelectedProductBasePrice() {

    if (sizeType === "size8") {

        return price16;

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
// ADD PRODUCT
// =====================================================

function addSelectedProduct() {

    let finalPrice =
        getSelectedProductBasePrice();


    if (extraEspresso) {

        finalPrice +=
            ESPRESSO_PRICE;

    }


    if (extraMatcha) {

        finalPrice +=
            MATCHA_PRICE;

    }


    if (extraChocolate) {

        finalPrice +=
            CHOCOLATE_PRICE;

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

        quantity: quantity,

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


// =====================================================
// GENERIC CART ADD
// =====================================================

function addItemToCart(newItem) {

    const existing =
        cart.find(
            function(item) {

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

            }
        );


    if (existing) {

        existing.quantity +=
            newItem.quantity;

    }

    else {

        cart.push(newItem);

    }


    updateCart();
}


// =====================================================
// SHOW ONLY ONE PRODUCT POPUP
// =====================================================

function showOnlyPopup(id) {

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


    const selectedPopup =
        document.getElementById(id);


    if (selectedPopup) {

        selectedPopup.style.display =
            "block";

    }


    if (overlay) {

        overlay.style.display =
            "flex";

    }
}


// =====================================================
// CLOSE PRODUCT
// =====================================================

function closeProduct() {

    const popup =
        document.getElementById(
            "productPopup"
        );


    const overlay =
        document.getElementById(
            "productOverlay"
        );


    if (popup) {

        popup.style.display =
            "none";

    }


    if (overlay) {

        overlay.style.display =
            "none";

    }
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


    setTimeout(
        function() {

            notice.style.display =
                "none";

        },
        1800
    );
}


// =====================================================
// SNACK DATA
// =====================================================

const snackData = {

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

        choices: [

            {
                name: "1 pc",
                price: 10
            }

        ],

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

    }

};


// =====================================================
// OPEN SNACK
// =====================================================

function openSnackByKey(key) {

    const snack =
        snackData[key];


    if (!snack) {

        console.error(
            "Snack not found:",
            key
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
// =====================================================

function openSnack(
    snackName,
    category,
    choices,
    flavors
) {

    selectedSnack =
        snackName;

    selectedSnackCategory =
        category;

    snackChoices =
        choices || [];

    snackFlavors =
        flavors || [];


    selectedSnackChoice =
        null;

    selectedSnackFlavor =
        "";

    snackQuantity =
        1;


    const snackDisplay =
        document.getElementById(
            "selectedSnack"
        );


    const categoryDisplay =
        document.getElementById(
            "selectedSnackCategory"
        );


    if (snackDisplay) {

        snackDisplay.textContent =
            selectedSnack;

    }


    if (categoryDisplay) {

        categoryDisplay.textContent =
            selectedSnackCategory;

    }


    const choiceContainer =
        document.getElementById(
            "snackChoiceButtons"
        );


    if (choiceContainer) {

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


                    button.type =
                        "button";


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


    if (snackChoices.length === 1) {

        selectSnackChoice(0);

    }


    updateSnackQuantityDisplay();

    showOnlyPopup(
        "snackPopupContent"
    );
}


// =====================================================
// SNACK CHOICE
// =====================================================

function selectSnackChoice(index) {

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


// =====================================================
// SNACK FLAVOR
// =====================================================

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
                button.textContent === flavor
            );

        }
    );
}


// =====================================================
// SNACK QUANTITY
// =====================================================

function changeSnackQuantity(amount) {

    snackQuantity += amount;


    if (snackQuantity < 1) {

        snackQuantity = 1;

    }


    updateSnackQuantityDisplay();
}


function updateSnackQuantityDisplay() {

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
// ADD SNACK
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


    const item = {

        name:
            selectedSnack,

        category:
            selectedSnackCategory,

        option:
            selectedSnackChoice.name,

        flavor:
            selectedSnackFlavor,

        price:
            selectedSnackChoice.price,

        quantity:
            snackQuantity

    };


    addItemToCart(item);

    closeSnack();

    showOrderNotice();
}


// =====================================================
// CLOSE SNACK
// =====================================================

function closeSnack() {

    const popup =
        document.getElementById(
            "snackPopupContent"
        );


    const overlay =
        document.getElementById(
            "productOverlay"
        );


    if (popup) {

        popup.style.display =
            "none";

    }


    if (overlay) {

        overlay.style.display =
            "none";

    }
}


// =====================================================
// MEAL DATA
// =====================================================

const mealData = {

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
                name: "2 pcs Skinless Longganisa",
                price: 55
            }

        ]

    }

};


// =====================================================
// OPEN MEAL
// =====================================================

function openMealByKey(key) {

    const meal =
        mealData[key];


    if (!meal) {

        console.error(
            "Meal not found:",
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

    selectedMeal =
        mealName;

    mealChoices =
        choices || [];


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

    updateMealQuantityDisplay();

    showOnlyPopup(
        "mealPopupContent"
    );
}


// =====================================================
// MEAL CHOICE
// =====================================================

function selectMealChoice(index) {

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


// =====================================================
// MEAL COOLER
// =====================================================

function selectMealCooler(
    name,
    price
) {

    selectedMealCooler =
        name;

    selectedMealCoolerPrice =
        price;


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


    if (name === "None") {

        const button =
            document.getElementById(
                "coolerNoneButton"
            );


        if (button) {

            button.classList.add(
                "selected-option"
            );

        }

    }


    if (
        name ===
        "Highway Cooler 16oz"
    ) {

        const button =
            document.getElementById(
                "cooler16Button"
            );


        if (button) {

            button.classList.add(
                "selected-option"
            );

        }

    }


    if (
        name ===
        "Highway Cooler 22oz"
    ) {

        const button =
            document.getElementById(
                "cooler22Button"
            );


        if (button) {

            button.classList.add(
                "selected-option"
            );

        }

    }
}


// =====================================================
// EXTRA EGG
// =====================================================

function toggleExtraEgg() {

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


// =====================================================
// EXTRA RICE
// =====================================================

function toggleExtraRice() {

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


// =====================================================
// RESET MEAL OPTIONS
// =====================================================

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


// =====================================================
// MEAL QUANTITY
// =====================================================

function changeMealQuantity(amount) {

    mealQuantity += amount;


    if (mealQuantity < 1) {

        mealQuantity = 1;

    }


    updateMealQuantityDisplay();
}


function updateMealQuantityDisplay() {

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
// ADD MEAL
// =====================================================

function addMealToCart() {

    if (!selectedMealChoice) {

        alert(
            "Please choose a meal option first."
        );

        return;
    }


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
            mealQuantity,

        extraEgg:
            extraEgg,

        extraRice:
            extraRice

    };


    addItemToCart(item);

    closeMeal();

    showOrderNotice();
}


// =====================================================
// CLOSE MEAL
// =====================================================

function closeMeal() {

    const popup =
        document.getElementById(
            "mealPopupContent"
        );


    const overlay =
        document.getElementById(
            "productOverlay"
        );


    if (popup) {

        popup.style.display =
            "none";

    }


    if (overlay) {

        overlay.style.display =
            "none";

    }
}


// =====================================================
// CART
// =====================================================

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
            "<p>Your cart is empty.</p>";


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


    let html =
        "";


    let total =
        0;


    let totalItems =
        0;


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
                        ${itemQuantity} x ${item.name}
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
                        onclick="decreaseCartItem(${index})">

                        −

                    </button>


                    <button
                        type="button"
                        onclick="increaseCartItem(${index})">

                        +

                    </button>


                    <button
                        type="button"
                        onclick="removeCartItem(${index})">

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


// =====================================================
// CART + / -
// =====================================================

function increaseCartItem(index) {

    if (!cart[index]) {

        return;
    }


    cart[index].quantity++;

    updateCart();
}


function decreaseCartItem(index) {

    if (!cart[index]) {

        return;
    }


    cart[index].quantity--;


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
// CART TOTAL
// =====================================================

function getCartTotal() {

    let total =
        0;


    cart.forEach(
        function(item) {

            total +=
                Number(item.price || 0) *
                Number(item.quantity || 1);

        }
    );


    return total;
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


    const checkoutPopup =
        document.getElementById(
            "checkoutPopup"
        );


    const confirmationPopup =
        document.getElementById(
            "orderConfirmationPopup"
        );


    if (!overlay) {

        alert(
            "Checkout window could not be opened."
        );

        return;
    }


    if (checkoutPopup) {

        checkoutPopup.style.display =
            "block";

    }


    if (confirmationPopup) {

        confirmationPopup.style.display =
            "none";

    }


    overlay.style.display =
        "flex";


    selectOrderType(
        "pickup"
    );


    selectPaymentMethod(
        "cash"
    );


    clearCheckoutInputs();

    updateCheckoutSummary();

    updateCheckoutTotal();
}


// =====================================================
// CLEAR CHECKOUT
// =====================================================

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

                element.value =
                    "";

            }

        }
    );
}


// =====================================================
// ORDER TYPE
// =====================================================

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
}


// =====================================================
// PAYMENT
// =====================================================

function selectPaymentMethod(method) {

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


// =====================================================
// CHECKOUT SUMMARY
// =====================================================

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


    let html =
        "";


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
                            ${itemQuantity} x ${item.name}
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

                    </div>


                    <strong>
                        ₱${itemTotal}
                    </strong>

                </div>

            `;

        }
    );


    summary.innerHTML =
        html;
}


// =====================================================
// CHECKOUT TOTAL
// =====================================================

function updateCheckoutTotal() {

    const total =
        document.getElementById(
            "checkoutTotal"
        );


    if (total) {

        total.textContent =
            getCartTotal();

    }
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
// PLACE ORDER + SEND EMAIL
// =====================================================

async function placeOrder() {

    if (cart.length === 0) {

        alert("Your cart is empty.");
        return;
    }


    // =================================================
    // GET INPUTS
    // =================================================

    const nameInput =
        document.getElementById("customerName");

    const phoneInput =
        document.getElementById("customerPhone");

    const addressInput =
        document.getElementById("deliveryAddress");

    const notesInput =
        document.getElementById("orderNotes");

    const paymentReferenceInput =
        document.getElementById("paymentReference");

    const pickupTimeInput =
        document.getElementById("pickupTime");


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


    // =================================================
    // VALIDATION
    // =================================================

    if (!name) {

        alert("Please enter your name.");

        if (nameInput) {
            nameInput.focus();
        }

        return;
    }


    if (!phone) {

        alert("Please enter your phone number.");

        if (phoneInput) {
            phoneInput.focus();
        }

        return;
    }


    if (
        orderType === "delivery" &&
        !address
    ) {

        alert("Please enter your delivery address.");

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


    // =================================================
    // ORDER NUMBER
    // =================================================

    const orderNumber =
        "HC-" +
        Date.now()
            .toString()
            .slice(-6);


    const total =
        getCartTotal();


    // =================================================
    // ORDER SUMMARY
    // =================================================

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


    if (orderType === "delivery") {

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


    if (paymentMethod === "gcash") {

        orderSummary +=
            "Reference: " +
            paymentReference +
            "\n";
    }


    // =================================================
    // ORDER ITEMS
    // =================================================

    orderSummary +=
        "\n--------------------------\n";

    orderSummary +=
        "ORDER ITEMS\n";

    orderSummary +=
        "--------------------------\n";


    cart.forEach(function(item) {

        const itemQuantity =
            Number(item.quantity || 1);


        const itemTotal =
            Number(item.price || 0) *
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

    });


    orderSummary +=
        "--------------------------\n";


    orderSummary +=
        "TOTAL: ₱" +
        total +
        "\n";


    // =================================================
    // NOTES
    // =================================================

    if (notes) {

        orderSummary +=
            "\nNote:\n" +
            notes +
            "\n";
    }


    // =================================================
    // PAYMENT STATUS
    // =================================================

    if (paymentMethod === "gcash") {

        orderSummary +=
            "\nPayment Status: Waiting for GCash confirmation.";

    } else {

        orderSummary +=
            "\nPayment Status: Cash upon " +
            (
                orderType === "delivery"
                    ? "delivery."
                    : "pickup."
            );
    }


    // =================================================
    // PLACE ORDER BUTTON
    // =================================================

    const placeButton =
        document.getElementById(
            "placeOrderButton"
        );


    if (placeButton) {

        placeButton.disabled = true;

        placeButton.textContent =
            "Sending Order...";
    }


    // =================================================
    // PREPARE FORM DATA
    // =================================================

    const formData =
        new FormData();


    formData.append(
        "_subject",
        "HIGHWAY CAFE - NEW ORDER #" +
        orderNumber
    );


    formData.append(
        "_template",
        "table"
    );


    formData.append(
        "_captcha",
        "false"
    );


    formData.append(
        "Order Number",
        orderNumber
    );


    formData.append(
        "Customer Name",
        name
    );


    formData.append(
        "Phone Number",
        phone
    );


    formData.append(
        "Order Type",
        (
            orderType === "delivery"
                ? "Delivery"
                : "Pickup"
        )
    );


    formData.append(
        "Delivery Address",
        (
            orderType === "delivery"
                ? address
                : "N/A - Pickup"
        )
    );


    formData.append(
        "Pickup Time",
        (
            orderType === "pickup"
                ? (
                    pickupTime
                        ? pickupTime
                        : "Not specified"
                )
                : "N/A - Delivery"
        )
    );


    formData.append(
        "Payment Method",
        (
            paymentMethod === "gcash"
                ? "GCash / Online Payment"
                : "Cash"
        )
    );


    formData.append(
        "GCash Reference",
        (
            paymentMethod === "gcash"
                ? paymentReference
                : "N/A"
        )
    );


    formData.append(
        "Ordered Items",
        orderSummary
    );


    formData.append(
        "Order Notes",
        (
            notes
                ? notes
                : "No notes"
        )
    );


    formData.append(
        "Grand Total",
        "₱" + total
    );


    // =================================================
    // SEND TO FORMSUBMIT
    // =================================================

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


        // =================================================
        // SUCCESS
        // =================================================

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


        // =================================================
        // FORMSUBMIT REJECTED
        // =================================================

        throw new Error(
            result.message ||
            "FormSubmit rejected the order."
        );

    }


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


// =====================================================
// ORDER CONFIRMATION
// =====================================================

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


    if (confirmationPopup) {

        confirmationPopup.style.display =
            "block";

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
            "₱" +
            total;

    }
}


// =====================================================
// FINISH ORDER
// =====================================================

function finishOrder() {

    const confirmationPopup =
        document.getElementById(
            "orderConfirmationPopup"
        );


    const checkoutOverlay =
        document.getElementById(
            "checkoutOverlay"
        );


    if (confirmationPopup) {

        confirmationPopup.style.display =
            "none";

    }


    if (checkoutOverlay) {

        checkoutOverlay.style.display =
            "none";

    }


    cart = [];


    updateCart();


    orderType =
        "pickup";


    paymentMethod =
        "cash";


    alert(
        "Thank you for ordering from Highway Cafe!"
    );
}


// =====================================================
// CLICK OUTSIDE POPUPS
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        // Start with menu visible

        const menu =
            document.getElementById(
                "menu"
            );


        if (menu) {

            menu.style.display =
                "block";

        }


        // Product overlay

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

                        closeSnack();

                        closeMeal();

                    }

                }
            );

        }


        // Checkout overlay

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


        // Initialize cart

        updateCart();

    }
);
