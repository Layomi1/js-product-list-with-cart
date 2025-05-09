"use strict";

fetch("./data.json")
  .then((response) => response.json())
  .then((menu) => {
    const menuList = menu
      .map(
        (item) =>
          ` <figure class="max-w-[300px] h-auto gap-2 mb-5 relative">
              <img
                src=${item.image.thumbnail}
                alt=${item.name}
                class="w-full flex flex-column mb-8 rounded-lg"
              />
              <figcaption>
                <h4 class="text-[#c9aea6] font-bold">${item.category}</h4>
                <h5 class="text-[#260f08] font-bold">${item.name}</h5>
                <small class="text-[#c73a0f] font-bold">$ ${item.price}.00
                </small>
              </figcaption>
              <article class='switch'>
                <button
                    class="cart absolute flex justify-center items-center gap-2 top-[62%] left-[18%] text-sm bg-white border-[1px] border-[#c73a0f] py-4 px-6 rounded-full text-white"
                >
                  <img src="./assets/images/icon-add-to-cart.svg" />

                  <span class="text-black active:text-[#c73a0f] hover:text-[#c73a0f]">
                      Add to Cart</span
                   >
                </button>
                <article
                    class="counter hidden absolute flex justify-center items-center gap-10 top-[62%] left-[10%] text-sm bg-[#c73a0f] py-4 px-6 rounded-full"
                >
                  <button
                    class="reduceQuantity active:bg-white border-[1px] border-white rounded-full px-[7px] py-3"
                  >
                    <img
                      src="./assets/images/icon-decrement-quantity.svg"
                      class="active:fill-[#c73a0f]"
                    />
                </button>

                <span class="quantity text-white" ></span>
                <button
                  class="addQuantity active:bg-white border-[1px] border-white rounded-full px-[7px] py-2"
                  >
                  <img
                     src="./assets/images/icon-increment-quantity.svg"
                       class="active:text-[#c73a0f]"
                  />
                </button>
              </article>
             </article>
          </figure>`
      )
      .join("");

    const catalog = document.querySelector("#catalog");
    catalog.innerHTML = menuList;

    let quantityDisplays = document.querySelectorAll(".quantity");
    let addCartBtns = document.querySelectorAll(".cart");

    let addQuantityBtns = document.querySelectorAll(".addQuantity");
    let reduceQuantityBtns = document.querySelectorAll(".reduceQuantity");
    let counters = document.querySelectorAll(".counter");

    let cart = [];

    let cartDetails = document.querySelector("#cart-details");
    let emptyCart = document.querySelector(".empty-cart");

    /*******AddItem item from cart***************/
    addCartBtns.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        btn.classList.add("hidden");
        counters[index].classList.remove("hidden");

        quantityDisplays[index].textContent = 1;
        cart.push({ ...menu[index], quantity: 1 });
        ``;
        emptyCart.classList.add("hidden");

        cartDetails.innerHTML = cart.map(
          (item) => `
            <article
            class="flex justify-between items-center pb-2 border-b-[1px] border-[c9aea6]"
          >
            <article>
              <h5 class="text-[#260f08]">${item.name}</h5>
              <p>
                <span class="cart-quantity text-[#c73a0f] text-[12px]" 
                  >${item.quantity}X</span
                >
                <span class="text-[#c9aea6] text-[12px]">@ $${
                  item.price
                }.00</span>
                <span class="text-[87635a] text-[12px] font-medium" id="totalPrice"
                  >$${item.price * item.quantity}.00</span
                >
              </p>
            </article>

            <button
              class="remove border-[1px] border-[#c9aea6] grid place-items-center h-4 w-4 rounded-[100%]"
            >
              <img src="/assets/images//icon-remove-item.svg" alt="cancel" />
            </button>
          </article>
        `
        );
      });
    });

    /*******Increase item in cart***************/
    let cartQty = document.querySelectorAll(".cart-quantity");

    const existingItenIndex = cart.findIndex(
      (item) => item.anme === menu[index].name
    );
    addQuantityBtns.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        let currentQty = parseInt(quantityDisplays[index].textContent);

        currentQty++;

        quantityDisplays[index].textContent = currentQty;

        if (existingItenIndex !== -1) {
          cart[existingItenIndex].quantity = currentQty;
        } else {
          cart.push({ ...menu[index], quantity: currentQty });
        }
      });
    });

    /*******Reduce item in Cart***************/
    reduceQuantityBtns.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        let currentQty = parseInt(quantityDisplays[index].textContent);
        if (currentQty <= 1) {
          quantityDisplays[index].textContent = 0;
          addCartBtns[index].classList.remove("hidden");
          counters[index].classList.add("hidden");
          cart.splice(existingItenIndex, 1);
        } else {
          currentQty--;
          quantityDisplays[index].textContent = currentQty;
        }
      });
    });

    /*******Remove item from cart***************/
    let cancelBtns = document.querySelectorAll(".remove");

    cancelBtns.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        console.log("clicked");
        // cart.splice({ ...menu[index] });
      });
    });
  })
  .catch((err) => {
    return { err: "Error fetching menu data:" };
  });
