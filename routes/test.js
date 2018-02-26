const moduleNews = require('../models/news');
const express = require('express');
const promise = require('bluebird');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.Promise = promise;

/*

edit this file
commit this file to git
func two arr of arr
each will contain tags
test with a b c

 */
/*
//still need to check similarity
const noDuplicates = function (const inpArr)
{
//sort strings
//inpArr.sort();
//inpArr.reverse();

//sort numbers with compare function
//inpArr.sort(function(a, b){return a - b});
//inpArr.sort(function(a, b){return b - a});

//trying again
//the super loop is all of the base lists
    for (count00 = 0; count00 < inpArr.length - 1; count00++)
    {
        //The next loop is go through all of the following lists
        simCount = 0;

        for (count01 = count00 + 1; count01 < inpArr.length; count01++)
        {
            //The next loop is go through all of the elements in the base list
            //If half of them are the same as the following list remove the following list
            count02 = 0;
            simCount = 0;

            while (simCount <= inpArr[count00].length/2 && count02 < inpArr[count00].length)
            {
                //if (inpArr[count00][count01] in inpArr[count01])
                //simCount++;

                //Take the element of the base list and find it in the following list
                count03 = 0;
                while (inpArr[count00][count02] != inpArr[count01][count03] && count03 < inpArr[count01].length)
                {
                    count03++;
                }
                if (count03 < inpArr[count01].length)
                {
                    simCount++;
                }

                count02++;
            }

            if (simCount >= inpArr[count00].length/2)
            {
                //remove from list
            }
            //if the simCount is too high remove the list
            //otherwise increase the forward index

        }

        count00++;
    }
}

*/

//this checks two arrays of strings and checks how similar they are
var arraySimilarity = function (inpArr1, inpArr2)
{
    var count00;
    var simCount00;
    var tempArr;
    count00 = 0;
    simCount00 = 0;

    if (inpArr1.length > inpArr2.length)
    {
        tempArr = inpArr2;
        inpArr2 = inpArr1;
        inpArr1 = tempArr;
    }

    /*
    console.log(inpArr1);
    console.log(inpArr2);
    console.log(inpArr1[0]);
    console.log("bug" in inpArr1);
    console.log(inpArr1.includes("bug"));
    console.log(inpArr1.indexOf("bug"));
    */
    while (count00 < inpArr1.length)
    {
        //console.log(inpArr2.indexOf(inpArr1[count00]) >= 0);
        //if (inpArr1[count00] in inpArr2)
        //if (inpArr2.indexOf(inpArr1[count00]) >= 0)
        if (inpArr2.includes(inpArr1[count00]))
        {
            simCount00++;
        }
        count00++;
    }

    return simCount00/inpArr1.length;
};

//This takes an array of arrays, it removes similar arrays, and returns the shortend array
removeArrayDups = function(inpArr)
{
    var count00, count01;
    for (count00 = 0; count00 < inpArr.length - 1; count00++)
    {
        count01 = count00 + 1;
        while (count01 < inpArr.length)
        {
            if (arraySimilarity(inpArr[count00], inpArr[count01]) >= .5)
                inpArr.splice(count01, 1);
            else
                count01++
        }
    }
    return inpArr;
};

var funcTest00 = function (inpArr1)
{
    return inpArr1;
};


router.route('/dups')
    .post(function (req, res) {

        var retMess;
        var retSim;
        var retArray00;

        /*
        console.log(req.body);
        console.log(req.body.arr1);
        console.log(req.body.arr1[0]);
        console.log(req.body.arr1[1]);
        console.log(req.body.arr1[2]);
        //console.log(req.body.arrA1);
        //console.log(req.body.arrA1[0]);
        //console.log(req.body.arrA1[1]);
        //console.log(req.body.arrA1[2]);
        */
        //NM: Test Cases
        //retMess = similarityString(req.body.arrA1[0], req.body.arrA1[1]);
        //console.log(retMess);
        console.log(req.body.arrA1[0]);
        retMess = (req.body.arrA1[0]);
        console.log(retMess);
        retMess = (req.body.arrA1);
        console.log(retMess);
        console.log(retMess.length);
        console.log(retMess[0].length);
        retMess = funcTest00(req.body.arrA1);
        console.log(retMess);
        console.log(retMess.length);
        console.log(retMess[0].length);
        retMess = req.body.arrA1;
        retSim = arraySimilarity(retMess[0], retMess[0]);
        console.log(retSim);
        retSim = arraySimilarity(retMess[0], retMess[1]);
        console.log(retSim);
        retSim = arraySimilarity(retMess[1], retMess[0]);
        console.log(retSim);
        retSim = arraySimilarity(retMess[0], retMess[2]);
        console.log(retSim);
        retSim = arraySimilarity(retMess[2], retMess[0]);
        console.log(retSim);
        retSim = arraySimilarity(retMess[0], retMess[3]);
        console.log(retSim);
        retSim = arraySimilarity(retMess[3], retMess[0]);
        console.log(retSim);
        retSim = arraySimilarity(retMess[0], retMess[4]);
        console.log(retSim);
        retSim = arraySimilarity(retMess[4], retMess[0]);
        console.log(retSim);
        retSim = arraySimilarity(retMess[0], retMess[5]);
        console.log(retSim);
        retSim = arraySimilarity(retMess[5], retMess[0]);
        console.log(retSim);
        //NM: they seem to have passed

        //NM: this seems to be working
        retArray00 = removeArrayDups(retMess);
        console.log(retArray00);

        res.status(200).json({
            message: 'Yippee! Account updated...'
        });
    });

module.exports = router;
