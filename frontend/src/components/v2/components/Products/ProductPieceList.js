import React, { Component } from 'react';
import { Table, message, Row, Tag } from 'antd';
import axios from 'axios'
import keys from '../../../../keys';

class ProductPieceList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            data : [],
            loading : false,
            pagination:{
                total:0,
                pageSize:5,
                current:1
            }
         }
    }

    fetchData = (params) => {
        this.setState({
            loading:true
        })
        axios.get(`${keys.server}/warehouse/productpieces`,{params:params})
        .then(
            response => {
                const data = response.data.results
                const pagination = this.state.pagination
                pagination.total = response.data.count
                this.setState({
                    data:data,
                    pagination: pagination,
                    loading:false
                }, () => console.log(this.state.data))
            }
        )
        .catch(
            err => {
                console.error(err)
                message.error(err.message)
                this.setState({
                    loading:false
                })
            }
        )
    }
    

    componentDidMount(){
        this.fetchData({limit:this.state.pagination.pageSize , batch:this.props.batch})
    }
        
    
    onTableChange = pagination => {
        const {current , pageSize} = pagination
        this.setState({
            pagination: pagination
        },
        ()=>this.fetchData({offset:(current-1)*pageSize ,limit:pageSize,batch:this.props.batch}))
        
    }


    render() { 
        const columns = [
            {key:"item_code",dataIndex:"item_code",title:"Item Code" , width:"120px"},
            {key:"cost_price",dataIndex:"cost_price",title:"Cost Price" , width:"120px"},
            {key:"sell_price",dataIndex:"sell_price",title:"Sell Price" , width:"120px"},
            {key:"is_sold",dataIndex:"is_sold",title:"status",render : (is_sold)=><Tag color={is_sold?"green":"red"}>{is_sold?"Sold":"Unsold"}</Tag>},
        ]
        return ( 
         <Row>   
            <Table scroll={{y:300}} columns={columns} onChange={this.onTableChange} pagination={this.state.pagination} dataSource={this.state.data} size="small" />
        </Row>
        );
    }
}
 
export default ProductPieceList;