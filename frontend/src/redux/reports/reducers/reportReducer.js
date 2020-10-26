import { FETCH_REPORTS_REQUEST, FETCH_REPORTS_SUCCESS, FETCH_REPORTS_FAILED, UPDATE_REPORTS, SELECT_REPORT } from "../actions/types"



const initialState = {
    selectedReport : null,
    loading : false,
    reports : [],
    error : null
}


const reportReducer = (state=initialState , action) => {

    switch(action.type){
        case FETCH_REPORTS_REQUEST:{
            return {
                ...state,
                loading:true
            }
        }
        case FETCH_REPORTS_SUCCESS:{
            return {
                ...state,
                loading :false,
                reports : action.payload
            }
        }
        case FETCH_REPORTS_FAILED:{
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        }
        case UPDATE_REPORTS:{
            return {
                ...state,
                reports : action.payload
            }
        }

        case SELECT_REPORT :{
            return {
                ...state,
                selectedReport: action.payload
            }
        }
        default :{
            return {
                ...state            
            }
        }

    }

}

export default reportReducer