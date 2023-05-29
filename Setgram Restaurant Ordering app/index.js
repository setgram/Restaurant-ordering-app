import { menuArray } from "./data.js";

const modal = document.getElementById("modal");
const orderContainer = document.getElementById("order-section");
const totalPriceContainer = document.getElementById("order-total-container");
const paymentForm = document.getElementById("payment-form");
const thanksMessage = document.getElementById("thanks-message");

let orderedItems = [];

// handles click events
document.addEventListener("click", function (e) {
  if (e.target.dataset.add) {
    orderContainer.classList.remove("hidden");
    handleAddClick(e.target.dataset.add);
  } else if (e.target.dataset.remove) {
    handleRemoveClick(e.target.dataset.remove);
  } else if (e.target.id === "complete-order-btn") {
    modal.classList.remove("hidden");
  } else if (!e.target.closest(".modal")) {
    modal.classList.add("hidden");
  }
});

// handles submit events on the modal
modal.addEventListener("submit", function (e) {
  e.preventDefault();

  const paymentFormData = new FormData(paymentForm);

  const name = paymentFormData.get("name");

  modal.innerHTML = `
    <div class='modal-inner-loading'>
        <img src="/images/loading.gif" class="loading">
        <p>Awaiting confirmation...</p>
    </div>`;

  setTimeout(() => {
    modal.innerHTML = `
    <div class='modal-inner-loading'>
        <img src="/images/success.png" class="success">
        <p>Order complete!</p>
    </div>`;
  }, 3000);

  setTimeout(() => {
    modal.classList.add("hidden");
    orderContainer.classList.add("hidden");
    thanksMessage.style.display = "flex";
    thanksMessage.textContent = `Thanks, ${name}! Your order is on its way!`;
  }, 6000);
});

// Adds selected items to orderedItems array
function handleAddClick(itemId) {
  const itemObj = menuArray.filter((chosenItem) => {
    return chosenItem.id == itemId;
  })[0];

  itemObj.quantity++;
  itemObj.total = itemObj.price * itemObj.quantity;

  if (!orderedItems.includes(itemObj)) {
    orderedItems.push(itemObj);
  }
  getOrderHtml();
  getPrice();
}

// Removes items from orderedItems array
function handleRemoveClick(removedIndex) {
  const itemObj = orderedItems.filter((item) => {
    return item.id == removedIndex;
  })[0];

  itemObj.quantity--;
  itemObj.total = itemObj.price * itemObj.quantity;

  if (itemObj.total == 0) {
    orderedItems = orderedItems.filter((item) => item.id != removedIndex);
  }

  getOrderHtml();
  getPrice();
}

/* Creates an Html string of ordered items returned by handleAddClick or
   handleRemoveClick and renders them to the DOM*/
function getOrderHtml() {
  let orderHtml = ``;

  if (orderedItems.length === 0) {
    orderContainer.classList.add("hidden");
  }

  for (let item of orderedItems) {
    orderHtml += `
            <div class="items">
               <div class="items-left">
                  <h3 class="items-name">${item.name}</h3>
                  <button class="remove-btn" data-remove="${item.id}">remove</button>
               </div>
                
                <div class="items-right">
                   <p class="items-quantity">( ${item.quantity} )</p>
                   <p class="items-price">₦${item.total}</p>
                </div>
            </div>`;
  }
  document.getElementById("order-items-container").innerHTML = orderHtml;
}

// Calculates the  total and grand total prices of the Menu Items
function getPrice() {
  let totalPrice = 0;
  let totalHtml = ``;

  orderedItems.forEach((item) => {
    totalPrice += item.total;
  });

  totalHtml += `<div class="order-total" id="order-total">
            <h3 class="order-subtitle">Total price:</h3>
            <p class="total-price" id="total-price">₦${totalPrice}</p>
        </div>
        `;
  totalPriceContainer.innerHTML = totalHtml;
}

// Creates an Html string of menu items
function getFeedHtml() {
  let menuHtml = "";

  menuArray.forEach((item) => {
    const { foodPic, name, ingredients, price, id } = item;
    menuHtml += `
          <div class="menu-items">
                <img src="${foodPic}" class="menu-items-image" />
                <div class="menu-items-info">
                    <h3 class="menu-items-name">${name}</h3>
                    <p class="menu-items-ingredients">${ingredients}</p>
                    <p clas="menu-items-price">₦${price}</p>
                </div>
                <button class="add-btn" data-add="${id}">+</button>
          </div>
      `;
  });
  return menuHtml;
}

// Renders the Html string returned by getFeedHtml to the DOM
function render() {
  document.getElementById("menu").innerHTML = getFeedHtml();
}

render();
