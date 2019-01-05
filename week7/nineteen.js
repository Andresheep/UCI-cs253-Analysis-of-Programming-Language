var INI = require("../INI.js");
var ini___ = INI.loadFileSync("config.ini");
var plugin = ini___.getOrCreateSection("Plugins");
var word = plugin['words'];
var freq = plugin['frequencies'];
var pri = plugin['printing'];

var words = require(word);
var frequencies = require(freq);
var print = require(pri);

var datalist = words.extract_words(process.argv[2]);
var word_freqs = frequencies.fre(datalist);
print.printout(word_freqs);