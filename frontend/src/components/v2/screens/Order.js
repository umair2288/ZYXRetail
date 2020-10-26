import React, { Component } from 'react';
import {  Row , Select , Col , Alert, message, Button} from 'antd';
import TopNavBar from '../components/TopNavBar';
import OrderDetails from '../../SalesAndCollection/AddCollection.js/OrderDetails';
import axios from 'axios'
import keys from '../../../keys';


const {Option} =  Select

class Order extends Component {

    state ={
        invoice_no:null,
        id : this.props.match.params.invoice_id,
        customer : null
    }
    
    fetchOrder = (id,fetchData)=>{
        axios.get(`${keys.server}/sales/order/update/${this.state.id}`)
        .then(
            response => {
                console.log(response.data)
                this.setState({
                    invoice_no : response.data.invoice_no,
                    id:response.data.id,
                    customer : response.data.customer
                },
                () => fetchData(this.state.invoice_no)    
                )
            }
        )
        .catch(
            error => {
                message.error("Failed to get invoice")
            }
        )
       
    }

    // componentDidMount(){
        
    //    this.fetchOrder(this.props.match.params.invoice_id,)
    // }

    

    navigate = (link) =>{
        this.props.history.push(link)
    }

    viewCustomerClicked = ()=>{
        if(this.state.customer){
            this.navigate(`/customers/${this.state.customer}`)
        }
    }
   
    render() { 
        return ( 
            <>
            <TopNavBar navigate={this.navigate} title={"Order"}/>
            <Row style={{paddingTop:20}}>
                <Col offset={1} span={22}>
                        <OrderDetails  
                            invoice_no={this.state.invoice_no}
                            order_id = {this.state.order_id}
                            viewOnly={true}
                            fetchOrder = {this.fetchOrder}
                            extraComponent = { <> 
                                <Button onClick={this.viewCustomerClicked} block size="large"> View Customer</Button>
                            </>}
                        />
                </Col>
            </Row>
            </>
         );
    }
}
 
export default Order;