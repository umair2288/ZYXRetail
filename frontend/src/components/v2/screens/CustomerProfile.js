import React, { Component } from 'react';
import {Row , Col, Descriptions, Button, Table, Switch, Tag} from 'antd'
import TopNavBar from '../components/TopNavBar'
import axios from 'axios'
import keys from '../../../keys'

class CustomerProfile extends Component {
   
    state = {
        customerData:null
        
    }

   getData = () =>{
        if (this.state.customerData){
            return this.state.customerData.orders
        }
        return []
    }

    componentDidMount(){
        console.log(this.props)
        this.fetchCustomerDetails(this.props.match.params.id)
    }

    fetchCustomerDetails = (id)=>{
        axios.get(`${keys.server}/user/customers/${id}`)
        .then(
            response => {
                console.log(response.data)
                this.setState({customerData:response.data})
            }
        )
        .catch(
            error => {

            }
        )
    }

    navigate = (link) =>{
        this.props.history.push(link)
    }

    currentPlanColumns = [
        {
            "key": 1,
            "dataIndex" : "invoice_no",
            "title": "Invoice No"
        }
        ,
        {
            "key": 2,
            "dataIndex" : "date",
            "title": "Sale Date"
        }
        ,
        {
            "key": 3,
            "dataIndex" : "total_bill",
            "title": "Total Bill"
        }
        , 
        {
            "key": 5,
            "dataIndex" : "discount",
            "title": "Discount"
        }
        ,
        
        {
            "key": 6,
            "dataIndex" : "net_payment",
            "title": "Net Payment"
        }
        ,
          
        {
            "key": 7,
            "dataIndex" : "order_type",
            "title": "Type"
        }
        ,
        {
            "key": 8,
            "dataIndex" : "id",
            "title": "",
            "render":(id) => <Button type="primary" onClick={() => this.navigateToOrder(id)}>View</Button>
        }
        
    ]

    navigateToOrder = (id) =>{
        this.props.history.push(`/sales/order/${id}`)
    }

    

    render() { 
    const   {customerData} = this.state
        return ( 
            <>
            <TopNavBar navigate={this.navigate} title={"Dashboard"}/>
            <Row  style={{paddingTop:"30px" }}>
                <Col 
                    offset={1}
                    span={5}
                    style = {{  backgroundColor:"white" , 
                                borderRadius:"15px" , 
                                boxShadow:"0px 4px 20px rgba(0, 0, 0, 0.25)",
                                textAlign:"center",
                                height:"500px"
                            }}
                    >
                <Row>
                   <img 
                    style={{height:"100px" }}
                    src="/img/man.svg" 
                    />
                </Row>
                    <Row style={{padding:"20px"}}>
                            <Descriptions  column={1} colon={false} >
                                <Descriptions.Item label="Name"> {customerData && `${customerData.contact.FirstName} ${customerData.contact.LastName}`}  </Descriptions.Item>
                                <Descriptions.Item label="Gender">  {customerData && `${customerData.Gender}`} </Descriptions.Item>
                                <Descriptions.Item label="NIC">  {customerData && `${customerData.NIC}`}</Descriptions.Item>
                                <Descriptions.Item label="Date of Birth">  {customerData && `${customerData.DOB}`}</Descriptions.Item>
                                <Descriptions.Item label="Address"> {customerData && `${customerData.contact.Address.No}, ${customerData.contact.Address.Street} , ${customerData.contact.Address.Town}. ${customerData.contact.Address.District}`}</Descriptions.Item>
                                <Descriptions.Item label="Contact No"> {customerData && `${customerData.contact.ContactNo}`}</Descriptions.Item>
                                <Descriptions.Item label="Mobile No"> {customerData && `${customerData.contact.MobileNo}`}</Descriptions.Item>
                                <Descriptions.Item label="Status"> <Tag  color="green">{customerData && customerData.isBlackListed? "Blocked" :"Active"}</Tag> </Descriptions.Item>
                            </Descriptions>
                    </Row>
                </Col>
                <Col 
                    span={17}
                    style = {{  
                    backgroundColor:"white" , 
                    borderRadius:"15px" , 
                    boxShadow:"0px 4px 20px rgba(0, 0, 0, 0.25)",
                    textAlign:"center",
                    padding:"20px", 
                    margin:"0px 10px"
                }}>   
                    <Table 
                        size="small"
                        pagination={false}
                        bordered={false}
                        rowKey={row=>row.id}
                        title={()=><div>Sales</div>}
                        columns={this.currentPlanColumns}
                        dataSource={this.getData()}
                    />
                </Col>
            </Row>
            <Row style={{padding:"10px 0"}} gutter={10,10}>
                <Col offset={1} span={2}>
                    <Button size="large" type="danger" block> Block</Button>
                </Col>
                <Col  span={3}>
                    <Button size="large" type="dashed" block> Edit</Button>
                </Col>
                {/* <Col offset={14} span={4}>
                 Show Previous Sales <Switch/>
                </Col> */}
            </Row>
            </>
         );
    }
}
 
export default CustomerProfile;