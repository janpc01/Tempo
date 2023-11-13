// models/user.js
let users = []; // This should ideally be a database model

module.exports = {
    createUser: (username, hash) => {
        users.push({ username, hash });
    },
    findUser: (username) => {
        return users.find(user => user.username === username);
    }
};
