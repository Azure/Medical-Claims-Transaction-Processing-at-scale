/**
* Theme: T-Wind - Tailwind Admin Dashboard Template
* Author: Mannatthemes
* Component: Carousel
*/

var swiper = new Swiper(".defaultSwiper", {
  autoplay: {
      delay: 2500,
      disableOnInteraction: false,
  },
  navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
  },
});
var swiper = new Swiper(".paginationSwiper", {
  pagination: {
      el: ".swiper-pagination",
  },
   navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
  },
});    
var swiper = new Swiper(".effectSwiper", {
  spaceBetween: 30,
  effect: "fade",
  navigation: {
  nextEl: ".swiper-button-next",
  prevEl: ".swiper-button-prev",
  },
  pagination: {
  el: ".swiper-pagination",
  clickable: true,
  },
});  

var swiper = new Swiper(".thumbsSwiper", {
  spaceBetween: 10,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,
});
var swiper2 = new Swiper(".gallerySwiper", {
  loop: true,
  spaceBetween: 10,
  navigation: {
  nextEl: ".swiper-button-next",
  prevEl: ".swiper-button-prev",
  },
  thumbs: {
  swiper: swiper,
  },
});


