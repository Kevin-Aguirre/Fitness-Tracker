import React, {useState} from "react"
import {useNavigate} from "react-router-dom"

function Register () {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    
    async function handleSubmit(event) {
        if (!name) {
            alert('name cannot be empty')
            return;
        }

        if (!email) {
            alert('email cannot be empty')
            return;
        }

        if (!password) {
            alert('password cannot be empty')
            return;
        }

        if (password !== confirmPassword) {
            alert('password and confirm password do not match.')
        }

        event.preventDefault();
        const response = await fetch('http://localhost:8080/api/register', {
            method: "POST",
            headers: {
              'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
              name,
              email,
              password
            })
        })
      
        const data = await response.json()
        console.log(data);

        if (data.status === 'ok') {
            alert("Account successfully created.")
            navigate('/login')
        } else {
            if (data.error === "Duplicate email") {
                alert("This email is already in use: " + email)
            }
        }
    
    }

    function goToLogin() {
        navigate('/login')
    }
    return (
        <div className="form">
            <h1 className='title'>Register</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-elem">
                    <label className='form--label'>
                        Name:
                    </label>
                    <input 
                        className='field'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text" 
                        placeholder="Name" 
                    />
                </div>
                <div className="form-elem">
                    <label className='form--label'>
                        Email:
                    </label>
                    <input 
                        className='field'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        type="email" 
                        placeholder='Email'
                    />
                </div>
                <div className="form-elem">
                    <label className="form--label">
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
                <div className="form-elem">
                    <label className="form--label">
                        Confirm Password: 
                    </label>
                    <input 
                        className='field'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password" 
                        placeholder="Confirm Password" 
                    />
                </div>
                <input className='form--button' type="submit" value="Register"/>
                <hr></hr>
                <h3 className='small-title'>Already have an account?</h3>
                <p className='register-link' onClick={goToLogin}>Login Here</p>

            </form>
        </div>
    )
}

export default Register