<template>
	<div>
		<el-row :gutter="20">
		  	<el-col :span="24">
		  		<el-card class="box-card" v-loading="loading">
		  			<el-table v-loading="loading" :data="data" border stripe size="mini" height="400px">
						<el-table-column type="index" width="50"></el-table-column>
						<el-table-column prop="name" label="接口名称"></el-table-column>
						<el-table-column prop="analycondition" label="数据范围" width="150"></el-table-column>
						<el-table-column prop="analytime" label="最近分析时间" width="150"></el-table-column>
						<el-table-column prop="requestcount" label="请求数" width="80"></el-table-column>
						<el-table-column prop="successcount" label="成功数" width="80"></el-table-column>
						<el-table-column prop="errorcount" label="失败数" width="80"></el-table-column>
						<el-table-column prop="avgtime" label="平均耗时" width="80"></el-table-column>
						<el-table-column prop="maxtime" label="最大耗时" width="80"></el-table-column>
						<el-table-column prop="mintime" label="最小耗时" width="80"></el-table-column>
					</el-table>
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
				data: []
			}
		},
		methods:{
			findList(projectname){
				this.loading=true;
    			this.$http.post('analy/findMethodList',{
    				"projectname":projectname,
    				"limit":5000,
					"token":sessionStorage.getItem("token")
				}).then(response => {
					this.loading=false;
					var data=response.body;
					if(data.code==0){
						this.data=data.data;
					}else{
						this.alertMsg(data.code,data.msg);
					}
				});
			}
		}
	}
</script>

<style scoped="scoped">
</style>