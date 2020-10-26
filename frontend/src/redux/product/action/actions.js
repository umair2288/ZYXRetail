import {    FETCH_CATEGORIES_REQUEST, FETCH_CATEGORIES_SUCCESS, FETCH_CATEGORIES_FAILED , 
            FETCH_PRODUCTS_REQUEST, FETCH_PRODUCTS_SUCCESS, FETCH_PRODUCTS_FAILED, ADD_CATEGORY_REQUEST, ADD_CATEGORY_SUCCESS, ADD_CATEGORY_FAILED,
            UPDATE_PRODUCT_REQUEST , UPDATE_PRODUCT_SUCCESS , UPDATE_PRODUCT_FAILED,
            FETCH_DELETED_PRODUCTS_REQUEST , FETCH_DELETED_PRODUCTS_SUCCESS , FETCH_DELETED_PRODUCTS_FAILED
        
        } from "./types"



export const fetchCategoriesRequest = () => {
    return {
        type : FETCH_CATEGORIES_REQUEST
    }
}

export const fetchCategoriesSuccess = (data) => {
    return {
        type : FETCH_CATEGORIES_SUCCESS,
        payload : data
    }
}

export const fetchCategoriesFailed = (error) => {
    return {
        type : FETCH_CATEGORIES_FAILED,
        payload : error
    }
}

export const fetchProductsRequest = () => {
    return {
        type : FETCH_PRODUCTS_REQUEST
    }
}

export const fetchProductsSuccess = (data) => {
    return {
        type : FETCH_PRODUCTS_SUCCESS,
        payload : data
    }
}

export const fetchProductsFailed = (error) => {
    return {
        type : FETCH_PRODUCTS_FAILED,
        payload : error
    }
}

export const updateProductRequest = () =>{
    return {
        type : UPDATE_PRODUCT_REQUEST
    }
}

export const updateProductSuccess = () =>{
    return {
        type : UPDATE_PRODUCT_SUCCESS
    }
}

export const updateProductFailed = () =>{
    return {
        type : UPDATE_PRODUCT_FAILED
    }
}



export const fetchDeletedProductsRequest = () => {
    return {
        type : FETCH_DELETED_PRODUCTS_REQUEST
    }

}
export const fetchDeletedProductsSuccess = (data) => {
    return {
        type : FETCH_DELETED_PRODUCTS_SUCCESS,
        payload : data
    }
}

export const fetchDeletedProductsFailed = (err) => {
    return {
        type : FETCH_DELETED_PRODUCTS_FAILED,
        payload : err
    }
}


export const addCategoryRequest = () => {
    return {
        type : ADD_CATEGORY_REQUEST
    }
}

export const addCategorySuccess = () => {
    return {
        type : ADD_CATEGORY_SUCCESS
    }
}

export const addCategoryFailed = () => {
    return {
        type : ADD_CATEGORY_FAILED
    }
}

