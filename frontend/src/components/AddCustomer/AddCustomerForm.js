import React,{Component} from 'react'
import {Form } from 'antd'
import CollectContact from './CollectContactForm_subcomponent'
import * as titleActions from '../../Actions/TitleActions'
import VerifyNIC from './VerifyNIC'



class AddCustomerForm extends Component{

    constructor(){
        super();
        this.state={
            "Customer":{
                "firstName" : "",
                "lastName" : ""
            }
        }
    }

    handleNameChange = () =>{
        this.setState(
            {
                "Customer":{
                    "firstName" : this.props.value,
                    "lastName" : ""
                }
            })
    }

    componentDidMount(){
        titleActions.changeTitle("Add Customer")
    }

   
    render(){
       
        return (
            <div>
                <Form>
                    <VerifyNIC form={this.props.form} callback={this.props.callback} prevState={this.props.prevState} updateState={this.props.updateState} />   
                    <CollectContact form={this.props.form} callback={this.props.callback} prevState={this.props.prevState} updateState={this.props.updateState} ></CollectContact>
                   
                   {/* <div style={{"textAlign":"Right",'paddingRight':'250px', "backgroundColor":"gray"}}> <Button>Add Customer</Button> </div> */}
                </Form>
            </div>
        )
    }


}


export default AddCustomerForm