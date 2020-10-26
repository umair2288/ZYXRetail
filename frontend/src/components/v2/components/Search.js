import React, { Component } from 'react';
import {Select , Row ,Col , Button, message, Descriptions} from 'antd'
import axios from 'axios'
import keys from '../../../keys';

const {Option} = Select



class Search extends Component {

    state = {
        data : []
    }

    fetchData = (searchString)=>{
        axios.get(`${keys.server}/sales/orders/`,{params:{"search":searchString , "limit":5}})
        .then(
            response => {
                const data  = response.data.results
                this.setState({
                    data : data
                })
            }
        )
        .catch(
            err => {
                console.error(err)
                message.error(err.message)
            }
        )
    }

    handleSearch = (value) =>{
        this.fetchData(value)
    }

    handleChange = (id) => {
        console.log(id)
        this.props.onValueChange(id)
    }

    
    render() { 
    const options = this.state.data.map( order => (<Option value={order.id}>  
        <Descriptions layout="vertical" title={order.invoice_no} size="small" >
            <Descriptions.Item  label="Customer NIC">
                {order.customer.NIC}
            </Descriptions.Item>
            <Descriptions.Item label="Customer Name">
                {order.customer.name}
            </Descriptions.Item>
        </Descriptions>
        
        </Option>) )
            
        return ( 
        <Row gutter={10}>
            <Col style={{height:"47.5px" }} span={20}>
                <Select 
                    icon="search"
                    style={{width:"100%" , transform: "translateY(-50%)",top:"50%" , position:"relative"}}
                    showSearch={true}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={this.handleSearch}
                    onChange={this.handleChange}
                    notFoundContent={null}
                    placeholder="Search Customer / Invoice"
                >
                    {options}
                </Select>
            </Col>
            <Col style={{height:"47.5px" }} span={4}>
                <Button style={{transform: "translateY(-50%)",top:"50%" , position:"relative"}} type="primary" block icon="search"></Button>
            </Col> 
        </Row>
    )
        }
    
}
 
export default Search;








