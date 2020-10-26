import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, message  , Typography} from 'antd';
import { connect } from 'react-redux';
import { login } from '../../../../redux/auth/actions/actionCreators';

const {Title} = Typography

class NormalLoginForm extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        console.log(this.props , values)
        this.props.login({
            username: values.username , 
            password: values.password, 
            remember: values.remember,
            emp_type: "OFFICE STAFF"
         },
         (successMessage)=>{
            message.success(successMessage)
         }
         ,
         (errorMessage)=>{
          message.error(errorMessage)
         }
         )
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
    
      <Form style={{backgroundColor:"rgba(240, 240, 240, 0.8)" , padding:"0 30px 30px" }} onSubmit={this.handleSubmit} className="login-form">
        <div style={{width:"100%" , textAlign:"center"}}>
          <Title style={{backgroundColor:"#F22738" , borderRadius:"0 0 10px 10px" , padding:"5px" , color:"white"}} level={3}>Sales Console</Title>
          <img style={{width:"75%" , marginBottom:"20px"}} src="rm_logo.png"></img>     
        </div>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              size="large"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              size="large"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>Remember me</Checkbox>)}
          {/* <a className="login-form-forgot" href="">
            Forgot password
          </a> */}
          <Button loading={this.props.loading} size="large" block type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const mapDispatchToProps = dispatch =>{
 return {
  login : (credential,successCallback,errorCallback) => dispatch(login(credential,successCallback,errorCallback))
 } 
}

const mapStateToProps = state => {
  const {error , loading , token} = state.authentication
  return {
    error : error && error.message,
    loading: loading,
    token:token
  }
}

const LoginForm = Form.create({ name: 'normal_login' })(connect(mapStateToProps,mapDispatchToProps)(NormalLoginForm));




 
export default LoginForm;