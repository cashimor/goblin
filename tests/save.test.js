import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,validGame} from '../src/game.js';
import {SAVE_KEY,saveGame,loadGame,saveSummary} from '../src/save.js';

function memoryStore(){const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)}}

test('a game can be saved and restored with metadata',()=>{const store=memoryStore(),game=createGame();game.round=4;saveGame(store,game,()=> '2026-09-25T12:00:00.000Z');const loaded=loadGame(store,validGame);assert.equal(loaded.savedAt,'2026-09-25T12:00:00.000Z');assert.equal(loaded.game.round,4);assert.deepEqual(saveSummary(store,validGame),{savedAt:'2026-09-25T12:00:00.000Z',scenarioId:'greenwood',round:4,result:null});});
test('existing raw version 3 saves are migrated when loaded',()=>{const store=memoryStore(),game=createGame();store.setItem(SAVE_KEY,JSON.stringify(game));assert.equal(loadGame(store,validGame).game.scenarioId,'greenwood');});
test('missing and malformed saves are rejected',()=>{const store=memoryStore();assert.throws(()=>loadGame(store,validGame));store.setItem(SAVE_KEY,'{"format":1}');assert.throws(()=>loadGame(store,validGame));assert.equal(saveSummary(store,validGame),null);});
