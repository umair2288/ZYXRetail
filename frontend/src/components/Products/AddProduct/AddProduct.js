import React from 'react'
import { Form, Input, Select, Button, message, } from 'antd';
const {Option} = Select

class AddProduct extends React.Component {

    state = {
        productStore : productStore.initialState,
        category : null
    }

   

    catChangeHandler = category => {
        this.setState({category})
    }

    onSubmit = e => {
        e.preventDefault()
        if(this.state.category === null){
            message.error("Select the category")
            return
        }

        dispatcher.dispatch({type:"ADD_PRODUCT",value : {title : this.state.title,category : this.state.category}})
    }

    render(){
        const {categories} = this.state.productStore
        return (
            <Form id="add-product-form" onSubmit = {this.onSubmit} >
                <Form.Item label = "Title" >
                    <Input name = {"title"} placeholder={"Product Name"} onChange = {(e)=>this.setState({[e.target.name]:e.target.value})} required />
                </Form.Item>
                <Form.Item label = "Category" >
                    <Select
                        placeholder = "Select a Category..."
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        onChange = {this.catChangeHandler}
                        
                    >
                    {categories.map((category,i)=>
                        <Option  key = {category.id} value = {category.id} >{category.title}</Option>    
                    )} 
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button htmlType = "submit" type = "primary" >Add Product</Button>
                </Form.Item>
            </Form>
        )
    }
}

export default AddProduct