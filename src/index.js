const numLine = [1, 2, 3, 4, 5, 6, 7, 8, 9];
module.exports = function solveSudoku(matrix) {
  let squares = [];

  // вычислим все 9 квадратов
  for (let x = 0; x < 9; x += 3) {
    for (let i = 0; i < 9; i += 3) {
      let numLine = [];
      for (let j = x; j < x + 3; j++) {
        for (let k = i; k < i + 3; k++) {
          numLine.push(matrix[j][k]);
        }
      }
      squares.push(numLine);
    }
  }

  class Candidates {
    constructor(row, col) {
      this.row = row;
      this.col = col;
      this.candidates = []; // тру кандидаты
    }

     getMissedInRow() {
       let newRow = this.getRowByRowNumber(this.row);
       return filterNumbers(newRow); // кандидаты по строке
     }

     getMissedInColumn() {
       let newCol = this.getColumnArrByColumnNumber(this.col);
       return filterNumbers(newCol); // кандидаты по столбцу
     }

     getMissedInSquare() {
       let newSq = this.getSquare(this.row, this.col);
       return filterNumbers(newSq); // кандидаты по квадрату
     }

     getSquare(row, col) {
       if (row >= 0 && row <= 2) {
         if (col >= 0 && col <= 2) return squares[0];
         if (col >= 3 && col <= 5) return squares[1];
         if (col >= 6 && col <= 8) return squares[2];
       }
       if (row >= 3 && row <= 5) {
         if (col >= 0 && col <= 2) return squares[3];
         if (col >= 3 && col <= 5) return squares[4];
         if (col >= 6 && col <= 8) return squares[5];
       }
       if (row >= 6 && row <= 8) {
         if (col >= 0 && col <= 2) return squares[6];
         if (col >= 3 && col <= 5) return squares[7];
         if (col >= 6 && col <= 8) return squares[8];
       }
     }

     getRowByRowNumber(rowNum) {
       let row = [];
       for (let i = 0; i < 9; i++) {
         row.push(matrix[rowNum][i]);
       }
       return row;
     }

     getColumnArrByColumnNumber(colNum) {
       let column = [];
       for (let i = 0; i < 9; i++) {
         column.push(matrix[i][colNum]);
       }
       return column;
     }

     getCandidates() {
       const missRow = this.getMissedInRow();
       const missCol = this.getMissedInColumn();
       const missSq = this.getMissedInSquare();
       let result = [];
       let crossCount = getCrosses([...missRow, ...missCol, ...missSq]);
       for (el in crossCount) {
         if (crossCount[el] === 3) result.push(+el);
       }
       this.candidates = result;
     }
  }

  fillOnes(matrix);
  fillHidden(matrix);
  fillOnes(matrix);
  // вычисление кандидатов
  function fillOnes(mtrx) {
    let cand = []; // массив со свободными ячейками и кандидатами в них
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (mtrx[i][j] === 0) cand.push(new Candidates(i, j));
      }
    }
    for (el of cand) {
      el.getCandidates();
    }
    // console.log(cand);
    let f = false;
    for (el of cand) {
      if (el.candidates.length === 1) {
        mtrx[el.row][el.col] = el.candidates[0];
        // console.log(el.getSquare(el.row, el.col));
        f = true;
      }
    }
    if (f) {
      fillOnes(mtrx);
    } else {
      matrix = mtrx;
    }
  }

  function fillHidden(mtrx) {
    let cand = []; // массив со свободными ячейками и кандидатами в них
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (mtrx[i][j] === 0) cand.push(new Candidates(i, j));
      }
    }
    for (el of cand) {
      el.getCandidates();
    }
    for (let i = 0; i < 9; i++) {
      let match = matchInRow(cand, i);
      // console.log(match);
      if (isNaN(match)) mtrx[match[0]][match[1]] = match[2];
    }
    for (let i = 0; i < 9; i++) {
      let match = matchInColumn(cand, i);
      // console.log(match);
      if (isNaN(match)) mtrx[match[0]][match[1]] = match[2];
    }
  }


return matrix;

}

function matchInRow(cand, row) {
  let arr = [];
  cand.map(el => {
    if (el.row === row) arr.push(...el.candidates);
  });
  let crossCount = getCrosses(arr);
  let match = [];
  for (el in crossCount) {
    if (crossCount[el] === 1) match.push(el);
  }
  let x = [];
  if (!isNaN(match)) {
    cand.map((el) => {
      if (el.row === row && el.candidates.includes(+match)) x = [el.row, el.col, +match];
    })
  }
  return x;
}

function matchInColumn(cand, col) {
  let arr = [];
  cand.map(el => {
    if (el.col === col) arr.push(...el.candidates);
  });
  let crossCount = getCrosses(arr);
  let match = [];
  for (el in crossCount) {
    if (crossCount[el] === 1) match.push(el);
  }
  let x = [];
  if (!isNaN(match)) {
    cand.map((el) => {
      if (el.col === col && el.candidates.includes(+match)) x = [el.row, el.col, +match];
    })
  }
  return x;
}

function filterNumbers(arrToFilter) {
  arrToFilter.sort(compare);
  let missedNumbers = [];
  numLine.map((el) => {
    if (!arrToFilter.includes(el)) missedNumbers.push(el);
  })
  return missedNumbers;
}

function getCrosses(arr) {
  let crossCount = {};
  arr.map(el => {
    crossCount[el] ? crossCount[el] += 1 : crossCount[el] = 1;
  });
  return crossCount;
}

function compare(a, b) {
  return a - b;
}
