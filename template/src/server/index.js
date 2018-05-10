var koa = require('koa')
var koaRouter = require('koa-router')
var body = require('koa-better-body')
// var koaBody = require('koa-body')
var mongo = require('koa-mongo')
var uid = require('uid2')
var cors = require('koa-cors')
var OAUTCH_CLIENT = require('../../../oauth_serve/client/index')
var throwError = require('./throwError.js')
const router = new koaRouter();
const app = new koa();

var ServerPort = {{ ServerPort }}




// var Plan = require('./module/plan')
// router.post('/delTask',OAUTCH_CLIENT.login_check_remote(),Plan.delTask)
// router.post('/plan_list',OAUTCH_CLIENT.login_check_remote(),Plan.getPlanList)
// router.post('/resumeTask',OAUTCH_CLIENT.login_check_remote(),Plan.resumeTask)
// router.post('/startTask',OAUTCH_CLIENT.login_check_remote(),Plan.startTask)
// router.post('/stopTask',OAUTCH_CLIENT.login_check_remote(),Plan.stopTask)
// router.post('/add_plan',async function(ctx,next){
//     ctx.header._token = ctx.request.fields.token
//     await next()
// },OAUTCH_CLIENT.login_check_remote(),Plan.addPlan,async function(ctx,next){
//     debugger
//     ctx.redirect(ctx.header.referer);  
// })

// var Todo = require('./module/todo')
// router.post('/todo/getjson',OAUTCH_CLIENT.login_check_remote(),Todo.getJsonById)
// router.post('/todo/update',OAUTCH_CLIENT.login_check_remote(),Todo.update)

app.use(cors())
app.use(mongo())
app.use(body({textLimit:'10000kb',formLimit:'10000kb',jsonLimit:'10000kb'}))
app.use(async function (ctx,next){
    try{
        await next()
    }catch (err) {
        try{
            // 业务逻辑错误
            ctx.body = objectAssign({status:false},JSON.parse(err.message));
        }catch(err2){
            // console.log(this)
            ctx.body = {
                status:false,
                msg:err.message,
                path:ctx.request.url
            }
        }
        console.log(err)
    }
})
app.use(router.routes()).use(router.allowedMethods());


app.listen(ServerPort)

console.log("listen serve on port ",ServerPort)