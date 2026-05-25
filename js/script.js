async function loadDay(dayId) {
  const area = document.getElementById('content-area');
  try {
    const response = await fetch(`days/${dayId}.html`);
    area.innerHTML = await response.text();

    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.classList.toggle(
        'active',
        btn.getAttribute('onclick').includes(dayId),
      );
    });

    // A MAGIA: Injeta automaticamente a caixa do "Actual Score" em todos os dias!
    const dNum = dayId.replace('day', '');
    const header = area.querySelector('.card-header');

    if (header) {
      const overrideHTML = `
      <div style="background: rgba(46, 204, 113, 0.05); border: 1px solid rgba(46, 204, 113, 0.5); padding: 10px; border-radius: 6px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
          <div>
              <label style="font-size: 0.8rem; color: #2ecc71; display: flex; align-items: center; gap: 8px; cursor: pointer; margin-bottom: 3px;">
                  <input type="checkbox" id="ov-chk-${dNum}" onchange="calculate()">
                  <b>Lock Actual Score</b>
              </label>
              <span style="font-size: 0.6rem; color: #888;">Use in-game score for this day</span>
          </div>
          <input type="number" id="ov-val-${dNum}" oninput="calculate()" placeholder="Actual score..." style="background: #000; color: #2ecc71; border: 1px solid #2ecc71; padding: 8px; border-radius: 4px; text-align: right; width: 140px; font-weight: bold;">
      </div>`;
      header.insertAdjacentHTML('afterend', overrideHTML);
    }

    restoreInputs();
    calculate();
  } catch (err) {
    console.error('Erro ao carregar ficheiro:', err);
  }
}

function calculate() {
  const subElement = document.querySelector('[id^="sub-st"]');
  if (!subElement) return;

  const dayId = subElement.id.replace('sub-st', 'day');
  const dNum = dayId.replace('day', '');

  // 1. Calcula a Estimativa normal da calculadora
  let estTotal = 0;
  if (dayId === 'day1' && typeof calculateDay1 === 'function')
    estTotal = calculateDay1();
  else if (dayId === 'day2' && typeof calculateDay2 === 'function')
    estTotal = calculateDay2();
  else if (dayId === 'day3' && typeof calculateDay3 === 'function')
    estTotal = calculateDay3();
  else if (dayId === 'day4' && typeof calculateDay4 === 'function')
    estTotal = calculateDay4();
  else if (dayId === 'day5' && typeof calculateDay5 === 'function')
    estTotal = calculateDay5();
  else if (dayId === 'day6' && typeof calculateDay6 === 'function')
    estTotal = calculateDay6();
  else if (dayId === 'day7' && typeof calculateDay7 === 'function')
    estTotal = calculateDay7();

  // 2. Lógica do ZUMO: Verifica se a pessoa ativou o "Actual Score"
  const isLocked = document.getElementById(`ov-chk-${dNum}`)?.checked;
  const actualVal =
    parseFloat(document.getElementById(`ov-val-${dNum}`)?.value) || 0;

  // Se estiver trancado, ignora a estimativa e usa o valor real digitado!
  const finalTotal = isLocked ? actualVal : estTotal;

  // 3. Atualiza o Subtotal no ecrã (Riscado se estiver bloqueado)
  if (isLocked) {
    subElement.innerHTML = `<span style="text-decoration: line-through; color: #888; font-size: 0.7rem; margin-right: 5px;">${Math.round(estTotal).toLocaleString()}</span> <span style="color:#2ecc71;">${Math.round(finalTotal).toLocaleString()}</span>`;
  } else {
    subElement.innerText = Math.round(finalTotal).toLocaleString();
  }

  // Guarda na memória o valor final (Real ou Estimado) para a barra Global
  localStorage.setItem('mge_pts_' + dayId, finalTotal);

  updateGlobalScore();
}

function restoreInputs() {
  const inputs = document.querySelectorAll('input, select');
  inputs.forEach((input) => {
    const saved = localStorage.getItem('mge_val_' + input.id);
    if (saved !== null) {
      if (input.type === 'checkbox') input.checked = saved === 'true';
      else input.value = saved;
    }
    input.addEventListener('input', () => {
      const val = input.type === 'checkbox' ? input.checked : input.value;
      localStorage.setItem('mge_val_' + input.id, val);
      calculate();
    });
    if (input.tagName === 'SELECT') {
      input.addEventListener('change', () => {
        localStorage.setItem('mge_val_' + input.id, input.value);
        calculate();
      });
    }
  });
}

function updateGlobalScore() {
  let total = 0;
  for (let i = 1; i <= 7; i++) {
    total += parseFloat(localStorage.getItem('mge_pts_day' + i)) || 0;
  }

  const isDay5 = document.getElementById('sub-st5') !== null;
  const d5Checked = localStorage.getItem('mge_val_d5-to-d6') === 'true';
  if (isDay5 && d5Checked) {
    const powerToTransfer =
      parseFloat(localStorage.getItem('mge_d5_troop_power')) || 0;
    total += powerToTransfer * 3;
  }

  const uiTotalPoints = document.getElementById('totalPoints');
  if (uiTotalPoints)
    uiTotalPoints.innerText = Math.round(total).toLocaleString();

  const targetGoalInput = document.getElementById('mge-goal');
  const percentText = document.getElementById('goal-percent');

  if (targetGoalInput && percentText) {
    const targetValue = parseFloat(targetGoalInput.value) || 0;
    if (targetValue > 0) {
      const percent = (total / targetValue) * 100;
      if (percent >= 100) {
        percentText.innerText = '100% Reached ✅';
        percentText.style.color = '#2ecc71';
      } else {
        percentText.innerText = percent.toFixed(1) + '% Reached';
        percentText.style.color = '#ffcc00';
      }
    } else {
      percentText.innerText = '0% Reached';
      percentText.style.color = '#888';
    }
  }
}

function resetMGE() {
  if (
    confirm('Are you sure you want to delete all data? This cannot be undone.')
  ) {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('mge_')) localStorage.removeItem(key);
    });
    window.location.reload();
  }
}

// --- BUG REPORT (DISCORD WEBHOOK) ---
function sendBugToDiscord() {
  const name = document.getElementById('bugName').value || 'Anonymous';
  const server = document.getElementById('bugServer').value || 'Unknown Server';
  const desc = document.getElementById('bugDesc').value;

  if (!desc.trim()) {
    alert('Please describe the bug or suggestion first!');
    return;
  }

  // O TEU LINK DIVIDIDO
  const part1 = 'https://discord.com/api/';
  const part2 = 'webhooks/1498351805510189088/';
  const part3 = 'ilhi2ENK58ZYvcwu52TSferD4gtr3RFk2HVGdGNfkbVVbJKTHAEDfi3WEftq-8LnFr-U';

  const webhookURL = part1 + part2 + part3;

  const payload = {
    username: 'MGE Bug Tracker',
    avatar_url: 'https://i.imgur.com/8QG3t7f.png',
    embeds: [
      {
        title: '🚨 New Bug Report / Suggestion',
        color: 15158332,
        fields: [
          { name: 'Player', value: name, inline: true },
          { name: 'Server', value: server, inline: true },
          { name: 'Message', value: desc },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  fetch(webhookURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(async (response) => {
      if (response.ok) {
        alert('Report sent successfully! Thank you.');
        document.getElementById('bugModal').style.display = 'none';
        document.getElementById('bugDesc').value = '';
      } else {
        // AGORA ELE VAI LER O ERRO EXATO DO DISCORD
        const errorText = await response.text();
        alert(`Discord Error (${response.status}):\n${errorText}`);
        console.error('Discord Webhook Error:', response.status, errorText);
      }
    })
    .catch((error) => {
      console.error('Fetch Error:', error);
      alert('Network error! Are you using an AdBlocker or is Firefox blocking trackers?');
    });
}

window.onload = () => loadDay('day1');
