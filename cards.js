"use strict";

function addCard() {
  //function does not run if the entire deck is run through.
  if (cardCount === 81) {
    return;
  }
  //based on the charactaristics of the next card in the deck, put card image in specified grid location to represent that card. Since we are using separate bootstrap icons for the same shape but different "fill", we need three different "create card" functions.
  let card = deck[cardCount];
  if (card["fill"] === "none") {
    //add div to the grid with an id equal to the cards position in the deck (id is helpful for debugging)
    $(
      `<div id=${cardCount} class="col-3 unselected px-1 py-1"></div>`
    ).appendTo($(".row"));
    $(`<div id="card${cardCount}" class="gameCard"></div>`).appendTo(
      `#${cardCount}`
    );
    createOutlineCard();
  } else if (card["fill"] === "fill") {
    $(
      `<div id=${cardCount} class="col-3 unselected px-1 py-1"></div>`
    ).appendTo($(".row"));
    $(`<div id="card${cardCount}" class="gameCard"></div>`).appendTo(
      `#${cardCount}`
    );
    createFillCard();
  } else if (card["fill"] === "back") {
    $(
      `<div id=${cardCount} class="col-3 unselected px-1 py-1" ></div>`
    ).appendTo($(".row"));
    $(
      `<div id="card${cardCount}" class="gameCard" style="background-color:${card["color"]}"></div>`
    ).appendTo(`#${cardCount}`);
    createBackgroundCard();
  }
}

function createOutlineCard() {
  let card = deck[cardCount];
  //Place bootstrap icon(s) in grid and style in accordance with the charactaristics of the card
  for (let i = 0; i < card["number"]; i++) {
    $(`<i class="bi"></i>`)
      .addClass(`bi-${card["shape"]}`)
      .addClass(card["color"])
      .appendTo($(`#card${cardCount}`));
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
      .appendTo($(`#card${cardCount}`));
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
      .appendTo($(`#card${cardCount}`));
  }
  board.push(deck[cardCount]);
  cardCount++;
}
