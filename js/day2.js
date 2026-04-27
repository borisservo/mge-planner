/**
 * Day 2 Logic - Stage 2: Hero Growth
 */

const DAY2_POINTS_TABLE = {
  'hero-epic-medal': 500,
  'hero-leg-medal': 2500,
  'hero-epic-skill': 350,
  'hero-leg-skill': 2000,
  'gear-rare': 1000,
  'gear-epic': 5000,
  'gear-leg': 15000,
};

function calculateDay2() {
  let dayTotal = 0;

  // 1. Basic Items Calculation
  for (const [id, points] of Object.entries(DAY2_POINTS_TABLE)) {
    const element = document.getElementById(id);
    if (element) {
      dayTotal += (parseFloat(element.value) || 0) * points;
    }
  }

  // 2. Meteorites Calculation
  const meteoriteAmount =
    parseInt(document.getElementById('meteoriteAmount')?.value) || 0;
  const targetData =
    document.getElementById('meteoriteTarget')?.value || '400|5000';
  const [costPerPiece, pointsPerPiece] = targetData.split('|').map(Number);

  let piecesFromMeteorites = 0;
  if (costPerPiece > 0) {
    piecesFromMeteorites = Math.floor(meteoriteAmount / costPerPiece);
  }

  const meteoritePoints = piecesFromMeteorites * pointsPerPiece;
  dayTotal += meteoritePoints;

  // Update Meteorite UI
  const uiMeteoritePieces = document.getElementById('displayMeteoritePieces');
  const uiMeteoritePoints = document.getElementById('displayMeteoritePoints');
  if (uiMeteoritePieces) uiMeteoritePieces.innerText = piecesFromMeteorites;
  if (uiMeteoritePoints)
    uiMeteoritePoints.innerText = meteoritePoints.toLocaleString();

  // 3. Speedups Calculation
  const pieceH = parseInt(document.getElementById('time-h')?.value) || 0;
  const pieceM = parseInt(document.getElementById('time-m')?.value) || 0;
  const pieceS = parseInt(document.getElementById('time-s')?.value) || 0;
  const totalPieceSeconds = pieceH * 3600 + pieceM * 60 + pieceS;

  const speedD = parseInt(document.getElementById('speed-d')?.value) || 0;
  const speedH = parseInt(document.getElementById('speed-h')?.value) || 0;
  const speedM = parseInt(document.getElementById('speed-m')?.value) || 0;
  const totalSpeedupSeconds = speedD * 86400 + speedH * 3600 + speedM * 60;

  let extraPiecesFromSpeedups = 0;
  if (totalPieceSeconds > 0) {
    extraPiecesFromSpeedups = Math.floor(
      totalSpeedupSeconds / totalPieceSeconds,
    );
  }

  // Update Speedup UI
  const uiExtraForges = document.getElementById('displayExtraForges');
  if (uiExtraForges) uiExtraForges.innerText = extraPiecesFromSpeedups;

  // Add speedup crafted points to day total
  dayTotal += extraPiecesFromSpeedups * pointsPerPiece;

  // Return final sum to main calculator
  return dayTotal;
}
