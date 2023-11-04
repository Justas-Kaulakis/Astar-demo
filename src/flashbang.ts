const flashbang = () => {
  const flashbang = document.querySelector(".flashbang")!;
  flashbang.classList.add("active");
  setTimeout(() => {
    flashbang.classList.remove("active");
  }, 2000);
};

export default flashbang;
