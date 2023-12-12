const burgerMenu = document.querySelector(".burger__menu");
const burgerButton = document.querySelector(".burger__button");

burgerButton.addEventListener("click", () => {
  burgerMenu.classList.toggle("burger__menu_opened");
});
