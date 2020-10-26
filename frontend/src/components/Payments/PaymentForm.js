import React, {Component } from 'react'
import { InputNumber, Form , Select ,Row , Col, message, Button} from 'antd'
//import CustomerDetails from '../ViewCustomers/CustomerDetails'
import salesStaffStore from '../../store/SalesStaffStore'
import instalmentStore from '../../store/InstalmentStore'
import customerStore from '../../store/CustomerStore'
import paymentStore from '../../store/PaymentStore'

const {Option} = Select

class PaymentForm extends Component{

    state = {
        payment : {
            term_id : this.props.term_id,
            order_id: null,
            amount:null,
            salesPersonId:null,
            paymentType:"INSTALMENT"
        },

        details : {
            customer:{
                contact:{
                    Address:{

                    }
                }
            }
        }
    }

    componentDidMount(){   
        instalmentStore.getInstalmentTermById(this.state.payment.term_id,
            (data)=>{
                message.success("data fetched successfuly")
                this.setState(
                    prevState =>{
                       return {
                        details:{
                            ...prevState.details,
                            invoice_no: data.plan.invoice.invoice_no,
                            due_amount: data.due_amount,
                            customer : customerStore.getCustomer(data.plan.invoice.customer).pop(),
                            term: data.title
                        },
                        payment:{
                        ...this.state.payment,
                           order_id:data.plan.invoice.id,
                           paymentType:"INSTALMENT",
                           
                        }

                    }
                        
                    } , () => console.log(this.state)
                )
            }
            ,
            () =>{
                message.error("data fetching failed")
            }

            )
    }


  
    
    onSalesPersonChange = (value) => {
        console.log(value)
        this.setState((prevState) => {
          return  {
                    payment:{
                            ...prevState.payment,
                            salesPersonId:value
                            }
                    }
                }
        ,()=>console.log(this.state))
    }

    onPaymentAmountChange = (value) => {
        console.log(value)
        this.setState((prevState) => {
            return  {
                      payment:{
                              ...prevState.payment,
                              amount:value
                              }
                      }
                  }
          ,()=>console.log(this.state))
    }

    
    onPayClicked = (event) =>{
        event.preventDefault()
        console.log(this.state.payment)
        paymentStore.createPayment(this.state.payment,
            ()=>{
                message.success("Payment made successfuly")
                this.props.onOk()
            },
            ()=>{
                message.error("error on creating payment, check your connection")
            })
    }


    render(){
        console.log(this.state)
        return (
           <div>
               {/* <h2 style={{textAlign:"center"}}><u>Collection Form</u></h2> */}
               {/* <CustomerDetails {...this.state.details.customer} ></CustomerDetails> */}
               <Row>
                   <Col span={24} align="center" >
                        <h3>Invoice - {this.state.details.invoice_no}</h3>
                        <h3> Payment Term - {this.state.details.term}</h3>
                   </Col>
               </Row>
               {/* <Row>
                   <Col span={24} align="center" >
                        <h3> Payment Term - {this.state.details.term}</h3>
                   </Col>
               </Row> */}
               <Form >
                   <Row gutter={10}>
                       <Col span={12}>
                            <Form.Item label="Amount">
                                <InputNumber min={0} max={parseInt(this.state.details.due_amount) || 0 } style={{width:"200px"}}onChange = {this.onPaymentAmountChange} value={this.state.payment.amount}></InputNumber>
                            </Form.Item>
                       </Col>
                       <Col span={12}>
                       <Form.Item label="Sales Person">
                            <Select onChange = {this.onSalesPersonChange} value={this.state.payment.salesPersonId}>
                                {
                                    salesStaffStore.salesStaffs.map(
                                        (staff)=> {
                                            return <Option key={staff.id}>{staff.Contact.FirstName+ " " +staff.Contact.LastName+'-'+ staff.NIC} </Option>
                                        }
                                    )
                                }
                            </Select>
                        </Form.Item>
                       </Col>
                   </Row> 
                   <Row>
                   <Col span={24} align="center" >
                       <Button onClick={this.onPayClicked}>Pay</Button>
                   </Col>
               </Row>
               </Form>
           </div>
          
         )
    }
    

   





   
}




export default PaymentForm