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

  // Percorre a lista acima e soma os pontos
  for (const [id, pts] of Object.entries(DAY2_POINTS)) {
    const el = document.getElementById(id);
    if (el) {
      const val = parseFloat(el.value) || 0;
      dayTotal += val * pts;
    }
  }

  return dayTotal;
}
