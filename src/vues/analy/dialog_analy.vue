<template>
	<div>
		<el-row :gutter="20">
		  	<el-col :span="24">
		  		<el-card class="box-card">
					<el-form v-loading="loading" :inline="false" ref="form" :model="form" label-width="100px">
			  			<el-form-item label="数据范围：">
			  				<el-select v-model="form.type" placeholder="请选择数据范围" class="input">
    							<el-option label="所有数据" value="all"></el-option>
    							<el-option label="当天数据" value="day"></el-option>
    							<el-option label="自定义" value="zdy"></el-option>
  							</el-select>
			  			</el-form-item>
			  			<el-form-item label="时间范围：" v-if="form.type=='zdy'">
			  				<el-date-picker v-model="form.time" type="datetimerange" range-separator="至"
			  					value-format="yyyy-MM-dd HH:mm:ss"
      							start-placeholder="开始时间" end-placeholder="结束时间">
    						</el-date-picker>
			  			</el-form-item>
			  			<el-form-item label="">
			  				<el-button type="primary" @click="save">开始分析</el-button>
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
					"index":"",
					"projectname":"",
					"type":"all",
					"time":"",
					"starttime":"",
					"endtime":""
				}
			}
		},
		methods:{
			analyLog(projectname,index){
				this.form.projectname=projectname;
				this.form.index=index;
			},
			save() {
				if(this.form.type==null||this.form.type.length==0){
					this.alertMsg(1,"请选择数据范围");
					return;
				}
				if(this.form.type=="zdy"){
					if(this.form.time==null||this.form.time.length==0){
						this.alertMsg(1,"请选择日期和时间");
						return;
					}
					this.form.starttime=this.form.time[0];
					this.form.endtime=this.form.time[1];
				}
				
        		this.$confirm('此过程可能比较久,请耐心等待?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
	    			this.$http.post('analy/analyLog',{
	    				"projectname":this.form.projectname,
	    				"type":this.form.type,
	    				"starttime":this.form.starttime,
	    				"endtime":this.form.endtime,
						"token":sessionStorage.getItem("token")
					}).then(response => {
						this.loading=false;
						var data=response.body;
						if(data.code==0){
							this.$emit('refreshLog',this.form.index);
						}else{
							this.alertMsg(data.code,data.msg);
						}
					});
        		});
      		}
		}
	}
</script>

<style scoped="scoped">
	.input{
		width: 200px;
	}
</style>