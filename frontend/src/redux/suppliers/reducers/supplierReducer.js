import *  as types from '../actions/types'


const initialState = {
    suppliers : [],
    loading : false,
    error : null
}


const supplierReducer = (state=initialState,action) => {

    switch(action.type){
        case types.FETCH_SUPPLIERS_REQUEST:{
            return {
                ...state,
                loading:true
            }
        }
        case types.FETCH_SUPPLIERS_SUCCESS :{
            
            return {
                ...state,
                suppliers: action.payload,
                loading:false
            }
        }
        case types.FETCH_SUPPLIERS_FAILED : {
            return {
                ...state,
                error: action.payload,
                loading:false
            }
        }
        default :{
            return {
                ...state
            }
        }

    }
}

export default supplierReducer