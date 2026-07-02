// Minimal YAML parser for our config subset (nested mappings, numbers, strings)
export function parseYaml(text) {
  const lines = text.split('\n');
  const result = {};
  // Track stack: [{indent, key, parent}]
  const stack = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) continue;

    const indentMatch = line.match(/^(\s*)/);
    const indent = indentMatch[1].length;

    if (!trimmed.includes(':')) continue;

    const colonIdx = trimmed.indexOf(':');
    const key = trimmed.slice(0, colonIdx).trim();
    const valueStr = trimmed.slice(colonIdx + 1).trim();

    // Pop stack until we find the correct parent
    while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const parent = stack.length > 0 ? stack[stack.length - 1].obj : result;

    if (valueStr === '') {
      // Object value
      parent[key] = {};
      stack.push({ indent, key, obj: parent[key] });
    } else {
      // Scalar value
      parent[key] = parseValue(valueStr);
    }
  }

  return result;
}

function parseValue(str) {
  if (str === '' || str === '""' || str === "''") return '';
  if (/^-?\d+(\.\d+)?$/.test(str)) return Number(str);
  if (str === 'true') return true;
  if (str === 'false') return false;
  return str.replace(/^["']|["']$/g, '');
}

function getTopLevelKeys(obj) {
  return Object.keys(obj);
}
