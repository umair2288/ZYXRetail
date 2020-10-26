import React, { Component } from 'react';
import { Col , Row, Avatar , Menu, Select, Icon, Button } from 'antd';
import { Link } from 'react-router-dom';



const {SubMenu} = Menu
class TopNavBar extends Component {

    state =  {
        current:1
    }

    onHover = (e) => {
        console.log(e.target.id)
       
    }

    links = [
       { title:"Dashboard", link:"/dashboard"},
       { title:"Sales", link:"/sales"},
       { title:"Inventory", link:"/inventory"},
    ]

    // handleLinkClick = (link) =>
    //     this.props.navigate(link)
    // }
    handleClick = (e) => {
      this.setState({current:e.key})
    }

   
    render() { 
        return ( 
            <Row gutter={5} style={{frontFamily:"Roboto" ,fontSize:"14px" , boxShadow:"rgb(229, 229, 229) 0px 2px 13px 0px"}} >
                <Col  style={{backgroundColor:"#1890ff" , height:"47.5px" , textAlign:"center"}} span={3}>
                   <div style={{ transform: "translateY(-50%)",top:"50%" , position:"relative" , color:"white"}}> {this.props.title} </div>
                </Col>
                <Col style={{height:"47.5px" }} span={21}>
                    <Row>
                        <Menu  onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
                            <Menu.Item link="dashboard"   key="dashboard"><Link to="/dashboard"> Dashboard </Link> </Menu.Item>
                            <SubMenu title="Sales">
                                {/* <Menu.Item link="customer"  key="salesandcollection"><Link to="/customer">Customer</Link></Menu.Item> */}
                                <Menu.Item link="salesandcollection"  key="salesandcollection"><Link to="/salesandcollection">  Sales & Collection </Link></Menu.Item>
                                <Menu.Item link="returnorders"  key="returnorders"><Link to="/returnorders"> Return Orders</Link></Menu.Item>
                            </SubMenu>
                            <SubMenu title="Inventory">
                                <Menu.Item link="products"  key="products"> <Link to="/products">Products</Link></Menu.Item> 
                                <Menu.Item link="vehicles"  key="vehicles"> <Link to="/vehicles"> Vehicles</Link></Menu.Item> 
                                <Menu.Item link="warehouses"  key="warehouses"><Link to="/warehouses">Warehouses</Link></Menu.Item> 
                            </SubMenu>              
                        </Menu>
                    </Row>
                </Col>
            </Row>
         );
    }
}
 
export default TopNavBar;