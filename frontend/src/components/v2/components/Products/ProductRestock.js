import React, {Component} from 'react'
import {Form , Input , Select, Row, Col ,InputNumber, Button, message ,Switch ,Modal} from 'antd'
import Axios from 'axios'
import keys from '../../../../keys'
import fetchProducts from '../../../../redux/product/action/actionCreators'
import { connect } from 'react-redux'
import { Table } from 'antd'
import { Drawer } from 'antd'
import { fetchSuppliers } from '../../../../redux/suppliers/actions/actionCreators'
import { fetchWarehouses } from '../../../../redux/warehouses/actions/actionCreators'


const {Option} = Select

class ProductRestock extends Component{

    state = {
        modal_visible : false,
        modal_loading : false,
        warehouse_options:[],
        freeIssues : [],
        supplier_options:[],
        data:{
            product_id : null,
            number_of_items : null,
            cost_price : 0,
            sell_price : null,
            initial_payment:null
        }

    }

    componentDidMount(){
        this.props.fetchProducts()
        this.props.fetchSuppliers()
        this.props.fetchWarehouses()
        Axios.get(`${keys.server}/warehouse/warehouses`)
        .then(
            result => {
                this.setWarehouseOptions(result.data.filter(wh => wh.entity === "ROYALMARKETING"))
            }
        )
        .catch(
            err => {
                message.error("Loading warehouses failed")
                console.error(err)
            }
        )
   
    }

    

    setWarehouseOptions = (data) =>{
        this.setState(
            {
                warehouse_options: data
            },() => console.log(this.state)
        )
    }
      
    setSupplierOptions = (data) =>{
        this.setState(
            {
                supplier_options: data
            },() => console.log(this.state)
        )
    }
      

    displayRender(label) {
        return label[label.length - 1];
    }
   

     
    onChange = (value) =>{
          this.setState((prevState)=>{
            
                return  {  
                                data: {
                            ...prevState.data,
                            product_id : value[1]
                        }
                }
            
          },
           () => console.log(this.state)
          )
      }

    numberOfPiecesChanged = (value) =>{
        this.setState((prevState) =>
            {
                return {
                    data:{
                      
                            ...prevState.data,
                            number_of_items : value
                      
                    }
                }

            }, ()=> console.log(this.state)
        )
    }

    costPriceChanged = (value) =>{
        this.setState((prevState) =>
            {
                return {
                    data:{
                      
                            ...prevState.data,
                            cost_price : value
                      
                    }
                }

            }, ()=> console.log(this.state)
        )
    }

    sellPriceChanged = (value) =>{
        this.setState((prevState) =>
            {
                return {
                    data:{       
                            ...prevState.data,
                            sell_price : value                  
                    }
                }

            }, ()=> console.log(this.state)
        )
    }

    initialPaymentChanged = (value) =>{
        this.setState((prevState) =>
            {
                return {
                    data:{       
                            ...prevState.data,
                            initial_payment : value                  
                    }
                }

            }, ()=> console.log(this.state)
        )
    }

    warehouseSelectChanaged = (value) => {
        this.setState((prevState) =>
            {
                return {
                    data:{       
                            ...prevState.data,
                            warehouse_id : value                  
                    }
                }

            }, ()=> console.log(this.state)
        )
    }

    supplierSelectChanaged = (value) =>{
        this.setState((prevState) =>
            {
                return {
                    data:{       
                            ...prevState.data,
                            supplier_id : value                  
                    }
                }

            }, ()=> console.log(this.state)
        )
    }

    addProductBatchRequest = (data,successCallback,errorCallback) => {
        this.setState({
            loading : true
        },
        ()=>{
            Axios.post(`${keys.server}/warehouse/add-product-batch/`,data)
            .then(
                reponse => {
                    successCallback()
                    this.setState({
                        loading : false
                    })
                }
            )
            .catch(
                error =>{
                    console.error(error)
                    errorCallback()
                    this.setState({
                        loading : false
                    })
                }
            )
        }
        )  
    }

    handleClick = () =>{

        if (this.props.freeIssue){
            const freeIssues = this.props.freeIssues
            const freeIssue = this.state.data
            freeIssue["is_free_issue"] = true
            freeIssues.push(freeIssue)
            this.props.setParentState(freeIssues)
            this.setState({
                data:{
                    product_id : null,
                    number_of_items : null,
                    cost_price : 0,
                    sell_price : null,
                    warehouse_id: null,
                    supplier_id : null
                }
            })      
        }else{

            const {data} = this.state
            data.free_issues = this.state.freeIssues
            console.log(data)
            if( data.product_id && data.number_of_items  && data.sell_price && data.warehouse_id && data.supplier_id ){
                message.loading("Processing...")
                this.addProductBatchRequest(data,
                    //successCallback
                   ()=>{
                        message.destroy()
                        message.success("Product batch added sucessfuly")
                        this.props.fetchProducts({limit:5})
                        this.setState( {
                            data:{
                            product_id : null,
                            number_of_items : null,
                            cost_price : 0,
                            sell_price : null,
                            warehouse_id: null,
                            supplier_id : null
                        }
                    }, () => console.log(this.state))
                   },
                   //errorCallback
                   ()=>{
                        message.destroy()
                        message.error("OOPS!,Product batch adding failed")
                   } 
                   )      
        }else{
            message.error("Some data missing! Please fill all the fields!")
        }
    }
}


    supplierNameChangedInModel = (event) => {
       this.setState({
           modal_data:{
               business_name:event.target.value
           }
       },() => console.log(this.state))
    }

    onAddSupplierBtnClicked = () => {

        console.log("add supplier button clicked")
        this.setState({
            modal_visible:true
        }, () => console.log(this.state))
    }

    createNewSupplierRequest = (data,successCallback,errorCallback) => {
        Axios.post(`${keys.server}/warehouse/suppliers/`,data)
        .then(
            response =>{
                successCallback()
            }
        )
        .catch(
            error =>{
                console.error(error)
                errorCallback()
            }
        )
    }

    handleOk = () => {
        this.setState({
            modal_loading:true
        },
         ()=> {
             this.createNewSupplierRequest(
                 {
                    business_name: this.state.modal_data.business_name
                 }
                 ,
                 () => {
                     message.success("Supplier Create Successfully")
                     this.props.fetchSuppliers()
                     this.setState({
                         modal_loading: false,
                         modal_visible: false
                     })
                 }
                 ,
                 () => {
                     message.error("Supplier creation failed")
                     this.setState({
                        modal_loading: false
                    })
                 }
             )
         }
        )
        
    }

    handleCancel = () => {
        this.setState(
            {
                modal_visible:false
            }, () => console.log(this.state)
        )
    }

    handleProductChange = (value)=>{
        const {data} = this.state
        data.product_id = value
        const product_title = this.props.products.filter(product => product.id === value)[0].title 
        data.product_title = product_title
      
        this.setState({
            ...this.state,
            data: data
        })
    }

    handleProductSearch = (value)=>{
        this.props.fetchProducts({search:value,limit:10})
    }

    removeStock = (id)=>{
        const freeIssues = this.state.freeIssues.filter((obj,index) => index !== id)
        this.setState({
            freeIssues
        },()=>console.log(this.state))
      
    }

    columns = [
        {
            key:1,
            dataIndex : "product_id",
            title : "Product ID"
        },
        {
            key:2,
            dataIndex : "product_title",
            title : "Product ID"
        }
        ,
        {
            key:3,
            dataIndex : "number_of_items",
            title : "Number of pieces"
        }
        ,
        ,
        {
            key:4,
            dataIndex : "id",
            title : "",
            render: (id) => <Button type="danger" onClick={()=>this.props.removeStock(id)}>Remove</Button>
        }
    ]
    render(){
    
        console.log(this.props)
        const options = this.props.products.map(product=> <Option value={product.id} >{product.product_code}-{product.title}</Option>)
       return( 
           <div>
            <Row gutter={20}>
                <Col span={24}>
            { this.props.freeIssue &&
                <Table 
                    size="medium"
                    style={{height:"100%"}}
                    columns ={this.columns}
                    dataSource={this.props.freeIssues.map((stock,index) => ({...stock,id:index}))}       
                />
            }
            <Form>
                <Row gutter={10}>
                    <Col span={8}>
                        <Form.Item label="Product">
                        <Select
                            showSearch
                            value={this.state.data.product_id}
                            placeholder="Product Name"
                            style={this.props.style}
                            defaultActiveFirstOption={false}
                            showArrow={false}
                            filterOption={false}
                            onSearch={this.handleProductSearch}
                            onChange={this.handleProductChange}
                            notFoundContent={null}>
                            {options}
                        </Select>
                            {/* <ProductCascader
                            onChange={this.onChange}
                            ></ProductCascader> */}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                    <Form.Item label="No Of Pieces">
                        <InputNumber  style={{width:"200px"}} min={1} value={this.state.data.number_of_items} onChange={this.numberOfPiecesChanged}></InputNumber>
                    </Form.Item>
                    </Col>
                    <Col span={8}>
                        {
                            this.props.freeIssue || 
                            <Form.Item label="Free Issue / Normal Batch">
                                <Button onClick={()=>this.setState({"addFreeIssue":true})}>Add Free Issue</Button>
                                {/* <Switch checked={this.state.freeIssue} onChange={v=>this.setState({freeIssue:v})} checkedChildren="Free Issue" unCheckedChildren="Normal Batch"  /> */}
                            </Form.Item>
                        }
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col span={8}>
                        <Form.Item label="Cost Price">
                            <InputNumber style={{width:"200px"}}
                            disabled={this.props.freeIssue}
                            min={0} 
                            formatter={value => `Rs.${value}`}
                            parser={value => value.replace("Rs.", '')}
                            value={this.state.data.cost_price} 
                            onChange={this.costPriceChanged}></InputNumber>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Sell Price" >
                            <InputNumber style={{width:"200px"}} 
                           
                            formatter={value => `Rs.${value}`}
                            parser={value => value.replace("Rs.", '')}
                            min={0} 
                            value={this.state.data.sell_price} 
                            onChange={this.sellPriceChanged}>

                            </InputNumber>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Initial Payment" >
                            <InputNumber style={{width:"200px"}} 
                         
                            formatter={value => `Rs.${value}`}
                            parser={value => value.replace("Rs.", '')}
                            min={0} 
                            value={this.state.data.initial_payment} 
                            onChange={this.initialPaymentChanged}>

                            </InputNumber>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col span={8}>
                        <Form.Item label="Warehouse">
                            <Select showSearch 
                            style={{ width: 200 }}
                            value={this.state.data.warehouse_id}
                            onChange={this.warehouseSelectChanaged}>
                                {
                                    this.props.warehouse.warehouses.map((warehouse)=>{
                                        return   <Option key={warehouse.id} value={warehouse.id}>{warehouse.title}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col> 
                    <Col span={8}>
                        <Form.Item label="Supplier">
                            <Select showSearch 
                            style={{ width: 200 }}
                            value={this.state.data.supplier_id}
                            onChange={this.supplierSelectChanaged}>
                                {
                                    this.props.supplier.suppliers.map((supplier)=>{
                                        return   <Option key={supplier.id} value={supplier.id}>{supplier.business_name}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col> 
                    <Col span={8}>
                        <Form.Item style={{marginTop:"38px"}}>
                        <Button block onClick={this.onAddSupplierBtnClicked}  type="default" icon="plus">Add new Supplier </Button>
                        </Form.Item>
                    </Col> 
                </Row>
                <Row gutter={10}>
                    <Col span={24}>
                        <Button block type="primary" loading={this.state.loading} htmlType="submit" size="large" onClick={this.handleClick} > Add Stock</Button>
                    </Col> 
                </Row>
            </Form>
            </Col>
    
            </Row>
           <Modal
                visible={this.state.modal_visible}
                title="Add new supplier"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            Return
                        </Button>,
                        <Button key="submit" type="primary" loading={this.state.modal_loading} onClick={this.handleOk}>
                        Submit
                        </Button>,
                    ]}>
                <Form>
                    <Form.Item label="Supplier Name">
                        <Input onChange={this.supplierNameChangedInModel}></Input>
                    </Form.Item>
                </Form>
            </Modal>
          
            <Drawer
                width={800}
                title = "Free Issues"
                visible={this.state.addFreeIssue}
                onClose = {() => this.setState({"addFreeIssue":false})}
                distoryOnClose
            >
                        
                 <ProductRestock freeIssue freeIssues={this.state.freeIssues} removeStock={this.removeStock} setParentState={(freeIssues)=>this.setState({freeIssues})}  {...this.props}></ProductRestock>
            </Drawer>
            </div>
       )
    }


}

const mapDispactToProps = dispatch =>{
    return {
        fetchProducts : (params)=>dispatch(fetchProducts(params)),
        fetchSuppliers : ()=> dispatch(fetchSuppliers()),
        fetchWarehouses : () => dispatch(fetchWarehouses())
    }
}

const mapStateToProps = state => {
    return {
        ...state.product.products,
        supplier: state.supplier,
        warehouse: state.warehouses
    }
}


export default connect(mapStateToProps,mapDispactToProps)(ProductRestock)