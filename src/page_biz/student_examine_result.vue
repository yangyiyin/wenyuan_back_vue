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
            <el-select v-model="status"  placeholder="请选择批阅状态" clearable>
                <el-option
                        v-for="item in [{id:0,name:'待批阅'},{id:1,name:'机器已批阅'},{id:2,name:'人工已审阅'},{id:3,name:'批阅完毕'}]"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>

            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-tag type="warning" style="margin-left: 200px;" v-if="process_num > 0">系统正在处理当前第{{process_num}}张答卷中...</el-tag>

            <el-button v-if="zip_url"  style="float: right" type="primary" @click="dialogFormVisibleExcelin=true;">解析学生答卷</el-button>
            <el-button v-if="error_info"  style="float: right" type="primary" @click="dialogFormVisibleError=true;">解析错误日志</el-button>
            <uploader style="float: right" ref="uploader" :autoStart="false" :options="upload_options" class="uploader-example">
                <uploader-unsupport></uploader-unsupport>
                <uploader-btn :attrs="attrs">导入答卷zip</uploader-btn>
                <!--<uploader-drop>-->
                <!--&lt;!&ndash;<p>Drop files here to upload or</p>&ndash;&gt;-->
                <!--<uploader-btn>选择文件</uploader-btn>-->
                <!--&lt;!&ndash;<uploader-btn :attrs="attrs">select images</uploader-btn>&ndash;&gt;-->
                <!--&lt;!&ndash;<uploader-btn :directory="true">select folder</uploader-btn>&ndash;&gt;-->
                <!--</uploader-drop>-->
                <uploader-list></uploader-list>
            </uploader>
        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column label="考生序号" prop="examination.id"></el-table-column>
                <el-table-column label="考试" prop="examination.title"></el-table-column>
                <el-table-column label="试卷" prop="examine_paper_info.title"></el-table-column>
                <el-table-column label="班级" prop="class_info.classname"></el-table-column>
                <el-table-column label="姓名" prop="student_name"></el-table-column>
                <el-table-column label="准考证号" prop="ticket_id"></el-table-column>
                <!--<el-table-column label="总分" prop="total_score"></el-table-column>-->

                <el-table-column label="总分">
                    <template slot-scope="scope">

                        <el-tag v-if="scope.row.total_score">{{scope.row.total_score}}</el-tag>
                        <span v-if="!scope.row.total_score">{{scope.row.total_score}}</span>

                    </template>
                </el-table-column>

                <el-table-column label="状态" prop="status_desc"></el-table-column>
                <!--<el-table-column label="排序">-->
                    <!--<template slot-scope="scope">-->
                        <!--{{scope.row.sort}}-->
                        <!--<el-button size="mini" @click="handleSort(scope.row)"></el-button>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column label="创建日期" prop="create_time"></el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status == 1" size="mini" @click="goto_edit_student_examine_result(scope.row.id)">批阅</el-button>
                        <el-button v-if="scope.row.status == 3" size="mini" @click="goto_edit_student_examine_result(scope.row.id)">重新批阅</el-button>
                        <el-button v-if="scope.row.status == 2" size="mini" @click="reckon_result(scope.row)">计算成绩</el-button>
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
        <el-dialog title="解析学生答卷" :visible.sync="dialogFormVisibleExcelin" width="30%">

            <p >解析答卷之后,将<span style="color: red">初始化</span>当前考试的所有数据(<span style="color: red">删除人工阅卷结果</span>),所以请务必谨慎操作!</p>
            <p style="margin-top: 20px;">
                <el-input
                        style="display: inline-block;width: 250px;"
                        placeholder="输入密码"
                        v-model="password"
                        clearable>
                </el-input>
            </p>

            <div slot="footer" class="dialog-footer" v-show="password==123456">
                <el-button @click="dialogFormVisibleExcelin = false">取 消</el-button>

                <el-button id="browseButton" type="primary" @click="parse()">解析</el-button>
            </div>
        </el-dialog>

        <el-dialog title="解析错误日志" :visible.sync="dialogFormVisibleError" width="80%">

            <p style="margin-top: 20px;">
                {{error_info}}
            </p>

            <div slot="footer" class="dialog-footer" >
                <el-button @click="dialogFormVisibleError = false">关 闭</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {student_examine_result_list,student_examine_result_del,student_examine_result_verify,parse_zip,get_parse_zip_process,reckon_result} from '@/api/getDatastudent_examine_result'
    import {get_examine_paper_data_url} from '@/api/getDataEarth'
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
                dialogFormVisibleError:false,
                error_info:'',
                current:{},
//                remark:'',
//                choose_categories:[],
//                categories:[],
                has_zip:false,
                name:'',
                status:'',
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
                },
                zip_url:'',
                process_num:0
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
            this.uploader.on('fileSuccess',  (rootFile, file, message) => {
                console.log(rootFile, file, message);
                this.list();
            })
// 根下的单个文件（文件夹）上传完成
            this.uploader.on('fileComplete', function (rootFile) {
                console.log(rootFile);
              //  vm.list();
            })
            this.uploader.on('fileError', function (rootFile, file, message) {
                console.log(rootFile, file, message)
            });


        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.examine_id = to.query.examine_id ? to.query.examine_id : 0;
                vm.examine_paper_id = to.query.examine_paper_id ? to.query.examine_paper_id : 0;


            vm.upload_options.query.examine_id = vm.examine_id;
            vm.upload_options.query.examine_paper_id = vm.examine_paper_id;

                // 通过 `vm` 访问组件实例
                vm.list();
                vm.get_examine_paper_data_url();
                vm.get_parse_zip_process();
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
                student_examine_result_list({page:this.currentPage,page_size:this.limit,examine_id:this.examine_id,examine_paper_id:this.examine_paper_id,name:this.name,ticket_id:this.ticket_id,status:this.status}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.tableData = res.data.list;
                        this.has_zip = res.data.has_zip;
                        this.count = parseInt(res.data.count);
                    }
                }.bind(this));

            },
            get_examine_paper_data_url(){
                if (!this.examine_id || !this.examine_paper_id) {
                    this.$message({
                        type: 'error',
                        message: '页面错误,请重进当前页面'
                    });
                }
                get_examine_paper_data_url({examine_id:this.examine_id,examine_paper_id:this.examine_paper_id}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.zip_url = res.data;
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
            parse() {

                if (!this.examine_id || !this.examine_paper_id) {
                    this.$message({
                        type: 'error',
                        message: '页面错误,请重进当前页面'
                    });
                }
                setTimeout(() => {this.get_parse_zip_process()}, 2000);
                this.dialogFormVisibleExcelin = false;
                parse_zip({examine_id:this.examine_id,examine_paper_id:this.examine_paper_id}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.$message({
                            type: 'success',
                            message: '解析成功'
                        });
                        this.list();
                        this.dialogFormVisibleExcelin = false;
                    } else {
                        this.error_info = res.msg;
                        this.dialogFormVisibleError = true;
                    }
                }.bind(this));

            },
            get_parse_zip_process(){
                if (!this.examine_id || !this.examine_paper_id) {
                    this.$message({
                        type: 'error',
                        message: '页面错误,请重进当前页面'
                    });
                }
                get_parse_zip_process({examine_id:this.examine_id,examine_paper_id:this.examine_paper_id}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        if (res.data > 0) {
                            this.process_num = res.data;
                            setTimeout(() => {
                                this.get_parse_zip_process();
                            }, 3000)
                        } else {
                            this.process_num = 0;
                        }
                    }
                }.bind(this));
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
            },
            goto_edit_student_examine_result(id) {
                this.$router.push({path:'edit_student_examine_result',query:{id:id}});
            },
            reckon_result(row) {
                reckon_result({examine_id:row.examine_id,examine_paper_id:row.examine_paper_id,ticket_id:row.ticket_id}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.$message({
                            type: 'success',
                            message: '计算成功'
                        });
                        this.list();
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.msg
                        });
                    }
                    this.list();
                    this.showSetResultVisible = false;
                }.bind(this)).finally(function(){

                }.bind(this));
            },
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
