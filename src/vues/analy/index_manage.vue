<template>
	<div class="divnum2" v-loading="loading">
		<div class="content" v-for="item in data">
			<div class="content-method">
				<span><i class="el-icon-star-on"></i>{{item.name}}</span>
			</div>
			<div style="padding-left: 10px;font-size: 12px;color: blue;">
				<i class="el-icon-alarm-clock"></i>{{item.analytime}}
				<span style="margin-left: 20px;">条件：{{item.analycondition}}</span>
			</div>
			<div>
				<span class="content-tag">请求数(<span style="color: red;">{{item.requestcount}}</span>)</span>
				<span class="content-tag">成功数(<span style="color: red;">{{item.successcount}}</span>)</span>
				<span class="content-tag">失败数(<span style="color: red;">{{item.errorcount}}</span>)</span>
				<span class="content-tag">平均耗时(<span style="color: red;">{{item.avgtime}}</span>)</span>
				<span class="content-tag">最大耗时(<span style="color: red;">{{item.maxtime}}</span>)</span>
				<span class="content-tag">最小耗时(<span style="color: red;">{{item.mintime}}</span>)</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				loading:false,
				data:[]
			}
		},
		created(){
			this.findList();
		},
		methods:{
			findList(){
				this.loading=true;
    			this.$http.post('analy/findMethodList',{
    				"projectname":"disk-web-manage",
    				"limit":5,
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
	.divnum2{
		box-sizing: border-box;
		padding: 5px;
		min-height: 270px;
	}
	.divnum2 .content{
		font-size: 14px;
		border-bottom: 1px solid #DCDFE6;
		padding-left: 10px;
		padding-bottom: 5px;
		padding-top: 5px;
	}
	.divnum2 .content .content-method{
		color: #303133;
		font-size: 16px;
	}
	.divnum2 .content .content-tag{
		margin-left: 10px;
		color: #909399;
	}
</style>