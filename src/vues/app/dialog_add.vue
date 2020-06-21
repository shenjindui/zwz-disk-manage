<template>
	<div>
		<el-row :gutter="20">
		  	<el-col :span="24">
		  		<el-card class="box-card">
					<el-form v-loading="loading" :inline="false" ref="form" :model="form" :rules="rules" label-width="100px">
			  			<el-form-item label="应用名称：" prop="appname">
			    			<el-input v-model="form.appname" class="input" placeholder="请输入应用名称"></el-input>
			  			</el-form-item>
			  			<el-form-item label="应用说明：">
			    			<el-input v-model="form.appdesc" class="input" placeholder="请输入应用说明"></el-input>
			  			</el-form-item>
			  		</el-form>
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
				form:{
					"appname":"",
					"appdesc":""
				},
				rules: {
          			appname: [{ required: true, message: '请输入应用名称', trigger: 'blur' }]
				}
			}
		},
		methods:{
			reset(){
				this.$refs.form.resetFields();
			},
			save() {
        		this.$refs['form'].validate((valid) => {
        			if (valid) {
        				this.$confirm('此操作将保存表单, 是否继续?', '提示', {
		          			confirmButtonText: '确定',
		          			cancelButtonText: '取消',
		          			type: 'warning'
		        		}).then(() => {
		        			
		        			this.loading=true;
	        				this.$http.post('app/save',{
								"appname":this.form.appname,
								"appdesc":this.form.appdesc,
								"token":sessionStorage.getItem("token")
							}).then(response => {
								var data= response.body;
								if(data.code==0){
									this.reset();
							        this.$emit('dialogResult');
								}
								this.alertMsg(data.code,data.msg);
								this.loading=false;
							});
        				});
          			}
        		});
      		}
		}
	}
</script>

<style scoped="scoped">
	.input{
		width: 300px;
	}
</style>