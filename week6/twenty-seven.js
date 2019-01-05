const fs = require('fs');
const readline = require('../readlines.js');

function* characters(filename){
    var lines = new readline(filename);
    var line;
    while ((line = lines.next())) {
        yield line.toString();
    }
}

function* all_words(filename){
    var c=characters(filename);
    var line=c.next();
    while(!line.done){
        line = line.value.toString().replace(/\s+/g, ' ');
        line = line.toString().replace(/[^0-9a-zA-Z]/g, ' ');
        yield line.toLowerCase().split(' ');
        line =c.next();
    }
}

function* non_stop_words(filename){
     var s = fs.readFileSync('../stop_words.txt','utf8').toString().split(',');
     var c = all_words(filename);
     var words=c.next();
     while(words.done===false){
         var k = words.value;
         for(var word in k){
             if(s.indexOf(k[word])==-1&&k[word].length>1){
                 yield k[word];
             }
         }
         words=c.next();
     }
}


function* count_and_sort(filename){
     var sort=(wordfreq)=>{var res =  Object.keys(wordfreq).map(function (key) {
            return [key, wordfreq[key]];
        }).sort((key1, key2)=>{return key2[1] - key1[1];});
    return res;};
     var word_freqs={};
     var fwords = non_stop_words(filename);
     var fword=fwords.next();
     var i =1;
    while(fword.done===false){
        var w =fword.value;
        if (word_freqs[w] == null) {
            word_freqs[w] = 1;}
        else {word_freqs[w] += 1;}
        if((i%5000) == 0){yield sort(word_freqs);}
        i=i+1;
        fword=fwords.next();
    }
    yield sort(word_freqs);
}

var wfdicts=count_and_sort(process.argv[2]);
var wfdict=wfdicts.next();
while (wfdict.done==false){
    console.log("--------------------------------");
    wfdict.value.slice(0, 25).forEach((w)=>{
        console.log(w[0], ' - ', w[1]);});
    wfdict=wfdicts.next();
}