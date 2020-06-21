<template>
	<div>
		<el-row :gutter="20" v-loading="loading">
		  	<el-col :span="6">
		  		<el-card class="box-card" :body-style="{padding:'0px'}" v-loading="loading1">
	  				<div class="divnum">
	  					<p><span class="left">文件总数量（{{base.filenum}}）</span></p>
	  					<p><span class="left">文件总大小（{{base.filesize}}）</span></p>
	  					<p><span class="left">切块总数量（{{base.chunknum}}）</span></p>
	  					
	  					<el-button type="text" icon="el-icon-delete" class="btn" @click="clearData">清空数据</el-button>
	  				</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card class="box-card" :body-style="{padding:'0px'}">
	  				<div class="divnum">
	  					<p><span class="left">用户数量（{{base.usernum}}）</span></p>
	  					<p><span class="left">用户文件总数（{{base.userfilenum}}）</span></p>
	  					<p><span class="left">用户文件总大小（{{base.userfilesize}}）</span></p>
	  				</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card class="box-card" :body-style="{padding:'0px'}" v-loading="loading2">
	  				<div class="divnum">
	  					<p><span class="left">MySQL数量（{{base.mysqlnum}}）</span></p>
	  					<p><span class="left">Solr数量（{{base.solrnum}}）</span></p>
	  					<el-button type="text" icon="el-icon-loading" class="btn" @click="synchData">同步数据</el-button>
	  				</div>
				</el-card>
		  	</el-col>
			<el-col :span="6">
				<el-card class="box-card" :body-style="{padding:'0px'}">
	  				<div class="divnum">
	  					<p><span class="left">回收站监听数（{{base.rubbishnum}}）</span></p>
	  					<p><span class="left">分享过期监听数（{{base.sharenum}}）</span></p>
	  				</div>
				</el-card>
			</el-col>
		</el-row>
		<el-row :gutter="20" style="margin-top: 20px;">
		  	<el-col :span="12">
		  		<el-card class="box-card" :body-style="{padding:'0px'}">
	  				<div slot="header" class="clearfix">
	    				<span class="title">业务系统Dubbo接口分析</span>
	  				</div>
	  				<indexdubbo ref="form1"></indexdubbo>
				</el-card>
		  	</el-col>
		  	<el-col :span="12">
		  		<el-card class="box-card" :body-style="{padding:'0px'}">
	  				<div slot="header" class="clearfix">
	    				<span class="title">disk-web-manage项目接口分析</span>
	  					<el-button icon="el-icon-more" style="float: right; padding: 3px 0" type="text" @click="showMore(2)">更多</el-button>
	    				<el-button icon="el-icon-s-data" style="float: right; padding: 3px 0;margin-right: 15px;" type="text" @click="analyLog(2)">分析</el-button>
	  					<el-button icon="el-icon-refresh" style="float: right; padding: 3px 0;margin-right: 15px;" type="text" @click="refreshLog(2)">刷新</el-button>
	  				</div>
	  				<indexmanage ref="form2"></indexmanage>
				</el-card>
		  	</el-col>
		</el-row>
		<el-row :gutter="20" style="margin-top: 20px;">
		  	<el-col :span="12">
		  		<el-card class="box-card" :body-style="{padding:'0px'}">
	  				<div slot="header" class="clearfix">
	    				<span class="title">disk-web-frontwebpage项目接口分析</span>
	  					<el-button icon="el-icon-more" style="float: right; padding: 3px 0" type="text" @click="showMore(3)">更多</el-button>
	    				<el-button icon="el-icon-s-data" style="float: right; padding: 3px 0;margin-right: 15px;" type="text" @click="analyLog(3)">分析</el-button>
	  					<el-button icon="el-icon-refresh" style="float: right; padding: 3px 0;margin-right: 15px;" type="text" @click="refreshLog(3)">刷新</el-button>
	  				</div>
	  				<indexfront ref="form3"></indexfront>
				</el-card>
		  	</el-col>
		  	<el-col :span="12">
		  		<el-card class="box-card" :body-style="{padding:'0px'}">
	  				<div slot="header" class="clearfix">
	    				<span class="title">disk-service-web项目接口分析</span>
	  					<el-button icon="el-icon-more" style="float: right; padding: 3px 0" type="text" @click="showMore(4)">更多</el-button>
	    				<el-button icon="el-icon-s-data" style="float: right; padding: 3px 0;margin-right: 15px;" type="text" @click="analyLog(4)">分析</el-button>
	    				<el-button icon="el-icon-refresh" style="float: right; padding: 3px 0;margin-right: 15px;" type="text" @click="refreshLog(4)">刷新</el-button>
	  				</div>
	  				<indexservice ref="form4"></indexservice>
				</el-card>
		  	</el-col>
		</el-row>
		
		<!--弹出框-->
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width" top="60px"
			:show-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
			<dialogdetail ref="detail" v-if="dialog.type=='detail'"></dialogdetail>
			<dialoganaly ref="analy" v-if="dialog.type=='analy'" v-on:refreshLog="refreshLog"></dialoganaly>
		</el-dialog>
	</div>
</template>

<script>
	import indexdubbo from './index_dubbo.vue';
	import indexmanage from './index_manage.vue';
	import indexfront from './index_front.vue';
	import indexservice from './index_service.vue';
	import dialogdetail from './dialog_detail.vue';
	import dialoganaly from './dialog_analy.vue';
	
	export default{
		data(){
			return {
				loading:false,
				loading1:false,
				loading2:false,
				base:{
					filenum:"0",
					filesize:"0",
					chunknum:"0",
					usernum:"0",
					userfilenum:"0",
					userfilesize:"0",
					mysqlnum:"0",
					solrnum:"0",
					rubbishnum:"0",
					sharenum:"0"
				},
				dialog:{
      				type:"",
      				width:"",
      				visible: false,
      				title:''
      			},
			}
		},
		components:{
			indexdubbo,
			indexmanage,
			indexfront,
			indexservice,
			dialogdetail,
			dialoganaly
		},
		created(){
			this.findBasedata();
		},
		methods:{
			findBasedata(){
				this.loading=true;
				this.$http.post('analy/findBasedata',{
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data= response.body;
					if(data.code==0){
						this.base.filenum=data.data.totalFileNum;
						this.base.filesize=data.data.totalFileSize;
						this.base.chunknum=data.data.totalChunkNum;
						this.base.usernum=data.data.userNum;
						this.base.userfilenum=data.data.userFileNum;
						this.base.userfilesize=data.data.userFileSize;
						this.base.mysqlnum=data.data.searchMysqlNum;
						this.base.solrnum=data.data.searchSolrNum;
						this.base.rubbishnum=data.data.redisRubbishNum;
						this.base.sharenum=data.data.redisShareNum;
					}else{
						this.alertMsg(data.code,data.msg);
					}
					this.loading=false;
				});
			},
			clearData(){
				this.$confirm('是否真实删除所有的数据和文件,此过程可能比较久,请耐心等待?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading1=true;
        			this.$http.post('analy/clearData',{
						"token":sessionStorage.getItem("token")
					}).then(response => {
						var data=response.body;
						if(data.code==0){
							this.findBasedata();
						}
						this.alertMsg(data.code,data.msg);
						this.loading1=false;
					});
        		});
			},
			synchData(){
				this.$confirm('是否把MySQL数据同步到Solr库,此过程可能比较久,请耐心等待?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading2=true;
        			this.$http.post('analy/synchSolr',{
						"token":sessionStorage.getItem("token")
					}).then(response => {
						var data=response.body;
						if(data.code==0){
							this.findBasedata();
						}
						this.alertMsg(data.code,data.msg);
						this.loading2=false;
					});
        		});
			},
			showMore(index){
				this.dialog.width="1200px";
				this.dialog.type="detail";
				this.dialog.title="接口列表";
				this.dialog.visible=true;
				setTimeout(()=>{
					if(index==1){
	    				this.$refs.detail.findList("");
	    			}else if(index==2){
	    				this.$refs.detail.findList("disk-web-manage");
	    			}else if(index==3){
	    				this.$refs.detail.findList("disk-web-frontwebpage");
	    			}else if(index==4){
	    				this.$refs.detail.findList("disk-service-web");
	    			}
				},0);
			},
			refreshLog(index){
				this.dialog.visible=false;
				this.dialog.type="";
				
				setTimeout(()=>{
					if(index==1){
	    				this.$refs.form1.findList();
	    			}else if(index==2){
	    				this.$refs.form2.findList();
	    			}else if(index==3){
	    				this.$refs.form3.findList();
	    			}else if(index==4){
	    				this.$refs.form4.findList();
	    			}
				},0);
			},
			analyLog(index){
				this.dialog.width="600px";
				this.dialog.type="analy";
				this.dialog.title="接口分析";
				this.dialog.visible=true;
				setTimeout(()=>{
					if(index==1){
	    				this.$refs.analy.analyLog("");
	    			}else if(index==2){
	    				this.$refs.analy.analyLog("disk-web-manage",index);
	    			}else if(index==3){
	    				this.$refs.analy.analyLog("disk-web-frontwebpage",index);
	    			}else if(index==4){
	    				this.$refs.analy.analyLog("disk-service-web",index);
	    			}
				},0);
			}
		}
	}
</script>

<style scoped="scoped">
	.divnum{
		height: 100px;
		background: #F56C6C;
		padding: 20px;
		box-sizing: border-box;
		border-radius: 5px;
		position: relative;
	}
	.divnum .left{
		font-weight: bold;
		color: white;
	}
	.divnum .right{
		font-weight: bold;
		color: white;
	}
	.btn{
		position: absolute;
		right: 5px;
		top: -7px;
		color: white;
	}
	/*===============================================*/
	.title{
		border-left: 5px solid blue;padding-left: 10px;font-weight: bold;font-size: 14px;
	}
</style>