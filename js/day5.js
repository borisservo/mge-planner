/**
 * Day 5 Logic - Stage 5: Unit Training
 */

function calculateDay5() {
  // Tabelas Completas (T1 a T9)
  const unitPower = {
    9: 12.5,
    8: 8.6,
    7: 6,
    6: 4.2,
    5: 2.9,
    4: 2.0,
    3: 1.5,
    2: 1.0,
    1: 0.5,
  };
  const unitPoints = {
    9: 200,
    8: 150,
    7: 100,
    6: 50,
    5: 20,
    4: 10,
    3: 5,
    2: 3,
    1: 2,
  };

  let rawDayTotal = 0;
  let totalTroopPower = 0;
  let totalSoldiers = 0;

  // 1. CALCULADORA DE SPEEDUPS (TREINO NOVO)
  const lvl = parseInt(document.getElementById('tc-lvl')?.value) || 9;
  const tMin = parseFloat(document.getElementById('tc-min')?.value) || 0;
  const tSec = parseFloat(document.getElementById('tc-sec')?.value) || 0;
  const spDays = parseFloat(document.getElementById('tc-spd')?.value) || 0;
  const spHrs = parseFloat(document.getElementById('tc-sph')?.value) || 0;
  const spMin = parseFloat(document.getElementById('tc-spm')?.value) || 0;

  const timePerUnitSecs = tMin * 60 + tSec;
  const totalSpeedupsSecs = spDays * 86400 + spHrs * 3600 + spMin * 60;

  if (timePerUnitSecs > 0 && totalSpeedupsSecs > 0) {
    const calcUnits = Math.floor(totalSpeedupsSecs / timePerUnitSecs);
    const calcPts = calcUnits * (unitPoints[lvl] || 0);
    const calcPower = calcUnits * (unitPower[lvl] || 0);

    document.getElementById('tc-units').innerText = calcUnits.toLocaleString();
    document.getElementById('tc-pts').innerText = calcPts.toLocaleString();

    rawDayTotal += calcPts;
    totalTroopPower += calcPower;
    totalSoldiers += calcUnits;
  }

  // 2. PROMOÇÃO DE UNIDADES (RESULTING GAP)
  const pFrom = parseInt(document.getElementById('promo-from')?.value) || 1;
  const pTo = parseInt(document.getElementById('promo-to')?.value) || 5;
  const pQty = parseFloat(document.getElementById('promo-qty')?.value) || 0;

  if (pQty > 0) {
    const gapPts = Math.max(0, unitPoints[pTo] - unitPoints[pFrom]);
    const gapPower = Math.max(0, unitPower[pTo] - unitPower[pFrom]);
    const totalPromoPts = gapPts * pQty;
    const totalPromoPower = gapPower * pQty;

    document.getElementById('promo-gap-val').innerText = gapPts;
    document.getElementById('promo-total-pts').innerText =
      totalPromoPts.toLocaleString();

    rawDayTotal += totalPromoPts;
    totalTroopPower += totalPromoPower;
    // Nota: Em promoção, o número total de soldados não aumenta, apenas a qualidade
  }

  // 3. MANUAL UNITS (T1-T9)
  // Se o container estiver vazio, gera os inputs uma vez
  const container = document.getElementById('units-container');
  if (container && container.innerHTML.trim() === '') {
    let html = '';
    for (let i = 9; i >= 1; i--) {
      html += `
        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); padding:5px 8px; border-radius:5px; border:1px solid #333;">
            <div style="width: 35%;"><label style="font-size:0.65rem; color:#aaa;">T${i} (${unitPoints[i]}p)</label><input type="number" id="u-lvl${i}" value="0" oninput="calculate()" style="width:100%; background:#000; color:#fff; border:1px solid #444; padding:4px;"></div>
            <div style="width: 60%; font-size: 0.6rem; display:flex; justify-content:space-around; background:#000; padding:4px; border-radius:4px;">
                <div style="text-align:center;"><span style="color:#888;">D5 Pts</span><br><b id="u-lvl${i}-d5" style="color:#3498db;">0</b></div>
                <div style="text-align:center;"><span style="color:#888;">D6 Pts</span><br><b id="u-lvl${i}-d6" style="color:#f1c40f;">0</b></div>
            </div>
        </div>`;
    }
    container.innerHTML = html;
  }

  // Atualiza os valores manuais
  for (let i = 1; i <= 9; i++) {
    const qty = parseFloat(document.getElementById(`u-lvl${i}`)?.value) || 0;
    const ptsD5 = qty * unitPoints[i];
    const pwr = qty * unitPower[i];

    rawDayTotal += ptsD5;
    totalTroopPower += pwr;
    totalSoldiers += qty;

    if (document.getElementById(`u-lvl${i}-d5`))
      document.getElementById(`u-lvl${i}-d5`).innerText =
        ptsD5.toLocaleString();
    if (document.getElementById(`u-lvl${i}-d6`))
      document.getElementById(`u-lvl${i}-d6`).innerText = Math.floor(
        pwr * 2,
      ).toLocaleString();
  }

  // 4. UI SUMMARY & SAVING
  const summaryDisplay = document.getElementById('d5-summary-display');
  if (summaryDisplay) {
    summaryDisplay.innerText = `${totalSoldiers.toLocaleString()} units | ${Math.floor(totalTroopPower).toLocaleString()} Pwr`;
  }

  const sendToDay6 = document.getElementById('d5-to-d6')?.checked;
  if (sendToDay6) {
    localStorage.setItem('mge_d5_troop_power', totalTroopPower);
    localStorage.setItem('mge_d5_troop_count', totalSoldiers);
    return 0;
  } else {
    localStorage.setItem('mge_d5_troop_power', 0);
    localStorage.setItem('mge_d5_troop_count', 0);
    return rawDayTotal;
  }
}
