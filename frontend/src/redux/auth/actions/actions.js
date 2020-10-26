import { LOGIN_REQUEST , LOGIN_SUCCESS , LOGIN_FAILED, LOGOUT} from "./types"
import { connect } from "react-redux"



export const loginRequest=()=>{
    console.log("sending request..")
    return {
        type : LOGIN_REQUEST
    }
}


export const loginSuccess=(authData,remember)=>{
    console.log(authData)
    return {
        type : LOGIN_SUCCESS,
        payload : {...authData,remember}

    }
}

export const loginFailed=(error)=>{
    return {
        type : LOGIN_FAILED,
        payload : error

    }
}

export const logout = () =>{
    return {
        type : LOGOUT
    }
}