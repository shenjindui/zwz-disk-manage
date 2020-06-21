<template>
	<div>
		<el-row :gutter="20">
		  	<el-col :span="24">
		  		<el-card class="box-card">
					<el-form v-loading="loading" :inline="false" ref="form" :model="form" label-width="100px">
			  			<el-form-item label="容量大小：" prop="totalcapacity"
			  				:rules="[
      							{ required: true, message: '请填写容量大小'},
      							{ type: 'number', message: '必须为数字值'}
    						]"	
			  			>
			    			<el-input v-model.number="form.totalcapacity" class="input" placeholder="请输入容量大小"></el-input>
			  			</el-form-item>
			  			<el-form-item label="容量单位：" prop="capacityunit"
			  				:rules="[
      							{ required: true, message: '请选择容量单位'}
    						]"	
			  			>
			  				<el-select v-model="form.capacityunit" placeholder="请选择容量单位" class="input">
    							<el-option label="MB" value="mb"></el-option>
    							<el-option label="GB" value="gb"></el-option>
    							<el-option label="TB" value="tb"></el-option>
  							</el-select>
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
					"userid":"",
					"totalcapacity":"",
					"capacityunit":""
				}
			}
		},
		methods:{
			reset(){
				this.$refs.form.resetFields();
			},
			showInfo(userid){
				this.form.userid=userid;
			},
			save() {
        		this.$refs['form'].validate((valid) => {
        			if (valid) {
        				this.$confirm('此操作将初始化用户网盘容量, 是否继续?', '提示', {
		          			confirmButtonText: '确定',
		          			cancelButtonText: '取消',
		          			type: 'warning'
		        		}).then(() => {
		        			
		        			this.loading=true;
	        				this.$http.post('user/saveUserCapacity',{
	        					"userid":this.form.userid,
								"totalcapacity":this.form.totalcapacity,
								"capacityunit":this.form.capacityunit,
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