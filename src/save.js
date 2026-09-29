export const SAVE_KEY='battlemap-save-v3';
export const SAVE_FORMAT=1;
export const SAVE_SLOTS=['auto','1','2','3'];

function slotKey(slot){
  if(!SAVE_SLOTS.includes(slot))throw Error('Unknown save slot');
  return slot==='auto'?SAVE_KEY:`${SAVE_KEY}-slot-${slot}`;
}

export function saveGame(store,game,slot='auto',now=()=>new Date().toISOString()){
  const record={format:SAVE_FORMAT,savedAt:now(),game};
  store.setItem(slotKey(slot),JSON.stringify(record));
  return record;
}

export function loadGame(store,validate,slot='auto'){
  const text=store.getItem(slotKey(slot));
  if(!text)throw Error('No saved game');
  const record=JSON.parse(text);
  if(validate(record))return {savedAt:new Date(0).toISOString(),game:record};
  if(record?.format!==SAVE_FORMAT||typeof record.savedAt!=='string'||!validate(record.game))throw Error('Invalid saved game');
  return {savedAt:record.savedAt,game:record.game};
}

export function saveSummary(store,validate,slot='auto'){
  try{const {savedAt,game}=loadGame(store,validate,slot);return {savedAt,scenarioId:game.scenarioId,round:game.round,result:game.result};}
  catch{return null;}
}
