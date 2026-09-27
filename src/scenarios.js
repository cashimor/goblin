// Scenario and unit definitions are editable JSON data shared by the browser and tests.
async function readData(path) {
  const url = new URL(path, import.meta.url);
  if (url.protocol === 'file:') {
    const { readFile } = await import('node:fs/promises');
    return JSON.parse(await readFile(url, 'utf8'));
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error('Could not load game data: ' + path);
  return response.json();
}

export const [scenarios, unitTypes] = await Promise.all([
  readData('../data/scenarios.json'),
  readData('../data/unit-types.json')
]);
