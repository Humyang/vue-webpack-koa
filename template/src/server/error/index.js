var STATUSCODE_START = 1000


var ERROR_CODE = {
    DAY:86399500,
    CODE:{
        USERNAME_REPTER:{
            STATUSCODE:STATUSCODE_START++,
            MSG:'用户名重复'
        },
        USERNAME_INVALID:{
            STATUSCODE:STATUSCODE_START++,
            MSG:'账号格式不符合要求'
        },
        USERNAME_ERROR:{
            STATUSCODE:STATUSCODE_START++,
            MSG:'账号或密码错误'
        },
        USERNAME_NO_FIND:{
            STATUSCODE:STATUSCODE_START++,
            MSG:'没有找到此用户'
        },
        WORD_NOT_FIND:{
            STATUSCODE:STATUSCODE_START++,
            MSG:'未查询到：'
        }
    }
}

// var ARTICLE = require('./ERROR_CODE/ARTICLE.js')
// Object.assign(ERROR_CODE.CODE,ARTICLE)

// var UPLOAD = require('./ERROR_CODE/UPLOAD.js')
// Object.assign(ERROR_CODE.CODE,UPLOAD)
module.exports = ERROR_CODE