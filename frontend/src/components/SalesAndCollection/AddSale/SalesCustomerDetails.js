import React , {Component} from 'react'
import {Form, Input , Row, Col , Button, message , Select, Divider}  from 'antd'
import SalesDetails from './SalesDetails'
import keys from '../../../keys'
import CustomerDetails from '../../ViewCustomers/CustomerDetails'
import Axios from 'axios'
//import CustomerDetails from "../ViewCustomers/CustomerDetails"
//import ProductPieceDetails from '../Products/ProductPieceDetails'

const {Option} = Select

class SalesCustomerDetails extends Component{

   state = {
      //  NIC: "",//this.props.match.params.NIC,
        customer_NIC : this.props.customerNIC  ,
        guarentor_NIC : null,
        customer : this.props.customer,
        guarentor : this.props.guarentor
   }


   onVerifyClicked = (type) =>{
       console.log("veriy clicked")
     
       if(this.state.customer_NIC === this.state.guarentor_NIC){
           message.error("Customer and Guarentor should be different customers");
           return
       }

       var instance = Axios.create({
        baseURL: `${keys.server}/user/get-customer/sales-profile`,
        timeout: 3000,
        // headers: { Authorization : `Token ${token}`}
      })

       instance.get(null,{params:{
        NIC: type === "customer" ? this.state.customer_NIC : this.state.guarentor_NIC
       }})
       .then(
           result => {
               if(result.data.success){
                  {
                        this.setState({
                            [type]:result.data.data
                        }, () => console.log(this.state))
                   }
                   
               }else{
                   message.error(result.data.message)
               }
           }
       )
       .catch(
           err => {
               console.log(err)
               message.error("Oops! Something bad happened!")
           }
       )
   }

   onConfirmCustomerClicked = () =>{
    this.props.updateCustomer(this.state.customer)
    this.props.updateGuarentor(this.state.guarentor)
    this.props.nextStep()
}

    handleCustomerNICChange = (e)=>{
        this.setState({customer_NIC:e.target.value , customer:null})
    }


    render(){
      return (      
        <div>
            <Row gutter={10}>
                <Col span={10}> 
                    <Col span={8}>
                       Customer NIC
                    </Col>
                    <Col span={16}>
                        <Input value={this.state.customer_NIC} onChange={this.handleCustomerNICChange} placeholder="Customer NIC"></Input> 
                    </Col>                 
                </Col>
                <Col span={2}>
                    <Button onClick={() => this.onVerifyClicked("customer")}> Verify</Button>
                </Col>
                <Col span={10}> 
                    <Col span={8}>
                        Guarentor NIC
                    </Col>
                    <Col span={16}>
                        <Input value={this.state.guarentor_NIC} onChange={e => this.setState({guarentor_NIC:e.target.value})} placeholder="Guarentor NIC"></Input> 
                    </Col>                 
                </Col>
                <Col span={2}>
                    <Button onClick={() => this.onVerifyClicked("guarentor")}> Verify</Button>
                </Col>
            </Row>
            <Divider > Customer</Divider>
            <Row style={{padding:"20px"}} gutter={10}>
               <Col span={24}>
                 {this.state.customer && <CustomerDetails {...this.state.customer}></CustomerDetails>}  
               </Col>
            </Row>
            <Divider > Guarentor</Divider>
            <Row style={{padding:"20px"}} gutter={10}>
               <Col span={24}>
                 {this.state.guarentor && <CustomerDetails {...this.state.guarentor}></CustomerDetails>}  
               </Col>
            </Row>
            <Row style={{padding:"20px"}} gutter={10}>
               <Col offset={16} span={84}>
                 <Button disabled={!this.state.customer} type="primary" onClick={this.onConfirmCustomerClicked}>Confirm Customer</Button>
               </Col>
            </Row>
            
        </div> 
        )
    }
}


export default SalesCustomerDetails;