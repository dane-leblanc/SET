"use strict";

function createOutlineCard() {
  let card = deck[cardCount];
  //Place bootstrap icon(s) in grid and style in accordance with the charactaristics of the card
  for (let i = 0; i < card["number"]; i++) {
    $(`<i class="bi"></i>`)
      .addClass(`bi-${card["shape"]}`)
      .addClass(card["color"])
      .appendTo($(`#${cardCount}`));
  }
  //include these card objects in the board array.
  board.push(deck[cardCount]);
  //each time a new card is put on the board, increase the card count (representing which card in the deck is up next)
  cardCount++;
}

function createFillCard() {
  let card = deck[cardCount];
  for (let i = 0; i < card["number"]; i++) {
    $(`<i class="bi"></i>`)
      .addClass(`bi-${card["shape"]}-fill`)
      .addClass(card["color"])
      .appendTo($(`#${cardCount}`));
  }
  board.push(deck[cardCount]);
  cardCount++;
}

function createBackgroundCard() {
  let card = deck[cardCount];
  for (let i = 0; i < card["number"]; i++) {
    $(`<i class="bi"></i>`)
      .addClass(`bi-${card["shape"]}`)
      .addClass("white")
      .appendTo($(`#${cardCount}`));
  }
  board.push(deck[cardCount]);
  cardCount++;
}
