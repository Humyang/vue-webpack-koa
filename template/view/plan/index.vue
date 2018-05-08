<template>
  <div class="plan">
    <el-container>
      <el-header height="80px;" class="header">
        <p>当前时间:{{currentTime | timePass}}</p>
        <el-button type="primary" @click="showAddTask=true">添加新任务</el-button>
        <el-form ref="elform" :model="form" :action="action" method="post">
          <el-container class="query-wrap flex align-center">
            <p>筛选条件</p>
            <el-select 
              class="m-r-14px" v-model="query_options" placeholder="全部">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div class="block m-r-14px">
              <span class="demonstration">筛选日期</span>
              <el-date-picker v-model="selectedTime" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" :picker-options="pickerOptions2">
              </el-date-picker>
            </div>
            <el-button type="primary" @click="actionQuery">查询</el-button>
          </el-container>
        </el-form>
      </el-header>
      <el-main>
        
        <!-- :default-sort = "{prop: 'startAt', order: 'ascending'}" -->
        <el-table align="center" :data="tableData" 
        :row-class-name="tableRowClassName"
        style="width: 100%">
        <el-table-column prop="status" label="状态" width="80">
          </el-table-column>
          <el-table-column prop="time" label="投入时间（分）" width="180">
          </el-table-column>
          <el-table-column prop="startAt" label="开始时间" width="180">
          </el-table-column>
          <el-table-column prop="stopAt" label="暂停时间" width="180">
          </el-table-column>
          <el-table-column prop="remainTime" label="剩余时间（分)">
          </el-table-column>
          <el-table-column prop="endTime" label="预计结束时间">
          </el-table-column>
          <el-table-column prop="task" label="任务内容">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown @command="actionDropdown">
                <span class="el-dropdown-link">
                  编辑
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="scope.row.status =='未开始'" :command="{type:'startTask',id:scope.row.planid,remainTime:scope.row.time}">开始任务</el-dropdown-item>
                  <!-- <el-dropdown-item>终止任务</el-dropdown-item> -->
                  <!-- <el-dropdown-item>设为完成</el-dropdown-item> -->
                  <el-dropdown-item v-if="scope.row.status =='进行中' || scope.row.status =='暂停中'" :command="{type:'stopTask',id:scope.row.planid,remainTime:scope.row.remainTime,isPaused:scope.row.isPaused}">{{scope.row.isPaused?'继续任务':'停止任务'}}</el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.status !='未开始'" :command="{type:'startTask',id:scope.row.planid,remainTime:scope.row.time}">重置时间</el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.status !='进行中'" :command="{type:'delTask',id:scope.row.planid}">删除</el-dropdown-item>
                  <!-- <el-dropdown-item divided>上方插入任务</el-dropdown-item> -->
                  <el-dropdown-item :command="{type:'todo',id:scope.row.planid}"> TODO</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-dialog title="添加任务" :visible.sync="showAddTask">
      <el-form ref="elform" :model="form" :action="action" method="post">
        <input type="hidden" name="token" :value="token">
        <el-form-item class="dialog-content" label="投入时间">
          <el-input-number v-model="dialog_selectTime" :step="15"></el-input-number>
          （单位：分钟）
          <input type="hidden" name="time" :value="dialog_selectTime">
        </el-form-item>
        <el-form-item label="任务内容" class="dialog-content">
          <textarea v-model="form.task" name="task" id="" cols="30" rows="10"></textarea>
        </el-form-item>
        <el-form-item>
          <el-button @click="showAddTask = false">取 消</el-button>
          <el-button type="primary" @click="dialog_Submit">提 交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>


<script>
Date.prototype.Format = function(fmt)
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}
// import HelloWorld from "./components/HelloWorld";
import {
  IP,
  ServerPort as PORT,
  setip
} from '@/api/env.js'
export default {
  name: "plan",
  data() {
    return {
      currentTime: "",
      isCollapse: true,
      showAddTask:false,
      dialog_selectTime:0,
      selectedTime:[],
      selectedTimeStmap:[],
      tableData: [
        // {
        //   status:'',
        //   planid:'',
        //   time: 60,
        //   startAt: "未开始",
        //   stopAt:"" 暂停时间
        //   remainTime: "未开始",
        //   endTime: "未开始",
        //   task: "看书"
        //   isPaused：false 已暂停
        // }
      ],
      form:{
          time:"",
          task:""
      },
      token:"",
      action:"",
      query_options:0,
      options: [{
          value: 0,
          label: '全部'
        }, {
          value: 1,
          label: '开始时间'
        }, {
          value: 2,
          label: '创建时间'
        }],
      pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
    };
  },
  filters: {
    timePass: function(value) {
      if (!value) return "";
      let time = new Date(value); 
      let y = time.getFullYear() + "";
      let m = time.getMonth() + 1 + "";
      let m1 = m < 10 ? "0" + m : m;
      let d = time.getDate() + "";
      let d1 = d < 10 ? "0" + d : d;
      let h = time.getHours() + "";
      let h1 = h < 10 ? "0" + h : h;
      let mm = time.getMinutes() + "";
      let mm1 = mm < 10 ? "0" + mm : mm;
      let s = time.getSeconds() + "";
      let s1 = s < 10 ? "0" + s : s;
      return y + "." + m1 + "." + d1 + " " + h1 + ":" + mm1 + ":" + s1;
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      
        if(this.tableData[rowIndex].isPaused){
          // console.log(this.tableData[rowIndex].time,this.tableData[rowIndex].isPaused)
          return 'paused'
        }else{
          // console.log(this.tableData[rowIndex].time,this.tableData[rowIndex].isPaused)
        }
        if (this.tableData[rowIndex].remainTime > 0) {
          return 'staring';
        } 
        if (this.tableData[rowIndex].remainTime == 0) {
          return 'ended';
        }
        return '';
      },
    refreshRemainTime(){
      let now = (new Date()).getTime()
      
      this.tableData = this.tableData.map(item=>{
        // let remainTime = item.endAt - now
        let endAt = item.endAt
        // let endAt = now + (remainTime * 60 * 1000)
        // let endAt = 
        if(item.isPaused){
          item.status = '暂停中'
          
          item.endTime = (new Date(endAt)).Format("yyyy-MM-dd hh:mm:ss")
          return item
        }
        if(!item.startAtTimestmap){
          item.status = '未开始'
          return item
        }
        item.status = '进行中'

        // let startAt = item.startAtTimestmap
        // let time = item.time

        // let endAt = startAt + time * 60 * 1000

        let remainMinu = Math.round((endAt - now) / 1000 / 60)
        // remainTime--

        item.endTime = (new Date(endAt)).Format("yyyy-MM-dd hh:mm:ss")

        if(isNaN(remainMinu) || remainMinu <=0){
          item.status = '已结束'
          remainMinu = 0
        }
        item.remainTime = remainMinu

        return item
      })
    },

    actionDropdown(command){
      // console.log(command)
      // this.api.plan.startTask({id})
      switch (command.type) {
        case "startTask":
        // console.log(id)
          this.api.plan.startTask({id:command.id,remainTime:command.remainTime}).then(()=>{
            this.getPlanList()
          })
          break;
        case "stopTask":
          if(command.isPaused){
            // 继续任务 
            this.api.plan.resumeTask({id:command.id,remainTime:command.remainTime}).then(()=>{
              this.getPlanList()
            })
          }
          else{
            this.api.plan.stopTask({id:command.id,remainTime:command.remainTime}).then(()=>{
              this.getPlanList()
            })
          }
          
          break;
        case "delTask":
          this.api.plan.delTask({id:command.id}).then(()=>{
              this.getPlanList()
            })
        break;
        case "todo":
          this.$router.push('/todo?id='+command.id)
        break;
        default:
          break;
      }
    },
    actionQuery(){
      this.selectedTime = [this.getDayStart(this.selectedTime[0]),this.getDayEnd(this.selectedTime[1])]
      this.getPlanList()
    },
    dialog_Submit(){
        this.$refs.elform.$el.submit()
    },
    eventPickChange(currentTime){
        let afterTime = new Date(currentTime).getTime()
        let nowTime = new Date().getTime()
        console.log((afterTime - nowTime))
        
        let min = (afterTime - nowTime) / 1000 / 60
        this.dialog_selectTime = Math.round(min,2)
    },
    actionAddTask(){
        this.showAddTask = true
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    
    getPlanList(){
      this.api.plan.getPlanList({
        date_start:this.selectedTime[0],
        date_end:this.selectedTime[1],
        query_options:this.query_options
      }).then(res=>{
        let sortData = res.data

        sortData = sortData.sort((a,b,c)=>{
          let aCreateAt = (new Date(a.startAt)).getTime()
          let bCreateAt = (new Date(b.startAt)).getTime()
         if(isNaN(aCreateAt)){aCreateAt = 0}
         if(isNaN(bCreateAt)){bCreateAt = 0}
          

          console.log(aCreateAt,bCreateAt)

          return aCreateAt - bCreateAt
        })
        // console.log(sortData)
        let cData = sortData.map((item)=>{
          if(!item.startAt){
            return item
          }
          item.startAtTimestmap = item.startAt
          item.startAt = new Date(item.startAt).Format("yyyy-MM-dd hh:mm:ss");  
          item.stopAt = new Date(item.stopAt).Format("yyyy-MM-dd hh:mm:ss");  
          return item
        })
        this.tableData = cData
        this.refreshRemainTime()
      })
    },
    getDayStart(timestmap){
      let time = new Date(timestmap).Format("yyyy-MM-dd");  
      let clearTime = (new Date(time+ " 00:00:00")).getTime()
      return clearTime
    },
    getDayEnd(timestmap){
      let time = new Date(timestmap).Format("yyyy-MM-dd");  
      let dayEnd = (new Date(time + " 23:59:59")).getTime()
      return dayEnd
    }
  },
  mounted() {
    // this.api.plan.getPlanList()
    // 加载列表
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
    setInterval(() => {
      this.refreshRemainTime()
    }, 1000);
    this.token = this.$store.state.token
    this.action = IP + "/add_plan"

    let now = new Date()
    this.selectedTime = [this.getDayStart(now),this.getDayEnd(now)]

    this.getPlanList()

  }
}
</script>

<style>
.plan .header {
  text-align: left;
  height: auto;
}
.el-dropdown-link {
  color: #3f9eff;
  cursor: pointer;
}
.dialog-content{
    text-align: left;
}
.query-wrap{
  margin-top: 20px;
}
.el-table tr.staring {
    background-color: #f0f9eb;
}
.el-table tr.paused{
  background-color: #fffbdc;
}
.el-table tr.ended {
    background-color: #FF9800;
    color: white;
}
.el-table tr.ended:hover td {
    background-color: #ffbf60 !important;
}
</style>
