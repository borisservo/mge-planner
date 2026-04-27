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

  // ==========================================
  // CÁLCULO DE FORGE SPEEDUPS (PEDIDO DO ZUMO)
  // ==========================================
  const fSpeedups =
    parseInt(document.getElementById('forgeSpeedups')?.value) || 0;
  const fTime = parseInt(document.getElementById('forgeTime')?.value) || 0;

  let forjasExtra = 0;

  // Proteção: Só faz a divisão se ele tiver preenchido o tempo da forja (para não dividir por zero)
  if (fTime > 0) {
    forjasExtra = Math.floor(fSpeedups / fTime);
  }

  // Mostra o número de forjas extra no ecrã
  const elExtraForges = document.getElementById('extraForges');
  if (elExtraForges) {
    elExtraForges.innerText = forjasExtra.toLocaleString();
  }

  // 👇 AJUSTA ESTE VALOR: Quantos pontos dá forjar 1 peça no evento? 👇
  const pontosPorForge = 500;

  // Soma os pontos destas forjas extra ao total do dia
  dayTotal += forjasExtra * pontosPorForge;
}
