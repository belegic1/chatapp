const users = []

const addUser = ({id, username, room})=>{

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: 'Username and Room must be added'
        }
    }

    const existingUser = users.find((user)=>{

        return user.room === room && user.username === username
    })

    if (existingUser) {
        
        return {
            error: 'Username and Room must be unique'
        }
    }

    const user = {id, username, room}

    users.push(user)
    return {
        user
    }
}

const removeUser = (id) =>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })

    if (index !== -1) {
        return users.splice(index,1)[0]
    }
}


const getUser = (id) =>{
    const findUser = users.find(user =>{
        return user.id === id
    })

    if (!findUser) {
        return {
            error: 'User cant be found'
        }
    }
    return findUser
}

const getUsersInRoom = (room) =>{
    const myRoom = users.filter((r)=>{
        return r.room === room
    })

    if (!myRoom) {
        return {
            error: 'Room does not exist'
        }
    }

    return myRoom
}

module.exports ={
    addUser,
    removeUser,
    getUsersInRoom,
    getUser
}