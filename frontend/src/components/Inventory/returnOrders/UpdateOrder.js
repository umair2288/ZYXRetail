import React, { Component } from 'react';
import { Row, Input , Col } from 'antd';

class UpdateOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
        <Row>
            <Col span={24}>
                <Row gutter={10}>
                    <Col span={12}>New Product Piece</Col>
                    <Col span={12}><Input value={this.state.item_code} onChange={e => this.setState({item_code:e.target.value})}></Input></Col>
                </Row>
            </Col>
        </Row> );
        
    }
}
 
export default UpdateOrder;