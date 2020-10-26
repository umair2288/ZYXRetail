import React , {Component} from 'react'
import { Spin, Icon } from 'antd';
import Main from './v2/Main';
import Login from './v2/screens/Login';
import { connect } from 'react-redux';

class MainComponent extends Component
{
    
    render(){    
        const {token , loading} = this.props
        return !loading ? token == null ?      
                <Login/>
                : 
                <Main/>
              
                : 
                <div style = {{display:'flex',width:'100vw',justifyContent:'center',height:'100vh',alignItems:'center'}}>
                    <Spin indicator = {<Icon type = "loading" />}  spinning tip="Loading..." size="large" delay={0} />
                </div>
          
    }
}

const mapStateToProps = state => {
    const {token, loading} = state.authentication
    return {
        token : token,
        loading:loading
    }
}

export default connect(mapStateToProps,null)(MainComponent)