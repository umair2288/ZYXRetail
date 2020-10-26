import thunk from 'redux-thunk'
import { fetchWarehousesRequest, fetchWarehousesSuccess, fetchWarehousesFailed } from './actions'
import axios from 'axios'
import keys from '../../../keys'




export const fetchWarehouses = (params={},successCallback=()=>{},errorCallback=()=>{}) => {
    return dispatch => {
        dispatch(fetchWarehousesRequest())
        axios.get(`${keys.server}/warehouse/warehouses/`,{params})
        .then(
            response => {
                
                dispatch(fetchWarehousesSuccess(response.data))
                successCallback()
            }
        )
        .catch(
            error => {
                console.error(error)
                dispatch(fetchWarehousesFailed(error))
                errorCallback()
            }
        )
    }
}