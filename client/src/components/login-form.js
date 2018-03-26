import React from 'react';
import {Field, reduxForm, focus} from 'redux-form';
import Input from './input';
import {login} from '../actions/auth';
import {required, nonEmpty} from '../validators';

export class LoginForm extends React.Component {
    onSubmit(values) {
        return this.props.dispatch(login(values.email, values.password));
    }

    render() {
        let error;
        if (this.props.error) {
            error = (
                <div className="form-error" aria-live="polite">
                    {this.props.error}
                </div>
            );
        }
        return (
            <form
                className="login-form loginForm"
                onSubmit={this.props.handleSubmit(values =>
                    this.onSubmit(values)
                )}>
                {error}
                <button className = 'authMenuExit' onClick = {this.props.exitForm}>X</button>
                <h2>Login</h2>
                <div className='fieldsContainer'>
                    <label htmlFor="email">Email <span className='caseSensitive'>(case sensitive)</span></label>
                    <Field
                        component={Input}
                        type="text"
                        name="email"
                        id="email"
                        validate={[required, nonEmpty]}
                    />
                    <label htmlFor="password">Password <span className='caseSensitive'>(case sensitive)</span></label>
                    <Field
                        component={Input}
                        type="password"
                        name="password"
                        id="password"
                        validate={[required, nonEmpty]}
                    />
                    <button disabled={this.props.pristine || this.props.submitting} className="sbmtBtn">
                        Log in
                    </button>
                </div>
            </form>
        );
    }
}

export default reduxForm({
    form: 'login',
    onSubmitFail: (errors, dispatch) => dispatch(focus('login', 'email'))
})(LoginForm);
