import React, { Component } from 'react';
import { Col , Row, Avatar, Button } from 'antd';
import { connect } from 'react-redux';
import { logout } from '../../../redux/auth/actions/actions';


class TopBrandBar extends Component {

    links = [
        "Sales" ,
        "Inventory",
        "Profile"
    ]
   
    render() { 
        return ( 
            <Row style={{fontSize:"14px" , zIndex:1 , boxShadow:"#686868 0px 0px 4px 0px"}} >
                <Col  style={{height:"50px" , textAlign:"center"}} span={3}>
                   <div style={{ transform: "translateY(-50%)",top:"50%" , position:"relative" }}> 
                   <img alt="logo" style={{width:"100px"}} src="rm_logo.png" /> 
                   </div>
                </Col>
                <Col style={{ height:"50px"}} sm={{span:6}} md={{span:10}} lg={{span:12}}>
                    <div style={{fontWeight:"bold" ,transform: "translateY(-50%)",top:"50%" , position:"relative"}}> Royal Marketing Management Console</div>
                </Col>
                <Col style={{height:"50px" , textAlign:"center"}} xl={{offset:4,span:3}}  offset={3}  span={3}>
                    <div style={{ transform: "translateY(-50%)",top:"50%" , position:"relative" }}> <Avatar style={{backgroundColor:"#1890ff" , marginRight:"10px"}} shape="square" size="large" icon="user"></Avatar>  Hi, {this.props.user}! </div>
                </Col>
                {/* <Col className="custom-top-nav-button" style={{height:"50px" , textAlign:"center"}} span={2}>
                    <div style={{ transform: "translateY(-50%)",top:"50%" , position:"relative" }}> Profile </div>
                </Col> */}
                <Col xl={{span:2}} lg={{span:3}} style={{height:"50px"}}>
                    <Button onClick={this.props.logout} type="danger"  style={{ transform: "translateY(-50%)",top:"50%" , position:"relative" }} icon="logout"> Logout</Button>
                </Col>
            </Row>
         );
    }
}

const mapStateToProps = state => {
    return {
        user : state.authentication.name
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout : () => dispatch(logout())
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(TopBrandBar);