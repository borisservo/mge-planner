/**
 * Lógica do Dia 2 - Stage 2: Hero Growth
 */

// Tabela de pontos do Dia 2 ligada aos IDs do HTML
const DAY2_POINTS = {
  'h-epic-medal': 500,
  'h-leg-medal': 2500,
  'h-epic-skill': 350,
  'h-leg-skill': 2000,
  'g-rare': 1000,
  'g-epic': 5000,
  'g-leg': 15000,
};

function calculateDay2() {
  let dayTotal = 0;

  // 1. Percorre a lista base e soma os pontos (Medalhas e Gear direto)
  for (const [id, pts] of Object.entries(DAY2_POINTS)) {
    const el = document.getElementById(id);
    if (el) {
      const val = parseFloat(el.value) || 0;
      dayTotal += val * pts;
    }
  }

  // ==========================================
  // 2. CÁLCULO DO IRON METEORITE (DINÂMICO)
  // ==========================================
  const meteorites =
    parseInt(document.getElementById('ironMeteorite')?.value) || 0;

  // Vai buscar a escolha do dropdown (Exemplo: "400|5000")
  const targetData =
    document.getElementById('meteoriteTarget')?.value || '400|5000';

  // O JavaScript corta a string a meio usando o "|" e transforma em números
  const [custoPorPeca, pontosPorPeca] = targetData.split('|').map(Number);

  let pecasFeitas = 0;
  let pontosMeteorito = 0;

  // Proteção contra divisão por zero
  if (custoPorPeca > 0) {
    pecasFeitas = Math.floor(meteorites / custoPorPeca);
    pontosMeteorito = pecasFeitas * pontosPorPeca;
  }

  // Atualiza o ecrã com as peças e os pontos que essas peças vão dar
  const elCrafted = document.getElementById('craftedPieces');
  if (elCrafted) elCrafted.innerText = pecasFeitas.toLocaleString();

  const elMetPts = document.getElementById('meteoritePts');
  if (elMetPts) elMetPts.innerText = pontosMeteorito.toLocaleString();

  dayTotal += pontosMeteorito;

  // ==========================================
  // 3. CÁLCULO DE TEMPO DE FORJA E SPEEDUPS
  // ==========================================

  // ==========================================
  // 3. CÁLCULO DE SPEEDUPS (SEM EVENT DAYS)
  // ==========================================

  // Tempo por Peça (HH:MM:SS) -> Segundos
  const fHours = parseInt(document.getElementById('forgeH')?.value) || 0;
  const fMins = parseInt(document.getElementById('forgeM')?.value) || 0;
  const fSecs = parseInt(document.getElementById('forgeS')?.value) || 0;
  const pieceSeconds = fHours * 3600 + fMins * 60 + fSecs;

  // Speedups (DD HH:MM) -> Segundos
  const sDays = parseInt(document.getElementById('spuD')?.value) || 0;
  const sHours = parseInt(document.getElementById('spuH')?.value) || 0;
  const sMins = parseInt(document.getElementById('spuM')?.value) || 0;
  const speedupSeconds = sDays * 86400 + sHours * 3600 + sMins * 60;

  let speedupPieces = 0;

  if (pieceSeconds > 0) {
    speedupPieces = Math.floor(speedupSeconds / pieceSeconds);
  }

  // Atualiza o ecrã
  const elExtForges = document.getElementById('extraForges');
  if (elExtForges) elExtForges.innerText = speedupPieces.toLocaleString();

  // Soma os pontos ao total do dia
  dayTotal += speedupPieces * pontosPorPeca;

  // FUNDAMENTAL: Devolve o valor para o Global Score
  return dayTotal;
}
