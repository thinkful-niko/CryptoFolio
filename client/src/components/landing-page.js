import React from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import Post from './post';
import './LandingPage.css';

import LoginForm from './login-form';
import RegisterForm from './registration-form.js'

export class LandingPage extends React.Component {
    
    constructor(props) { 
        
        super(props); 
        this.state = {
            isRegisterOn: false,
            isLoginOn: false
        };

        console.log(props, this.state);
    }
    handleRegister(e) {
        this.setState(prevState => ({
          isRegisterOn: !prevState.isRegisterOn,
          isLoginOn: false
        }));
        e.preventDefault()
    }
    handleLogin(e){
        this.setState(prevState => ({
          isLoginOn: !prevState.isLoginOn,
          isRegisterOn: false
        }));
        e.preventDefault()
        console.log('handle', this.props, this.state);
    }
    render(){
        if (this.props.loggedIn) {
            return <Redirect to="/dashboard" />;
        }
        return (
            <div className="home">
                
                 <div className="LandingPage">
                <header className="LandingPage-header">
                  <h1 className="LandingPage-title">Cryptofolio</h1>
                </header>
                <p className="LandingPage-intro">
                  Portfolio Manager for Cryptocurrencies.
                </p>
                <form className="LandingPage-buttons">
                  <button className="LandingPage-getStartedBtn" onClick={(e)=>{ this.handleRegister(e) }}>Get Started</button>
                  <p>Or</p>
                  <button className="LandingPage-logInBtn" onClick = {(e)=>{ this.handleLogin(e) }}>Log In</button>
                  {/*<a href="/auth/google" class="btn btn-danger"><span class="fa fa-google-plus"></span> Google+</a>*/}
                </form>

                <div>
                    { this.state.isLoginOn? <LoginForm exitForm = {(e)=>{ this.handleLogin(e) }}/> : null }
                    { this.state.isRegisterOn? <RegisterForm exitForm = {(e)=>{ this.handleRegister(e) }}/> : null }
                </div>
                <p className='demoInfo'>Demo account (login: demo@demo.com | password: demo)</p>
              </div>
            </div>

        );
    }
    
}

const mapStateToProps = state => ({
    loggedIn: state.auth.currentUser !== null
});


export default connect(mapStateToProps)(LandingPage);
