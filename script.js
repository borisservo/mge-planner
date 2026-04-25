// Tabelas de Dados
const resNormal = {
  1: 54000,
  2: 216000,
  3: 540000,
  4: 912000,
  5: 2160000,
  6: 3780000,
  7: 5292000,
  8: 7392000,
};
const resRich = {
  2: 720000,
  3: 1800000,
  4: 3040000,
  5: 7200000,
  6: 12600000,
  7: 17640000,
  8: 24640000,
};
const baseTimes = {
  1: 18,
  2: 72,
  3: 180,
  4: 288,
  5: 648,
  6: 1080,
  7: 1512,
  8: 2016,
};
const richTimes = {
  2: 120,
  3: 300,
  4: 480,
  5: 1080,
  6: 1800,
  7: 2520,
  8: 3360,
};
const unitPoints = { 7: 100, 6: 50, 5: 20, 4: 10, 3: 5 };

let lineupCount = 0;

// Carregar Subpáginas
async function loadDay(dayId) {
  const area = document.getElementById('content-area');
  try {
    const res = await fetch(`days/${dayId}.html`);
    area.innerHTML = await res.text();

    document
      .querySelectorAll('.tab-btn')
      .forEach((b) => b.classList.remove('active'));
    const btn = document.querySelector(`[onclick*="${dayId}"]`);
    if (btn) btn.classList.add('active');

    if (dayId === 'day3') {
      lineupCount = 0;
      addLineup();
    }
    calculate();
  } catch (e) {
    area.innerHTML = `<p style="color:red; text-align:center;">Erro: Abrir pelo Preview do WebStorm!</p>`;
  }
}

// Função de Adicionar Linha no Dia 3
function addLineup() {
  const container = document.getElementById('lineupContainer');
  if (!container) return;
  lineupCount++;
  const div = document.createElement('div');
  div.className = 'prediction';
  div.id = 'lineup-' + lineupCount;
  div.style.marginBottom = '15px';

  div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; margin-bottom:10px; padding-bottom:5px;">
            <span style="color:var(--gold); font-weight:bold;">Lineup ${lineupCount}</span>
            <div style="display:flex; align-items:center; gap:12px;">
                <label style="margin:0; display:flex; align-items:center; gap:6px; cursor:pointer; color:var(--blue); font-size:0.8rem;">
                    <input type="checkbox" class="l-rich" onchange="calculate()"> <b>RICH</b>
                </label>
                <button onclick="this.parentElement.parentElement.parentElement.remove(); calculate();" style="background:#ff4444; color:white; border:none; border-radius:4px; padding:2px 10px; cursor:pointer;">X</button>
            </div>
        </div>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px;">
            <div><label>Level</label><select class="l-lvl" onchange="calculate()">${[8, 7, 6, 5, 4, 3, 2, 1].map((l) => `<option value="${l}">Lvl ${l}</option>`).join('')}</select></div>
            <div><label>Rounds</label><input type="number" class="l-rounds" value="1" oninput="calculate()"></div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; border-top: 1px solid #222; pt: 10px;">
            <div><label>Speed %</label><input type="number" class="l-speed" value="0" oninput="calculate()"></div>
            <div><label>Extra Load %</label><input type="number" class="l-load" value="0" oninput="calculate()"></div>
        </div>

        <div style="margin-top:10px; display:flex; justify-content:flex-end; gap:15px; font-size:0.85rem; background:#111; padding:8px; border-radius:4px;">
            <span style="color:#888;">Time: <b class="l-time" style="color:#fff;">0h 0m</b></span>
            <span style="color:#888;">Points: <b class="l-pts" style="color:var(--gold);">0</b></span>
        </div>`;
  container.appendChild(div);
  calculate();
}

// O Grande Motor de Cálculo
function calculate() {
  let globalTotal = 0;

  // Lógica Dia 1
  const tribe = document.getElementById('tribeTier');
  if (tribe) {
    const stam = parseFloat(document.getElementById('staminaTotal').value) || 0;
    const kills = Math.floor(stam / 5);
    const pts = kills * parseFloat(tribe.value);
    document.getElementById('resKills').innerText = kills.toLocaleString();
    document.getElementById('resPoints').innerText = pts.toLocaleString();
    document.getElementById('sub-st1').innerText = pts.toLocaleString();
    globalTotal = pts;
  }

  // --- LÓGICA DIA 3 (GATHERING) ---
  const lineups = document.querySelectorAll('[id^="lineup-"]');
  if (lineups.length > 0) {
    let s3 = 0;
    lineups.forEach((el) => {
      const lvl = el.querySelector('.l-lvl').value;
      const rounds = parseFloat(el.querySelector('.l-rounds').value) || 0;
      const isRich = el.querySelector('.l-rich').checked;

      // Lê os bónus específicos desta lineup
      const gSpeed = parseFloat(el.querySelector('.l-speed').value) || 0;
      const eLoad = parseFloat(el.querySelector('.l-load').value) || 0;

      // Pontos
      const pts = ((isRich ? resRich[lvl] : resNormal[lvl]) / 100) * rounds;
      el.querySelector('.l-pts').innerText = Math.round(pts).toLocaleString();

      // Tempo Ajustado por bónus individuais
      const baseMins = isRich ? richTimes[lvl] : baseTimes[lvl];
      const adjustedMins =
        (baseMins / ((1 + gSpeed / 100) * (1 + eLoad / 100))) * rounds;

      const h = Math.floor(adjustedMins / 60);
      const m = Math.round(adjustedMins % 60);
      el.querySelector('.l-time').innerText = `${h}h ${m}m`;

      s3 += pts;
    });
    document.getElementById('sub-st3').innerText =
      Math.round(s3).toLocaleString();
    globalTotal = s3;
  }
  // Lógica Dias 2, 4, 5 (Inputs MGE-VAL)
  const generics = document.querySelectorAll('.mge-val');
  generics.forEach(
    (i) =>
      (globalTotal += parseFloat(i.dataset.pts) * (parseFloat(i.value) || 0)),
  );

  // --- LÓGICA DIA 4 (RACE AGAINST TIME) ---
  const sub4 = document.getElementById('sub-st4');
  if (sub4) {
    const rowBuild = document.getElementById('row-build');
    const rowResearch = document.getElementById('row-research');
    let s4SpeedTotal = 0;
    let buildPts = 0;
    let researchPts = 0;

    // 1. Calcula Pontos de Construção
    if (rowBuild) {
      const d = parseFloat(rowBuild.querySelector('.t-d').value) || 0;
      const h = parseFloat(rowBuild.querySelector('.t-h').value) || 0;
      const m = parseFloat(rowBuild.querySelector('.t-m').value) || 0;
      buildPts = (d * 1440 + h * 60 + m) * 30;
      document.getElementById('pts-build').innerText =
        buildPts.toLocaleString();
    }

    // 2. Calcula Pontos de Investigação
    if (rowResearch) {
      const d = parseFloat(rowResearch.querySelector('.t-d').value) || 0;
      const h = parseFloat(rowResearch.querySelector('.t-h').value) || 0;
      const m = parseFloat(rowResearch.querySelector('.t-m').value) || 0;
      researchPts = (d * 1440 + h * 60 + m) * 30;
      document.getElementById('pts-research').innerText =
        researchPts.toLocaleString();
    }

    // 3. Calcula Pontos de Materiais (Todos os mge-val desta página)
    let s4Materials = 0;
    document.querySelectorAll('.mge-val').forEach((input) => {
      const pts = parseFloat(input.dataset.pts) || 0;
      const qty = parseFloat(input.value) || 0;
      s4Materials += pts * qty;
    });

    // 4. Soma Final do Dia 4
    const totalDay4 = buildPts + researchPts + s4Materials;
    sub4.innerText = Math.round(totalDay4).toLocaleString();
    globalTotal = totalDay4;
  }
  // Placar Global
  document.getElementById('totalPoints').innerText =
    Math.round(globalTotal).toLocaleString();
  if (document.getElementById('sp-res-qty')) calcSprint();
}

// Sprint do Dia 5
function calcSprint() {
  const bonus = parseFloat(document.getElementById('researchBonus').value) || 0;
  const target = document.getElementById('sp-target').value;
  const row = document.querySelector(`[data-lvl="${target}"]`);
  const baseSec =
    parseInt(row.querySelector('.u-min').value) * 60 +
    parseInt(row.querySelector('.u-sec').value);
  const adjSec = baseSec / (1 + bonus / 100);
  const totalSec =
    (parseFloat(document.getElementById('sp-d').value) || 0) * 86400 +
    (parseFloat(document.getElementById('sp-h').value) || 0) * 3600 +
    (parseFloat(document.getElementById('sp-m').value) || 0) * 60 +
    (parseFloat(document.getElementById('sp-s').value) || 0);
  const qty = adjSec > 0 ? Math.floor(totalSec / adjSec) : 0;
  document.getElementById('sp-res-qty').innerText = qty.toLocaleString();
  document.getElementById('sp-res-pts').innerText = (
    qty * unitPoints[target]
  ).toLocaleString();
}

window.onload = () => loadDay('day1');
