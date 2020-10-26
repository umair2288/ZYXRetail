import React, { Component } from 'react';
import { Col , Row, Button, InputNumber , DatePicker} from 'antd'
import moment from 'moment'

class PaymentDetails extends Component {
    
    state = {
        paymentDate : this.props.paymentDate,
        totalPayment : this.props.payment,
        discount : this.props.discount
    }

    handleClick = () =>{
        this.props.updatePaymentDetails(this.state.paymentDate , this.state.totalPayment , this.state.discount)
    }


    render() { 
        return ( 
            <Row>
                <Row style={{margin:"20px"}}>
                    <Col span={6}>Current Overdue</Col> <Col span={12}> <h1> Rs. {this.props.overDue}</h1></Col> 
                </Row>
                <Row  style={{margin:"20px"}}>
                    <Col span={6}>Payment Date</Col> <Col span={12}> <DatePicker onChange={v => this.setState({paymentDate: v && v.format("YYYY-MM-DD")})} value={moment(this.state.paymentDate)}></DatePicker></Col>
                </Row>
                <Row  style={{margin:"20px"}}>
                    <Col span={6}>Payment Amount (LKR): </Col> <Col span={12}> <InputNumber max={this.props.balance} onChange={v=>this.setState({totalPayment:v})} value={this.state.totalPayment} style={{width:"150px"}} min={0}></InputNumber></Col>
                </Row>
                <Row  style={{margin:"20px"}}>
                    <Col span={6}>Discount Amount (LKR): </Col> <Col span={12}> <InputNumber max={this.state.totalPayment} onChange={v=>this.setState({discount:v})} value={this.state.discount} style={{width:"150px"}} min={0}></InputNumber></Col>
                </Row>
                <Row style={{marginTop:"20px"}}>
                    <Col offset={18} span={6}>
                        <Button tabIndex={1} onClick={this.handleClick} size="large" type="primary" block> Enter Sales Person Details</Button>
                    </Col>
                </Row>
            </Row>
         );
    }
}
 
export default PaymentDetails;