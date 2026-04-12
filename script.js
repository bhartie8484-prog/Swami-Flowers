// ADD TO CART
function addToCart(item){
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(item + " added to cart!");
}

// FORM VALIDATION
document.getElementById("contactForm").addEventListener("submit", function(e){
  e.preventDefault();

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;

  if(name === "" || email === ""){
    alert("Please fill all fields");
    return;
  }

  alert("Form submitted successfully!");
});