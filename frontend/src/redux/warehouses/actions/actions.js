import { FETCH_WAREHOUSES_REQUEST, FETCH_WAREHOUSES_SUCCESS, FETCH_WAREHOUSES_FAILED } from "./types"



export const fetchWarehousesRequest = ()=>{
    return {
        type : FETCH_WAREHOUSES_REQUEST
    }
}


export const fetchWarehousesSuccess = (warehouses) => {
    return {
        type : FETCH_WAREHOUSES_SUCCESS,
        payload : warehouses
    }
}

export const fetchWarehousesFailed = (error) => {
    return {
        type: FETCH_WAREHOUSES_FAILED,
        payload : error
    }
}

