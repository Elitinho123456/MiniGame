import fs from 'fs';

const file = 'c:/Users/Eliti/OneDrive/Documentos/GitHub/MiniGame/src/assets/consts.ts';
let content = fs.readFileSync(file, 'utf8');

const multipliers = {
  wood: 2,
  stone: 5,
  cooper: 10,
  copper: 10,
  iron: 25,
  gold: 50,
  diamond: 100,
  netherite: 200
};

// Replace tool costs
content = content.replace(/(id:\s*'([a-z]+)_([a-z]+)',\s*name:\s*'[^']+',\s*cost:\s*\{)([^}]+)(\})/g, (match, prefix, toolType, material, costInner) => {
  const m = multipliers[material] || 1;
  const parts = costInner.split(',');
  const newCostParts = parts.map(part => {
    let [key, val] = part.split(':');
    if (!val) return part;
    key = key.trim();
    val = parseInt(val.trim());
    return ` ${key}: ${val * m}`;
  });
  return prefix + newCostParts.join(',') + ' }';
});

// Backpacks
const backpackMods = {
  '1': 2, '2': 5, '3': 10, 
  'cooper': 20, 'copper': 20, 
  'iron': 50, 'gold': 100, 'diamond': 200, 'netherite': 500
};

content = content.replace(/(id:\s*'(stor_backpack_|upgrade_backpack_)([a-z0-9]+)',\s*name:\s*'[^']+',\s*cost:\s*\{)([^}]+)(\})/g, (match, prefix, typePref, tier, costInner) => {
  const m = backpackMods[tier] || 1;
  const parts = costInner.split(',');
  const newCostParts = parts.map(part => {
    let [key, val] = part.split(':');
    if (!val) return part;
    key = key.trim();
    val = parseInt(val.trim());
    return ` ${key}: ${val * m}`;
  });
  return prefix + newCostParts.join(',') + ' }';
});

fs.writeFileSync(file, content);
console.log('Rebalance completed!');
