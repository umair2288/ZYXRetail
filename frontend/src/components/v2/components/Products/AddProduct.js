import React , {Component} from 'react'
import { Form, Input, Select, Button, message, Col, Row, Modal, Table, Spin, } from 'antd';
import { connect } from 'react-redux';
import fetchProducts, { fetchCategories } from '../../../../redux/product/action/actionCreators';
import axios from 'axios'
import keys from '../../../../keys';



const {Option} = Select

class AddProduct extends Component {

    state = {
        showAddCategoryModel : false,
        addCategroyLoading : false,
        addProductLoading : false,
        category: this.props.edit && this.props.product.category.id, //form seletct
        title : this.props.edit && this.props.product.title,
        product_code : this.props.edit && this.props.product.product_code,
        category_title: null //model input
    }
    

    componentDidMount(){
        this.props.fetchCategories()      
    }

    addNewCategoryRequest=(title)=>{
        this.setState({
            addCategroyLoading:true
        })
        axios.post(`${keys.server}/warehouse/product/category/`,{title:title})
        .then(
            response =>{
                this.setState({
                    addCategroyLoading:false,
                    category_title:null,
                    category:null
                }
                ,
                ()=> this.props.fetchCategories()
                )
            }
        )
        .catch(
            err => {
                this.setState({
                    addCategroyLoading:false
                })
                console.error(err)
                message.error(err.message)
            }
        )
    }

    deleteCategoryRequest=(id)=>{
        this.setState({
            addCategroyLoading:true
        })
        axios.delete(`${keys.server}/warehouse/product/category/${id}`)
        .then(
            response =>{
                this.setState({
                    addCategroyLoading:false
                }
                ,
                ()=> this.props.fetchCategories()
                )
            }
        )
        .catch(
            err => {
                this.setState({
                    addCategroyLoading:false
                })
                console.error(err)
                message.error(err.message)
            }
        )
    }

    addProductRequest = (data,successCallback,errorCallback) =>{
        this.setState({
            addProductLoading:true
        })
        axios.post(`${keys.server}/warehouse/products/`,data,{headers:{Authorization : `Token ${this.props.token}`}})
        .then(({data})=>{
            message.success("Product Created Successfully")
            this.setState({
                addProductLoading:false,
                title : null,
                category : null,
                product_code : null
            })
            this.props.fetchProducts({limit:5})
            document.getElementById('add-product-form').reset()
        })
        .catch(error=>{
         
            this.setState({
                addProductLoading:false
            })
        })
    }
    
    // componentWillMount () {

    //     productStore.on('update',()=>{
    //         this.setState({productStore : productStore.initialState})
    //     })
    //     dispatcher.dispatch({type:"FETCH_ALL_CATEGORIES"})

    // }

    handleAddCategory = ()=>{ 
        if (this.state.category_title){
            this.addNewCategoryRequest(this.state.category_title)
        }    
    }
    
    handleDeleteCategory = (id)=>{
        if(id){
            this.deleteCategoryRequest(id)
        }
    }

    

    catChangeHandler = category => {
        this.setState({category})
    }

    handleAddProduct = e => {
        e.preventDefault()
        if(this.state.category === null){
            message.error("Select the category")
            return
        }
        if(this.state.title === null){
            message.error("Please enter product name")
            return
        }
        this.addProductRequest({
            title:this.state.title,
            category:this.state.category,
            product_code:this.state.product_code
        },
        ()=>{
            message.error("Product Created Failed")
            this.setState({
                title :null ,
                category:null,
                product_code:null
            })
        })
       

        // dispatcher.dispatch({type:"ADD_PRODUCT",value : {title : this.state.title,category : this.state.category}})
    }

    render(){
        // const {categories} = this.state.productStore
        const categoryTableColumns = [  {   key:"category",
                                            dataIndex:"title",
                                            title:"Category"
                                        },
                                        {   key:"id",
                                            dataIndex:"id",
                                            title:"" , 
                                            render: (id)=><Button onClick={() => this.handleDeleteCategory(id)} icon="delete" type="danger"></Button>
                                        }
                                        ,
                                    ]
        return (
            <Spin spinning={this.state.addProductLoading}>
            <Row>
            <Form id="add-product-form" onSubmit = {this.handleAddProduct} >
                <Row gutter={10}>
                    <Col span={8}>             
                        <Form.Item label="Product Code">
                            <Input name = {"product_code"} placeholder={"Product Code"} value={this.state.product_code} onChange = {(e)=>this.setState({[e.target.name]:e.target.value})} required />
                        </Form.Item>
                    </Col>
                    <Col span={16}>  
                        <Form.Item label = "Title" >
                            <Input name = {"title"} placeholder={"Product Name"} value={this.state.title} onChange = {(e)=>this.setState({[e.target.name]:e.target.value})} required />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label = "Category" >      
                    <Row gutter={10}>
                    <Col span={16}>
                        <Select
                            value={this.state.category}
                            placeholder = "Select a Category..."
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange = {this.catChangeHandler}
                            
                        >
                        {this.props.categories.map((category,i)=>
                            <Option  key = {category.id} value = {category.id} >{category.title}</Option>    
                        )} 
                        </Select>
                    </Col>
                    <Col span={8}>
                    <Button icon="plus" onClick={()=>this.setState({showAddCategoryModel:true})}  block>Add New Category</Button>
                    </Col>
                    </Row>
                </Form.Item>
                <Form.Item>
                    {this.props.edit?
                        <Button block size="large"  onClick={()=>this.props.updateProduct({"title":this.state.title,"category":this.state.category})} type = "primary" >Edit Product</Button>
                        :<Button block size="large"  htmlType = "submit" type = "primary" >Add Product</Button>
                    }
                </Form.Item>
            </Form>
            <Modal
                title="Add new cagegory"
                visible={this.state.showAddCategoryModel}
                onOk = {()=>this.setState({showAddCategoryModel:false},()=>this.props.fetchCategories())}
                onCancel = {()=>this.setState({showAddCategoryModel:false},()=>this.props.fetchCategories())}
            >
                <Row>
                    <Row style={{paddingBottom:"20px"}} gutter={10}>   
                        <Form layout="inline">            
                            <Col span={16}>                
                                <Input 
                                    value={this.state.category_title} 
                                    onChange={e=>this.setState({category_title:e.target.value})} 
                                    placeholder="Category" 
                                    style={{width:"100%"}}/>      
                            </Col>
                            <Col span={8}>               
                                <Button block onClick={this.handleAddCategory} >Add</Button>                  
                            </Col> 
                        </Form>   
                        </Row>
                    <Row>
                        <Table size="small"  
                        loading = {this.state.addCategroyLoading}
                        pagination={true}
                        columns = {categoryTableColumns}
                        dataSource={this.props.categories}/>     
                    </Row>
               </Row>
            </Modal>
        </Row>
        </Spin>
        )
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        fetchCategories : (params) => dispatch(fetchCategories(params)),
        fetchProducts : (params) => dispatch(fetchProducts(params))
    }
}

const mapStateToProps = state =>{
  return  {...state.product.categories ,
    token:state.authentication.token
}
}


export default connect(mapStateToProps , mapDispatchToProps)(AddProduct)