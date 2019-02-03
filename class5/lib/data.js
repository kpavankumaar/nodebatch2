// create read update and delete 
var fs = require('fs');
var path = require('path');
// container for the module 
var lib = {};
lib.baseDir = path.join(__dirname,'/../.data/')
// write data to a file 
lib.create = function(dir,file){
 // open the file fs.open()
 // write the data into the file fs.writeFile()
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err, fileDescriptor){
        if(fileDescriptor){
            fs.writeFile('fileDescriptor', 'datayouwanttowrite',function(err){
                if(err){

                }else{
                    // console.log(' closing new file ')
                }
            })
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