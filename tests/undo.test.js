import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,moveUnit,undoMove,selectUnit,attack,castPower,endTurn} from '../src/game.js';
import {saveGame,loadGame} from '../src/save.js';
import {validGame} from '../src/game.js';

test('undo reverses player moves across units in reverse order and restores movement',()=>{
  const game=createGame(),mother=game.units[0],goblin=game.units.find(u=>u.id==='goblin-1');
  assert.equal(moveUnit(game,5,11),true);assert.equal(mother.movesLeft,3);
  selectUnit(game,goblin.id);assert.equal(moveUnit(game,3,11),true);assert.equal(goblin.movesLeft,3);
  assert.equal(undoMove(game),true);assert.deepEqual([goblin.x,goblin.y,goblin.movesLeft],[3,10,4]);assert.equal(game.selectedId,goblin.id);
  assert.equal(undoMove(game),true);assert.deepEqual([mother.x,mother.y,mother.movesLeft],[5,12,4]);assert.equal(game.selectedId,mother.id);
  assert.equal(undoMove(game),false);
});

test('successful attack and spell commit earlier movement, while failed action does not',()=>{
  const game=createGame(),goblin=game.units.find(u=>u.id==='goblin-1'),enemy=game.units.find(u=>u.id==='human-1');
  selectUnit(game,goblin.id);moveUnit(game,3,11);enemy.x=4;enemy.y=11;
  assert.equal(attack(game,'missing'),false);assert.equal(game.moveHistory.length,1);
  assert.equal(attack(game,enemy.id),true);assert.equal(undoMove(game),false);
  game.units[0].acted=false;selectUnit(game,'mother');moveUnit(game,5,11);assert.equal(castPower(game,'enhance'),true);assert.equal(undoMove(game),false);
});

test('ending a turn commits movement and saving preserves available undo',()=>{
  const game=createGame();moveUnit(game,5,11);
  const values=new Map(),store={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
  saveGame(store,game);const restored=loadGame(store,validGame).game;
  assert.equal(undoMove(restored),true);assert.equal(restored.units[0].y,12);
  moveUnit(game,5,10);assert.equal(endTurn(game),true);assert.equal(undoMove(game),false);assert.equal(game.moveHistory.length,0);
});
