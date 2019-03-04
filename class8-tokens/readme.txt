routing request 
configure staging environment and production environment
https server 

filesystem to create ,edit, delete, read , update 


post man application ***************
1. creating user 
url -> localhost:3000/users
method -> post 

payload is sent using : body tab -> raw radio button -> type the sample data
{
	"firstName":"Radhe",
	"lastName":"konaparthy",
	"phone":"9123498999",
	"password":"thisisalsoapassword",
	"tosAgreement":true
}

2. login 

url -> localhost:3000/tokens
method: post 
payload: goto 'body' tab -> 'raw' radio button  -> send object containing phone and password

example for payload 
{
    "phone":"9123498999",
	"password":"thisisalsoapassword",
}

