"use strict"

// GET ELEMENT ---------------------------------------------------
// TODO
const originalCards = document
  .querySelector(".original-array")
  .querySelector(".cards")
const sortedCards = document
  .querySelector(".sorted-array")
  .querySelector(".cards")
const displayLabel = document.querySelector(".tool-describe")
const display = document.querySelector(".tool-display")
const btnExample = document.querySelector(".btn-example")
const btnFilp = document.querySelector(".btn-flip")
const btnReset = document.querySelector(".btn-reset")
const btnSortType = document.querySelector(".btn-sort-type")
const btnSelection = document.querySelector(".btn-selection")
const btnBubble = document.querySelector(".btn-bubble")
const btnMerge = document.querySelector(".btn-merge")

// VARIABLES -----------------------------------------------------
// TODO
const exampleArray = [5, 2, 7, 4, 1, 6, 3, 0]
const originalArray = [0, 1, 2, 3, 4, 5, 6, 7]
let displayArray = []
const sortedArray = []
let cardSlots, cards
let dragStartIndex, dragStartArray

// FOR DIFFERENT MODE
let mode = "selection"
let minNumForSelection
let timeOfSwap = 0

// FUNCTIONS -----------------------------------------------------
// TODO

const addEventListener = function () {
  cards.forEach((card) => {
    card.addEventListener("dragstart", dragStart)
    card.addEventListener("click", filpAndSelectCard)
    card.addEventListener("dblclick", refilpCard)
  })

  cardSlots.forEach((slot) => {
    slot.addEventListener("dragenter", dragEnter)
    slot.addEventListener("dragover", dragOver)
    slot.addEventListener("dragleave", dragLeave)
    slot.addEventListener("drop", drop)
  })

  btnFilp.addEventListener("click", flipAllCards)
  btnReset.addEventListener("click", resetCards)
  btnExample.addEventListener("click", showExample)
  btnSortType.addEventListener("click", showList)
  btnSelection.addEventListener("click", switchMode)
  btnBubble.addEventListener("click", switchMode)
  btnMerge.addEventListener("click", switchMode)
}

const switchMode = function () {
  mode = this.dataset.sort
  const displayMode = this.closest(".sort-type__list").previousElementSibling
  displayMode.classList.remove("show-list")
  displayMode.innerHTML = `<span>${this.dataset.sort}</span>`
  timeOfSwap = 0
  createLabel(mode)
}

const createLabel = function (mode) {
  if (mode === "selection") {
    displayLabel.style.opacity = "1"
    displayLabel.innerHTML = `min number: `
    display.style.opacity = "1"
    display.innerHTML = `?`
  }

  if (mode === "bubble") {
    displayLabel.innerHTML = `times of swap: `
    displayLabel.style.opacity = "1"
    display.style.opacity = "1"
    timeOfSwap = 0
    display.innerHTML = timeOfSwap
  }

  if (mode === "merge") {
    displayLabel.style.opacity = "0"
    display.style.opacity = "0"
    timeOfSwap = 0
  }
}

createLabel(mode)

const createCard = function (type = "reset") {
  originalCards.innerHTML = ""
  sortedCards.innerHTML = ""
  displayArray = []
  let array

  type === "reset"
    ? (array = originalArray
        .map((num) => ({ value: num, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value)).slice()
    : (array = exampleArray.slice())

  array.forEach((v, i) => {
    const cardSlot = document.createElement("li")
    cardSlot.classList.add("card-slot")
    cardSlot.setAttribute("data-index", i)
    cardSlot.innerHTML = `
        <div class="card card-inserted ${
          type === "reset" ? "" : "card-flipped"
        }" draggable="true" id="card--${i}">
          <div class="card--front">
            <i class="fas fa-question"></i>
          </div>
          <div class="card--back">${v}</div>
        </div> 
    `
    displayArray.push(v)
    originalCards.insertAdjacentElement("beforeend", cardSlot)
  })

  for (let i = 0; i < originalArray.length; i++) {
    const markup = `
      <li class="card-slot" data-index="${i}"></li>
    `
    sortedCards.insertAdjacentHTML("beforeend", markup)
  }

  // select all card slots and cards after creating them
  cardSlots = document.querySelectorAll(".card-slot")
  cards = document.querySelectorAll(".card")
}

createCard()

const showList = function () {
  this.classList.toggle("show-list")
}

// BUTTON FUNCTION ----------------------------------------------
// TODO

// Filp all cards
const flipAllCards = function () {
  const cards = [...originalCards.querySelectorAll(".card")].concat([
    ...sortedCards.querySelectorAll(".cards"),
  ])
  cards.forEach((card) => card.classList.toggle("card-flipped"))
  display.innerHTML = mode === "selection" ? "?" : 0
}

// Reset all cards from all slot
const resetCards = function () {
  createCard()
  addEventListener()
  display.innerHTML = "?"
}

// Show presentation example
const showExample = function () {
  createCard("example")
  addEventListener()
}

// DRAG FUNCTION ------------------------------------------------
// TODO
const filpAndSelectCard = function (e) {
  const cardNumber = +this.querySelector(".card--back").innerHTML

  if (this.classList.contains("card-flipped")) {
    this.classList.toggle("card-selected")
  } else {
    this.classList.add("card-flipped")
    if (display.innerHTML === "?" && mode === "selection")
      minNumForSelection = cardNumber
    if (minNumForSelection > cardNumber && mode === "selection")
      minNumForSelection = cardNumber
  }

  if (mode === "selection") display.innerHTML = minNumForSelection
}

const refilpCard = function () {
  if (this.classList.contains("card-flipped"))
    this.classList.remove("card-flipped")
}

const dragStart = function (e) {
  e.target.classList.add("dragging")
  e.dataTransfer.setData("text/plain", e.target.id)
  dragStartIndex = +this.closest(".card-slot").dataset.index
  dragStartArray = this.closest(".array").dataset.array
}

const dragEnter = function (e) {
  this.classList.add("drag-over")
}
const dragOver = function (e) {
  e.preventDefault()
  this.classList.add("drag-over")
}
const dragLeave = function (e) {
  this.classList.remove("drag-over")
}

const swap = function (fromIndex, fromArr, toIndex, toArr) {
  const item1Array = document.querySelector(`.array[data-array="${fromArr}"]`)
  const item1Slot = item1Array.querySelector(
    `.card-slot[data-index="${fromIndex}"]`
  )
  const item2Array = document.querySelector(`.array[data-array="${toArr}"]`)
  const item2Slot = item2Array.querySelector(
    `.card-slot[data-index="${toIndex}"]`
  )

  item1Slot.appendChild(item2Slot.querySelector(".card"))
  item2Slot.appendChild(item1Slot.querySelector(".card"))

  if (mode === "bubble") {
    timeOfSwap++
    document.querySelector(".tool-display").innerHTML = timeOfSwap
  }
}
const drop = function (e) {
  e.preventDefault()
  this.classList.remove("drag-over")
  const id = e.dataTransfer.getData("text/plain")
  const draggable = document.querySelector(`#${id}`)

  if (e.target.innerHTML.trim() !== "") {
    let dragEndIndex = +this.dataset.index
    let dragEndArray = this.closest(".array").dataset.array
    swap(dragStartIndex, dragStartArray, dragEndIndex, dragEndArray)
  } else {
    this.appendChild(draggable)
    if (
      mode === "bubble" &&
      this.closest(".array").dataset.array === "sorted"
    ) {
      timeOfSwap = 0
      display.innerHTML = timeOfSwap
    }
  }
}

addEventListener()
