var funnyWords = ["buccaneer","floozy","monkey","Shih Tzu","succubus",
"viper","weasel","baby","church","bear","water","ball","brethren","chicken",
"pot","corn","cake","day","dentist","cup","dragon","lantern","chef","grandma",
"laptop","grave","ice cream","killer","jet","ski","jungle","cat","knight","bulb",
"locker","egg","pillow","rocket","sheep","shoe","snake","car","pig","phone",
"volcano"];

function randomFunnyWord(){
	return funnyWords[Math.floor(Math.random() * funnyWords.length)];
}