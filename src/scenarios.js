export const unitTypes = {
  goblin: {name:'Goblin', team:'player', maxHp:6, maxMp:0, move:4, damage:[1,2], attack:'Club'},
  broodmother: {name:'Goblin Broodmother', team:'player', maxHp:25, maxMp:25, move:4, damage:[0,0], attack:'Charm touch'},
  human: {name:'Human Soldier', team:'enemy', maxHp:30, maxMp:0, move:6, damage:[4,6], attack:'Sword'},
  veteran: {name:'Goblin Veteran',team:'player',maxHp:10,maxMp:0,move:4,damage:[1,3],attack:'Club'},
  shaman: {name:'Goblin Shaman',team:'enemy',maxHp:16,maxMp:16,move:4,damage:[3,5],range:3,attackCost:2,attack:'Spirit bolt'},
  champion: {name:'Goblin Champion',team:'enemy',maxHp:36,maxMp:0,move:5,damage:[4,6],attack:'War club'}
};
export const scenarios = {
  greenwood: {
    id:'greenwood', name:'The Greenwood', description:'Ten goblins and their broodmother face four human soldiers among the trees. Blue-marked humans can be charmed.', width:25, height:25, treeChance:.16,
    story:'For generations, your tribe has lived beneath the sheltering branches of the Greenwood. The forest provides food, homes, and a place to raise the brood. Today, four human soldiers enter the trees with orders to exterminate the goblins. The broodmother gathers her tribe to defend their home.',
    nextScenario:'tribal-merger',
    objective:{eliminateTeam:'enemy',protectType:'broodmother',specialLastType:'broodmother'},
    ai:{preferTargetType:'goblin'},powerOwnerType:'broodmother',
    clearings:[{x:6,y:12,radius:4},{x:18,y:12,radius:3}],
    units:[
      {id:'mother',type:'broodmother',x:5,y:12},
      ...[[3,10],[4,10],[5,10],[6,10],[7,10],[3,13],[4,14],[5,14],[6,14],[7,13]].map(([x,y],i)=>({id:`goblin-${i+1}`,type:'goblin',x,y})),
      {id:'human-1',type:'human',x:18,y:10,charmable:true},
      {id:'human-2',type:'human',x:20,y:11,charmable:false},
      {id:'human-3',type:'human',x:20,y:13,charmable:false},
      {id:'human-4',type:'human',x:18,y:14,charmable:true}
    ],
    powers:{charm:{name:'Charm touch',range:1,cost:0},enhance:{name:'Battle chant',range:3,cost:5,bonus:2},weaken:{name:'Withering curse',range:3,cost:5,penalty:2}}
  },
  'tribal-merger': {
    id:'tribal-merger',name:'The Joining of Tribes',description:'A rival tribe challenges your broodmother: two shamans, a champion, and four goblins.',width:25,height:25,treeChance:.12,
    story:'The human soldiers have fallen, and word of your victory travels through the forest. Another goblin tribe arrives seeking to merge with yours. Their shamans demand proof of strength, and their champion challenges the broodmother’s authority. The survivors of the first battle now stand as veterans. Defeat the rival tribe, or leave only the broodmother and a charmed champion alive to seal the union.',
    objective:{eliminateTeam:'enemy',protectType:'broodmother',charmedLastType:'champion'},ai:{preferTargetType:'veteran'},powerOwnerType:'broodmother',
    clearings:[{x:6,y:12,radius:4},{x:18,y:12,radius:4}],
    units:[{id:'mother',type:'broodmother',x:5,y:12},{id:'shaman-1',type:'shaman',x:20,y:10,charmable:false},{id:'shaman-2',type:'shaman',x:20,y:14,charmable:false},{id:'champion',type:'champion',x:18,y:12,charmable:true},...[10,11,13,14].map((y,i)=>({id:`rival-${i+1}`,type:'goblin',team:'enemy',x:17,y,charmable:true}))],
    powers:{charm:{name:'Charm touch',range:1,cost:0},enhance:{name:'Battle chant',range:3,cost:5,bonus:2},weaken:{name:'Withering curse',range:3,cost:5,penalty:2}}
  }
};
