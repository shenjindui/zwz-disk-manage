<template>
	<div style="background: white;padding: 10px;">
		<!--查询-->
		<el-form :inline="true" class="demo-form-inline">
  			<el-form-item label="项目名称：">
    			<el-select v-model="table.search.projectname" size="mini" style="width: 200px;" placeholder="请选择项目名称">
    				<el-option label="全部" value=""></el-option>
			    	<el-option v-for="item in projects" :key="item.projectname" :label="item.projectdesc" :value="item.projectname"></el-option>
  				</el-select>
  			</el-form-item>
  			<el-form-item label="目标方法：">
    			<el-input v-model="table.search.targetmethod" size="mini" style="width: 350px;" placeholder="请输入方法全路径"></el-input>
  			</el-form-item>
  			<el-form-item label="时间范围：">
  				<el-date-picker v-model="table.search.time" size="mini" type="datetimerange" range-separator="至"
  					value-format="yyyy-MM-dd HH:mm:ss"
					start-placeholder="开始时间" end-placeholder="结束时间">
				</el-date-picker>
  			</el-form-item>
  			<el-form-item label="操作用户：">
    			<el-input v-model="table.search.username" size="mini" style="width: 200px;" placeholder="请输入操作人姓名"></el-input>
  			</el-form-item>
  			<el-form-item label="　　　　　">
  				<el-button type="primary" size="mini" icon="el-icon-search" @click="searchs()">查询</el-button>
				<el-button type="primary" size="mini" icon="el-icon-setting" @click="reset()">重置</el-button>
  			</el-form-item>
		</el-form>
		<!--列表-->
		<el-table v-loading="table.loading" :data="table.data" border stripe size="mini" @sort-change="sortChange">
			<el-table-column type="index" width="50"></el-table-column>
			<el-table-column prop="username" label="操作人" width="120"></el-table-column>
			<el-table-column prop="requestip" label="请求IP" width="150"></el-table-column>
			<el-table-column prop="traceid" label="traceId" width="270"></el-table-column>
			<el-table-column prop="targetmethod" label="目标方法">
				<template slot-scope="scope">
	        		<el-button size="mini" type="text" @click="showUI(scope.row.traceid)">{{scope.row.targetmethod}}</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="starttime" label="开始时间" width="150" sortable></el-table-column>
			<el-table-column prop="endtime" label="结束时间" width="150"></el-table-column>
			<el-table-column prop="comsumetime" label="耗时(毫秒)" width="120" sortable></el-table-column>
		</el-table>
		<!--分页-->
		<el-pagination
			@size-change="sizechange"
			@current-change="currentchange"
			@prev-click="prevClick"
      		@next-click="nextClick"
      		:page-sizes="[10, 20, 30, 40,50]"
      		:current-page="table.currentpage"
      		:page-size="table.pagesize"
      		:total="table.total"
      		layout="total, sizes, prev, pager, next, jumper">
    	</el-pagination>
		<!--弹出框-->
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width" top="60px"
			:show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
			
			<dialogdetail ref="form" v-if="dialog.type=='detail'"></dialogdetail>
			
			<div slot="footer" class="dialog-footer">
    			<el-button @click="dialogClose()">取 消</el-button>
  			</div>
		</el-dialog>
	</div>
</template>

<script>
	import dialogdetail from './dialog_detail.vue';
	export default{
		data() {
      		return {
      			projects:[],
      			table:{
      				loading:true,//转圈
      				search:{
      					"projectname":"",
						"targetmethod":"",
						"username":"",
						"time":"",
						"starttime":"",
						"endtime":"",
						"orderfield":"",
						"ordertype":""
      				},
      				currentpage:1,
      				pagesize:10,
      				total:0,
        			data: []
      			},
      			dialog:{
      				type:"",//类型（add表示添加窗口，edit表示修改窗口）
      				visible: false,
      				title:''
      			}
      		}
    	},
    	components:{
    		dialogdetail
		},
    	created(){
    		this.findProject();
    	},
		methods:{
			reset(){
				this.table.search.projectname="";
				this.table.search.targetmethod="";
				this.table.search.username="";
				this.table.search.time="";
				this.table.search.starttime="";
				this.table.search.endtime="";
				this.table.search.orderfield="";
				this.table.search.ordertype="";
				this.searchs();
			},
			searchs(){
				var time=this.table.search.time;
				if(time!=null&&time!="null"&&time.length!=0){
					this.table.search.starttime=this.table.search.time[0];
					this.table.search.endtime=this.table.search.time[1];
				}else{
					this.table.search.starttime="";
					this.table.search.endtime="";
				}
					
				this.table.currentpage=1;
				this.findList();
			},
			findProject(){
				this.$http.post(this.logurl+'log/admin/findProject',{
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data=response.body;
					if(data.code==0){
						this.projects=data.data;
						//获取第一个工程
						if(this.projects.length!=0){
							this.table.search.projectname=this.projects[0].projectname;
							//加载第一个工程的日志
							this.searchs();
						}
					}else{
						this.alertMsg(data.code,data.msg);
					}
				});
			},
			findList(){
				this.table.loading=true;
				this.$http.post(this.logurl+'log/admin/findList',{
					"projectname":this.table.search.projectname,
					"targetmethod":this.table.search.targetmethod,
					"username":this.table.search.username,
					"starttime":this.table.search.starttime,
					"endtime":this.table.search.endtime,
					"orderfield":this.table.search.orderfield,
					"ordertype":this.table.search.ordertype,
					"page":this.table.currentpage,
					"limit":this.table.pagesize,
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data= response.body;
					if(data.code==0){
						this.table.data=data.rows;
						this.table.total=data.totalElements;
					}else{
						this.alertMsg(data.code,data.msg);
					}
					this.table.loading=false;
				});
			},
			sizechange(pagesize){
				this.table.pagesize=pagesize;
				this.findList();
			},
			currentchange(currentpage){
				this.table.currentpage=currentpage;
				this.findList();
			},
			prevClick(){
				this.table.currentpage=this.table.currentpage-1;
				this.findList();
			},
			nextClick(){
				this.table.currentpage=this.table.currentpage+1;
				this.findList();
			},
			sortChange(column){
				this.table.search.orderfield=column.prop;
				this.table.search.ordertype=column.order;
				this.searchs();
			},
			/////////////////////////////////////////////////////////////////////////////////////////////////
			showUI(traceid){
				this.dialog.width="1000px";
				this.dialog.type="detail";
				this.dialog.title="日志详情";
				this.dialog.visible=true;
				setTimeout(()=>{
					this.$refs.form.showList(traceid);
				},0);
			},
			dialogClose(){
				this.dialog.visible=false;
			}
		}
	}
</script>

<style scoped="scoped">
	.link{
		text-decoration: none;
	}
</style>