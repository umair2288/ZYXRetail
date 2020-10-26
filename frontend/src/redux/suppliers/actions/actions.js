
import { FETCH_SUPPLIERS_REQUEST, FETCH_SUPPLIERS_FAILED, FETCH_SUPPLIERS_SUCCESS } from "./types"



export const fetchSuppliersRequest = ()=>{
    return {
        type: FETCH_SUPPLIERS_REQUEST
    }
}

export const fetchSuppliersSuccess = (suppliersList)=>{
    
    return {
        type : FETCH_SUPPLIERS_SUCCESS,
        payload : suppliersList
    }
}

export const fetchSuppliersFailed = (error)=>{
    return {
        type : FETCH_SUPPLIERS_FAILED,
        payload : error
    }
}