import React from "react";
import styles from "./SudokuHeader.module.css";

const SudokuHeader = ({ changeDifficulty, reGenerate, handleAutoSolve }) => {
	return (
		<div className={styles.sudokuHeader}>
			<div className={styles.radio}>
				<p>Välj svårighetsgrad</p>
				<div
					className={styles.formControl}
					onChange={(e) => changeDifficulty(e.target.value)}
				>
					<input
						type="radio"
						id="easy"
						name="difficulty"
						value="easy"
						defaultChecked
					/>
					<label htmlFor="easy">Lätt</label>
					<input
						type="radio"
						id="medium"
						name="difficulty"
						value="medium"
					/>
					<label htmlFor="medium">Medelsvårt</label>
					<input
						type="radio"
						id="hard"
						name="difficulty"
						value="hard"
					/>
					<label htmlFor="hard">Svårt</label>
				</div>
			</div>
			<div>
				<button onClick={() => reGenerate()}>Generera ny</button>
				<button onClick={() => handleAutoSolve()}>Autolös</button>
			</div>
		</div>
	);
};

export default SudokuHeader;
