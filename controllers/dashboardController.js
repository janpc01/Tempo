// dashboardController.js

// Controller functions
const dashboardController = {
    getDashboards: (req, res) => {
        res.render('dashboard', { 
            user: req.user,
        });
    }
};

export default dashboardController;
