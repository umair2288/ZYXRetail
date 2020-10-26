import React, { Component } from 'react';
import { Col , Row , Input, Button, message, Divider, Table } from 'antd';
import axios from 'axios'
import keys from '../../../keys';
import CustomerDetails from '../../ViewCustomers/CustomerDetails';


class OrderDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invoice_no:null,
            order : null
          }
    }

    handleClick = () => {
    
      axios.get(`${keys.server}/sales/get-orders/royalmarketing/`, {params:{invoice:this.state.invoice_no}})
      .then(
          response => {
            console.log(response.data)
            if(response.data.success){
                if (!response.data.data.is_canceled){
                    this.setState({
                        order:response.data.data
                    })
                }else{
                    message.error("This order already cancelled. Please check on  view return orders")
                }
                
            }else{
                message.error(response.data.message)
                this.setState({
                    order:null
                })
            }
            
          }
      )
      .catch(
          (err) => {
            console.error(err);
            this.setState({
                order:null
            })
          }
      )

    }

    columns = [
        {
            key:1,
            dataIndex : "item_code" ,
            title : "Item Code" , 
        },
        {
            key:2,
            dataIndex : "product" ,
            title : "product" , 
        }
        ,
        {
            key:3,
            dataIndex : "unit_price" ,
            title : "Unit Price" , 
        }
        ,
        {
            key:3,
            dataIndex : "returnOrderDetail" ,
            title : "Unit Price" , 
            render : d => <Button type="danger" onClick={()=>this.handleReturnOrder(d)}> Create Return Order</Button>
        }
        ,
    ]

    handleReturnOrder = (obj)=>{
        this.props.createReturnOrder( obj.order_id ,  obj.product_piece_id )
    }

    formatTableData = ()=>{
        if(this.state.order){
            const order_lines = this.state.order.order_lines
            const data = order_lines.map(
                (ol) => {
                    return {
                        item_code : ol.product.item_code,
                        product : ol.product.batch.product.title,
                        unit_price : "Rs." + ol.unit_price,
                        returnOrderDetail : {
                            order_id : this.state.order.id,
                            product_piece_id : ol.product.id
                        }
                    }
                }
          
            )
            return data
        }
    }



    render() { 
        return ( 
            <Row   >
                <Row gutter={10}>
                    <Col span={12}>
                        <Col span={8}>
                            Invoice No
                        </Col>
                        <Col span={8}>
                            <Input   value={this.state.invoice_no} onChange={e => this.setState({invoice_no:e.target.value})}></Input>
                        </Col>
                        <Col  span={8}>
                            <Button onClick={this.handleClick} disabled={!this.state.invoice_no} type="primary"> Search </Button>
                        </Col>
                    </Col>
                </Row>
                <Divider>Customer</Divider>
                <Row>
                    <Col span={24}>
                        {this.state.order && <CustomerDetails {...this.state.order.customer} ></CustomerDetails> }
                    </Col>
                </Row>
                <Divider>Order Details</Divider>
                <Row>
                    <Col span={24}>
                        {this.state.order && 
                        <div>
                          <Table columns={this.columns} dataSource={this.formatTableData()}></Table>  
                        </div> 
                        }
                    </Col>
                </Row>
            </Row>

            )
    }
}
 
export default OrderDetails;
