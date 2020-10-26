import React, { Component } from 'react';
import {Col , Row, Input, Button} from 'antd'

import StockReportPDFView from './StockReportPDFView';


class StockReport extends Component {
   

    

    render() { 
        return ( 
           <Row gutter={20}>
               <Col span={24}>
                   <Row style={{padding:"20px"}} gutter={20}>
                        <Col span={6}>
                            <Col span={10}>Report Name</Col>
                            <Col span={14}><Input placeholder="Select Report Name"></Input></Col>       
                        </Col> 
                        <Col span={6}>
                            <Col span={10}>Report Name</Col>
                            <Col span={14}><Input placeholder="Select Report Name"></Input></Col>       
                        </Col> 
                        <Col span={6}>
                            <Col span={10}>Report Name</Col>
                            <Col span={14}><Input placeholder="Select Report Name"></Input></Col>       
                        </Col> 
                        <Col span={6}>
                            <Button block type="primary"> Generate Report</Button>
                        </Col>
                   </Row>
                   <Row>
                        <Col span={24}>
                            <StockReportPDFView/>
                        </Col>
                   </Row>
               </Col>
            </Row>
         );
    }
}
 
export default StockReport;