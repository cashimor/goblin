export const SAVE_KEY='battlemap-save-v3';
export const SAVE_FORMAT=1;

export function saveGame(store,game,now=()=>new Date().toISOString()){
  const record={format:SAVE_FORMAT,savedAt:now(),game};
  store.setItem(SAVE_KEY,JSON.stringify(record));
  return record;
}

export function loadGame(store,validate){
  const text=store.getItem(SAVE_KEY);
  if(!text)throw Error('No saved game');
  const record=JSON.parse(text);
  if(validate(record))return {savedAt:new Date(0).toISOString(),game:record};
  if(record?.format!==SAVE_FORMAT||typeof record.savedAt!=='string'||!validate(record.game))throw Error('Invalid saved game');
  return {savedAt:record.savedAt,game:record.game};
}

export function saveSummary(store,validate){
  try{const {savedAt,game}=loadGame(store,validate);return {savedAt,scenarioId:game.scenarioId,round:game.round,result:game.result};}
  catch{return null;}
}
