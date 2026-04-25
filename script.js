const unitPoints = { 7: 100, 6: 50, 5: 20, 4: 10, 3: 5 };

async function loadDay(dayId) {
  const contentArea = document.getElementById('content-area');
  try {
    const response = await fetch(`days/${dayId}.html`);
    contentArea.innerHTML = await response.text();

    // Atualiza botões do menu
    document
      .querySelectorAll('.tab-btn')
      .forEach((btn) => btn.classList.remove('active'));

    // Procura o botão pelo ID ou pelo texto para garantir que fica ativo
    const activeBtn = document.querySelector(`[onclick*="${dayId}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    // Sempre que carregamos um dia novo, limpamos e calculamos
    calculate();
  } catch (err) {
    contentArea.innerHTML =
      '<p style="color:red; text-align:center; padding:20px;">Erro ao carregar ficheiro. Usa o Preview do WebStorm!</p>';
  }
}

function calculate() {
  let globalTotal = 0;

  // --- LÓGICA DIA 1 (Tribal Raid) ---
  const tribeTierEl = document.getElementById('tribeTier');
  if (tribeTierEl) {
    const stam = parseFloat(document.getElementById('staminaTotal').value) || 0;
    const cost = parseFloat(document.getElementById('staminaCost')?.value) || 5;
    const tier = parseFloat(tribeTierEl.value) || 0;

    const kills = Math.floor(stam / cost);
    const s1Total = kills * tier;

    if (document.getElementById('resKills'))
      document.getElementById('resKills').innerText = kills.toLocaleString();
    if (document.getElementById('resPoints'))
      document.getElementById('resPoints').innerText = s1Total.toLocaleString();
    if (document.getElementById('sub-st1'))
      document.getElementById('sub-st1').innerText = s1Total.toLocaleString();

    globalTotal = s1Total;
  }

  // --- LÓGICA DIA 5 (Unit Training) ---
  const unitRows = document.querySelectorAll('.unit-grid, .unit-row'); // Deteta ambos os estilos de classe
  if (unitRows.length > 0) {
    let s5Total = 0;
    unitRows.forEach((row) => {
      const pts = parseInt(row.dataset.pts) || 0;
      const qtyInput = row.querySelector('.u-qty, .mge-val');
      const qty = parseInt(qtyInput?.value) || 0;
      s5Total += pts * qty;
    });

    if (document.getElementById('sub-st5'))
      document.getElementById('sub-st5').innerText = s5Total.toLocaleString();
    globalTotal = s5Total;
    calcSprint(); // Calcula o sprint automaticamente se estiver no dia 5
  }

  // --- LÓGICA GERAL (Inputs Genéricos .mge-val) ---
  // Isto serve para o Dia 2, 4 e outros campos simples
  const genericInputs = document.querySelectorAll('.mge-val:not(.u-qty)');
  genericInputs.forEach((input) => {
    const pts = parseFloat(input.dataset.pts) || 0;
    const val = parseFloat(input.value) || 0;
    globalTotal += pts * val;
  });

  // --- ATUALIZAÇÃO DO PLACAR GLOBAL ---
  document.getElementById('totalPoints').innerText =
    Math.round(globalTotal).toLocaleString();
}

function calcSprint() {
  const bonusInput = document.getElementById('researchBonus');
  if (!bonusInput) return;

  const bonus = parseFloat(bonusInput.value) || 0;
  const targetLvl = document.getElementById('sp-target')?.value || 7;

  // Procura a linha da unidade correspondente para saber o tempo base
  const row = document.querySelector(`[data-lvl="${targetLvl}"]`);
  if (!row) return;

  const min = parseInt(row.querySelector('.u-min')?.value) || 0;
  const sec = parseInt(row.querySelector('.u-sec')?.value) || 0;

  const baseTotalSec = min * 60 + sec;
  const adjSec = baseTotalSec / (1 + bonus / 100);

  const d = parseInt(document.getElementById('sp-d')?.value) || 0;
  const h = parseInt(document.getElementById('sp-h')?.value) || 0;
  const m = parseInt(document.getElementById('sp-m')?.value) || 0;
  const s = parseInt(document.getElementById('sp-s')?.value) || 0;
  const totalSecAvailable = d * 86400 + h * 3600 + m * 60 + s;

  const qty = adjSec > 0 ? Math.floor(totalSecAvailable / adjSec) : 0;
  const pts = qty * (unitPoints[targetLvl] || 0);

  if (document.getElementById('sp-res-qty'))
    document.getElementById('sp-res-qty').innerText = qty.toLocaleString();
  if (document.getElementById('sp-res-pts'))
    document.getElementById('sp-res-pts').innerText = pts.toLocaleString();
}

// Carrega o Day 1 por defeito ao abrir
window.onload = () => loadDay('day1');
