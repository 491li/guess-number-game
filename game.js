let level = 1;
const MAX_LEVEL = 7;
let maxNumber = 10;
let trueNumber = 0;
let currentInput = "";
let count = 0;

function getMaxNumber(level) {
  if (level < 4) {
    return Math.pow(10, level);
  } else {
    return Math.pow(10, 4) + 5000*(level - 4);
  }
}

function getHint(guess, trueNumber, maxNumber) {
    const diff = guess - trueNumber;
    const absDiff = Math.abs(diff);

    const closeRange = Math.ceil(maxNumber * 0.2); // 20% 范围内算接近

    if (absDiff === 0) {
        return "🎉 猜对了！";
    }

    if (absDiff <= closeRange) {
        if (diff > 0) {
            return "接近了，再猜小一点";
        } else {
            return "接近了，再猜大一点";
        }
    } else {
        if (diff > 0) {
            return "猜大了";
        } else {
            return "猜小了";
        }
    }
}

function showLevelTip(level) {
  let text = "";

  if (level <= 2) {
    text = "🟢 初出茅庐";
  } else if (level <= 4) {
    text = "🟡 小试牛刀";
  } else if (level <= 6) {
    text = "🟠 锋芒毕露";
  } else {
    text = "🔴 登峰造极";
  }

  document.getElementById("levelTip").innerText = text;
}

function startLevel() {
  
  if (level > MAX_LEVEL) return;
  
  count = 0;
  currentInput = "";

  const maxNumber = getMaxNumber(level);
  trueNumber = Math.floor(Math.random() * maxNumber) + 1;

  document.getElementById("level").innerText =
    `第 ${level} 关：猜 1 ~ ${maxNumber}`;

    showLevelTip(level);
  
  document.getElementById("current").innerText = "";
  document.getElementById("hint").innerText = "";
  
  updateDisplay();

  console.log("🎯 本关答案是：", trueNumber);
}

function press(num) {
  currentInput += num;
  updateDisplay();
}

function clearInput() {
  currentInput = "";
  updateDisplay();
}

function submitGuess() {
  if (currentInput === "") return;

  const guess = parseInt(currentInput);
  count++;

  if (guess === trueNumber) {

  if (level >= MAX_LEVEL) {
    document.getElementById("hint").innerText =
      "🏆 恭喜你！已通关全部 7 关！";
    return;   // ⛔ 不再进入下一关
  }

  document.getElementById("hint").innerText =
    `🎉 第 ${level} 关通过！用了 ${count} 次`;

  level++;
  setTimeout(startLevel, 1500);
}
 else {
    const hint = getHint(guess, trueNumber);
    document.getElementById("hint").innerText = hint;
  }

  currentInput = "";
  updateDisplay();
}

function restartGame() {
  level = 1;
  count = 0;
  currentInput = "";
  trueNumber = 0;

  document.getElementById("hint").innerText = "🎮 游戏已重置，重新开始！";
  document.getElementById("current").innerText = "";

  startLevel();
}

function updateDisplay() {
  document.getElementById("current").innerText = currentInput;
}

startLevel();

