import axios from 'axios'
import store from '@/vuex/store.js'
import {
  IP,
  ServerPort as PORT
} from './env.js'
axios.interceptors.request.use(
  config => {
      if (store.state.token) {
          if(!config.noToken){
              config.headers._token = store.state.token;
          }
      }
      return config;

  })
export default function fetch(type, path, params) {
  let contentTpye = 'application/json'
  return new Promise((resolve, reject) => {
    axios({
      method: type,
      url: IP + path,
      data: params,
      headers: {
        'Content-Type': contentTpye
      }
    }).then(response => {
      console.log(response)
      if(response.data.status==false){
        alert(JSON.stringify(response.data))
        let msg = JSON.parse(response.data.msg)
        console.log(msg)
        if(msg.STATUSCODE == 103){
          location.href = '/login'
        }
      }else{
        resolve(response);
      }
      
    }).catch((error, res) => {
      reject(error);
    })
  })
}