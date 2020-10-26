import React, { Component } from 'react';
import Dashboard from './screens/Dashboard';
import Report from './screens/Report';
import TopBrandBar from './components/TopBrandBar';
import { Route, BrowserRouter, Redirect } from 'react-router-dom';
import { Row , Col} from 'antd'
import queryString from 'query-string'
import Sales from './screens/Sales';
import Inventory from './screens/Inventory';
import Home from './screens/Home';
import ReturnOrderScreen from './screens/ReturnOrderScreen';
import Products from './screens/Products'
import VehiclesScreen from './screens/VehiclesScreen';
import Order from './screens/Order';
import CustomerProfile from './screens/CustomerProfile'
import { connect } from 'react-redux';
import CardToPrint from './components/CardToPrint';




class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (            
        <Row>
            <Col span={24}>
                
                <TopBrandBar/>
                <BrowserRouter>
                    <Route path="/" exact render={props => <Home {...props} redirect to="/dashboard"/>} />
                    <Route path="/dashboard" exact render={props => <Dashboard {...props}/>} />    

                    {
                    this.props.selectedReport && <Route path="/report/:type"exact render={props => <Report {...props.history} {...queryString.parse(props.location.search)} {...props.match.params}/>} />     
                                   
                    }
                    {/* Sales */}
                    <Route path="/salesandcollection" exact render={props => <Sales {...props}/>} />  
                    <Route path="/returnorders" exact render={props => <ReturnOrderScreen {...props}/>} />
                    <Route path="/sales/order/:invoice_id" exact render={props => <Order {...props}/>} />
                    
                    {/* Inventory */}
                    <Route path="/products" exact render={props => <Products {...props}/>} />
                    <Route path="/vehicles" exact render={props => <VehiclesScreen {...props}/>} />
                    <Route path="/inventory" exact render={props => <Inventory {...props}/>} /> 

                     {/* customer profile */}
                     <Route path="/customers/:id" exact render={props => <CustomerProfile {...props}/>} />
                     <Route path="/cardtoprint" exact render={props => <CardToPrint {...props}/>} />
                </BrowserRouter>       
            </Col>
        </Row>
        );
    }
}

const mapStateToProps = state =>( {
    selectedReport : state.reports.selectedReport
})


export default connect(mapStateToProps,null)(Main);