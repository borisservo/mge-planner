/**
 * Lógica do Dia 1 - Cálculo Automático de Stamina, Tribos e Exploração
 */

function calculateDay1() {
  // 1. Stamina e Tribos
  const stock = parseFloat(document.getElementById('staminaStock')?.value) || 0;
  const items = parseFloat(document.getElementById('staminaItems')?.value) || 0;
  const cost = parseFloat(document.getElementById('staminaCost')?.value) || 5;
  const tribePts = parseFloat(document.getElementById('tribeTier')?.value) || 0;

  const totalStamina = stock + items;
  const totalAttacks = cost > 0 ? Math.floor(totalStamina / cost) : 0;

  // Pontos vindos das Tribos
  const tribesScore = totalAttacks * tribePts;

  // 2. Exploração (Exploration)
  // O "?." previne erros caso o HTML ainda não tenha carregado
  const expCount =
    parseInt(document.getElementById('explorationCount')?.value) || 0;

  // Pontos vindos da Exploração (180 pts cada)
  const explorationScore = expCount * 180;

  // 3. Soma Total do Dia 1
  const dayTotal = tribesScore + explorationScore;

  // 4. Atualiza os resultados na caixa cinzenta (Previsão)
  const elKills = document.getElementById('resKills');
  const elPoints = document.getElementById('resPoints');

  if (elKills) elKills.innerText = totalAttacks.toLocaleString();
  if (elPoints) elPoints.innerText = dayTotal.toLocaleString(); // Agora mostra a soma dos dois!

  // 5. Devolve o total REAL para o script principal (Global Score)
  return dayTotal;
}
