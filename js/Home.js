// slider

let slide_data = [
  {
    src: "./img/slide1.jpg",
    title: "A Perfect Cup of Coffee",
    copy: "Start your day with the rich aroma and smooth taste of freshly brewed coffee.",
  },
  {
    src: "./img/slide2.jpg",
    title: "Coffee Bliss",
    copy: "Savor the warmth, embrace the aroma—every sip tells a story.",
  },
  {
    src: "./img/slide4.jpg",
    title: "Brewed to Perfection",
    copy: "A moment of peace in every cup—indulge in the magic of coffee.",
  },
];

let slides = [],
  captions = [],
  currentIndex = 0;

let autoplay = setInterval(() => requestAnimationFrame(nextSlide), 4000);
let container = document.getElementById("container");
let leftSlider = document.getElementById("left-col");
let down_button = document.getElementById("down_button");

down_button.addEventListener("click", function (e) {
  e.preventDefault();
  clearInterval(autoplay);
  nextSlide();
  autoplay = setInterval(() => requestAnimationFrame(nextSlide), 4000);
});

function preloadImages(imageArray, callback) {
  let loadedImages = 0;
  let totalImages = imageArray.length;
  let images = [];

  imageArray.forEach((image, index) => {
    images[index] = new Image();
    images[index].src = image.src;
    images[index].onload = () => {
      loadedImages++;
      if (loadedImages === totalImages) {
        callback(images);
      }
    };
  });
}

function lazyLoadImages() {
  slides.forEach((slide, index) => {
    if (!slide.dataset.loaded) {
      let img = new Image();
      img.src = slide_data[index].src;
      img.onload = () => {
        slide.style.backgroundImage = `url('${slide_data[index].src}')`;
        slide.dataset.loaded = "true";
      };
    }
  });
}

slide_data.forEach((data, index) => {
  let slide = document.createElement("div"),
    caption = document.createElement("div"),
    slide_title = document.createElement("div"),
    slide_copy = document.createElement("div");

  slide.classList.add("slide");
  caption.classList.add("caption");
  slide_title.classList.add("caption-heading");
  slide_copy.classList.add("caption-subhead");

  slide_title.innerHTML = `<h1>${data.title}</h1>`;
  slide_copy.innerHTML = `<span>${data.copy}</span>`;

  if (index === 0) {
    slide.classList.add("current");
    caption.classList.add("current-caption");
  } else {
    slide.classList.add("hidden");
    caption.classList.add("hidden-caption");
  }

  caption.appendChild(slide_title);
  caption.appendChild(slide_copy);

  slides.push(slide);
  captions.push(caption);
  leftSlider.appendChild(slide);
  container.appendChild(caption);
});

preloadImages(slide_data, (loadedImages) => {
  slides.forEach((slide, index) => {
    slide.style.backgroundImage = `url('${loadedImages[index].src}')`;
  });
  nextSlide();
  lazyLoadImages();
});

function nextSlide() {
  let prevIndex = currentIndex;
  currentIndex = (currentIndex + 1) % slides.length;

  slides[prevIndex].classList.remove("current");
  slides[prevIndex].classList.add("hidden");

  slides[currentIndex].classList.remove("hidden");
  slides[currentIndex].classList.add("current");

  captions[prevIndex].classList.remove("current-caption");
  captions[prevIndex].classList.add("hidden-caption");

  captions[currentIndex].classList.remove("hidden-caption");
  captions[currentIndex].classList.add("current-caption");

  lazyLoadImages();
}

// Display Product
document.addEventListener("DOMContentLoaded", function () {
  fetch("https://api.sampleapis.com/coffee/hot")
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const container = document.getElementById("products-container");

      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      data.slice(0, 20).forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("col-12", "col-md-6", "col-lg-4", "mb-4");

        let isInWishlist = wishlist.some(item => item.id === product.id);
        let heartClass = isInWishlist ? "text-danger" : "";

        productCard.innerHTML = `
          <div class="product-card">
            <img src="${product.image}" alt="${product.title}">
            <div class="heart ${heartClass}" onclick="toggleWishlist(this, ${product.id}, '${product.title}', '${product.image}', '${product.description}')">
              <i class="fas fa-heart"></i>
            </div>
            <h5 class="h5 mt-2">${product.title}</h5>
            <p class="p-3 h6 text-fade text-center text-truncate mb-0 pb-1" 
              data-bs-toggle="tooltip" data-bs-placement="top" title="${product.description}">
              ${product.description}
            </p>
            <div class="shop-cart" onclick="addToCart('${product.id}')">
              <i class="fas fa-shopping-cart"></i>
            </div>
          </div>
        `;
        container.appendChild(productCard);
      });

      var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      var tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    })
    .catch(error => console.error("Error fetching data:", error));
});

// wishlist Logic
function toggleWishlist(element, id, title, image, description) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  let index = wishlist.findIndex(item => item.id === id);
  if (index === -1) {
    wishlist.push({ id, title, image, description });
    element.classList.add("text-danger");
  } else {
    wishlist.splice(index, 1);
    element.classList.remove("text-danger");
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// Display Wishlist
function displayWishlist() {
  const wishlistContainer = document.getElementById("wishlist-container");
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  wishlistContainer.innerHTML = ""; 

  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = `
      <div class="text-center mt-5">
        <h4 class="text-muted">No favorite items yet</h4>
      </div>
    `;
    document.getElementById("wishlist").classList.add("empty-wishlist");
    return;
  }

  document.getElementById("wishlist").classList.remove("empty-wishlist");

  wishlist.forEach(product => {
    const productCard = document.createElement("div");
    productCard.classList.add("col-12", "col-md-6", "col-lg-4", "mb-4");
    productCard.innerHTML = `
      <div class="product-card">
        <img src="${product.image}" alt="${product.title}">
        <div class="heart text-danger" onclick="removeFromWishlist(${product.id})">
          <i class="fas fa-heart"></i>
        </div>
        <h5 class="h5 mt-2">${product.title}</h5>
        <p class="p-3 h6 text-fade text-center text-truncate mb-0 pb-1" 
          data-bs-toggle="tooltip" data-bs-placement="top" title="${product.description}">
          ${product.description}
        </p>
        <div class="shop-cart" onclick="addToCart('${product.id}')">
          <i class="fas fa-shopping-cart"></i>
        </div>
      </div>
    `;
    wishlistContainer.appendChild(productCard);
  });
}

// remove from wishlist 
function removeFromWishlist(id) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist = wishlist.filter(product => product.id !== id);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  displayWishlist(); // update display after remove
}

function addToCart(productId) {
  alert("Added to cart: " + productId);
}
