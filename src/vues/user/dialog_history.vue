<template>
	<div>
		<el-row :gutter="20">
		  	<el-col :span="24">
		  		<el-card class="box-card">
		  			<el-table v-loading="loading" :data="table.data" border stripe size="mini" height="400">
						<el-table-column type="index" width="50"></el-table-column>
						<el-table-column prop="createtime" label="操作时间" width="150"></el-table-column>
						<el-table-column prop="username" label="操作人" width="100"></el-table-column>
						<el-table-column prop="remark" label="操作说明"></el-table-column>
						<el-table-column prop="capacity" label="容量" width="200"></el-table-column>
						<el-table-column prop="leftcapacity" label="剩余容量" width="200"></el-table-column>
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
				</el-card>
		  	</el-col>
		</el-row>
	</div>
</template>

<script>
	export default{
		data() {
			return {
				loading:false,
				table:{
      				search:{
      					userid:''
      				},
      				currentpage:1,
      				pagesize:10,
      				total:0,
        			data: []
      			}
			}
		},
		methods:{
			reset(){
			},
			findHistoryList(userid) {
				this.table.search.userid=userid;
				this.searchs();
      		},
      		searchs(){
				this.table.currentpage=1;
				this.findList();
			},
			findList(){
				this.loading=true;
				this.$http.post('user/findUserHistoryCapacity',{
					"userid":this.table.search.userid,
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
					this.loading=false;
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
			}
		}
	}
</script>

<style scoped="scoped">
</style>