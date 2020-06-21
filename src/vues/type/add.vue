<template>
	<div>
		<el-row :gutter="20">
		  	<el-col :span="24">
		  		<el-card class="box-card">
		  			<el-form v-loading="loading" :inline="false" ref="form" :model="form" :rules="rules" label-width="150px" enctype="multipart/form-data">
			  			<el-form-item label="所属类型：" prop="typecode">
			  				<el-select v-model="form.typecode" placeholder="请选择" class="input">
						    	<el-option v-for="item in types" :key="item.code" :label="item.name" :value="item.code"></el-option>
						  	</el-select>
			  			</el-form-item>
			  			<el-form-item label="文件名称：" prop="name">
			    			<el-input v-model="form.name" class="input" placeholder="请输入文件名称"></el-input>
			  			</el-form-item>
			  			<el-form-item label="文件后缀：" prop="suffix">
			    			<el-input v-model="form.suffix" class="input" placeholder="请输入文件后缀"></el-input>
			  			</el-form-item>
			  			<el-form-item label="选择组件：">
			  				<el-select v-model="form.json" multiple placeholder="请选择" class="input" :collapse-tags="true">
						    	<el-option v-for="item in components" :key="item.code" :label="item.name" :value="item.code"></el-option>
			  				</el-select>
			  			</el-form-item>
			  			<el-form-item label="选择图标(32*32)：">
			  				<input type="file" id="file" name="file" v-on:change="onChange($event)"/>
			  			</el-form-item>
			  			<el-form-item label="选择图标(128*128)：">
			  				<input type="file" id="filebig" name="filebig" v-on:change="onChangeBig($event)"/>
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
				types:[],
				components:[],
				form:{
					"typecode":"",
					"name":"",
					"suffix":"",
					"file":"",
					"filebig":"",
					"json":""
				},
				rules: {
					typecode: [{ required: true, message: '请输选择所属类型', trigger: 'blur' }],
          			name: [{ required: true, message: '请输入文件名称', trigger: 'blur' }],
          			suffix: [{ required: true, message: '请输入文件后缀', trigger: 'blur' }],
				}
			}
		},
		created(){
			this.findTypes();
			this.findComponents();
		},
		methods:{
			onChange: function (event) {
      			this.form.file = event.target.files[0];
    		},
    		onChangeBig: function (event) {
      			this.form.filebig = event.target.files[0];
    		},
    		findTypes(){
    			this.loading=true;
				this.$http.post('type/findTypeList',{
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data=response.body;
					if(data.code==0){
						this.types=data.data;
					}else{
						this.alertMsg(data.code,data.msg);
					}
					this.loading=false;
				});
			},
			findComponents(){
				this.loading=true;
				this.$http.post('typecomponent/findList',{
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data=response.body;
					if(data.code==0){
						this.components=data.data;
					}else{
						this.alertMsg(data.code,data.msg);
					}
					this.loading=false;
				});
			},
    		reset(){
    			this.form.type="";
		        this.form.name="";
		        this.form.suffix="";
		        this.form.file="";
		        this.form.filebig="";
		        this.form.json="";
		        
		        document.getElementById("file").value="";
		        document.getElementById("filebig").value="";
    		},
			save() {
        		this.$refs['form'].validate((valid) => {
        			if (valid) {
        				this.$confirm('此操作将保存表单, 是否继续?', '提示', {
		          			confirmButtonText: '确定',
		          			cancelButtonText: '取消',
		          			type: 'warning'
		        		}).then(() => {
		        			var formData = new FormData();
		        			formData.append('typecode', this.form.typecode);
      						formData.append('name', this.form.name);
      						formData.append('suffix', this.form.suffix);
      						formData.append('json', this.form.json);
      						
      						formData.append('file', this.form.file);
      						formData.append('filebig', this.form.filebig);
      						formData.append('token', sessionStorage.getItem("token"));
      						
      						this.loading=true;
	        				this.$http.post('typesuffix/save',formData,{
								headers: { 'Content-Type': 'multipart/form-data' }
							}).then(response => {
								var res= response.body;
								var code=res.code;
								var msg=res.msg;
								if(code==0){
							        this.reset();
							        this.$emit('handleResult',code);
								}
								this.alertMsg(code,msg);
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