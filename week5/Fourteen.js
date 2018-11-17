const fs = require('fs');

function WordFrequencyFramework() {
    this._load_event_handlers = [];
    this._dowork_event_handlers = [];
    this._end_event_handlers = [];

    this.register_for_load_event = (handler) => {
        this._load_event_handlers.push(handler);
    };

    this.register_for_dowork_event = (handler) => {
        this._dowork_event_handlers.push(handler);
    };
    this.register_for_end_event = (handler) => {
        this._end_event_handlers.push(handler);
    };
    this.run = (path_to_file) => {
        for (var h in this._load_event_handlers){
            this._load_event_handlers[h](path_to_file);
        }
        
        for (var h in this._dowork_event_handlers){
            this._dowork_event_handlers[h]();
        }
        
        for (var h in this._end_event_handlers){
            this._end_event_handlers[h]();
        }
    };
}


function DataStorage(wfapp, stop_word_filter) {
    this._data = '';
    this._word_event_handlers = [];


    this.__load = (path_to_file) => {
        var m = (fs.readFileSync(path_to_file)+"").toLowerCase();
        m=m.toString().toLowerCase();
        m = m.replace(/\s+/g, ' ');
        m = m.replace(/[^0-9a-zA-Z]/g, ' ');
        this._data = m;
    };

    this.__produce_words = () => {
        var k = this._data.split(" ");
        // this.data_str = this._data.join('');
        for (var i in k){
            if (!this._stop_word_filter.is_stop_word(k[i]) && (k[i].length > 1)){
                for (var h in this._word_event_handlers){
                    this._word_event_handlers[h](k[i]);
                }
            }
        }

    };
    
    this.register_for_word_event = (handler) => {

        this._word_event_handlers.push(handler);
    };
    this._stop_word_filter = stop_word_filter;
    wfapp.register_for_load_event(this.__load);
    wfapp.register_for_dowork_event(this.__produce_words);

}


function StopWordFilter(wfapp) {
    this._stop_words = [];
    
    this.__load = () => {
        var k = fs.readFileSync('../stop_words.txt','utf8');
        var p = k.toString();
        this._stop_words = p.split(',');
    };

    this.is_stop_word = function(word){return this._stop_words.indexOf(word)!== -1;};
    wfapp.register_for_load_event(this.__load);
}

function WordFrequencyCounter(wfapp, data_storage) {
    this._word_freqs = {};

    this.__increment_count = (w)=>{
        if (this._word_freqs[w] == null) {this._word_freqs[w] = 1;}
        else {this._word_freqs[w] += 1;}
    };


    this.__print_freqs = () => {

        var list = this._word_freqs;
        var res =  Object.keys(list).map(function (key) {
            return [key, list[key]];
        }).sort((key1, key2)=>{return key2[1] - key1[1];});
        res.slice(0, 25).forEach((w)=>{console.log(w[0], ' - ', w[1]);});
    };
    data_storage.register_for_word_event(this.__increment_count);
    wfapp.register_for_end_event(this.__print_freqs);
}

function Words_with_z(DataStorage,stop_word_filter){
    this.data = DataStorage._data;
    this._stop_word_filter = stop_word_filter;
    this.test = ()=>{
        console.log(0);
    };
    
    this._words = ()=>{
        var count =0;
        var k = this.data.split(' ');
        k.forEach((i)=>{
            if ((!this._stop_word_filter.is_stop_word(i))&&(i.search("z")!==-1)){count+=1;}
            });
        console.log("the number of words with z is",count);
    };
}

var wfapp = new WordFrequencyFramework();
var stop_word_filter = new StopWordFilter(wfapp);
var data_storage = new DataStorage(wfapp, stop_word_filter);
var word_freq_counter = new WordFrequencyCounter(wfapp, data_storage);
wfapp.run(process.argv[2]);
var withz = new Words_with_z(data_storage,stop_word_filter);
withz._words();