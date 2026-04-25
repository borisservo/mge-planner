/**
 * Lógica do Dia 4 - Stage 4: Race Against Time
 */

// Tabela de pontos do Dia 4 ligada aos IDs do HTML
const DAY4_POINTS = {
  'r-copper': 400,
  'r-silver': 1000,
  'r-gold': 3000,
  'r-meteor': 20000,
  'sp-build': 30, // Por cada 1 minuto
  'sp-research': 30, // Por cada 1 minuto
  'c-fine': 2000,
};

function calculateDay4() {
  let dayTotal = 0;

  // Percorre a lista e soma os pontos automaticamente
  for (const [id, pts] of Object.entries(DAY4_POINTS)) {
    const el = document.getElementById(id);
    if (el) {
      const val = parseFloat(el.value) || 0;
      dayTotal += val * pts;
    }
  }

  return dayTotal;
}
