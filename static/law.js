let currentCaseId = 0;
let seenCaseIds = new Set(); // 已經出現過的題目 ID
let totalCaseCount = 0;

// 載入指定題目
function loadCase(caseId) {
  fetch(`/get_case/${caseId}`)
    .then(response => response.json())
    .then(caseData => {
      const container = document.getElementById('case-container');
      container.innerHTML = '';

      if (caseData.error) {
        container.textContent = caseData.error;
        return;
      }

      const title = document.createElement('h2');
      title.textContent = caseData.title;
      container.appendChild(title);

      const desc = document.createElement('p');
      desc.textContent = caseData.description;
      container.appendChild(desc);

      caseData.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.textContent = choice.text;
        btn.onclick = () => {
          resultDiv.innerHTML = `結果：${choice.result}<br><strong>依據法律：</strong>${choice.legal_basis}`;
        };
        container.appendChild(btn);
        container.appendChild(document.createElement('br'));
      });

      const resultDiv = document.createElement('div');
      resultDiv.id = 'result';
      resultDiv.style.marginTop = '20px';
      resultDiv.style.padding = '10px';
      resultDiv.style.border = '1px solid #ccc';
      container.appendChild(resultDiv);
    })
    .catch(error => {
      console.error('取得案件時發生錯誤：', error);
    });
}

// 隨機載入未出現過的題目
function loadRandomCase() {
  if (totalCaseCount === 0) {
    fetch('/get_case_count')
      .then(response => response.json())
      .then(data => {
        totalCaseCount = data.count;
        pickRandomUnseenCase();
      })
      .catch(error => {
        console.error('取得題目總數時發生錯誤：', error);
      });
  } else {
    pickRandomUnseenCase();
  }
}

// 從未出現過的題目中選一題
function pickRandomUnseenCase() {
  if (seenCaseIds.size === totalCaseCount) {
    alert("你已經回答過所有題目了！");
    return;
  }

  let randomId;
  do {
    randomId = Math.floor(Math.random() * totalCaseCount);
  } while (seenCaseIds.has(randomId));

  seenCaseIds.add(randomId);
  currentCaseId = randomId;
  loadCase(currentCaseId);
}

// 背景音樂開關
function toggleMusic() {
  const music = document.getElementById('bg-music');
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
}

// 重新開始遊戲
function resetGame() {
  seenCaseIds.clear();
  loadRandomCase();
}

// 頁面載入時自動載入一題
window.onload = loadRandomCase;
