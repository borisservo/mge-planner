/**
 * Day 4 Logic - Stage 4: Race Against Time
 */

function calculateDay4() {
  let dayTotal = 0;

  // 1. Direct Point Items (Rings and Fine Crafting)
  const baseItems = {
    'r-copper': 400,
    'r-silver': 1000,
    'r-gold': 3000,
    'r-meteor': 20000,
    'c-fine': 2000,
  };

  for (const [id, pts] of Object.entries(baseItems)) {
    const el = document.getElementById(id);
    if (el) {
      dayTotal += (parseFloat(el.value) || 0) * pts;
    }
  }

  // 2. Building Speedups Calculation (Convert DD HH MM to minutes)
  const buildD = parseInt(document.getElementById('build-d')?.value) || 0;
  const buildH = parseInt(document.getElementById('build-h')?.value) || 0;
  const buildM = parseInt(document.getElementById('build-m')?.value) || 0;

  // 1 Day = 1440 minutes, 1 Hour = 60 minutes
  const totalBuildMins = buildD * 1440 + buildH * 60 + buildM;
  const buildPoints = totalBuildMins * 30; // 30 pts per minute

  dayTotal += buildPoints;

  // Update UI for Building Points
  const uiBuildPts = document.getElementById('build-pts');
  if (uiBuildPts) uiBuildPts.innerText = buildPoints.toLocaleString();

  // 3. Research Speedups Calculation (Convert DD HH MM to minutes)
  const resD = parseInt(document.getElementById('res-d')?.value) || 0;
  const resH = parseInt(document.getElementById('res-h')?.value) || 0;
  const resM = parseInt(document.getElementById('res-m')?.value) || 0;

  // 1 Day = 1440 minutes, 1 Hour = 60 minutes
  const totalResMins = resD * 1440 + resH * 60 + resM;
  const resPoints = totalResMins * 30; // 30 pts per minute

  dayTotal += resPoints;

  // Update UI for Research Points
  const uiResPts = document.getElementById('res-pts');
  if (uiResPts) uiResPts.innerText = resPoints.toLocaleString();

  return dayTotal;
}
