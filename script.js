"use strict";

const colors = ["red", "green", "blue"];
const shapes = ["circle", "triangle", "square"];
const fills = ["none", "fill", "back"];
const numbers = [1, 2, 3];
const $startBtn = $("#start");
const $addBtn = $("#new-row");
const $hintBtn = $("#hint");
const $container = $("#container");
const $btnContainer = $("#btn-container");

let deck = [];
//board is the collection of cards that are currently showing and in play
let board = [];
//selected is a collection of the cards that user selects for a SET (can be length 1, 2, or 3)
let selected = [];
//card count will represent how deep we are in the deck
let cardCount = 0;
let cardsRemaining = 81;

function makeDeck() {
  //Reset cards remaining
  cardsRemaining = 81;
  if ($(".remain")) {
    $(".remain").remove();
  }
  //Create 81 unique "cards" (objects with four characteristics) and put them in the deck array.
  deck = [];
  for (let shape of shapes) {
    for (let color of colors) {
      for (let fill of fills) {
        for (let number of numbers) {
          let card = {};
          card["shape"] = shape;
          card["number"] = number;
          card["color"] = color;
          card["fill"] = fill;
          deck.push(card);
        }
      }
    }
  }
  //shuffle deck
  deck = deck
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  //Give each key/value pair indicating their index in deck array.
  let i = 0;
  for (let card of deck) {
    card["cardNum"] = i;
    i++;
  }
}

function makeBoard() {
  //reset board array, deck, selected cards, and card count
  board = [];
  makeDeck();
  cardCount = 0;
  $(".selected").addClass("unselected").removeClass("selected");
  selected = [];
  //remove grid if needed
  if ($(".row")) {
    $(".row").remove();
  }
  $('<div class="row">').appendTo($container);
  //Show user how many cards remain in game
  $(`<div class="remain">Cards Remaining: ${cardsRemaining}</div>`).appendTo(
    $btnContainer
  );
  //game starts with 12 cards on the board
  for (let i = 0; i < 12; i++) {
    //addCard function in cards.js file
    addCard();
  }
}

function checkForSet(arr) {
  //when three cards are selected, check if they satisfy the game conditions of a SET.

  let colorSet = new Set();
  let numberSet = new Set();
  let fillSet = new Set();
  let shapeSet = new Set();

  //put characteristics of each selected card into a Set (unfortunate name for this situation) representing that characteristic. According to the rules, the cards cannot constitute a SET if for any characteristic exactly two cards match. The Set will automatically eliminate any duplicates.
  for (let i = 0; i < 3; i++) {
    colorSet.add(arr[i]["color"]);
    numberSet.add(arr[i]["number"]);
    fillSet.add(arr[i]["fill"]);
    shapeSet.add(arr[i]["shape"]);
  }
  //A SET is achieved if the set for each characteristic has either 1 or 3 elements (not 2).
  if (
    colorSet.size !== 2 &&
    numberSet.size !== 2 &&
    fillSet.size !== 2 &&
    shapeSet.size !== 2
  ) {
    return true;
  } else {
    selected = [];
    return false;
  }
}

function replaceSelected() {
  //When a SET is selected, remove those cards from the grid and put in new ones from our deck.

  //remove selected SET from board array.
  board = board.filter((card) => !selected.includes(card));
  //replace with new cards from the deck
  for (let $div of $(".selected").get()) {
    let card = deck[cardCount];
    //only add new cards if there are cards left in the deck and there are only 12 cards on board.
    if (cardCount === 81 || board.length > 11) {
      $div.remove();
    } else {
      if (card["fill"] === "none") {
        $(
          `<div id=${cardCount} class="col-3 unselected px-1 py-1"></div>`
        ).insertAfter($div);
        $(`<div id="card${cardCount}" class="gameCard"></div>`).appendTo(
          `#${cardCount}`
        );
        createOutlineCard();
        $div.remove();
      } else if (card["fill"] === "fill") {
        $(
          `<div id=${cardCount} class="col-3 unselected px-1 py-1"></div>`
        ).insertAfter($div);
        $(`<div id="card${cardCount}" class="gameCard"></div>`).appendTo(
          `#${cardCount}`
        );
        createFillCard();
        $div.remove();
      } else if (card["fill"] === "back") {
        $(
          `<div id=${cardCount} class="col-3 unselected px-1 py-1" ></div>`
        ).insertAfter($div);
        $(
          `<div id="card${cardCount}" class="gameCard" style="background-color:${card["color"]}"></div>`
        ).appendTo(`#${cardCount}`);
        createBackgroundCard();
        $div.remove();
      }
    }
  }
  //Update cards remaining
  cardsRemaining -= 3;
  $(".remain").text(`Cards Remaining: ${cardsRemaining}`);
  //reset selected array
  selected = [];
  // check for gameOver
  if (board === []) {
    alert("You have completed the game! Great Work!!!");
  }
}

function checkBoardForSet() {
  //brute force way of getting all three card combinations from the cards on the board.
  let combs = [];
  for (let i = 0; i < board.length - 2; i++) {
    for (let j = i + 1; j < board.length - 1; j++) {
      for (let k = j + 1; k < board.length; k++) {
        let arr = [board[i], board[j], board[k]];
        combs.push(arr);
      }
    }
  }
  //loop through all of the three card combos and run checkForSet function on each of them. Return true if there is a possible SET out there, false if not.
  for (let comb of combs) {
    if (checkForSet(comb)) {
      return comb;
    }
  }
  alert("There is no set present.");
  return false;
}

function undoCardSelections() {
  //removes selected class from divs and outline from selected cards
  $(".selected").addClass("unselected").removeClass("selected");
  $(".selected-border").removeClass("selected-border");
}

$container.on("click", ".unselected", function () {
  //user is selecting cards they think make a SET. Once three cards are selected, run checkForSet function.
  $(this).removeClass("unselected").addClass("selected");
  $(this).children().addClass("selected-border");
  if (selected.length < 3) {
    selected.push(deck[$(this).attr("id")]);
  }
  if (selected.length > 2) {
    if (checkForSet(selected)) {
      //if the cards form a set, replace those cards.
      replaceSelected();
    }
    undoCardSelections();
  }
});

$startBtn.on("click", makeBoard);

$addBtn.on("click", function () {
  //request additional cards to be added to the board. Request will only be granted if there are no possible SETs on the board.
  if (checkBoardForSet()) {
    alert("There is a set present. You are not allowed any extra cards.");
    undoCardSelections();
    return;
  } else if (board.length === cardsRemaining) {
    alert("There are no cards left in the deck!");
    undoCardSelections();
  } else {
    for (let i = 0; i < 3; i++) {
      addCard();
    }
    undoCardSelections();
  }
});

$hintBtn.on("click", function () {
  //check for set on board, show user first card of first set found
  let hints = $(".setHint").get().length;
  if (hints === 0) {
    let id = checkBoardForSet()[1]["cardNum"];
    $(`#${id} > div`).addClass("setHint");
    undoCardSelections();
    return;
    //if hint is requested again, show the second card of that set
  } else if (hints === 1) {
    let id = checkBoardForSet()[0]["cardNum"];
    $(`#${id} > div`).addClass("setHint");
    undoCardSelections();
    return;
    //if hint is requested again give encouragement
  } else if (hints === 2) {
    alert(
      "For any two cards, there is only one other card in the dack that would create a set. You can do this! "
    );
  }
});

makeBoard();
