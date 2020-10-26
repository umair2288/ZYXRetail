import React, {Component} from 'react'
import {Row,Col} from 'antd'

class CustomerDetails extends Component{

    state = {
        "is_edit_mode" : false,
        "avatar" : this.props.profile_pic ? this.props.profile_pic:'img/man.svg'
    }

    render(){
        console.log(this.props)
        return(
            <Row> 
                <Col span={6} >
                    <div style={{backgroundColor:"Gray" , width:130 , height:130 }}>
                        <img alt = "profile_pic" src={this.state.avatar} width={130} height={130} /> 
                    </div>

                </Col>
                <Col span={18}>
                    <ul>
                        <li>Full Name : {this.props.contact.FirstName + " " + this.props.contact.LastName}</li>
                        <li>NIC : {this.props.NIC} </li>
                        <li>Address : {this.props.contact.Address.No + ", " + this.props.contact.Address.Street + ", " + this.props.contact.Address.Town + "." }</li>
                        <li>Contact No : {this.props.contact.ContactNo }</li>
                        <li>Registered Date : {this.props.RegisteredDate} </li>
                    </ul>
                </Col>             
            </Row>
        )
    }
}

export default CustomerDetails