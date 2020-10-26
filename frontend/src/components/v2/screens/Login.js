import React, { Component } from 'react';
import { Row , Col} from 'antd'
import LoginForm from '../components/Authentication/LoginForm';
import ParticlesBG from 'particles-bg'


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { 

         }
    }
    render() { 
        return ( 
        <Row style={{height:"100vh"}}>
            <Col
                style ={{
                    position: "absolute",
                    top: "50%",
                    msTransform : "translateY(-50%)",
                    transform: "translateY(-50%)"
                    }}
                xl={{offset:9 , span:6}} 
                lg={{offset:8 ,span:8}} 
                md = {{offset:8 ,span:8}} 
                sm={{offset:6,span:12}}
                xs={{offset:4,span:16}}>
              
                <LoginForm/>
            </Col>    
            <ParticlesBG bg type="cobweb"></ParticlesBG>
        </Row>);
    }
}
 
export default Login;