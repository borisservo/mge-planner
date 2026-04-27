/**
 * Lógica do Dia 1 - Cálculo Automático de Stamina e Tribos
 */

function calculateDay1() {
  // 1. Vai buscar os valores de Stamina que escreveste
  const stock = parseFloat(document.getElementById('staminaStock')?.value) || 0;
  const items = parseFloat(document.getElementById('staminaItems')?.value) || 0;
  const cost = parseFloat(document.getElementById('staminaCost')?.value) || 5;

  // 2. Vai buscar os pontos da tribo que escolheste no dropdown
  const tribePts = parseFloat(document.getElementById('tribeTier')?.value) || 0;

  // 3. Faz os cálculos
  const totalStamina = stock + items;
  // Proteção para não dividir por zero caso apagues o AP cost
  const totalAttacks = cost > 0 ? Math.floor(totalStamina / cost) : 0;
  const dayTotal = totalAttacks * tribePts;

  const expCount =
    parseInt(document.getElementById('explorationCount').value) || 0;
  const pontosPorExploracao = 100; // <--- VALOR A CONFIRMAR COM O ZUMO
  total += expCount * pontosPorExploracao;

  // 4. Atualiza os resultados no ecrã (Previsão de Kills e Pontos)
  const elKills = document.getElementById('resKills');
  const elPoints = document.getElementById('resPoints');

  if (elKills) elKills.innerText = totalAttacks.toLocaleString();
  if (elPoints) elPoints.innerText = dayTotal.toLocaleString();

  // Devolve o total para o script principal somar ao Subtotal e ao Global
  return dayTotal;
}
