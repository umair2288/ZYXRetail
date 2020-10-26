import * as types from '../action/types'


const initialState = {
    loading : false,
    count: 0,
    products : [],
    error : null
}


const productsReducer = (state = initialState , action) => {

    switch(action.type){

        case types.FETCH_PRODUCTS_REQUEST:{
            return {
                ...state,
                loading : true
            }
        }
        case types.FETCH_PRODUCTS_SUCCESS :{
            return {
                ...state,
                loading : false,
                products : action.payload.results,
                count: action.payload.count
            }
        }
        case types.FETCH_PRODUCTS_FAILED :{
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        }
        default:{
            return {
                ...state
            }
        }
    }
}



export default productsReducer


