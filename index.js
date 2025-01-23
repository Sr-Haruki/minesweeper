document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.querySelector('.board');
    const mineElement = document.querySelector('.mine');
    const timerElement = document.querySelector('.timer');

    const boardSize = 10; //ボードのサイズ
    const totalMines = 10; //ボード上の地雷の数

    let board = [];
    let safeCells = 0; //安全なセルの数
    let revealedSafeCells = 0; //開けた安全なセルの数

    class Cell {
        constructor(isMine = false) {
            this.isMine = isMine;
            this.isRevealed = false;
            this.adjacentMines = 0;
        }
    }

    //初期化
    function createBoard() {
        board = [];
        for (let i = 0; i < boardSize; i++) {
            const row = [];
            for (let j = 0; j < boardSize; j++) {
                row.push(new Cell());
            }
            board.push(row);
        }
    }

    //地雷の配置
    function placeMines() {
        let minesPlaced = 0;
        while (minesPlaced < totalMines) {
            const x = Math.floor(Math.random() * boardSize);
            const y = Math.floor(Math.random() * boardSize);
            if (!board[x][y].isMine) {
                board[x][y].isMine = true;
                minesPlaced++;
            }
        }
    }

    //周囲にある地雷の数を計算
    function calculateAdjacentMines() {
        const directions = [
            [-1, -1], [0, -1], [1, -1],
            [-1, 0],           [1, 0],
            [-1, 1], [0, 1], [1, 1],
        ];

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j].isMine) continue;
                let adjacentMines = 0;
                for (const [dx, dy] of directions) {
                    const nx = i + dx, ny = j + dy;
                    if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize) {
                        if (board[nx][ny].isMine) {
                            adjacentMines++;
                        }
                    }
                }
                board[i][j].adjacentMines = adjacentMines;
                //安全なセルをカウント
                if (adjacentMines === 0 && !board[i][j].isMine) {
                    safeCells++;
                }
            }
        }
    }

    //セルがクリックされたときの処理
    function revealCell(x, y) {
        const cell = board[x][y];
        if (cell.isRevealed) return;

        cell.isRevealed = true;

        if (cell.isMine) {
            alert("ゲームオーバー！");
            revealAllCells();
            return;
        }

        //安全なセルを開けた場合
        if (cell.adjacentMines === 0) {
            revealedSafeCells++;
            if (revealedSafeCells === safeCells) {
                alert("勝ちました！");
                revealAllCells();
                return;
            }
            revealAdjacentCells(x, y);
        }

        renderBoard();
    }

    //隣接するセルを開く
    function revealAdjacentCells(x, y) {
        const directions = [
            [-1, -1], [0, -1], [1, -1],
            [-1, 0],           [1, 0],
            [-1, 1], [0, 1], [1, 1],
        ];

        for (const [dx, dy] of directions) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize) {
                const cell = board[nx][ny];
                if (!cell.isRevealed && !cell.isMine) {
                    cell.isRevealed = true;
                    if (cell.adjacentMines === 0) {
                        revealAdjacentCells(nx, ny);
                    }
                }
            }
        }
    }

    //全セルを表示(ゲームオーバー時)
    function revealAllCells() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                board[i][j].isRevealed = true;
            }
        }
        renderBoard();
    }

    //ボード
    function renderBoard() {
        boardElement.innerHTML = ''; //ボードをクリア

        for (let i = 0; i < boardSize; i++) {
            const row = document.createElement('div');
            row.classList.add('row');
            for (let j = 0; j < boardSize; j++) {
                const cell = document.createElement('button');
                cell.classList.add('cell');
                const currentCell = board[i][j];

                if (currentCell.isRevealed) {
                    if (currentCell.isMine) {
                        cell.classList.add('mine');
                    } else if (currentCell.adjacentMines > 0) {
                        cell.textContent = currentCell.adjacentMines.toString();
                    } else {
                        cell.classList.add('no-adjacent-mines');  //地雷が隣接していないセルの色変更
                    }
                } else {
                    cell.addEventListener('click', () => revealCell(i, j));
                }

                row.appendChild(cell);
            }
            boardElement.appendChild(row);
        }
    }

    //初期化
    function initializeGame() {
        createBoard();
        placeMines();
        calculateAdjacentMines();
        renderBoard();
    }

    initializeGame();
});
