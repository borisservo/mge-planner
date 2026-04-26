// js/main.js

const unitPower = { 9: 12.5, 8: 8.6, 7: 6, 6: 4.2, 5: 2.9, 4: 2.2, 3: 1.7 };

async function loadDay(dayId) {
  const area = document.getElementById('content-area');
  try {
    const response = await fetch(`days/${dayId}.html`);
    area.innerHTML = await response.text();

    // PINTA O BOTÃO DE AMARELO NA ABA ATIVA
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

  // LIGA TODOS OS DIAS SEM ERROS
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
  for (let i = 1; i <= 7; i++) {
    total += parseFloat(localStorage.getItem('mge_pts_day' + i)) || 0;
  }
  document.getElementById('totalPoints').innerText =
    Math.round(total).toLocaleString();
}
// ==========================================
// FUNÇÃO DE RESET GLOBAL
// ==========================================
function resetMGE() {
  // Pede confirmação antes de apagar tudo
  if (confirm("Are you sure you want to delete all data? This cannot be undone.")) {

    // Procura na memória tudo o que comece por "mge_" e apaga
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('mge_')) {
        localStorage.removeItem(key);
      }
    });

    // Recarrega a página para o Dia 1 com tudo a zeros
    window.location.reload();
  }
}

// ==========================================
// DISCORD BUG REPORTER (PRIVATE SERVER)
// ==========================================
function sendBugToDiscord() {
  console.log("A enviar para o Discord...");

  // O TEU LINK DIRETO DO DISCORD (Sem proxies)
  const webhookUrl =
    'https://discord.com/api/webhooks/1497982878406152243/YrItgx2t6lU0Ejt1_G7fKIjZIR4BQOQE3mh-wZ85kax_8GygVXWUk_bEWKeZtwlwywJC';
  const name = document.getElementById('bugName').value;
  const server = document.getElementById('bugServer').value;
  const desc = document.getElementById('bugDesc').value;

  if (!name || !server || !desc) {
    alert('Please fill in all fields (Name, Server, and Description).');
    return;
  }

  const payload = {
    content: `🚨 **NEW MGE PLANNER TICKET** 🚨\n**User:** ${name}\n**Server:** #${server}\n**Report:** ${desc}`
  };

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro de ligação: ' + response.status);
        }
        alert('Report sent! Thank you.');
        // Limpa tudo e esconde a janela
        document.getElementById('bugModal').style.display = 'none';
        document.getElementById('bugName').value = '';
        document.getElementById('bugServer').value = '';
        document.getElementById('bugDesc').value = '';
      })
      .catch((err) => {
        alert('Erro ao enviar. O teu ad-blocker pode estar a bloquear o envio!');
        console.error("ERRO:", err);
      });
}
window.onload = () => loadDay('day1');
