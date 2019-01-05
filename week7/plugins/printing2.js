function printout(word_freqs){
    var count = 0;
    for(c in word_freqs){
        var w  = word_freqs[c];
        console.log(w[0], ' - ', w[1]);
        count=count+1;
        if(count==25) break;
    }
}

module.exports = {
    printout
}