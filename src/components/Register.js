import {useRef, useState, useEffect} from "react"
import React from "react"
import axios from "../api/axios";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/register"


export default function Register() {
    // use font awesome for icons
    const userRef = useRef();
    const errRef = useRef();

    // user state - tied to user inputs 
    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false); // tied to whether name validates or not
    const [userFocus, setUserFocus] = useState(false); // tied to whether we have focus on field or not

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        userRef.current.focus()
    }, []) // nth in dependcies array, will only happen when component loads

    useEffect(() => {
        const result = USER_REGEX.test(user);
        console.log(result)
        console.log(user);
        setValidName(result)
    }, [user]) // user state in dependcies array, anyitme it changes this function will be ran 

    // this means password and confirm password can respond to each other
    useEffect(() => {
        const result = PWD_REGEX.test(pwd)
        const match = pwd === matchPwd // whether we have valid match 
        console.log(result)
        console.log(pwd)
        setValidPwd(result)
        setValidMatch(match)
    }, [pwd, matchPwd]) // antime we have a change to either field, func is run again, always in sync - both are set in same use effect

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd]) // anyime user changes state, we will clear error message, user has read it and is adjusting to make changes 

    // section - more semantic than div

    const handleSubmit = async (e) => { // gets event by default
        e.preventDefault()
        // validate again
        const v1 = USER_REGEX.test(user)
        const v2 = PWD_REGEX.test(pwd)
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry")
            return;
        }
        
        try {
            const response = await axios.post(REGISTER_URL, 
                JSON.stringify({user, pwd}),
                {
                    headers: {
                        'Content-Type' : 'application/json',
                    },
                    withCredentials: true
                }
            );
            console.log(response.data)
            console.log(response.accessToken)
            console.log(JSON.stringify(response))
            setSuccess(true);
            // clear input fields 
        } catch(err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.status === 409) { // optional chaingin?
                setErrMsg("Username Taken");
            } else {
                setErrMsg("Registration Failed")
            }
            errRef.current.focus()
        }

    } 

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="#">Sign in </a>
                    </p>
                </section>
            ) : (

        <section> 
            <p 
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                // if there is an errMsg, class is errmsg, otherwise it is offscreen, determines styling
                aria-live="assertive" // when we set focus on errRef, it will be annocunted with screen reader
            >
                {errMsg}
            </p>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">
                    Username:
                    <span className={validName ? "valid" : "hide"}>

                    </span>
                    <span className={validName || !user ? "hide" : "invalid"}>
                        
                    </span>
                </label>
                <input
                    type="text" // input is text
                    id="username" // matches html for attribute for label
                    ref={userRef} // allows us to set focus on input
                    autoComplete="off" // registration, should be new, no suggestions
                    onChange={(e) => setUser(e.target.value)} // provides event and sets user state
                    required // required - everyone needs user name
                    aria-invalid={validName ? "false" : "true"} // helps determine if field if valid
                    aria-describedby="uidnote" // provides element that describes input field - used for screen readers 
                    onFocus={() => setUserFocus(true)} // if user input has foucs
                    onBlur={() => setUserFocus(false)} // if you leave user input field 
                />
                <p
                    id="uidnote"
                    /*If user focus is true, and user state exists (not empty) - so we can wait until one character is typed, and if there isnt a valid name -> if all these requirements are shown then instructions are shown*/
                    className={userFocus && user && !validName ? "instructions" : "offscreen"}
                >
                    4 to 24 characters. 
                    <br/>
                    Must begin with a letter 
                    <br/>
                    Letters, numbers, underscores, hyphnes allowed.
                </p>
                <label htmlFor="password">
                    Password:
                    <span className={validPwd ? "valid" : "hide"}>

                    </span>
                    <span className={validPwd || !pwd ? "hide" : "invalid"}>
                        
                    </span>
                </label>
                <input
                    type="password" // prevents autocomplete 
                    id="password" // to match html flr
                    onChange={(e) => setPwd(e.target.value)} // teis to state
                    required // required - passwords eneded
                    aria-invalid={validPwd ? "false" : "true"} // looking at if valid password
                    aria-describedby="pwdnote" // instructions
                    onFocus={() => setPwdFocus(true)} // checks if in field
                    onBlur={() => setPwdFocus(false)} // checks if in field
                />
                <p
                    id="pwdnote"
                    //hid einstructions if not in focus and valid pwd
                    className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
                >
                    8 to 24 characters. <br/>
                    Must include uppercase and lwoecase letters, a number and a special character. <br/>
                    Allowed special characters: 
                        {/* we use aria label descripton so screen reader can look at each description */}
                        <span aria-label="exclamation mark">!</span>
                        
                        <span aria-label="at symbol">@</span>
                        <span aria-label="hashtag">#</span>
                        <span aria-label="dollar sign">$</span>
                        <span aria-label="percent">%</span>
                </p>
                <label htmlFor="confirm_pwd">
                    Confirm Password:
                    {/* passwords must match AND fields cant be empty, explain matchPwd */}
                    <span className={validMatch && matchPwd ? "valid" : "hide"}>

                    </span>
                    <span className={validMatch || !matchPwd ? "hide" : "invalid"}>

                    </span>
                </label>
                <input
                    type="password"
                    id="confirm_pwd"
                    onChange={(e) => setMatchPwd(e.target.value)}
                    required
                    aria-invalid={validMatch ? "false" : "true"}
                    aria-describedby="confirmnote"
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                />
                <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                    Must match teh first password input field

                </p>
                <button
                    disabled={!validName || !validPwd || !validMatch ? true : false}
                >Sign Up</button>

            </form>
            <p>
                Already registered? <br/>
                <span className="line">
                    {/* {put router link here} */}
                    <a href="#">Sign in </a>
                </span> 
            </p>
        </section>
                )}
        </>
    )
}