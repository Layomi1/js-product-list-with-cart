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
    const grandTotal = document.querySelector(".grand-total");
    const grandTotalValue = document.querySelector("#grand-total-no");

    /*******AddItem item from cart***************/
    addCartBtns.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        btn.classList.add("hidden");
        counters[index].classList.remove("hidden");

        quantityDisplays[index].textContent = 1;
        cart.push({ ...menu[index], quantity: 1 });

        renderCartDetails();
      });
    });

    function renderCartDetails() {
      if (cart.length === 0) {
        emptyCart.classList.remove("hidden");
        cartDetails.innerHTML = "";
        return;
      }
      emptyCart.classList.add("hidden");
      cartDetails.innerHTML = cart
        .map(
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
        )
        .join("");

      renderGrandTotal();
    }

    /*******Remove item from cart***************/
    cartDetails.addEventListener("click", (e) => {
      const cancelBtn = e.target.closest(".remove");
      if (!cancelBtn) return;

      const itemElemnet = cancelBtn.closest("article");
      const itemName = itemElemnet.closest("h5");

      const index = cart.findIndex((item) => item.name === itemName);

      if (index !== 1) {
        cart.splice(index, 1);

        renderCartDetails();
        renderGrandTotal();
      }
    });

    /************Total amount of items in Cart****************/
    function renderGrandTotal() {
      if (cart.length === 0) {
        grandTotal.classList.add("hidden");
        grandTotal.innerHTML = "";
        return;
      }
      grandTotal.classList.remove("hidden");
      const grandTotalValue = cart.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
      grandTotal.innerHTML = ` 
          <p>Order Total</p>
          <span class="font-bold" id="grand-total-value">$${grandTotalValue}.00</span>`;
    }

    /*******Increase item in Counter & cart ***************/
    addQuantityBtns.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        let currentQty = parseInt(quantityDisplays[index].textContent);

        currentQty++;

        quantityDisplays[index].textContent = currentQty;
        const existingItenIndex = cart.findIndex(
          (item) => item.name === menu[index].name
        );

        if (existingItenIndex !== -1) {
          cart[existingItenIndex].quantity = currentQty;
        } else {
          cart.push({ ...menu[index], quantity: currentQty });
        }
        renderCartDetails();
      });
    });

    /*******Reduce item in Counter and Cart***************/
    reduceQuantityBtns.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        let currentQty = parseInt(quantityDisplays[index].textContent);
        const existingItenIndex = cart.findIndex(
          (item) => item.name === menu[index].name
        );
        if (currentQty <= 1) {
          quantityDisplays[index].textContent = 0;
          addCartBtns[index].classList.remove("hidden");
          counters[index].classList.add("hidden");
          cart.splice(existingItenIndex, 1);
        } else {
          currentQty--;
          quantityDisplays[index].textContent = currentQty;
          cart[existingItenIndex].quantity = currentQty;
        }
        renderCartDetails();
      });
    });
  })
  .catch((err) => {
    return { err: "Error fetching menu data:" };
  });
