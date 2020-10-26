import React, { Component } from 'react';
import { Button, Input, Form } from 'antd';
import { login } from '../../../../redux/auth/actions/actionCreators';
import { connect } from 'react-redux';


class Login extends Component {
    
    handleClick = ()=>{
        const {username , password , emp_type} = this.props
        this.props.login({
            username , password , emp_type
         })
    }

    render() { 
        return (<>
        
            <Row>
                <Form>
                <Input></Input>
                <Button onClick={this.handleClick} >Login</Button>
                </Form>
            </Row>
        </> );
    }
}

const mapDispatchToProps = ()=>{
    login : (credential) => login(credential)
}


 
export default connect(null,mapDispatchToProps)(Login);