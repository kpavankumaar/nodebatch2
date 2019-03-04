// create read update and delete 
var fs = require('fs');
var path = require('path');
// container for the module 
var lib = {};
lib.baseDir = path.join(__dirname,'/../.data/')
// write data to a file 
lib.create = function(dir,file,data,callback){
 // open the file fs.open()
 // write the data into the file fs.writeFile()
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err, fileDescriptor){
        if(!err && fileDescriptor){
            var stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData ,function(err){
                console.log('error msg', err);
                if(!err){
                    fs.close(fileDescriptor,function(err){})
                    // callback(false);
                }else{
                    console.log(' Error writing to the file ');
                }
            })
        }else{
            callback('could not create new file , it may already exist');
        }
    })

 
}

// read data from a file 
lib.read = function(){
    // read from file  fs.readFile()

}

// update data in a file 
lib.update = function(){
    // open the file-  fs.open()
    // remove the data from file- fs.truncate()
    // write the data to file- fs.writeFile ()
    // close the file - fs.close()
}

// delete data in a file 
lib.delete = function(){
    // deletefile fs.unlink()
}
module.exports = lib;