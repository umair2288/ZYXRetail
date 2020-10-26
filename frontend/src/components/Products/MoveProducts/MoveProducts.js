import React , {Component} from 'react'
import { Input, Form, Select , Row , Col , Button, message} from 'antd'
import axios from 'axios'
import keys from '../../../keys'
import ProductPieceList from './ProductPieceList'
import Axios from 'axios'


const {Option} = Select

class MoveProducts extends Component {
    state = {
        warehouses:[],
        vehicles:[],
        warehouseSearch:null,
        productList : [],
        productID:null,
        warehouse_id : null,
        vehicle_id : null,
        productListVehicle:[],
        move:{
            "product_piece": null,
            "to_vehicle": null
        }
    }

    handleChange = (event)=> {
        switch(event.target.name){
            case "product_id":{
                this.setState({
                   productID: event.target.value
                },() =>
                {
                    const pp = this.state.productList.filter(
                        (pr) => {
                         return   pr.item_code === this.state.productID
                        }
                    )[0]
                    if(pp){
                        this.setState(prevState=> {
                        return   {
                            ...prevState,
                                move: {
                                    "product_piece": pp.id,
                                    "to_vehicle": prevState.vehicle_id
                                }
                                }
                                
                            }, () => console.log(this.state)
                        )  
                    }
                } 
                
                )
            }
        }
        
    }

    handleMove = (event) => {
        event.preventDefault()
        const move = {...this.state.move} //prevents double movest
        this.setState({
            loading : true,
            move : {
                "product_piece": null,
                "to_vehicle": null
            }
        },
        ()=>{
            if (move.product_piece){
                Axios.post(`${keys.server}/warehouse/product-pieces/movetovehicle`,move)
                .then(
                    response => {
                        console.log(response)
                        const pp = this.state.productList.filter((pp) => { return pp.id === response.data.product_piece})[0]
                        const warehouseList = this.state.productList.filter((pp) => { return pp.id !== response.data.product_piece})
                        const list = this.state.productListVehicle
                        list.push(pp)
                        this.setState( () => {
                            return {
                                productListVehicle: list,
                                productList:warehouseList,
                                productID:null,
                                loading:false
                            }
                        })
                    }
                )
                .catch(
                    err => {
                        console.log(err)
                        message.error("Oops!, That didn't work check your product ID again")
                        this.setState({
                            loading: false
                        })
                    }
                )}else{
                    this.setState({
                        loading: false
                    })
                }
        })
    
        
    }

    handleVehicleChange = (value) => {   
        console.log(value)
        this.setState(
            {
                vehicle_id:value
            } , () => {
                Axios.get(`${keys.server}/warehouse/product-pieces/vehicle/${this.state.vehicle_id}`)
                .then(
                    (response) => {
                        this.setState(
                            {
                                productListVehicle:response.data
                            }, () => console.log(this.state)
                        )
                    }
                ).catch(
                    err => console.error(err)
                )
            }
        )
    }

    fetchSearchWarehouse = (id,search) => {
        this.setState({
            loadingWarehouse: true
        })

        Axios.get(`${keys.server}/warehouse/product-pieces/${id}`,{params:{search}})
        .then(
            (response) => {
                this.setState(
                    {
                        productList:response.data,
                        loadingWarehouse:false
                    }, () => console.log(this.state)
                )
            }
        ).catch(
            err =>{
                console.error(err)
                this.setState({
                    loadingWarehouse:false
                })
            } 
        )
    }

    handleWarehouseSearchChange = (e) => {
        this.setState({
            warehouseSearch : e.target.value
        }
        ,
        ()=> this.fetchSearchWarehouse(this.state.warehouse_id , this.state.warehouseSearch)
        )
    }


    handleWarehouseChange = (value) => {   
        this.setState(
            {
                warehouse_id:value,
                warehouseLoading : true
            } , () => {
                message.loading("Loading...")
                Axios.get(`${keys.server}/warehouse/product-pieces/${this.state.warehouse_id}`)
                .then(
                    (response) => {
                        message.destroy()
                        this.setState(
                            {
                                productList:response.data,
                                warehouseLoading : false
                            }, () => console.log(this.state)
                        )
                    }
                ).catch(
                    err => {
                        console.error(err)
                        message.destroy()
                        this.setState({
                            warehouseLoading :false
                        })
                    } 
                    
                )
            }
        )
    }

    
    unloadProduct = (id) => {
        if(this.state.warehouse_id){
            if(id){
                Axios.post( `${keys.server}/warehouse/vehicle/unload-vehicle/${id}`
            , {
                from_vehicle : this.state.vehicle_id,
                to_warehouse : this.state.warehouse_id
            })
            .then(
                result =>{
                    if(result.data.success){
                        message.success("Product piece unloaded successfully")
                        this.handleVehicleChange(this.state.vehicle_id)
                        this.handleWarehouseChange(this.state.warehouse_id)
                    }else{
                        message.error(result.data.message)
                    }
                }
            )
            .catch(
                (err) => {
                    message.error("Oops! something went wrong, please check you internet or contact admin")
                    console.error(err)
                }
            )
            }else {
                message.error("Oops! That's not a product piece")
            }
        }else {
            message.error("Please select a warehouse before unload!")
        }
        
    }



    componentDidMount(){
        axios.all(
            [
            axios.get(`${keys.server}/warehouse/warehouses/`),
            axios.get(`${keys.server}/warehouse/stock-vehicles/`)
            ]
        ).then(
            axios.spread(
                (warehouses, vehicles ) => {
                    this.setState({
                           warehouses: warehouses.data.filter(warehouse => warehouse.entity==="ROYALMARKETING") ,
                           vehicles : vehicles.data.filter((vehicle) => vehicle.entity === "ROYALMARKETING")
                        } , () => console.log(this.state)
                    )
                }
            )
        ).catch(err => console.log(err))

    }
    render() {
      return  ( 
      <div>      
          <Form onSubmit={this.handleMove}>
          <Row gutter={10}>
            <Col span={6}>
                <Row>
                    <Form.Item label="From Warehouse">
                        <Select value={this.state.warehouse_id} onChange={this.handleWarehouseChange}>
                                {
                                    this.state.warehouses.map(
                                        (warehouse,index) => {
                                            return <Option key={index} value={warehouse.id}>{warehouse.title}</Option>
                                        }
                                    )
                                }
                        </Select>
                    </Form.Item>
                </Row>
                <Row>
                    <Form.Item label="To Vehicle">
                        <Select value={this.state.vehicle_id} onChange={this.handleVehicleChange}>
                                {
                                    this.state.vehicles.map(
                                        (vehicle,index) => {
                                        return <Option key={index} value={vehicle.id}>{vehicle.name} - {vehicle.vehicle_no}</Option>
                                        }
                                    )
                                }
                        </Select>
                    </Form.Item>           
                </Row>
                <Row>
                <Col >
                <Form.Item label="Product ID">
                    <Input required name="product_id" onChange={this.handleChange} value = {this.state.productID}></Input>
                </Form.Item>
              </Col>
              </Row>
              <Row>
              <Col >    
                    <Button block name="product_id" htmlType="submit" loading={this.state.loading} onClick={this.handleMove} > Move </Button>       
              </Col>
              </Row>
              </Col>
              <Col span={9}>
                <Row >
                    <Form>
                        <Form.Item label="Search Product">
                            <Input 
                                placeholder = "Search Product or Product Piece"
                                disabled={this.state.warehouse_id ? false : true} 
                                onChange={this.handleWarehouseSearchChange}
                                 value={this.state.warehouseSearch} ></Input>
                        </Form.Item>
                    </Form>
                </Row>
                <Row>
                    <ProductPieceList 
                        loading={this.state.loadingWarehouse}  
                        title="Product In Warehouse" 
                        productList={this.state.productList}
                    />
                </Row>
              </Col>
              <Col span={9}>
                <ProductPieceList buttonClicked = {this.unloadProduct} buttonType="unload" title="Product In Vehicle" productList={this.state.productListVehicle}/>
              </Col>
              </Row>         
          </Form>         
      </div>
      )
      
    
    }


}

export default MoveProducts