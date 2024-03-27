// dashboardController.js
import { User } from '../models/user.js';

// Controller functions
const habitController = {
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
    },
    getAddHabit: async (req, res) => {
        try {
            const userObj = new User(req.user.id, req.user.username);
            await userObj.load();
            res.render('add-habit', {
                add: true,
                authUser: req.user,
                dashboard: userObj.getDashboard(req.params.dashboard)
            });
        } catch (error) {
            console.error("Error loading dashboard data:", error);
            res.status(500).send("Error loading dashboard data");
        }
    },
    postAddHabit: async (req, res) => {
        try {
            const userObj = new User(req.user.id, req.user.username);
            await userObj.load();
            userObj.getDashboard(req.params.dashboard).addHabit(req.body.habitName);
            res.redirect(`/${req.user.username}/${req.params.dashboard}`);
        } catch (error) {
            console.error("Error adding habit:", error);
            res.status(500).send("Error adding habit");
        }
    },
    getEditHabit: async (req, res) => {},
    postEditHabit: async (req, res) => {},
    postDeleteHabit: async (req, res) => {
        try {
            const userObj = new User(req.user.id, req.user.username);
            await userObj.load();
            userObj.getDashboard(req.params.dashboard).deleteHabit(req.params.habit);
            res.redirect(`/${req.user.username}/${req.params.dashboard}`);
        } catch (error) {
            console.error("Error deleting habit:", error);
            res.status(500).send("Error deleting habit");
        }
    },
};

export default habitController;
