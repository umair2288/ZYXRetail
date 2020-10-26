import React, { Component } from 'react';
import {Row, Col} from 'antd'

class Dashboard extends Component {
   

    render() { 
        return ( 
        <Row style={{backgroundColor:"white"}} gutter={20}>
            <Col span={16}>
                <Row gutter={20}>
                    <Col style={{height:"250px" , backgroundColor:"gray"}}  span={6}>
                    </Col>
                    <Col style={{height:"250px"}}  span={6}>
                    </Col>
                    <Col style={{height:"250px"}} span={6}>
                    </Col>
                    <Col style={{height:"250px"}} span={6}>
                    </Col>
                </Row>
           </Col>    
           <Col style={{height:"500px" , backgroundColor:"gray"}} span={8}>
                {/* <ReportList></ReportList> */}
           </Col>
        </Row> 
        );
    }
}
 
export default Dashboard;