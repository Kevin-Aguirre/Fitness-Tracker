import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    async function handleSubmit (event) {

        event.preventDefault()
        const credentials = { email, password };

        const response = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();
        // console.log('data');
        console.log(response);
        if (response.ok) {
            localStorage.setItem('token', data.user); // Storing the token
            alert('Login successful');
            navigate('/home');
        } else {
            alert('Please check your username and password');
        }    
    }

    const goToRegister = () => {
        navigate('/register')
    }

    return (
        <div className='form'>
            <h1 className='title'>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    className='field'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email"
                />
                <br />
                <input
                    className='field'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                />
                <br />
                <input className='button' type="submit" value="Login" />
                <hr></hr>
                <h3 className='small-title'> Don't have an account yet?</h3>
                <p className='register-link' onClick={goToRegister}>Register Here</p>
            </form>
        </div>
    );
}

export default App;
