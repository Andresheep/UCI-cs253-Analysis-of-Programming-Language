const fs = require('fs');


function extract_words(filename){
    var m = (fs.readFileSync(filename)+"").toLowerCase();
    m=m.toString().toLowerCase();
    m = m.replace(/\s+/g, ' ');
    m = m.replace(/[^0-9a-zA-Z]/g, ' ');
    var list = m.split(' ');
    return list;
}

function remove_stop_words(datalist){
    var k = fs.readFileSync('../stop_words.txt','utf8');
    k = k.toString();
    var stop_words = k.split(',');
    var res=[];
    for(var w in datalist){
        if((stop_words.indexOf(datalist[w])==-1)&&datalist[w].length>1){
            res.push(datalist[w]);
        }
    }
    return res;
}

function frequencies(datalist){
    var word_freq = {};
    for(var i in datalist){
        var w =datalist[i];
        if (word_freq[w] == null) {word_freq[w] = 1;}
        else {word_freq[w] += 1;}};
    return word_freq;
}

function sort(word_freq){
    var res =  Object.keys(word_freq).map(function (key) {
            return [key, word_freq[key]];
        }).sort((key1, key2)=>{return key2[1] - key1[1];});
    return  res;
}

eval("var extract = extract_words")
eval("var remove = remove_stop_words")
eval("var fre = frequencies")
eval("var so = sort")

var word_freqs = so(fre(remove(extract(process.argv[2])))); 
word_freqs.slice(0, 25).forEach((w)=>{console.log(w[0], ' - ', w[1]);});

