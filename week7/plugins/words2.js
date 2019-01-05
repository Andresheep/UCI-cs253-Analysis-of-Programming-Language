const fs = require('fs');


function extract_words(filename){
    var m = (fs.readFileSync(filename)+"").toLowerCase().toString().toLowerCase().replace(/\s+/g, ' ').replace(/[^0-9a-zA-Z]/g, ' ');
    var datalist = m.split(' ');
    var stop_words = fs.readFileSync('../stop_words.txt','utf8').toString().split(',');
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