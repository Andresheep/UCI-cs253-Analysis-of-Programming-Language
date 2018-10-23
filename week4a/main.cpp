//
//  main.cpp
//  week4
//
//  Created by AndreZhang on 10/22/18.
//  Copyright © 2018 AndreZhang. All rights reserved.
//

#include <stdio.h>
#include <iostream>
#include <sstream>
#include <fstream>
#include <string>
#include <iterator>
#include <cctype>
#include <unordered_map>
#include <vector>
#include <string>
#include <map>
#include <algorithm>
#include <cstring>

using namespace std;


class dataStorageManage{
    string data;
public:
    vector<string> dispatch(vector<string> message){
        if(message[0]=="init") {
            _init(message[1]);
            return {};
        }
        else if(message[0]=="words"){return _words();}
        else throw "message not understod"+message[0];
    }
private:
    void _init(string filename){
        string  line;
        ifstream bookfile(filename) ;
        
        while(getline(bookfile, line))  //read one line
        {
            data.append(line);
            data.push_back(' ');
            line.clear();
        }
        for (int i = 0; i<data.length(); i++){
            if (ispunct(data[i]))
            {data[i] = ' '; }//modify all the punctuation to ' '
        }
        transform(data.begin(), data.end(), data.begin(), ::tolower);
    }
    vector<string> _words(){
        vector<string> word_list;
        stringstream ss(data);
        string str;
        while (ss >> str){
            word_list.push_back(str);
        }
        return word_list;
    }
};

class StopWordManager{
    vector<string> stop_words;
public:
    bool dispatch(vector<string> message){
        if(message[0]=="init") {
            _init();
            return true;
        }
        else if(message[0]=="is_stop_words"){return _words(message[1]);}
        else throw "message not understod"+message[0];
    }
private:
    void _init(){
        ifstream bookfile1("stop_words.txt") ;
        string word ;
        while(getline(bookfile1,word,',')){
            stop_words.push_back(word); //erase stop words from map
        }
    }
    bool _words(string word){
        if(find(stop_words.begin(), stop_words.end(), word) == stop_words.end()) return false;
        else return true;
    }
};

class WordFrequencyManager{
    unordered_map<string,int> _word_frequency;
public:
    multimap<int, string, greater<int>> dispatch(vector<string> message){
        if(message[0]=="increment_count") {
            _increment_count(message[1]);
            return {};
        }
        else if(message[0]=="sorted") return _sorted();
        else throw "message not understod"+message[0];
    }
private:
    void _increment_count(string word){
        _word_frequency[word]++;
    }
    multimap<int, string, greater<int>> _sorted(){
        multimap<int, string, greater<int>> mapB;
        for (unordered_map<string, int>::iterator it= _word_frequency.begin(); it != _word_frequency.end();++it){
            mapB.insert(pair<int, string>(it->second, it->first));
        }
        return mapB;
    }
};

class WordFrequencyController{
public:
    dataStorageManage _storage_manager;
    StopWordManager _stop_word_manager;
    WordFrequencyManager _word_frequency_manager;
    void dispatch(vector<string> message){
        if(message[0]=="init") _init(message[1]);
        else if(message[0]=="run") _run();
        else throw "message not understood"+message[0];
    }
private:
    void _init(string path_to_file){
        vector<string> m = _storage_manager.dispatch({"init",path_to_file});
        bool n = _stop_word_manager.dispatch({"init"});
    }
    void _run(){
        vector<string> wordlist = _storage_manager.dispatch({"words"});
        multimap<int, string, greater<int>> tras;
        for(auto word:wordlist){
            if(!_stop_word_manager.dispatch({"is_stop_words",word}))
                tras = _word_frequency_manager.dispatch({"increment_count",word});
        }
        multimap<int, string, greater<int>> mapB = _word_frequency_manager.dispatch({"sorted"});
        int k = 0 ;
        for (map<int, string>::iterator it2 = mapB.begin(); it2 != mapB.end();++it2)
        {
            if(k == 25){break;} // restrict the output amount
            if(it2->second.size()>1) {
                cout << it2->second << "-" << it2->first << endl;
                k++;
            }
        }
    }
};


int main(int argc, char * argv[]) {
    string filename;
    filename = "pride-and-prejudice.txt";
    WordFrequencyController process;
    process.dispatch({"init",filename});
    process.dispatch({"run"});
}
