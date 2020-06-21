<template>
	<div style="height: 100%;">
		<el-row :gutter="20" style="height: 100%;">
		  	<el-col :span="5" style="height: 100%;">
		  		<el-card class="box-card" style="height: 100%;">
				  	<div slot="header" class="clearfix">
				    	<span>文件类型</span>
				    	<el-button style="float: right; padding: 3px 0" type="text" @click="init()">初始化数据</el-button>
				  	</div>
				  	<el-tree :data="types" v-loading="loadingtree" :default-expand-all="true" @node-click="handleNodeClick"></el-tree>
				</el-card>
		  	</el-col>
		  	<el-col :span="19" style="height: 100%;">
		  		<el-card class="box-card" style="height: 100%;overflow-y: auto;">
				  	<div slot="header" class="clearfix">
				    	<span>类型明细</span>
				    	<el-button style="float: right; padding: 3px 0" type="text" @click="handleAddUI()" icon="el-icon-plus">新增</el-button>
				    	<el-button style="float: right; padding: 3px 0" type="text" @click="searchs()" icon="el-icon-refresh">刷新</el-button>
				  	</div>
				  	<el-table v-loading="loadingtable" :data="details" border stripe size="small">
						<el-table-column prop="icon" label="小图标" width="150">
							<template slot-scope="scope">
								<img :src="scope.row.icon" />
							</template>
						</el-table-column>
						<el-table-column prop="iconbig" label="大图标" width="150">
							<template slot-scope="scope">
								<el-link type="primary" @click="showImgUI(scope.row.iconbig)">查看大图</el-link>
							</template>
						</el-table-column>
						<el-table-column prop="name" label="名称" width="150"></el-table-column>
						<el-table-column prop="suffix" label="后缀" width="100"></el-table-column>
						<el-table-column prop="componentname" label="关联组件"></el-table-column>
						<el-table-column prop="cz" label="操作" width="150">
							<template slot-scope="scope">
					        	<el-button type="text" size="mini" icon="el-icon-edit" @click="handleEditUI(scope.row.id)">修改</el-button>
					        	<el-button type="text" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row.id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<!--分页-->
					<el-pagination
						@size-change="sizechange"
						@current-change="currentchange"
						@prev-click="prevClick"
			      		@next-click="nextClick"
			      		:page-sizes="[10]"
			      		:current-page="currentpage"
			      		:page-size="pagesize"
			      		:total="total"
			      		layout="total, sizes, prev, pager, next, jumper">
			    	</el-pagination>
				</el-card>
		  	</el-col>
		</el-row>
		
		<!--弹出框-->
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width" top="60px"
			:show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
			<add ref="form" v-if="dialog.type=='add'" v-on:handleResult="handleResult"></add>
			<edit ref="form" v-if="dialog.type=='edit'" v-on:handleResult="handleResult"></edit>
			<showimg ref="form" v-if="dialog.type=='showimg'"></showimg>
			
			<div slot="footer" class="dialog-footer">
    			<el-button @click="handleClose()">取 消</el-button>
    			<el-button type="primary" @click="handleConfirm()" v-if="dialog.type!='showimg'">确 定</el-button>
  			</div>
		</el-dialog>
	</div>
</template>

<script>
	import add from './add.vue';
	import edit from './edit.vue';
	import showimg from './dialog_showimg.vue';
	export default {
		data(){
			return {
				loadingtree:false,
				loadingtable:false,
				
				types:[],
				details:[],
				typecode:'all',
				currentpage:1,
      			pagesize:10,
      			total:0,
      			
				dialog:{
      				width:"600px",
      				type:"",//类型（add表示添加窗口，edit表示修改窗口）
      				visible: false,
      				title:''
      			}
			}
		},
		components:{
			add,
			edit,
			showimg
		},
		created(){
			this.findTypeTree();
			//this.searchs();
		},
		methods:{
			findTypeTree(){
				this.loadingtree=true;
				this.$http.post('type/findTypeTree',{
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data=response.body;
					if(data.code==0){
						this.types=data.data;
					}else{
						this.alertMsg(data.code,data.msg);
					}
					this.loadingtree=false;
				});
			},
			init(){
				this.$confirm('此操作将初始化文件类型, 是否继续?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loadingtree=true;
        			this.loadingtable=true;
        			this.$http.post('type/init',{
        				"token":sessionStorage.getItem("token")
        			}).then(response => {
						var data=response.body;
						if(data.code==0){
							this.findTypeTree();
							this.searchs();
						}
						this.alertMsg(data.code,data.msg);
						this.loadingtree=false;
        				this.loadingtable=false;
					});
        		});
			},
			handleNodeClick(data) {
				this.typecode=data.code;
				if(data.code!="all"){
					this.searchs();
				}
			},
			////////////////////////////////////////////////////////////////////////
			searchs(){
				this.currentpage=1;
				this.findTypeDetail();
			},
			findTypeDetail(){
				this.loadingtable=true;
				this.$http.post('typesuffix/findList',{
					"typecode":this.typecode,
					"page":this.currentpage,
					"limit":this.pagesize,
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data=response.body;
					if(data.code==0){
						var rows=data.rows;
						if(rows!=null&&rows.length!=0){
							for(var i=0;i<rows.length;i++){
								var d=rows[i];
								d.icon="data:image/png;base64,"+d.icon;
								d.iconbig="data:image/png;base64,"+d.iconbig;
							}
						}
						
						this.details=rows;
						this.total=data.totalElements;
					}else{
						this.alertMsg(data.code,data.msg);
					}
					this.loadingtable=false;
				});
			},
			sizechange(pagesize){
				this.pagesize=pagesize;
				this.findTypeDetail();
			},
			currentchange(currentpage){
				this.currentpage=currentpage;
				this.findTypeDetail();
			},
			prevClick(){
				this.currentpage=this.currentpage-1;
				this.findTypeDetail();
			},
			nextClick(){
				this.currentpage=this.currentpage+1;
				this.findTypeDetail();
			},
			////////////////////////////////////////////////////////////////////////
			handleAddUI(){
				this.dialog.width="600px";
				this.dialog.type="add";
				this.dialog.title="新增";
				this.dialog.visible=true;
			},
			handleEditUI(id){
				this.dialog.width="600px";
				this.dialog.type="edit";
				this.dialog.title="修改";
				this.dialog.visible=true;
				setTimeout(()=>{
					this.$refs.form.showInfo(id);
				},0);
			},
			showImgUI(icon){
				this.dialog.width="400px";
				this.dialog.type="showimg";
				this.dialog.title="大图展示";
				this.dialog.visible=true;
				setTimeout(()=>{
					this.$refs.form.showInfo(icon);
				},0);
			},
			////////////////////////////////////////////////////////////////////////
			handleClose(){
				this.dialog.visible=false;
			},
			handleConfirm(){
				this.$refs.form.save();
			},
			handleResult(code){
				this.handleClose();
				this.searchs();
			},
			////////////////////////////////////////////////////////////////////////
			handleDelete(id){
				this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loadingtable=true;
        			this.$http.post('typesuffix/delete',{
        				"id":id,
        				"token":sessionStorage.getItem("token")
        			}).then(response => {
						var data=response.body;
						if(data.code==0){
							this.searchs();
						}
						this.alertMsg(data.code,data.msg);
        				this.loadingtable=false;
					});
        		});
			}
		}
	}
</script>

<style scoped="scoped">
</style>