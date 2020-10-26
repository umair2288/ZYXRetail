import React from 'react'
import { Form, Input, Select, Button } from 'antd';
import productStore from '../../store/ProductsStore';
import dispatcher from '../../dispatcher/dispatcher';

const {Option} = Select

class EditProduct extends React.Component {

    state = {
        productStore : productStore.initialState,

    }

    componentWillMount () {
        productStore.on('update',()=>{
            this.setState({productStore:productStore.initialState})
        })

        dispatcher.dispatch({type : "FETCH_ALL_PRODUCTS"})
        dispatcher.dispatch({type : "FETCH_ALL_CATEGORIES"})
    }

    onSubmit = e => {
        e.preventDefault()
        dispatcher.dispatch({type:"UPDATE_PRODUCT",id : this.props.match.params.prid,value:this.state})
    }

    render(){

        const {products,categories,loading} = this.state.productStore

        const index = products.findIndex(product => product.id === this.props.match.params.prid)

        const product = products[index]

        return(
            !loading &&
            <div>
                <Form onSubmit = {this.onSubmit} >
                    <Form.Item label = "Title" >
                        <Input name = "title" onChange={(e)=>this.setState({[e.target.name]:e.target.value})} defaultValue = {product.title} />
                    </Form.Item>
                    <Form.Item label = "Category" >
                        <Select name = "category" onChange={(value)=>this.setState({category:value})} defaultValue = {product.category.id} >
                        {categories.map((category,i)=>
                            <Option key = {i} value = {category.id} >{category.title}</Option>  
                        )}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType = "submit" type = "primary"  >
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default EditProduct