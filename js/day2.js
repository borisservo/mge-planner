/**
 * Day 2 Logic - Stage 2: Hero Growth
 */

function calculateDay2() {
  let dayTotal = 0;

  // 1. ADD TO GRAND TOTAL: Only Medals and manually inputted Gear crafts
  const baseItems = {
    'hero-epic-medal': 500,
    'hero-leg-medal': 2500,
    'hero-epic-skill': 350,
    'hero-leg-skill': 2000,
    'gear-rare': 1000,
    'gear-epic': 5000,
    'gear-leg': 15000, // Legendary gear = 15,000 points
  };

  // Loop through all inputs and sum their points
  for (const [id, pts] of Object.entries(baseItems)) {
    const el = document.getElementById(id);
    if (el) {
      dayTotal += (parseFloat(el.value) || 0) * pts;
    }
  }

  // ==========================================
  // 2. METEORITES (Visual tool only - Does NOT add to Day Total)
  // ==========================================
  const metAmount =
    parseInt(document.getElementById('meteoriteAmount')?.value) || 0;
  const metTarget =
    document.getElementById('meteoriteTarget')?.value || '400|5000';

  // Split the value string "Cost|Points" into two numbers
  const [cost, pts] = metTarget.split('|').map(Number);

  let pieces = 0;
  if (cost > 0) {
    pieces = Math.floor(metAmount / cost);
  }
  const metPts = pieces * pts;

  // Update the UI for Meteorites
  const uiPieces = document.getElementById('displayPieces');
  const uiPts = document.getElementById('displayPts');
  if (uiPieces) uiPieces.innerText = pieces.toLocaleString();
  if (uiPts) uiPts.innerText = metPts.toLocaleString();

  // ==========================================
  // 3. SPEEDUPS (Visual tool only - Does NOT add to Day Total)
  // ==========================================
  const pH = parseInt(document.getElementById('pieceH')?.value) || 0;
  const pM = parseInt(document.getElementById('pieceM')?.value) || 0;
  const pS = parseInt(document.getElementById('pieceS')?.value) || 0;
  const totalPieceSec = pH * 3600 + pM * 60 + pS;

  const sD = parseInt(document.getElementById('speedD')?.value) || 0;
  const sH = parseInt(document.getElementById('speedH')?.value) || 0;
  const sM = parseInt(document.getElementById('speedM')?.value) || 0;
  const totalSpeedSec = sD * 86400 + sH * 3600 + sM * 60;

  let extraCrafts = 0;
  if (totalPieceSec > 0) {
    extraCrafts = Math.floor(totalSpeedSec / totalPieceSec);
  }

  // Update the UI for Speedups
  const uiExtra = document.getElementById('displayExtra');
  if (uiExtra) uiExtra.innerText = extraCrafts.toLocaleString();

  // Return ONLY the confirmed points to the main score
  return dayTotal;
}
