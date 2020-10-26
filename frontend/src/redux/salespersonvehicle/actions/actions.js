import { FETCH_SALES_PERSON_VEHICLES_FAILED , FETCH_SALES_PERSON_VEHICLES_REQUEST ,FETCH_SALES_PERSON_VEHICLES_SUCCESS} from "./types"



export const fetchSalesPersonVehiclesRequest = () => {
    return {
        type : FETCH_SALES_PERSON_VEHICLES_REQUEST
    }
}


export const fetchSalesPersonVehiclesSuccess = (data) => {
    return {
        type : FETCH_SALES_PERSON_VEHICLES_SUCCESS,
        payload : data
    }
}


export const fetchSalesPersonVehiclesFailed = (error) => {
    return {
        type : FETCH_SALES_PERSON_VEHICLES_FAILED,
        payload : error
    }
}