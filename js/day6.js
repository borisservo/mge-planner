/**
 * Day 6 Logic - Stage 6: Power Boost
 */

function calculateDay6() {
  const unitPowerMap = {
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

  // 1. Inputs Manuais
  const buildPower = parseFloat(document.getElementById('p-build')?.value) || 0;
  const techPower = parseFloat(document.getElementById('p-tech')?.value) || 0;
  const extraTroopPower =
    parseFloat(document.getElementById('p-train')?.value) || 0;

  // 2. 24h Passive Calculation
  const secPerUnit = parseFloat(document.getElementById('p6-sec')?.value) || 0;
  const tier = parseInt(document.getElementById('p6-lvl')?.value) || 9;

  let passiveUnits = 0;
  let passivePower = 0;

  if (secPerUnit > 0) {
    passiveUnits = Math.floor(86400 / secPerUnit); // 86400s num dia
    passivePower = passiveUnits * (unitPowerMap[tier] || 0);
  }

  // Update Passive UI
  if (document.getElementById('p6-yield-units'))
    document.getElementById('p6-yield-units').innerText =
      passiveUnits.toLocaleString();
  if (document.getElementById('p6-yield-pwr'))
    document.getElementById('p6-yield-pwr').innerText =
      Math.floor(passivePower).toLocaleString();

  // 3. Import from Day 5
  const importedPower =
    parseFloat(localStorage.getItem('mge_d5_troop_power')) || 0;
  const importedCount =
    parseFloat(localStorage.getItem('mge_d5_troop_count')) || 0;

  if (document.getElementById('p-imported-units'))
    document.getElementById('p-imported-units').innerText =
      importedCount.toLocaleString();
  if (document.getElementById('p-imported-pwr'))
    document.getElementById('p-imported-pwr').innerText =
      Math.floor(importedPower).toLocaleString();

  // 4. CÁLCULO FINAL (Com multiplicadores específicos)
  // Building * 3 | Tech * 6 | All Troops * 3
  const totalTroopPower = extraTroopPower + passivePower + importedPower;

  const dayTotal = buildPower * 3 + techPower * 6 + totalTroopPower * 3;

  return dayTotal;
}
