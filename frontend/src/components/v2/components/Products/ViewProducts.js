import React from 'react'
import { Table, Button, Input ,Row,Col, Modal, message, Form, Tag } from 'antd';

import { connect } from 'react-redux';
import fetchProducts from '../../../../redux/product/action/actionCreators';
import ProductPieceList from './ProductPieceList';

import AddProduct from './AddProduct.js';
import axios from 'axios';
import keys from '../../../../keys';




class ViewProducts extends React.Component {

   state = {
       pagination :{
           total : 0,
           current: 1,
           pageSize : 5,
       }
       ,
       search : null,
       showProductPieces:false,
       selectedBatchId: null,
       selectedProduct : null,
   }

    handleSearch = (e)=>{
        
        this.setState({
            search:e.target.value,
            pagination:{
                total : 0,
                current: 1,
                pageSize : 5,
            }
        },
        () => {
            this.props.fetchProducts({limit:this.state.pagination.pageSize,search:this.state.search})
        }

        )
    }

    componentDidMount(){
        console.log(this.props)
        this.props.fetchProducts({limit:this.state.pagination.pageSize})
        this.setState({
            pagination:{
                ...this.state.pagination,
                // total: this.props.count
            }
        },() => console.log(this.state))
    }

    onTableChange = (pagination) => {
        const {current,pageSize} = pagination
    
        this.setState({
            pagination:pagination
        })
        this.props.fetchProducts(
            {offset:(current-1)*pageSize , limit:pageSize}
        )
    }


    // componentWillMount () {
    //     productStore.on("update",()=>{
    //         this.setState({productStore:productStore.initialState},()=>console.log(this.state))
    //     })
    //     titleActions.changeTitle("View Products")
    //     dispatcher.dispatch({type:"FETCH_ALL_PRODUCTS"})
    // }

    onDelete = id => {
        this.updateProduct(id,{is_current:false})
    }




    showProductPieces = (id) => {
        this.setState({
            selectedBatchId:id,
            showProductPieces:true
        })
    }


    nestedTable = (rowdata) => {

        const columns = [
            {
                key: "batch",
                dataIndex: "batch",
                title: "Batch"
            },
            {
                key: "datein",
                dataIndex: "datein",
                title: "Date In"
            },
            {
                key: "available_pieces",
                dataIndex: "available_pieces",
                title: "Available pieces"
            },
            {
                key: "stock_type",
                dataIndex: "is_free_issue",
                title: "Stock type",
                render : (is_free_issue) => <Tag color={is_free_issue?"blue":"green"}>{is_free_issue?"Free Issue":"Normal Stock"}</Tag> 
            },
            {
                key:"button",
                dataIndex:"batch",
                title : "",
                render : (batch_id) =><Button onClick={()=>this.showProductPieces(batch_id)} > Show Product Pieces</Button>
            }
        ]

        const batches = rowdata.batches.filter(
            (rowdata) => {
                return rowdata.available_pieces !== 0
            }
        )

        const dataSource = batches.map(
            (batch) => {
                return {
                    batch: batch.id,
                    datein: batch.date_in.substring(0,10),
                    available_pieces: batch.available_pieces,
                    is_free_issue: batch.is_free_issue
                }
            }
        )

        return (
            <Table columns = {columns} dataSource = {dataSource}></Table>
        )
    }


        handleCancel = () => {

            this.setState({
               product_piece_view : false
            })
        }

        handleOk = () =>{
            this.setState({
                product_piece_view : false
             })
        }


        handleChange = (e) => {
            this.setState({
                pp_code:e.target.value
            })
        }

        updateProduct = (id , newData,successCallback=()=>{},errorCallback=()=>{}) =>{
            axios.patch(`${keys.server}/warehouse/product/${id}`,newData)
            .then(
                reponse => {
                    message.success("Product Updated")
                    successCallback()
                    this.props.fetchProducts()
                    this.setState({
                        selectedProductId:null,
                        showEditProduct:false
                    })
                }
            )
            .catch(
                err =>{
                    message.error("Product update failed")
                    errorCallback()
                    console.error(err)
                }
            )
        }



    render(){
        const columns = [
            {
                title : "ID",
                dataIndex : "id",
                key:"id"
            },
            {
                title: "Code",
                dataIndex: "product_code",
                key: "product_code"
            }
            ,
            {
                title : "Title",
                dataIndex : "title",
                key:"title"
            },
            {
                title : "Category",
                dataIndex : "category.title",
                key:"category"
            },
            {
                title: "Available No of Pieces",
                dataIndex: "no_of_pieces",
                key: "no_of_pieces"
            },

            {
                render : (product) => <Button  onClick = {()=>this.setState({showEditProduct:true , selectedProduct:product})}>Edit</Button>
            },
            {
                render : (product) => <Button onClick = {()=>this.onDelete(product.id)} type = "danger" >Delete</Button>
            }
        ]

        const {products} = this.props
        let newProducts = []
        for (let product of products){
            if(product.is_current){
                newProducts.push({
                    ...product , 
                    key:product.id,
                    no_of_pieces: product.batches.reduce((sum,value) => {
                        return sum + value.available_pieces
                    },0)
                })
            }
        }
        console.log(newProducts)
        return (

            <>
                <Row  gutter={10} >
                    <Col span={24}>
                        <Form layout="inline">  
                            <Form.Item label="Search">
                                <Input style={{width:"100%"}} value={this.state.search} onChange={this.handleSearch} placeholder="Product Name"/> 
                            </Form.Item>         
                        </Form>
                    </Col>
                </Row>
                <Row gutter={[10,20]}>
                <Table
                    rowKey={row=>row.id}
                    loading = {this.props.loading}
                    columns = {columns}
                    expandedRowRender = {this.nestedTable}
                    dataSource = {newProducts}
                    pagination = {{...this.state.pagination,"total":this.props.count}}
                    onChange = {this.onTableChange}
                />
                </Row>
                <Modal
                    title="Product Piece List"
                    visible={this.state.showProductPieces}
                    onCancel={()=>this.setState({showProductPieces:false})}
                    footer={()=><Button onClick={()=>this.setState({showProductPieces:false})}>Close</Button>}
                    destroyOnClose
                    >
                    <ProductPieceList batch={this.state.selectedBatchId} ></ProductPieceList>
                </Modal>
                <Modal
                    title = "Edit Product"
                    visible = {this.state.showEditProduct}
                    destroyOnClose
                    onCancel = {()=>this.setState({showEditProduct:false,selectedProductId:null})}
                    footer = {<Button onClick={()=>this.setState({showEditProduct:false,selectedProductId:null})}>Cancel</Button>}
                >
                    <AddProduct edit product={this.state.selectedProduct} updateProduct ={(newData) => this.updateProduct(this.state.selectedProduct.id,newData) }/>
                </Modal>
               
            </>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        fetchProducts : (params) => dispatch(fetchProducts(params))
    }
}

const mapStateToProps = state =>{
    return {
        ...state.product.products
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ViewProducts)