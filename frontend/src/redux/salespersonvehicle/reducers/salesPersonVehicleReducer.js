import * as types from '../actions/types'

const initialState = {
    loading : false,
    salesPersonVehicles : [],
    error : ""
}


const salesPersonVehicleReducer = (state = initialState , action) => {

    switch(action.type){

        case types.FETCH_SALES_PERSON_VEHICLES_REQUEST:{
            return {
                ...state,
                loading : true
            }
        }
        case types.FETCH_SALES_PERSON_VEHICLES_SUCCESS :{
            return {
                ...state,
                loading : false,
                salesPersonVehicles : action.payload
            }
        }
        case types.FETCH_SALES_PERSON_VEHICLES_FAILED :{
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



export default salesPersonVehicleReducer


