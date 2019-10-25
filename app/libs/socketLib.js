/**
 * modules dependencies.
 */
const socketio = require('socket.io');

const tokenLib = require("./tokenLib.js");

const redisLib = require("./redisLib.js");


let setServer = (server) => {

    let io = socketio.listen(server);
    let myIo = io.of('')
    
    myIo.on('connection', (socket) => {

        console.log("on connection--emitting verify user");

        socket.emit("verifyUser", "");

        // code to verify the user and make him online

        socket.on('set-user', (authToken) => {

            console.log("set-user called")
            tokenLib.verifyClaimWithoutSecret(authToken, (err, user) => {
                if (err) {
                    socket.emit('auth-error', { status: 500, error: 'Please provide correct auth token' })
                }
                else {

                    console.log("user is verified..setting details");
                    let currentUser = user.data;
                    // setting socket user id 
                    socket.userId = currentUser.userId
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    let key = currentUser.userId
                    let value = fullName

                    let setUserOnline = redisLib.setANewOnlineUserInHash("onlineUsersListToDo", key, value, (err, result) => {
                        if (err) {
                            console.log(`some error occurred`)
                        } else {
                            // getting online users list.

                            redisLib.getAllUsersInAHash('onlineUsersListToDo', (err, result) => {
                                console.log(`--- inside getAllUsersInAHas function ---`)
                                if (err) {
                                    console.log(err)
                                } else {

                                    console.log(`${fullName} is online`);
                                    socket.room = 'friendsRoom'
                                    // joining global room.
                                    socket.join(socket.room) 

                                   // socket.to(socket.room).broadcast.emit('online-user-list', result);
                                    
 
                                    socket.broadcast.emit('online-user-list', result);
                                }
                            })
                        }
                    })

                }
            })

        }) // end of listening set-user event


        socket.on('disconnect', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel

            console.log("user is disconnected");
            console.log(socket.userId)
            if (socket.userId) {
                redisLib.deleteUserFromHash('onlineUsersListToDo', socket.userId)
                redisLib.getAllUsersInAHash('onlineUsersListToDo', (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.leave(socket.room)
                       
                        socket.to(socket.room).broadcast.emit('online-user-list', result);
                        //socket.broadcast.emit('online-user-list', result);
                    }
                })
            }

        }) // end of on disconnect


        socket.on('notify-send-friend-req', (data)=>{
            console.log("inside socket.on friend--req")
            console.log(data)
            //socket.broadcast.to()
            myIo.emit(data.recieverId, data)

        })

        socket.on('notify-updates', (data) => {
            console.log("socket notify-updates called")
            console.log(data);
            socket.broadcast.emit(data.userId, data);
        });
    });
}

module.exports = {
    setServer: setServer
}
