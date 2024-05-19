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

enum ItemType {
    SPEED_UP = 'SPEED_UP', // 빨강
    SPEED_DOWN = 'SPEED_DOWN', // 파랑
    SIZE_UP = 'SIZE_UP', // 노랑
    SIZE_DOWN = 'SIZE_DOWN' // 갈색
}

interface ItemInfo {
    itemType: ItemType,
    y: number,
    x: number
}

const Board: React.FC<BoardProps> = ({ width, height }) => {
    const initialSnakePosition: SnakePosition[] = [{ y: Math.floor(height / 2), x: Math.floor(width / 2) }]
    const [snake, setSnake] = useState<SnakePosition[]>(initialSnakePosition)
    const [snakeDirection, setSnakeDirection] = useState<SnakeDirection>(SnakeDirection.DOWN)
    const [snakeSpeed, setSnakeSpeed] = useState<number>(250)
    const [itemInfoList, setItemInfoList] = useState<Array<ItemInfo>>([])

    const moveSnake = () => {
        setSnake(prevSnake => {
            const { y, x } = prevSnake[0]
            let newHeadY= y, newHeadX = x

            switch (snakeDirection) {
                case SnakeDirection.UP:
                    newHeadY = y - 1
                    break
                case SnakeDirection.DOWN:
                    newHeadY = y + 1
                    break
                case SnakeDirection.LEFT:
                    newHeadX = x - 1
                    break
                case SnakeDirection.RIGHT:
                    newHeadX = x + 1
                    break
            }

            if(newHeadY < 0) {
                newHeadY = height
            } else if(newHeadY === height) {
                newHeadY = 0
            } else if(newHeadX < 0) {
                newHeadX = width
            } else if(newHeadX === width) {
                newHeadX = 0
            }

            const newHead: SnakePosition = {y: newHeadY, x: newHeadX}

            const itemIndex = itemInfoList.findIndex(item => item.y === newHeadY && item.x === newHeadX)
            if (itemIndex !== -1) {
                const item = itemInfoList[itemIndex]
                setItemInfoList(prevItems => prevItems.filter((_, i) => i !== itemIndex))

                switch (item.itemType) {
                    case ItemType.SPEED_UP:
                        setSnakeSpeed(prevSpeed => Math.max(50, prevSpeed - 50))
                        return [newHead, ...prevSnake.slice(0, -1)]
                        break
                    case ItemType.SPEED_DOWN:
                        setSnakeSpeed(prevSpeed => prevSpeed + 50)
                        return [newHead, ...prevSnake.slice(0, -1)]
                        break
                    case ItemType.SIZE_UP:
                        return [newHead, ...prevSnake]
                        break
                    case ItemType.SIZE_DOWN:
                        return [newHead, ...prevSnake.slice(0, -2)]
                        break
                }
            } else {
                return [newHead, ...prevSnake.slice(0, -1)]
            }
        })
    }

    const createItem = () => {
        console.log('createItem ', createItem)
        const getPosition = (max: number, exclusions: Set<number>): number => {
            return Math.floor(Math.random() * max)
            // while(true) {
            //     const randomVal = Math.floor(Math.random() * max)
            //
            //     if( !exclusions.has(randomVal) ) {
            //         return randomVal
            //     }
            // }
        }

        const snakeYValues = new Set<number>(), snakeXValues = new Set<number>()

        snake.forEach(({y, x}) => {
            snakeYValues.add(y)
            snakeXValues.add(x)
        })

        const getRandomItemType = () => {
            const itemTypes = Object.values(ItemType);
            return itemTypes[Math.floor(Math.random() * itemTypes.length)];
        }

        const newItem: ItemInfo = {
            itemType: getRandomItemType(),
            y: getPosition(height, snakeYValues),
            x: getPosition(width, snakeXValues)
        }

        console.log('newItem ', newItem)

        setItemInfoList(prevItems => [...prevItems, newItem])
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        setSnakeDirection(prevDirection => {
            switch (event.key) {
                case 'ArrowUp':
                    return prevDirection !== SnakeDirection.DOWN ? SnakeDirection.UP : prevDirection
                case 'ArrowDown':
                    return prevDirection !== SnakeDirection.UP ? SnakeDirection.DOWN : prevDirection
                case 'ArrowLeft':
                    return prevDirection !== SnakeDirection.RIGHT ? SnakeDirection.LEFT : prevDirection
                case 'ArrowRight':
                    return prevDirection !== SnakeDirection.LEFT ? SnakeDirection.RIGHT : prevDirection
                default:
                    return prevDirection
            }
        })
    }

    useEffect(() => {
        const intervalId = setInterval(moveSnake, snakeSpeed)

        return () => clearInterval(intervalId)
    }, [moveSnake])

    useEffect(() => {
        const intervalId = setInterval(createItem, 5000)
        return () => clearInterval(intervalId)
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)

        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const renderCells = () => {
        const cells = []
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                const isSnakeCell = snake.some(({ y, x }) => y === row && x === col)
                let backgroundColor = "transparent"

                if( !isSnakeCell ) {
                    const itemInfo: ItemInfo | undefined = itemInfoList.find(({ y, x }) => y === row && x === col)

                    if(itemInfo) {
                        const {itemType} = itemInfo

                        if (isSnakeCell) {
                            backgroundColor = "green"
                        } else if (itemType) {
                            switch (itemType) {
                                case ItemType.SPEED_UP:
                                    backgroundColor = "red"
                                    break
                                case ItemType.SPEED_DOWN:
                                    backgroundColor = "blue"
                                    break
                                case ItemType.SIZE_UP:
                                    backgroundColor = "yellow"
                                    break
                                case ItemType.SIZE_DOWN:
                                    backgroundColor = "brown"
                                    break
                            }
                        }
                    }
                }

                cells.push(
                    <div
                        key={`${row}-${col}`}
                        style={{
                            border: "1px solid #888",
                            width: "20px",
                            height: "20px",
                            backgroundColor: isSnakeCell ? "green" : backgroundColor
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