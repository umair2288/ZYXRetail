import {createStore , applyMiddleware, compose, combineReducers} from 'redux'
import thunkMiddleware  from 'redux-thunk'
import salesPersonVehicleReducer from './salespersonvehicle/reducers/salesPersonVehicleReducer'
import authReducer from './auth/reducers/authReducer'
import productsReducer from './product/reducers/productReducer'
import deletedProductsReducer from './product/reducers/deletedProductsReducer'
import categoriesReducer from './product/reducers/categoryReducer'
import supplierReducer from './suppliers/reducers/supplierReducer'
import warehouseReducer from './warehouses/reducers/warehouseReducer'
import reportReducer from './reports/reducers/reportReducer'

 const combinedReducer =  combineReducers({
      authentication: authReducer,
      salesPersonVehicle : salesPersonVehicleReducer,
      product: combineReducers( {products : productsReducer , deletedProducts:deletedProductsReducer , categories : categoriesReducer}),
      supplier : supplierReducer,
      warehouses : warehouseReducer,
      reports : reportReducer
     
 })

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store  = createStore(combinedReducer, composeEnhancers(applyMiddleware(thunkMiddleware)))


export default store
