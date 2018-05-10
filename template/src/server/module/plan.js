var CONFIG = require('../config')
var UUID = require('uid2')
var objectAssign = require('object-assign')
var COLLECTION = "PlanList"
var throwError = require('../error/throwError')
var ERROR_CODE = require('../error/index')

// var GDMP = require('../../../vendors/google-diff-match-patch-js/diff_match_patch_uncompressed.js')
// var dmp = new GDMP.diff_match_patch()

async function getPlanById(ctx){
  let planid = ctx.request.fields.planid || ctx.argument.planid

  let query_obj = {
    uid: ctx.LOGIN_STATUS.uid,
    planid:planid
  }
  return await ctx.mongo
      .db(CONFIG.dbName)
      .collection(COLLECTION)
      .findOne(query_obj)

}
/*添加文集*/
async function getPlanList(ctx) {

  let date_start = ctx.request.fields.date_start
  let date_end = ctx.request.fields.date_end
  let query_options = ctx.request.fields.query_options

  let query_obj = {
    uid: ctx.LOGIN_STATUS.uid,
    isMoved: {
      $ne: true
    }
  }
  if (query_options == 0) {
    // 全部
    Object.assign(query_obj, {
      $or: [{
        startAt: {
          $gte: date_start,
          $lte: date_end
        }
      }, {
        createAt: {
          $gte: date_start,
          $lte: date_end
        }
      },{
        stopAt: {
          $gte: date_start,
          $lte: date_end
        }
      }]
    })

  }
  if (query_options == 1) {
    // 开始时间
    Object.assign(query_obj, {
      startAt: {
        $gte: date_start,
        $lte: date_end
      }
    })
  }
  if (query_options == 2) {
    // 创建日期
    Object.assign(query_obj, {
      createAt: {
        $gte: date_start,
        $lte: date_end
      }
    })
  }
  console.log(query_obj)
  let list = await ctx.mongo
    .db(CONFIG.dbName)
    .collection(COLLECTION)
    .find(query_obj)
    .sort({
      timestamp: -1
    })
    .toArray()

  ctx.set('Content-Type', 'application/json; charset=utf-8')
  ctx.body = list
}
async function addPlan(ctx, next) {

  // let date_start = ctx.request.fields.date_start
  // let date_end = ctx.request.fields.date_end
  let selfuid = UUID(40)
  let time = ctx.request.fields.time
  let task = ctx.request.fields.task
  let createAt = (new Date()).getTime()
  let query_obj = {
    planid: selfuid,
    uid: ctx.LOGIN_STATUS.uid
  }
  //   console.log(query_obj)
  let list = await ctx.mongo
    .db(CONFIG.dbName)
    .collection(COLLECTION)
    .update(query_obj, {
      '$set': Object.assign(query_obj, {
        createAt,
        time,
        task,
        isPaused: false
      })
    }, {
      'upsert': true
    })
  await next()
  // ctx.set('Content-Type', 'application/json; charset=utf-8')
  // ctx.body = list
}
async function startTask(ctx, next) {
  let planid = ctx.request.fields.id
  let remainTime = ctx.request.fields.remainTime || 0
  if (isNaN(Number(remainTime))) {
    remainTime = 0
  }
  let startAt = (new Date()).getTime()
  let endAt = startAt + (remainTime * 60 * 1000)
  let query_obj = {
    planid,
    uid: ctx.LOGIN_STATUS.uid
  }
  //   console.log(query_obj)
  let list = await ctx.mongo
    .db(CONFIG.dbName)
    .collection(COLLECTION)
    .update(query_obj, {
      '$set': Object.assign({}, query_obj, {
        startAt,
        stopAt: startAt,
        endAt: endAt,
        isPaused: false,
        remainTime: remainTime
      })
    })
  ctx.body = true
}
async function delTask(ctx, next) {
  let planid = ctx.request.fields.id
  let query_obj = {
    planid,
    uid: ctx.LOGIN_STATUS.uid
  }
  let list = await ctx.mongo
    .db(CONFIG.dbName)
    .collection(COLLECTION)
    .update(query_obj, {
      '$set': Object.assign({}, query_obj, {
        isMoved: true,
      })
    })
  ctx.body = true
}
async function stopTask(ctx, next) {

  let planid = ctx.request.fields.id
  let remainTime = ctx.request.fields.remainTime || 0

  // console.log(remainTime)
  if (isNaN(Number(remainTime))) {
    remainTime = 0
  }
  let now = (new Date()).getTime()
  let query_obj = {
    planid,
    uid: ctx.LOGIN_STATUS.uid
  }
  // console.log(remainTime)
  let list = await ctx.mongo
    .db(CONFIG.dbName)
    .collection(COLLECTION)
    .update(query_obj, {
      '$set': Object.assign({}, query_obj, {
        // startAt:'',
        isPaused: true,
        stopAt: now,
        // ,
        remainTime: remainTime
      })
    })
  ctx.body = true
}
async function resumeTask(ctx, next) {

  let planid = ctx.request.fields.id
  let remainTime = ctx.request.fields.remainTime || 0

  // console.log(remainTime)
  if (isNaN(Number(remainTime))) {
    remainTime = 0
  }
  let now = (new Date()).getTime()
  let endAt = now + (remainTime * 60 * 1000)
  let query_obj = {
    planid,
    uid: ctx.LOGIN_STATUS.uid
  }
  console.log(remainTime)
  let list = await ctx.mongo
    .db(CONFIG.dbName)
    .collection(COLLECTION)
    .update(query_obj, {
      '$set': Object.assign({}, query_obj, {
        isPaused: false,
        stopAt: now,
        remainTime: remainTime,
        endAt
      })
    })
  ctx.body = true
}

module.exports = {
  getPlanList,
  addPlan,
  startTask,
  stopTask,
  resumeTask,
  delTask,
  getPlanById
}
