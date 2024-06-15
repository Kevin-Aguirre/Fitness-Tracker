import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Login({isAuthenticated}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();



    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

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
                <div className='form-elem'>
                    <label className='form--label'>
                        Email:
                    </label>
                    <input
                        className='field'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Email"
                    />
                </div>
                <div className='form-elem'>
                    <label className='form--label'>
                        Password:
                    </label>
                    <input
                        className='field'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Password"
                    />
                </div>
                <input className='form--button' type="submit" value="Login" />
                
                <hr></hr>
                <h3 className='small-title'> Don't have an account yet?</h3>
                <p className='register-link' onClick={goToRegister}>Register Here</p>
            </form>
        </div>
    );
}

export default Login;
