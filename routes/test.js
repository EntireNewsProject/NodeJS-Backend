const moduleNews = require('../models/news');
const express = require('express');
const promise = require('bluebird');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.Promise = promise;


//this checks two arrays of strings and checks how similar they are
var arraySimilarity = function (inpArr1, inpArr2)
{
    let count00;
    let simCount00;
    let tempArr;
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

/*
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
*/

/*
    In one loop group all of the same types of articles
    two cases base gets eliminated
    tail element gets eliminated
    need boolean value to check elimination
 */

var removeArrayDups = function(inpArr)
{
    let count00, count01;
    let current;
    let cutBase;
    /*
    for (count00 = 0; count00 < inpArr.length - 1; count00++)
    {
        count01 = count00 + 1;
        while (count01 < inpArr.length)
        {
            if (arraySimilarity(inpArr[count00].tags, inpArr[count01].tags) >= .5)
                inpArr.splice(count01, 1);
            else
                count01++
        }
    }
    */

    count00 = 0;
    cutBase = false;
    while (count00 < inpArr.length - 1)
    {
        current = count00;
        count01 = count00 + 1;
        while (count01 < inpArr.length)
        {
            if (arraySimilarity(inpArr[current].tags, inpArr[count01].tags) >= .5)
            {
                //if tail is not newer cut tail
                if (!isSecondLaterDate(inpArr[current].createdAt, inpArr[count01].createdAt))
                    inpArr.splice(count01, 1);
                //else cut the base
                else {
                    inpArr.splice(current, 1);
                    current = count01;
                    cutBase = true;
                }
            }
            else
                count01++
        }

        if (!cutBase)
        {
            count00++;
        }
        cutBase = false;
    }

    return inpArr;
};

var condenseArrayDups = function(inpArr)
{
    let count00, count01;
    let currentData;
    let retArr;

    count00 = 0;
    while (count00 < inpArr.length - 1)
    {
        retArr.append([]);
        retArr[count00].append(inpArr[count00]);
        currentData = inpArr[count00];
        count01 = count00 + 1;
        while (count01 < inpArr.length)
        {
            if (arraySimilarity(currentData.tags, inpArr[count01].tags) >= .5)
            {
                //if tail is not newer add it to similar tail
                if (!isSecondLaterDate(currentData.createdAt, inpArr[count01].createdAt)) {
                    retArr[count00].append(inpArr[count01]);
                }
                //else tail element becomes the head and head gets added to similar tail
                else {
                    retArr[count00].append(currentData);
                    retArr[count00][0] = inpArr[count01];
                    currentData = inpArr[count01];
                }

                inpArr.splice(count01, 1);
            }
            else
                count01++
        }

        count00++;
    }

    return retArr;
};

var funcTest00 = function (inpArr1)
{
    return inpArr1;
};

var funcTest01 = function (inpArr1)
{
    return inpArr1[0].tags;
};

var funcTest02 = function (inpArr1)
{
    return inpArr1[0].createdAt;
};

//compares dates
var isSecondLaterDate = function (inpDate00, inpDate01)
{
    let firstDate, secondDate;
    let isNewer;
    firstDate = new Date(inpDate00);
    secondDate = new Date(inpDate01);
    isNewer = false;

    //var dateDifference;
    //currently unused but the purpose is to check if there is an insignificant time difference
    //dateDifference = Math.abs(firstDate - secondDate);
    //dateDifference /= (1000 * 60);

    if (secondDate > firstDate)
    {
        isNewer = true;
    }

    return isNewer;
};

router.route('/dups')
    .post(function (req, res) {
        let x = req.body.x;
        console.log(x);

        let arrDate = ["2018-02-26T19:41:49.068Z", "2018-02-26T19:41:49.068Z", "2018-02-26T19:41:50.068Z",
            "2018-02-26T19:42:49.068Z", "2018-02-26T20:41:49.068Z", "2018-02-27T19:41:49.068Z",
            "2018-03-26T19:41:49.068Z", "2019-02-26T19:41:49.068Z", "2019-03-27T20:42:50.068Z"];

        console.log(isSecondLaterDate(arrDate[0], arrDate[1]));
        console.log(isSecondLaterDate(arrDate[0], arrDate[2]));
        console.log(isSecondLaterDate(arrDate[0], arrDate[3]));
        console.log(isSecondLaterDate(arrDate[0], arrDate[4]));
        console.log(isSecondLaterDate(arrDate[0], arrDate[5]));
        console.log(isSecondLaterDate(arrDate[0], arrDate[6]));
        console.log(isSecondLaterDate(arrDate[0], arrDate[7]));
        console.log(isSecondLaterDate(arrDate[0], arrDate[8]));
        console.log(isSecondLaterDate(arrDate[1], arrDate[0]));
        console.log(isSecondLaterDate(arrDate[2], arrDate[0]));

        console.log(funcTest01(x));
        console.log(funcTest02(x));

        console.log(removeArrayDups(x));

        res.status(200).json({
            message: 'Yippee! Account updated...'
        });
    });

module.exports = router;
