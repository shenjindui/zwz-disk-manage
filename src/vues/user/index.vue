<template>
	<div style="background: white;padding: 10px;">
		<!--查询-->
		<el-form :inline="true" class="demo-form-inline">
  			<el-form-item label="用户姓名：">
    			<el-input v-model="table.search.nickname" size="mini" placeholder="请输入用户姓名"></el-input>
  			</el-form-item>
  			<el-form-item>
    			<el-button type="primary" size="mini" icon="el-icon-search" @click="searchs()">查询</el-button>
  			</el-form-item>
		</el-form>
		<!--列表-->
		<el-table v-loading="table.loading" :data="table.data" border stripe size="mini">
			<el-table-column type="index" width="50"></el-table-column>
			<el-table-column prop="nickname" label="姓名" width="200"></el-table-column>
			<el-table-column prop="username" label="账号" width="200"></el-table-column>
			<el-table-column prop="telephone" label="联系电话"></el-table-column>
			<el-table-column prop="totalcapacity" label="总容量" width="200"></el-table-column>
			<el-table-column prop="usedcapacity" label="已用容量" width="200"></el-table-column>
			<el-table-column prop="cz" label="操作" width="200">
				<template slot-scope="scope">
	        		<el-button size="mini" type="text" @click="editUI(scope.row.id)">分配容量</el-button>
	        		<el-button size="mini" type="text" @click="showUI(scope.row.id)">历史记录</el-button>
				</template>
			</el-table-column>
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
			:show-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
			<dialogedit ref="form" v-if="dialog.type=='edit'" v-on:dialogResult="dialogResult"></dialogedit>
			<dialoghistory ref="form" v-if="dialog.type=='history'" v-on:dialogResult="dialogResult"></dialoghistory>
			
			<div slot="footer" class="dialog-footer" v-if="dialog.type=='edit'">
    			<el-button @click="dialogClose()">取 消</el-button>
    			<el-button type="primary" @click="dialogConfirm()">确 定</el-button>
  			</div>
		</el-dialog>
	</div>
</template>

<script>
	import dialogedit from './dialog_edit.vue';
	import dialoghistory from './dialog_history.vue';
	export default{
		data() {
      		return {
      			dialog:{
      				width:"",
      				type:"",
      				visible: false,
      				title:''
      			},
      			table:{
      				loading:true,//转圈
      				search:{
      					"nickname":""
      				},
      				currentpage:1,
      				pagesize:10,
      				total:0,
        			data: []
      			}
      		}
    	},
    	components:{
    		dialogedit,
    		dialoghistory
		},
    	created(){
    		this.searchs();
    	},
		methods:{
			searchs(){
				this.table.currentpage=1;
				this.findList();
			},
			findList(){
				this.table.loading=true;
				this.$http.post('user/findList',{
					"nickname":this.table.search.nickname,
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
			/////////////////////////////////////////////////////////////////////////////////////////////////
			editUI(userid){
				this.dialog.width="600px";
				this.dialog.type="edit";
				this.dialog.title="分配容量";
				this.dialog.visible=true;
				setTimeout(()=>{
					this.$refs.form.showInfo(userid);
				},0);
			},
			showUI(userid){
				this.dialog.width="1000px";
				this.dialog.type="history";
				this.dialog.title="历史记录";
				this.dialog.visible=true;
				setTimeout(()=>{
					this.$refs.form.findHistoryList(userid);
				},0);
			},
			dialogClose(){
				this.dialog.visible=false;
			},
			dialogConfirm(){
				this.$refs.form.save();
			},
			dialogResult(){
				this.dialogClose();
				this.searchs();
			}
		}
	}
</script>

<style scoped="scoped">
	.link{
		text-decoration: none;
	}
</style>