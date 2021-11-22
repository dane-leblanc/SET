"use strict";

const colors = ["red", "green", "blue"];
const shapes = ["diamond", "square", "circle"];
const fills = ["horizontal", "vertical", "empty"];
const numbers = [1, 2, 3];
const $startBtn = $("#start");
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
  let traits = ["color", "shape", "fill", "number"];
  for (let trait of traits) {
    if (arr[0][trait] === arr[1][trait] && arr[1][trait] === arr[2][trait]) {
      console.log(`This is a ${trait} SET!!!`);
      replaceSelected();
    }
  }
  let values = [];
  for (let card of arr) {
    values.push(...Object.values(card));
  }
  if (values.every((e, i, a) => a.indexOf(e) === i)) {
    console.log("This is a unique SET!!!");
    replaceSelected();
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
