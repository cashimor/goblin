import test from 'node:test';
import assert from 'node:assert/strict';
import {scenarios,unitTypes} from '../src/scenarios.js';
import {createGame,attack,exchangeCharmPoint,nextBattle,upgradeCharmRewards,living} from '../src/game.js';

test('JSON level definitions have valid units, links, and deployment positions',()=>{
  for(const [id,map] of Object.entries(scenarios)){
    assert.equal(map.id,id);assert.ok(map.story);assert.ok(map.width>0&&map.height>0);
    if(map.nextScenario)assert.ok(scenarios[map.nextScenario]);
    for(const id of map.missionBoard??[])assert.ok(scenarios[id],`${id} is missing from the guild board`);
    for(const id of Object.values(map.onResult??{}))assert.ok(scenarios[id],`${id} is missing as an outcome destination`);
    const spaces=new Set();
    for(const spec of [...map.units,...(map.partyDeployment??[])]){
      if(spec.type)assert.ok(unitTypes[spec.type]);
      assert.ok(spec.x>=0&&spec.y>=0&&spec.x<map.width&&spec.y<map.height);
      const key=`${spec.x},${spec.y}`;assert.ok(!spaces.has(key),`${id}: overlapping deployment ${key}`);spaces.add(key);
    }
  }
});

test('two uniquely charmed humans provide four recruits that fit the next battle',()=>{
  const game=createGame(),mother=game.units[0];
  for(const human of game.units.filter(u=>u.charmable)){
    mother.acted=false;human.x=mother.x+1;human.y=mother.y;
    assert.equal(attack(game,human.id),true);human.x=21;human.y=10;
  }
  assert.equal(game.charmPoints,4);game.result='victory';
  for(let i=0;i<4;i++)assert.equal(exchangeCharmPoint(game),true);
  assert.equal(exchangeCharmPoint(game),false);
  const next=nextBattle(game),party=living(next,'player');
  assert.equal(party.filter(u=>u.type==='goblin').length,4);
  assert.equal(party.filter(u=>u.type==='veteran').length,10);
  assert.equal(new Set(next.units.map(u=>`${u.x},${u.y}`)).size,next.units.length);
});

test('a champion awards two points and a regular rival goblin awards one, only once',()=>{
  const game=createGame(19,'tribal-merger'),mother=game.units[0];
  for(const type of ['champion','goblin']){
    const target=game.units.find(u=>u.type===type);target.x=mother.x+1;target.y=mother.y;
    mother.acted=false;assert.equal(attack(game,target.id),true);
    const points=game.charmPoints;mother.acted=false;attack(game,target.id);assert.equal(game.charmPoints,points);
    target.x=23;target.y=20;
  }
  assert.equal(game.charmPoints,3);
});

test('old saves gain the extra human rewards once, preserving recruited goblins',()=>{
  const game=createGame();delete game.charmRewardVersion;game.charmedIds=['human-1','human-4'];game.charmPoints=0;game.freshGoblins=2;
  assert.equal(upgradeCharmRewards(game),true);assert.equal(game.charmPoints,2);assert.equal(game.freshGoblins,2);
  assert.equal(upgradeCharmRewards(game),false);assert.equal(game.charmPoints,2);
});
