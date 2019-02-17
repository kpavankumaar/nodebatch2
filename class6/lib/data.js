// create read update and delete 
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');
// container for the module 
var lib = {};
lib.baseDir = path.join(__dirname,'/../.data/')
// write data to a file 
lib.create = function(dir,file,data,callback){
 // open the file fs.open()
 // write the data into the file fs.writeFile()
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err, fileDescriptor){
        // w - open file for writing. the file doesnot exist then file is created , if the file exists then file is truncated
        // wx - like' w ' but fail if the path exists
        console.log('lib.create method and inside fs.open ');
        if(!err && fileDescriptor){
            var stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData ,function(err){
                console.log('error msg fs.writeFile', err);
                if(!err){
                    fs.close(fileDescriptor,function(err){
                        console.log('Err msg when closing the file ', err);
                        if(!err){
                            callback(false);
                        }else{
                            callback('error closing the file ');
                        }
                    })
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
lib.read = function(dir,file,callback){
    // read from file  fs.readFile('filepath', 'utf8', function(err,data){})
    fs.readFile(lib.baseDir + dir +'/'+file+'.json','utf8', function(err, data){

        if(!err && data){
            var parsedData = helpers.parseJsonToObject(data);
            callback(false,parsedData);
        }else{
            callback(err,data);
        }
    } )

}

// update data in a file 
lib.update = function(dir, file, data, callback){
    // open the file-  fs.open()
    // remove the data from file- fs.truncate()
    // write the data to file- fs.writeFile ()
    // close the file - fs.close()
    var stringData = JSON.stringify(data);
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
        // fs.truncate - define truncate 
        fs.truncate(fileDescriptor,function(err){
            if (!err) {
                // write to file and close it 
                fs.writeFile(fileDescriptor, stringData, function (err) {
                    if (!err) {
                        fs.close(fileDescriptor, function (err) {
                            if (!err) {
                                callback(false);
                            } else {
                                callback('Error closing the existing file');
                            }
                        })
                    } else {
                        console.log('error writing to the file ')
                    }
                })
            }else{

            }
        })
        
    })
}

// delete a file 
lib.delete = function(dir,file,callback){
    // deletefile fs.unlink()   
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
        callback(err);
    } )
}
module.exports = lib;