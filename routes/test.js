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
            //if the simCount is too high remove the list
            //otherwise increase the forward index

        }

        count00++;
    }
}
*/
router.route('/dups')
    .get(function (req, res) {
        // noinspection JSUnresolvedVariable
        console.log(req.body.dups);

        res.status(202).json({message: 'Yippee! Account updated...'});
    });

module.exports = router;
