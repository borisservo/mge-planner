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

    restoreInputs();
    calculate();
  } catch (err) {
    console.error('Erro ao carregar ficheiro:', err);
  }
}

function calculate() {
  let dayTotal = 0;
  const subElement = document.querySelector('[id^="sub-st"]');
  if (!subElement) return;

  const dayId = subElement.id.replace('sub-st', 'day');

  // Calcula APENAS o dia que está aberto no ecrã no momento
  if (dayId === 'day1' && typeof calculateDay1 === 'function')
    dayTotal = calculateDay1();
  else if (dayId === 'day2' && typeof calculateDay2 === 'function')
    dayTotal = calculateDay2();
  else if (dayId === 'day3' && typeof calculateDay3 === 'function')
    dayTotal = calculateDay3();
  else if (dayId === 'day4' && typeof calculateDay4 === 'function')
    dayTotal = calculateDay4();
  else if (dayId === 'day5' && typeof calculateDay5 === 'function')
    dayTotal = calculateDay5();
  else if (dayId === 'day6' && typeof calculateDay6 === 'function')
    dayTotal = calculateDay6();
  else if (dayId === 'day7' && typeof calculateDay7 === 'function')
    dayTotal = calculateDay7();

  subElement.innerText = Math.round(dayTotal).toLocaleString();

  // Guarda na memória
  localStorage.setItem('mge_pts_' + dayId, dayTotal);

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
  // Soma os pontos oficiais guardados de cada dia
  for (let i = 1; i <= 7; i++) {
    total += parseFloat(localStorage.getItem('mge_pts_day' + i)) || 0;
  }

  // Lógica Especial: Se estivermos no Dia 5 e a checkbox estiver ligada
  const isDay5 = document.getElementById('sub-st5') !== null;
  const d5Checked = localStorage.getItem('mge_val_d5-to-d6') === 'true';

  if (isDay5 && d5Checked) {
    const powerToTransfer =
      parseFloat(localStorage.getItem('mge_d5_troop_power')) || 0;
    // AGORA VALE 3 PONTOS POR POWER!
    total += powerToTransfer * 3;
  }

  const uiTotalPoints = document.getElementById('totalPoints');
  if (uiTotalPoints)
    uiTotalPoints.innerText = Math.round(total).toLocaleString();

  // Lógica de Percentagem (Target Goal)
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

  // O LINK DIVIDIDO EM 3 PARTES
  const part1 = 'https://discord.com/api/';
  const part2 = 'webhooks/1498351805510189088/';
  const part3 =
    'ilhi2ENK58ZYvcwu52TSferD4gtr3RFk2HVGdGNfkbVVbJKTHAEDfi3WEftq-8LnFr-U';

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
    .then((response) => {
      if (response.ok) {
        alert('Report sent successfully! Thank you.');
        document.getElementById('bugModal').style.display = 'none';
        document.getElementById('bugDesc').value = '';
      } else {
        alert('Error sending report. Please contact the admin.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Network error. Could not send the report.');
    });
}

// Arranca o Dia 1 automaticamente quando abres a página!
window.onload = () => loadDay('day1');
