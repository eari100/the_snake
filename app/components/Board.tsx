'use client'

import React, {useState} from "react";

interface BoardProps {
    width: number
    height: number
}

const Board: React.FC<BoardProps> = ({ width, height }) => {
    const initialSnakePosition = { y: Math.floor(height / 2), x: Math.floor(width / 2) }
    const [snake, setSnake] = useState<{ y: number, x: number }[]>([initialSnakePosition])

    const renderCells = () => {
        const cells = []
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                // Check if the cell is part of the snake
                const isSnakeCell = snake.some(({ y, x }) => y === row && x === col)
                cells.push(
                    <div
                        key={`${row}-${col}`}
                        style={{
                            border: "1px solid #888",
                            width: "20px",
                            height: "20px",
                            backgroundColor: isSnakeCell ? "green" : "transparent" // Set background color to green if it's part of the snake
                        }}
                    />
                )
            }
        }
        return cells
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${width}, 20px)`, // 동적으로 width 적용
                gridGap: "0"
            }}
        >
            {renderCells()}
        </div>
    )
}

export default Board