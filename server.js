const express = require("express");
const path = require("path");
const cors = require("cors");
const SudokuWrapper = require("./sudokuWrapper.js");

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(
	cors({
		origin: "https://sudokumaster-se.herokuapp.com",
		optionsSuccessStatus: 200,
	})
);

const validateSudoku = (sudoku) => {
	if (sudoku.length !== 9) return false;
	for (let i in sudoku) {
		if (sudoku[i].length !== 9) return false;
	}
	return true;
};

app.get("/api/generate/:difficulty", (req, res) => {
	const difficulty = req.params.difficulty;

	const sudokuWrapper = new SudokuWrapper();
	const sudoku = sudokuWrapper.generateSudoku(difficulty);

	res.json(sudoku);
});

app.post("/api/solve", (req, res) => {
	const sudokuToSolve = req.body;
	if (validateSudoku(sudokuToSolve)) {
		const sudokuWrapper = new SudokuWrapper();
		const solution = sudokuWrapper.solveSudoku(sudokuToSolve);
		if (validateSudoku(solution.sudoku)) {
			res.json(solution);
		} else {
			res.status(500).json({ message: "Something went wrong" });
		}
	} else {
		res.status(422).json({ message: "Invalid sudoku" });
	}
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "client/build")));

	app.get("*", (req, res) => {
		res.sendFile("/client/build/index.html", { root: __dirname });
	});
}

app.get("*", (req, res) => {
	res.sendFile("/client/public/index.html", { root: __dirname });
});

app.listen(port, () => console.log(`Server started in port: ${port}`));
