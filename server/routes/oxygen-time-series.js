var express = require("express");
var router = express.Router();
var request = require("request-promise");


router.route('/oxygen')
    .get(function(req,res){

//        var query = "https://roseservice.run.aws-usw02-pr.ice.predix.io/oxygen/timeRangeV2?startDatetime=" + 
//           req.param("startTimestamp") + 
//            "&endDatetime=" +
//            req.param("endTimestamp");

        var query = "https://roseservice.run.aws-usw02-pr.ice.predix.io/oxygen/timeRangeV2?productionLine=PL046&startDatetime=2018-02-01T12:00:00Z&endDatetime=2018-04-30T12:00:00Z"

        // Making a GET call oxygen endpoint
        const opts = {
            url: query,
            json: true,
//            auth: {
//                bearer: req.token
//            },
            headers: {
                'accepts': 'application/json',
                'content-type': 'application/json',
            }
        };

        request.get(opts).then(data => {

            var chartData = [], seriesConfig = {};

            for (var i=0; i<data.tags.length; i++) 
            {
                var tag = data.tags[i];

//                var yKey = "y" + i;
                var yKey = tag.results[0].attributes.lane[0];

                if(tag.results[0].values!=null){
                    for (var x=0; x<tag.results[0].values.length; x++)
                    {
                        var val = tag.results[0].values[x];
                        var point = {};

                        // This seems like it should work, but causes an error.
                        // point[xKey] = val[0];
                        point.timestamp = val[0]
                        point[yKey] = val[1];
                        chartData.push(point);
                    }
                }
            };

            chartData.sort()
            res.json(chartData);

        }).catch(error => {
            res.status(502).send({error: error.message});
        });    
    });


module.exports = router;