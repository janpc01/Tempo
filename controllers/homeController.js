// homeController.js

// Controller functions
const homeController = {
    getHome: (req, res) => {
        res.render('home', { username: req.user.username });
    }
};

module.exports = homeController;
