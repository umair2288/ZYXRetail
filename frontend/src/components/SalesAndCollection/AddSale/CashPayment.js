import React, { Component } from 'react';
import { Button , Col , Row, InputNumber} from 'antd';
import { DatePicker } from 'antd';
import moment from 'moment'



class CashPayment extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            discount : 0
         }
    }

    handleConfirm = () => {
        console.log("working...")
        this.props.updateNetBillAmountAndDiscount(this.props.totalBill - this.state.discount, this.state.discount , "CASH")
        this.props.nextStep()
    }


    render() { 
        return ( 
            <div style={{marginTop:"50px"}}>
                <Row style={{padding:"20px"}}>
                    <Col span={12}>
                        Sale Date
                    </Col>
                    <Col span={12}>
                       <DatePicker value={moment(this.props.date)} onChange={this.props.updateSaleDate}/>
                    </Col>
                </Row>
                <Row style={{padding:"20px"}}>
                    <Col span={12}>
                        Total Bill
                    </Col>
                    <Col span={12}>
                        <InputNumber  style={{width:"200px"}} readOnly value={this.props.totalBill} ></InputNumber>
                    </Col>
                </Row>
                <Row style={{padding:"20px"}}>
                    <Col span={12}>
                        Discount
                    </Col>
                    <Col span={12}>
                        <InputNumber onChange={v => this.setState({discount:v})} style={{width:"200px"}} placeholder={"Discount Amount"} value={this.state.discount} ></InputNumber>
                    </Col>
                </Row>
                <Row style={{padding:"20px"}}>
                    <Col span={12}>
                       Net Payment
                    </Col>
                    <Col span={12}>
                      <h2> Rs. {parseFloat(this.props.totalBill) - this.state.discount} </h2>
                    </Col>
                </Row>
                <Row>
                    <Col offset={18} span={6} >
                        <Button  type="primary" onClick = {this.handleConfirm}> Confirm Payment</Button>
                    </Col>
                </Row>
            </div>
         ); 
    }
}
 
export default CashPayment;