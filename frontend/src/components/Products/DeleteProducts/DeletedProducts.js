import React from 'react'
import { Table, Button } from 'antd';
import { connect } from 'react-redux';
import {fetchProducts} from '../../../redux/product/action/actionCreators'
import { fetchDeletedProducts } from '../../../redux/product/action/actionCreators';
import { updateProduct } from '../../../redux/product/action/actionCreators';
import { message } from 'antd';

class DeletedProducts extends React.Component {

    state = {
        productStore : []
    }

    componentDidMount(){
        this.props.fetchDeletedProducts({limit:10})
    }

    // componentWillMount () {
    //     productStore.on("update",()=>{
    //         this.setState({productStore:productStore.initialState})
    //     })
    //     titleActions.changeTitle("View Products")
    //     dispatcher.dispatch({type:"FETCH_ALL_PRODUCTS"})
    // }

    onRestore = id => {
        this.props.updateProduct(id,{is_current:true},
            ()=>{
                this.props.fetchDeletedProducts()
                this.props.fetchProducts()
            },
            ()=>{
                message.error("Product restore failed")
            }
            )

        // dispatcher.dispatch({type:"UPDATE_PRODUCT",id,value:{is_current:true}})
       
    }

    onEdit = id => {
        this.props.history.push('/products/'+id)
    }

    render(){
        console.log(this.props)

        const columns = [
            {
                title : "ID",
                dataIndex : "id"
            },
            {
                title : "Title",
                dataIndex : "title"
            },
            {
                title : "Category",
                dataIndex : "category.title"
            },
         
            {
                render : (product) => <Button onClick = {()=>this.onRestore(product.id)} type = "primary" >Restore</Button>
            }
        ]

        const {deletedProducts} = this.props
        let newProducts = []
        for (let product of deletedProducts){
            if(!product.is_current){
                newProducts.push({...product , key: product.id})
            }
        }
        return (
            <Table      
                columns = {columns}
                dataSource = {newProducts}
            />
        )
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        fetchProducts : (params)=>dispatch(fetchProducts(params)),
        fetchDeletedProducts : (params) => dispatch(fetchDeletedProducts(params)),
        updateProduct : (id,data,successCallback,errorCallbck) => dispatch(updateProduct(id,data,successCallback,errorCallbck))
    }
}

const mapStateToProps = state =>{
    return {
        ...state.product.deletedProducts
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(DeletedProducts)