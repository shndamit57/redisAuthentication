#   redis setup
    docker run --name redis-server -d -p 6379:6379 redis:latest

#   run client
    cd client
    npm start

#   run server
    cd server
    node server.js
