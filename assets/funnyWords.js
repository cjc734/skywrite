var funnyWords = ["bamboozled","bazinga","bevy","bifurcate","bilirubin",
"bobolink","buccaneer","bulgur","bumfuzzle","canoodle","cantankerous","carbuncle",
"caterwaul","cattywampus","cheeky","conniption","coot","didgeridoo","dingy",
"doodle","doohickey","eschew","fiddledeedee","finagle","flanker","floozy",
"fungible","girdle","gobsmacked","grog","gumption","gunky","hitherto",
"hoi polloi","hornswoggle","hullabaloo","indubitably","janky","kahuna","katydid",
"kerplunk","kinkajou","knickers","lackadaisical","loopy","manscape","monkey"
,"mugwump","namby-pamby","noggin","pantaloons","passel","persnickety",
"popinjay","prestidigitation","proctor","rapscallion","rookery","rumpus",
"scootch","scuttlebutt","shebang","Shih Tzu","smegma","snarky","snuffle",
"spelunker","spork","sprocket","squeegee","succubus","tater","tuber","tuchis",
"viper","waddle","walkabout","wasabi","weasel","wenis","whatnot","wombat","wonky",
"zeitgeist"];

function randomFunnyWord(){
	return funnyWords[Math.floor(Math.random() * funnyWords.length)];
}