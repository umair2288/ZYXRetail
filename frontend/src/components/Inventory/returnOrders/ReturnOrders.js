import React, { Component } from 'react';
import CreateReturnOrderMain from './CreateReturnOrderMain';
import { Tabs } from 'antd';
import ViewReturnOrders from './ViewReturnOrders';

const {TabPane} = Tabs
class ReturnOrders extends Component {
   



    render() { 
        return ( 
        <Tabs>
            <TabPane tab="View Return Orders" key={0} >
                <ViewReturnOrders />
            </TabPane>
            <TabPane tab="Create Return Order" key={1} >
                <CreateReturnOrderMain />
            </TabPane>
        </Tabs>
        
        );
    }
}
 
export default ReturnOrders;