import React, { Component } from 'react';
import { Steps , Row , Col, message, Modal } from 'antd';
import OrderDetails from './OrderDetails'
import CreateReturnOrder from './CreateReturnOrder'
import Axios from 'axios';
import keys from '../../../keys';
import SalesPersonDetails from '../../SalesAndCollection/AddSale/SalesPersonDetails';
import moment from 'moment'

const {Step} = Steps
const {confirm} = Modal

class CreateReturnOrderMain extends Component {
    state = {
        currentStep : 0,
        order_id : null,
        salesPersonVehicle : null,
        returnDate:null,
        product_piece_id : null
    }

    goToFirstStep = () =>{
        this.setState({
            currentStep : 0,
            order_id : null,
            product_piece_id : null
        })
    }


    nextStep = ()=>{
        this.setState(prevState => {
            return {
                currentStep : prevState.currentStep + 1
            }
        })
    }

    createReturnOrder = (order_id , product_piece_id) => {
        this.updateOrder(order_id,
          ()=> this.updateProductPiece(product_piece_id,
            () => this.nextStep()
            )        
          )
    }

    updateOrder = (order_id,cb)=>{
        console.log("updating order" , order_id)
        this.setState({
            order_id : order_id
        }, cb )
    }

    updateProductPiece = (product_piece_id , cb) =>{
        this.setState({
            product_piece_id:product_piece_id
        }, cb)
    }

    showRedirectConfirm = (initial_payment,total_installment_paid,total_payment,props)=>{

        confirm({
            title : "Creating new sale",
            content : `Current order includes initial payment of ${initial_payment} and paid total instalment of ${total_installment_paid}. Total payment ${total_payment} will be added as initial payment for new sale`,
            onOk(){
                props.history.push(`/addsale?initial_payment=${total_payment}`)
            },
            oncancel(){
            }
        })
    }

    redirect = (callback)=>{
        let initial_payment , total_installment_paid , total_payment
        //get total paid amount
        Axios.get(
            `${keys.server}/sales/order/summary/${this.state.order_id}`
        )
        .then(
            response => {
                console.log(response)
                initial_payment = response.data.initial_payment
                total_installment_paid = response.data.total_installment_paid
                total_payment = response.data.total_payment
                this.showRedirectConfirm(initial_payment,total_installment_paid,total_payment,this.props)
            }
            
        )
        .catch(
            err => {
                console.error(err)
                message.error("Failed to get payment details!")        
            }
        )
        //ask user to verify the total bill
        //redirect to sales page
        this.props.push()
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

    updateReturnDate = (returnDate) => {
        this.setState({
            returnDate
        })
    }

resetSteps = () => {
    this.steps = [
        {
            title : "Order Details",
            description : "Enter Current Order Details",
            content : <OrderDetails createReturnOrder={this.createReturnOrder}></OrderDetails>
        },
        {
            title : "Sales Person Vehicle Details",
            description : "EnterSales Person Vehicle Details",
            content : <SalesPersonDetails
            updateSalesPersonDetails={this.updateSalesPersonDetails} 
            updateSaleDate = {this.updateReturnDate}
            saleDate={moment(this.state.returnDate)} />
        }
        ,
        {
             title : "Create Return Order",
             description : "Enter Return Order Details",
             content : <CreateReturnOrder 
                goToFirstStep={this.goToFirstStep} 
                redirect={this.redirect} 
                order_id={this.state.order_id} 
                product_piece_id={this.state.product_piece_id}
                date = {this.state.returnDate}
                sales_person_vehicle = {this.state.salesPersonVehicle}     
                ></CreateReturnOrder>
        },
    ]

}
   

    render() { 
       this.resetSteps()
        return ( 
        <Row>  
            <Col span={6}>
                <Steps current={this.state.currentStep} direction="vertical" size="small"> 
                    {this.steps.map(step => <Step title={step.title} description={step.description}></Step>)}
                </Steps>
            </Col>
            <Col  span={18}>
                {this.steps[this.state.currentStep].content}
            </Col>
        </Row>  

        )
    }
}
 
export default CreateReturnOrderMain;