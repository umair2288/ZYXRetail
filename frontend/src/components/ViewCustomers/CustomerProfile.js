import React, { Component } from 'react'
import {Col , Row , Divider, Button} from 'antd'
import customerStore from '../../store/CustomerStore'
import CustomerDetails from './CustomerDetails'
import ProductList from './ProductList'



class CustomerProfile extends Component{

    state = {
        "is_edit_mode" : false,
        "avatar" : 'img/man.svg',
        "data": customerStore.getCustomer(this.props.CustomerID).pop()
   
        }
    

    render(){
        console.log(this.state)    
        return(
            <div>
                <CustomerDetails {...this.state.data}/>
                    <Divider></Divider>
                <Row>
                    <ProductList {...this.props} CustomerID = {this.state.data.id}/>
                </Row>
                <Row style={{padding:"10px 0px"}} >
                    <Col  span={3}> <Button  type="danger" ghost>Edit</Button></Col>
                    <Col   span={3}> <Button type="danger" >Delete</Button></Col>
                </Row>

            </div>
           
        )
        
        
    }

}

export default CustomerProfile;