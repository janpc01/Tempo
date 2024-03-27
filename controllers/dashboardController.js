// dashboardController.js
import { User } from '../models/user.js';
import { DashboardOps } from '../models/dashboard.js';

// Controller functions
const dashboardController = {
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
    getAddDashboard: async (req, res) => {
        try {
            const userObj = new User(req.user.id, req.user.username);
            await userObj.load();
            res.render('edit-dashboard', {
                edit: false,
                authUser: req.user,
            });
        } catch (error) {
            console.error("Error loading form:", error);
            res.status(500).send("Error loading form");
        }
    },
    postAddDashboard: async (req, res) => {
        const { name } = req.body;
        console.log(name);
        console.log(req.user.id);
        
        // Update the dashboard in the database
        DashboardOps.createNewDashboard(req.user.id, name, (err) => {
            if (err) {
                console.error("Error creating dashboard:", err);
                res.status(500).send("Error creating dashboard");
            } else {
                res.redirect(`/${req.user.username}/${name}`);
            }
        });
    },
    getEditDashboard: async (req, res) => {
        try {
            const userObj = new User(req.user.id, req.user.username);
            await userObj.load();
            res.render('edit-dashboard', {
                edit: true,
                authUser: req.user,
                dashboard: userObj.getDashboard(req.params.dashboard)
            });
        } catch (error) {
            console.error("Error loading form:", error);
            res.status(500).send("Error loading form");
        }
    },
    postEditDashboard: async (req, res) => {
        const { name, id } = req.body;
        
        // Update the dashboard in the database
        DashboardOps.changeDashboardName(id, name, (err) => {
            if (err) {
                console.error("Error updating dashboard:", err);
                res.status(500).send("Error updating dashboard");
            } else {
                res.redirect(`/${req.user.username}/${name}`);
            }
        });
    },
    postDeleteDashboard: async (req, res) => {
        console.log(req.body);
        try {
            const { id } = req.body;
    
            // Delete related habits first
            await new Promise((resolve, reject) => {
                DashboardOps.deleteRelatedHabits(id, (err) => {
                    if (err) {
                        console.error("Error deleting dashboard habits:", err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
    
            // Once related habits are deleted, proceed to delete the dashboard
            await new Promise((resolve, reject) => {
                DashboardOps.deleteDashboard(id, (err) => {
                    if (err) {
                        console.error("Error deleting dashboard:", err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
    
            res.redirect("/");
        } catch (err) {
            console.error("Error deleting dashboard:", err);
            res.status(500).send("Error deleting dashboard");
        }
    },    
};

export default dashboardController;
