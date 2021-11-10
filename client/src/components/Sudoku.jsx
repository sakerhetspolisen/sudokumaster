import React, {
	useState,
	useEffect,
	forwardRef,
	useImperativeHandle,
} from "react";
import styles from "./Sudoku.module.css";
import { toast } from "react-toastify";

const Sudoku = ({ startValues, handleFinish }, ref) => {
	const [realValues, setRealValues] = useState(
		Array(9).fill(Array(9).fill(""))
	);

	useEffect(() => {
		setRealValues(startValues);
	}, [startValues]);

	const isFinished = () => {
		let nEmptyFields = 0;
		for (let i in realValues) {
			nEmptyFields += realValues[i].filter((x) => x === "").length;
		}
		return nEmptyFields === 0 ? true : false;
	};

	const updateRealValues = (y, x, val) => {
		let updater = [...realValues];
		updater[y][x] = val;
		setRealValues(updater);
	};

	const valueIsValid = (y, x, val) => {
		for (let i = 0; i < 9; i++) {
			const boxY = 3 * Math.floor(y / 3) + Math.floor(i / 3);
			const boxX = 3 * Math.floor(x / 3) + (i % 3);
			var isInRow = realValues[y][i] === val;
			var isInCol = realValues[i][x] === val;
			var isInBox = realValues[boxY][boxX] === val;
			if (isInRow || isInCol || isInBox) {
				return false;
			}
		}
		return true;
	};

	useImperativeHandle(ref, () => ({
		async autoSolve() {
			const response = await fetch(`https://sudokumaster-se.herokuapp.com/api/solve`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(realValues),
			});
			const data = await response.json();
			setRealValues(data.sudoku);
			handleFinish();
		},
	}));

	const SudokuTile = ({ initValue, coord }) => {
		const [invalid, setInvalid] = useState(false);
		const [value, setValue] = useState(initValue);

		const handleInput = (e) => {
			var val = e.target.value;
			var isDigit = /^\d+$/.test(val);
			var isDelete = val === "";

			if (isDigit) {
				setValue(val);
				if (valueIsValid(coord.y, coord.x, val)) {
					updateRealValues(coord.y, coord.x, val);
					setInvalid(false);
					toast.success(`${val} passar där! 😍`, {
						hideProgressBar: true,
					});
					if (isFinished()) handleFinish();
				} else {
					setInvalid(true);
					toast.error(`${val} funkar inte där 🤔`, {
						onClose: () => {
							setValue("");
							setInvalid(false);
						},
					});
				}
			} else if (isDelete) {
				setValue(val);
				setInvalid(false);
			}
		};

		return (
			<div>
				<input
					maxLength="1"
					type="text"
					pattern="[0-9]*"
					onInput={handleInput}
					disabled={initValue === "" ? false : true}
					className={invalid ? styles.invalid : null}
					value={value}
				></input>
			</div>
		);
	};

	let board = [];
	for (let i in realValues) {
		for (let j in realValues[i]) {
			board.push(
				<SudokuTile
					initValue={realValues[i][j]}
					coord={{ y: i, x: j }}
					key={parseInt(i) * 8 + parseInt(j) + parseInt(i)}
				/>
			);
		}
	}
	return <div className={styles.sudoku}>{board}</div>;
};

export default forwardRef(Sudoku);
