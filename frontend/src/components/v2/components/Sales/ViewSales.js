import React, { Component } from 'react';
import { Table, message, Tag } from 'antd';
import axios from 'axios'
import keys from '../../../../keys';


class ViewSales extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            loading : false,   
            pagination:{
                total: null,
                current : 0 ,
                pageSize : 6
            }
           
         }
    }

    fetchData = (pagination) =>{
        this.setState({
            loading:true
        })
        axios.get(`${keys.server}/sales/rm/orders/detailed` , {params:{invoice:"all" , ...pagination }})
        .then(
            response => {
                const  data = response.data.results
                const pagination = {...this.state.pagination}
                pagination.total = response.data.count
                
                console.log(response)

                this.setState({
                    data:data,
                    loading:false,
                    pagination:pagination
                } , () => console.log(this.state))
                
            }
        )
        .catch(err =>{
            message.error(err.message)
            console.error(err)
            this.setState({
                loading:false
            })
        })
    }

    componentDidMount(){
        this.fetchData({limit:this.state.pagination.pageSize})
    }

    onTableChange = (pagination) =>{
  
        this.setState({
            pagination:pagination
        }
        ,
        () =>{
            this.fetchData({
                offset: (pagination.current-1)*pagination.pageSize,
                limit: pagination.pageSize
            })
        }
        )
    }




    columns = [
        {
            title: 'Invoice',
            dataIndex: 'invoice_no',
            key: 'invoice',
    
          },   
          
          {
            title: 'Product ID',
            dataIndex: 'order_lines',
            key: 'productId',
            render : (orderlines) => orderlines.map((ol) => <Tag color="green">{ol.product.item_code}</Tag>)
          },       
          {
            title: 'Customer NIC',
            dataIndex: 'customer',
            key: 'customer_nic',
            render : (customer) => customer.NIC
          },  

          {
            title: 'Payment Status',
            dataIndex: 'payment_status',
            key: 'paymentStatus',
          },   
        //   {
        //     title: '',
        //     dataIndex: 'instalment_plan_id',
        //     key: 'instalment_plan_id',
        //     render: id => <Button type="primary" icon="user" onClick={(e) => this.props.handleViewInstalmentPlan(e.target.id)} id={id}>Instalment Plan</Button>,
        //   }

    ]    



    render() { 
        return ( <Table
            rowKey={(row=>row.invoice_no)}
            columns = {this.columns}
            dataSource = {this.state.data}
            onChange = {this.onTableChange}
            pagination={this.state.pagination}
        />);
    }
}
 
export default ViewSales;