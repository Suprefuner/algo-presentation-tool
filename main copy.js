const cards = document.querySelectorAll(".card")
const cardSlots = document.querySelectorAll(".card-slot")

// copy of og array

const ogArray = [5, 2, 7, 4, 1, 6, 3, 0]
const sortedArray = []
let dragStartIndex
let dragStartArray

const dragEnter = function (e) {
  e.target.classList.add("drag-over")
}
const dragOver = function (e) {
  e.preventDefault()
  e.target.classList.add("drag-over")
}
const dragLeave = function (e) {
  e.target.classList.remove("drag-over")
}

const swap = function (fromIndex, fromArray, toIndex, toArray) {
  const item1Arr = document.querySelector(`*[data-array="${fromArray}"`)
  const item1 = item1Arr
    .querySelector(`.card-slot[data-index="${fromIndex}"`)
    .querySelector(".card")
  const item2Arr = document.querySelector(`*[data-array="${toArray}"`)
  const item2 = item2Arr
    .querySelector(`.card-slot[data-index="${toIndex}"`)
    .querySelector(".card")

  item1Arr
    .querySelector(`.card-slot[data-index="${fromIndex}"`)
    .appendChild(item2)
  item2Arr
    .querySelector(`.card-slot[data-index="${toIndex}"`)
    .appendChild(item1)
}

const drop = function (e) {
  e.target.classList.remove("drag-over")
  const id = e.dataTransfer.getData("text/plain")
  const draggable = document.querySelector(`#${id}`)
  if (e.target.innerHTML !== "") {
    const dragEndIndex = e.target.closest(".card-slot").dataset.index
    const dragEndArray = e.target.closest(".card-slot").closest(".array")
      .dataset.array
    console.log(`this is drag Start index: ${dragStartIndex}`)
    console.log(`thgis is drag Start array: ${dragStartArray}`)
    console.log(`this is drag end index: ${dragEndIndex}`)
    console.log(`thgis is drag end array: ${dragEndArray}`)
    swap(dragStartIndex, dragStartArray, dragEndIndex, dragEndArray)
  } else {
    e.target.appendChild(draggable)
    draggable.classList.remove("dragging")
  }

  console.log(e.target)
}

cardSlots.forEach((slot) => {
  slot.addEventListener("dragenter", dragEnter)
  slot.addEventListener("dragover", dragOver)
  slot.addEventListener("dragleave", dragLeave)
  slot.addEventListener("drop", drop)
})

const dragStart = function (e) {
  e.target.style.cursor = "-webkit-grabbing"
  e.dataTransfer.setData("text/plain", e.target.id)
  e.target.classList.add("dragging")
  dragStartIndex = +e.target.closest(".card-slot").dataset.index
  dragStartArray = e.target.closest(".card-slot").closest(".array")
    .dataset.array

  console.log(dragStartIndex)
  console.log(dragStartArray)
  console.log(e.target)
}

const dragEnd = function (e) {
  e.target.removeAttribute("style")
}

cards.forEach((card) => {
  card.addEventListener("dragstart", dragStart)
  card.addEventListener("dragend", dragEnd)
})

const arr = [1, 2, 3, 4, 5, 6]
