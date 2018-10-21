//
//  main.cpp
//  week1
//
//  Created by AndreZhang on 2018/10/4.
//  Copyright © 2018 AndreZhang. All rights reserved.
//

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


using namespace std;

unordered_map<string, int> firstMap;
void counting(stringstream &ss)
{
    string str;
    while (ss >> str){
        unordered_map<string, int>::iterator it = firstMap.find(str);
        if (it == firstMap.end()){firstMap.insert(pair<string, int>(str, 1));}
        else firstMap[str]++; //for every words in one line
    }
}

int main()
{
    string  line;
    fstream bookfile("pride-and-prejudice.txt");
    while(getline(bookfile, line))  //read one line
    {
        for (int i = 0; i<line.length(); i++)
            if (ispunct(line[i])){line[i] = ' '; }//modify all the punctuation to ' '
        transform(line.begin(), line.end(), line.begin(), ::tolower);//modify all the letters to lowercase
        stringstream ss(line);
        counting(ss);
        line.clear(); //clear line for next one
    }
    ifstream input1 ;
    input1.open("stop_words.txt");
    string word ;
    while(getline(input1,word,',')){
        firstMap.erase(word); //erase stop words from map
    }
    multimap<int, string, greater<int> > mapB; //make the mapB sort keys from high to low
    
    for (unordered_map<string, int>::iterator it = firstMap.begin(); it != firstMap.end();++it)
        mapB.insert(pair<int, string>(it->second, it->first)); //use mapB for sorting the value of mapA
    
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
