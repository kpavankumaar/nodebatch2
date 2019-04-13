Relations db                                        Document db(no sql)
================================================================================
Server                                              Server
Database                                            Database
Tables                                              Collections
Row                                                 Document
Columns                                             Field


Document is javascript object
{
    id:1,
    brand: 'nokia'
    model: 'N8',
    price: 3000,
    orders:[{data:30/03/2019, qty:2 },{data:30/03/2019, qty:1 },{data:30/03/2019, qty:5 }]
    reviews: [{},{},{}]
},
{
    id:2,
    brand: 'samsung'
}

if you have more than object we call it as Collection

Relation Database 
======================================================
id      brand      model      price
1       nokia      N8         3000
2       

orders
=================================================================
productId       date           Qty
1               30/03/2019      2 
1               30/03/2019      1
1               30/03/2019      5

specifications
================================================
productId       Ram   




how to start ?

--net start mondodb
--net stop mongodb

run mongo in command prompt 

show dbs -> shows all databases
use <databasename> -> this is switching to a database 
show collections : -> 

db.products.update({
    brand:'iphone'
},{
    model : 'i7'
}

)
//////////////////////////////
// db.products.insert({brand:'nokia',model:'n5'})
// db.products.find({})
// db.products.update({brand:'nokia'}, {$set:{model:'z5'}})
// 
db.products.findOne({brand:'samsung'},{_id:0, model:1})

// operators 

$gte ,$gt, $lt, $lte, 


// hashing the password 
npm i bcrypt 
bcrypt.hashSync(req.body.password,2);

for authentication purpose 
bcrypt.compareSync(req.body.password, hashedPassswordFromDB)

once Authentication is complete 
then we have to create token 

installing the webtoken 
npm install jsonwebtoken

