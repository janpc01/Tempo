import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component

function App() {
    return (
        <Router>
            <div className="App">
                <h1>Welcome to the Habit Tracker</h1>
                <Switch>
                    <Route path="/" exact component={Register} />
                    <Route path="/login" component={Login} />
                    <ProtectedRoute path="/dashboard" component={Dashboard} /> {/* Use ProtectedRoute here */}
                </Switch>
            </div>
        </Router>
    );
}

export default App;
