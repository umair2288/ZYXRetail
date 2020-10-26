import React , {Component, Fragment} from 'react'
import { Table, Button, Select, Modal, Spin, message } from 'antd'
import {connect} from 'react-redux'
import Axios from 'axios'
import keys from '../../../../keys'
import { fetchWarehouses } from '../../../../redux/warehouses/actions/actionCreators'



class Vehicles extends Component{


    state = {
        loading: false,
        vehicles : [],
        warehouses : [],
        modal_visible : false,
        from_vehicle : null,
        to_warehouse : null,
    }

    componentDidMount() { 
        this.setState({
            loading: true
        })
        Axios.get(
            `${keys.server}/warehouse/stock-vehicles/`
        )
        .then(
            result => {
                this.setState({
                    loading:false,
                    vehicles: result.data
                }, () => console.log(this.state))
            }
        )
        .catch(
            err => {
                this.setState(
                    {
                        loading:false,
                        error: err
                    } , () => console.log(this.state)
                )
            }
        )
    }


    setWarehouseOptions = (data) =>{
        this.setState(
            {
                warehouses: data
            },() => console.log(this.state)
        )
    }

    formatTableData = () => {
        const data = this.state.vehicles.filter( vehicle => vehicle.entity === "ROYALMARKETING")
        
        return data.map(
            (vehicle, index) => {
                return {
                    key:index,
                    vehicle_no : vehicle.vehicle_no,
                    name : vehicle.name,
                    id:vehicle.id
                }
            }
        )
    }





    unloadVehicle = (id) =>{

        

    }


    columns = [
        {
            key: "no",
            dataIndex: "vehicle_no",
            title : "Vehilce No"
        }
        ,

        {
            key: "name",
            dataIndex: "name",
            title : "Name"
        }
        ,
        {
            key:"id",
            dataIndex: "id",
            title:"",
            render: id => <Button type="danger" id={id} onClick={this.onUnloadClicked}>Unload</Button>
        }

    ]

    onUnloadClicked = (event) => {
        this.setState({from_vehicle: parseInt(event.target.id) , modal_visible :true}, 
        () => {
            this.props.fetchWarehouses()
        }
        )
    }


    warehouseChanged = (value) => {
        this.setState({
            to_warehouse : parseInt(value)
        }, () => console.log(this.state))
    }

    handleOk = () => {

        this.setState({
            loading:true,
            modal_visible:false
        })

        if(this.state.to_warehouse){
        Axios.post(
            `${keys.server}/warehouse/vehicle/unload-vehicle/`
            , {
                from_vehicle : this.state.from_vehicle,
                to_warehouse : this.state.to_warehouse
            }
        )
        .then(
            result => {
                if(result.data.success){
                    this.setState({
                        loading:false

                    }, () => {
                        message.success(result.data.message)
                    })
                }else{
                    this.setState({
                        loading:false

                    }, () => {
                        message.error(result.data.message)
                    })
                }
            }
        )
        .catch(
            err => {
                this.setState({
                    loading:false,
                    error : err
                }, () => {
                    message.error(this.state.error)
                })
            }
        )
        }else{
            message.error("Please select a warehouse")
            this.setState({
                loading:false
            })
        }

    }

    handleCancel = () => {
        this.setState(
            {
                modal_visible : false,
                from_vehicle : null,
               
            }
        )
    }


    render(){

      return (

       <Spin spinning={this.state.loading || this.props.warehouses.loading} > 
        <Fragment>
        
        <Table dataSource = {this.formatTableData()}  columns= {this.columns}/> 
        
        <Modal
            title="Vehicle Unloading"
            visible={this.state.modal_visible}
            
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            >
            <h3>Select Warehouse to unload the products</h3>
            <Select onChange={this.warehouseChanged} style={{width:"80%"}}>
                    {
                        this.props.warehouses.warehouses.map(
                        warehouse => <Select.Option value = {warehouse.id} > {warehouse.title}</Select.Option>
                        )
                    }
            </Select>
            </Modal>   
        </Fragment>
      </Spin>   
      
      )

    }

}

const mapStateToProps = (state) => {
    return {
        warehouses: state.warehouses
    }
}

const mapDispachToProps = dispatch => {
    return {
        fetchWarehouses : () => dispatch(fetchWarehouses())
    }
}



export default connect(mapStateToProps,mapDispachToProps)(Vehicles)