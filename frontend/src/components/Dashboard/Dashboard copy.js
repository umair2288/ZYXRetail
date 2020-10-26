import React ,{Component} from 'react';
import * as titleActions from '../../Actions/TitleActions'
import QrReader from 'react-qr-reader'
import beepSound from '../../assets/beep-07.wav'

class Dashboard extends Component{

   state = {
       result : 'No result',
       delay : 1000
   }

    componentDidMount(){
        titleActions.changeTitle("Dashboard")
        this.beep = new Audio(beepSound)

    }
    handleScan = (data) => {
        if(data != null){
            this.beep.play()
            this.setState({
                result: data,
              })
        }
        return
        
      }
      handleError(err){
        console.error(err)
      }

    render(){
        // const previewStyle = {
        //     height: 'auto',
        //     width: '150%',
        //   }
        return (<div>
            <h2> Dashboard </h2>
        <QrReader
          delay={this.state.delay}
          onError={this.handleError}
          onScan={this.handleScan}
          style = {{width : '50%'}}
          />
        <p>{this.state.result}</p>
      </div>)
    }
}

export default Dashboard
