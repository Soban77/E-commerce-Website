import { loadProductsFetch,getProduct } from "../data/products.js";
import { getOrder } from "./order.js";
import { calculateCartQuantity } from "../data/cart.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
//import { sendTracking } from "./order.js";

async function loadPage() {

  await loadProductsFetch();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  const product = getProduct(productId);
  const order = getOrder(orderId);

  let productDetails;

  if(order.products && order) {

    order.products.forEach((prod) => {

      if(prod.productId===productId) {

        productDetails = prod;

      }

    });
  }

  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);
  const percentageProgress = ((today - orderTime) / (deliveryTime - orderTime)) * 100;

  let html = `
      <div class="order-tracking">
        <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">
          Arriving on ${
            dayjs(productDetails.estimatedDeliveryTime).format('dddd, MMMM D')
          }
        </div>

        <div class="product-info">
          ${product.name}
        </div>

        <div class="product-info">
          Quantity: ${productDetails.quantity}
        </div>

        <img class="product-image" src="${product.image}">

        <div class="progress-labels-container">
          <div class="progress-label ${
            percentageProgress<50 ? 'current-status' : ''
          }">
            Preparing
          </div>
          <div class="progress-label ${
            (percentageProgress>=50 && percentageProgress<100) ? 'current-status' : ''
          }">
            Shipped
          </div>
          <div class="progress-label ${
            percentageProgress>=100 ? 'current-status' : ''
          }">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${percentageProgress}%;"></div>
        </div>
      </div>

  `;

  document.querySelector('.js-main').innerHTML = html;

  updateCartQuantity();

}

function updateCartQuantity() {

    if(document.querySelector('.js-cart-quantity')) {

      document.querySelector('.js-cart-quantity').innerHTML = `${calculateCartQuantity()}`;

    }
}

loadPage();

/*const trackButton = sendTracking();

if(trackButton) {

  trackButton.forEach((track) => {

    track.addEventListener('click',() => {

      loadPage();

    });

  });
}*/