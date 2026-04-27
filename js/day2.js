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
  // 3. CÁLCULO DE FORGE SPEEDUPS (PEDIDO DO ZUMO)
  // ==========================================
  const fSpeedups =
    parseInt(document.getElementById('forgeSpeedups')?.value) || 0;
  const fTime = parseInt(document.getElementById('forgeTime')?.value) || 0;

  let forjasExtra = 0;

  // Proteção: Só divide se ele tiver preenchido o tempo da forja
  if (fTime > 0) {
    forjasExtra = Math.floor(fSpeedups / fTime);
  }

  // Mostra o número de forjas extra no ecrã
  const elExtraForges = document.getElementById('extraForges');
  if (elExtraForges) {
    elExtraForges.innerText = forjasExtra.toLocaleString();
  }

  // Soma os pontos destas forjas extra (estou a usar a mesma variável de pontos de cima)
  dayTotal += forjasExtra * pontosPorPeca;

  // ==========================================
  // O RETURN FICA SEMPRE NO FIM DE TUDO!
  // ==========================================
  return dayTotal;
}
