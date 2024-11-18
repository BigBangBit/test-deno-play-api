// Requires official Node.js MongoDB Driver 3.0.0+
var mongodb = require("mongodb");

var client = mongodb.MongoClient;
var url = "mongodb://127.0.0.1:27017/";

client.connect(url, function (err, client) {
    
    var db = client.db("cunix_api");
    var collection = db.collection("user-data");
    
    var query = {};
    
    var cursor = collection.find(query);
    
    cursor.forEach(
        function(doc) {
            console.log(doc);
        }, 
        function(err) {
            client.close();
        }
    );
    
    // Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/
    
});
