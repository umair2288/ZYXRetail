import React, { Component } from 'react';
import { Row, Col , Select, Form, Button, Radio, Modal , message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import FormItem from 'antd/lib/form/FormItem';
import RadioGroup from 'antd/lib/radio/group';
import Axios from 'axios';
import keys from '../../../keys';

const {Option} = Select
const {confirm} = Modal

class CreateReturnOrder extends Component {
  
    state = {
        reason:null,
        desc : null,
        order_id : this.props.order_id,
        product_piece_id : this.props.product_piece_id,
        date : this.props.date,
        sales_person_vehicle_id : this.props.sales_person_vehicle.id,
        order_update_type : ""
    }

    options = ["Seased" , "Warranty Claim", "Broken" , "Inappropriate" , "Exchange" , "Other"]
    radio_options = [
        {   
            value : "REFUND",
            title : "Cancel Order (Refund)"
        }
        , 
        {
            value : "EXCHANGE ORDER",
            title:"Update Order (Exchange & Inappropite)"
        } 
        ,   
        {   
            value:"WARRANTY CLAIM" ,
            title:"No Updates (Repair & Warranty Claim)"
        }
    ]

    showConfirm = (state,props)=>{
        confirm({
            title : "Are you sure you need to place a return order?",
            content : "You have to perform relevent action on return order view after placing return",
            onOk(){  
                    const data = {
                        "return_order_type":state.reason,
                        "return_order_desc": state.desc,
                        "order": state.order_id,
                        "date": state.date,
                        "sales_person_vehicle":state.sales_person_vehicle_id,
                        "action" : state.order_update_type,
                        "product_piece": state.product_piece_id
                    }
                    console.log(data)
                    return Axios.post(`${keys.server}/sales/returnorder/create`,data
                    )
                .then(
                    response => {      
                        message.success("Return order created successfuly!")   
                        props.goToFirstStep()
                    }
                )
                .catch(
                    err => {
                        console.error(err)
                    }
                )
            },
            onCancel(){
                console.log("Cancel Clicked")
            }

        })
    }

    handleSubmit = (e)=>{
        e.preventDefault()
        this.showConfirm(this.state, this.props)
    }


    render() { 
        return ( 
        <Row>
            <Form onSubmit={this.handleSubmit}>
            <Row>
                <Col span={24}>
                    Product Piece Details
                </Col>
            </Row>
            <Row>
                <FormItem required label="Select Return Order Type">
                    <Select required onChange={v=>this.setState({reason:v})}  value={this.state.reason} style={{width:"200px"}}>
                        {this.options.map(
                            (option,index) => <Option key={index} value={option}>{option}</Option>
                        )
                        }
                    </Select>
                </FormItem>
            </Row>
            <Row>
                <Col span={24}>
                    <FormItem label="Give a brief description about this return">
                        <TextArea style={{height:"150px"}} value={this.state.desc} onChange={e=>this.setState({desc:e.target.value})}></TextArea>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <RadioGroup  value={this.state.order_update_type} onChange={e=>this.setState({order_update_type:e.target.value})}>
                    {this.radio_options.map(
                        rb =>  <Radio value={rb.value} >{rb.title}</Radio>
                    )}
                </RadioGroup>
            </Row>
            <Row>
                <Col offset={20} span={4}>
                    <Button htmlType="submit">Create Return Order</Button>
                </Col>
            </Row>
            </Form>
            {/* <Modal
                title="Update Order"
                visible={true}
                
            >
                <UpdateOrder></UpdateOrder>

            </Modal> */}
        </Row> 
        
        );
    }
}
 
export default CreateReturnOrder;