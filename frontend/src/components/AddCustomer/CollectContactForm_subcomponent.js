import React , {Component} from 'react'
import {Row ,Form , Input , Col , Divider} from 'antd'
import CollectAddress from './CollectAddressForm_subcomponent'


class CollectContact extends Component{

    


    handleChange = (event) =>{
        const id = event.target.id
        var state = {...this.props.prevState}
        switch(id){
            case "register_firstname":{         
                state.contact.FirstName = event.target.value
                this.props.updateState(state)
                break;
            }
            case "register_lastname":{
             
                state.contact.LastName = event.target.value
                this.props.updateState(state)
                break;
            }
            case "register_preferedname":{
                state.contact.PreferedName = event.target.value
                this.props.updateState(state)
                break;
            }
            case "register_mobile_number":{
             
                state.contact.MobileNo = event.target.value
                this.props.updateState(state)
                break;
            }
            case "register_phone_number":{
                state.contact.ContactNo = event.target.value
                this.props.updateState(state)
                break;
            }     
            default:{
                //default case
            }
        }
    
    
    }

    

    render(){
       
        const { getFieldDecorator} = this.props.form;
       
        return(
            <div>
           
            <Divider />
            <h4> Personal Details</h4>
            <Row gutter={20}>
                        <Col span={6}>
                            <Form.Item label="Firstname">
                                {getFieldDecorator('firstname', {
                                    rules: [{ required: true, message: 'Firstname is required' }],
                                })(<Input  onChange={this.handleChange}/>)}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Lastname">
                                {getFieldDecorator('lastname', {
                                    rules: [{ required: true, message: 'Lastname is Requier' }],
                                })(<Input onChange={this.handleChange} />)}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Prefered Name">
                                {getFieldDecorator('preferedname', {
                                    rules: [{ required: false, message: 'Please provide a prefered name' }],
                                })(<Input onChange={this.handleChange} />)}
                            </Form.Item>
                        </Col>           
                    </Row>
                    <Row gutter={20}>
                        <Col span={6}>
                            <Form.Item label="Contact No">
                                {getFieldDecorator('phone_number', {
                                    rules: [{ required: true, message: 'Please Provide a Contact Number' }],
                                })(<Input  onChange={this.handleChange}/>)}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                        <Form.Item label="Mobile">
                            {getFieldDecorator('mobile_number', {
                                rules: [{ required: false, message: 'Please input the title of collection!' }],
                            })(<Input onChange={this.handleChange}/>)}
                        </Form.Item>
                        </Col>
                    </Row>
                    <Divider/>                   
                    <CollectAddress form={this.props.form} callback={this.props.callback} prevState={this.props.prevState} updateState={this.props.updateState} ></CollectAddress>    
                </div>
        )
    }

}


 export default CollectContact