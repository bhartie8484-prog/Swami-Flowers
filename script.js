// PRODUCT DATA WITH PRICES
const products = {
  Rose: { name: "Rose", price: 200 },
  Sunflower: { name: "Sunflower", price: 180 },
  Lotus: { name: "Lotus", price: 220 },
  Jasmine: { name: "Jasmine", price: 190 },
  Chrysanthemum: { name: "Chrysanthemum", price: 210 },
  Hibiscus: { name: "Hibiscus", price: 210 },
  Daisy: { name: "Daisy", price: 160 },
  "Ceramic Flowerpot": { name: "Ceramic Flowerpot", price: 350 },
  "Terracotta Pot": { name: "Terracotta Pot", price: 250 },
  "Modern Planter": { name: "Modern Planter", price: 400 },
  "Hanging Basket": { name: "Hanging Basket", price: 300 },
  "Stone Planter": { name: "Stone Planter", price: 450 },
  "Wooden Planter": { name: "Wooden Planter", price: 380 },
};

// CART FUNCTIONALITY
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ADD TO CART
function addToCart(itemName) {
  console.log("Add to cart clicked for:", itemName);
  const product = products[itemName];
  if (!product) {
    console.error("Product not found:", itemName);
    return;
  }

  const existingItem = cart.find((item) => item.name === itemName);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showNotification(`${itemName} added to cart!`, "success");
}

// UPDATE CART COUNT
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cartCount").textContent = totalItems;
}

// SHOW NOTIFICATION
function showNotification(message, type = "success") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()">&times;</button>
    </div>
  `;

  // Add notification styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === "success" ? "#d4edda" : "#f8d7da"};
    color: ${type === "success" ? "#155724" : "#721c24"};
    padding: 15px 20px;
    border-radius: 8px;
    border-left: 4px solid ${type === "success" ? "#28a745" : "#dc3545"};
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 3000;
    animation: slideInRight 0.3s ease-out;
    max-width: 300px;
  `;

  notification.querySelector(".notification-content").style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  `;

  notification.querySelector("button").style.cssText = `
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: inherit;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  document.body.appendChild(notification);

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 3000);
}

// OPEN CART MODAL
function openCart() {
  displayCartItems();
  document.getElementById("cartModal").style.display = "block";
  document.body.style.overflow = "hidden";
}

// CLOSE CART MODAL
function closeCart() {
  document.getElementById("cartModal").style.display = "none";
  document.body.style.overflow = "auto";
}

// DISPLAY CART ITEMS
function displayCartItems() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalElement = document.getElementById("cartTotal");

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some beautiful flowers to get started!</p>
      </div>
    `;
    cartTotalElement.textContent = "0";
    return;
  }

  let cartHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    cartHTML += `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price} each</div>
        </div>
        <div class="cart-item-actions">
          <div class="quantity-controls">
            <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>
    `;
  });

  cartItemsContainer.innerHTML = cartHTML;
  cartTotalElement.textContent = total;
}

// UPDATE QUANTITY
function updateQuantity(index, change) {
  if (cart[index]) {
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
  }
}

// REMOVE FROM CART
function removeFromCart(index) {
  if (cart[index]) {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
    showNotification(`${itemName} removed from cart`, "success");
  }
}

// CLEAR CART
function clearCart() {
  if (cart.length === 0) return;

  if (confirm("Are you sure you want to clear your cart?")) {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
    showNotification("Cart cleared successfully", "success");
  }
}

// PROCEED TO CHECKOUT
function proceedToCheckout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty!", "error");
    return;
  }

  closeCart();
  displayCheckoutItems();
  document.getElementById("checkoutModal").style.display = "block";
  document.body.style.overflow = "hidden";
}

// CLOSE CHECKOUT MODAL
function closeCheckout() {
  document.getElementById("checkoutModal").style.display = "none";
  document.body.style.overflow = "auto";
}

// DISPLAY CHECKOUT ITEMS
function displayCheckoutItems() {
  const checkoutItemsContainer = document.getElementById("checkoutItems");
  const subtotalElement = document.getElementById("subtotal");
  const deliveryChargesElement = document.getElementById("deliveryCharges");
  const finalTotalElement = document.getElementById("finalTotal");

  let checkoutHTML = "";
  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    checkoutHTML += `
      <div class="checkout-item">
        <div>
          <div class="checkout-item-name">${item.name}</div>
          <div class="checkout-item-details">₹${item.price} × ${item.quantity}</div>
        </div>
        <div>₹${itemTotal}</div>
      </div>
    `;
  });

  const deliveryCharges = 50;
  updateTotalWithPaymentMethod(subtotal, deliveryCharges);

  checkoutItemsContainer.innerHTML = checkoutHTML;
  subtotalElement.textContent = subtotal;
  deliveryChargesElement.textContent = deliveryCharges;
}

// UPDATE TOTAL BASED ON PAYMENT METHOD
function updateTotalWithPaymentMethod(subtotal, deliveryCharges) {
  const paymentMethod =
    document.querySelector('input[name="paymentMethod"]:checked')?.value ||
    "upi";
  const codChargesRow = document.getElementById("codChargesRow");
  const codChargesElement = document.getElementById("codCharges");
  const finalTotalElement = document.getElementById("finalTotal");
  const paymentBtn = document.getElementById("paymentBtn");

  let codCharges = 0;

  if (paymentMethod === "cod") {
    codCharges = 25;
    if (codChargesRow) codChargesRow.style.display = "flex";
    if (paymentBtn) paymentBtn.textContent = "Place Order (COD)";
  } else {
    if (codChargesRow) codChargesRow.style.display = "none";
    if (paymentBtn) paymentBtn.textContent = "Pay Now";
  }

  const finalTotal = subtotal + deliveryCharges + codCharges;

  if (codChargesElement) codChargesElement.textContent = codCharges;
  if (finalTotalElement) finalTotalElement.textContent = finalTotal;
}

// HANDLE UPI PAYMENT
function handleUPIPayment(orderData) {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryCharges = 50;
  const totalAmount = subtotal + deliveryCharges;

  // Show UPI options modal
  showUPIOptions(totalAmount, orderData);
}

// SHOW UPI OPTIONS
function showUPIOptions(amount, orderData) {
  const upiHTML = `
    <div class="modal" id="upiModal" style="display: block;">
      <div class="modal-content upi-modal-content">
        <div class="modal-header">
          <h2>Choose UPI App</h2>
          <span class="close" onclick="closeUPIModal()">&times;</span>
        </div>
        <div class="modal-body">
          <div class="upi-apps">
            <div class="upi-app" onclick="openUPIApp('phonepe', ${amount}, '${orderData.customerPhone}')">
              <img src="https://cdn.iconscout.com/icon/free/png-256/phonepe-2709167-2249157.png" alt="PhonePe">
              <span>PhonePe</span>
            </div>
            <div class="upi-app" onclick="openUPIApp('googlepay', ${amount}, '${orderData.customerPhone}')">
              <img src="https://cdn.iconscout.com/icon/free/png-256/google-pay-2038307-1721670.png" alt="Google Pay">
              <span>Google Pay</span>
            </div>
            <div class="upi-app" onclick="openUPIApp('paytm', ${amount}, '${orderData.customerPhone}')">
              <img src="https://cdn.iconscout.com/icon/free/png-256/paytm-226448.png" alt="Paytm">
              <span>Paytm</span>
            </div>
            <div class="upi-app" onclick="openUPIApp('bhim', ${amount}, '${orderData.customerPhone}')">
              <img src="https://cdn.iconscout.com/icon/free/png-256/bhim-2085056-1747946.png" alt="BHIM">
              <span>BHIM UPI</span>
            </div>
          </div>
          <div class="cod-note">
            <p><strong>Note:</strong> You will be redirected to your selected UPI app to complete the payment.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", upiHTML);
  document.body.style.overflow = "hidden";
}

// OPEN UPI APP
function openUPIApp(app, amount, phone) {
  const upiId = "swamiflowers@paytm"; // Replace with your actual UPI ID
  const merchantName = "Swami Flowers";
  const transactionNote = "Flower Purchase";

  let upiUrl = "";

  switch (app) {
    case "phonepe":
      upiUrl = `phonepe://pay?pa=${upiId}&pn=${merchantName}&am=${amount}&tn=${transactionNote}`;
      break;
    case "googlepay":
      upiUrl = `tez://upi/pay?pa=${upiId}&pn=${merchantName}&am=${amount}&tn=${transactionNote}`;
      break;
    case "paytm":
      upiUrl = `paytmmp://pay?pa=${upiId}&pn=${merchantName}&am=${amount}&tn=${transactionNote}`;
      break;
    case "bhim":
      upiUrl = `bhim://pay?pa=${upiId}&pn=${merchantName}&am=${amount}&tn=${transactionNote}`;
      break;
  }

  // Try to open the UPI app
  window.location.href = upiUrl;

  // Show payment confirmation after a delay
  setTimeout(() => {
    closeUPIModal();
    showPaymentConfirmation(app, amount);
  }, 3000);
}

// CLOSE UPI MODAL
function closeUPIModal() {
  const upiModal = document.getElementById("upiModal");
  if (upiModal) {
    upiModal.remove();
  }
  document.body.style.overflow = "auto";
}

// SHOW PAYMENT CONFIRMATION
function showPaymentConfirmation(paymentMethod, amount) {
  const confirmHTML = `
    <div class="modal" id="confirmModal" style="display: block;">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Payment Confirmation</h2>
        </div>
        <div class="modal-body">
          <div class="cod-confirmation">
            <h4>Did you complete the payment?</h4>
            <p>Amount: ₹${amount}</p>
            <p>Method: ${paymentMethod.toUpperCase()}</p>
          </div>
          <div style="display: flex; gap: 15px; justify-content: center; margin-top: 20px;">
            <button class="btn-secondary" onclick="closeConfirmModal()">Cancel</button>
            <button class="btn-primary" onclick="confirmPayment('${paymentMethod}', ${amount})">Yes, Payment Done</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", confirmHTML);
}

// CONFIRM PAYMENT
function confirmPayment(method, amount) {
  const paymentId = "UPI_" + Date.now();
  const orderData = {
    customerName: document.getElementById("customerName").value,
    customerEmail: document.getElementById("customerEmail").value,
    customerPhone: document.getElementById("customerPhone").value,
    deliveryAddress: document.getElementById("deliveryAddress").value,
  };

  closeConfirmModal();
  handlePaymentSuccess({ razorpay_payment_id: paymentId }, orderData);
}

// CLOSE CONFIRM MODAL
function closeConfirmModal() {
  const confirmModal = document.getElementById("confirmModal");
  if (confirmModal) {
    confirmModal.remove();
  }
  document.body.style.overflow = "auto";
}

// HANDLE CASH ON DELIVERY
function handleCOD(orderData) {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryCharges = 50;
  const codCharges = 25;
  const totalAmount = subtotal + deliveryCharges + codCharges;

  // Show COD confirmation
  const codHTML = `
    <div class="modal" id="codModal" style="display: block;">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Cash on Delivery</h2>
          <span class="close" onclick="closeCODModal()">&times;</span>
        </div>
        <div class="modal-body">
          <div class="cod-confirmation">
            <h4>🚚 Order Confirmation</h4>
            <p><strong>Total Amount: ₹${totalAmount}</strong></p>
            <p>Delivery Charges: ₹${deliveryCharges}</p>
            <p>COD Charges: ₹${codCharges}</p>
          </div>
          <div class="cod-note">
            <p><strong>Important:</strong></p>
            <p>• Please keep exact change ready</p>
            <p>• Our delivery executive will collect ₹${totalAmount} at your doorstep</p>
            <p>• Delivery within 2-3 working days</p>
            <p>• You can inspect the flowers before payment</p>
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <button class="btn-secondary" onclick="closeCODModal()">Cancel</button>
            <button class="btn-primary" onclick="confirmCOD(${totalAmount})">Confirm COD Order</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", codHTML);
  document.body.style.overflow = "hidden";
}

// CLOSE COD MODAL
function closeCODModal() {
  const codModal = document.getElementById("codModal");
  if (codModal) {
    codModal.remove();
  }
  document.body.style.overflow = "auto";
}

// CONFIRM COD ORDER
function confirmCOD(amount) {
  const orderId = "COD_" + Date.now();
  const orderData = {
    customerName: document.getElementById("customerName").value,
    customerEmail: document.getElementById("customerEmail").value,
    customerPhone: document.getElementById("customerPhone").value,
    deliveryAddress: document.getElementById("deliveryAddress").value,
  };

  closeCODModal();

  // Clear cart
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  // Close checkout modal
  closeCheckout();

  // Show success message for COD
  showCODSuccessMessage(orderId, orderData, amount);
}

// SHOW COD SUCCESS MESSAGE
function showCODSuccessMessage(orderId, orderData, amount) {
  const successHTML = `
    <div class="modal" id="successModal" style="display: block;">
      <div class="modal-content">
        <div class="modal-header">
          <h2>🎉 Order Placed Successfully!</h2>
          <span class="close" onclick="closeSuccessModal()">&times;</span>
        </div>
        <div class="modal-body">
          <div class="success-message">
            <h4>Cash on Delivery Order Confirmed</h4>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Amount to Pay:</strong> ₹${amount}</p>
            <p><strong>Delivery Address:</strong> ${orderData.deliveryAddress}</p>
            <p>We'll contact you at ${orderData.customerPhone} to confirm delivery time.</p>
          </div>
          <div class="cod-note">
            <p><strong>What's Next?</strong></p>
            <p>• We'll call you within 2 hours to confirm your order</p>
            <p>• Delivery within 2-3 working days</p>
            <p>• Keep ₹${amount} ready for our delivery executive</p>
            <p>• You can inspect flowers before making payment</p>
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <button class="btn-primary" onclick="closeSuccessModal()">Continue Shopping</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", successHTML);
  document.body.style.overflow = "hidden";
}

// RAZORPAY PAYMENT INTEGRATION
function initiatePayment(orderData) {
  const deliveryCharges = 50;
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalAmount = subtotal + deliveryCharges;

  const options = {
    key: "rzp_test_1234567890", // Replace with your Razorpay key
    amount: totalAmount * 100, // Amount in paise
    currency: "INR",
    name: "Swami Flowers",
    description: "Fresh Flowers & Plants",
    image: "https://via.placeholder.com/100x100/ff69b4/ffffff?text=SF",
    order_id: "order_" + Date.now(), // Generate order ID
    handler: function (response) {
      handlePaymentSuccess(response, orderData);
    },
    prefill: {
      name: orderData.customerName,
      email: orderData.customerEmail,
      contact: orderData.customerPhone,
    },
    notes: {
      address: orderData.deliveryAddress,
      items: cart.map((item) => `${item.name} (${item.quantity})`).join(", "),
    },
    theme: {
      color: "#ff69b4",
    },
    modal: {
      ondismiss: function () {
        showNotification("Payment cancelled", "error");
      },
    },
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

// HANDLE PAYMENT SUCCESS
function handlePaymentSuccess(paymentResponse, orderData) {
  // Here you would typically send the payment details to your server
  console.log("Payment successful:", paymentResponse);

  // Clear cart
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  // Close checkout modal
  closeCheckout();

  // Show success message
  showSuccessMessage(paymentResponse.razorpay_payment_id, orderData);
}

// SHOW SUCCESS MESSAGE
function showSuccessMessage(paymentId, orderData) {
  const successHTML = `
    <div class="modal" id="successModal" style="display: block;">
      <div class="modal-content">
        <div class="modal-header">
          <h2>🎉 Order Confirmed!</h2>
          <span class="close" onclick="closeSuccessModal()">&times;</span>
        </div>
        <div class="modal-body">
          <div class="success-message">
            <h4>Thank you for your order!</h4>
            <p>Payment ID: ${paymentId}</p>
            <p>Your beautiful flowers will be delivered to:</p>
            <p><strong>${orderData.deliveryAddress}</strong></p>
            <p>We'll contact you at ${orderData.customerPhone} for delivery updates.</p>
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <button class="btn-primary" onclick="closeSuccessModal()">Continue Shopping</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", successHTML);
  document.body.style.overflow = "hidden";
}

// CLOSE SUCCESS MODAL
function closeSuccessModal() {
  const successModal = document.getElementById("successModal");
  if (successModal) {
    successModal.remove();
  }
  document.body.style.overflow = "auto";
}

// CHECKOUT FORM SUBMISSION
document.addEventListener("DOMContentLoaded", function () {
  // Update cart count on page load
  updateCartCount();

  // Checkout form handler
  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const orderData = {
        customerName: document.getElementById("customerName").value,
        customerEmail: document.getElementById("customerEmail").value,
        customerPhone: document.getElementById("customerPhone").value,
        deliveryAddress: document.getElementById("deliveryAddress").value,
      };

      // Validate form
      if (
        !orderData.customerName ||
        !orderData.customerEmail ||
        !orderData.customerPhone ||
        !orderData.deliveryAddress
      ) {
        showNotification("Please fill all required fields", "error");
        return;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(orderData.customerEmail)) {
        showNotification("Please enter a valid email address", "error");
        return;
      }

      // Validate phone
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(orderData.customerPhone)) {
        showNotification("Please enter a valid 10-digit phone number", "error");
        return;
      }

      // Get selected payment method
      const paymentMethod =
        document.querySelector('input[name="paymentMethod"]:checked')?.value ||
        "upi";

      // Handle different payment methods
      switch (paymentMethod) {
        case "upi":
          handleUPIPayment(orderData);
          break;
        case "card":
        case "netbanking":
          initiatePayment(orderData); // Use Razorpay for cards and netbanking
          break;
        case "cod":
          handleCOD(orderData);
          break;
        default:
          showNotification("Please select a payment method", "error");
      }
    });
  }

  // Payment method change handler
  document.addEventListener("change", function (e) {
    if (e.target.name === "paymentMethod") {
      const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const deliveryCharges = 50;
      updateTotalWithPaymentMethod(subtotal, deliveryCharges);
    }
  });

  // Close modals when clicking outside
  window.addEventListener("click", function (event) {
    const cartModal = document.getElementById("cartModal");
    const checkoutModal = document.getElementById("checkoutModal");

    if (event.target === cartModal) {
      closeCart();
    }
    if (event.target === checkoutModal) {
      closeCheckout();
    }
  });
});

// FORM VALIDATION
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;

  if (name === "" || email === "") {
    showNotification("Please fill all fields", "error");
    return;
  }

  showNotification("Form submitted successfully!", "success");

  // Reset form
  this.reset();
});
// ORDER NOW FUNCTIONALITY
function orderNow(itemName) {
  console.log("Order now clicked for:", itemName);
  const product = products[itemName];
  if (!product) {
    console.error("Product not found:", itemName);
    showNotification("Product not found!", "error");
    return;
  }

  // Clear current cart and add only this item
  cart = [
    {
      name: product.name,
      price: product.price,
      quantity: 1,
    },
  ];

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  // Show notification
  showNotification(`${itemName} added for quick order!`, "success");

  // Directly open checkout modal
  setTimeout(() => {
    displayCheckoutItems();
    document.getElementById("checkoutModal").style.display = "block";
    document.body.style.overflow = "hidden";
  }, 500);
}

// QUICK ORDER MODAL (Alternative approach)
function showQuickOrderModal(itemName) {
  const product = products[itemName];
  if (!product) return;

  const quickOrderHTML = `
    <div class="modal" id="quickOrderModal" style="display: block;">
      <div class="modal-content">
        <div class="modal-header">
          <h2>🚀 Quick Order</h2>
          <span class="close" onclick="closeQuickOrderModal()">&times;</span>
        </div>
        <div class="modal-body">
          <div class="quick-order-item">
            <h3>${product.name}</h3>
            <p class="quick-order-price">₹${product.price}</p>
            <div class="quantity-selector">
              <label>Quantity:</label>
              <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuickOrderQuantity(-1)">-</button>
                <span class="quantity-display" id="quickOrderQuantity">1</span>
                <button class="quantity-btn" onclick="updateQuickOrderQuantity(1)">+</button>
              </div>
            </div>
            <div class="quick-order-total">
              <strong>Total: ₹<span id="quickOrderTotal">${product.price}</span></strong>
            </div>
          </div>
          
          <div class="quick-order-form">
            <h4>Delivery Details</h4>
            <div class="form-group">
              <input type="text" id="quickName" placeholder="Your Name" required />
            </div>
            <div class="form-group">
              <input type="tel" id="quickPhone" placeholder="Phone Number" required />
            </div>
            <div class="form-group">
              <textarea id="quickAddress" placeholder="Delivery Address" rows="2" required></textarea>
            </div>
          </div>
          
          <div class="quick-order-actions">
            <button class="btn-secondary" onclick="closeQuickOrderModal()">Cancel</button>
            <button class="btn-primary" onclick="processQuickOrder('${itemName}')">Place Order</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", quickOrderHTML);
  document.body.style.overflow = "hidden";
}

// UPDATE QUICK ORDER QUANTITY
let quickOrderQuantity = 1;
function updateQuickOrderQuantity(change) {
  quickOrderQuantity += change;
  if (quickOrderQuantity < 1) quickOrderQuantity = 1;

  const quantityDisplay = document.getElementById("quickOrderQuantity");
  const totalDisplay = document.getElementById("quickOrderTotal");

  if (quantityDisplay) quantityDisplay.textContent = quickOrderQuantity;

  // Calculate total (assuming we have the product price)
  const priceElement = document.querySelector(".quick-order-price");
  if (priceElement && totalDisplay) {
    const price = parseInt(priceElement.textContent.replace("₹", ""));
    const deliveryCharges = 50;
    const total = price * quickOrderQuantity + deliveryCharges;
    totalDisplay.textContent = total;
  }
}

// PROCESS QUICK ORDER
function processQuickOrder(itemName) {
  const product = products[itemName];
  const name = document.getElementById("quickName").value;
  const phone = document.getElementById("quickPhone").value;
  const address = document.getElementById("quickAddress").value;

  // Validate form
  if (!name || !phone || !address) {
    showNotification("Please fill all fields", "error");
    return;
  }

  // Validate phone
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    showNotification("Please enter a valid 10-digit phone number", "error");
    return;
  }

  // Create order
  cart = [
    {
      name: product.name,
      price: product.price,
      quantity: quickOrderQuantity,
    },
  ];

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  // Close quick order modal
  closeQuickOrderModal();

  // Show success and proceed to payment
  showNotification("Order details saved! Choose payment method.", "success");

  // Pre-fill checkout form
  setTimeout(() => {
    document.getElementById("customerName").value = name;
    document.getElementById("customerPhone").value = phone;
    document.getElementById("deliveryAddress").value = address;

    // Open checkout
    displayCheckoutItems();
    document.getElementById("checkoutModal").style.display = "block";
    document.body.style.overflow = "hidden";
  }, 1000);
}

// CLOSE QUICK ORDER MODAL
function closeQuickOrderModal() {
  const quickOrderModal = document.getElementById("quickOrderModal");
  if (quickOrderModal) {
    quickOrderModal.remove();
  }
  document.body.style.overflow = "auto";
  quickOrderQuantity = 1; // Reset quantity
}

// TEST FUNCTION TO VERIFY BUTTONS WORK (Console logging only)
function testButtons() {
  console.log("Testing button functionality...");

  // Test if functions exist without calling them
  try {
    if (typeof addToCart === "function") {
      console.log("✅ addToCart function is defined");
    } else {
      console.error("❌ addToCart function not found");
    }
  } catch (error) {
    console.error("❌ addToCart function error:", error);
  }

  // Test if orderNow function exists without calling it
  try {
    if (typeof orderNow === "function") {
      console.log("✅ orderNow function is defined");
    } else {
      console.error("❌ orderNow function not found");
    }
  } catch (error) {
    console.error("❌ orderNow function error:", error);
  }

  // Test if cart functions exist
  if (typeof openCart === "function") {
    console.log("✅ openCart function is defined");
  }

  if (typeof updateCartCount === "function") {
    console.log("✅ updateCartCount function is defined");
  }

  console.log("🎯 All function tests completed (no actions triggered)");
}

// Auto-test on page load (safe version - no modals will open)
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    console.log("🧪 Running safe button tests...");
    testButtons();
  }, 1000);
});
