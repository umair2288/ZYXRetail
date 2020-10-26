import React , {Component} from 'react'
import SalesTable from '../ViewSales/SalesTable'



class ProductList extends Component{

  
    handleViewInstalmentPlan = (id) => {
        console.log(id)
        console.log(this.props)
        this.props.history.push('/instalmentplan/'+id)
    }

    render(){
        return(
            <div>
                <h3>Sales Data</h3>
                    <SalesTable handleViewInstalmentPlan = {this.handleViewInstalmentPlan} customer_id = {this.props.CustomerID} ></SalesTable>
                </div>
        )
            
    }
}

export default ProductList;