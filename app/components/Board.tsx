'use client'

import React, {useEffect, useState} from "react";

interface BoardProps {
    width: number
    height: number
}

interface SnakePosition {
    y: number
    x: number
}

enum SnakeDirection {
    UP = 'UP',
    DOWN = 'DOWN',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT'
}

const Board: React.FC<BoardProps> = ({ width, height }) => {
    const initialSnakePosition: SnakePosition[] = [{ y: Math.floor(height / 2), x: Math.floor(width / 2) }]
    const [snake, setSnake] = useState<SnakePosition[]>(initialSnakePosition)
    const [snakeDirection, setSnakeDirection] = useState<SnakeDirection>(SnakeDirection.DOWN)

    const moveSnake = () => {
        setSnake(prevSnake => {
            const { y, x } = prevSnake[0]
            let newHead: SnakePosition

            switch (snakeDirection) {
                case SnakeDirection.UP:
                    newHead = { y: y - 1, x }
                    break
                case SnakeDirection.DOWN:
                    newHead = { y: y + 1, x }
                    break
                case SnakeDirection.LEFT:
                    newHead = { y, x: x - 1 }
                    break
                case SnakeDirection.RIGHT:
                    newHead = { y, x: x + 1 }
                    break
                default:
                    newHead = { y, x }
            }

            const newSnake = [newHead, ...prevSnake.slice(0, -1)]
            return newSnake
        })
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowUp':
                setSnakeDirection(SnakeDirection.UP)
                break
            case 'ArrowDown':
                setSnakeDirection(SnakeDirection.DOWN)
                break
            case 'ArrowLeft':
                setSnakeDirection(SnakeDirection.LEFT)
                break
            case 'ArrowRight':
                setSnakeDirection(SnakeDirection.RIGHT)
                break
            default:
                break
        }
    }

    useEffect(() => {
        const intervalId = setInterval(moveSnake, 1000)
        return () => clearInterval(intervalId)
    }, [snakeDirection])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)

        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const renderCells = () => {
        const cells = []
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                const isSnakeCell = snake.some(({ y, x }) => y === row && x === col)
                cells.push(
                    <div
                        key={`${row}-${col}`}
                        style={{
                            border: "1px solid #888",
                            width: "20px",
                            height: "20px",
                            backgroundColor: isSnakeCell ? "green" : "transparent"
                        }}
                    />
                )
            }
        }
        return cells
    }

    return (
        <>
            {snakeDirection}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${width}, 20px)`, // 동적으로 width 적용
                    gridGap: "0"
                }}
            >
                {renderCells()}
            </div>
        </>
    )
}

export default Board