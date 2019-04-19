<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="准考证号"
                    v-model="ticket_id"
                    clearable>
            </el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button style="float: right" type="primary" @click="dialogFormVisibleExcelin=true;">导入学生答卷</el-button>

        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column label="名称" prop="name"></el-table-column>
                <el-table-column label="排序">
                    <template slot-scope="scope">
                        {{scope.row.sort}}
                        <el-button size="mini" @click="handleSort(scope.row)">设置</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="创建日期" prop="create_time"></el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="goto_edit_student_examine_result(scope.row.id)">编辑</el-button>
                        <!--<el-button size="mini" v-if="scope.row.status == 1" @click="verify(scope, 0)" :loading="loadingBtn == scope.$index">下架</el-button>-->
                        <!--<el-button size="mini" v-if="scope.row.status == 0" @click="verify(scope, 1)" :loading="loadingBtn == scope.$index">上架</el-button>-->
                        <el-button size="mini" @click="del(scope.row, scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="limit"
                        layout="total, prev, pager, next"
                        :total="count"
                        background>
                </el-pagination>
            </div>
        </div>
        <el-dialog title="导入学生答卷" :visible.sync="dialogFormVisibleExcelin" width="30%">

            <p >导入学生答卷,格式必须为<span style="color: red">zip</span>压缩包。导入答卷之后,将<span style="color: red">初始化</span>当前考试的所有数据(<span style="color: red">删除人工阅卷结果</span>),所以请务必谨慎操作!</p>
            <p style="margin-top: 20px;">
                <el-input
                        style="display: inline-block;width: 250px;"
                        placeholder="输入密码"
                        v-model="password"
                        clearable>
                </el-input>
            </p>

            <div slot="footer" class="dialog-footer" v-show="password==123456">
                <!--<el-button @click="dialogFormVisibleExcelin = false">取 消</el-button>-->

                <uploader ref="uploader" :autoStart="false" :options="upload_options" class="uploader-example">
                    <uploader-unsupport></uploader-unsupport>
                    <uploader-btn :attrs="attrs">选择文件</uploader-btn>
                    <!--<uploader-drop>-->
                        <!--&lt;!&ndash;<p>Drop files here to upload or</p>&ndash;&gt;-->
                        <!--<uploader-btn>选择文件</uploader-btn>-->
                        <!--&lt;!&ndash;<uploader-btn :attrs="attrs">select images</uploader-btn>&ndash;&gt;-->
                        <!--&lt;!&ndash;<uploader-btn :directory="true">select folder</uploader-btn>&ndash;&gt;-->
                    <!--</uploader-drop>-->
                    <uploader-list></uploader-list>
                </uploader>

                <!--<el-button id="browseButton" type="primary" @click="excel_in()">选择文件</el-button>-->
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {student_examine_result_list,student_examine_result_del,student_examine_result_verify,student_examine_result_sort} from '@/api/getDatastudent_examine_result'
    import {getStore} from '@/config/mUtils'
    export default {
        data(){
            return {
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                dialogFormVisible:false,
                dialogFormVisibleExcelin:false,
                current:{},
//                remark:'',
//                choose_categories:[],
//                categories:[],
                name:'',
                ticket_id:'',
                examine_id:0,
                examine_paper_id:0,
                loadingBtn:-1,
                password:'',
                upload_url:this.$store.state.constant.upload_examine_paper_zip_chunk,
                upload_data:{token:getStore('token') ? getStore('token') : ''},
                upload_options:{
                    target: this.$store.state.constant.upload_examine_paper_zip_chunk,
                    query: {token:getStore('token') ? getStore('token') : ''},
                    singleFile:true,
                    simultaneousUploads:1,
                    autoStart:false
                },
                attrs:{
                    accept:'application/zip'
                }
            }
        },
        components: {
            headTop,
        },
        created(){

        },
        mounted(){

//            if (!this.uploader.support) {
//                this.$message({
//                    type: 'warning',
//                    message: '当前浏览器不支持上传文件'
//                });
//            }
//
//            //创建上传
           // this.uploader.assignBrowse(document.getElementById('browseButton'))
//            this.uploader.upload();


            this.uploader = this.$refs.uploader.uploader;
            this.uploader.on('fileAdded',  (file, event) => {
               // console.log(file, event)
                if (file.fileType !='application/zip') {
                    this.$message({
                        type: 'warning',
                        message: '只能上传zip文件'
                    });
                    file.cancel();
                    return;
                }
            })
// 单个文件上传成功
            this.uploader.on('fileSuccess', function (rootFile, file, message) {
                console.log(rootFile, file, message)
            })
// 根下的单个文件（文件夹）上传完成
            this.uploader.on('fileComplete', function (rootFile) {
                console.log(rootFile)
            })
            this.uploader.on('fileError', function (rootFile, file, message) {
                console.log(rootFile, file, message)
            })
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.examine_id = to.query.examine_id ? to.query.examine_id : 0;
                vm.examine_paper_id = to.query.examine_paper_id ? to.query.examine_paper_id : 0;
                // 通过 `vm` 访问组件实例
                vm.list();
        })
        },
        methods: {
            list() {
                if (!this.examine_id || !this.examine_paper_id) {
                    this.$message({
                        type: 'error',
                        message: '页面错误,请重进当前页面'
                    });
                }
                student_examine_result_list({page:this.currentPage,page_size:this.limit,examine_id:this.examine_id,examine_paper_id:this.examine_paper_id,name:this.name,ticket_id:this.ticket_id}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.tableData = res.data.list;
                        this.count = parseInt(res.data.count);
                    }
                }.bind(this));

            },
            handleCurrentChange(val){
                this.currentPage = val;
                this.list();
            },
            handleEdit(row){
                this.dialogFormVisible = true;
                if (row) {
                    this.current_entity = row;
                } else {
                    this.current_entity = {};
                }

            },
            search() {
                this.currentPage = 1;
                this.list();
            },
            excel_in() {

                this.uploader.upload();

            },
            verify(scope, status) {

                this.$confirm('确认此操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    var item = scope.row;
                    this.loadingBtn = scope.$index;
                    student_examine_result_verify({id:item.id,status:status}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            item.status = status;
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.msg
                            });
                        }
                    }.bind(this)).finally(function(){
                        this.loadingBtn = -1;
                    }.bind(this));
                }.bind(this));



            },
            del(item, index) {

                this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    student_examine_result_del({id:item.id}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            this.tableData.splice(index,1);
                            this.count --;
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            });
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.msg
                            });
                        }
                    }.bind(this));
                }.bind(this))

            },
            handleSort(row){
                this.dialogFormVisible = true;
                this.current = row;
            },
            sort() {
                student_examine_result_sort({
                    id:this.current.id,
                    sort:this.current.sort

                }).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.dialogFormVisible = false;
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'warning'
                        });
                    }
                }.bind(this));
                this.dialogFormVisible = false;
            }
        },
    }
</script>

<style lang="less">
    @import '../style/mixin';
    .table_container{
        padding: 20px;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>
