/**
 * Day 7 Logic - Stage 7: Go All Out
 */

function calculateDay7() {
  let dayTotal = 0;

  // 1. COMBAT (Tribes)
  const tribePoints = {
    'd7-tb-1': 50,
    'd7-tb-5': 80,
    'd7-tb-9': 100,
    'd7-tb-13': 150,
    'd7-tb-17': 180,
    'd7-tb-21': 220,
    'd7-tb-25': 260,
    'd7-tb-29': 300,
  };
  for (const [id, pts] of Object.entries(tribePoints)) {
    dayTotal += (parseFloat(document.getElementById(id)?.value) || 0) * pts;
  }

  // 2. GATHERING & SPINS
  const totalRes = parseFloat(document.getElementById('d7-res')?.value) || 0;
  dayTotal += Math.floor(totalRes / 100); // 1 point per 100 resources

  const spins = parseFloat(document.getElementById('d7-spins')?.value) || 0;
  dayTotal += spins * 1000;

  // 3. POWER BOOSTS
  const buildPwr =
    parseFloat(document.getElementById('d7-pw-build')?.value) || 0;
  const techPwr = parseFloat(document.getElementById('d7-pw-tech')?.value) || 0;
  const trainPwr =
    parseFloat(document.getElementById('d7-pw-train')?.value) || 0;

  dayTotal += buildPwr * 3 + techPwr * 6 + trainPwr * 3;

  // 4. SPEEDUPS (DD HH MM -> Minutes)
  const bdD = parseInt(document.getElementById('d7-sb-d')?.value) || 0;
  const bdH = parseInt(document.getElementById('d7-sb-h')?.value) || 0;
  const bdM = parseInt(document.getElementById('d7-sb-m')?.value) || 0;
  const totalBuildMins = bdD * 1440 + bdH * 60 + bdM;

  const rsD = parseInt(document.getElementById('d7-sr-d')?.value) || 0;
  const rsH = parseInt(document.getElementById('d7-sr-h')?.value) || 0;
  const rsM = parseInt(document.getElementById('d7-sr-m')?.value) || 0;
  const totalResMins = rsD * 1440 + rsH * 60 + rsM;

  dayTotal += totalBuildMins * 30 + totalResMins * 30;

  // 5. HERO UPGRADES & ITEMS
  const inventoryItems = {
    'd7-h-em': 500,
    'd7-h-lm': 2500,
    'd7-h-es': 350,
    'd7-h-ls': 2000,
    'd7-r-c': 400,
    'd7-r-s': 1000,
    'd7-r-g': 3000,
    'd7-r-m': 20000,
    'd7-craft': 2000,
  };

  for (const [id, pts] of Object.entries(inventoryItems)) {
    dayTotal += (parseFloat(document.getElementById(id)?.value) || 0) * pts;
  }

  return dayTotal;
}
