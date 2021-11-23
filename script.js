"use strict";

const colors = ["red", "green", "blue"];
const shapes = ["circle", "triangle", "square"];
const fills = ["none", "fill", "back"];
const numbers = [1, 2, 3];
const $startBtn = $("#start");
const $addBtn = $("#new-row");
const $container = $("#container");

let deck = [];
//board is the collection of cards that are currently showing and in play
let board = [];
//selected is a collection of the cards that user selects
let selected = [];
//card cound will represent how deep we are in the deck
let cardCount = 0;

function makeDeck() {
  //Create 81 unique "cards" (objects with four charactaristics) and put them in the deck array.
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
}

function makeBoard() {
  //reset board array, deck, and card count
  board = [];
  makeDeck();
  cardCount = 0;
  //remove grid if needed
  if ($(".row")) {
    $(".row").remove();
  }
  $('<div class="row">').appendTo($container);
  //game starts with 16 cards on the board
  for (let i = 0; i < 16; i++) {
    addCard();
  }
}

function addCard() {
  //function does not run if the entire deck is run through.
  if (cardCount === 81) {
    return;
  }
  //based on the charactaristics of the next card in the deck, put card image in specified grid location to represent that card. Since we are using separate bootstrap icons for the same shape but different "fill", we need three different "create card" functions.
  let card = deck[cardCount];
  if (card["fill"] === "none") {
    //add div to the grid with an id equal to the cards position in the deck (id is helpful for debugging)
    $(`<div id=${cardCount} class="col-3 unselected"></div>`).appendTo(
      $(".row")
    );
    //create card functions are in card.js file
    createOutlineCard();
  } else if (card["fill"] === "fill") {
    $(`<div id=${cardCount} class="col-3 unselected"></div>`).appendTo(
      $(".row")
    );
    createFillCard();
  } else if (card["fill"] === "back") {
    $(
      `<div id=${cardCount} class="col-3 unselected" style="background-color:${card["color"]}"></div>`
    ).appendTo($(".row"));
    createBackgroundCard();
  }
}

function checkForSet(arr) {
  //when three cards are selected, check if they satisfy the game conditions of a SET.
  let colorSet = new Set();
  let numberSet = new Set();
  let fillSet = new Set();
  let shapeSet = new Set();

  //put charactaristics of each selected card into a Set (unfortunate name for this situation) representing that charactaristic. According to the rules, the cards cannot consitute a SET if for any charactaristic exactly two cards match.

  for (let i = 0; i < 3; i++) {
    colorSet.add(arr[i]["color"]);
    numberSet.add(arr[i]["number"]);
    fillSet.add(arr[i]["fill"]);
    shapeSet.add(arr[i]["shape"]);
  }

  if (
    colorSet.size !== 2 &&
    numberSet.size !== 2 &&
    fillSet.size !== 2 &&
    shapeSet.size !== 2
  ) {
    console.log("This is a SET!!!");
    return true;
  } else {
    console.log("This is not a SET!!!");
    selected = [];
    return false;
  }
}

function replaceSelected() {
  //When a SET is selected, remove those cards from the grid and put in new ones from our deck.

  //remove selected SET from board array.
  board = board.filter((card) => !selected.includes(card));
  for (let $div of $(".selected").get()) {
    let card = deck[cardCount];
    if (card["fill"] === "none") {
      //only add new cards if there are cards left in the deck
      if (cardCount !== 81) {
        $(`<div id=${cardCount} class="col-3 unselected"></div>`).insertAfter(
          $div
        );
        createOutlineCard();
      }
      $div.remove();
    } else if (card["fill"] === "fill") {
      if (cardCount !== 81) {
        $(`<div id=${cardCount} class="col-3 unselected"></div>`).insertAfter(
          $div
        );
        createFillCard();
      }
      $div.remove();
    } else if (card["fill"] === "back") {
      if (cardCount !== 81) {
        $(
          `<div id=${cardCount} class="col-3 unselected" style="background-color:${card["color"]}"></div>`
        ).insertAfter($div);
        createBackgroundCard();
      }
      $div.remove();
    }
  }
  //reset selected array
  selected = [];
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
      alert("There is a set present");
      for (let card of comb) {
        console.log(card);
      }
      return true;
    }
  }
  alert("There is no set present");
  return false;
}

$container.on("click", ".unselected", function () {
  //user is slecting cards they think make a SET. Once three cards are selected, run checkForSet function.
  $(this).removeClass("unselected").addClass("selected");
  if (selected.length < 3) {
    selected.push(deck[$(this).attr("id")]);
  }
  if (selected.length > 2) {
    if (checkForSet(selected)) {
      //if the cards form a set, replace those cards.
      replaceSelected();
    }
    $(".selected").addClass("unselected").removeClass("selected");
  }
});

$startBtn.on("click", makeBoard);

$addBtn.on("click", function () {
  //request an additional row to be added to the board. Request will only be granted if there are no possible SETs on the board.
  if (checkBoardForSet()) {
    return;
  } else {
    for (let i = 0; i < 4; i++) {
      addCard();
    }
  }
});

makeBoard();
