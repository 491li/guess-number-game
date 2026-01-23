let level = 1;
const MAX_LEVEL = 7;
let maxNumber = 10;
let trueNumber = 0;
let currentInput = "";
let count = 0;
let levelGuessStats = [0, 0, 0, 0, 0, 0, 0];
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playBeep(freq = 500, duration = 0.1, volume = 0.2) {
  initAudio();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.value = freq;

  gain.gain.value = volume;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

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

function showLevelStatsTable() {
  let html = `
    <h3>🏁 前七关通关统计</h3>
    <table style="
      margin: 20px auto;
      border-collapse: collapse;
      font-size: 16px;
      min-width: 260px;
    ">
      <tr>
        <th style="border:1px solid #ccc;padding:8px;">关卡</th>
        <th style="border:1px solid #ccc;padding:8px;">猜测次数</th>
      </tr>
  `;

  for (let i = 0; i < MAX_LEVEL; i++) {
    html += `
      <tr>
        <td style="border:1px solid #ccc;padding:8px;text-align:center;">
          第 ${i + 1} 关
        </td>
        <td style="border:1px solid #ccc;padding:8px;text-align:center;">
          ${levelGuessStats[i]} 次
        </td>
      </tr>
    `;
  }

  html += `</table>`;

  document.getElementById("hint").innerHTML = html;
}

function press(num) {
  playBeep(600, 0.05); // 🔊 按键音
  currentInput += num;
  updateDisplay();
}

function clearInput() {
  playBeep(400, 0.08);
  currentInput = "";
  updateDisplay();
}


function submitGuess() {
  if (currentInput === "") return;

  const guess = parseInt(currentInput);
  count++;

  // 按下确认键音效
  playBeep(500, 0.08);

  if (guess === trueNumber) {

    // ✅ 记录本关猜测次数
    levelGuessStats[level - 1] = count;

    // 🎉 单关通关音
    playBeep(900, 0.2);

    if (level >= MAX_LEVEL) {
      // 🏆 最终通关三连音
      setTimeout(() => playBeep(1200, 0.3), 0);
      setTimeout(() => playBeep(1500, 0.3), 200);
      setTimeout(() => playBeep(1800, 0.4), 400);

      document.getElementById("hint").innerText =
        "🏆 恭喜你！已通关全部 7 关！";

      // ✅ 显示统计表
      setTimeout(showLevelStatsTable, 800);
      return;
    }

    document.getElementById("hint").innerText =
      `🎉 第 ${level} 关通过！用了 ${count} 次`;

    level++;
    setTimeout(startLevel, 1500);

  } else {
    // ❌ 猜错音
    playBeep(300, 0.15);
    const hint = getHint(guess, trueNumber, getMaxNumber(level));
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

