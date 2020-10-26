import React , {Component} from 'react'
import { Row, Radio , Col, Button , Divider } from 'antd'
import InstallmentPayment from './InstallmentPayment'
import CashPayment from './CashPayment'


class PaymentDetails extends Component{

    state = {
        paymentType : 1
    }


    


    render(){
        return (
            
            <div>
                <Row style={{fontWeight:"bold"}} justify="center" gutter={20}>
                        <Col span={5}>
                            Payment Type
                        </Col>
                        <Col  span={12}>
                            <Radio.Group value={this.state.paymentType} onChange={e => this.setState({paymentType:e.target.value})}>
                                <Radio value={1}>Instalment</Radio>
                                <Radio value={2}>Cash</Radio>
                            </Radio.Group>
                        </Col>   
                </Row>
                <Row>
                    <Col span={24}>
                    {
                        this.state.paymentType === 1 ? <InstallmentPayment 
                                                            {...this.props} 
                                                            updateNetBillAmountAndDiscount = {this.props.updateNetBillAmountAndDiscount}
                                                            updateInstallmentDetails={this.props.updateInstallmentDetails} 
                                                            totalBill={this.props.totalBill}>
                                                        </InstallmentPayment>
                                                        : 
                                                        <CashPayment 
                                                            {...this.props}
                                                            totalBill={this.props.totalBill} 
                                                            updateNetBillAmountAndDiscount = {this.props.updateNetBillAmountAndDiscount}
                                                            nextStep = {this.props.nextStep}
                                                            updateSaleDate = {this.props.updateSaleDate}
                                                            totalBill={this.props.totalBill}>    
                                                        </CashPayment>
                    }
                    </Col>
                </Row>
               
            </div>
        )
    }
}

export default PaymentDetails


