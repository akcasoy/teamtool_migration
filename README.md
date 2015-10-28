# teamtool_migration
Update idea, rename column name to title, set username instead of id, set ratings array, lastly remove columns totalStarCount and raterCount

1 - export ideas/ratings/users collections to the files teamtool-ideas/-ratings/-users
2 - in terminal: mongoimport --db teamtool-migration --collection ideas --file teamtool-ideas
                 mongoimport --db teamtool-migration --collection ratings --file teamtool-ratings
                 mongoimport --db teamtool-migration --collection users --file teamtool-users
3 - npm install
4 - node app.js
