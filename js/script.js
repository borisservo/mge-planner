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

    const dNum = dayId.replace('day', '');
    const header = area.querySelector('.card-header');

    if (header) {
      let dailyTip = '';
      if (dNum === '1')
        dailyTip =
          '🎯 22,500 = <b id="tip-d1" style="color:#f1c40f;">0</b> Tribes (<b id="tip-d1-stm" style="color:#e74c3c;">0</b> Stamina)';
      if (dNum === '2')
        dailyTip =
          '🎯 22,500 = <b id="tip-d2" style="color:#f1c40f;">0</b> Legendary Gears';
      if (dNum === '3')
        dailyTip =
          '🎯 22,500 = <b id="tip-d3" style="color:#f1c40f;">0</b> Rss (1 Lineup)';
      if (dNum === '4')
        dailyTip =
          '🎯 22,500 = <b id="tip-d4a" style="color:#f1c40f;">0</b> Build Spd + <b id="tip-d4b" style="color:#f1c40f;">0</b> Research Spd';
      if (dNum === '5')
        dailyTip = '🎯 22,500 = <b style="color:#f1c40f;">225</b> T7 Units';
      if (dNum === '6' || dNum === '7')
        dailyTip =
          '💡 Note: Units trained today also count towards your daily rewards!';

      const overrideHTML = `
      <div style="display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 15px;">
        <div style="background: rgba(52, 152, 219, 0.05); border: 1px solid rgba(52, 152, 219, 0.3); padding: 10px; border-radius: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <label style="font-size: 0.7rem; color: #3498db;"><b>Daily Rewards Goal</b></label>
                <input type="number" id="daily-goal-${dNum}" value="22500" oninput="calculate()" style="background: #000; color: #3498db; border: 1px solid #3498db; padding: 4px 8px; border-radius: 4px; text-align: right; width: 120px; font-size: 0.75rem;">
            </div>
            <div style="width: 100%; background: #000; height: 6px; border-radius: 3px; overflow: hidden; border: 1px solid #222;">
                <div id="daily-bar-${dNum}" style="height: 100%; width: 0%; background: #3498db; transition: width 0.3s;"></div>
            </div>
            <div id="daily-text-${dNum}" style="font-size: 0.65rem; color: #888; text-align: center; margin-top: 6px;">Set a target to track daily rewards</div>
            
            <div style="margin-top: 8px; font-size: 0.65rem; color: #aaa; text-align: center; border-top: 1px dashed #333; padding-top: 6px;">
                ${dailyTip}
            </div>
        </div>

        <div style="background: rgba(46, 204, 113, 0.05); border: 1px solid rgba(46, 204, 113, 0.3); padding: 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <label style="font-size: 0.7rem; color: #2ecc71; display: flex; align-items: center; gap: 5px; cursor: pointer; margin-bottom: 3px;">
                    <input type="checkbox" id="ov-chk-${dNum}" onchange="calculate()">
                    <b>Lock Actual Score</b>
                </label>
                <span style="font-size: 0.6rem; color: #888;">Use in-game score for this day</span>
            </div>
            <input type="number" id="ov-val-${dNum}" oninput="calculate()" placeholder="Actual score..." style="background: #000; color: #2ecc71; border: 1px solid #2ecc71; padding: 6px; border-radius: 4px; text-align: right; width: 120px; font-weight: bold; font-size: 0.8rem;">
        </div>
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

  const isLocked = document.getElementById(`ov-chk-${dNum}`)?.checked;
  const actualVal =
    parseFloat(document.getElementById(`ov-val-${dNum}`)?.value) || 0;

  const finalTotal = isLocked ? actualVal : estTotal;

  if (isLocked) {
    subElement.innerHTML = `<span style="text-decoration: line-through; color: #888; font-size: 0.7rem; margin-right: 5px;">${Math.round(estTotal).toLocaleString()}</span> <span style="color:#2ecc71;">${Math.round(finalTotal).toLocaleString()}</span>`;
  } else {
    subElement.innerText = Math.round(finalTotal).toLocaleString();
  }

  const dailyGoalInput = document.getElementById(`daily-goal-${dNum}`);
  const dailyBar = document.getElementById(`daily-bar-${dNum}`);
  const dailyText = document.getElementById(`daily-text-${dNum}`);

  if (dailyGoalInput && dailyBar && dailyText) {
    const goal = parseFloat(dailyGoalInput.value) || 0;
    if (goal > 0) {
      const pct = Math.min((finalTotal / goal) * 100, 100);
      dailyBar.style.width = pct + '%';
      dailyBar.style.background = pct >= 100 ? '#2ecc71' : '#3498db';

      const diff = goal - finalTotal;
      if (diff <= 0) {
        dailyText.innerHTML = `<span style="color:#2ecc71; font-weight:bold;">Goal Reached! ✅</span>`;
      } else {
        dailyText.innerText = `${Math.round(diff).toLocaleString()} pts left for daily rewards (${pct.toFixed(1)}%)`;
      }
    } else {
      dailyBar.style.width = '0%';
      dailyText.innerText = 'Set a target to track daily rewards';
    }
  }

  // MATEMÁTICA DAS DICAS DIÁRIAS
  const ptsTribo = 1000;
  const staminaPerTribo = 5; // <-- Ajusta aqui o custo de Stamina por ataque!

  const ptsLegGear = 30000;
  const ptsResource = 1;
  const ptsBuildingMin = 30;
  const ptsResearchMin = 30;

// MATEMÁTICA DAS DICAS DIÁRIAS - DIA 1
  // Agora usamos a proporção real: 1 Tribo = 5 Stamina.
  // Se a meta é 75 tribos, o custo é sempre 375 de Stamina.

if (dNum === '1' && document.getElementById('tip-d1')) {
    const tribesNeeded = 75; // Valor fixo que definimos para o teu servidor
    document.getElementById('tip-d1').innerText = tribesNeeded;

    if (document.getElementById('tip-d1-stm')) {
      document.getElementById('tip-d1-stm').innerText = (tribesNeeded * staminaPerTribo).toLocaleString();
    }
  }
  if (dNum === '2' && document.getElementById('tip-d2')) {
    document.getElementById('tip-d2').innerText = Math.ceil(22500 / ptsLegGear);
  }
  if (dNum === '3' && document.getElementById('tip-d3')) {
    document.getElementById('tip-d3').innerText = (
      22500 / ptsResource
    ).toLocaleString();
  }
  if (dNum === '4' && document.getElementById('tip-d4a')) {
    const minB = Math.ceil(11250 / ptsBuildingMin);
    const minR = Math.ceil(11250 / ptsResearchMin);

    const formatSpd = (mins) => {
      const d = Math.floor(mins / 1440);
      const h = Math.floor((mins % 1440) / 60);
      const m = mins % 60;
      return `${d}d ${h}h ${m}m`;
    };

    document.getElementById('tip-d4a').innerText = formatSpd(minB);
    document.getElementById('tip-d4b').innerText = formatSpd(minR);
  }

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

window.resetMGE = function () {
  if (
    confirm('Are you sure you want to delete all data? This cannot be undone.')
  ) {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('mge_')) localStorage.removeItem(key);
    });
    window.location.reload();
  }
};

// --- BUG REPORT (DISCORD WEBHOOK) ---
window.sendBugToDiscord = async function () {
  // 1. Vai buscar os valores usando os IDs corretos do teu HTML
  const playerInput = document.getElementById('bugName');
  const serverInput = document.getElementById('bugServer');
  const messageInput = document.getElementById('bugDesc');

  if (!playerInput || !serverInput || !messageInput) {
    alert('Erro: O JavaScript ainda não encontra as caixas de texto.');
    return;
  }

  const playerVal = playerInput.value.trim() || 'Anónimo';
  const serverVal = serverInput.value.trim() || 'N/A';
  const messageVal = messageInput.value.trim() || 'Sem mensagem descritiva.';

  // 2. Monta o link do Webhook
  const part1 = 'https://discord.com/api/';
  const part2 = 'webhooks/1498351805510189088/';
  const part3 =
    'ilhi2ENK58ZYvcwu52TSferD4gtr3RFk2HVGdGNfkbVVbJKTHAEDfi3WEftq-8LnFr-U';
  const webhookUrl = part1 + part2 + part3;

  // 3. Monta o pacote para o Discord (com a Mensagem na Description para suportar textos longos)
  const payload = {
    username: 'MGE Calculator Bot',
    embeds: [
      {
        title: '🐛 Novo Bug / Sugestão',
        description: messageVal, // <-- A mensagem entra aqui (limite de 4096 caracteres)
        color: 15158332,
        fields: [
          { name: 'Player', value: playerVal, inline: true },
          { name: 'Server', value: serverVal, inline: true },
        ],
      },
    ],
  };

  try {
    // 4. Envia para o Discord
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      alert(`Discord Error (${response.status}):\n${errText}`);
    } else {
      alert('Feedback enviado com sucesso para o Discord!');

      // Limpa as caixas e fecha o modal automaticamente
      playerInput.value = '';
      serverInput.value = '';
      messageInput.value = '';
      document.getElementById('bugModal').style.display = 'none';
    }
  } catch (error) {
    alert('Erro na ligação à internet ou ao Discord.');
    console.error(error);
  }
};;
window.onload = () => loadDay('day1');
