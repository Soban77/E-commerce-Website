import {orders} from '../data/orders.js';
import { formatCurrency } from './utils/money.js';
import { getProduct, loadProductsFetch } from '../data/products.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { addToCart,calculateCartQuantity } from '../data/cart.js';

export function getOrder(orderId) {

  let matchOrder;

  orders.forEach((order) => {

    if(orderId === order.id) {

      matchOrder = order;

    }

  });

  return matchOrder;

}

function updateCartQuantity() {

    if(document.querySelector('.js-cart-quantity')) {

      document.querySelector('.js-cart-quantity').innerHTML = `${calculateCartQuantity()}`;

    }
}

async function loadPage()
{
  await loadProductsFetch();

  function createOrderHTML() {

    let html = '';

    orders.forEach((order) => {

        html += `
          <div class="order-container">
            <div class="order-header">
              <div class="order-header-left-section">
                <div class="order-date">
                  <div class="order-header-label">Order Placed:</div>
                  <div>${convertDate(order)}</div>
                </div>
                <div class="order-total">
                  <div class="order-header-label">Total:</div>
                  <div>$${formatCurrency(order.totalCostCents)}</div>
                </div>
              </div>

              <div class="order-header-right-section">
                <div class="order-header-label">Order ID:</div>
                <div>${order.id}</div>
              </div>
            </div>

            <div class="order-details-grid">
              ${CreateProductsHTML(order)}
            </div>
          </div>
            `;

    });

    if(document.querySelector('.js-orders-grid')) {

      document.querySelector('.js-orders-grid').innerHTML = html;

    }
  }

  function convertDate(ord) {

    const date = dayjs(ord.orderTime);
    const newDate = date.format('D MMMM');

    return newDate;

  }

  function arrivingDate(prod) {
    const date = dayjs(prod.estimatedDeliveryTime);
    const newDate = date.format('D MMMM');

    return newDate;
  }

  function CreateProductsHTML(ord) {

    let html = '';

    ord.products.forEach((product) => {

      let prod = getProduct(product.productId);
      let name1 = getProduct(product.productId).name;
      let image1 = getProduct(product.productId).image;

      html += ` <div class="product-image-container">
                  <img src="${image1}">
                </div>

                <div class="product-details">
                  <div class="product-name">
                    ${name1}
                  </div>
                  <div class="product-delivery-date">
                    Arriving on: ${arrivingDate(product)}
                  </div>
                  <div class="product-quantity">
                    Quantity: ${product.quantity}
                  </div>
                  <button class="buy-again-button button-primary js-buy-again-button" data-product-id="${prod.id}">
                    <img class="buy-again-icon" src="images/icons/buy-again.png">
                    <span class="buy-again-message">Buy it again</span>
                  </button>
                </div>

                <div class="product-actions js-product-actions">
                  <a href="tracking.html?orderId=${ord.id}&productId=${prod.id}">
                    <button class="track-package-button button-secondary">
                      Track package
                    </button>
                  </a>
                </div>
      `;

    });

    return html;

  }

  createOrderHTML();

  document.querySelectorAll('.js-buy-again-button').forEach((button) => {

    button.addEventListener('click', () => {

      console.log(button.dataset.productId);

      addToCart(button.dataset.productId);

      button.innerHTML = 'Added';

      setTimeout(() => {

        button.innerHTML = `
        
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>

        `;

      },1000);

      updateCartQuantity();

    });

  });

  updateCartQuantity();

}

loadPage();

/*export function sendTracking() {

  return document.querySelectorAll('.js-product-actions');

}*/