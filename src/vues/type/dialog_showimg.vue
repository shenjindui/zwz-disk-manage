<template>
	<div>
		<el-row :gutter="20">
		  	<el-col :span="24">
		  		<el-card class="box-card" style="text-align: center;">
		  			<img :src="icon" />
				</el-card>
		  	</el-col>
		</el-row>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				icon:""
			}
		},
		methods:{
			reset(){
				this.icon="";
			},
			showInfo(icon){
				this.icon=icon;
			}
		}
	}
</script>

<style scoped="scoped">
</style>