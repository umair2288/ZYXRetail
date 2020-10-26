import React, { Component } from 'react';
import {  Row , Select , Col} from 'antd';
import TopNavBar from '../components/TopNavBar';
import SalesAndCollection from '../../SalesAndCollection/SalesAndCollection';




class Sales extends Component {

  

    navigate = (link) =>{
        this.props.history.push(link)
    }
   
    render() { 
        return ( 
            <>
            <TopNavBar navigate={this.navigate} title={"Sales"}/>
            <Row style={{paddingTop:20}}>
                <Col offset={1} span={22}>
                <SalesAndCollection {...this.props}/>
                </Col>
            </Row>
            </>
         );
    }
}
 
export default Sales;