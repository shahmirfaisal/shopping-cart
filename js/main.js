window.onload = () => {
  let modal_body = document.querySelector("#idmodal .modal-body");
  let imgs = document.querySelectorAll(".items .row img");
  let navItem = document.querySelector(".nav-item");
  let backDrop = document.querySelector(".backdrop");
  let cart = document.querySelector(".cart");
  let deleteAll = document.querySelector(".delete-all");

  imgs.forEach(v => v.addEventListener("click", showDetail));
  navItem.addEventListener("click", openCart);
  backDrop.addEventListener("click", closeCart);
  document
    .querySelector(".cart .close-cart")
    .addEventListener("click", closeCart);
  deleteAll.addEventListener("click", deleteAllItems);

  // Showing details in modal
  function showDetail(e) {
    let nodes = e.target.nextSibling.nextSibling.childNodes;
    showModal(nodes, e.target.src, "item");
  }

  function showModal(nodes, src, type, item) {
    if (type === "item") {
      modal_body.innerHTML = `
    <i class="fas fa-times close" data-dismiss="modal"></i>
    <img src=${src} />
    <h3 class="text-center my-5">${nodes[1].innerHTML}</h3>
    <h5 class="font-weight-bold">Details:</h5>
    <p>${nodes[3].innerHTML}</p>
    <p><span class="font-weight-bold">Price:</span> ${nodes[5].innerHTML}</p>
    <button class="add-to-cart" data-toggle="modal" data-target="#idmodal">Add to cart</button>
    `;
      document
        .querySelector(".add-to-cart")
        .addEventListener("click", addItemToCart);
    } else {
      // reusing the modal
      modal_body.innerHTML = `
    <i class="fas fa-times close" data-dismiss="modal"></i>
    <img src=${src} />
    <h3 class="text-center my-5">${nodes[1].innerHTML}</h3>
    <h5 class="font-weight-bold">Details:</h5>
    <p>${nodes[3].innerHTML}</p>
    <p><span class="font-weight-bold">Price:</span> $${nodes[5].innerHTML.slice(
      1
    ) * item}</p>
    <p><span class="font-weight-bold">Items: </span> ${item}</p>
    `;
    }
  }

  // Opening cart
  function openCart() {
    backDrop.style.display = "block";
    cart.style.transform = "translateX(0)";
  }
  // Closing cart
  function closeCart() {
    backDrop.style.display = "none";
    cart.style.transform = "translateX(130%)";
  }

  // idz for creating unique items in cart
  if (localStorage.getItem("id") > 0) {
  } else {
    localStorage.setItem("id", 0);
  }

  // Adding items to cart
  function addItemToCart(e) {
    // accessing the unique id from local storage
    let id = localStorage.getItem("id");
    id++;
    localStorage.setItem("id", id);

    let node = e.target.parentNode.childNodes;
    let div = document.createElement("div");
    div.id = id;
    div.className = "item row justify-content-between";
    div.innerHTML = `
    <div class="col--5">
    <img src="${node[3].src}" class="mr-4" />
  </div>
  <div class="col--6">
    <p>Items: </p><p>1</p>
    <button class="plus mr-2 ml-4">+</button>
    <button class="minus">-</button><br />
    <p class="detail" data-toggle="modal" data-target="#idmodal">Show Details</p>
    <br />
    <p class="remove">Remove Item</p>
  </div>
    `;
    cart.appendChild(div);

    addEvents();

    Storage.setItems({ src: node[3].src, id });

    displayDeleteBtn();

    alertMsg("Item added to cart.");
    console.log(div);
  }

  function addEvents() {
    // adding event listeners when the items are created
    // incrementing items
    document
      .querySelectorAll(".plus")
      .forEach(v => v.addEventListener("click", incrementItem));
    // decrementing items
    document
      .querySelectorAll(".minus")
      .forEach(v => v.addEventListener("click", decrementItem));
    // showing details
    document
      .querySelectorAll(".detail")
      .forEach(v => v.addEventListener("click", showCartItemDetail));
    // removing items
    document
      .querySelectorAll(".remove")
      .forEach(v => v.addEventListener("click", removeItem));
  }

  function incrementItem(e) {
    e.target.previousSibling.previousSibling.innerHTML++;
    console.log(e.target.previousSibling.previousSibling.innerHTML);
  }

  function decrementItem(e) {
    let node =
      e.target.previousSibling.previousSibling.previousSibling.previousSibling;
    if (node.innerHTML > 1) {
      node.innerHTML--;
    }
  }

  function removeItem(e) {
    let div = e.target.parentNode.parentNode;
    cart.removeChild(div);

    displayDeleteBtn();

    let id = e.target.parentNode.parentNode.id;
    let src = e.target.parentNode.parentNode.childNodes[1].childNodes[1].src;
    Storage.removeItems({ src, id });

    alertMsg("Item removed from cart.");
  }

  function showCartItemDetail(e) {
    let src =
      e.target.parentNode.previousSibling.previousSibling.childNodes[1].src;
    let index = src.indexOf("imag");
    let img = document.querySelector(
      `.items .row img[src=".${src.slice(index - 1)}"]`
    );
    let nodes = img.nextSibling.nextSibling.childNodes;
    showModal(
      nodes,
      img.src,
      "cartItem",
      e.target.parentNode.childNodes[2].innerHTML
    );
  }

  function deleteAllItems() {
    let nodes = document.querySelectorAll(".item");
    for (let child of nodes) {
      cart.removeChild(child);
    }
    displayDeleteBtn();

    localStorage.clear();

    alertMsg("All items are removed");
  }

  function displayDeleteBtn() {
    let nodes = document.querySelectorAll(".item");
    let empty = document.querySelector(".empty");
    if (nodes.length === 0) {
      deleteAll.style.display = "none";
      empty.style.display = "block";
    } else {
      deleteAll.style.display = "inline";
      empty.style.display = "none";
    }
  }

  // Alert
  function alertMsg(msg) {
    var alert;
    setTimeout(() => {
      alert = document.createElement("div");
      alert.innerHTML = msg;
      alert.classList.add("alert-msg");
      document.body.appendChild(alert);
    }, 400);

    setTimeout(() => document.body.removeChild(alert), 2500);
  }

  // Storage
  class Storage {
    static getItems() {
      let items;

      if (localStorage.getItem("items") == null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }

      return items;
    }

    static setItems(item) {
      let items = Storage.getItems();
      items.push(item);
      localStorage.setItem("items", JSON.stringify(items));
    }

    static removeItems(item) {
      let items = Storage.getItems();
      items = items.filter(v => v.id != item.id && v.src != item.src);
      localStorage.setItem("items", JSON.stringify(items));
    }
  }

  class UI {
    static displayItems(item) {
      let div = document.createElement("div");
      div.className = "item row justify-content-between";
      div.innerHTML = `
    <div class="col--5">
    <img src="${item.src}" class="mr-4" />
  </div>
  <div class="col--6">
    <p>Items: </p><p>1</p>
    <button class="plus mr-2 ml-4">+</button>
    <button class="minus">-</button><br />
    <p class="detail" data-toggle="modal" data-target="#idmodal">Show Details</p>
    <br />
    <p class="remove">Remove Item</p>
  </div>
    `;
      cart.appendChild(div);

      addEvents();

      displayDeleteBtn();
    }
  }

  // smooth scrolling
  $(document).ready(function() {
    $(".get-started").on("click", function(e) {
      if (this.hash !== "") {
        e.preventDefault();
        let hash = this.hash;
        $("html,body").animate(
          {
            scrollTop: $(hash).offset().top
          },
          800,
          function() {
            window.location.hash = hash;
          }
        );
      }
    });
  });

  // displaying stored items
  let items = Storage.getItems();
  items.forEach(v => UI.displayItems(v));
};
