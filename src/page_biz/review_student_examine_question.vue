<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">
            <el-button @click="back">返回列表</el-button>
            <el-button type="warning" @click="set_examine_paper_status">批阅完毕</el-button>
        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column label="学生序号" prop="id"></el-table-column>
                <el-table-column label="学生答案" style="width: 750px;" >
                    <template slot-scope="scope">

                        <p v-if="scope.row.question_data.answer">{{scope.row.question_data.answer}}</p>
                        <p v-if="scope.row.question_data.extra_link"><img style="width: 750px" :src="scope.row.question_data.extra_link"/></p>

                    </template>
                </el-table-column>

                <el-table-column label="输入得分">
                    <template slot-scope="scope">

                        <template v-if="scope.row.question_data.type == 6">
                            <template v-for="(_sub_result,index) in scope.row.question_data.result.sub_result">
                                <p>
                                    ({{index+1}})<el-input
                                        style="width: 100px;"
                                        type="number"
                                        placeholder="得分"
                                        v-model="scope.row.question_data.result.sub_result[index]"
                                        @change="set_question_score(scope.row)"
                                        clearable>
                                </el-input>
                                </p>
                            </template>

                        </template>
                        <template v-else>
                            <el-input
                                    style="width: 100px;"
                                    type="number"
                                    placeholder="得分"
                                    v-model="scope.row.question_data.result"
                                    @change="set_question_score(scope.row)"
                                    clearable>
                            </el-input>
                        </template>


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

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {student_examine_result_list, submit_result} from '@/api/getDatastudent_examine_result'
    import {get_examine_paper_data_url,set_examine_paper_status} from '@/api/getDataEarth'
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

        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.examine_id = to.query.examine_id ? to.query.examine_id : 0;
                vm.examine_paper_id = to.query.examine_paper_id ? to.query.examine_paper_id : 0;
                vm.question_id = to.query.question_id ? to.query.question_id : 0;
                vm.list();

        })
        },
        methods: {
            list() {
                if (!this.examine_id || !this.examine_paper_id || !this.question_id) {
                    this.$message({
                        type: 'error',
                        message: '页面错误,请重进当前页面'
                    });
                }
                student_examine_result_list({page:this.currentPage,page_size:this.limit,examine_id:this.examine_id,examine_paper_id:this.examine_paper_id,question_id:this.question_id}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.tableData = res.data.list;
                        this.has_zip = res.data.has_zip;
                        this.count = parseInt(res.data.count);
                    }
                }.bind(this));

            },

            handleCurrentChange(val){
                //

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
            verify(scope, status) {

                this.$confirm('确认以上给分?', '提示', {
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
            back(){
                this.$router.push({path:'examination_examine_paper',query:{id:this.examine_id}});
            },

            set_question_score(row){
                var result = {};
                result[this.question_id] = {
                    qid:this.question_id,
                    result:row.question_data.result,
                    answer:row.question_data.answer,
                    extra_link:row.question_data.extra_link,
                }

                submit_result({student_examine_result_status:2,result:result,from_type:2, main_id:this.examine_id,sub_id:this.examine_paper_id,ticket_id:row.ticket_id}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.$message({
                            type: 'success',
                            message: '序号'+row.id+'提交成功'
                        });

                    } else {
                        this.$message({
                            type: 'warning',
                            message: '序号'+row.id+'提交失败:'+res.msg
                        });
                    }
                }.bind(this)).finally(function(){

                }.bind(this));

            },
            set_examine_paper_status(){
                set_examine_paper_status({examine_id:this.examine_id,examine_paper_id:this.examine_paper_id,key:this.question_id,value:1}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.$message({
                            type: 'success',
                            message: '保存成功'
                        });

                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.msg
                        });
                    }
                }.bind(this)).finally(function(){

                }.bind(this));

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
