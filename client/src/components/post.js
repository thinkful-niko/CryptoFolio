import React from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import {getPosts} from '../actions/protected-data';

export class Post extends React.Component {
    componentDidMount() {
        // if (!this.props.loggedIn) {
        //     return;
        // }
        this.props.dispatch(getPosts());
        console.log('melon');
    }

    render() {

        return (
            <div className="posts">
            	<h1>Pages</h1>
            	{this.props.posts.map((post, i) => (
                    <div key={i}>
                        <div>{post.journal}</div>
                        <hr />
                    </div>
                ))}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {currentUser} = state.auth;
    console.log(currentUser);
    return {
        loggedIn: currentUser !== null,
        email: currentUser ? state.auth.currentUser.email : '',
        posts: state.protectedData.data
    };
};

export default connect(mapStateToProps)(Post);
