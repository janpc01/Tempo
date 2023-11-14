import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory(); // Create useHistory instance

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Login failed');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                localStorage.setItem('userToken', data.token); // Store the token
                history.push('/dashboard'); // Redirect using React Router
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle login errors (e.g., show error message)
            });
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
