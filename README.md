# Battlemap

A browser based tactical game prototype. The Greenwood scenario has a 25 × 25 tile map, ten goblins, one broodmother, and four human soldiers.

## Run

On Windows, double click **play.cmd**. It uses Node.js from your PATH, or the Node.js copy bundled with Codex, then opens <http://127.0.0.1:4173>.

If Node.js is on your PATH, you can also run `node server.js` in this directory. No packages need installing.

Run the rules tests with `node --test`.

## Controls

Select a party member on the map or in the sidebar. Click a blue square to move, or use the arrow keys / WASD. Click an adjacent human to attack. The broodmother can instead cast Battle Chant or Withering Curse; her adjacent attack charms a charmable human for one enemy turn. Charmable humans have a blue marker. A charmed human attacks an adjacent uncharmable ally, who attempts to retaliate during the following human turn. Only one broodmother power can be active at a time. Drag the map to pan and scroll to zoom. End turn to let the humans move and attack. Save and Load use this browser's local storage.

Use **Undo move** or Ctrl+Z to reverse the last movement and restore that unit's movement allowance. You can undo several moves in reverse order, including moves by different party members. A successful attack, spell, or End turn commits all earlier movement. Undo history is included in saves.

The broodmother earns one charm point for each uniquely charmed basic goblin or veteran, and two for other unit types, including humans and champions. When the battle ends, each point can be exchanged for one fresh goblin. The first scenario contains two charmable humans, so four points and four recruits are available.

The opening screen lets you start over or load the latest browser save. You can save or load during play from the top bar. Reaching any battle ending creates an automatic save, and exchanging a charm point saves the new recruit immediately. Saves stay in the current browser profile.

Each battle opens with a story introduction. After defeating the humans, exchange any desired charm points, then choose **Continue to the rival tribe**. Surviving goblins are healed and promoted to veterans (10 HP, 1–3 club damage), recruited goblins join as basic goblins, and the broodmother restores her HP and MP. Unspent charm points carry over.

The second tribe has two uncharmable shamans (16 HP, 16 MP, 3–5 damage spirit bolts with a three tile range at 2 MP per attack), a charmable champion (36 HP, 4–6 damage), and four charmable basic goblins. Victory comes from eliminating the rival army or leaving only the broodmother and a currently charmed champion alive. Losing the broodmother is defeat.

If the humans reduce the broodmother to zero HP in the first battle, they capture her. Luna and Rekham rescue her and bring her to the city guild hall. The three can then choose **Guard the Caravan** (defeat bandits while keeping the merchant alive), **Gather Healing Herbs** (reach three herb patches), or **Rats in the Sewers** (defeat the rats). Completed jobs are marked on the guild board. Mission results and progress are saved as usual. The party rests and heals at the guild between jobs. Blue-marked city enemies can be charmed, and points carry between jobs, but the broodmother cannot recruit goblins while she remains in the city. If Luna or Rekham dies during a job, she retreats to the forest; there she can exchange saved points for goblins before facing the rival tribe's champion. Losing the broodmother ends the job instead.

Luna has 30 HP and 4–6 base damage. Rekham has 30 HP and deals 1–4 damage; while he is alive, Luna deals two extra damage. Luna can spend her action to become invisible. Enemies cannot target her while invisible. Her next attack reveals her and stuns its target for that enemy turn.

In the Greenwood, defeating all humans sends the surviving goblins onward to the rival tribe. Capture sends the broodmother to the city branch. If she is the last surviving party member while fighting the humans, the special ending triggers.

## Structure

`data/scenarios.json` defines each level's story, roster, terrain settings, objectives, and broodmother powers. `data/unit-types.json` defines unit stats and charm rewards. These are plain JSON data; `src/scenarios.js` only loads them. `src/game.js` contains map generation, movement, combat, enemy turns, endings, and save validation. `src/main.js` handles drawing and input. New scenarios can be added to the JSON registry without changing the renderer.
