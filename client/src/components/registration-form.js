import React from 'react';
import {Field, reduxForm, focus} from 'redux-form';
import {registerUser} from '../actions/users';
import {login} from '../actions/auth';
import Input from './input';
import {required, nonEmpty, matches, length, isTrimmed} from '../validators';
import GoogleLogin from 'react-google-login';

export class RegistrationForm extends React.Component {
    onSubmit(values) {
        const {email, password } = values;
        const user = {email, password };
        return this.props
            .dispatch(registerUser(user))
            .then(() => this.props.dispatch(login(email, password)));
    }

    responseGoogle(response){
      console.log(response);
      
    }

    render() {
        return (
                <form
                    className="login-form registerForm"
                    onSubmit={this.props.handleSubmit(values =>
                        this.onSubmit(values)
                    )}>
                    <button className = 'authMenuExit' onClick = {this.props.exitForm}>X</button>
                    <h2>Register</h2>
                    <div className='fieldsContainer'>
                        <label htmlFor="email">Email</label>
                        <Field
                            component={Input}
                            type="text"
                            name="email"
                            validate={[required, nonEmpty, isTrimmed]}
                        />
                        <label htmlFor="password">Password</label>
                        <Field
                            component={Input}
                            type="password"
                            name="password"
                            validate={[required, length({min: 3, max: 30}), isTrimmed]}
                        />
                        <label htmlFor="passwordConfirm">Confirm password</label>
                        <Field
                            component={Input}
                            type="password"
                            name="passwordConfirm"
                            validate={[required, nonEmpty, matches('password')]}
                        />
                        <button
                            type="submit"
                            className="sbmtBtn"
                            disabled={this.props.pristine || this.props.submitting}>
                            Register
                        </button>
                    </div>
                </form>
        );
    }
}

export default reduxForm({
    form: 'registration',
    onSubmitFail: (errors, dispatch) =>
        dispatch(focus('registration', Object.keys(errors)[0]))
})(RegistrationForm);
