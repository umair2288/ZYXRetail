import React, { Component } from 'react';
import { Tabs } from 'antd';
import AddSale from './AddSale/AddSale'

import AddCollection from './AddCollection.js/AddCollection';
import AddCustomerWiz from '../AddCustomer/AddCustomerWiz';
import ViewSales from '../v2/components/Sales/ViewSales';


const {TabPane} = Tabs

class SalesAndCollection extends Component {
    
    state = {
        activeTab : "1" 

    }

    navigateToAddSaleTab=(nic)=>{
        this.setState(
           {
                activeTab : "2",
                customerNIC : nic 
            }
            , () => console.log(this.state)      
        )
    }

    navigateToViewSales = () =>{
        this.setState({
            activeTab : "4"
        })
    }

    render() { 
        return ( 
        <div>
            <Tabs onChange={(key)=>this.setState({activeTab:key})} activeKey={this.state.activeTab} defaultActiveKey={this.state.activeTab}>
                <TabPane key="1" tab="Add Collection">
                    <AddCollection></AddCollection>
                </TabPane>
                <TabPane key="2" tab="Add Sale">
                    <AddSale navigateToViewSales={this.navigateToViewSales} customerNIC={this.state.customerNIC} {...this.props}></AddSale>
                </TabPane>
                <TabPane key="3" tab="Add Customer">
                    <AddCustomerWiz navigateToAddSale={this.navigateToAddSaleTab} {...this.props}></AddCustomerWiz>
                </TabPane>
                <TabPane key="4" tab="View Sales">
                   <ViewSales/>
                </TabPane>                      
            </Tabs>
        </div>  );
    }
}
 
export default SalesAndCollection;