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
                    class="addQuantity active:bg-white border-[1px] border-white rounded-full px-[7px] py-3"
                   "
                  >
                    <img
                      src="./assets/images/icon-decrement-quantity.svg"
                      class="active:fill-[#c73a0f]"
                    />
                </button>

                <span class="text-white" id="quantity"></span>
                <button
                  class="reduceQuantity active:bg-white border-[1px] border-white rounded-full px-[7px] py-2"
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

    let quantity = document.querySelectorAll("#quantity");
    quantity[index].textContent = 0;
    let addCart = document.querySelectorAll(".cart");
    let addQuantity = document.querySelectorAll(".addQuantity");
    let reduceQuantity = document.querySelectorAll(".reduceQuantity");
    let counter = document.querySelectorAll(".counter");

    let itemCount = quantity[index].textContent;
    console.log(itemCount);
    let currentCount = parseInt(itemCount);

    addCart.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        console.log("clicked");

        itemCount = currentCount++;
        console.log(itemCount);

        btn.classList.add("hidden");
        counter[index].classList.remove("hidden");
      });
    });

    addQuantity.forEach((btn, index) => {
      console.log("add");
      btn.addEventListener("click", () => {
        quantity[index].textContent += 1;
      });
    });

    reduceQuantity.forEach((btn, index) => {
      console.log("reduce");
      btn.addEventListener("click", () => {
        if (counter < 0) {
          quantity[index].textContent -= 1;
        } else {
          quantity[index].textContent = 0;
        }
      });
    });
  })
  .catch((err) => {
    return { err: "Error fetching menu data:" };
  });
