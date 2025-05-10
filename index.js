"use strict";

fetch("./data.json")
  .then((response) => response.json())
  .then((menu) => {
    const menuList = menu
      .map(
        (item) =>
          ` <figure class="w-full max-w-[320px] h-auto gap-2 mb-5 relative">
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
                    class="cart absolute flex justify-center items-center gap-2 top-[68%] left-[20%] text-sm bg-white border-[1px] border-[#c73a0f] py-4 px-6 rounded-full text-white"
                >
                  <img src="./assets/images/icon-add-to-cart.svg" />

                  <span class="text-black active:text-[#c73a0f] hover:text-[#c73a0f]">
                      Add to Cart</span
                   >
                </button>
                <article
                    class="counter hidden absolute flex justify-center items-center gap-10 top-[68%] left-[20%] text-sm bg-[#c73a0f] py-4 px-4 rounded-full"
                >
                  <button
                    class="reduceQuantity active:bg-white border-[1px] border-white rounded-full grid place-items-center w-6 h-6"
                  >
                    <img
                      src="./assets/images/icon-decrement-quantity.svg"
                      class="active:fill-[#c73a0f]"
                    />
                </button>

                <span class="quantity text-white" ></span>
                <button
                  class="addQuantity active:bg-white border-[1px] border-white rounded-full h-6 w-6 grid place-items-center"
                  >
                  <img
                     src="./assets/images/icon-increment-quantity.svg"
                       class="active:fill-[#c73a0f]"
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
    const overlay = document.querySelector(".overlay");
    const orderCard = document.querySelector(".order-card");

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

      const itemPrice = cart
        .reduce((sum, item) => sum + item.quantity * item.price, 0)
        .toFixed(2);
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
              <span class="text-[#c9aea6] text-[12px]">@ $${item.price}.00</span>
              <span class="text-[87635a] text-[12px] font-medium" id="totalPrice"
                >$${itemPrice}</span
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
      const grandTotalValue = cart
        .reduce((sum, item) => sum + item.quantity * item.price, 0)
        .toFixed(2);
      grandTotal.innerHTML = ` 

         <article class="flex justify-between my-4">
           <p>Order Total</p>
          <span class="font-bold" id="grand-total-value">$${grandTotalValue}</span>
         </article>
        
          
        <figure
          class="flex gap-2 items-center bg-[#f4edeb] p-2 justify-center rounded-[10px] mt-8 mb-4"
        >
          <img
            src="/assets/images/icon-carbon-neutral.svg"
            alt="carbon-neutral"
          />
          <figcaption class="text-[14px]">
            This is a <span class="font-bold">carbon neutral </span> delivery
          </figcaption>
        </figure>
        <article class="flex justify-center">
          <button
            class="confirm-btn text-white bg-[#c73a0f] py-2 px-20 text-nowrap text-md rounded-full active:bg-[#260f08]"
          >
            Confirm Order
          </button>
        </article>`;
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

    /**********************Confirm Order***************************/

    grandTotal.addEventListener("click", (e) => {
      const confirmOrderBtn = e.target.closest(".confirm-btn");
      if (!confirmOrderBtn) return;
      overlay.classList.remove("hidden");

      orderCard.innerHTML = `${cart
        .map(
          (item) =>
            `<article class="flex bg-[#f4edeb]  p-4 justify-between items-center border-b-[1px] border-[c9aea6]">
          
              <figure class="flex gap-4 items-center">
                <img
                  src=${item.image.thumbnail}
                  alt="cart-item image"
                  class="w-full max-w-[100px] md:max-w-50 h-auto object-cover rounded-md"
                />
                <figcaption>
                  <p class="text-[#260f08] font-medium truncate...">${
                    item.name
                  }</p>
                  <p>
                    <span class="cart-quantity text-[#c73a0f] text-[12px]">
                      ${item.quantity}X
                    </span>
                    <span class="text-[#c9aea6] text-[12px]">
                      @ $${item.price}.00
                    </span>
                  </p>
                </figcaption>
              </figure>
              <span class="text-[87635a] text-[12px] font-medium" id="totalPrice">
                $${item.price * item.quantity}.00
              </span>
            </article>`
        )
        .join("")}

      
          <article class="flex bg-[#f4edeb] justify-between py-6 px-4">
                <p>Order Total</p>
              <span class="font-bold" >$${cart
                .reduce((sum, item) => sum + item.quantity * item.price, 0)
                .toFixed(2)}</span>
              </article>
      
            <article class="flex justify-center mt-4">
              <button
                class="start-order-btn text-white bg-[#c73a0f] py-2 px-20 md:px-40 text-nowrap text-md rounded-full active:bg-[#260f08]"
              >
                Start New Order
              </button>
            </article>
           `;
    });
    /**********************Confirm Order  Ends***************************/

    orderCard.addEventListener("click", (e) => {
      const resetBtn = e.target.closest(".start-order-btn");
      overlay.classList.add("hidden");

      emptyCart.classList.remove("hidden");
      cart = [];
      cartDetails.innerHTML = "";
      grandTotal.innerHTML = "";
      orderCard.innerHTML = "";
      quantityDisplays.forEach((display) => (display.textContent = 0));
      counters.forEach((counter) => counter.classList.add("hidden"));

      addCartBtns.forEach((btn) => btn.classList.remove("hidden"));
    });
  })
  .catch((err) => {
    return { err: "Error fetching menu data:" };
  });
