// dashboardController.js
import { User } from '../models/user.js';

// Controller functions
const homeController = {
    getHome: async (req, res) => {
        try {
            const userObj = new User(req.user.id, req.user.username);
            await userObj.load();
            res.render('home', {
                authUser: req.user,
                userObj: userObj
            });
        } catch (error) {
            console.error("Error loading user data:", error);
            res.status(500).send("Error loading user data");
        }
    }
};

export default homeController;
