/**
 * Lógica do Dia 7 - Stage 7: Go All Out
 */

function calculateDay7() {
  let dayTotal = 0;

  // 1. TRIBOS (Defeat Tribes)
  const tribePts = {
    'd7-tr-1': 50,
    'd7-tr-5': 80,
    'd7-tr-9': 100,
    'd7-tr-13': 150,
    'd7-tr-17': 180,
    'd7-tr-21': 220,
    'd7-tr-25': 260,
    'd7-tr-29': 300,
  };
  for (const [id, pts] of Object.entries(tribePts)) {
    dayTotal += (parseFloat(document.getElementById(id)?.value) || 0) * pts;
  }

  // 2. LEGENDARY ADVENT
  const spins = parseFloat(document.getElementById('d7-spin')?.value) || 0;
  dayTotal += spins * 1000;

  // 3. GATHERING (1 pt por 100 recursos)
  const wood = parseFloat(document.getElementById('d7-wood')?.value) || 0;
  const food = parseFloat(document.getElementById('d7-food')?.value) || 0;
  const stone = parseFloat(document.getElementById('d7-stone')?.value) || 0;
  const gold = parseFloat(document.getElementById('d7-gold')?.value) || 0;

  dayTotal += Math.floor(wood / 100);
  dayTotal += Math.floor(food / 100);
  dayTotal += Math.floor(stone / 100);
  dayTotal += Math.floor(gold / 100);

  // 4. POWER INCREASE (Building & Tech)
  const build = parseFloat(document.getElementById('d7-build')?.value) || 0;
  const tech = parseFloat(document.getElementById('d7-tech')?.value) || 0;
  dayTotal += (build + tech) * 2;

  // 5. HERO UPGRADES
  const heroPts = {
    'd7-h-em': 500,
    'd7-h-lm': 2500,
    'd7-h-es': 350,
    'd7-h-ls': 2000,
  };
  for (const [id, pts] of Object.entries(heroPts)) {
    dayTotal += (parseFloat(document.getElementById(id)?.value) || 0) * pts;
  }

  // ========================================================
  // 6. UNIT TRAINING (Novos Speedups & Unidades para o Dia 7)
  // Regra: 1 Power = 2 Pontos
  // ========================================================
  let d7TroopPower = 0;

  // Calculadora de Speedups do Dia 7
  const d7Lvl = parseInt(document.getElementById('d7-tc-lvl')?.value) || 9;
  const d7Min = parseFloat(document.getElementById('d7-tc-min')?.value) || 0;
  const d7Sec = parseFloat(document.getElementById('d7-tc-sec')?.value) || 0;
  const d7Spd = parseFloat(document.getElementById('d7-tc-spd')?.value) || 0;
  const d7Sph = parseFloat(document.getElementById('d7-tc-sph')?.value) || 0;
  const d7Spm = parseFloat(document.getElementById('d7-tc-spm')?.value) || 0;

  const d7TimePerUnitSecs = d7Min * 60 + d7Sec;
  const d7TotalSpeedupsSecs = d7Spd * 86400 + d7Sph * 3600 + d7Spm * 60;

  let d7CalcUnits = 0;
  if (d7TimePerUnitSecs > 0 && d7TotalSpeedupsSecs > 0) {
    d7CalcUnits = Math.floor(d7TotalSpeedupsSecs / d7TimePerUnitSecs);
    d7TroopPower += d7CalcUnits * unitPower[d7Lvl];
  }

  // Atualiza painel do conversor
  const elD7Units = document.getElementById('d7-tc-units');
  const elD7Pts = document.getElementById('d7-tc-pts');
  if (elD7Units) elD7Units.innerText = d7CalcUnits.toLocaleString();
  if (elD7Pts)
    elD7Pts.innerText = Math.floor(
      d7CalcUnits * unitPower[d7Lvl] * 2,
    ).toLocaleString();

  // Soma as tropas extra manuais (Lvl 3 a 9)
  for (let l = 3; l <= 9; l++) {
    const qty = parseFloat(document.getElementById(`d7-u-lvl${l}`)?.value) || 0;
    d7TroopPower += qty * unitPower[l];
  }

  // Adiciona o total de treino ao dia (multiplicado por 2)
  dayTotal += d7TroopPower * 2;

  return dayTotal;
}
