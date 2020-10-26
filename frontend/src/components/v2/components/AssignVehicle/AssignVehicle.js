import React, { Component } from 'react';
import { Row , Col , message} from 'antd'
import AssignVehicleForm from './AssignVehicleForm';
import VehilceAssignments from './VehicleAssignments';
import moment from 'moment'
import keys from '../../../../keys';
import axios from'axios'


class AssignVehicle extends Component {

    state = {
        loading:false,
        date : moment(), 
        data:[]
    }

    validateFields=()=>{
        if(this.state.date && this.state.salesPersonId && this.state.vehicleId && this.state.routeId && this.state.driverId){
            return true
        }
        return false      
    }

    handleSubmit = (e) =>{
        e.preventDefault()
        console.log(e)
        console.log(this.state)

        if(!this.validateFields()){
            message.error("Please fill all fields!")
            return
        }

        axios.post(`${keys.server}/warehouse/salespersonvehicle/assign/`,
            {
                "date":this.state.date.format("YYYY-MM-DD"),
                "sales_person": this.state.salesPersonId ,
                "vehicle": this.state.vehicleId,
                "route":this.state.routeId ,
                "driver": this.state.driverId
            })
        .then(
            response =>{
                message.success("Vehicle assignment successfull")
                this.setState({
                    salesPersonId : null,
                    driverId : null ,
                    routeId : null ,
                    vehicleId : null,
                },()=>this.fetchData())
                
            }
        )
        .catch(error => {
            if(error.response.status === 400){
                message.error("Error! Seems like you are trying same assignment again.")
            }else{
                message.error(error.message)
            }
            
        })
    }

    handleDriverChange = (value) =>{
        this.setState({
            driverId:value
        })
    }
    handleSalePersonChange = (value) =>{
        this.setState({
            salesPersonId:value
        })
    }
    handleRouteChange = (value)=> {
        this.setState({
            routeId:value
        })
    }
    handleVehicleChange = (value)=> {
        this.setState({
            vehicleId:value
        })
    }

    handleDateChange = (date) => {
        this.setState({
            date : date
        },()=>{
            if(this.state.date){
                this.fetchData()
            } 
        })
        
    }

    fetchData = ()=>{
        this.setState({
            loading:true
        })
        axios.get(`${keys.server}/warehouse/salespersonvehicles/${this.state.date&&this.state.date.format("YYYY-MM-DD")}`)
        .then(
            response => {
                const formatedData = response.data.map((spv) => (
                    {   
                        "id": spv.id,
                        "vehicle_no" :spv.vehicle.vehicle_no ,
                        "sales_person": spv.sales_person.NIC ,
                        "driver": spv.driver.NIC ,
                        "route": spv.route.title
                    }))
                this.setState({
                        data:formatedData,
                        loading:false
                    },()=>console.log(this.state))
            }
        )
        .catch(
            err => {
                console.error(err)
                message.error("Data fetching failed! Please check your internet connection or contact support")
                this.setState({
                    loading:false
                })
            }
        )
    }


    componentDidMount(){
        this.fetchData()
    }

    deleteRequest = (id) =>{
        axios.delete(`${keys.server}/warehouse/salespersonvehicles/delete/${id}`)
        .then(
            response => {
                this.fetchData()
            }
        )
        .catch(
            error => {
                if (error.response.status === 500) {
                    message.error("Assignment can't be removed after sales are done")
                }else{
                    message.error(error.message)
                }
            }
        )
    }


    
    render() { 
        return ( 
        <Row gutter={20}>
            <Col span={6}>
                <AssignVehicleForm
                    handleSubmit = {this.handleSubmit}
                    handleDateChange = {this.handleDateChange}
                    handleDriverChange = {this.handleDriverChange}
                    handleRouteChange = {this.handleRouteChange} 
                    handleSalePersonChange = {this.handleSalePersonChange}
                    handleVehicleChange = {this.handleVehicleChange}

                    date = {this.state.date}
                    vehicleId = {this.state.vehicleId}
                    driverId = {this.state.driverId}
                    salesPersonId = {this.state.salesPersonId}
                    routeId ={this.state.routeId}
                />
            </Col>
            <Col span={18}>
                <VehilceAssignments 
                    loading={this.state.loading}
                    delete={this.deleteRequest}
                    data={this.state.data}
                    date={this.state.date && this.state.date.format("DD-MMM-YYYY")}
                />
            </Col>
        </Row> );
    }
}
 
export default AssignVehicle;