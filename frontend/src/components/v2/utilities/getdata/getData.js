import axios from 'axios'


const getData = (url,params,successCallback=()=>{},errorCallback=()=>{}) => {
    return new Promise(
        (resolve,reject) => {
            axios.get(url,{params})
            .then(response=>{
                successCallback()
                resolve(response.data)
            })
            .catch(err => {
                errorCallback()
                reject(err)
            })
        }
    )
}

export default getData