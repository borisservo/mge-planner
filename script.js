// --- Configuration Tables ---
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

// --- Helper: Force Positive Integers ---
function validateInputs() {
  document.querySelectorAll('input[type="number"]').forEach((input) => {
    if (input.value !== '') {
      let val = Math.floor(Math.abs(parseFloat(input.value)));
      if (isNaN(val)) val = 0;
      if (input.value != val) input.value = val;
    }
  });
}

// --- Navigation Function ---
async function loadDay(dayId) {
  const area = document.getElementById('content-area');
  if (!area) return;

  try {
    const response = await fetch(`days/${dayId}.html`);
    if (!response.ok) throw new Error('File missing');
    area.innerHTML = await response.text();

    // Update Button Styles
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.classList.remove('active');
      if (btn.getAttribute('onclick').includes(dayId))
        btn.classList.add('active');
    });

    // Initialize Day 3
    if (dayId === 'day3') {
      lineupCount = 0;
      document.getElementById('lineupContainer').innerHTML = '';
      addLineup();
    }

    calculate();
  } catch (err) {
    area.innerHTML = `<div style="color:red; text-align:center; padding:50px;">
            <h3>Error loading ${dayId}.html</h3>
            <p>Ensure the file is inside the <b>/days</b> folder.</p>
        </div>`;
  }
}

// --- Main Calculation Engine ---
function calculate() {
  validateInputs();
  let dayTotal = 0;

  // Detect Active Day
  const subElement = document.querySelector('[id^="sub-st"]');
  if (!subElement) return;
  const dayId = subElement.id.replace('sub-st', 'day');

  try {
    // 1. Day 1: Stamina Logic
    const sStock = document.getElementById('staminaStock');
    const sCost = document.getElementById('staminaCost');
    if (sStock && sCost) {
      const totalS =
        (parseFloat(sStock.value) || 0) +
        (parseFloat(document.getElementById('staminaItems')?.value) || 0);
      const cost = parseFloat(sCost.value) || 5;
      const kills = cost > 0 ? Math.floor(totalS / cost) : 0;
      const pts =
        kills * (parseFloat(document.getElementById('tribeTier')?.value) || 0);
      document.getElementById('resKills').innerText = kills.toLocaleString();
      document.getElementById('resPoints').innerText = pts.toLocaleString();
      dayTotal = pts;
    }

    // 2. Day 3: Gathering Logic
    const lineups = document.querySelectorAll('[id^="lineup-"]');
    if (dayId === 'day3' && lineups.length > 0) {
      lineups.forEach((el) => {
        const lvl = el.querySelector('.l-lvl').value;
        const rds = parseFloat(el.querySelector('.l-rounds').value) || 0;
        const spd = parseFloat(el.querySelector('.l-speed').value) || 0;
        const load = parseFloat(el.querySelector('.l-load').value) || 0;
        const rich = el.querySelector('.l-rich').checked;

        const pts = ((rich ? resRich[lvl] : resNormal[lvl]) / 100) * rds;
        const time =
          ((rich ? richTimes[lvl] : baseTimes[lvl]) /
            ((1 + spd / 100) * (1 + load / 100))) *
          rds;

        el.querySelector('.l-pts').innerText = Math.round(pts).toLocaleString();
        el.querySelector('.l-time').innerText =
          `${Math.floor(time / 60)}h ${Math.round(time % 60)}m`;
        dayTotal += pts;
      });
    }

    // 3. Day 4: Speedups
    const bRow = document.getElementById('row-build');
    if (dayId === 'day4' && bRow) {
      const getSpdPts = (id) => {
        const r = document.getElementById(id);
        if (!r) return 0;
        const d = parseFloat(r.querySelector('.t-d').value) || 0;
        const h = parseFloat(r.querySelector('.t-h').value) || 0;
        const m = parseFloat(r.querySelector('.t-m').value) || 0;
        return (d * 1440 + h * 60 + m) * 30;
      };
      const bP = getSpdPts('row-build');
      const rP = getSpdPts('row-research');
      document.getElementById('pts-build').innerText = bP.toLocaleString();
      document.getElementById('pts-research').innerText = rP.toLocaleString();
      dayTotal += bP + rP;
    }

    // 4. Generic Inputs (.mge-val)
    document.querySelectorAll('.mge-val').forEach((input) => {
      dayTotal +=
        parseFloat(input.dataset.pts) * (parseFloat(input.value) || 0);
    });

    // 5. Day 5: Sprint (Speedup to Units)
    if (dayId === 'day5' && document.getElementById('sp-target')) {
      dayTotal += getSprintValue();
    }

    // Update UI and Save
    subElement.innerText = Math.round(dayTotal).toLocaleString();
    localStorage.setItem('mge_pts_' + dayId, dayTotal);
    updateGlobalScore();
  } catch (e) {
    console.warn('Calculation partial fail:', e);
  }
}

function getSprintValue() {
  const target = document.getElementById('sp-target')?.value || 7;
  const row = document.querySelector(`[data-lvl="${target}"]`);
  if (!row) return 0;
  const bonus =
    parseFloat(document.getElementById('researchBonus')?.value) || 0;
  const m = parseFloat(row.querySelector('.u-min').value) || 0;
  const s = parseFloat(row.querySelector('.u-sec').value) || 0;
  const totalSec =
    (parseFloat(document.getElementById('sp-d').value) || 0) * 86400 +
    (parseFloat(document.getElementById('sp-h').value) || 0) * 3600 +
    (parseFloat(document.getElementById('sp-m').value) || 0) * 60 +
    (parseFloat(document.getElementById('sp-s').value) || 0);
  const adjSec = (m * 60 + s) / (1 + bonus / 100);
  const qty = adjSec > 0 ? Math.floor(totalSec / adjSec) : 0;
  const pts = qty * (unitPoints[target] || 0);

  document.getElementById('sp-res-qty').innerText = qty.toLocaleString();
  document.getElementById('sp-res-pts').innerText = pts.toLocaleString();
  return pts;
}

function updateGlobalScore() {
  let total = 0;
  let dVals = [];
  for (let i = 1; i <= 5; i++) {
    let v = parseFloat(localStorage.getItem('mge_pts_day' + i)) || 0;
    dVals.push(v);
    total += v;
  }

  const tEl = document.getElementById('totalPoints');
  if (tEl) tEl.innerText = Math.round(total).toLocaleString();

  // Progress Bars
  dVals.forEach((v, i) => {
    const b = document.getElementById('bar-d' + (i + 1));
    if (b) b.style.width = total > 0 ? (v / total) * 100 + '%' : '0%';
  });

  // Goal Logic
  const gIn = document.getElementById('mge-goal');
  if (gIn) {
    const goal = parseFloat(gIn.value) || 0;
    localStorage.setItem('mge_target_goal', goal);
    const gTx = document.getElementById('goal-percent');
    if (gTx && goal > 0) {
      let p = (total / goal) * 100;
      gTx.innerText = Math.min(p, 100).toFixed(1) + '% Reached';
      gTx.style.color = p >= 100 ? '#1cc88a' : '#f6c23e';
    }
  }
}

function resetMGE() {
  if (confirm('Reset all data?')) {
    localStorage.clear();
    location.reload();
  }
}

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
            <b style="color: var(--blue);">March Lineup #${lineupCount}</b>
            <button onclick="this.parentElement.parentElement.remove(); calculate();" style="background:#ff4444; border:none; color:white; border-radius:4px; padding:2px 8px; cursor:pointer;">Remove</button>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px;">
            <div>
                <label style="font-size:0.7rem; color:#888; display:block; margin-bottom:4px;">Node Level</label>
                <select class="l-lvl" onchange="calculate()" style="width:100%; background:#000; color:#fff; border:1px solid #444; padding:5px; border-radius:4px;">
                    ${[8, 7, 6, 5, 4, 3, 2, 1].map((l) => `<option value="${l}">Level ${l}</option>`).join('')}
                </select>
            </div>
            <div>
                <label style="font-size:0.7rem; color:#888; display:block; margin-bottom:4px;">Total Rounds</label>
                <input type="number" class="l-rounds" value="0" oninput="calculate()" style="width:100%; background:#000; color:#fff; border:1px solid #444; padding:5px; border-radius:4px;">
            </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px;">
            <div>
                <label style="font-size:0.7rem; color:#888; display:block; margin-bottom:4px;">Gather Speed %</label>
                <input type="number" class="l-speed" value="0" oninput="calculate()" placeholder="Bonus Speed" style="width:100%; background:#000; color:#fff; border:1px solid #444; padding:5px; border-radius:4px;">
            </div>
            <div>
                <label style="font-size:0.7rem; color:#888; display:block; margin-bottom:4px;">Extra Load %</label>
                <input type="number" class="l-load" value="0" oninput="calculate()" placeholder="Bonus Load" style="width:100%; background:#000; color:#fff; border:1px solid #444; padding:5px; border-radius:4px;">
            </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; background:#111; padding:8px; border-radius:4px;">
            <label style="font-size:0.75rem;"><input type="checkbox" class="l-rich" onchange="calculate()"> <b>RICH DEPOSIT</b></label>
            <div style="text-align:right; font-size:0.8rem;">
                Time: <b class="l-time" style="color:#fff;">0h 0m</b> | Points: <b class="l-pts" style="color:var(--gold);">0</b>
            </div>
        </div>
    `;
  container.appendChild(div);
  calculate();
}

window.onload = () => {
  const savedGoal = localStorage.getItem('mge_target_goal');
  if (savedGoal && document.getElementById('mge-goal'))
    document.getElementById('mge-goal').value = savedGoal;
  loadDay('day1');
};
