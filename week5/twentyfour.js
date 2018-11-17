const fs = require('fs');

function TFQuarantine(func){
    this._func = [func];
    this.bind=(f)=>{
        this._func.push(f);
        return this;
    };
    this.excute=()=>{
        guard_callable = (v) => {
            if (typeof v === 'function')
                return v();
            else
                return v;
        };
        var value = null;
        for(var i in this._func){
            value = this._func[i](guard_callable(value));
        }
    };
}

function get_input(){
    var _f = function (){
        return process.argv[2];
    }
    return _f;
}

function extract_words(path_to_file){
    var _f = function (){
        var m = (fs.readFileSync(path_to_file)+"").toLowerCase();
        m=m.toString().toLowerCase();
        m = m.replace(/\s+/g, ' ');
        m = m.replace(/[^0-9a-zA-Z]/g, ' ');
        var list = m.split(' ');
        return list;
    }
    return _f;
}

function remove_stop_words(list){
    var _f=function(){
        var k = fs.readFileSync('../stop_words.txt','utf8');
        k = k.toString();
        var stop_words = k.split(',');
        var res=[];
        for(var w in list){
            if((stop_words.indexOf(list[w])==-1)&&list[w].length>1){
                res.push(list[w]);
            }
        }
        return res;
    }
    return _f;
}

function frequencies(list){
    var word_freqs={};
    for(var i in list){
        var w =list[i];
        if (word_freqs[w] == null) {word_freqs[w] = 1;}
        else {word_freqs[w] += 1;}};
    return word_freqs;
}

function sort(word_freq){
    var res =  Object.keys(word_freq).map(function (key) {
            return [key, word_freq[key]];
        }).sort((key1, key2)=>{return key2[1] - key1[1];});
    return res;
}

function top25_freq(fre){
    fre.slice(0, 25).forEach((w)=>{
        console.log(w[0], ' - ', w[1]);});
}

new TFQuarantine(get_input)
.bind(extract_words)
.bind(remove_stop_words)
.bind(frequencies)
.bind(sort)
.bind(top25_freq)
.excute();