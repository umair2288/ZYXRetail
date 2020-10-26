import * as types from '../actions/types'


const initialState = {
    warehouses : [],
    loading:false,
    error : null
}

 const warehouseReducer = (state=initialState,action)=>{

    switch(action.type){
        case types.FETCH_WAREHOUSES_REQUEST: {
            return {
                loading : true,
                ...state
            }
        }
        case types.FETCH_WAREHOUSES_SUCCESS: {
            return { 
                ...state,
                loading :false,
                warehouses : action.payload
               
            }
        }
        case types.FETCH_WAREHOUSES_FAILED:{
            return {
             
                loading : false,
                error: action.payload,
                ...state
            }

        }
        default:{
            return {
                ...state
            }
        }
    }
}

export default warehouseReducer