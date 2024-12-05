// Will require our helper code
// require React and ReactDOM/client libraries


const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client')


// create function to handle submit events on login page
// don't require third param for sendPost due to build in error handling
const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector("#user").value;
    const pass = e.target.querySelector("#pass").value;

    if(!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass});
    return false;
}

// create function for handling clicks to the signup button
const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value
    
    if(!username || !pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if(pass !== pass2){
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2});

    return false;
}

// create React componnets
// FSC - functional staeteless component
const LoginWindow = (props) => {
    return(
        
        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
            
        >
            
            <img class="banner" src="assets/img/wave.png" alt="Wave Photo" />
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <input className="formSubmit" type="submit" value="Sign in" />
        </form>
        

        
    );
};

// same thing for sign up window
const SignupWindow = (props) => {
    return (
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <img class="banner" src="assets/img/wave.png" alt="Wave Photo" />
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input className="formSubmit" type="submit" value="Sign up" />
        </form>
    )
}


// function for adding event listenders to the buttons
// do this so that we cna render in our react components
// will have it render the login page immediately
const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');
  //  const aboutButton = document.getElementById('aboutButton');

    const root = createRoot(document.getElementById('content'));

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <LoginWindow /> );
        return false
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <SignupWindow />)
        return false;
    });


    root.render(<LoginWindow />)
};

window.onload = init;