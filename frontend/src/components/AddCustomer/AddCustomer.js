import React,{Component} from 'react'
import {Row,Col,Button , Alert} from 'antd'
import AddCustomerForm from './AddCustomerForm'
import * as customerActions from '../../Actions/CustomerActions'
//mport customerStore from '../../store/CustomerStore'
//import Customer from '../../Classes/Customer'



class AddCustomer extends Component{

    constructor(){
        super()
        this.state = {
            "NIC": "",
            "DOB": null,
            "Gender": "",
            "User": null,
            "RegisteredByEmployee": null,
            "AlternativeContact": null,
            "Referee": null,
            "BillingAddress": null,
            "contact": {
                "FirstName": "",
                "LastName": "",
                "PreferedName": "",
                "ContactNo": "",
                "MobileNo": "",
                "Email": 'dummy@email.com',
                "Address": {
                    "No": "",
                    "Street": "",
                    "Town": "",
                    "District": "",
                    "GSDivision": null,
                    "DSDivision": null,
                    "Longitude": null,
                    "Latitude": null
                }
            }
           
        }
    }


    handleClick = ()=>{
        console.log(this.state)
        if( customerActions.addCustomer(this.state) ){
            console.log("customer added successfully")
        }else{
            console.error("customer adding failed")
            
            return <Alert type="error" message="Error text" banner />

        }
    }

    updateState = (newState) =>{
        
        this.setState(newState , () =>{
            console.log(this.state)
        })
    

    }


    render(){
        return (
        <div>
            <AddCustomerForm form={this.props.form} prevState={this.state} callback={this.updateState} updateState={this.updateState}></AddCustomerForm>
            <Row gutter={20}>
                <Col span={6} offset={15}>
                    <Button onClick={this.handleClick}>Add Customer</Button>
                </Col>
            </Row>
        </div>
        )
    }
}



export default AddCustomer
