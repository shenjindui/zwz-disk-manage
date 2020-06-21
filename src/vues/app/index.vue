<template>
	<div style="background: white;padding: 10px;">
		<!--查询-->
		<el-form :inline="true" class="demo-form-inline">
  			<el-form-item label="应用名称：">
    			<el-input v-model="table.search.name" size="mini" placeholder="请输入应用名称"></el-input>
  			</el-form-item>
  			<el-form-item>
    			<el-button type="primary" size="mini" icon="el-icon-search" @click="searchs()">查询</el-button>
    			<el-button type="primary" size="mini" icon="el-icon-plus" @click="addUI()">新增</el-button>
  			</el-form-item>
		</el-form>
		<!--列表-->
		<el-table v-loading="table.loading" :data="table.data" border stripe size="mini">
			<el-table-column type="index" width="50"></el-table-column>
			<el-table-column prop="id" label="应用ID" width="250"></el-table-column>
			<el-table-column prop="appname" label="应用名称" width="250"></el-table-column>
			<el-table-column prop="appdesc" label="应用说明"></el-table-column>
			<el-table-column prop="createusername" label="注册人" width="150"></el-table-column>
			<el-table-column prop="createtime" label="注册时间" width="140"></el-table-column>
			<el-table-column prop="cz" label="操作" width="160">
				<template slot-scope="scope">
					<el-button size="mini" type="text" @click="showUI(scope.row.id)">查看文件</el-button>
	        		<el-button size="mini" type="text" @click="editUI(scope.row.id)">编辑</el-button>
	        		<el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
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
			:show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
			<dialogadd ref="form" v-if="dialog.type=='add'" v-on:dialogResult="dialogResult"></dialogadd>
			<dialogedit ref="form" v-if="dialog.type=='edit'" v-on:dialogResult="dialogResult"></dialogedit>
			<dialogfile ref="form" v-if="dialog.type=='file'"></dialogfile>
			
			<div slot="footer" class="dialog-footer">
    			<el-button @click="dialogClose()">取 消</el-button>
    			<el-button type="primary" @click="dialogConfirm()"  v-if="dialog.type!='file'">确 定</el-button>
  			</div>
		</el-dialog>
	</div>
</template>

<script>
	import dialogadd from './dialog_add.vue';
	import dialogedit from './dialog_edit.vue';
	import dialogfile from './dialog_file.vue';
	
	export default{
		data() {
      		return {
      			dialog:{
      				type:"",//类型（add表示添加窗口，edit表示修改窗口）
      				visible: false,
      				title:''
      			},
      			table:{
      				loading:true,//转圈
      				search:{
      					"name":""
      				},
      				currentpage:1,
      				pagesize:10,
      				total:0,
        			data: []
      			}
      		}
    	},
    	components:{
			dialogadd,
			dialogedit,
			dialogfile
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
				this.$http.post('app/findList',{
					"name":this.table.search.name,
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
			addUI(){
				this.dialog.width="600px";
				this.dialog.type="add";
				this.dialog.title="新增应用";
				this.dialog.visible=true;
			},
			editUI(id){
				this.dialog.width="600px";
				this.dialog.type="edit";
				this.dialog.title="修改应用";
				this.dialog.visible=true;
				setTimeout(()=>{
					this.$refs.form.showInfo(id);
				},0);
			},
			dialogClose(){
				this.dialog.visible=false;
				this.dialog.type="";
			},
			dialogConfirm(){
				this.$refs.form.save();
			},
			dialogResult(){
				this.dialogClose();
				this.searchs();
			},
			/////////////////////////////////////////////////////////////////////////////////////////////////
			showUI(id){
				this.dialog.width="1300px";
				this.dialog.type="file";
				this.dialog.title="文件列表";
				this.dialog.visible=true;
				setTimeout(()=>{
					this.$refs.form.showList(id);
				},0);
			},
			/////////////////////////////////////////////////////////////////////////////////////////////////
			del(id){
				this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.table.loading=true;
        			this.$http.post('app/delete',{
						"id":id,
						"token":sessionStorage.getItem("token")
					}).then(response => {
						var data=response.body;
						if(data.code==0){
							this.searchs();
						}
						this.alertMsg(data.code,data.msg);
						this.table.loading=false;
					});
        		});
			}		
		}
	}
</script>

<style scoped="scoped">
	.link{
		text-decoration: none;
	}
</style>