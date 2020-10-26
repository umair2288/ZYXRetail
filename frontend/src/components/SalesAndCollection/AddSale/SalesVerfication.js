import React, { Component } from 'react';
import {Row , Col, Table, Button} from 'antd'


class SalesVerification extends Component {
    constructor(props) {
        super(props);
        this.state = {  

        }
    }

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
                title : "Customer NIC",
                value : this.props.customer ?  this.props.customer.NIC : "Not Available"
            }
            ,
            {
                title : "Guarentor NIC",
                value : this.props.guarentor? this.props.guarentor.NIC :  "Not Available" 

            }
            ,
            {
                title : "Product Pieces",
                value : this.props.orderlines ?  this.props.orderlines.reduce( (str , pp) => str + pp.item_code + "," , "") : "Not Available"
            }
            ,
            {
                title : "Total Bill - Discount = Net Payment",
                value : this.props.totalBill  && this.props.netPayment ? 
               ` ${this.props.totalBill} - ${this.props.discount} = ${this.props.netPayment} `
                :  "Not Available" 

            }
            ,
            {
                title : "Payment Type",
                value : this.props.paymentType ? this.props.paymentType :  "Not Available" 

            }
            ,
            
            {
                title : "Instalment Type",
                value : this.props.installment_type ? this.props.installment_type :  "Not Available" 

            }
            ,
            {
                title : "Initial Payment +  Due Per Term X Intallment Terms",
                value : this.props.installmentTerms && this.props.duePerTerm && this.props.initialPayment ? `Rs.${this.props.initialPayment} + Rs.${this.props.duePerTerm} X ${ this.props.installmentTerms}` :  "Not Available" 

            }
            ,
            {
                title : "Weekday",
                value : this.props.weekday ?  this.props.weekday : "Not Available"
            }
            ,
        
            {
                title : "Start Date - End Date",
                value : this.props.startDate ?  `${this.props.startDate} - ${this.props.endDate}` : "Not Available"
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
                    <Col offset={12} span={5}> <Button block onClick={() => this.props.clearSale()} type="danger" > Clear Sale</Button> </Col>  
                    <Col   span={5}> <Button  block   onClick={() => this.props.createSale()} type="primary" > Create Sale</Button> </Col>                            
                </Row>  
        </div> );
    }
}
 
export default SalesVerification;