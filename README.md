# Battlemap

A browser based tactical game prototype. The Greenwood scenario has a 25 × 25 tile map, ten goblins, one broodmother, and four human soldiers.

## Run

On Windows, double click **play.cmd**. It uses Node.js from your PATH, or the Node.js copy bundled with Codex, then opens <http://127.0.0.1:4173>.

If Node.js is on your PATH, you can also run `node server.js` in this directory. No packages need installing.

Run the rules tests with `node --test`.

## Controls

Select a party member on the map or in the sidebar. Click a blue square to move, or use the arrow keys / WASD. Click an adjacent human to attack. The broodmother can instead cast Battle Chant or Withering Curse; her adjacent attack charms a charmable human for one enemy turn. Charmable humans have a blue marker. A charmed human attacks an adjacent uncharmable ally, who attempts to retaliate during the following human turn. Only one broodmother power can be active at a time. Drag the map to pan and scroll to zoom. End turn to let the humans move and attack. Save and Load use this browser's local storage.

The broodmother earns one charm point for each uniquely charmed basic goblin or veteran, and two for other unit types, including humans and champions. When the battle ends, each point can be exchanged for one fresh goblin. The first scenario contains two charmable humans, so four points and four recruits are available.

The opening screen lets you start over or load the latest browser save. You can save or load during play from the top bar. Reaching any battle ending creates an automatic save, and exchanging a charm point saves the new recruit immediately. Saves stay in the current browser profile.

Each battle opens with a story introduction. After defeating the humans, exchange any desired charm points, then choose **Continue to the rival tribe**. Surviving goblins are healed and promoted to veterans (10 HP, 1–3 club damage), recruited goblins join as basic goblins, and the broodmother restores her HP and MP. Unspent charm points carry over.

The second tribe has two uncharmable shamans (16 HP, 16 MP, 3–5 damage spirit bolts with a three tile range at 2 MP per attack), a charmable champion (36 HP, 4–6 damage), and four charmable basic goblins. Victory comes from eliminating the rival army or leaving only the broodmother and a currently charmed champion alive. Losing the broodmother is defeat.

Defeat all humans to win. If the broodmother dies, you lose. If she is the last surviving party member, the special ending triggers.

## Structure

`data/scenarios.json` defines each level's story, roster, terrain settings, objectives, and broodmother powers. `data/unit-types.json` defines unit stats and charm rewards. These are plain JSON data; `src/scenarios.js` only loads them. `src/game.js` contains map generation, movement, combat, enemy turns, endings, and save validation. `src/main.js` handles drawing and input. New scenarios can be added to the JSON registry without changing the renderer.
