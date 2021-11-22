"use strict";

const colors = ["red", "green", "blue"];
const shapes = ["diamond", "square", "circle"];
const fills = ["horizontal", "vertical", "empty"];
const numbers = [1, 2, 3];
const $startBtn = $("#start");
const $addBtn = $("#new-row");
const $container = $("#container");

let deck = [];
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
  let card = deck[cardCount];
  $(
    `<div id=${cardCount} class="col-3 unselected"> ${card["number"]} ${card["fill"]} ${card["color"]} ${card["shape"]} </div>`
  ).appendTo($(".row"));
  cardCount++;
}

function checkForSet(arr) {
  //TODO run logic on selected array
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

  if (colorSet.size !== 2 && numberSet.size && fillSet.size && shapeSet.size) {
    console.log("This is a SET!!!");
    replaceSelected();
  } else {
    console.log("This is not a SET!!!");
  }
  selected = [];
}

function replaceSelected() {
  for (let $div of $(".selected").get()) {
    let card = deck[cardCount];
    $(
      `<div id=${cardCount} class="col-3 unselected">${card["number"]} ${card["fill"]} ${card["color"]} ${card["shape"]}</div>`
    ).insertAfter($div);
    $div.remove();
    cardCount++;
  }
}

$container.on("click", ".unselected", function () {
  $(this).removeClass("unselected").addClass("selected");
  if (selected.length < 3) {
    selected.push(deck[$(this).attr("id")]);
  }
  if (selected.length > 2) {
    checkForSet(selected);
    $(".selected").addClass("unselected").removeClass("selected");
  }
});

$startBtn.on("click", makeBoard);
$addBtn.on("click", function () {
  for (let i = 0; i < 4; i++) {
    addCard();
  }
});

makeBoard();
