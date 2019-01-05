function fre(datalist){
    var word_freq = {};
    for(var i in datalist){
        var w =datalist[i];
        if (word_freq[w] == null) {word_freq[w] = 1;}
        else {word_freq[w] += 1;}};
    word_freq = Object.keys(word_freq).map(function (key) {
            return [key, word_freq[key]];
        }).sort((key1, key2)=>{return key2[1] - key1[1];});
    return  word_freq;
}

module.exports = {
 fre
}