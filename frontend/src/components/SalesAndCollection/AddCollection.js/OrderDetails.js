import React, { Component } from 'react';
import { Row , Col , Form , Table ,Input , Button, message , Tag, Card, Spin, Alert, Modal, InputNumber , Switch}from 'antd'

import axios from 'axios';
import keys from '../../../keys';
import CardToPrint from '../../v2/components/CardToPrint';
import getData from '../../v2/utilities/getdata'

const CloseAccountForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {
      render() {
        const { visible, onCancel, onOk, form , loading} = this.props;
        const { getFieldDecorator } = form;
        return (
          <Modal
            visible={visible}
            title={`Cancel Instalment plan (${this.props.invoice_no})`}
            okText="Close Account"
            onCancel={onCancel}
            onOk={onOk}
          >
            <Spin spinning={loading}>
            <Form layout="vertical">
              <Form.Item label="Username">
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: 'Username is required!' }],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Password">
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Password is required!' }],
                })(<Input type="password" />)}
              </Form.Item>
              <Form.Item label="Balance Amount">
                {getFieldDecorator('balance',{
                 rules: [{ required: true, message: 'You should verify the balance amount!' }]
                })(<InputNumber style={{width:"200px"}} min={0} />)}
              </Form.Item>
              <Form.Item label="Block Customer" style={{marginBottom:0}}>
                {getFieldDecorator('block_customer', {
                  valuePropName: 'checked' 
                })(
                    <Switch  />,
                )}
              </Form.Item>
            </Form>
            </Spin>
          </Modal>
        );
      }
    },
  );



class OrderDetails extends Component {
    state = {
        loading : false,
        invoice_no: this.props.invoice_no,
        disablePayments : this.props.invoice_no ? false : true,
        data : [],
        overDue : this.props.overDue || 0.00,
        totalDue : 0.00,
        amountPaid : 0.00,
        balance : 0.00,
        visibleCloseAccountModal : false,
        modalLoading:false
    }

    componentDidMount(){
      
        if(this.props.invoice_no){
            this.fetchData()
        }
        if(this.props.fetchOrder){
            this.props.fetchOrder(this.props.order_id,
                (invoice_no) => {
                    this.setState({
                        invoice_no:invoice_no
                    }
                    ,
                    this.fetchData
                    )
                }
                )
        }
    }

    

    fetchData = () =>{

        this.setState({loading:true})
        
        axios.all(
            [
                axios.get(`${keys.server}/instalments/dues/${this.state.invoice_no}`),
                axios.get(`${keys.server}/instalments/overdues/${this.state.invoice_no}`),
                axios.get(`${keys.server}/sales/orderreciepts/${this.state.invoice_no}`)
            ]
        )
        .then(
            axios.spread((dues , overdues , reciepts)=>{

                const total_due = dues.data.reduce((sum,value) => sum + parseFloat(value.due_amount) , 0)
                const amountPaid =  dues.data.reduce((sum,value) => sum + parseFloat(value.amount_paid || 0.00) , 0)
                const balance = total_due - amountPaid
                const overdue = overdues.data.reduce((sum , value) => sum + parseFloat(value.amount_payable) , 0)
                const initialPayment = reciepts.data.filter(reciept => reciept.payment_type === "INITIAL").pop().payment
                const disablePayments = balance === 0 ? true : false

                this.setState({
                    data : dues.data,
                    totalDue : total_due,
                    amountPaid : amountPaid,
                    balance : balance,
                    initialPayment : initialPayment,
                    overDue : overdue ,
                    disablePayments: disablePayments,
                    loading :false       
                })
                this.props.updateInvoice && this.props.updateInvoice(this.state.invoice_no)
                this.props.updateOverDue && this.props.updateOverDue(this.state.overDue,balance)
        }
    ))
    .catch(
        err => {       
            // alert(err.message)
            switch(err.response.status){
                case 404:{
                    message.error(err.response.data)      
                    this.setState({
                        loading : false,
                        invoice_no: this.props.invoice_no,
                        data : [],
                        overDue : this.props.overDue || 0.00,
                        totalDue : 0.00,
                        amountPaid : 0.00,
                        balance : 0.00,
                        visibleCloseAccountModal : false,
                        modalLoading:false
                    })
                    break
                }
                default:{
                    message.error("Invalid invoice number!")   
                }
            }
              
            this.setState({
                loading : false
            })
        }
    )

    }


    handleSubmit = (e)=>{
        e.preventDefault()
        this.fetchData()       
    }

    /// funtions releated to close account form
    handleCloseAccount = () => {
        const { form } = this.formRef.props;
       
        form.validateFields((err, values) => {
           
          if (err) {
            return;
          }    

          console.log(values)

        this.setState({
            modalLoading : true
        })
          axios.post(`${keys.server}/user/get-auth-token/`,{
              username:values.username,
              password:values.password,
              emp_type:"MANAGER"
          })
          .then(
              (response) => {

                return axios.post(
                    `${keys.server}/instalments/plan/cancel`,{    
                        "invoice": this.state.invoice_no ,
                        "balance_amount": values.balance,
                        "block_customer": values.block_customer & true
                    },
                    {
                        headers:{
                            Authorization: `Token ${response.data.token}`
                        }
                    }
                )
              }
          )
          .then(
                response => {
                    message.success("Successfully closed the account")
                    form.resetFields();
                    this.setState({ visibleCloseAccountModal: false , modalLoading:false , invoice_no:null },() => this.props.updateInvoice(this.state.invoice_no));     
                }
          )
          .catch(
              error => {   
                console.error(error)
                if(error.response){
                    switch(error.response.status){
                        case 401: {
                            message.error("Account doesn't have permission to cancel instalment plan")
                            break
                        }
                        case 400: {      
                            message.error(JSON.stringify(error.response.data))
                            break
                        }
                        default :{
                            message.error("Oops! Something when wrong. Try once more and contact support!")
                        }
                    }
                  
                }
               
                this.setState({
                    modalLoading : false
                })
              }
          )
         
         
          
        });
      };
    
      saveFormRef = formRef => {
        this.formRef = formRef;
      };




      printCard = ()=>{
            const url = `api/instalments/cards/${8}/`
            this.setState({loading : true})
            getData(url,{},()=>message.success("Card is ready!"),()=>message.error("OOPS!, Can not print card!"))
            .then(
                data => {
                    const cardData = {
                        invoiceNo : data.invoice_no,
                        issueDate : data.start_date,
                        endDate : data.end_date,
                        salesPersonID : data.sales_person_nic,
                        vehicleNo : data.vehicle_no,
                        customerName : data.customer_name,
                        customerID : data.customer_id,
                        customerAddress : data.customer_address,
                        customerNIC : data.customer_nic,
                        contactNo : data.customer_contact_no,
                        initialPayment : data.initial_payment,
                        numberOfTerms : data.no_of_terms,
                        totalBill : data.total_bill,
                        items : data.items.toString()
                    }
                    this.setState({
                        showCardToPrint : true,
                        cardData : cardData
                    })  
                }
            )
            .catch(
                err => console.error(err)
            )
            
      }

      onPrintClose = () => {
          this.setState({
              showCardToPrint : false,
              cardData : null,
              loading : false
          })
      }
    
    
     

    createPayment = () => {  
            this.props.nextStep()  
    }

    columns = [

        {
            key:1,
            dataIndex : "due_date",
            title : "Due Date",
            width:150
        }
        ,
        {
            key:2,
            dataIndex : "title",
            title : "Term",
            width:150
        }
        ,
        
        {
            key:3,
            dataIndex : "due_amount",
            title : "Due Amount",
            render : due_amount => "Rs. " + due_amount ,
            width:150
        }
        ,
        {
            key:4,
            dataIndex : "amount_paid",
            title : "Amount Paid",
            render : amount_paid => amount_paid ? "Rs. " + amount_paid : "Rs. " + 0 ,
            width:150
        }
        ,
        {
            key:5,
            dataIndex : "amount_payable",
            title : "Amount Payable",
            render : amount_payable => "Rs. " + amount_payable,
            width:150
        }
        ,
        {
            key:6,
            dataIndex : "is_paid",
            title : "Due Status",
            render : (is_paid) => is_paid ? <Tag color="#87d068">Paid</Tag> : <Tag color="#f50">Not Paid</Tag>
        }
    ]
    

    render() { 
      
        return ( 
            <>
            <Spin spinning={this.state.loading}>
                <Row gutter={20}>
                    <Form onSubmit={this.handleSubmit}>
                    <Col span={16}>
                        <Input required={true} readOnly={this.props.viewOnly} tabIndex={1} onChange={e => this.setState({invoice_no:e.target.value.toUpperCase()})} value={this.state.invoice_no} placeholder="Enter Invoice Number"></Input>
                    </Col>
                    <Col span={8}>
                        <Button tabIndex={2} block htmlType="submit" type="primary">Search Invoice</Button>
                    </Col>
                    </Form>
                </Row>
                <Row style={{marginTop:"20px"}} gutter={20}>
                    <Col span={16}>
                        <Row style={{paddingBottom:"10px"}} gutter={10}>   
                            <Col  span={8}>
                                <Card  size="small" title="Overdue">
                                    Rs. {this.state.overDue}
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card  size="small" title="Total Due">
                                Rs.    {this.state.totalDue}
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card size="small" title="Initial Payment">
                                Rs.  {this.state.initialPayment || 0}
                                </Card>
                            </Col>  
                        </Row>
                        <Row gutter={10}>
                            <Col span={8}>
                                <Card  size="small" title="Amount Paid">
                                Rs. {this.state.amountPaid}
                                </Card>
                            </Col>
                            <Col   span={8}>
                                <Card size="small" title="Balance">
                                Rs. {this.state.balance}
                                </Card>
                            </Col>
                           
                        </Row>
                  </Col>
                    <Col span={8}>
                       { 
                       this.props.viewOnly? 
                       <>
                        {this.props.extraComponent}
                        
                       </>:
                       <>
                            <Row style={{marginTop:"10px"}}>
                                <Col span={24}>
                                    <Button disabled={this.state.disablePayments} onClick={this.printCard}  type="primary" block> Print Card</Button>
                                </Col>
                            </Row> 
                            <Row style={{marginTop:"10px"}}>
                                <Col span={24}> <Button onClick={()=>this.setState({visibleCloseAccountModal:true})} disabled={this.state.disablePayments} block type="danger"> Close Account </Button></Col>
                            </Row>
                           
                            <Row style={{marginTop:"10px"}}>
                                <Col span={24}> <Button disabled={this.state.disablePayments} block type="primary"> Full Payment </Button></Col>
                            </Row>   
                            <Row style={{marginTop:"20px"}}>
                                    <Col span={24}>
                                        <Button disabled={this.state.disablePayments} tabIndex={3} onClick={this.createPayment} size="large" type="primary" block> Create Payment</Button>
                                    </Col>
                            </Row>                        
                        </>
                        }    
                   </Col>
                </Row>
                <Row style={{marginTop:"20px"}}>
                    <Col span={24}>
                        <Table 
                            rowKey={row => row.id}
                            title={()=><div >Installment Terms</div>}  
                            scroll={{y:250}} pagination={false} 
                            size="small"  
                            columns={this.columns} 
                            dataSource={this.state.data}>            
                        </Table>
                    </Col>
                </Row>
            </Spin>
           
            <CloseAccountForm
                wrappedComponentRef={this.saveFormRef}
                visible={this.state.visibleCloseAccountModal}
                onCancel={()=>this.setState({visibleCloseAccountModal:false})}
                invoice_no = {this.state.invoice_no}
                onOk={this.handleCloseAccount}
                loading = {this.state.modalLoading}
                />
            {
                this.state.showCardToPrint && <CardToPrint onClose={this.onPrintClose} data={this.state.cardData}/>
            }
            </>
            
         );
    }
}
 
export default OrderDetails;