<template>
	<div style="background: white;padding: 10px;">
		<!--查询-->
		<el-form :inline="true" class="demo-form-inline">
  			<el-form-item label="编码：">
    			<el-input v-model="table.search.code" size="mini" placeholder="请输入编码"></el-input>
  			</el-form-item>
  			<el-form-item label="名称：">
    			<el-input v-model="table.search.name" size="mini" placeholder="请输入名称"></el-input>
  			</el-form-item>
  			<el-form-item>
    			<el-button type="primary" size="mini" icon="el-icon-search" @click="searchs()">查询</el-button>
    			<el-button type="primary" size="mini" icon="el-icon-plus" @click="addUI()">新增</el-button>
  			</el-form-item>
		</el-form>
		<!--列表-->
		<el-table v-loading="table.loading" :data="table.data" border stripe size="mini">
			<el-table-column type="index" width="50"></el-table-column>
			<el-table-column prop="code" label="编码" width="150"></el-table-column>
			<el-table-column prop="name" label="名称" width="200"></el-table-column>
			<el-table-column prop="remark" label="备注"></el-table-column>
			<el-table-column prop="createusername" label="创建人" width="150"></el-table-column>
			<el-table-column prop="createtime" label="创建时间" width="200"></el-table-column>
			<el-table-column prop="cz" label="操作" width="120">
				<template slot-scope="scope">
	        		<el-button size="mini" type="text" @click="editUI(scope.row.id)">修改</el-button>
	        		<el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--弹出框-->
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width" top="60px"
			:show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
			<dialogadd ref="form" v-if="dialog.type=='add'" v-on:dialogResult="dialogResult"></dialogadd>
			<dialogedit ref="form" v-if="dialog.type=='edit'" v-on:dialogResult="dialogResult"></dialogedit>
			
			<div slot="footer" class="dialog-footer">
    			<el-button @click="dialogClose()">取 消</el-button>
    			<el-button type="primary" @click="dialogConfirm()">确 定</el-button>
  			</div>
		</el-dialog>
	</div>
</template>

<script>
	import dialogadd from './dialog_add.vue';
	import dialogedit from './dialog_edit.vue';
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
      					"code":"",
      					"name":""
      				},
        			data: []
      			}
      		}
    	},
    	components:{
    		dialogadd,
    		dialogedit
		},
    	created(){
    		this.searchs();
    	},
		methods:{
			searchs(){
				this.findList();
			},
			findList(){
				this.table.loading=true;
				this.$http.post('typecomponent/findList',{
					"code":this.table.search.code,
					"name":this.table.search.name,
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data= response.body;
					if(data.code==0){
						this.table.data=data.data;
					}else{
						this.alertMsg(data.code,data.msg);
					}
					this.table.loading=false;
				});
			},
			/////////////////////////////////////////////////////////////////////////////////////////////////
			addUI(){
				this.dialog.width="600px";
				this.dialog.type="add";
				this.dialog.title="新增组件";
				this.dialog.visible=true;
			},
			editUI(id){
				this.dialog.width="600px";
				this.dialog.type="edit";
				this.dialog.title="修改组件";
				this.dialog.visible=true;
				setTimeout(()=>{
					this.$refs.form.showInfo(id);
				},0);
			},
			del(id){
				this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.table.loading=true;
        			this.$http.post('typecomponent/delete',{
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
			},
			/////////////////////////////////////////////////////////////////////////////////////////////////
			dialogClose(){
				this.dialog.visible=false;
			},
			dialogConfirm(){
				this.$refs.form.save();
			},
			dialogResult(){
				this.dialog.type="";
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