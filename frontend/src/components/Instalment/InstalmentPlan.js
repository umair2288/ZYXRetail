import React,{Component} from 'react'
import instalmentStore from './../../store/InstalmentStore'
import {Col, Row, Table} from 'antd'
import Axios from 'axios'
import keys from '../../keys'

class InstalmentPlan extends Component{

  
   state = {
        loading: false,
        "data":{
            instalment_terms:[]
        }
    }

    componentDidMount(){
        console.log(this.props)
           
       if(instalmentStore.getInstalmePlanById(this.props.match.planId).length > 0 ){
            let data = instalmentStore.getInstalmePlanById(this.props.match.planId).pop()
            this.setState(
                {
                 data:data
                }
                , ()=> console.log(this.state)
            )
       }else{
            Axios.get(`${keys.server}/instalments/plan/${this.props.match.params.planId}`)
            .then(
                (response) => {
                    const data = response.data.pop()
                    this.setState(
                        {
                         data:{
                             instalment_plan: data,
                             instalment_terms: data.instalment_terms
                         }
                        }
                        , ()=> console.log(this.state)
                    )

                }
            )
            .catch(
                err => {
                    console.log(err)
                }
            )
       }

       
         
    }


    formatData =() =>{
       
       let today = new Date()
       console.log(this.state)
       let data =  this.state.data.instalment_terms.map(
            (term) =>{
              let  due_date = new Date(term.due_date)
              console.log(due_date)
             return   {
                    key: term.id,
                    dueDate : due_date.getDate() + "-" + (due_date.getMonth()+1) + "-" + due_date.getFullYear() ,
                    amount : term.due_amount,
                    paymentStatus : term.is_paid ? "Paid" : (due_date > today ? "Not Paid" : "Over Due")
             }
            }
        )
        return data
    }



    columns = [
        {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
          },   
          
          {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
          },  

          {
            title: 'Payment Status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
          },   



    ]    

       

    render(){
        return(
            <div>
                <Row type="flex" justify="center">
                    <Col span={4} >
                       <h1> Intalment Plan </h1>                                          
                    </Col>
                </Row>
                
                <Table columns={this.columns}   dataSource={this.formatData()} size="small" /> 
            </div> 

            
        )
    }

}


export default InstalmentPlan