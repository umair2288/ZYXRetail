import { fetchSalesPersonVehiclesRequest , fetchSalesPersonVehiclesSuccess , fetchSalesPersonVehiclesFailed} from './actions'
import thunk from 'redux-thunk'
import Axios from 'axios'
import keys from '../../../keys'



export const fetchSalesPersonVehicles = (date) => {

    return dispatch => {
        dispatch(fetchSalesPersonVehiclesRequest())
        Axios.get(`${keys.server}/warehouse/salespersonvehicles/${date}`)
        .then(
            result => {
               dispatch(fetchSalesPersonVehiclesSuccess(result.data))
            }
        )
        .catch(err=>{
            dispatch(fetchSalesPersonVehiclesFailed(err))
        })
    }


}






