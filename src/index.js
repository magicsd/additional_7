module.exports = function solveSudoku(matrix) {

  let squares = [];

  // вычислим все 9 квадратов
  for (let x = 0; x < 9; x += 3) {
    for (let i = 0; i < 9; i += 3) {
      let arr = [];
      for (let j = x; j < x + 3; j++) {
        for (let k = i; k < i + 3; k++) {
          arr.push(matrix[j][k]);
        }
      }
      squares.push(arr);
    }
  }

  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  class Candidates {
    constructor(row, col) {
      this.row = row;
      this.col = col;
      this.candidates = []; // тру кандидаты
    }

     getMissedInRow() {
       let newRow = this.getRowByRowNumber(this.row);
       let missRow = [];
       newRow.sort((a, b) => a - b);
       arr.map((el) => {
         if (!newRow.includes(el)) missRow.push(el);
       });
       return missRow; // кандидаты по строке
     }

     getMissedInColumn() {
       let newCol = this.getColumnArrByColumnNumber(this.col);;
       newCol.sort((a, b) => a - b);
       let missCol = [];
       arr.map((el) => {
         if (!newCol.includes(el)) missCol.push(el);
       });
       return missCol; // кандидаты по столбцу
     }

     getMissedInSquare() {
       let newSq = this.getSquare(this.row, this.col);
       newSq.sort((a, b) => a - b);
       let missSq = [];
       arr.map((el) => {
         if (!newSq.includes(el)) missSq.push(el);
       })
       return missSq; // кандидаты по квадрату
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
       let candidates = [...missRow, ...missCol, ...missSq];
       let crossCount = {};
       let result = [];
       candidates.map(el => {
         crossCount[el] ? crossCount[el] += 1 : crossCount[el] = 1;
       });
       for (el in crossCount) {
         if (crossCount[el] === 3) result.push(+el);
       }
       this.candidates = result;
     }
  }

  console.log('matrix', matrix);
  matrix = fillOnes(matrix);
  // вычисление кандидатов
  function fillOnes(mtrx) {
    let newMatrix = mtrx;
    let cand = []; // массив со свободными ячейками и кандидатами в них
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (newMatrix[i][j] === 0) cand.push(new Candidates(i, j));
      }
    }
    for (el of cand) {
      el.getCandidates();
    }
    for (el of cand) {
      if (el.candidates.length === 1) {
        newMatrix[el.row][el.col] = el.candidates[0];
      }
    }
    console.log(cand);
    console.log(newMatrix[0] === mtrx[0]);
    if (newMatrix != mtrx) {
      fillOnes(newMatrix);
    } else return newMatrix;
  }


// console.log(cand);
console.log(matrix);
// row - индекс массива
// col - индекс элемента в массиве
}
