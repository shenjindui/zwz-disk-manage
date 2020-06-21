<template>
	<el-row :gutter="20" style="height: 450px;overflow-y: auto;">
	  	<el-col :span="24">
	  		<el-card class="box-card" v-loading="loading">
	  			<el-timeline>
			    	<el-timeline-item v-for="item in lists" type="success" size="large" :timestamp="'【'+item.starttime+'】【'+item.projectname+'】【'+item.targetmethod+'】'" placement="top">
			      		<el-card style="position: relative;">
			      			<el-tag effect="dark" class="rownum" type="danger" size="mini">{{item.index}}</el-tag>
			      			<table class="table">
			      				<tr>
			      					<td class="tdleft">访问IP：</td>
			      					<td>{{item.requestip}}</td>
			      					<td class="tdleft">操作人：</td>
			      					<td>{{item.username}}</td>
			      					<td class="tdleft">执行结果：</td>
			      					<td>
			      						<span style="color: green;" v-if="item.executeresult=='执行成功'">{{item.executeresult}}</span>
			      						<span class="link" @click="showUI(item.executeresult)" v-if="item.executeresult!='执行成功'">查看</span>
			      					</td>
			      				</tr>
			      				<tr>
			      					<td class="tdleft">开始时间：</td>
			      					<td>{{item.starttime}}</td>
			      					<td class="tdleft">结束时间：</td>
			      					<td>{{item.endtime}}</td>
			      					<td class="tdleft">消耗时间：</td>
			      					<td><span style="color: red;">{{item.comsumetime}}</span>毫秒</td>
			      				</tr>
			      				<tr>
			      					<td class="tdleft">方法参数：</td>
			      					<td>
  										<span class="link" @click="showUI(item.targetparams)">查看</span>
			      					</td>
			      					<td class="tdleft">返回内容：</td>
			      					<td>
			      						<span class="link" @click="showUI(item.returnresult)">查看</span>
			      					</td>
			      					<td class="tdleft">备注：</td>
			      					<td>
			      						<span class="link" @click="showUI(item.remark)" v-if="item.remark!=''&&item.remark!=null">查看</span>
			      					</td>
			      				</tr>
			      			</table>
			      		</el-card>
			    	</el-timeline-item>
			  	</el-timeline>
			  	
			  	<!--弹出框-->
				<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width" top="60px"
					:show-close="false" :modal="false" :close-on-click-modal="false" :close-on-press-escape="false">
					
					<dialogjson ref="form" v-if="dialog.type=='json'"></dialogjson>
					
					<div slot="footer" class="dialog-footer">
		    			<el-button @click="dialogClose()">取 消</el-button>
		  			</div>
				</el-dialog>
			</el-card>
	  	</el-col>
	</el-row>
</template>

<script>
	import dialogjson from './dialog_json.vue';
	export default{
		data(){
			return {
				loading:false,
				lists:[],
				dialog:{
      				type:"",//类型（add表示添加窗口，edit表示修改窗口）
      				visible: false,
      				title:''
      			}
			}
		},
		components:{
    		dialogjson
		},
		methods:{
			showList(traceid){
				this.loading=true;
				this.$http.post(this.logurl+'log/admin/findDetail',{
					"traceid":traceid,
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data=response.body;
					if(data.code==0){
						var rows=data.data;
						for(var i=0;i<rows.length;i++){
							rows[i].index=i+1;
						}
						this.lists=rows;
					}else{
						this.alertMsg(data.code,data.msg);
					}
					this.loading=false;
				});
			},
			showUI(json){
				this.dialog.width="1000px";
				this.dialog.type="json";
				this.dialog.title="json字符串";
				this.dialog.visible=true;
				setTimeout(()=>{
					this.$refs.form.showJson(json);
				},0);
			},
			dialogClose(){
				this.dialog.visible=false;
			}
		}
	}
</script>

<style scoped="scoped">
	.table{
		width: 100%;
		font-size: 12px;
	}
	.table tr{
		line-height: 20px;
	}
	.table .tdleft{
		width: 120px;
		text-align: right;
		padding-right: 10px;
	}
	.rownum{
		position: absolute;
		top: 10px;
		left: 10px;
	}
	.content{
		line-height: 30px;
		height: 500px;
		padding: 10px;
		overflow-y: auto;
	}
	.link{
		cursor: pointer;
		color: blue;
	}
</style>