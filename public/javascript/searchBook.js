function searchBooks() {
  var input, filter, cards, cardTitle, i;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  cards = document.querySelectorAll(".card");

  cards.forEach(function (card) {
    cardTitle = card.querySelector(".card-title");
    if (cardTitle.innerText.toUpperCase().indexOf(filter) > -1) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}
