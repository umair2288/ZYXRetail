import React ,{Component} from 'react'
import { Row , Input , Col, Form, Button, Table, message} from 'antd'
import Axios from 'axios'
import keys from '../../../keys'


class Cart extends Component{

    state = {
        product_piece: "",
        order_lines:this.props.orderlines ,
        is_empty : this.props.orderlines.length? false : true
    }

  
    _checkForDuplicates = ()=>{
        if(this.state.order_lines.filter( pp => pp.item_code === this.state.product_piece).length > 0) {
            return true
        }
    }


    handleAddProductPiece = e => {
        e.preventDefault()

        if(this._checkForDuplicates()){
            message.error("You can't add same product again")
            return 
        }

        Axios.get(
            `${keys.server}/warehouse/productpieces/${this.state.product_piece.replace('/','%2F')}`
        )
        .then(
            result => {
                const ol = this.state.order_lines;
                ol.push(result.data)
                this.setState(
                    {order_lines: ol , is_empty:false , product_piece:""} , () => 
                    {
                        console.log(this.state)
                        message.success("success")
                       
                    }
                )
            }
        )
        .catch(
            err => {
                console.log(err)
                message.error("It's seems like item code is wrong or product piece is sold!")
            }
        )
        //check for product peiece avalablity
        //add to orderlines
    }

    orderline_columns = [
        {
            key : 1,
            dataIndex : "item_code",
            title : "Item Code"
        }
        ,
        {
            key : 1,
            dataIndex : "price",
            title : "Price"
        }
    ]

    
    onCheckoutClicked = () => {
        const total_bill = this.state.order_lines.reduce((sum , value) => sum + parseFloat(value.sell_price) , 0)
        this.props.updateOrderLines(this.state.order_lines , total_bill)
    }


    render(){
        console.log(this.props)
        const orderlines = this.state.order_lines.map( ol => ({ key: ol.id , item_code : ol.item_code , price : ol.sell_price  }))
        const total_bill = this.state.order_lines.reduce((sum , value) => sum + parseFloat(value.sell_price) , 0)
    
        return(
            <div>
                <Row style={{padding:"20px"}} gutter={16}>
                    <Form onSubmit={this.handleAddProductPiece}>
                        <Col span={4}>                  
                            <Input 
                                required
                                placeholder={"Product ID"} 
                                value={this.state.product_piece} 
                                onChange={e => this.setState({product_piece:e.target.value})}>
                            </Input>       
                        </Col>
                        <Col span={6}>          
                            <Button htmlType="submit"> Add Product Piece</Button>   
                        </Col>
                        <Col offset={10} span={4}>          
                            <Button type="danger"  onClick={()=>this.setState({is_empty:true , order_lines:[]})}> Clear Cart</Button>   
                        </Col>           
                    </Form>
                </Row>
                <Row style={{padding:"20px"}} gutter={[16,16]}>
                    <Table 
                        pagination={false} 
                        columns={this.orderline_columns} 
                        dataSource={orderlines}
                        footer = {()=>
                            <Row>
                                <Col span={12}>
                                <div 
                                    style={{"fontSize":22}}> Total Bill : Rs.{total_bill}
                                </div> 
                                </Col>
                                <Col  offset={6} span={6}>          
                                        <Button 
                                            disabled={this.state.is_empty} 
                                            onClick={this.onCheckoutClicked} 
                                            block
                                            size="large"
                                            // style={{width:"220px"}} 
                                            type="primary" 
                                            htmlType="submit"> 
                                        Checkout
                                        </Button>   
                                </Col>
                            </Row>
                            }
                        >
                        </Table>
                </Row>
                {/* <Row  style={{padding:"20px" , backgroundColor:"#F6F6F6"}} gutter={[16,16]}>
                    <Col offset={15} span={8}>            
                        <div style={{"fontSize":28}}> Total Bill : Rs.{total_bill}</div>   
                    </Col>   
                </Row> */}
                {/* <Row>
                    <Col  style={{padding:"20px"}} offset={15} span={5}>          
                        <Button disabled={this.state.is_empty} onClick={this.onCheckoutClicked} style={{width:"220px"}} type="primary" htmlType="submit"> Checkout</Button>   
                    </Col>
                </Row> */}
            </div>

        ) 
    }
}

export default Cart