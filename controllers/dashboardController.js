// dashboardController.js

// Controller functions
const dashboardController = {
    getDashboard: (req, res) => {
        res.render('dashboard', { username: req.user.username });
    }
};

export default dashboardController;
