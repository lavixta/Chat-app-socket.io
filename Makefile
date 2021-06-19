setup:
	@echo "----install dependancies----"
	cd client 
	npm install snowpack 
	npm install socket.io-client
	cd ..
	cd server 
	npm install nodemon
	npm install socket.io 
	
