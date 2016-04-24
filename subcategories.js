MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/agilemoves-dev', function(err, db) {
    if(!err) {
        console.log("We are connected");
    }

    var cursor = db.collection('trainingcards').find({});

    cursor.each(function(err, trainingcard) {
        if (err) console.log("trainingcard cannot be read");

        db.collection('categories').findOneAndUpdate({name:trainingcard.category}, {}, {upsert: true}, function(err, category) {
            if(category == null) {

            }
        });


    });
});