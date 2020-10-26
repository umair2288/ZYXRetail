import thunk from 'redux-thunk'
import axios from 'axios'       
import keys from '../../../keys'
import { fetchReportsRequest, fetchReportsSuccess, fetchReportsFailed } from './actions'

export const fetchReports = (successCallback=()=>{} , errorCallback=()=>{})=> {

    return dispatch => {
        dispatch(fetchReportsRequest())
        axios.get(`${keys.server}/analytics/reports/`)
        .then(
            response => {
                dispatch(fetchReportsSuccess(response.data))
                successCallback()
            }
        )
        .catch(
            error => {
                console.error(error)
                dispatch(fetchReportsFailed(error))
                errorCallback()
            }
        )
    }
}


