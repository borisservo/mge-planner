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
  // 2. CÁLCULO DO IRON METEORITE
  // ==========================================
  const meteorites =
    parseInt(document.getElementById('ironMeteorite')?.value) || 0;

  // 👇 AJUSTA ESTES VALORES COM O ZUMO 👇
  const custoPorPeca = 10; // Quantos meteoritos custa 1 forja?
  const pontosPorPeca = 500; // Quantos pontos dá 1 forja?

  const pecasFeitas = Math.floor(meteorites / custoPorPeca);
  const pontosMeteorito = pecasFeitas * pontosPorPeca;

  const elCrafted = document.getElementById('craftedPieces');
  if (elCrafted) {
    elCrafted.innerText = pecasFeitas.toLocaleString();
  }

  dayTotal += pontosMeteorito;

  // ==========================================
  // CÁLCULO DE TEMPO DE FORJA (HH:MM:SS) E SPEEDUPS (DD HH:MM)
  // ==========================================

  // 1. Dias do Evento (Convertidos para Segundos)
  const daysLeft = parseFloat(document.getElementById('eventDays')?.value) || 0;
  const totalEventSeconds = daysLeft * 24 * 60 * 60; // Dias para Segundos

  // 2. Tempo por Peça (HH:MM:SS) -> Converter para Segundos
  const fHours = parseInt(document.getElementById('forgeH')?.value) || 0;
  const fMins = parseInt(document.getElementById('forgeM')?.value) || 0;
  const fSecs = parseInt(document.getElementById('forgeS')?.value) || 0;

  const pieceSeconds = fHours * 3600 + fMins * 60 + fSecs;

  // 3. Speedups Disponíveis (DD HH:MM) -> Converter para Segundos
  const sDays = parseInt(document.getElementById('spuD')?.value) || 0;
  const sHours = parseInt(document.getElementById('spuH')?.value) || 0;
  const sMins = parseInt(document.getElementById('spuM')?.value) || 0;

  const speedupSeconds = sDays * 86400 + sHours * 3600 + sMins * 60;

  // 4. Calcular quantas peças cabem
  let naturalPieces = 0;
  let speedupPieces = 0;

  if (pieceSeconds > 0) {
    naturalPieces = Math.floor(totalEventSeconds / pieceSeconds);
    speedupPieces = Math.floor(speedupSeconds / pieceSeconds);
  }

  // 5. Atualizar os textos no ecrã
  const elNatForges = document.getElementById('naturalForges');
  if (elNatForges) elNatForges.innerText = naturalPieces.toLocaleString();

  const elExtForges = document.getElementById('extraForges');
  if (elExtForges) elExtForges.innerText = speedupPieces.toLocaleString();

  const elTotForges = document.getElementById('totalForgesPossible');
  if (elTotForges)
    elTotForges.innerText = (naturalPieces + speedupPieces).toLocaleString();

  // 6. Somar os pontos ao Total do Dia 2
  // IMPORTANTE: Estou a usar 5000 pontos por peça, ajusta conforme o teu jogo!
  const pontosPorPecaFinalizada = 5000;
  dayTotal += (naturalPieces + speedupPieces) * pontosPorPecaFinalizada;
}
