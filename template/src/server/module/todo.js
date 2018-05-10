var CONFIG = require('../config')
var UUID = require('uid2')
var objectAssign = require('object-assign')
var COLLECTION = "TodoList"
var throwError = require('../error/throwError')
var ERROR_CODE = require('../error/index')


var Todo = require('./plan.js')

async function getJsonById(ctx) {
  let planid = ctx.request.fields.id


  let query_obj = {
    uid: ctx.LOGIN_STATUS.uid,
    planid: planid
  }

  let res = await ctx.mongo
    .db(CONFIG.dbName)
    .collection(COLLECTION)
    .findOne(query_obj)



  
  if (!res || res.jsondata.length==0) {
    // 如果res 为空，则插入一段默认值，并返回
    ctx.argument={}
    ctx.argument.planid = planid
    let plan = await Todo.getPlanById(ctx)

    // console.log('---------',plan)

    let defaultValue = [{
      id: UUID(20),
      isPause: false,
      isComplete: false,
      label: plan.task,
      children: []
    }]
    await ctx.mongo
      .db(CONFIG.dbName)
      .collection(COLLECTION)
      .update(query_obj, {
        '$set': Object.assign({
          uid: ctx.LOGIN_STATUS.uid,
          planid: planid,
          jsondata: defaultValue
        })
      }, {
        'upsert': true
      })

    res = await ctx.mongo
      .db(CONFIG.dbName)
      .collection(COLLECTION)
      .findOne(query_obj)
  }
  ctx.body = res || {}
}
async function update(ctx){
    let planid = ctx.request.fields.id
    let jsondata = ctx.request.fields.jsondata


    let query_obj = {
        uid: ctx.LOGIN_STATUS.uid,
        planid: planid
      }
    

    await ctx.mongo
      .db(CONFIG.dbName)
      .collection(COLLECTION)
      .update(query_obj, {
        '$set': {
          jsondata: jsondata
        }
      })
      ctx.body=true
}
module.exports = {
  getJsonById,
  update
}
