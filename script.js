"use strict";

const colors = ["red", "green", "blue"];
const shapes = ["circle", "triangle", "square"];
const fills = ["none", "fill", "back"];
const numbers = [1, 2, 3];
const $startBtn = $("#start");
const $addBtn = $("#new-row");
const $container = $("#container");

let deck = [];
let board = [];
let selected = [];
let cardCount = 0;

function makeDeck() {
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
  board = [];
  makeDeck();
  cardCount = 0;
  if ($(".row")) {
    $(".row").remove();
  }
  $('<div class="row">').appendTo($container);

  for (let i = 0; i < 16; i++) {
    addCard();
  }
}

function addCard() {
  if (cardCount === 81) {
    return;
  }
  let card = deck[cardCount];
  if (card["fill"] === "none") {
    $(`<div id=${cardCount} class="col-3 unselected"></div>`).appendTo(
      $(".row")
    );
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
  let colorSet = new Set();
  let numberSet = new Set();
  let fillSet = new Set();
  let shapeSet = new Set();

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
  board = board.filter((card) => !selected.includes(card));
  for (let $div of $(".selected").get()) {
    let card = deck[cardCount];
    if (card["fill"] === "none") {
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
  selected = [];
}

// ***This will need a little work***
function checkBoardForSet() {
  let combs = [];
  for (let i = 0; i < board.length - 2; i++) {
    for (let j = i + 1; j < board.length - 1; j++) {
      for (let k = j + 1; k < board.length; k++) {
        let arr = [board[i], board[j], board[k]];
        combs.push(arr);
      }
    }
  }
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
  $(this).removeClass("unselected").addClass("selected");
  if (selected.length < 3) {
    selected.push(deck[$(this).attr("id")]);
  }
  if (selected.length > 2) {
    if (checkForSet(selected)) {
      replaceSelected();
    }
    $(".selected").addClass("unselected").removeClass("selected");
  }
});

$startBtn.on("click", makeBoard);

$addBtn.on("click", function () {
  if (checkBoardForSet()) {
    return;
  } else {
    for (let i = 0; i < 4; i++) {
      addCard();
    }
  }
});

makeBoard();
