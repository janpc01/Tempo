// dashboardController.js
import { User } from '../models/user.js';

// Controller functions
const dashboardController = {
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
    },
    getDashboard: async (req, res) => {
        try {
            const userObj = new User(req.user.id, req.user.username);
            await userObj.load();
            res.render('dashboard', {
                authUser: req.user,
                allDashboards: userObj.getDashboardsByName(),
                dashboard: userObj.getDashboard(req.params.dashboard)
            });
        } catch (error) {
            console.error("Error loading dashboard data:", error);
            res.status(500).send("Error loading dashboard data");
        }
    },
    getHabit: async (req, res) => {
        try {
            const userObj = new User(req.user.id, req.user.username);
            await userObj.load();
            res.render('habit', {
                authUser: req.user,
                habit: userObj.getDashboard(req.params.dashboard).getHabit(req.params.habit)
            });
        } catch (error) {
            console.error("Error loading habit data:", error);
            res.status(500).send("Error loading habit data");
        }
    }
};

export default dashboardController;
