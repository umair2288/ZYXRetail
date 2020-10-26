import React, { Component } from 'react';
import {  Row , Select , Col} from 'antd';
import TopNavBar from '../components/TopNavBar';

import ReturnOrders from '../../Inventory/returnOrders/ReturnOrders';




class ReturnOrderScreen extends Component {

  

    navigate = (link) =>{
        this.props.history.push(link)
    }
   
    render() { 
        return ( 
            <>
            <TopNavBar navigate={this.navigate} title={"Return Orders"}/>
            <Row style={{paddingTop:20}}>
                <Col offset={1} span={22}>
                    <ReturnOrders {...this.props}/>
                </Col>
            </Row>
            </>
         );
    }
}
 
export default ReturnOrderScreen;