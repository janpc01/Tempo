// dashboardController.js
import { User } from '../models/user.js';

// Controller functions
const dashboardController = {
    getDashboards: async (req, res) => {
        try {
            const userObj = new User(req.user.id, req.user.username);
            await userObj.load();
            res.render('dashboard', {
                authUser: req.user,
                userObj: userObj
            });
        } catch (error) {
            console.error("Error loading user data:", error);
            res.status(500).send("Error loading user data");
        }
    }
};

export default dashboardController;
