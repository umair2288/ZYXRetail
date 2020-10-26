import React ,{Component} from 'react'
import { Row , Input , Col, Form, Button, Table, message, Steps, Divider} from 'antd'
import Axios from 'axios'
import keys from '../../../keys'
import Cart from './Cart'
import SalesCustomerDetails from './SalesCustomerDetails'
import SalesDetails from './SalesDetails'
import PaymentDetails from './PaymentDetails'
import SalesPersonDetails from './SalesPersonDetails'
import SalesVerification from './SalesVerfication'
import queryString from 'query-string'
import moment from 'moment'


const {Step} = Steps

class AddSale extends Component{

    state = {
        current_step : 0,
        orderlines : [],
        customer : null,
        guarentor : null,
        totalBill : 0,
        discount : 0,
        paymentType : null,
        netPayment : 0,
        installmentTerms : 0,
        initialPayment :  0  ,
        weekday : "MONDAY",
        duePerTerm : 0,
        date : moment().format("YYYY-MM-DD"),
        startDate : moment().format("YYYY-MM-DD"),
        endDate : "",
        salesPersonVehicle : null,
        installment_type:"WEEKLY"
    }


    updateSaleDate = (date) =>{
        this.setState({
            date : date.format("YYYY-MM-DD")
        })
    }


    componentDidMount(){
        let query_params = queryString.parse(this.props.location.search)
        if(query_params.initial_payment){
            this.setState({
                initialPayment:parseFloat(query_params.initial_payment) 
            } , () => console.log(this.state))
        }
       
    }

    clearSale = () =>{
        this.setState(
            {
                current_step : 0,
                orderlines : [],
                customer : null,
                guarentor : null,
                totalBill : 0,
                discount : 0,
                paymentType : null,
                netPayment : 0,
                installmentTerms : 0,
                initialPayment : 0,
                weekday : "MONDAY",
                duePerTerm : 0,
                startDate : "",
                endDate : "",
                salesPersonVehicle : null
            } , () => console.log(this.state)
        )
    }




    updateOrderLines = (orderlines , totalBill) => {
        this.setState(
            {orderlines : orderlines,
             totalBill : totalBill
            } , () => console.log(this.state)
        )
    }

    updateCustomer = (customer) => {
        this.setState(
            {customer : customer } ,() => console.log(this.state)
        )
    }

    updateGuarentor = (guarentor) => {
        this.setState(
            {guarentor : guarentor }
        )
    }

    updateNetBillAmountAndDiscount = (netBillAmount , discount , paymentType) => {
            this.setState(
                {
                    paymentType : paymentType,
                    discount : discount,
                    netPayment : netBillAmount
                } , () => console.log(this.state)
            )
    }

    updateInstallmentDetails = ( intallmentTerms , weekday , initialPayment , duePerTerm , startDate , endDate, installmentType)=>{
            this.setState(
                {
                    installmentTerms : intallmentTerms,
                    weekday : weekday ,
                    initialPayment : initialPayment,
                    duePerTerm :duePerTerm,
                    date : startDate,
                    startDate : startDate ,
                    endDate : endDate,
                    installment_type : installmentType
                } , () => 
                {
                    console.log(this.state)
                    this.nextStep()
                }
            )
    }


    confirmSale = () => {
        const sales_data = {
            "initial_payment": this.state.initialPayment,
            "customer_id": this.state.customer? this.state.customer.id:null,
            "guarantor_id": this.state.guarentor ? this.state.guarentor.id:null,
            "sales_person_vehicle_id": this.state.salesPersonVehicle.id,
            "entity":"ROYALMARKETING",
            "date": (this.state.startDate || moment().format("YYYY-MM-DD") ) +  "T00:00", //datetime is needed
            "total_bill":this.state.totalBill,
            "net_payment":this.state.netPayment,
            "due_per_term":this.state.duePerTerm,
            "discount":this.state.discount,
            "product_pieces":this.state.orderlines.map(ol=> ol.id),
            "number_of_terms": this.state.installmentTerms,
            "weekday": this.state.weekday,
            "start_date": this.state.startDate,
            "end_date": this.state.endDate,
            "installment_type": this.state.installment_type     
        }

        const params = {
            type : this.state.paymentType==="INSTALMENT"?"instalment":this.state.paymentType==="CASH"? "cash" : null
        }


        Axios.post(`${keys.server}/sales/order/create` , sales_data, {params:params} )
        .then(
            result => {
                if(result.data.success){
                    message.success(result.data.message)
                    this.clearSale()
                    this.props.navigateToViewSales()

                }else{
                    message.error(result.data.message)
                }
            }
        )
        .catch(
            error => {
                console.error(error)
                message.error("Oops! Something bad happened!")
            }
           
        )
    }


    // updateSalePersonDetials = (salesPerson , vehicle , driver) => {
    //     this.setState({
    //         salesPerson : salesPerson,
    //         vehicle : vehicle ,
    //         driver : driver
    //     })
    // }

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

    nextStep = ()=> {
        this.setState(prevState => {
            return {
                current_step : prevState.current_step+1
            }
        }, console.log(this.state))
    }

    previousStep = ()=> {
        this.setState(prevState => {
            return {
                current_step : prevState.current_step-1
            }
        }, console.log(this.state))
    }


    resetSteps = () => {
        this.steps = [

            {
                title : "Cart",
                description : "Add all products for this sale",
                content : <Cart orderlines={this.state.orderlines} nextStep={this.nextStep} updateOrderLines={this.updateOrderLines}/>
            }
            ,
            
            {
                title : "Customer Details",
                description : "Add customer details here",
                content : <SalesCustomerDetails  
                    customerNIC={this.props.customerNIC}
                    guarentor={this.state.guarentor} 
                    customer={this.state.customer} 
                    updateGuarentor={this.updateGuarentor}  
                    nextStep={this.nextStep} 
                    updateCustomer={this.updateCustomer}/>
            }
            ,
    
            {
                title : "Payment Details",
                description : "Add Payment Details Here",
                content : <PaymentDetails  
                                {...this.state} 
                                nextStep={this.nextStep}  
                                updateNetBillAmountAndDiscount={this.updateNetBillAmountAndDiscount} 
                                updateInstallmentDetails = {this.updateInstallmentDetails}
                                updateSaleDate = {this.updateSaleDate}
                                />
            },
            {
                title : "Sales Person",
                description : "Please verify the details before you create sale",
                content : <SalesPersonDetails 
                                saleDate = {moment(this.state.date)}
                                updateSaleDate = {this.updateSaleDate}
                                salesPersonVehicle = {this.state.salesPersonVehicle}
                                updateSalesPersonDetails = {this.updateSalesPersonDetails}
                                nextStep={this.nextStep} 
                        />
            }
            ,
            {
                title : "Verifcation",
                description : "Please verify the details before you create sale",
                content : <SalesVerification {...this.state} createSale={this.confirmSale} clearSale={this.clearSale}/>
            }
        ]
    
    }




    updateOrderLines = (orderlines , totalBill) => {
        this.setState(
            {
                orderlines : orderlines,
                totalBill : totalBill
            } , () =>
            {
                console.log(this.state)
                this.nextStep()
            } 
        )
    }


    render(){     
        console.log(this.props)
        this.resetSteps()
        
        return(
            <div>
                <Row>          
                    <Col span={6}>        
                        <Steps
                            direction="vertical"
                            size="small"
                            current = {this.state.current_step}
                            onChange = {current => this.setState({current_step:current})}
                        >
                        {this.steps.map(step => <Step title={step.title} description={step.description}></Step> )} 
                        </Steps>
                        
                    </Col>
                   
                    <Col  span = {18}>
                        {this.steps[this.state.current_step].content}
                    </Col>
                </Row>

               
            </div>

        ) 
    }
}

export default AddSale