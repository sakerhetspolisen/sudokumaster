import styles from "./App.module.css";
import React, { useState, useRef, useEffect } from "react";
import Sudoku from "./components/Sudoku";
import { ToastContainer, toast } from "react-toastify";
import confetti from "canvas-confetti";
import SudokuHeader from "./components/SudokuHeader";

function App() {
	const [difficulty, setDifficulty] = useState("easy");
	const [genCount, setGenCount] = useState(1);
	const [startValues, setStartValues] = useState(null);
	const boardRef = useRef();

	useEffect(() => {
		const fetchNewSudoku = async () => {
			const response = await fetch(
				`http://localhost:5000/api/generate/${difficulty}`
			);
			const data = await response.json();
			setStartValues(data.sudoku);
		};
		fetchNewSudoku();
	}, [difficulty, genCount]);

	const reGenerate = () => setGenCount(genCount + 1);

	const changeDifficulty = (newDifficulty) => setDifficulty(newDifficulty);

	const handleAutoSolve = () => {
		boardRef.current.autoSolve();
	};

	const handleFinish = () => {
		confetti();
		toast.success("Grattis! Du klarade det!");
	};

	return (
		<div className={styles.app}>
			<header className={styles.appHeader}>
				<h1>MasterSudoku</h1>
			</header>
			<main className={styles.appMain}>
				<div>
					<SudokuHeader
						changeDifficulty={changeDifficulty}
						reGenerate={reGenerate}
						handleAutoSolve={handleAutoSolve}
					/>
					<Sudoku
						startValues={startValues}
						handleFinish={handleFinish}
						ref={boardRef}
					/>
				</div>
			</main>
			<footer className={styles.appFooter}>
				<span>
					Byggt i React + Node + Express med{" "}
					<span role="img" aria-label="heart">
						❤️
					</span>{" "}
					av <b>Karl Sellergren</b>
				</span>
			</footer>
			<ToastContainer
				position="bottom-center"
				theme="colored"
				autoClose={2500}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss={false}
				draggable={false}
				pauseOnHover={false}
				limit={1}
			/>
		</div>
	);
}

export default App;
