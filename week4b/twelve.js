/*eslint-env node*/

const fs = require('fs');


function extract_words(obj,path_to_file){
    var t = fs.readFileSync(path_to_file, 'utf8');
    var s=t.toString();
    s = s.replace(/\s+/g, ' ');
    s = s.replace(/[^0-9a-zA-Z]/g, ' ');
    obj['data'] = s.toLowerCase().split(' ');
}

function load_stop_words(obj){
    var k = fs.readFileSync('../stop_words.txt','utf8');
    var p = k.toString();
    obj['stop_words']=p.split(',');
}

function increment_count(obj,w){
   if (obj['freqs'][w] == null) {obj['freqs'][w] = 1;}
   else {obj['freqs'][w] += 1;}
}

var data_storage_obj={
    'data':[],
    'init':(path_to_file)=>extract_words(me,path_to_file),
    'words':function (){return me['data'];}
};

var stop_words_obj={
    'stop_words':[],
    'init':()=>load_stop_words(me),
    'is_stop_word':function (word){return me['stop_words'].indexOf(word)!==-1;}
};

var word_freqs_obj={
    'freqs':{},
    'increment_count':(w)=>increment_count(me,w),
    'sorted':function(){
        return Object.keys(me['freqs']).map(function (key) {
            return [key, me['freqs'][key]];
        }).sort((key1, key2)=>{return key2[1] - key1[1];});},
    'top25':(b)=>b.slice(0,25).forEach((w)=>{console.log(w[0], ' - ', w[1]);})
};

var me = data_storage_obj;
data_storage_obj['init'](process.argv[2]);

me = stop_words_obj;
stop_words_obj['init']();

me = data_storage_obj;
for (var k = 0,  len = data_storage_obj['words']().length; k < len; k++) {
    me = data_storage_obj;
    var w = data_storage_obj['words']()[k];
    me = stop_words_obj;
  if (!stop_words_obj['is_stop_word'](w)&&w.length>1){
            me = word_freqs_obj;
            word_freqs_obj['increment_count'](w);
  }       
}

me = word_freqs_obj;
word_freqs_obj['top25'](word_freqs_obj['sorted']());