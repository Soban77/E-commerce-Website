import { calculateCartQuantity } from "../../data/cart.js";

function renderCheckoutHeader() {

  document.querySelector('.js-return-to-home-link').innerHTML = `${calculateCartQuantity()} items`;

}