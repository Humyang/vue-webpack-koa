
import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex);

 let store = new Vuex.Store({
    state:{
        token:''
    },
    mutations:{
        updateToken(state,data){
            localStorage.token = data
            state.token = data
        }
    },
    getters:{
        isLogined:(state)=>(code)=>{
            if(state.token != ''){
                return true
            }else{
                return false
            }
        }
    }
})
if (localStorage.token) {
    store.commit('updateToken', localStorage.token)
}
export default store