import React, { Component } from 'react';
import {Row , Col , DatePicker  , Select , Button } from 'antd'
import { connect } from 'react-redux';
import { fetchSalesPersonVehicles } from '../../../redux/salespersonvehicle/actions/actionCreators';
import { Alert } from 'antd';


const {Option} = Select;

class SalesPersonDetails extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            salesPersonVehicle : this.props.salesPersonVehicle,
            sales_persons :[],
            vehicles :[],
            drivers : [],
            routes : []
         }
    }

    onSalesPersonChange = (value) => {
        console.log(value)
        const spv = this.props.salesPersonVehicles.filter(spv => spv.id === value).pop()
        this.setState({
           salesPersonVehicle : spv
        })
    }

    componentDidMount(){
        this.props.fetchSalesPersonVehicles(this.props.saleDate.format("YYYY-MM-DD"))
    }

    handleConfirm = () => { 
        this.props.updateSalesPersonDetails(this.state.salesPersonVehicle)
    }
    
    onDateChange = (date) =>{
        if(date){
        this.props.updateSaleDate(date)
        this.props.fetchSalesPersonVehicles(date.format("YYYY-MM-DD"))
        }else{

        }
    }
      

    render() { 
        return ( <div>
            <Row gutter={20} style={{padding:"20px"}}>
                <Col span={5}> Sale Date</Col>
                <Col span={12}> <DatePicker onChange={this.onDateChange} value = {this.props.saleDate}></DatePicker></Col>
                <Col span={5}><Alert type="warning">Changing the sale date will not change the start date on instalment</Alert></Col>
            </Row>
            <Row gutter={20} style={{padding:"20px"}}>
                <Col span={5}> Sales Person</Col>
                <Col span={12}>
                    <Select  
                        showSearch
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        value={this.state.salesPersonVehicle?this.state.salesPersonVehicle.id:null} 
                        onChange={this.onSalesPersonChange} style={{width:"200px"}}>
                            {
                            this.props.salesPersonVehicles.map(
                                (spv,index)=><Option 
                                                key={index} 
                                                value={spv.id}>
                                            {spv.sales_person.NIC +"-"+ spv.sales_person.Contact.FirstName +" "+ spv.sales_person.Contact.LastName}
                                            </Option>)
                            }
                    </Select></Col>
            </Row>
            <Row gutter={20} style={{padding:"20px"}}>
                <Col span={5}> Vehicle</Col>
                <Col span={12}>
                    <Select disabled style={{width:"200px"}}   value={this.state.salesPersonVehicle?this.state.salesPersonVehicle.id:null}>
                            {
                            this.props.salesPersonVehicles.map(
                                (spv,index)=><Option 
                                                key={index} 
                                                value={spv.id}>{spv.vehicle.vehicle_no}
                                            </Option>)
                            }
                    </Select></Col>
            </Row>
            <Row gutter={20} style={{padding:"20px"}}>
                <Col span={5}> Driver</Col>
                <Col span={12}>
                    <Select disabled style={{width:"200px"}}  value={this.state.salesPersonVehicle?this.state.salesPersonVehicle.id:null}>
                            {
                            this.props.salesPersonVehicles.map(
                                (spv,index)=><Option 
                                                key={index} 
                                                value={spv.id}>{spv.driver.NIC}
                                            </Option>)
                            }
                    </Select></Col>
            </Row>
            <Row gutter={20} style={{padding:"20px"}}>
                <Col span={5}> Route</Col>
                <Col span={12}>
                    <Select disabled style={{width:"200px"}}  value={this.state.salesPersonVehicle?this.state.salesPersonVehicle.id:null}>
                            {
                             this.props.salesPersonVehicles.map(
                                (spv,index)=><Option 
                                                key={index} 
                                                value={spv.id}>{spv.route.title}
                                            </Option>)
                            }
                    </Select></Col>
            </Row>
            <Row gutter={20} style={{padding:"20px"}}>
                <Col offset={18} span={6}> <Button tabIndex={1} type="primary" block size="large" onClick={this.handleConfirm}>Confirm Sales Details</Button></Col>
            </Row>
        </div> );
    }
}
const mapStateToProps = state => {
    return {
        salesPersonVehicles : state.salesPersonVehicle.salesPersonVehicles
    }
}
const mapDispatchToProps = dispatch => {
    return {
        fetchSalesPersonVehicles : (date) => dispatch(fetchSalesPersonVehicles(date))
    }
}


export default connect(mapStateToProps , mapDispatchToProps)(SalesPersonDetails);