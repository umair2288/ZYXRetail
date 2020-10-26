import React,{Component} from 'react'
import { Button } from 'antd/lib/radio'

class ProductPieceDetails extends Component{
    
    state = {
       ...this.props
    }

    componentDidMount(){

    }

    render(){
        console.log(this.props)
        return(
            <div>
                <h1>Product:{this.props.batch.product.title}</h1>
                <span>Item Code: {this.props.item_code}</span>
                <div>{this.props.is_soled ? 
                    <span>Product is Soled
                        <Button type="link">Open Sales Details</Button>
                    </span>
                    :<span>Product unsoled</span>}
                </div> 

            </div>
        )
    }


}

export default ProductPieceDetails