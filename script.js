const board = document.getElementById("game-board");
const size = 4;
let tiles = [];

function init() {
  tiles = Array(size * size).fill(0);
  addRandomTile();
  addRandomTile();
  drawBoard();
}

function drawBoard() {
  board.innerHTML = "";
  tiles.forEach(value => {
    const tile = document.createElement("div");
    tile.className = "tile";
    if (value) {
      tile.setAttribute("data-value", value);
      tile.textContent = value;
    }
    board.appendChild(tile);
  });
}

function addRandomTile() {
  const empty = tiles.map((v, i) => v === 0 ? i : null).filter(v => v !== null);
  if (empty.length === 0) return;
  const index = empty[Math.floor(Math.random() * empty.length)];
  tiles[index] = Math.random() < 0.9 ? 2 : 4;
}

function move(dir) {
  let moved = false;
  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      const index = dir === "left" || dir === "right" ? i * size + j : j * size + i;
      row.push(tiles[index]);
    }

    if (dir === "right" || dir === "down") row.reverse();

    let merged = [];
    for (let k = 0; k < size; k++) {
      if (row[k] === 0) continue;
      let target = k;
      while (target > 0 && row[target - 1] === 0) target--;
      if (
        target > 0 &&
        row[target - 1] === row[k] &&
        !merged.includes(target - 1)
      ) {
        row[target - 1] *= 2;
        row[k] = 0;
        merged.push(target - 1);
        moved = true;
      } else if (target !== k) {
        row[target] = row[k];
        row[k] = 0;
        moved = true;
      }
    }

    if (dir === "right" || dir === "down") row.reverse();

    for (let j = 0; j < size; j++) {
      const index = dir === "left" || dir === "right" ? i * size + j : j * size + i;
      tiles[index] = row[j];
    }
  }

  if (moved) {
    addRandomTile();
    drawBoard();
    checkWin();
    checkLose();
  }
}

function checkWin() {
  if (tiles.includes(2048)) {
    document.getElementById("status").textContent = "🎉 You win!";
    document.removeEventListener("keydown", handleKey);
  }
}

function checkLose() {
  if (tiles.includes(0)) return;
  for (let i = 0; i < size * size; i++) {
    if (
      (i % size !== size - 1 && tiles[i] === tiles[i + 1]) ||
      (i < size * (size - 1) && tiles[i] === tiles[i + size])
    ) return;
  }
  document.getElementById("status").textContent = "😢 Game Over!";
  document.removeEventListener("keydown", handleKey);
}

function handleKey(e) {
  switch (e.key) {
    case "ArrowUp": move("up"); break;
    case "ArrowDown": move("down"); break;
    case "ArrowLeft": move("left"); break;
    case "ArrowRight": move("right"); break;
  }
}

document.addEventListener("keydown", handleKey);
window.onload = init;
