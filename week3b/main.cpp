//
//  main.cpp
//  week3b
//
//  Created by AndreZhang on 10/19/18.
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


int no_op(int si){
    return si;
}


int scan(string dataset,int(*func)(int)){
    vector<string> word_list;
    multimap<int, string, greater<int>> mapB;
    unordered_map<string,int> mapA;
    stringstream ss(dataset);
    string str;
    while (ss >> str){
        word_list.push_back(str);
    }
    vector<string> stop_words;
    ifstream bookfile1("stop_words.txt") ;
    string word ;
    while(getline(bookfile1,word,',')){
        stop_words.push_back(word); //erase stop words from map
    }
    for(auto word:word_list){
        if(find(stop_words.begin(), stop_words.end(), word) == stop_words.end()) mapA[word]++;
    }
    
    for (unordered_map<string, int>::iterator it= mapA.begin(); it != mapA.end();++it){
         mapB.insert(pair<int, string>(it->second, it->first));
    }
    int k = 0 ;
    for (map<int, string>::iterator it2 = mapB.begin(); it2 != mapB.end();++it2)
    {
        if(k == 25){break;} // restrict the output amount
        if(it2->second.size()>1) {
            cout << it2->second << "-" << it2->first << endl;
            k++;
        }
    }
    int d;
    d = func(0);
    return 0;
}

int normalize(string data,int(*func)(string ,int(*func)(int))){
    transform(data.begin(), data.end(), data.begin(), ::tolower);//modify all the letters to lowercase
    func(data,no_op);
    return 0;
}

int filter_chars(string data,int(*func)(string,int(*func)(string,int(*func)(int)))){
    
    for (int i = 0; i<data.length(); i++){
        if (ispunct(data[i]))
        {data[i] = ' '; }//modify all the punctuation to ' '
    }
    
    func(data,scan);
    return 0;
}

int read_file(string filename,int(*func)(string,int(*func)(string,int(*func)(string ,int(*func)(int))))){
    string  line,data;
    ifstream bookfile(filename) ;
    
    while(getline(bookfile, line))  //read one line
    {
        
        data.append(line);
        data.push_back(' ');
        line.clear();
    }
    func(data,normalize);
    return 0;
}


int main(int argc, char * argv[]) {
    string filename;
    filename = "pride-and-prejudice.txt";
    read_file(filename, filter_chars);
}
