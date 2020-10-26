import React, { Component } from 'react';
import {  Row , Select , Col , Tabs, PageHeader} from 'antd';
import TopNavBar from '../components/TopNavBar';
import AddProduct from '../components/Products/AddProduct'
import ProductRestock from '../components/Products/ProductRestock';
import ViewProducts from '../components/Products/ViewProducts';
import DeletedProducts from '../../Products/DeleteProducts/DeletedProducts'



const {TabPane} = Tabs
const {Option} =  Select

class Products extends Component {


    navigate = (link) =>{
        this.props.history.push(link)
    }
   
    render() { 
        return ( 
            <>
            <TopNavBar navigate={this.navigate} title={"Products"}/>
            <Row style={{paddingTop:20}}>
                <Col offset={1} span={22}>
                    <Tabs defaultActiveKey="1">
                        <TabPane key="1" tab="Products">
                            <ViewProducts/>
                        </TabPane>
                        <TabPane key="2" tab="Restock Products">
                            <Row>
                                <Col xl={{span:12 , offset:6}} lg={{span:20 , offset:2}}  md={{span:24 }} sm={{span:24 }}  xs={{span:24}}>
                                    <ProductRestock/>  
                                </Col> 
                            </Row>
                        </TabPane>
                        <TabPane key="3" tab="Add Product">
                            <Row gutter={20}>
                                <Col offset={6} span={12}>
                                    <AddProduct/>
                                </Col> 
                            </Row>    
                        </TabPane>
                        <TabPane key="4" tab="Deleted Products">
                            <Row>
                                <DeletedProducts/>  
                            </Row>    
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
            </>
         );
    }
}
 
export default Products;