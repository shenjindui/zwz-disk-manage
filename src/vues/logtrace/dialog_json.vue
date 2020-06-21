<template>
	<el-row :gutter="20" style="height: 450px;overflow-y: auto;">
	  	<el-col :span="24">
			<json-viewer :value="jsonData" :expand-depth=5 copyable></json-viewer>
			<!--<json-viewer :value="jsonData" :expand-depth=5 copyable boxed sort></json-viewer>-->
	  	</el-col>
	</el-row>
</template>

<script>
	export default{
		data(){
			return {
				jsonData:""
			}
		},
		methods:{
			showJson(jsonData){
				this.jsonData="";
				this.jsonData=JSON.parse(jsonData);
			}
		}
	}
</script>

<style scoped="scoped">
</style>