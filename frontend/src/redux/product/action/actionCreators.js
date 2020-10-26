import { 
        fetchProductsRequest, fetchProductsSuccess,fetchProductsFailed,
        fetchCategoriesRequest,fetchCategoriesSuccess, fetchCategoriesFailed, addCategoryRequest,
        fetchDeletedProductsRequest , fetchDeletedProductsSuccess , fetchDeletedProductsFailed  } from "./actions"
import axios from 'axios'
import keys from "../../../keys"
import { updateProductRequest } from "./actions"
import { updateProductSuccess } from "./actions"
import { updateProductFailed } from "./actions"





 export const fetchProducts  = (queryParams={"limit":20},successCallback=()=>{},errorCallback=()=>{}) =>{
    return dispatch =>{
        dispatch(fetchProductsRequest())
        axios.get(`${keys.server}/warehouse/products/`,{params:{...queryParams}})
        .then(
            response => {
                console.log(response)
                const data = response.data
                console.log(data)
                dispatch(fetchProductsSuccess(data))
                successCallback()
            }
        )
        .catch(
            err=>{
                console.error(err)
                dispatch(fetchProductsFailed(err))
                errorCallback()
            }
        )
    }

}

export const updateProduct = (id,data, successCallback=()=>{} , errorCallback=()=>{})=>{
    return dispatch =>{
        dispatch(updateProductRequest())
        axios.patch(`${keys.server}/warehouse/product/${id}`,{...data})
        .then(
            response => {
                dispatch(updateProductSuccess())
                successCallback()
            }
        )
        .catch(
            err=>{
                console.error(err)
                dispatch(updateProductFailed())
                errorCallback()
            }
        )

    }
}

export const fetchDeletedProducts = (queryParams={"limit":10 },successCallback=()=>{},errorCallback=()=>{}) => {
    return dispatch =>{
        dispatch(fetchDeletedProductsRequest())
        axios.get(`${keys.server}/warehouse/products/`,{params:{...queryParams , deleted:"yes"}})
        .then(
            response => {
                console.log(response)
                const data = response.data
                console.log(data)
                dispatch(fetchDeletedProductsSuccess(data))
                successCallback()
            }
        )
        .catch(
            err=>{
                console.error(err)
                dispatch(fetchDeletedProductsFailed(err))
                errorCallback()
            }
        )


    }
}

export const fetchCategories  = (params={},successCallback=()=>{},errorCallback=()=>{}) =>{

    return dispatch =>{
        dispatch(fetchCategoriesRequest())
        axios.get(`${keys.server}/warehouse/product/category`,{params:{...params}})
        .then(
            response => {
                const data = response.data
                dispatch(fetchCategoriesSuccess(data))
                successCallback()
            }
        )
        .catch(
            err=>{
                dispatch(fetchCategoriesFailed(err))
                console.error(err)
                errorCallback()
            }
        )
    }

}

//not completed
export const addCategory = (data) => {
    return dispatch => {
        dispatch(addCategoryRequest())
        axios.post()
    }
}


export default fetchProducts