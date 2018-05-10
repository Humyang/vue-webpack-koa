import fetch from '../ajax.js'
export default {
    getPlanList({date_start=123,date_end=123,query_options=0}={}){
        // let {
        //     date
        // } = obj
        return fetch('post','/plan_list',{
            date_start,
            date_end,
            query_options
        })
    },
    addPlanList({time='',task=''}={}){
        return fetch('post','/add_plan',{
            time,task
        })
    },
    startTask({id,remainTime}={}){
        return fetch('post','/startTask',{
            id,
            remainTime
        })
    }
    ,
    stopTask({id,remainTime}={}){
        return fetch('post','/stopTask',{
            id,
            remainTime
        })
    },
    resumeTask({id,remainTime}={}){
        return fetch('post','/resumeTask',{
            id,
            remainTime
        })
    },
    delTask({id}={}){
        return fetch('post','/delTask',{
            id
        })
    }
}