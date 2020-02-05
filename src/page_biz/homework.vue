<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <!--<el-input-->
                    <!--style="display: inline-block;width: 250px;"-->
                    <!--placeholder="名称"-->
                    <!--v-model="name"-->
                    <!--clearable>-->
            <!--</el-input>-->


            <el-autocomplete
                    v-model="classname"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入班级名称"
                    @select="handleSelect"
                    @focus="focusInput('classname', 'classinfo')"
                    clearable
                    style="width: 250px;"
            ></el-autocomplete>

            <el-autocomplete
                    v-model="homeworkname"
                    :fetch-suggestions="querySearchAsyncHomework"
                    placeholder="请输入作业名称"
                    @select="handleSelectHomework"
                    @focus="focusInput('homeworkname', 'homeworkinfo')"
                    clearable
                    style="width: 250px;"
            ></el-autocomplete>

            <el-select clearable v-model="author" value-key="id" placeholder="课程老师">
                <el-option
                        v-for="item in authors"
                        :key="item.id"
                        :label="item.show_name"
                        :value="item.id">
                </el-option>
            </el-select>

            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button style="float: right" type="primary" @click="goto_edit_homework(0)">新增家庭作业</el-button>

        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column label="作业标题" prop="name"></el-table-column>
                <!--<el-table-column label="作业形式" prop="response_type_desc"></el-table-column>-->
                <el-table-column label="是否需要上传图片">

                    <template slot-scope="scope">
                        <span>
                            {{scope.row.need_upload_pic == 1 ? '是':'否'}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="是否需要上传录音">

                    <template slot-scope="scope">
                        <span>
                            {{scope.row.need_record_voice == 1 ? '是':'否'}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="是否需要人工批阅">

                    <template slot-scope="scope">
                        <span>
                            {{scope.row.need_manual_check == 1 ? '是':'否'}}
                        </span>
                    </template>
                </el-table-column>
                <!--<el-table-column label="附件" >-->
                    <!--<template slot-scope="scope">-->
                        <!--<p v-for="(item) in scope.row.other_downloads">-->
                            <!--{{item.name}}-->
                        <!--</p>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column label="课程班级" style="overflow: hidden">
                    <template slot-scope="scope">
                        <!--<span v-for="(item,index) in scope.row.classes" v-if="index<1">-->
                            <!--{{item.classname}};-->
                        <!--</span>-->
                        <span v-if="scope.row.classes[0]">
                            {{scope.row.classes[0].classname}};
                        </span>
                        <span v-if="scope.row.classes[1]">
                            ...
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="课程老师">
                    <template slot-scope="scope">
                        <span v-for="(item) in scope.row.teacher_name">
                            {{item.show_name}};
                        </span>
                    </template>
                </el-table-column>

                <el-table-column label="创建日期" prop="create_time"></el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.response_type == 2" size="mini" @click="show_img(scope.row)">预览作业</el-button>
                        <el-button v-if="scope.row.response_type == 2" size="mini" @click="view_homework(scope.row)">预览作业含答案</el-button>
                        <el-button size="mini" @click="goto_edit_homework(scope.row.id)">编辑</el-button>

                        <el-button size="mini" v-if="scope.row.status == 1" @click="verify(scope, 0)" :loading="loadingBtn == scope.$index">下架</el-button>
                        <el-button size="mini" v-if="scope.row.status == 0" @click="verify(scope, 1)" :loading="loadingBtn == scope.$index">上架</el-button>

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
        <el-dialog title="修改排序" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="current">
                <el-form-item label="排序值(越大越靠前)">
                    <el-input v-model="current.sort" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="sort">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
    import {homework_list,homework_del,homework_verify,homework_sort} from '@/api/getDataHomework'
    import {class_list} from '@/api/getDataEarth'
    import {admin_user_all_list} from '@/api/getDataEarth'
    export default {
        data(){
            return {
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                dialogFormVisible:false,
                current:{},
                classname:'',
                homeworkname:'',
                author:'',
                classinfo:{
                    value:''
                },
                homeworkinfo:{
                    value:''
                },
                name:'',
                loadingBtn:-1
            }
        },
        components: {
            headTop,
        },
        created(){
            this.list();
        },
        mounted(){

        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                // 通过 `vm` 访问组件实例
            admin_user_all_list({'is_question_author':1}).then(function (res) {
                if (res.code == vm.$store.state.constant.status_success) {
                    vm.authors = res.data;

                } else {
                    vm.$message({
                        message: res.msg,
                        type: 'warning'
                    });
                }
            });
                vm.list();
        })
        },
        methods: {

            list() {
                homework_list({page:this.currentPage,page_size:this.limit,name:this.name, author:this.author,classid:this.classinfo.classid, homework_id:this.homeworkinfo.id}).then(function(res){
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
            show_img(row){
                this.$router.push({path:'show_img',query:{path:row.homework_downloads, mp3_path:row.homework_downloads_objs}});
            },
            view_homework(row){
                this.$router.push({path:'view_homework',query:{id:row.id}});
            },
            goto_edit_homework(id) {
                this.$router.push({path:'add_homework',query:{id:id}});
            },
            verify(scope, status) {

                this.$confirm('确认此操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    var item = scope.row;
                    this.loadingBtn = scope.$index;
                    homework_verify({id:item.id,status:status}).then(function(res){
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
                    homework_del({id:item.id}).then(function(res){
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
                homework_sort({
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

            querySearchAsync(queryString, cb) {
              //  this.classinfo = {};

                var results = [];
                class_list({name:this.classname}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        results = res.data;
                        results.forEach(function(val){
                            val.value = val.classname
                        });
                        cb(results);
                    } else {
                        cb([]);
                    }
                }.bind(this));


            },
            handleSelect(item) {
                this.classinfo = item;
                //console.log(this.classinfo);
            },

            querySearchAsyncHomework(queryString, cb) {
               // this.homeworkinfo = {};
                var results = [];
                homework_list({name:this.homeworkname, classid:this.classinfo.classid,page:1,page_size:20}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        results = res.data.list
                        results.forEach(function(val){
                            val.value = val.name
                        });
                        cb(results);
                    } else {
                        cb([]);
                    }
                }.bind(this));


            },
            handleSelectHomework(item) {
                this.homeworkinfo = item;
            },

            focusInput(name,info){
                this[name] = '';
                this[info] = {};
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
