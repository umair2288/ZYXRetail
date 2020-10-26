import React , {Component} from 'react'
import { Table, Button } from 'antd'
import Axios from 'axios'
import keys from '../../../keys'



class ProductPieceList extends Component{

    state = {
        data : []
    }

    // componentDidMount(){
    //     Axios.get(`${keys.server}/warehouse/product-pieces/${this.props.warehouse_id}`)
    //     .then(
    //         (response) => {
    //             this.setState(
    //                 {
    //                     data:response.data
    //                 }, () => console.log(this.state)
    //             )
    //         }
    //     ).catch(
    //         err => console.error(err)
    //     )
    // }

    formatTableData = () => {
        
        const products = this.props.productList.filter((item) => {if(item){return true}} )

        return products.map(
            (pp) => {
                
                    return {
                        key : pp.id,
                        id : pp.item_code,
                        product_name : pp.product_title,
                        product_code : pp.product_code,
                        button_id : pp.id
                    }
                
               
            }
        )
    }


    buttonClicked = (id) => {
        console.log(id)
        this.props.buttonClicked(id)
    }


    columns_with_button = [
        {
            title:"Piece ID",
            dataIndex:"id",
            key:"id"
        },
        {
            title:"Product Name",
            dataIndex:"product_name",
            key:"product_name"
        }
        ,
        {
            title:"Code",
            dataIndex:"product_code",
            key:"product_name"
        }
        ,
        {
            title:"",
            dataIndex:"button_id",
            key:"unload button",
            render : (id) => <Button id={id} onClick={(e) =>  this.buttonClicked(e.target.id)} type="danger"> Unload </Button>
        }



    ]



    columns = [
        {
            title:"Piece ID",
            dataIndex:"id",
            key:"id"
        },
        {
            title:"Product Name",
            dataIndex:"product_name",
            key:"product_name"
        }
        ,
        {
            title:"Code",
            dataIndex:"product_code",
            key:"product_code"
        }
        
    
    ]



    render(){
        console.log(this.props)
        return(
           <Table loading={this.props.loading} title={()=>this.props.title} size= "small" columns={this.props.buttonType ? this.columns_with_button : this.columns} dataSource={this.formatTableData()} />
        )
    }
}

export default ProductPieceList