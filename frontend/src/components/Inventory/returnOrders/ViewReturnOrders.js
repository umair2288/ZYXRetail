import React, { Component } from 'react';
import {Table, Button , Row ,Col, Input , Radio , DatePicker, Modal, message, Form, InputNumber, Alert, Select} from 'antd'
import Axios from 'axios';
import moment from "moment"
import keys from '../../../keys';
import Revalue from './revalue/Revalue';


const {Option} = Select

class ViewReturnOrders extends Component {
   
    
    state = {
        new_no_of_terms:1,
        new_due_per_term : null,
        show_return_order_modal :false,
        data: [],
        return_order_id : null,
        product_piece_id : null,
        newWarehouse : null,
        revaluedPrice : null,
        sell_price : null,
        pagination: {
            pageSize:5 ,
            current : 1,
            total : 0
        },
        loading: false,
      };

      onStartDateChange = (date) =>{
        var enddate = moment(date)
        var startdate = moment(date)
        switch (this.state.payment_type){
            case "WEEKLY":{
                enddate.add("d" , this.state.new_no_of_terms * 7)
                break
            }
            case "MONTHLY":{
                enddate.add("d" , this.state.new_no_of_terms * 30 )
                break
            }
            default:{
                message.error("No payment type selected")
            }
        }

        this.setState({
            new_start_date : startdate,
            new_end_date: enddate
        }
        ,
        () => console.log(this.state)
        )
        
      }

      updateWarehouseAndPrice=(warehouse_id, revalued_price , sell_price)=>{
          this.setState({
              newWarehouse:warehouse_id,
              revaluedPrice : revalued_price,
              sell_price : sell_price
          },()=> console.log(this.state))
      }

      sendUpdateRequest = (update_data = {}) => {
            this.setState({
                loading : true
            })
            Axios.patch(
                `${keys.server}/warehouse/productpieces/v2/${this.state.product_piece_id}`,
                update_data
            )
            .then(
                response => {
                    console.log(response)
                    return Axios.patch(
                        `${keys.server}/sales/returnorder/update/${this.state.return_order_id}` , {is_revalued : true}
                    )
                   
                }
            )
            .then(
                response => {
                    console.log(response)
                    this.fetch({
                        limit: this.state.pagination.pageSize,
                        offset: (this.state.pagination.current - 1)*this.state.pagination.pageSize
                    });
                }
            )
            .catch(
                error => {
                    console.error(error)
                }
            )
      }


      handleRevalueModalOk = () =>{
          this.setState({
              show_revalue_modal :false
          }
          ,
          ()=> this.sendUpdateRequest({
              warehouse : this.state.newWarehouse ,
              sell_price : this.state.revaluedPrice,
              pre_revalued_price : this.state.sell_price,
              is_revalued : true,
              is_sold:false
          }) 
          )
      }
     
    
      componentDidMount(){ 
        this.fetch({
            limit: this.state.pagination.pageSize,
            offset: (this.state.pagination.current - 1)*this.state.pagination.pageSize
        });
      }
    
      formatTableData = (data)=>{
        return {
            "id" : data.id,
            "invoice" : data.order.invoice_no,
            "product_piece" : data.product_piece.item_code,
            "customer_nic" : data.customer.NIC,
            "reason" : data.return_order_type,
            "description":data.return_order_desc,
            "action":data.action,
            "is_action_performed": data.is_action_performed,
            "date": data.date,
            "revalue" : {"is_revalued" :data.is_revalued , "product_piece_id": data.product_piece.id , return_order_id : data.id }
        }
      }

      handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
          pagination: pager,
        });
        this.fetch({
          limit: pagination.pageSize,
          offset: (pagination.current - 1)*pagination.pageSize,
        });
      };
    
      fetch = (params = {}) => {
        console.log('params:', params);
        this.setState({ loading: true });
        Axios.get(
            `${keys.server}/sales/returnorder/list` , {
                params:{
                    ...params
                }
            }
        )
        .then(
            response => {
                console.log(response)
                const pagination = {...this.state.pagination}
                pagination.total = response.data.count
                this.setState({
                    loading:false,
                    data : response.data.results.map(this.formatTableData),
                    pagination 
                } , () => console.log(this.state))
            }
        )
        .catch(
            error => {
                console.error(error)
                this.setState({ loading: false });
            }
        )
      };
    

      performAction = (data) => {
        this.setState({
            loading:true,
            return_order_action:data.action,
            return_order_id : data.id,
            show_return_order_modal : true
        }
        , 
            () => {       
                this.sendPerformActionRequest = this.sendPerformActionRequestCurry(data.id)      
            }
        )
    }

    
    sendPerformActionRequest = (data)=>{ console.error("Function not curried")}
    sendPerformActionRequestCurry = (id) => {
        return (data)=>{
            Axios.post(`${keys.server}/sales/returnorder/${id}/action`,data)
            .then(
            response =>{
                if(response.data.cash_refund){
                    this.refundAlert(response.data.cash_refund)         
                }
                this.fetch({
                    limit: this.state.pagination.pageSize,
                    offset: (this.state.pagination.current - 1)*this.state.pagination.pageSize
                });
                this.setState({
                    return_order_action:null,
                    show_return_order_modal : false,
                    loading :false
                })
            }
        )
        }  
    }

   refundAlert = (refund) => {
        Modal.info({
          title: 'Cash Refund Alert',
          content: (
            <div>
              <p>Please note that you have to make LKR.{refund} payment to customer as a refund</p>      
            </div>
          ),
          onOk() {},
        });
      }

    columns = [
        {
        key :"invoice",
        dataIndex : "invoice",
        title : "Invoice"
        },
        {
        key :"product_piece",
        dataIndex : "product_piece",
        title : "Product Piece"
        },
        {
        key :"customer",
        dataIndex : "customer_nic",
        title : "Customer NIC"
        },
        {
        key :"date",
        dataIndex : "date",
        title : "Return Order Date"
        },
        {
        key :"reson",
        dataIndex : "reason",
        title : "Reason"
        },
        {
        key :"description",
        dataIndex : "description",
        title : "Description"
        },
        {
        key :"action",
        dataIndex : "action",
        title : "",
        render : (action , row) => <Button type="primary" onClick={() => this.performAction(row)}  disabled={row.is_action_performed}>{action}</Button>
        }
        ,
        {
        key :"revalue",
        dataIndex : "revalue",
        title : "",
        render : (revalue,row)=> <Button disabled={revalue.is_revalued || row.action==="WARRANTY CLAIM"} onClick={()=>this.onRevalueClicked(revalue.product_piece_id , revalue.return_order_id)} > Revalue</Button>
        },
        ]
        
    onRevalueClicked = (product_piece_id , return_order_id ) => {
        this.setState({
            show_revalue_modal : true,
            product_piece_id : product_piece_id,
            return_order_id : return_order_id
        })
    }


    onSearchClicked =()=>{
        var url = ""

        if(this.state.searchValue||this.state.searchProperty==="is_revalued"){       
                const params = {
                    [this.state.searchProperty] : this.state.searchValue || true
                }
                console.log(params)
                this.fetch({
                    limit: this.state.pagination.pageSize,
                    offset: (this.state.pagination.current - 1)*this.state.pagination.pageSize,
                    ...params
                });
        }
        
    }

    onResetClicked = () => {
        this.fetch({
            limit: this.state.pagination.pageSize,
            offset: (this.state.pagination.current - 1)*this.state.pagination.pageSize,
        });
    }

    checkBalanceAmount = () =>{
        const id = this.state.return_order_id
        const value = this.state.return_order_value
        const product_piece = this.state.product_piece
        console.log(this.state)
        Axios.get(`${keys.server}/sales/returnorder/balance`,{params : {id,value,product_piece}})
        .then(
            response => {
                this.setState(
                    {
                        balance_amount : response.data.balance_amount,
                        new_due_per_term : response.data.balance_amount,
                        create_new_order : response.data.create_new_order,
                        new_product_piece_id : response.data.product_piece_id,
                        checkButtonClicked : true,
                    }
                )
            }
        )
        .catch(
            error =>{
                console.error(error)
                message.error(error.response.data)
            }
        )

    }
    
    renderReturnOrderActionForm = (action) =>{
        switch(action){
           case "REFUND":{
                return (
                        <>  <Form>
                                <Row gutter={20}>
                                    <Col span={12}>
                                        <Form.Item label="Return Order Value">     
                                            <InputNumber style={{width:"100%"}} value={this.state.return_order_value} onChange={v=>this.setState({return_order_value:v , checkButtonClicked:false},()=>console.log(this.state))} /> 
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Check Balance">  
                                            <Button block type="primary" disabled={this.state.return_order_value && this.state.product_piece ? false : true}  onClick={this.checkBalanceAmount} > Check Balance Amount</Button>     
                                        </Form.Item>
                                    </Col>                     
                                </Row>
                                {this.state.checkButtonClicked && <Alert type="info" message={this.state.balance_amount >= 0 ? `This customer has to pay LRK ${this.state.balance_amount}. Please provide below details for new order and payment system`:`Company has to refund LRK ${Math.abs(this.state.balance_amount)} to customer.`}/>}
                                {this.state.create_new_order && <>
                                <Row gutter={20}>
                                    <Col span={12}>
                                        <Form.Item label="New Number of Terms">
                                            <InputNumber  style={{width:"100%"}} value={this.state.new_no_of_terms} onChange={v=>this.setState({new_no_of_terms:v , new_due_per_term: this.state.balance_amount/v },()=>console.log(this.state))} />      
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="New Due Per Term">
                                            <InputNumber  style={{width:"100%"}} value={this.state.new_due_per_term} onChange={v=>this.setState({new_due_per_term:v , new_no_of_terms:this.state.balance_amount/v}, ()=>console.log(this.state))} />      
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={20}>
                                    <Col span={12}>
                                        <Form.Item label="Payment Type">
                                           <Radio.Group value={this.state.payment_type} onChange={e => this.setState({payment_type:e.target.value , new_start_date:null , new_end_date:null})}>
                                               <Radio value={"WEEKLY"}> Weekly</Radio>
                                               <Radio value={"MONTHLY"}> Monthy</Radio>
                                            </Radio.Group>   
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Week Day">
                                            <Select value={this.state.weekday} onChange={v=>this.setState({weekday:v})}>
                                                {["MONDAY","TUESDAY","WENDSDAY","THURDAY","FRIDAY","SATURDAY","SUNDAY"].map(w => <Option value={w}>{w}</Option>)}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={20}>
                                    <Col span={12}>
                                        <Form.Item label="New Start Date">
                                            <DatePicker style={{width:"100%"}} value={this.state.new_start_date} onChange={this.onStartDateChange} />   
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="New End Date">
                                            <DatePicker style={{width:"100%"}} value={this.state.new_end_date} disabled={true}/>   
                                        </Form.Item>
                                    </Col>
                                    </Row>
                                </>
                                }
                            </Form>
                        </>
                    )
                }
           case "EXCHANGE ORDER":{
                return (
                    <>  <Form>
                                <Row gutter={20}>
                                    <Col span={8}>
                                        <Form.Item label="Return Order Value">     
                                            <InputNumber style={{width:"100%"}} value={this.state.return_order_value} onChange={v=>this.setState({return_order_value:v , checkButtonClicked:false},()=>console.log(this.state))} /> 
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item label="Product Piece">
                                            <Input  style={{width:"100%"}} value={this.state.product_piece} onChange={e=>this.setState({product_piece: e.target.value},()=>console.log(this.state))} />      
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <Form.Item label="Check Balance">  
                                            <Button block type="primary" disabled={this.state.return_order_value ? false : true}  onClick={this.checkBalanceAmount} > Check Balance Amount</Button>     
                                        </Form.Item>
                                    </Col>                     
                                </Row>
                                {this.state.checkButtonClicked && <Alert type="info" message={this.state.balance_amount >= 0 ? `This customer has to pay LRK ${this.state.balance_amount}. Please provide below details for new order and payment system`:`Company has to refund LRK ${Math.abs(this.state.balance_amount)} to customer.`}/>}
                                {this.state.create_new_order && <>
                                <Row gutter={20}>
                                    <Col span={12}>
                                        <Form.Item label="New Number of Terms">
                                            <InputNumber  style={{width:"100%"}} value={this.state.new_no_of_terms} onChange={v=>this.setState({new_no_of_terms:v , new_due_per_term: this.state.balance_amount/v },()=>console.log(this.state))} />      
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="New Due Per Term">
                                            <InputNumber  style={{width:"100%"}} value={this.state.new_due_per_term} onChange={v=>this.setState({new_due_per_term:v , new_no_of_terms:this.state.balance_amount/v}, ()=>console.log(this.state))} />      
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={20}>
                                    <Col span={12}>
                                        <Form.Item label="Payment Type">
                                           <Radio.Group value={this.state.payment_type} onChange={e => this.setState({payment_type:e.target.value , new_start_date:null , new_end_date:null})}>
                                               <Radio value={"WEEKLY"}> Weekly</Radio>
                                               <Radio value={"MONTHLY"}> Monthy</Radio>
                                            </Radio.Group>   
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Week Day">
                                            <Select value={this.state.weekday} onChange={v=>this.setState({weekday:v})}>
                                                {["MONDAY","TUESDAY","WENDSDAY","THURDAY","FRIDAY","SATURDAY","SUNDAY"].map(w => <Option value={w}>{w}</Option>)}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={20}>
                                    <Col span={12}>
                                        <Form.Item label="New Start Date">
                                            <DatePicker style={{width:"100%"}} value={this.state.new_start_date} onChange={this.onStartDateChange} />   
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="New End Date">
                                            <DatePicker style={{width:"100%"}} value={this.state.new_end_date} disabled={true}/>   
                                        </Form.Item>
                                    </Col>
                                    </Row>
                                </>
                                }
                            </Form>
                        </>
                )
            }

            case "WARRANTY CLAIM":{
                return (
                    <>  
                        <p>
                            Click OK to confrim the warrranty claim. Product should be handed over the customer.
                        </p>
                    </>
                )
            }
        }
       
    }
    

    returnOrderAction = ()=>{
        switch(this.state.return_order_action){
            case "WARRANTY CLAIM":{
                this.sendPerformActionRequest({
                    "return_order_value": null,
                    "new_product_piece_id": null,
                    "new_due_per_term": null,
                    "number_of_terms" : null,
                    "new_start_date": null,
                    "new_end_date": null
                 })
                 break;
            }
            case "REFUND":{
                this.sendPerformActionRequest({
                    "return_order_value": this.state.return_order_value,
                    "new_product_piece_id": null,
                    "new_due_per_term": this.state.new_due_per_term ? this.state.new_due_per_term:null,
                    "number_of_terms" : this.state.new_due_per_term ? this.state.new_due_per_term:null,
                    "new_start_date": this.state.new_start_date ? this.state.new_start_date.format("YYYY-MM-DD"):null,
                    "new_end_date": this.state.new_end_date ? this.state.new_end_date.format("YYYY-MM-DD"):null
                 })
                 break;
            }
            case "EXCHANGE ORDER":{
                this.sendPerformActionRequest({
                    "return_order_value": this.state.return_order_value,
                    "new_product_piece_id": this.state.new_product_piece_id,
                    "new_due_per_term": this.state.new_due_per_term,
                    "number_of_terms" : this.state.new_no_of_terms,
                    "new_start_date": this.state.new_start_date.format("YYYY-MM-DD"),
                    "new_end_date": this.state.new_end_date.format("YYYY-MM-DD")
                 })
                 break;
            }
        }
         
    }

    render() { 
        return ( 
            <>
            <Row style={{padding:"20px"}} gutter={10}>
                <Col  span={2}> Search By :</Col>
                <Col  span={14}> 
                <Radio.Group value = {this.state.searchProperty} onChange={e=>this.setState({searchProperty:e.target.value , searchValue:null})}>
                    <Radio value="customer_nic">Customer NIC</Radio>
                    <Radio value="product_code"> Product Code</Radio>
                    <Radio value="invoice"> Invoice</Radio>
                    <Radio value="date"> Return Order Date</Radio>
                    <Radio value="is_revalued"> Not Revalued Only</Radio>       
                </Radio.Group>
                </Col>
                <Col span={4}>
                  {this.state.searchProperty==="date" ?
                     <DatePicker value={moment(this.state.searchValue,"YYYY-MM-DD")} onChange={v=>this.setState({searchValue:v && v.format("YYYY-MM-DD")})}></DatePicker>
                     :<Input disabled={this.state.searchProperty==="is_revalued"} placeholder="Search Value" value={this.state.searchValue} onChange={e=>this.setState({searchValue:e.target.value})}></Input>
                }  
                </Col>
                <Col  span={2}>
                    <Button type="primary" onClick={this.onSearchClicked}>Search</Button>
                </Col>
                <Col  span={2}>
                    <Button type="danger" onClick={this.onResetClicked}>Reset</Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table 
                        rowKey = {row => row.id}
                        columns={this.columns} 
                        dataSource={this.state.data}
                        pagination={this.state.pagination}
                        loading={this.state.loading}
                        onChange = {this.handleTableChange}
                    /> 
                </Col>
            </Row>
            <Modal
                title = "Revalue Product Piece"
                destroyOnClose
                visible={this.state.show_revalue_modal}
                onCancel={()=>this.setState({show_revalue_modal:false})}
                onOk = {this.handleRevalueModalOk}
            >
                <Revalue updateParentComp={this.updateWarehouseAndPrice}   product_piece_id = {this.state.product_piece_id}></Revalue>
            </Modal>
            <Modal
                title = {this.state.return_order_action}
                visible ={this.state.show_return_order_modal}
                onOk = {this.returnOrderAction}
                onCancel = {()=>this.setState({loading:false, show_return_order_modal:false})}
            >
                {this.renderReturnOrderActionForm(this.state.return_order_action)}
            </Modal>
            </>
        );
    }   
}
 
export default ViewReturnOrders;