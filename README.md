# Battlemap

A browser based tactical game prototype. The Greenwood scenario has a 25 × 25 tile map, ten goblins, one broodmother, and four human soldiers.

## Run

On Windows, double click **Play Battlemap.cmd**. It uses Node.js from your PATH, or the Node.js copy bundled with Codex, then opens <http://127.0.0.1:4173>.

If Node.js is on your PATH, you can also run `node server.js` in this directory. No packages need installing.

Run the rules tests with `node --test`.

## Controls

Select a party member on the map or in the sidebar. Click a blue square to move, or use the arrow keys / WASD. Click an adjacent human to attack. The broodmother can instead cast Battle Chant or Withering Curse; her adjacent attack charms a charmable human for one enemy turn. Charmable humans have a blue marker. A charmed human attacks an adjacent uncharmable ally, who attempts to retaliate during the following human turn. Only one broodmother power can be active at a time. Drag the map to pan and scroll to zoom. End turn to let the humans move and attack. Save and Load use this browser's local storage.

The broodmother earns one charm point the first time she charms each enemy. When the battle ends, each point can be exchanged for one fresh goblin. This scenario contains two charmable humans, so two points are available.

Defeat all humans to win. If the broodmother dies, you lose. If she is the last surviving party member, the special ending triggers.

## Structure

`src/scenarios.js` defines unit types, the Greenwood roster, terrain settings, and broodmother powers. `src/game.js` contains map generation, movement, combat, enemy turns, endings, and save validation. `src/main.js` handles drawing and input. New scenarios can be added to the registry without changing the renderer.
