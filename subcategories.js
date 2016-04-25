MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/agilemoves-dev', function(err, db) {
    if(!err) {
        console.log("We are connected");
    }

    var cursor = db.collection('trainingcards').find({});

    cursor.each(function(err, trainingcard) {
        if (err) console.log("trainingcard cannot be read");

        if(trainingcard == null) {
            return 0;
        }

        if(trainingcard.category != null && trainingcard.category != undefined) {

            db.collection('categories').findAndModify({name:trainingcard.category}, [['name', 1]], {name:trainingcard.category}, {new:true, upsert: true}, function(err, doc) {
                if(err) console.log(err);
                console.log("docccc = " + doc);
            });


            //db.collection('trainingcards').update({_id: trainingcard._id}, {
            //    $unset : { 'category' : '' }}, function (err, updated) {
            //
            //    if (err) throw err;
            //    console.dir(updated + " trainingcard Updated!");
            //});

        }

    });
});