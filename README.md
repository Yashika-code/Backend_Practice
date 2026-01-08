** Project - Backend_Practice **

In this project i relearn the all concepts of the backend (node.js) . In thia in auth i added the tokens:

** Token **
ACCESS_TOKEN = which is for the 15min expires 
REFRESH_TOKEN = which is for the 30days expires 

** Rotation Logic **
I applied rotation logic in this -> In this i add this to protect the token from the attacker 

** STEPS **
step - 1 : In this firstly when user will login a new token get generate
step - 2 : After this , when use go to refresh route there it verify or validate that token and at that time token will be automatically updated and also get update into the DB .
step - 3 : if you login again then it will use updated token 

this rotational prevent the token to get hacked .

** Logout logic **
In this , in logout route refreshToken get empty and when user again login it will generate new token.


** Author **
Yashika Soni
