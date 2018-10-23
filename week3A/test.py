#!/usr/bin/env python
import re
import sys
import operator

# Mileage may vary. If this crashes, make it lower
RECURSION_LIMIT = 9500
# We add a few more, because, contrary to the name,
# this doesn't just rule recursion: it rules the 
# depth of the call stack
sys.setrecursionlimit(RECURSION_LIMIT+10)

def co(word_list, stopwords, wordfreqs):
    # What to do with an empty list
    if word_list == []:
        return
    # The inductive case, what to do with a list of words
    else:
        # Process the head word
        word = word_list[0]
        if word not in stopwords:
            if word in wordfreqs:
                wordfreqs[word] += 1
            else:
                wordfreqs[word] = 1
        # Process the tail 
    return True

stop_words = set(open('../stop_words.txt').read().split(','))
words = re.findall('[a-z]{2,}', open('../pride-and-prejudice.txt').read().lower())
word_freqs = {}
Y = lambda F: F(lambda x: Y(F)(x))
# Theoretically, we would just call count(words, word_freqs)
# Try doing that and see what happens
count = Y(lambda t:lambda lis:lambda stop:lambda fre:None if lis ==[] else co(lis,stop,fre) and t(lis[1:])(stop)(fre))

for i in range(0, len(words), RECURSION_LIMIT):
    count(words[i:i+RECURSION_LIMIT]) (stop_words) (word_freqs)
        
    
wf_print = Y(lambda f: lambda n: '' if n == [] else (print(n[0][0],'-',n[0][1]) or True) and f(n[1:]))
wf_print(sorted(word_freqs.items(), key=operator.itemgetter(1), reverse=True)[:25])