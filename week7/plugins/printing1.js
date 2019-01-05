function printout(word_freqs){
    word_freqs.slice(0, 25).forEach((w)=>{console.log(w[0], ' - ', w[1]);});
}
module.exports ={
    printout
}