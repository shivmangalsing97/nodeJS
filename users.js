const url = require('url');
const express = require('express');
const app = express();
var MongoClient = require('mongodb').MongoClient;
var mongoURL = "mongodb://localhost:27017/";


MongoClient.connect(mongoURL,{ useNewUrlParser: true }, (err, db) => {
    if (err) return console.log(err)
    
    const PORT = process.env.PORT || 3000;

    var dbo = db.db("mydb");

    //create Request
    app.post('/create', (req, res) => {
        let myobj = url.parse(req.url, true).query;
        dbo.collection("User").insertOne(myobj, function (err) {
            if (err){
                res.status(404).send();
            }
            console.log("1 document inserted");
            return res.send("Created Successfully");
        });
    })
    // Read Request by name
    app.get('/users/:name', (req, res, next) => {
        dbo.collection("User").find().toArray(function(err, results) {
            const foundUser = results.find(user => {
                return user.name === req.params.name;
            })
            if(foundUser){
                res.status(201).send(foundUser);
            } else {
                res.status(404).send();
            }
        });
});

    // Read Request
    app.get('/users', (req, res, next) => {
        dbo.collection("User").find().toArray(function(err, results) {
            res.send(results);
          })
        
    });

    //Update Request
    app.put('/update/:name', (req, res, next) => {
        const myQuery = {name : req.params.name};
        const queryObject = url.parse(req.url, true).query;
        const newValue = { $set : queryObject}
        dbo.collection("User").updateOne(myQuery, newValue, function(err) {
            if (err){
                res.status(404).send();
            } 
            console.log("1 document updated");
        });
        return res.status(201).send("Updated Successfully");
    });

    //delete method
    app.delete('/delete/:name', (req, res, next) => {
        const delObj = {name : req.params.name };
        dbo.collection("User").deleteOne(delObj, (err)=>{
            if(err){
                res.status(404).send();
            } else {
                console.log('1 document deleted');
                return res.status(201).send("Deleted Successfully");
            }
        });
    })

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });

});
