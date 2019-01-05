/*eslint-env node*/
const fs = require('fs');
// Load the http module to create an http server.
var all_words=[[],null];
var stop_words=[[],null];
var non_stop_words=[[],function(){
        var r=[];
        var s = stop_words[0];
        for(var w in all_words[0]){
            if(s.indexOf(all_words[0][w])==-1){
                r.push(all_words[0][w]);}
                }
        return r;}];
var unique_words = [[],function(){
        var res=[];
        for(var w in non_stop_words[0]){
            if(non_stop_words[0][w].length>1&&non_stop_words[0][w]!==''){res.push(non_stop_words[0][w]);}}
        return res;}];
var counts=[{},function(){
    var word_freqs={};
    for(var i in unique_words[0]){
        var w =unique_words[0][i];
        if (word_freqs[w] == null) {word_freqs[w] = 1;}
        else {word_freqs[w] += 1;}}
        return word_freqs;}];
var sorted_data=[{},function(){
    return Object.keys(counts[0]).map(function (key) {
            return [key, counts[0][key]];
        }).sort((key1, key2)=>{return key2[1] - key1[1];});}];


function init1(){
    var t = fs.readFileSync(process.argv[2], 'utf8');
    var s=t.toString();
    s = s.replace(/\s+/g, ' ');
    s = s.replace(/[^0-9a-zA-Z]/g, ' ');
    return s.toLowerCase().split(' ');
}
all_words[0]=init1();

function init2(){
    var k = fs.readFileSync('../stop_words.txt','utf8');
    var p = k.toString();
    return p.split(',');
}
stop_words[0]=init2();

var all_columns = [all_words, stop_words, non_stop_words,unique_words, counts, sorted_data];
function update(){
    for(var j in all_columns){
        if(all_columns[j][1]!=null){all_columns[j][0]=all_columns[j][1]();}
    }
}

update();

sorted_data[0].slice(0, 25).forEach((w)=>{
        console.log(w[0], ' - ', w[1]);});