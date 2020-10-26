import React, { Component } from 'react';
import { Row , Input, Button , Col, Form, Table, Steps, message } from 'antd';
import OrderDetails from './OrderDetails';
import PaymentDetails from './PaymentDetails';
import SalesPersonDetails from '../AddSale/SalesPersonDetails';
import moment from "moment"
import PaymentVerification from './PaymentVerifcation';
import Axios from 'axios';
import keys from '../../../keys';


const {Step} = Steps

class AddCollection extends Component {

    state = {
        invoice_no: null,
        current_step : 0,
        overDue : null,
        paymentDate : new Date(),
        totalPayment : 0,
        discount : 0,
        salesPersonVehicle : null,
    
    }


    resetPayment = () => {
        this.setState(
            {
                invoice_no: null,
                current_step : 0,
                overDue : null,
                paymentDate : new Date(),
                totalPayment : 0,
                discount : 0,
                salesPersonVehicle : null
            }
        )
    }

    createPayment = () => {
        const  data = {
                invoice_no : this.state.invoice_no ,
                total_payment : this.state.totalPayment,
                discount : this.state.discount,
                sales_person_vehicle_id : this.state.salesPersonVehicle.id,
                date : moment(this.state.paymentDate,"YYYY-MM-DD").format()
            }

        Axios.post(`${keys.server}/sales/payment/create`,data)
        .then(
            response => {
                message.success("Payment Creation Successfull!")
                this.setState({ invoice_no: null,
                    current_step : 0,
                    overDue : null,
                    paymentDate : new Date(),
                    totalPayment : 0,
                    discount : 0,
                    salesPersonVehicle : null,})
                

            }
        )
        .catch(
            err => {
                console.error(err)
            }
        )
    }


    nextStep = ()=>{    
        this.setState(prevState=>{
            return {
                current_step : prevState.current_step + 1
            }
        })  
    }

    updateSalesPersonDetails = (spv)=>{
        this.setState({
            salesPersonVehicle: spv
        }
        , 
        () => {
            console.log(this.state)
            this.nextStep()
        })
    }

    updatePaymentDetails = (paymentDate , totalPayment , discount) => {
        this.setState({
            paymentDate,
            totalPayment,
            discount
        },
        () => {
            this.nextStep()
        }
        )
    }

    updatePaymentDate = (paymentDate) => {
        this.setState({
            paymentDate
        })
    }

    updateInvoice = (invoice_no) =>{
        this.setState({
            invoice_no
        })
    }

    updateOverDue = (overDue,balance) => {
        this.setState({
            overDue : overDue,
            balance:balance
        })
    }

    resetSteps = ()=>{   
        this.steps = [
                {
                    title: "Order Details",
                    description : "Enter Invoice Number",
                    content : <OrderDetails nextStep={this.nextStep} {...this.state} updateInvoice={this.updateInvoice}  updateOverDue={this.updateOverDue}></OrderDetails>
                }
                ,
                {
                    title: "Payment Details",
                    description : "Enter Payment Amount",
                    content : <PaymentDetails 
                        updatePaymentDetails={this.updatePaymentDetails} 
                        {...this.state}></PaymentDetails>
                }
                ,
                {
                    title: "Sales Person Details",
                    description : "Provide sales person details",
                    content : <SalesPersonDetails 
                        updateSalesPersonDetails={this.updateSalesPersonDetails} 
                        updateSaleDate = {this.updatePaymentDate}
                        saleDate={moment(this.state.paymentDate)}></SalesPersonDetails>
                }
                ,
                {
                    title: "Payment Verification",
                    description : "Verifity your data",
                    content : <PaymentVerification cancelPayment={this.resetPayment} createPayment = {this.createPayment} {...this.state}></PaymentVerification>
                } 
            ]
        }

   

    render() { 
        this.resetSteps()
        return ( 
           <Row gutter={20}>
               <Col span={6}>
                   <Steps direction="vertical" current={this.state.current_step}>
                        {this.steps.map( (step , index) =><Step key={index} title={step.title} description={step.description} ></Step>)}
                   </Steps>        
               </Col>
               <Col span={18}>
                   {this.steps[this.state.current_step].content}
               </Col>

           </Row>
         );
    }
}
 
export default AddCollection;