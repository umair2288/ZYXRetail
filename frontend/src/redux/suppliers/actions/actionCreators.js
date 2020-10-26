import axios from 'axios'
import thunk from 'redux-thunk'
import keys from '../../../keys'
import { fetchSuppliersRequest, fetchSuppliersSuccess, fetchSuppliersFailed } from './actions'


export const fetchSuppliers = (params={},successCallback=()=>{},errorCallback=()=>{})=>{
    return (dispatch)=>{
        dispatch(fetchSuppliersRequest())
        axios.get(`${keys.server}/warehouse/suppliers/`,{params})
        .then(
            response => {
                dispatch(fetchSuppliersSuccess(response.data))
                successCallback()
            }
        )
        .catch(
            err =>{
                dispatch(fetchSuppliersFailed(err))
                errorCallback()
            }
        )
    }
    
}

