"use strict";

function createOutlineCard() {
  let card = deck[cardCount];
  for (let i = 0; i < card["number"]; i++) {
    $(`<i class="bi"></i>`)
      .addClass(`bi-${card["shape"]}`)
      .addClass(card["color"])
      .appendTo($(`#${cardCount}`));
  }
  board.push(deck[cardCount]);
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
