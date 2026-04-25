/**
 * Lógica do Dia 5 - Stage 5: Unit Training
 */

const DAY5_POINTS = { 3: 5, 4: 10, 5: 20, 6: 50, 7: 100, 8: 150, 9: 200 };

function calculateDay5() {
  let dayTotal = 0;
  let d5TroopPower = 0;

  // 1. CALCULADORA ÚNICA DE SPEEDUPS
  const lvl = parseInt(document.getElementById('tc-lvl')?.value) || 9;

  // Tempo de 1 unidade (Min/Sec)
  const tMin = parseFloat(document.getElementById('tc-min')?.value) || 0;
  const tSec = parseFloat(document.getElementById('tc-sec')?.value) || 0;

  // Speedups Totais (Dias/Horas/Min)
  const spDays = parseFloat(document.getElementById('tc-spd')?.value) || 0;
  const spHrs = parseFloat(document.getElementById('tc-sph')?.value) || 0;
  const spMin = parseFloat(document.getElementById('tc-spm')?.value) || 0;

  const timePerUnitSecs = tMin * 60 + tSec;
  // 1 Dia = 86400s | 1 Hora = 3600s | 1 Minuto = 60s
  const totalSpeedupsSecs = spDays * 86400 + spHrs * 3600 + spMin * 60;

  let calcUnits = 0;
  let calcPts = 0;
  let calcPower = 0;

  if (timePerUnitSecs > 0 && totalSpeedupsSecs > 0) {
    calcUnits = Math.floor(totalSpeedupsSecs / timePerUnitSecs);
    calcPts = calcUnits * DAY5_POINTS[lvl];
    calcPower = calcUnits * unitPower[lvl];
  }

  // Atualiza o ecrã
  const elUnits = document.getElementById('tc-units');
  const elPts = document.getElementById('tc-pts');
  if (elUnits) elUnits.innerText = calcUnits.toLocaleString();
  if (elPts) elPts.innerText = calcPts.toLocaleString();

  dayTotal += calcPts;
  d5TroopPower += calcPower;

  // 2. INPUTS MANUAIS (Para tropas extra)
  for (let l = 3; l <= 9; l++) {
    const qty = parseFloat(document.getElementById(`u-lvl${l}`)?.value) || 0;

    const ptsDay5 = qty * DAY5_POINTS[l];
    const powerGenerated = qty * unitPower[l];

    dayTotal += ptsDay5;
    d5TroopPower += powerGenerated;

    const ptsDay6 = powerGenerated * 2;

    const elD5 = document.getElementById(`u-lvl${l}-d5`);
    const elD6 = document.getElementById(`u-lvl${l}-d6`);
    if (elD5) elD5.innerText = ptsDay5.toLocaleString();
    if (elD6) elD6.innerText = ptsDay6.toLocaleString();
  }

  // Grava o Power para o Dia 6 (Se a checkbox estiver ligada)
  localStorage.setItem('mge_d5_troop_power', d5TroopPower);

  return dayTotal;
}
