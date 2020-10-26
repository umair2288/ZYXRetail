import React, { Component } from 'react';
import {  Row , Select , Col , Tabs} from 'antd';
import TopNavBar from '../components/TopNavBar';
import MoveProducts from '../../Products/MoveProducts/MoveProducts';
import Vehicles from '../components/ViewVehicles/Vehicles';
import AssignVehicle from '../components/AssignVehicle/AssignVehicle';



const {TabPane} = Tabs

class VehiclesScreen extends Component {

    navigate = (link) =>{
        this.props.history.push(link)
    }
   
    render() { 
        return ( 
            <>
            <TopNavBar navigate={this.navigate} title={"Vehicles"}/>
            <Row style={{paddingTop:20}}>
                <Col offset={1} span={22}>
                    <Tabs defaultActiveKey="3">
                        <TabPane key="1" tab="Move To Vehicle">
                           <MoveProducts/>
                        </TabPane>
                        <TabPane key="2" tab="Vehicles">
                           <Vehicles/>
                        </TabPane>
                        <TabPane key="3" tab="Assign Vehicles">
                           <AssignVehicle/>
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
            </>
         );
    }
}
 
export default VehiclesScreen;