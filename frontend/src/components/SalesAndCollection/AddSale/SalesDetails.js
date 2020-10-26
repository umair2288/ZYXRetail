import React,{Component} from 'react'
import { Row, Col , Button , Radio , InputNumber , Select, Input} from 'antd'


 const {Option} = Select


 class SalesDetails extends Component{

    state = {
        guarentor_nic : null
    }




    render(){
    if(this.props.customer_verified && this.props.product_verified)
        return ( 
            <div>
            <Row  style={{textAlign:"center" , margin:"5px"}}>
                 <Col span={4}>
                    <div style={{color:"Black" , padding:"5px" }}>
                        Customer
                    </div>
              </Col>
                <Col span={4}>
                    <div style={{backgroundColor:"Gray" , color:"Black" , padding:"5px" }}>
                        {this.props.NIC}
                    </div>
              </Col>
              <Col span={8}>
                    <div style={{backgroundColor:"Red" , color:"White" , padding:"5px" , fontWeight:"Bold"}}>
                        {this.props.customer.contact.FirstName + ' ' + this.props.customer.contact.LastName}
                    </div>
              </Col>
              
            </Row>
            <Row style={{textAlign:"center" , margin:"5px"}}>
            <Col span={4}>
               <div style={{color:"Black" , padding:"5px" }}>
                   Product
               </div>
         </Col>
           <Col span={4}>
               <div style={{backgroundColor:"Gray" , color:"Black" , padding:"5px" }}>
                   {this.props.product_id}
               </div>
         </Col>
         <Col span={5}>
               <div style={{backgroundColor:"Red" , color:"White" , padding:"5px" , fontWeight:"Bold"}}>
                   {this.props.product.batch.product.title}
               </div>
         </Col>
         <Col span={3}>
               <div style={{backgroundColor:"Gray" , color:"Black" , padding:"5px" , fontWeight:"Bold"}}>
                   {"Rs. "+this.props.product.sell_price}
               </div>
         </Col>
         </Row>
                <Row style={{ margin:"5px"}}>
                    <Col  span={4}>
                        <div style={{color:"Black" , padding:"5px", textAlign:"center" }}>
                            Instalment
                        </div>
                    </Col>
                    <Col span={6} style={{color:"Black" , padding:"5px"} }>
                        <Radio.Group onChange={this.props.onChange} value={this.props.sale.instalment_type} label="Instalment">
                            <Radio value={"Weekly"}>Weekly</Radio>
                            <Radio value={"Monthly"}>Monthly</Radio>
                        </Radio.Group>
                    </Col>
                   
                </Row>

                <Row style={{ margin:"5px"}}>
                    <Col  span={4}>
                        <div style={{color:"Black" , padding:"5px", textAlign:"center",marginTop:"auto" }}>
                           Initial Payment
                        </div>
                    </Col>
                    <Col span={6} style={{color:"Black" , padding:"5px"} }>
                      <InputNumber 
                        name="initial_payment" 
                        min={0}  defaultValue={0} 
                        onChange={this.props.numberChange} 
                        value = {this.props.sale.initial_payment}
                        />,
                    </Col>
                   
                </Row>
                <Row style={{ margin:"5px"}}>
                    <Col  span={4}>
                        <div style={{color:"Black" , padding:"5px", textAlign:"center",marginTop:"auto" }}>
                           Instalment Details
                        </div>
                    </Col>
                    <Col span={6} style={{color:"Black" , padding:"5px"} }>
                        <label> No of Terms</label>  
                         <InputNumber 
                            name="no_of_terms" 
                            min={0} 
                            value={this.props.sale.no_of_terms} 
                            defaultValue={0} 
                            onChange={this.props.noOfTermChange} 
                        />,
                    </Col>
                    <Col span={6} style={{color:"Black" , padding:"5px"} }>
                        <label > Payment per Term</label>  
                         <InputNumber 
                            name="term_payment" 
                            min={0}  
                            value={this.props.sale.term_payment} 
                            defaultValue={0} 
                            onChange={this.props.termPaymentChange} 
                         />,
                    </Col>
                   
                </Row>

                <Row style={{ margin:"5px"}}>
                    <Col  span={4}>
                        <div style={{color:"Black" , padding:"5px", textAlign:"center",marginTop:"auto" }}>
                           Sales Person
                        </div>
                    </Col>
                    <Col span={6} style={{color:"Black" , padding:"5px"} }>
                        <Select
                        showSearch
                        style={{ width: 300 }}
                        placeholder="Select a sales person"
                        onChange={this.props.onSalePersonChange}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                        option.this.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                            {                               
                                    this.props.salesStaffs.map(
                                        (staff)=>{
                                            return <Option  key={staff.id}>{staff.name + '-' + staff.nic}</Option>
                                        }
                                    )
            
                            }
                        </Select>  
                    </Col>
                </Row>
                    <Row>
                    <Col  span={4}>
                        <div style={{color:"Black" , padding:"5px", textAlign:"center",marginTop:"auto" }}>
                           Week Day
                        </div>
                    </Col>
                    <Col span={6} style={{color:"Black" , padding:"5px"} }>
                        <Select
                        showSearch
                        style={{ width: 300 }}
                        placeholder="Select Weekday"
                        onChange={this.props.onWeekdayChange}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                        option.this.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                            {                               
                                    ["MONDAY" , "TUESADY" , "WENDSDAY" , "THURSDAY" , "FRIDAY" , "SATURDAY" ,"SUNDAY" ].map(
                                        (day , index)=>{
                                            return <Option  key={index} value={day}>{day}</Option>
                                        }
                                    )
            
                            }
                        </Select>  
                    </Col>
                    </Row>
                    <Row>
                        <Col  span={4}>
                            <div style={{color:"Black" , padding:"5px", textAlign:"center",marginTop:"auto" }}>
                            Guarentor NIC
                            </div>
                        </Col>
                        <Col span={6} style={{color:"Black" , padding:"5px"} }>
                            <Input value={this.state.guarentor_nic} onChange={e=>this.state.setState({guarentor_nic:e.target.value})}></Input>
                        </Col>
                        <Col span={6} style={{color:"Black" , padding:"5px"} }>
                            <Button type="primary"> Verify Guarentor</Button>
                        </Col>
                    </Row>
                    <Row style={{ margin:"5px"}}>
                    <Col offset={10} span={3}>
                        <Button type="primary" name="confirm_sale" onClick={this.props.handleClick}>Confirm Sale</Button>
                    </Col>
                    <Col  span={3}>
                        <Button type="danger" name="cancel_sale" onClick={this.props.handleClick}>Cancel Sale</Button>
                    </Col>
                </Row>
            </div>
            )
    if(this.props.customer_verified ){
        return ( 
            <Row style={{textAlign:"center"}}>
                 <Col span={4}>
                    <div style={{color:"Black" , padding:"5px" }}>
                        Customer
                    </div>
              </Col>
                <Col span={4}>
                    <div style={{backgroundColor:"Gray" , color:"Black" , padding:"5px" }}>
                        {this.props.NIC}
                    </div>
              </Col>
              <Col span={8}>
                    <div style={{backgroundColor:"Red" , color:"White" , padding:"5px" , fontWeight:"Bold"}}>
                        {this.props.customer.contact.FirstName + ' ' + this.props.customer.contact.LastName}
                    </div>
              </Col>
            
            </Row>
           
            )
        }
    if( this.props.product_verified){
        return ( 
            <Row style={{textAlign:"center"}}>
                 <Col span={4}>
                    <div style={{color:"Black" , padding:"5px" }}>
                        Product
                    </div>
              </Col>
                <Col span={4}>
                    <div style={{backgroundColor:"Gray" , color:"Black" , padding:"5px" }}>
                        {this.props.product_id}
                    </div>
              </Col>
              <Col span={8}>
                    <div style={{backgroundColor:"Red" , color:"White" , padding:"5px" , fontWeight:"Bold"}}>
                        {this.props.product.batch.product.title}
                    </div>
              </Col>
              
            </Row>
            )
    
        }  else{
            return <div></div>
        }
    }
  
}

export default SalesDetails