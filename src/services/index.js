import axios from 'axios'

// const BASE_URL = 'https://ramen-wallet-backend-8e30fe08d47d.herokuapp.com'
const BASE_URL = 'http://192.168.10.64:3000'
const INIT_DATA_HEADER = 'x-init-data'

function getUser (initData, resource = '/v1/user') {
  return axios 
    .get(`${BASE_URL}${resource}`, {
      headers: {
        [INIT_DATA_HEADER]: initData,
        'Content-Type': 'application/json;charset=UTF-8',
        'ngrok-skip-browser-warning': 'skip-browser-warning'
      }
    }) 
    .then((response) => {
      return response.data
    }) 
    .catch((error) => {
      console.error(error)
    }); 
}

function signUser (initData, resource = '/v1/user') {
  return axios 
    .post(`${BASE_URL}${resource}`, null, {
      headers: {
        [INIT_DATA_HEADER]: initData,
        'Content-Type': 'application/json;charset=UTF-8',
      }
    }) 
    .then((response) => {
      return response.data
    }) 
    .catch((error) => {
      console.error(error)
      return Promise.reject(error)
    }); 
}

function pruneUser (initData, resource = '/v1/user/prune') {
  return axios 
    .post(`${BASE_URL}${resource}`, null, {
      headers: {
        [INIT_DATA_HEADER]: initData,
        'Content-Type': 'application/json;charset=UTF-8',
      }
    }) 
    .then((response) => {
      return response.data
    }) 
    .catch((error) => {
      console.error(error)
    }); 
}

export {
  getUser,
  signUser,
  pruneUser,
}