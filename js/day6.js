/**
 * Lógica do Dia 6 - Stage 6: Power Boost
 */

function calculateDay6() {
  let dayTotal = 0;

  const buildPower = parseFloat(document.getElementById('p-build')?.value) || 0;
  const techPower = parseFloat(document.getElementById('p-tech')?.value) || 0;
  const extraTroopPower =
    parseFloat(document.getElementById('p-train')?.value) || 0;

  // LÊ A CHECKBOX DO DIA 5
  const isD5ImportActive = localStorage.getItem('mge_val_d5-to-d6') === 'true';
  let importedPower = 0;

  if (isD5ImportActive) {
    // Se a checkbox estiver ligada, puxa o Power gerado no Dia 5
    importedPower = parseFloat(localStorage.getItem('mge_d5_troop_power')) || 0;
  }

  // Mostra no ecrã quanto power veio do Dia 5
  const elImport = document.getElementById('p-imported');
  if (elImport) elImport.innerText = importedPower.toLocaleString();

  // 2 pontos por cada 1 de Power ganho (incluindo o que veio do Dia 5)
  dayTotal = (buildPower + techPower + extraTroopPower + importedPower) * 2;

  return dayTotal;
}