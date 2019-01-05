const fs = require('fs');


function extract_words(filename){
    var m = (fs.readFileSync(filename)+"").toLowerCase();
    m=m.toString().toLowerCase();
    m = m.replace(/\s+/g, ' ');
    m = m.replace(/[^0-9a-zA-Z]/g, ' ');
    var datalist = m.split(' ');
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

module.exports = {
 extract_words
}