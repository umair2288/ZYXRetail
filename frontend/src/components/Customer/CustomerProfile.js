import React , {Component} from 'react'
import { Modal, Input, message, Alert, Col, Row, Divider } from 'antd'
import FormItem from 'antd/lib/form/FormItem'
import Axios from 'axios'
import keys from '../../keys'
import CustomerDetails from '../ViewCustomers/CustomerDetails'
import * as titleActions from '../../Actions/TitleActions'
import SalesTable from '../ViewSales/SalesTable'



class CustomerProfile extends Component{


    state = {
        show_get_nic_modal : false,
        modal_nic : "952413147V"
    }

    _show_get_nic_modal = () =>{
        this.setState({show_get_nic_modal:true})
    }
    _close_get_nic_modal = () =>{
        this.setState({show_get_nic_modal:false})
    }


    handleChange = (name , value) =>{
        switch(name){
            case "NIC":{
                this.setState(
                   { modal_nic:value}
                )
                break;
            }
            default:{
                console.error("Default case encoutered")
            }
        }
    }


    handleOk = () => {
    
        Axios.get(
            `${keys.server}/user/get-customer/sales-profile?NIC=${this.state.modal_nic}` 
        )
        .then(
            result => {
                if(result.data.success){
                    this.setState({
                        customer:result.data.data,
                        show_get_nic_modal:false
                    })
                }else{
                    message.error(result.data.message)
                }
                
            }
        )
    }

    componentDidMount(){

        titleActions.changeTitle("Customer Profile")
       if(!this.props.match.params.id){
         this._show_get_nic_modal()
       }
    }


    render(){
        return (
        <div>
            {this.state.customer&&
            <div> 
                <Row>
                    <Col style={{backgroundColor:"#F2F2F2" , padding:10 , }} span={16}>
                        <CustomerDetails {...this.state.customer}></CustomerDetails>
                    </Col>
                    <Col span={8}>

                    </Col>
                </Row>
                <Divider type="horizontal"  > Orders</Divider>
                <Row>
                    <SalesTable customer_id={this.state.customer.id}></SalesTable>
                </Row>             
            </div>
            
            
            }


            <Modal
                title = "Customer Profile"
                visible = {this.state.show_get_nic_modal}
                onCancel = {this._close_get_nic_modal}
                onOk = {this.handleOk}
            >
                <FormItem label="Customer NIC">
                    <Input name="NIC" onChange = {(e) => this.handleChange("NIC", e.target.value)} value={this.state.modal_nic}></Input>
                </FormItem>

            </Modal>


        </div>


        )

    }
}

export default CustomerProfile