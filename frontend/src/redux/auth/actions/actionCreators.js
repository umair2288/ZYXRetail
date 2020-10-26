import thunk from 'redux-thunk'
import Axios from 'axios'
import keys from '../../../keys'
import { loginRequest, loginSuccess, loginFailed } from "./actions"



export const login = (credentials , successCallbck , errorCallback) => {
    console.log("login called")
    return dispatch => {
        dispatch(loginRequest())
        Axios.post(`${keys.server}/user/get-auth-token/`,credentials)
        .then(
            result => {
                console.log(result)
                if(result.data.success){
                    dispatch(loginSuccess(result.data,credentials.remember))
                    successCallbck(result.data.message)

                }else{
                    throw Error(result.data.message)
                }
               
            }
        )
        .catch(err=>{
            console.error("Error")
            errorCallback(err.message)
            dispatch(loginFailed(err))
        })
    }
}

