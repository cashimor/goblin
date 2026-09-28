import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,checkOutcome,nextBattle,startMission,returnToGuild,turnInvisible,attack,endTurn,finishEnemyTurn,moveUnit,exchangeCharmPoint,upgradeLegacyCapture,living,validGame} from '../src/game.js';
import {saveGame,loadGame} from '../src/save.js';

test('human capture leads to Luna and Rekham rescuing the broodmother in the city',()=>{
  const forest=createGame();forest.units[0].hp=0;assert.equal(checkOutcome(forest),'captured');assert.equal(exchangeCharmPoint(forest),false);
  const hub=nextBattle(forest);assert.equal(hub.scenarioId,'city-hub');assert.deepEqual(living(hub,'player').map(u=>u.type),['broodmother','luna','rekham']);assert.equal(living(hub,'enemy').length,0);assert.equal(hub.freshGoblins,0);assert.ok(validGame(hub));
  const old=createGame();old.result='defeat';old.units[0].hp=0;assert.equal(upgradeLegacyCapture(old),true);assert.equal(old.result,'captured');
});

test('broodmother alone after Greenwood goes to the city without recruiting',()=>{
  const forest=createGame();for(const unit of forest.units)if(unit.type!=='broodmother')unit.hp=0;
  forest.charmPoints=4;assert.equal(checkOutcome(forest),'last-mother');assert.equal(exchangeCharmPoint(forest),false);
  const city=nextBattle(forest);assert.equal(city.scenarioId,'city-hub');assert.equal(city.charmPoints,4);
  assert.equal(city.freshGoblins,0);assert.deepEqual(living(city,'player').map(u=>u.type),['broodmother','luna','rekham']);
});

test('old saved Greenwood endings refund recruits and unlock the city route',()=>{
  for(const result of ['victory','last-mother']){
    const saved=createGame();for(const unit of saved.units)if(unit.type==='goblin')unit.hp=0;
    saved.result=result;saved.charmPoints=1;saved.freshGoblins=2;
    assert.equal(upgradeLegacyCapture(saved),true);assert.equal(saved.result,'last-mother');
    assert.equal(saved.charmPoints,3);assert.equal(saved.freshGoblins,0);
    assert.equal(exchangeCharmPoint(saved),false);assert.equal(nextBattle(saved).scenarioId,'city-hub');
    assert.equal(upgradeLegacyCapture(saved),false);
  }
});

test('guild board opens each mission and successful jobs are recorded on return',()=>{
  const hub=createGame(19,'city-hub');for(const id of ['merchant-defense','herb-gathering','sewer-rats'])assert.equal(startMission(hub,id).scenarioId,id);
  assert.equal(startMission(hub,'not-a-job'),null);const job=startMission(hub,'sewer-rats');for(const rat of living(job,'enemy'))rat.hp=0;assert.equal(checkOutcome(job),'victory');const returned=returnToGuild(job);assert.equal(returned.scenarioId,'city-hub');assert.deepEqual(returned.completedMissions,['sewer-rats']);assert.ok(validGame(returned));
});

test('Luna is untargetable while invisible, then reveals and stuns on attack',()=>{
  const game=createGame(19,'merchant-defense'),luna=game.units.find(u=>u.type==='luna'),bandit=game.units.find(u=>u.type==='bandit');
  for(const other of living(game,'enemy'))if(other!==bandit)other.hp=0;
  bandit.x=luna.x+1;bandit.y=luna.y;assert.equal(turnInvisible(game,luna.id),true);assert.equal(luna.acted,true);assert.equal(turnInvisible(game,luna.id),false);
  game.turn='enemy';assert.equal(attack(game,luna.id,bandit.id),false);finishEnemyTurn(game);assert.equal(luna.hp,30);assert.equal(luna.invisible,true);
  bandit.x=luna.x+1;bandit.y=luna.y;assert.equal(attack(game,bandit.id,luna.id),true);assert.equal(luna.invisible,false);assert.equal(bandit.stunnedRound,game.round);
  const banditHp=bandit.hp;endTurn(game);finishEnemyTurn(game);assert.equal(bandit.hp,banditHp);assert.ok(game.log.some(message=>message.includes('stunned')));
});

test('Rekham adds two damage to Luna, and deals one to four himself',()=>{
  const withRekham=createGame(19,'merchant-defense'),withoutRekham=createGame(19,'merchant-defense');
  for(const game of [withRekham,withoutRekham]){const luna=game.units.find(u=>u.type==='luna'),bandit=game.units.find(u=>u.type==='bandit');bandit.x=luna.x+1;bandit.y=luna.y;}
  withoutRekham.units.find(u=>u.type==='rekham').hp=0;
  const targetA=withRekham.units.find(u=>u.type==='bandit'),targetB=withoutRekham.units.find(u=>u.type==='bandit');
  attack(withRekham, targetA.id,'luna');attack(withoutRekham,targetB.id,'luna');assert.equal(targetB.hp-targetA.hp,2);
  const game=createGame(19,'merchant-defense'),rekham=game.units.find(u=>u.type==='rekham'),bandit=game.units.find(u=>u.type==='bandit');bandit.x=rekham.x+1;bandit.y=rekham.y;assert.equal(attack(game,bandit.id,rekham.id),true);assert.ok(14-bandit.hp>=1&&14-bandit.hp<=4);
});

test('merchant defense fails if the merchant falls and city jobs cannot recruit goblins',()=>{
  const job=createGame(19,'merchant-defense');job.units.find(u=>u.type==='merchant').hp=0;assert.equal(checkOutcome(job),'defeat');job.charmPoints=3;assert.equal(exchangeCharmPoint(job),false);assert.equal(returnToGuild(job).scenarioId,'city-hub');
});

test('herbs are collected on arrival and the third patch completes the job',()=>{
  const job=createGame(19,'herb-gathering');for(const herb of [{x:9,y:5},{x:12,y:9},{x:9,y:13}]){const luna=job.units.find(u=>u.type==='luna');luna.x=herb.x-1;luna.y=herb.y;luna.movesLeft=6;assert.equal(moveUnit(job,herb.x,herb.y,luna.id),true);assert.equal(job.moveHistory.length,0);}
  assert.equal(job.herbsCollected.length,3);assert.equal(job.result,'victory');
});

test('city mission progress and Luna visibility survive a save and load',()=>{
  const job=createGame(19,'herb-gathering'),luna=job.units.find(u=>u.type==='luna');
  assert.equal(turnInvisible(job,luna.id),true);luna.x=8;luna.y=5;assert.equal(moveUnit(job,9,5,luna.id),true);
  job.completedMissions=['sewer-rats'];job.charmPoints=5;job.charmedIds=['merchant-defense:1:bandit-1'];job.missionNumber=2;
  const memory=new Map(),store={setItem:(k,v)=>memory.set(k,v),getItem:k=>memory.get(k)??null};
  saveGame(store,job);const loaded=loadGame(store,validGame).game;
  assert.equal(loaded.units.find(u=>u.type==='luna').invisible,true);
  assert.deepEqual(loaded.herbsCollected,['9,5']);assert.deepEqual(loaded.completedMissions,['sewer-rats']);
  assert.equal(loaded.charmPoints,5);assert.deepEqual(loaded.charmedIds,['merchant-defense:1:bandit-1']);assert.equal(loaded.missionNumber,2);
});

test('city charms earn points across jobs while recruitment stays locked',()=>{
  const forest=createGame();forest.charmPoints=2;forest.units[0].hp=0;checkOutcome(forest);
  const hub=nextBattle(forest);assert.equal(hub.charmPoints,2);
  const first=startMission(hub,'merchant-defense'),bandit=first.units.find(u=>u.id==='bandit-1'),mother=first.units[0];
  bandit.x=mother.x+1;bandit.y=mother.y;assert.equal(bandit.charmable,true);assert.equal(attack(first,bandit.id),true);assert.equal(first.charmPoints,4);
  first.result='victory';assert.equal(exchangeCharmPoint(first),false);
  const returned=returnToGuild(first);assert.equal(returned.charmPoints,4);
  const second=startMission(returned,'merchant-defense'),another=second.units.find(u=>u.id==='bandit-1');another.x=second.units[0].x+1;another.y=second.units[0].y;
  assert.equal(attack(second,another.id),true);assert.equal(second.charmPoints,6);assert.equal(second.charmedIds.length,2);
  assert.equal(startMission(returned,'sewer-rats').charmPoints,4);
});

for(const companion of ['luna','rekham'])test(`${companion} death sends the broodmother to the champion battle with saved recruits`,()=>{
  const job=createGame(19,'sewer-rats');job.charmPoints=3;job.units.find(u=>u.type===companion).hp=0;
  assert.equal(checkOutcome(job),'retreat');assert.equal(returnToGuild(job),null);
  assert.equal(exchangeCharmPoint(job),true);assert.equal(job.charmPoints,2);
  const forest=nextBattle(job);assert.equal(forest.scenarioId,'tribal-merger');assert.equal(forest.charmPoints,2);
  assert.deepEqual(living(forest,'player').map(u=>u.type),['broodmother','goblin']);
  assert.ok(forest.storyOverride.includes('retreat'));assert.ok(validGame(forest));
});

test('broodmother death in the city remains defeat rather than a retreat',()=>{
  const job=createGame(19,'herb-gathering');job.units.find(u=>u.type==='broodmother').hp=0;job.units.find(u=>u.type==='luna').hp=0;
  assert.equal(checkOutcome(job),'defeat');assert.equal(nextBattle(job),null);
});
