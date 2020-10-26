import * as types from '../actions/types'

const initialState = {
    loading : false,
    token : window.localStorage.getItem("token"),
    name : window.localStorage.getItem("name"),
    error : null
}


const authReducer = (state = initialState , action) => {

    switch(action.type){
        case types.LOGIN_REQUEST:{
            return {
                ...state,
                loading : true
            }
        }
        case types.LOGIN_SUCCESS :{
           console.log(action.payload)
            if (action.payload.remember){
                window.localStorage.setItem("token",action.payload.token)
                window.localStorage.setItem("name",action.payload.name)
            }
            return {
                ...state,
                loading : false,
                ...action.payload
            }
        }
        case types.LOGIN_FAILED :{
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        }

        case types.LOGOUT : {
            window.localStorage.clear()
            return {
                loading : false,
                token :null,
                name : null,
                error : null
            }
        }

        default:{
            return {
                ...state
            }
        }
    }
}



export default authReducer


