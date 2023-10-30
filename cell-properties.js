// Storage
let collectedSheetDB = []; // to contain all sheet DB
let sheetDB = [];

{
  let addSheetBtn = document.querySelector(".sheet-add-icon");
  addSheetBtn.click();
}

// selectors for cell properties

let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGColor = document.querySelector(".BGcolor-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

let activeColorProp = "#f1f4f7";
let inactiveColorProp = "#b6c1c4";

// attach property listeners
// Application of 2-way binding start's here
bold.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.bold = !cellProp.bold; // 2D array change
  cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; // UI change in sheet cell
  bold.style.backgroundColor = cellProp.bold
    ? activeColorProp
    : inactiveColorProp; // UI change in the toolbar to set the bold button visible.
});

italic.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.italic = !cellProp.italic; // 2D array change
  cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; // UI change in sheet cell
  italic.style.backgroundColor = cellProp.italic
    ? activeColorProp
    : inactiveColorProp; // UI change in the toolbar to set the italic button visible.
});

underline.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.underline = !cellProp.underline; // 2D array change
  cell.style.textDecoration = cellProp.underline ? "underline" : "none"; // UI change in sheet cell
  underline.style.backgroundColor = cellProp.underline
    ? activeColorProp
    : inactiveColorProp; // UI change in the toolbar to set the underline button visible.
});

fontSize.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.fontSize = fontSize.value; // 2D array change
  cell.style.fontSize = cellProp.fontSize + "px";
  fontSize.value = cellProp.fontSize; // UI change in the toolbar to set the select item value = fontSize value.
});

fontFamily.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.fontFamily = fontFamily.value; // 2D array change
  cell.style.fontFamily = cellProp.fontFamily;
  fontFamily.value = cellProp.fontFamily; // UI change in the toolbar to set the select item value = fontFamily value.
});

fontColor.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.fontColor = fontColor.value; // 2D array change
  cell.style.color = cellProp.fontColor;
  fontColor.value = cellProp.fontColor; // UI change in the toolbar to set the select item color value = fontColor value.
});

BGColor.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.BGColor = BGColor.value; // 2D array change
  cell.style.backgroundColor = cellProp.BGColor;
  BGColor.value = cellProp.BGColor; // UI change in the toolbar to set the select item color value = BGColor value.
});

alignment.forEach((alignElem) => {
  alignElem.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    let alignValue = e.target.classList[0];
    cellProp.alignment = alignValue; // 2D array change
    cell.style.textAlign = cellProp.alignment; // UI change in toolbar
    switch (alignValue) {
      case "left":
        leftAlign.style.backgroundColor = activeColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;
        break;
    }
  });
});

let allCells = document.querySelectorAll(".cell");
for (let i = 0; i < allCells.length; i++) {
  addListnerToAttachCellProperties(allCells[i]);
}

function addListnerToAttachCellProperties(cell) {
  cell.addEventListener("click", (e) => {
    // applying cell properties from 2D array  to every cell.
    let address = addressBar.value;
    let [rid, cid] = decodeRIDCIDFromAddress(address);
    let cellProp = sheetDB[rid][cid];

    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    cell.style.fontSize = cellProp.fontSize + "px";
    cell.style.fontFamily = cellProp.fontFamily;
    cell.style.color = cellProp.fontColor;
    cell.style.backgroundColor =
      cellProp.BGColor === "#000000" ? "transparent" : cellProp.BGColor;
    cell.style.textAlign = cellProp.alignment;

    // apply in UI in toolbar

    bold.style.backgroundColor = cellProp.bold
      ? activeColorProp
      : inactiveColorProp;

    italic.style.backgroundColor = cellProp.italic
      ? activeColorProp
      : inactiveColorProp;

    underline.style.backgroundColor = cellProp.underline
      ? activeColorProp
      : inactiveColorProp;

    fontSize.value = cellProp.fontSize;
    fontFamily.value = cellProp.fontFamily;
    fontColor.value = cellProp.fontColor;
    BGColor.value = cellProp.BGColor;
    switch (cellProp.alignment) {
      case "left":
        leftAlign.style.backgroundColor = activeColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;
        break;
    }
    let formulaBar = document.querySelector(".formula-bar");
    formulaBar.value = cellProp.formula;
    cell.innerText = cellProp.value;
  });
}

function getCellAndCellProp(address) {
  let [rid, cid] = decodeRIDCIDFromAddress(address);
  let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
  let cellProp = sheetDB[rid][cid];
  return [cell, cellProp];
}

function decodeRIDCIDFromAddress(address) {
  let rid = Number(address.slice(1) - 1);
  let cid = Number(address.charCodeAt(0)) - 65;
  return [rid, cid];
}
