/**
 * Lógica do Dia 3 - Stage 3: Gather Resources
 */

// Tabelas de Recursos
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
  1: 0,
  2: 720000,
  3: 1800000,
  4: 3040000,
  5: 7200000,
  6: 12600000,
  7: 17640000,
  8: 24640000,
};

// Tabelas de Tempo Base (em minutos)
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
  1: 0,
  2: 120,
  3: 300,
  4: 480,
  5: 1080,
  6: 1800,
  7: 2520,
  8: 3360,
};

function calculateDay3() {
  let dayTotal = 0;

  // 1. Pontos do Legendary Advent (1,000 pts por spin)
  const adventSpins =
    parseFloat(document.getElementById('spin-advent')?.value) || 0;
  dayTotal += adventSpins * 1000;

  // 2. Cálculo das Marchas (Lineups 1 a 5)
  for (let i = 1; i <= 5; i++) {
    const lvl = parseInt(document.getElementById(`l${i}-lvl`)?.value) || 1;
    const isRich = document.getElementById(`l${i}-rich`)?.checked || false;
    const rounds =
      parseFloat(document.getElementById(`l${i}-rounds`)?.value) || 0;
    const speedBonus =
      parseFloat(document.getElementById(`l${i}-speed`)?.value) || 0;
    const compBonus =
      parseFloat(document.getElementById(`l${i}-comp`)?.value) || 0;

    if (rounds > 0) {
      // Vai buscar base
      const baseRes = isRich ? resRich[lvl] : resNormal[lvl];
      const baseTime = isRich ? richTimes[lvl] : baseTimes[lvl];

      if (baseRes > 0) {
        // Recursos = (Base * Rounds) + % Bónus de Conclusão
        const totalRes = baseRes * rounds * (1 + compBonus / 100);
        const pts = Math.floor(totalRes / 100); // 1 pt a cada 100 recursos
        dayTotal += pts;

        // Tempo = (Tempo Base * Rounds) / (1 + Bónus de Velocidade)
        const totalTimeMins = (baseTime * rounds) / (1 + speedBonus / 100);

        // Atualiza os painéis visuais
        updateLineupUI(i, totalRes, totalTimeMins, pts);
      } else {
        updateLineupUI(i, 0, 0, 0); // Lvl 1 Rich não existe
      }
    } else {
      updateLineupUI(i, 0, 0, 0);
    }
  }

  return dayTotal;
}

// Atualiza o ecrã com o tempo convertido em dias, horas e minutos
function updateLineupUI(id, res, timeMins, pts) {
  const elRes = document.getElementById(`l${id}-res-out`);
  const elTime = document.getElementById(`l${id}-time-out`);
  const elPts = document.getElementById(`l${id}-pts-out`);

  if (elRes) elRes.innerText = Math.floor(res).toLocaleString();
  if (elPts) elPts.innerText = pts.toLocaleString();

  if (elTime) {
    const d = Math.floor(timeMins / 1440);
    const h = Math.floor((timeMins % 1440) / 60);
    const m = Math.floor(timeMins % 60);
    let timeStr = '';
    if (d > 0) timeStr += `${d}d `;
    if (h > 0 || d > 0) timeStr += `${h}h `;
    timeStr += `${m}m`;
    elTime.innerText = timeMins > 0 ? timeStr : '0m';
  }
}
