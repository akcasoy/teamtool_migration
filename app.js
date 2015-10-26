MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/teamtool-migration', function(err, db) {
    if(!err) {
        console.log("We are connected");
    }


    // Find all users
    db.collection('users').find({}).toArray(function(err, users) {
        if(err) {
            console.log("Users cannot be found!");
        }
        console.dir(users.length + " users found!");


        // Find all ratings
        db.collection('ratings').find({}).toArray(function(err, ratings) {
            if (err) {
                console.log("Ratings cannot be found!");
            }
            console.dir(ratings.length + " ratings found!");


            // Iterate over ideas collection
            var ideaCursor = db.collection('ideas').find({});
            ideaCursor.each(function (err, idea) {
                if (err) throw err;

                if (idea === null) {
                    // Here db.close throws exception since the callback function of update is not done yet.
                    return;
                }


                // First find the author of the idea
                for (var indexUsers = 0; indexUsers < users.length; ++indexUsers) {
                    if (users[indexUsers]._id.equals(idea.author)) {

                        console.log("This idea's author " + users[indexUsers].username + " has been found!");

                        var ideaRatings = [];

                        // Secondly find the ratings of the idea
                        for (var indexRatings = 0; indexRatings < ratings.length; ++indexRatings) {

                            // Ignore rating if the rating is from the author or if the author is anonymous
                            if (ratings[indexRatings].idea.equals(idea._id) && typeof ratings[indexRatings].author !== 'undefined' && !ratings[indexRatings].author.equals(idea.author)) {

                                var raterId = ratings[indexRatings].author;
                                var date = ratings[indexRatings].date;
                                var starRating = ratings[indexRatings].star_rating;

                                var raterUsername = '';

                                for (var indexUsersIn = 0; indexUsersIn < users.length; ++indexUsersIn) {
                                    if (users[indexUsersIn]._id.equals(raterId)) {
                                        raterUsername = users[indexUsersIn].username;
                                        break;
                                    }
                                }

                                console.log("This idea has a new rating of " + starRating + " from  " + raterUsername);

                                ideaRatings.push({'rater':raterUsername, 'star':starRating, 'date':date});
                            }
                        }

                        // Update idea, rename column name to title, set username instead of id, set ratings array, lastly remove columns totalStarCount and raterCount
                        db.collection('ideas').update({_id: idea._id}, {
                                $rename : { 'name' : 'title' },
                                $set: {'author': users[indexUsers].username, 'ratings':ideaRatings},
                                $unset : { 'totalStarCount' : '', 'raterCount' : '' }}, function (err, updated) {

                            if (err) throw err;
                            console.dir(updated + " idea Updated!");
                        });

                        break;
                    }
                }

                // end of cursor
            });
        });
    });
});