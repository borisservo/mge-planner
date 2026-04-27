/**
 * Day 3 Logic - Stage 3: Gather Resources
 */

// Resource Tables (Base capacity of nodes)
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

// Time Tables (Base time required in minutes)
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

  // 1. Legendary Advent Points (1,000 pts per spin)
  const adventSpins =
    parseFloat(document.getElementById('advent-spins')?.value) || 0;
  dayTotal += adventSpins * 1000;

  // 2. Marches Calculation (Lineups 1 to 5)
  for (let i = 1; i <= 5; i++) {
    const lvl = parseInt(document.getElementById(`l${i}-level`)?.value) || 1;
    const isRich = document.getElementById(`l${i}-rich`)?.checked || false;
    const rounds =
      parseFloat(document.getElementById(`l${i}-rounds`)?.value) || 0;
    const speedBonus =
      parseFloat(document.getElementById(`l${i}-speed`)?.value) || 0;
    const compBonus =
      parseFloat(document.getElementById(`l${i}-comp`)?.value) || 0;

    if (rounds > 0) {
      // Fetch base values depending on node type (Rich vs Normal)
      const baseRes = isRich ? resRich[lvl] : resNormal[lvl];
      const baseTime = isRich ? richTimes[lvl] : baseTimes[lvl];

      if (baseRes > 0) {
        // Resources = (Base * Rounds) + Completion Bonus %
        const totalRes = baseRes * rounds * (1 + compBonus / 100);

        // 1 point per 100 resources
        const pts = Math.floor(totalRes / 100);
        dayTotal += pts;

        // Time = (Base Time * Rounds) reduced by Speed Bonus %
        const totalTimeMins = (baseTime * rounds) / (1 + speedBonus / 100);

        // Update visual panels
        updateLineupUI(i, totalRes, totalTimeMins, pts);
      } else {
        updateLineupUI(i, 0, 0, 0); // Failsafe (e.g. Lvl 1 Rich doesn't exist)
      }
    } else {
      updateLineupUI(i, 0, 0, 0);
    }
  }

  return dayTotal;
}

/**
 * Updates the screen with time converted to Days, Hours, and Minutes
 */
function updateLineupUI(id, res, timeMins, pts) {
  const elRes = document.getElementById(`l${id}-res`);
  const elTime = document.getElementById(`l${id}-time`);
  const elPts = document.getElementById(`l${id}-pts`);

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
