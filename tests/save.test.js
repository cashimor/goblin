import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,validGame} from '../src/game.js';
import {SAVE_KEY,SAVE_SLOTS,saveGame,loadGame,saveSummary} from '../src/save.js';

function memoryStore(){const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)}}

test('a game can be saved and restored with metadata',()=>{const store=memoryStore(),game=createGame();game.round=4;saveGame(store,game,'auto',()=> '2026-09-25T12:00:00.000Z');const loaded=loadGame(store,validGame);assert.equal(loaded.savedAt,'2026-09-25T12:00:00.000Z');assert.equal(loaded.game.round,4);assert.deepEqual(saveSummary(store,validGame),{savedAt:'2026-09-25T12:00:00.000Z',scenarioId:'greenwood',round:4,result:null});});

test('three manual slots stay separate from autosave and one another',()=>{
  const store=memoryStore();assert.deepEqual(SAVE_SLOTS,['auto','1','2','3']);
  for(const [slot,round] of [['auto',1],['1',2],['2',3],['3',4]]){
    const game=createGame();game.round=round;saveGame(store,game,slot,()=>`2026-09-25T12:0${round}:00.000Z`);
  }
  for(const [slot,round] of [['auto',1],['1',2],['2',3],['3',4]]){
    assert.equal(loadGame(store,validGame,slot).game.round,round);
    assert.equal(saveSummary(store,validGame,slot).round,round);
  }
  const replacement=createGame();replacement.round=9;saveGame(store,replacement,'2');
  assert.equal(loadGame(store,validGame,'2').game.round,9);
  assert.equal(loadGame(store,validGame,'auto').game.round,1);
  assert.equal(loadGame(store,validGame,'1').game.round,2);
  assert.equal(loadGame(store,validGame,'3').game.round,4);
  assert.throws(()=>saveGame(store,replacement,'4'));
});
test('existing raw version 3 saves are migrated when loaded',()=>{const store=memoryStore(),game=createGame();store.setItem(SAVE_KEY,JSON.stringify(game));assert.equal(loadGame(store,validGame).game.scenarioId,'greenwood');});
test('missing and malformed saves are rejected',()=>{const store=memoryStore();assert.throws(()=>loadGame(store,validGame));store.setItem(SAVE_KEY,'{"format":1}');assert.throws(()=>loadGame(store,validGame));assert.equal(saveSummary(store,validGame),null);});
