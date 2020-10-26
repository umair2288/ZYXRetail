import React, { Component } from 'react';
import {Row , Col, Table, Button} from 'antd'


class PaymentVerification extends Component {
   
    

    columns = [
        {
            title: "Verifcation",
            dataIndex : "title",
            colSpan:2,
            key : 1
        },
        {
            title: "",
            dataIndex : "value",
            key : 2
        }
    ]

  
    render() { 

    const  data = [
            {
                title : "Invoice",
                value : this.props.invoice_no
            }
            ,
            {
                title : "Total Payment",
                value : "Rs. " + this.props.totalPayment 
            }
 
           ,
            {
                title : "Discount",
                value : "Rs. " + this.props.discount 
            }
            ,
            
            {
                title : "Net Payment (Total Payemnt - Discount)",
                value : "Rs. " + (this.props.totalPayment - this.props.discount)
            }
            ,
            {
                title : "Sales Person / Vehicle / Driver / Route",
                value : this.props.salesPersonVehicle ? 
                `${this.props.salesPersonVehicle.sales_person.NIC} / ${this.props.salesPersonVehicle.vehicle.vehicle_no} / ${this.props.salesPersonVehicle.driver.NIC} /${this.props.salesPersonVehicle.route.title}` :  "Not Available" 

            }
        ]

        return ( <div >
            <Table size="small" pagination={false} columns={this.columns} dataSource={data} />
                <Row gutter={20} style={{padding:"20px"}}>
                    <Col offset={14} span={5}> <Button block onClick={() => this.props.resetPayment()} size="large" type="danger" > Cancel Payment</Button> </Col>  
                    <Col   span={5}> <Button size="large" block   onClick={() => this.props.createPayment()} type="primary" > Create Payment</Button> </Col>                            
                </Row>  
        </div> );
    }
}
 
export default PaymentVerification;