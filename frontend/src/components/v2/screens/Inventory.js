import React, { Component } from 'react';
import {  Row , Select} from 'antd';
import TopNavBar from '../components/TopNavBar';



class Inventory extends Component {

  

    navigate = (link) =>{
        this.props.history.push(link)
    }
   
    render() { 
        return ( 
            <>
            <TopNavBar navigate={this.navigate} title={"Inventory"}/>
                <Row>
                
                </Row>
            </>
         );
    }
}
 
export default Inventory;