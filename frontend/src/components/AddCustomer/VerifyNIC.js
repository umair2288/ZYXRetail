import React,{Component} from 'react'
import {Form , Input , Row , Col ,Button , Modal , Select} from 'antd'
import key from './../../keys'
//import customerStore from '../store/CustomerStore'

const {Option} = Select;

class VerifyNIC extends Component{

    constructor(){
        super()
        this.state = {
            button: {
               is_active : false,
            } ,
            data:
            {
                NIC : "",
                DOB : ""
            }
        }
    }

    isValidNIC = function (no , dob){
        console.log(this.state.data)
        console.log(no)
        console.log(dob)
        if(no.length===12 ){
          if(dob.substring(0,4) === no.substring(0,4))
            return true
        }
        else{
          if (no.length===10)
          {
             if(dob.substring(2,4) === no.substring(0,2))
                return true
          }
        
        }
        return false      
      }

//  componentDidMount(){
//     console.log("component did mount")
//    this.props.callback("95241147v" ,"95/08/28",this.props.contact_id)
// }

handleSelectChange = (e) => {

    var prevState = {...this.props.prevState}
    prevState.Gender = e
    this.props.updateState(prevState)
 
}
    
 
    

 onDateChange = (event) => {
        if(event===null){
            return
        }
        else{
            console.log(event)
            var value = event.format("YYYY-MM-DD")
             
            //creating the state
            var state = {...this.state}
            state.data = {
                ...this.state.data
            }
            state.data.DOB= value
            this.setState(state)
            console.log(state)
            state = {...this.props.prevState}
            state.DOB = value;
            this.props.updateState(state)
        }
    }

    handleVerification = () =>{
        console.log("verifiying..")

        //if( this.isValidNIC(this.state.data.NIC,this.state.data.DOB) )
        if(true) // nic with dob verifation removed temporaryly
        {
            fetch(key.server+"/user/get-customer/",{
                method:"POST",
                headers : {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization' : "token b9ff7df49481d935ede6fbcc6640a99425733743"
                },
                body : JSON.stringify({"NIC": this.state.data.NIC})
                }
            )
            .then(response => response.json())
            .then(result=> {                
                if (result.is_success){
                   
                    Modal.error({
                        title: 'NIC Verificaition',
                        content: (
                            <div>
                               A Customer with provided NIC already registered
                               <div style={{textAlign:"left", marginTop : "20px"}}>
                                    <Button type="primary" >View Customer</Button>
                               </div>
                            </div>
                        ),
                    });
                }
                else{
                    console.log("Success")
                    Modal.success({
                        title: 'NIC Verification',
                        content: 'Provided NIC is Valid',
                      });
                }
                
            })
            .catch(error => console.log(error))    
            


        }
        else{ 
            Modal.error({
                title: 'NIC Verification',
                content: 'Provided NIC is Invalid',
              });
        }
        //TODO
        // validate the nic number with date of birth

        //
        
        //if valid check with backend whether this id card registerd with any other customer
        //if costomer already registered and no due installment ask user to confirm the customer 
        //registarion bybass which redirect to the add sales to the customer
    }

    checkNIC = (rule, value, callback) => {
        var nic_pat = /^(?:19|20)?\d{2}(?:[01235678]\d\d(?<!(?:000|500|36[7-9]|3[7-9]\d|86[7-9]|8[7-9]\d)))\d{4}(?:[vVxX])$/
        
        
        //creating the state
        var state = {...this.state}
        state.data = {
            ...this.state.data
        }
        state.data.NIC= value //update the nic value with current value
        
        //check pattern match with vlaue
        if( nic_pat.test(value))
        {
            callback();
            state.button.is_active = true
            this.setState(state)
            state = {...this.props.prevState}
            state.NIC = value;
            this.props.updateState(state)  //updating parent components state      
            return
        }
        
        state.button.is_active = false //keep the button inactive
        this.setState(state)
        callback("NIC Invalid")

    }


    




    render(){
        const { getFieldDecorator } = this.props.form;
        // const config = {
        //     rules: [{ type: 'object', required: false, message: 'Please Select The Date of Birth' }],
        // }
        return(
            
            <div>
                <h4> Verify NIC </h4>
                <Row gutter={10}>
                    <Col span={6}>
                        <Form.Item label="NIC number">
                            {getFieldDecorator('nic_no', {
                                rules: [{ required: true, message: 'Valid NIC number is required' , validator:this.checkNIC }],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                    <Col span={4} >
                        <Form.Item label="Gender">
                            {getFieldDecorator('gender', {
                                    rules: [{ required: false, message: 'Please select your gender!' }],
                                })(
                                    <Select
                                    placeholder="Male/Female"
                                    onChange={this.handleSelectChange}
                                  
                                    >
                                    <Option value="M">Male</Option>
                                    <Option value="F">Female</Option>
                                    </Select>,
                                )
                            }
                        </Form.Item>
                    </Col>  
                    {/* <Col span={3}>
                        <Form.Item label="Date of birth">
                            {getFieldDecorator('dob', config)(<DatePicker format='YYYY-MM-DD' onChange={this.onDateChange} />)}
                        </Form.Item>
                    </Col> */}
                    
                    <Col span={3} style={{paddingTop:"38px"}}>
                        <Form.Item>
                            { 
                                this.state.button.is_active ?
                                <Button  type="primary" onClick={this.handleVerification} >Verify</Button>
                                :
                                <Button  type="primary"  disabled>Verify</Button>                               
                            }
                        </Form.Item>
                    </Col>           
                 </Row>
            </div>
        )
    }


}

export default VerifyNIC;