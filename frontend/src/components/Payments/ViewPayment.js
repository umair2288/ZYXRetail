import React, {Component} from 'react'
import * as titleActions from '../../Actions/TitleActions'
import paymentStore from '../../store/PaymentStore'
import { Table } from 'antd'


class ViewPayments extends Component {

    state = {

    }

    componentDidMount(){
        titleActions.changeTitle("View Payments")
        paymentStore.fetchPayments(
            ()=>{
                console.log("payment fetching success")
                this.setState({
                    tableData: this.formatTableData()
                }, ()=>console.log(this.state))
            }
        ,
            ()=> console.error("payment fetching failed")
        )
       
    }

    formatTableData = () => {
        return paymentStore.paymentStore.map(
            (payment) => {
             return   {
                key: payment.id,
                invoice: payment.order.invoice_no,
                payment_type: payment.payment_type,
                amount:payment.payment,
                date:payment.date.substring(0,10)
                }
            }
        )
    }



    columns = [
        {
            title: 'Invoice',
            dataIndex: 'invoice',
            key: 'invoice',
       //    ...this.getColumnSearchProps('invoice')
          }
          ,

        {
            title: 'Payment Type',
            dataIndex: 'payment_type',
            key: 'payment_type',
          //  ...this.getColumnSearchProps('customer_nic')
    
          },
          {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
           
    
          }
        ,
          {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',   
          },
         
        
        ]

    render(){
        return (
            <div>
            
            <Table columns={this.columns} pagination={{ pageSize: 10 }}  dataSource={this.state.tableData} size="small" /> 
    
            </div>
        )
    }

}

export default ViewPayments