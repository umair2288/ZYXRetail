import { FETCH_REPORTS_REQUEST, FETCH_REPORTS_FAILED, FETCH_REPORTS_SUCCESS, UPDATE_REPORTS, SELECT_REPORT } from "./types";
import { UPDATE_PRODUCT_SUCCESS } from "../../product/action/types";



export const fetchReportsRequest = () => ({type:FETCH_REPORTS_REQUEST})
export const fetchReportsSuccess = (reports) => ({type:FETCH_REPORTS_SUCCESS , payload :reports })
export const fetchReportsFailed = (error) => ({type:FETCH_REPORTS_REQUEST , payload : error })


export const updateReports = reports => ({type:UPDATE_REPORTS , payload: reports})

export const selectReport = report => ({type:SELECT_REPORT , payload : report})