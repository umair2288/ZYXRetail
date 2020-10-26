import React , {Component} from 'react'
import {Row ,Form , Input , Col} from 'antd'
//import customerStore from '../../store/CustomerStore'

class CollectAddress extends Component{

   

    

    handleChange = (event) =>{
        const id = event.target.id
        var state = {...this.props.prevState}
        switch(id){
            case "register_address_no":{         
                state.contact.Address.No = event.target.value
                this.props.updateState(state)
                break;
            }
            case "register_street":{
             
                state.contact.Address.Street = event.target.value
                this.props.updateState(state)
                break;
            }
            case "register_town":{
                state.contact.Address.Town = event.target.value
                this.props.updateState(state)
                break;
            }
            case "register_district":{
             
                state.contact.Address.District = event.target.value
                this.props.updateState(state)
                break;
            }
            case "register_gn_division":{
                state.contact.Address.GSDivision = event.target.value
                this.props.updateState(state)
                break;
            }     
            case "register_ds_division":{
                state.contact.Address.DSDivision = event.target.value
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
            <h4>Address</h4>
            <Row gutter={20}>
                        <Col span={6}>
                            <Form.Item label="No">
                                {getFieldDecorator('address_no', {
                                    rules: [{ required: true, message: 'Please Provide a Contact Number' }],
                                })(<Input  onChange={this.handleChange}/>)}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                        <Form.Item label="Street">
                            {getFieldDecorator('street', {
                                rules: [{ required: false, message: 'Please input the title of collection!' }],
                            })(<Input onChange={this.handleChange}/>)}
                        </Form.Item>
                        </Col>
                        <Col span={6}>
                        <Form.Item label="Town">
                            {getFieldDecorator('town', {
                                rules: [{ required: false, message: 'Please input the title of collection!' }],
                            })(<Input onChange={this.handleChange}/>)}
                        </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                    <Col span={6}>
                        <Form.Item label="District">
                            {getFieldDecorator('district', {
                                rules: [{ required: true, message: 'Please Provide a Contact Number' }],
                            })(<Input  onChange={this.handleChange}/>)}
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                    <Form.Item label="GN Division">
                        {getFieldDecorator('gn_division', {
                            rules: [{ required: false, message: 'Please input the title of collection!' }],
                        })(<Input onChange={this.handleChange}/>)}
                    </Form.Item>
                    </Col>
                    <Col span={6}>
                    <Form.Item label="DS Division">
                        {getFieldDecorator('ds_division', {
                            rules: [{ required: false, message: 'Please input the title of collection!' }],
                        })(<Input onChange={this.handleChange}/>)}
                    </Form.Item>
                    </Col>
                </Row>
                </div>
        )
    }

}


 export default CollectAddress