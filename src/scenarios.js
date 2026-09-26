export const unitTypes = {
  goblin: {name:'Goblin', team:'player', maxHp:6, maxMp:0, move:4, damage:[1,2], attack:'Club'},
  broodmother: {name:'Goblin Broodmother', team:'player', maxHp:25, maxMp:25, move:4, damage:[0,0], attack:'Charm touch'},
  human: {name:'Human Soldier', team:'enemy', maxHp:30, maxMp:0, move:6, damage:[4,6], attack:'Sword'}
};
export const scenarios = {
  greenwood: {
    id:'greenwood', name:'The Greenwood', description:'Ten goblins and their broodmother face four human soldiers among the trees. Blue-marked humans can be charmed.', width:25, height:25, treeChance:.16,
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
  }
};
