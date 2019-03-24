create a directory  --> myapp 
cd to myapp 
run 'npm init' in myapp directory
npm init creates package.json file 
when node has to read the directory , it will read package.json to load the entry point(main property ) file 





// express generatorl
For creating project structure for tha app we will use express generator 

npm install express-generator -g --> this is to install express generator 

after intalling express generator in cli use the command 'express' to create a project structure 

express --view=pug myapp --> creates project structure
npm install -> dependencies added 
DEBUG=myapp:* npm start  -> starts the server on port 3000


// routing syntax
app.Method(path, handler)


// serving static file in express
express.static(root,[options]);

express.static('public');
app.use(express.static('public'))
app.use(express.static('files'))

http://localhost:3000/images/image1.jpg

