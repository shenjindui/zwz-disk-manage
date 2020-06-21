<template>
	<div>
		<el-row :gutter="20">
		  	<el-col :span="24">
		  		<el-card class="box-card">
		  			<el-form v-loading="loading" :inline="false" ref="form" :model="form" :rules="rules" label-width="150px">
			  			<el-form-item label="组件编码：" prop="code">
			    			<el-input v-model="form.code" class="input" placeholder="请输入组件编码"></el-input>
			  			</el-form-item>
			  			<el-form-item label="组件名称：" prop="name">
			    			<el-input v-model="form.name" class="input" placeholder="请输入组件名称"></el-input>
			  			</el-form-item>
			  			<el-form-item label="组件说明：">
			    			<el-input v-model="form.remark" class="input" placeholder="请输入组件说明"></el-input>
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
					"code":"",
					"name":"",
					"remark":""
				},
				rules: {
					code: [{ required: true, message: '请输入组件编码', trigger: 'blur' }],
          			name: [{ required: true, message: '请输入组件名称', trigger: 'blur' }]
				}
			}
		},
		created(){
		},
		methods:{
			reset(){
				this.form.code="";
				this.form.name="";
				this.form.remark="";
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
							this.$http.post('typecomponent/save',{
								"code":this.form.code,
								"name":this.form.name,
								"remark":this.form.remark,
								"token":sessionStorage.getItem("token")
							}).then(response => {
								var data= response.body;
								if(data.code==0){
									this.reset();
									this.$emit('dialogResult',data.code);
								}else{
									this.alertMsg(data.code,data.msg);
								}
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