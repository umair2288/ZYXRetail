import React,{Component} from 'react'
import * as titleActions from '../../Actions/TitleActions'


class Profile extends Component{
   

    componentDidMount(){
        titleActions.changeTitle("Profile")
    }

    render(){

        return <h1> Profile </h1>
    }
}

export default Profile;