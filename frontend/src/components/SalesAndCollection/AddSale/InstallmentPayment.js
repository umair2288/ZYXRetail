import  React, { Component } from 'react';
import { Col , Row, Radio, InputNumber, Select, DatePicker, Button} from 'antd';
import moment from 'moment'

const {Option} =  Select


class IntallmentPayment extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            installmentTerm : 'WEEKLY',
            discount : this.props.discount,
            numberOfTerms : this.props.installmentTerms,
            min_initial_payment : 0,
            initialPayment :this.props.initialPayment ,
            salesDate : moment(this.props.startDate),
            endDate : moment(this.props.endDate),
            duePerTerm : this.props.duePerTerm,
            weekday : this.props.weekday,
           
         }
    }

    componentDidMount(){
        console.log(this.props)
        const   min_initial_payment = this.props.orderlines.reduce(
            (sum, ol) =>  sum + parseFloat(ol.initial_payment) , 0
        )
        this.setState({
            min_initial_payment 
        })
    }

    changeDate = (date) =>{
        console.log(date)
       
        if(!date){
            return 
        }
        var endDate = moment(date)
        const salesDate = moment(date)
        if (this.state.installmentTerm === "MONTHLY"){
             endDate = moment(date).add(this.state.numberOfTerms*30 ,"d")
        }else if (this.state.installmentTerm === "WEEKLY"){
             endDate = moment(date).add(this.state.numberOfTerms*7 , "d")
        }
       
        this.setState(
            {
                salesDate : salesDate,
                endDate : endDate
            }
            ,() => console.log(this.state)
        )

    }

    handleConfirm = () => {
        console.log("this works..")
        
        const netPayment = this.props.totalBill - this.state.discount
        this.props.updateNetBillAmountAndDiscount(
            netPayment , this.state.discount , "INSTALMENT"
        )
        
        this.props.updateInstallmentDetails(
            this.state.numberOfTerms ,
            this.state.weekday,
            this.state.initialPayment,
            this.state.duePerTerm,
            this.state.salesDate.format("YYYY-MM-DD"),
            this.state.endDate.format("YYYY-MM-DD"),
            this.state.installmentTerm
        )
    }

    onInitialPaymentChange = (initialPayment) =>{
        
        this.setState({
            initialPayment : initialPayment ,
            numberOfTerms : null,
            duePerTerm : null 
        }, () => {
            this.changeDate(moment(this.state.salesDate))
        })
    }
    
    onNumberOfTermsChange = (noOfTerms) => {
    if(!noOfTerms){
        return
    }
    const  duePerTerm = (this.props.totalBill - this.state.initialPayment) / noOfTerms
    this.setState({
        numberOfTerms : noOfTerms,
        duePerTerm :duePerTerm
    }
    , () => {
        this.changeDate(moment(this.state.salesDate))
    })
    
}

    onDuePerTermChange = (duePerTerm) => {

        if(!duePerTerm){
            return
        }

        const  numberOfTerms = (this.props.totalBill - this.state.initialPayment) / duePerTerm
        this.setState({
              numberOfTerms : numberOfTerms,
              duePerTerm :duePerTerm
          }
          , () => {
            this.changeDate(moment(this.state.salesDate))
        })
      }

    onWeekdayChange = (value) => {
        console.log(value)
        this.setState({
            weekday : value
        })
    }

    onInstallmentTypeChange = e =>{
        this.setState(
            {installmentTerm: e.target.value},
            () => {
                console.log(this.state)
                this.changeDate(this.state.salesDate)
            })
    }


    render() { 
        return ( 
            <div style={{marginTop:"50px"}}>
                <Row gutter={20} style={{padding:"20px"}}>
                        <Col span={5}> Payment </Col>
                        <Col span={3}> Total Bill </Col>
                        <Col span={3}> <InputNumber  readOnly value={this.props.totalBill}></InputNumber></Col>  
                        <Col span={3}> Discount</Col>
                        <Col span={3}> <InputNumber disabled readOnly value={this.state.discount}></InputNumber></Col>    
                        <Col span={3}> Net Payment</Col>
                        <Col span={3}> <InputNumber readOnly value={this.props.totalBill - this.state.discount}></InputNumber></Col>             
                </Row>
                <Row gutter={20} style={{padding:"20px"}}>
                  
                      <Col span={5}>
                            Installment Term
                       </Col>
                    
                       <Col span={6}>
                            <Radio.Group onChange={this.onInstallmentTypeChange} defaultValue='WEEKLY'>
                                <Radio value={'WEEKLY'}> Weekly</Radio>
                                <Radio  value={'MONTHLY'}> Monthly</Radio>
                            </Radio.Group>  
                       </Col> 
                </Row>
                <Row  style={{padding:"20px"}}>     
                    <Col span={5}>
                        Initial Payment (Down Payment)
                    </Col>
                    <Col span={5}>
                        <InputNumber 
                            style={{width:"150px"}} 
                            min={this.state.min_initial_payment} 
                            max ={this.props.totalBill - this.state.discount}
                            step={1} 
                            onChange={this.onInitialPaymentChange} 
                            value={this.state.initialPayment}>

                        </InputNumber>
                    </Col>     
                    <Col span={5}>
                        Weekday
                    </Col>
                    <Col span={5}>
                        
                    <Select
                       
                        style={{ width: 300 }}
                        placeholder="Select Weekday"
                        value={this.state.weekday}
                        onChange={this.onWeekdayChange}
                      >
                            {                               
                                    ["MONDAY" , "TUESDAY" , "WENDSDAY" , "THURSDAY" , "FRIDAY" , "SATURDAY" ,"SUNDAY" ].map(
                                        (day , index)=>{
                                            return <Option  key={index} value={day}>{day}</Option>
                                        }
                                    )
            
                            }
                        </Select>  
                    </Col>   
                   
                </Row>
                <Row  style={{padding:"20px"}}>   
                      <Col span={5}>
                            Number of Terms
                       </Col>
                       <Col span={5}>
                           <InputNumber style={{width:"150px"}} min={1} step={1} onChange={this.onNumberOfTermsChange} value={this.state.numberOfTerms}></InputNumber>
                       </Col>     
                       <Col span={5}>
                            Payment Per Term
                       </Col>
                       <Col span={5}>
                           <InputNumber style={{width:"150px"}} min={1} step={1} onChange={this.onDuePerTermChange} value={this.state.duePerTerm}></InputNumber>
                       </Col>  
                </Row>
                <Row gutter={10} style={{padding:"20px"}}>   
                      <Col span={5}>
                            Installment Period
                       </Col>
                       <Col span={2}>
                           Start Date
                       </Col>
                       <Col span={4}>
                            <DatePicker        
                                value = {this.state.salesDate }
                                onChange = {this.changeDate}
                            ></DatePicker>
                       </Col>  
                       <Col span={2}>
                           End Date
                       </Col>
                       <Col span={4}>
                            <DatePicker   
                                disabled = {true}         
                                value = {this.state.endDate }
                            ></DatePicker>

                       </Col>  
                </Row>
                <Row>
                    <Col offset={18} span={6} >
                        <Button  type="primary"  onClick = {this.handleConfirm}> Confirm Payment</Button>
                    </Col>
                </Row>
                
            </div>

         );
    }
}
 
export default IntallmentPayment;