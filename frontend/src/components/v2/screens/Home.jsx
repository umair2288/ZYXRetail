import React,{Component} from 'react'
import {Redirect} from 'react-router-dom'



class Home extends Component{


    renderRedirect =() =>{
        if (this.props.redirect) {
            return <Redirect to={this.props.to} />
        }
    }

    render(){
        return <> {this.renderRedirect()}  </>
    }
}

export default Home