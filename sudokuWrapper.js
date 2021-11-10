const sudoku = require("./sudoku.js");

class SudokuWrapper {
	constructor() {
		this.id = this.generateID();
	}

	generateSudoku(difficulty = "easy") {
		this.difficulty = difficulty;

		const sudokuString = sudoku.generate(difficulty);
		let sud = this.stringToNestedArray(sudokuString);

		return { sudoku: sud };
	}

	solveSudoku(sudokuNestedArr) {
		const sudokuStr = this.nestedArrayToString(sudokuNestedArr);
		let resString = sudoku.solve(sudokuStr);
		let resNestedArr = this.stringToNestedArray(resString);
		return { sudoku: resNestedArr };
	}

	stringToNestedArray(str, nullVal = ".") {
		let resArr = [];
		for (let i = 0; i < 9; i++) {
			let nestedArr = [];
			for (let j = 0; j < 9; j++) {
				nestedArr.push(str.charAt(i * 8 + j + i).replace(nullVal, ""));
			}
			resArr.push(nestedArr);
		}
		return resArr;
	}

	nestedArrayToString(arr, nullVal = ".") {
		let resStr = "";
		for (let i in arr) {
			for (let j in arr[i]) {
				resStr += arr[i][j] || nullVal;
			}
		}
		return resStr;
	}

	generateID() {
		// Math.random should be unique because of its seeding algorithm.
		// Convert it to base 36 (numbers + letters), and grab the first 9 characters
		// after the decimal.
		return "_" + Math.random().toString(36).substr(2, 9);
	}
}

module.exports = SudokuWrapper;
