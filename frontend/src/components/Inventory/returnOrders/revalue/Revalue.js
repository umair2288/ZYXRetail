import React, { Component } from 'react';
import { Divider, message, Spin, Row, Input , Col, InputNumber, Select} from 'antd';
import Axios from 'axios';
import keys from '../../../../keys';

const {Option} = Select

class Revalue extends Component {
    
    state = {
        loading:true,
        product_piece:null,
        new_warehouse : null,
        revalued_price : null,
        warehouse_options : []
    }

    fetchProductPiece = ()=>{
        this.setState({loading:true})
        Axios.get(
            `${keys.server}/warehouse/productpieces/v2/${this.props.product_piece_id}`
        )
        .then(
            response => {
              this.setState({
                  product_piece : response.data,
                  loading:false
              })
            }
        )
        .catch(
            err => {
                console.error(err)
                message.error("Something went wrong")
                this.setState({loading:false})
            }
        )
    }

    fetchWarehouses = ()=>{
            Axios.get(`${keys.server}/warehouse/warehouses`)
            .then(
                result => {
                    this.setWarehouseOptions(result.data.filter(wh => wh.entity === "ROYALMARKETING"))
                }
            )
            .catch(
                err => {
                    message.error("Loading warehouses failed")
                    console.error(err)
                }
            )
    }


    setWarehouseOptions = (data) =>{
        this.setState(
            {
                warehouse_options: data
            },() => console.log(this.state)
        )
    }

    componentDidMount(){
        this.fetchProductPiece()
        this.fetchWarehouses()
    }

    componentWillUnmount(){
        this.props.updateParentComp(this.state.new_warehouse , this.state.revalued_price , this.state.product_piece.sell_price)    
    }

    handleRevaluedPriceChange = (v)=> {
        this.setState({
            revalued_price : v
        }
        , () => {
            this.props.updateParentComp(this.state.new_warehouse , this.state.revalued_price , this.state.product_piece.sell_price)    
        })
       
    }

    handleWarehouseChange = (v)=> {
        this.setState({
            new_warehouse : v
        }
        , () => {
            this.props.updateParentComp(this.state.new_warehouse , this.state.revalued_price , this.state.product_piece.sell_price)    
        })
       
    }


    render() { 
       
        
        return ( 
        <>
            <Spin spinning={this.state.loading}>
                <h2>Item Code : { this.state.product_piece && this.state.product_piece.item_code} </h2>
                <h3>Current Price : { this.state.product_piece && this.state.product_piece.sell_price}</h3>
                <Divider></Divider>
         
                <Row style={{margin:"10px"}}>
                    <Col span={8}> Revalued Price :</Col>
                    <Col span={16}> <InputNumber style={{width:"200px"}} min={0} step={0.01} value={this.state.revalued_price} onChange={this.handleRevaluedPriceChange}></InputNumber></Col>
                </Row>
                <Row style={{margin:"10px"}}>
                    <Col span={8}> Warehouse :</Col>
                    <Col span={16}> 
                        <Select value={this.state.new_warehouse} style={{width:"200px"}} onChange={this.handleWarehouseChange}>
                            {this.state.warehouse_options.map(
                                (warehouse) => <Option key={warehouse.id} value={warehouse.id}>{warehouse.title}</Option>
                            )}
                        </Select>
                    </Col>
                </Row>
          
            </Spin>
        </> );
    }
}
 
export default Revalue;