let offline = false;
function setOfflineMode(flag){ offline = !!flag; console.log('offline set to', offline); }
function isOfflineMode(){ return offline; }
module.exports = { setOfflineMode, isOfflineMode };
