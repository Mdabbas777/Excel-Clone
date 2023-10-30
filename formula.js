for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    cell.addEventListener("blur", (e) => {
      let address = addressBar.value;
      let [activeCell, cellProp] = getCellAndCellProp(address);
      let enteredData = activeCell.innerText;

      if (enteredData === cellProp.value) return;
      cellProp.value = enteredData;
      // if value is hardcoded in cell remove parent child relationship, and empty formula and update children
      removeChildFromParent(cellProp.formula);
      cellProp.formula = "";
      updateChildrenCells(address);
    });
  }
}

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async (e) => {
  let inputFormula = formulaBar.value;
  if (e.key === "Enter" && inputFormula) {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    // first change previous formula related to that cell.
    if (inputFormula !== cellProp.formula) {
      removeChildFromParent(cellProp.formula);
    }
    addChildToGraphComponent(inputFormula, address);
    //Checking formula for cyclic or not.
    // True for cyclic graph.
    let cycleResponse = isGraphCyclic(graphComponentMatrix);
    if (cycleResponse) {
      let response = confirm(
        "Your Formula is Cyclic. Do you want to Trace Cyclic Path?"
      );

      while (response === true) {
        //Keep on tracking the path.
        await isGraphCyclicTracePath(graphComponentMatrix, cycleResponse);
        response = confirm(
          "Your Formula is Cyclic. Do you want to trace your Cyclic Path?"
        );
      }
      removeChildFromGraphComponent(inputFormula, address);
      return;
    }

    let evaluatedValue = evaluateFormula(inputFormula);

    setCellUIAndCellProp(evaluatedValue, inputFormula, address); // to update UI and cellProp in DB
    addChildToParent(inputFormula);
    console.log(sheetDB);
    updateChildrenCells(address);
  }
});

function addChildToGraphComponent(formula, childAddress) {
  let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
      graphComponentMatrix[prid][pcid].push([crid, ccid]);
    }
  }
}

function removeChildFromGraphComponent(formula, childAddress) {
  let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
      graphComponentMatrix[prid][pcid].pop();
    }
  }
}

function updateChildrenCells(parentAddress) {
  let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
  let children = parentCellProp.children;
  for (let i = 0; i < children.length; i++) {
    let childAddress = children[i];
    let [childCell, childCellProp] = getCellAndCellProp(childAddress);
    let childFormula = childCellProp.formula;
    let evaluatedValue = evaluateFormula(childFormula);

    setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);

    updateChildrenCells(childAddress);
  }
}

function addChildToParent(formula) {
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
      parentCellProp.children.push(childAddress);
    }
  }
}

function removeChildFromParent(formula) {
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
      let idx = parentCellProp.children.indexOf(childAddress);
      parentCellProp.children.splice(idx, 1);
    }
  }
}

function evaluateFormula(formula) {
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
      encodedFormula[i] = cellProp.value;
    }
  }
  let decodedFormula = encodedFormula.join(" ");
  return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue, formula, address) {
  let [cell, cellProp] = getCellAndCellProp(address);
  cell.innerText = evaluatedValue; // UI update
  cellProp.value = evaluatedValue; // 2D array Update
  cellProp.formula = formula; // 2D array Update
}
