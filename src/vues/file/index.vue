<template>
	<div style="background: white;padding: 10px;">
		<el-row>
		  	<el-col :span="24">
		  		<!--查询-->
				<el-form :inline="true" class="demo-form-inline">
		  			<el-form-item label="文件名称：">
		    			<el-input v-model="search.filename" size="mini" placeholder="请输入文件名称"></el-input>
		  			</el-form-item>
		  			<el-form-item label="文件MD5：">
		    			<el-input v-model="search.md5" size="mini" placeholder="请输入文件Md5"></el-input>
		  			</el-form-item>
		  			<el-form-item>
		    			<el-button type="primary" size="mini" icon="el-icon-search" @click="searchs()">查询</el-button>
		  			</el-form-item>
				</el-form>
		  		<!--列表-->
	  			<el-table v-loading="loading" :data="table.data" size="small" :stripe="true">
					<el-table-column prop="filename" label="文件名">
						<template slot-scope="scope">
							<img :src="scope.row.icon" style="vertical-align: middle;margin-right: 10px;" />
							<span class="link">{{scope.row.filename}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="filesize" label="大小" width="150">
						<template slot-scope="scope">{{scope.row.filesizename}}</template>
					</el-table-column>
					<el-table-column prop="md5" label="md5值" width="250"></el-table-column>
					<el-table-column prop="filenum" label="切块数" width="100"></el-table-column>
					<el-table-column prop="typecode" label="所属类型" width="100"></el-table-column>
					<el-table-column prop="imgsize" label="尺寸" width="150"></el-table-column>
					<el-table-column prop="cz" label="操作" width="100">
						<template slot-scope="scope">
							<el-button type="text" @click="download(scope.row.filename,scope.row.md5)">下载</el-button>
						</template>
					</el-table-column>
				</el-table>
		  	</el-col>
		</el-row>
		<el-row>
		  	<el-col :span="24" style="text-align: center;">
				<el-pagination
					@size-change="sizechange"
					@current-change="currentchange"
					@prev-click="prevClick"
		      		@next-click="nextClick"
		      		:page-sizes="[10,20,30,40,50]"
		      		:current-page="table.currentpage"
		      		:page-size="table.pagesize"
		      		:total="table.total"
		      		layout="total, sizes, prev, pager, next, jumper">
		    	</el-pagination>
		   </el-col>
		</el-row>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				loading:false,
				search:{
					filename:"",
					md5:""
				},
				table:{
					data:[],
					currentpage:1,
	      			pagesize:10,
	      			total:0,
				}
			}
		},
		components:{
		},
		created(){
			this.searchs();
		},
		methods:{
			searchs(){
				this.table.currentpage=1;
				this.findList();
			},
			findList(){
				this.loading=true;
				this.$http.post('file/findList',{
					"filename":this.search.filename,
					"md5":this.search.md5,
					"page":this.table.currentpage,
					"limit":this.table.pagesize,
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data=response.body;
					if(data.code==0){
						var rows=data.rows;
						if(rows!=null&&rows.length!=0){
							for(var i=0;i<rows.length;i++){
								var d=rows[i];
								d.rowindex=i;
								d.icon="data:image/png;base64,"+d.fileicon;
							}
						}					
						this.table.data=rows;
						this.table.total=data.totalElements;
					}else{
						this.alertMsg(data.code,data.msg);
					}
					this.loading=false;
				});
			},
			sizechange(pagesize){
				this.table.pagesize=pagesize;
				this.findList();
			},
			currentchange(currentpage){
				this.table.currentpage=currentpage;
				this.findList();
			},
			prevClick(){
				this.table.currentpage=this.table.currentpage-1;
				this.findList();
			},
			nextClick(){
				this.table.currentpage=this.table.currentpage+1;
				this.findList();
			},
			download(filename,md5){
				location.href=this.baseurl+"file/download?filename="+filename+"&md5="+md5+"&token="+sessionStorage.getItem("token");
			},
		}
	}
</script>

<style scoped="scoped">
	.link:hover{
		color: blue;
		cursor: pointer;
	}
</style>