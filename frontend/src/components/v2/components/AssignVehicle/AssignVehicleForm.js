import React, { Component } from 'react';
import { Row, Form, DatePicker, Button, Select, Spin , message } from 'antd'
import axios from 'axios'
import keys from '../../../../keys';

const {Item} = Form
const {Option} = Select


class AssignVehicleForm extends Component {
    state ={
        loading:false,
        salesPersons : [],
        vehicles : [],
        routes : [],
        drivers : []
    }

    componentDidMount(){
        const vehicles = `${keys.server}/warehouse/stock-vehicles/`
        const routes = `${keys.server}/warehouse/routes/`
        const drivers =`${keys.server}/user/drivers/`
        const salesPersons =`${keys.server}/user/salespersons/`
        this.setState({
            loading:false
        })
        axios.all([axios.get(vehicles) ,axios.get(routes) , axios.get(drivers) , axios.get(salesPersons)])
        .then(
            axios.spread((...responses)=>{
                console.log(responses)
                const vehicles  = responses[0]
                const routes  = responses[1]
                const drivers = responses[2]
                const salesPersons = responses[3]
                this.setState({
                    salesPersons : salesPersons.data,
                    vehicles : vehicles.data,
                    routes : routes.data,
                    drivers : drivers.data,
                    loading : false
                }, () => console.log(this.state))
            }
            )
        )
        .catch((error)=>{
            message.error("Unable to load, please check internet connection or contact support!")
        })
    }

   
    render() { 
        return(
        <Spin spinning={this.state.loading}>
                <Row>
                    <Form onSubmit={this.props.handleSubmit} layout="vertical" >
                        <Item label="Date">
                            <DatePicker 
                                required
                                onChange={this.props.handleDateChange} 
                                value={this.props.date}
                                style={{width:"100%"}}
                            />
                        </Item>
                        <Item label="Sales Person">
                            <Select required value={this.props.salesPersonId} onChange={this.props.handleSalePersonChange} style={{width:"100%"}}>
                                {this.state.salesPersons.map(salesPerson => <Option key={salesPerson.id} value={salesPerson.id}>{salesPerson.NIC}-{salesPerson.full_name}</Option>)}
                            </Select>
                        </Item>
                        <Item  label="Vehicle">
                            <Select required value={this.props.vehicleId} onChange={this.props.handleVehicleChange}  style={{width:"100%"}}>
                                    {this.state.vehicles.map(vehicle => <Option  value={vehicle.id}>{vehicle.vehicle_no}-{vehicle.name}</Option>)}
                            </Select>
                        </Item>
                        <Item label="Driver">
                            <Select required value={this.props.driverId} onChange={this.props.handleDriverChange} style={{width:"100%"}}>
                               {this.state.drivers.map(driver => <Option  value={driver.id}>{driver.NIC}-{driver.full_name}</Option>)}
                            </Select>
                        </Item>
                        <Item label="Route">
                            <Select required value={this.props.routeId} onChange={this.props.handleRouteChange} style={{width:"100%"}}>
                                    {this.state.routes.map(route => <Option  value={route.id}>{route.title}</Option>)}
                            </Select>
                        </Item>
                        <Item >
                            <Button block size="large" htmlType="submit" type="primary">Assign</Button>
                        </Item>
                    </Form>      
                </Row> 
        </Spin>
        );
    }
}
 
export default AssignVehicleForm;