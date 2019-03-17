<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <el-autocomplete
                    v-model="classname"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入班级名称"
                    @select="handleSelect"
                    clearable
                    style="width: 250px;"
            ></el-autocomplete>

            <el-autocomplete
                    v-model="homeworkname"
                    :fetch-suggestions="querySearchAsyncHomework"
                    placeholder="请输入作业名称"
                    @select="handleSelectHomework"
                    clearable
                    style="width: 250px;"
            ></el-autocomplete>

            <el-autocomplete
                    v-model="studentname"
                    :fetch-suggestions="querySearchAsyncStudent"
                    placeholder="请输入学生姓名"
                    @select="handleSelectStudent"
                    clearable
                    style="width: 250px;"
            ></el-autocomplete>

            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>

        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column label="学生" >
                    <template slot-scope="scope">
                        {{scope.row.student.name}}
                    </template>
                </el-table-column>
                <el-table-column label="班级" prop="classinfo.classname"></el-table-column>
                <el-table-column label="成绩" prop="total_score"></el-table-column>
                <el-table-column label="星级" prop="star_2"></el-table-column>
                <el-table-column label="作业完成率" prop="homework_complete_rate"></el-table-column>
                <el-table-column label="创建日期" prop="create_time"></el-table-column>
                <el-table-column label="操作" width="400">
                    <template slot-scope="scope">
                        <!--<el-button size="mini" v-if="scope.row.status == 1" @click="verify(scope, 0)" :loading="loadingBtn == scope.$index">下架</el-button>-->
                        <!--<el-button size="mini" v-if="scope.row.status == 0" @click="verify(scope, 1)" :loading="loadingBtn == scope.$index">上架</el-button>-->
                        <el-button size="mini" type="primary" @click="current=scope.row;showSetResultVisible=true;current_result={};result_other.total_score=scope.row.homework.total_score_extra" v-if="scope.row.homework.response_type == 2 && !scope.row.total_score">批改作业</el-button>
                        <el-button size="mini" type="primary" v-if="!scope.row.teacher_suggest" @click="current=scope.row;showSuggestVisible=true">评价</el-button>
                        <el-button size="mini" v-if="scope.row.teacher_suggest" @click="current=scope.row;showSuggestVisible=true">评价</el-button>
                        <el-button size="mini" @click="current=scope.row;showResultVisible=true">查看成绩</el-button>
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
        <el-dialog title="成绩" :visible.sync="showResultVisible" width="80%">
            <el-table
                    :data="current.question_student_result"
                    style="width: 100%">
                <!--<el-table-column label="题目id" >-->
                    <!--<template slot-scope="scope">-->
                        <!--{{scope.row.student.name}}-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column label="题目id" prop="qid"></el-table-column>
                <el-table-column label="题目总分" prop="total_result"></el-table-column>
                <el-table-column label="学生作答" >
                    <template slot-scope="scope">
                        {{typeof scope.row.answer == 'object' ? JSON.stringify(scope.row.answer) : scope.row.answer}}
                    </template>
                </el-table-column>
                <el-table-column label="得分" prop="result"></el-table-column>
                <el-table-column label="创建日期" prop="create_time"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showResultVisible = false">关 闭</el-button>
            </div>
        </el-dialog>

        <el-dialog title="评语" :visible.sync="showSuggestVisible" width="80%">

            <p>
                <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="请输入内容"
                        v-model="current.teacher_suggest">
                </el-input>
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submit_suggest">确 认</el-button>
                <el-button @click="showSuggestVisible = false">取 消</el-button>
            </div>
        </el-dialog>


        <div v-if="showSetResultVisible" style="position: absolute;top:0;left: 0;width: 100%;height: 100%;z-index: 99;background: rgba(0,0,0,0.7)">

            <div style="height:100%;overflow-y: auto;width: 50%;margin-left: 5%;float: left;">
                <div v-for="(item) in current.homework_upload_objs">
                    <audio :src="item" controls="controls"></audio>
                </div>

                <div v-for="(item) in current.homework_upload_docs">
                    <img style="width:100%;" :src="item">
                </div>
            </div>

            <div style="height:85%;padding:10px 0;overflow-y: auto;width: 20%;float: right;margin-right: 5%;background: #fff;border-radius: 10px;">
                 <el-tag>单选题</el-tag>
                <p v-for="(question, index) in current.homework_question" >
                    <template v-if="current.question_map[question.qid] && current.question_map[question.qid].type == 1">
                        <p>【题目id:{{question.qid}}】:<el-input style="width: 40%;margin: 5px;" type="number" placeholder="输入得分" v-model="question.result"></el-input><span>3分</span></p>
                        <p style="border-radius:5px;background: #eee;font-size: 12px;width: 90%;margin: 0 auto">答案:{{current.question_answer_map[question.qid] ? current.question_answer_map[question.qid].answer : ''}}</p>
                    </template>


                </p>
<div style="height: 30px;border-bottom: 1px solid #999"></div>

                <el-tag>判断题</el-tag>
                <p v-for="(question, index) in current.homework_question" >
                    <template v-if="current.question_map[question.qid] && current.question_map[question.qid].type == 2">
<p>【题目id:{{question.qid}}】:<el-input style="width: 40%;margin: 5px;" type="number" placeholder="输入得分" v-model="question.result"></el-input><span>3分</span></p>
<p style="border-radius:5px;background: #eee;font-size: 12px;width: 90%;margin: 0 auto">答案:{{current.question_answer_map[question.qid] ? current.question_answer_map[question.qid].answer : ''}}</p>
                    </template>
                </p>
<div style="height: 30px;border-bottom: 1px solid #999"></div>
                <el-tag>填空题</el-tag>
                <p v-for="(question, index) in current.homework_question" >
                    <template v-if="current.question_map[question.qid] && current.question_map[question.qid].type == 3">
<p>【题目id:{{question.qid}}】:<el-input style="width: 40%;margin: 5px;" type="number" placeholder="输入得分" v-model="question.result"></el-input><span>3分</span></p>
<p style="border-radius:5px;background: #eee;font-size: 12px;width: 90%;margin: 0 auto">答案:{{current.question_answer_map[question.qid] ? JSON.parse(current.question_answer_map[question.qid].answer) : ''}}</p>
                    </template>
                </p>
<div style="height: 30px;border-bottom: 1px solid #999"></div>
                <el-tag>简答题</el-tag>
                <p v-for="(question, index) in current.homework_question" >
                    <template v-if="current.question_map[question.qid] && current.question_map[question.qid].type == 4">
<p>【题目id:{{question.qid}}】:<el-input style="width: 40%;margin: 5px;" type="number" placeholder="输入得分" v-model="question.result"></el-input><span>3分</span></p>
<p style="border-radius:5px;background: #eee;font-size: 12px;width: 90%;margin: 0 auto" v-html="current.question_answer_map[question.qid] ? '答案:'+current.question_answer_map[question.qid].answer : '答案:'"></p>
                    </template>
                </p>
<div style="height: 30px;border-bottom: 1px solid #999"></div>
<template v-if="result_other.total_score > 0">
    <el-tag>非题库题</el-tag>
    <p>【题目id:0】:<el-input style="width: 40%;margin: 5px;" type="number" placeholder="输入得分" v-model="result_other.score"></el-input><span>{{result_other.total_score}}分</span></p>


</template>

            </div>
            <el-button type="success" style="position: fixed;bottom: 20px;right: 18%;" @click="submit_result">确 认</el-button>
            <el-button type="danger" style="position: fixed;bottom: 20px;right: 6%;" @click="showSetResultVisible = false">关 闭</el-button>

        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {student_homework_result_list,student_homework_result_del,student_homework_result_verify,teacher_suggest, reckon_result, submit_result,getResultHomeWorkStudentlist} from '@/api/getDatastudent_homework_result'
    import {class_list} from '@/api/getDataEarth'
    import {homework_list} from '@/api/getDataHomework'
    export default {
        data(){
            return {
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                dialogFormVisible:false,
                showResultVisible:false,
                showSuggestVisible:false,
                showSetResultVisible:false,
                current:{},
                result_other:{
                    score:0,
                    total_score:0
                },
//                remark:'',
//                choose_categories:[],
//                categories:[],
                classname:'',
                homeworkname:'',
                studentname:'',
                classinfo:{
                    value:''
                },
                homeworkinfo:{
                    value:''
                },
                studentinfo:{
                    value:'',
                    id:''
                },
                loadingBtn:-1,
                current_result:{}
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
                vm.list();
        })
        },
        methods: {
            list() {
                student_homework_result_list({page:this.currentPage,page_size:this.limit,classid:this.classinfo.classid, homework_id:this.classinfo.homework_id,student_id:this.studentinfo.id}).then(function(res){
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
            goto_edit_student_homework_result(id) {
                this.$router.push({path:'add_student_homework_result',query:{id:id}});
            },
            submit_suggest() {


                teacher_suggest({id:this.current.id,content:this.current.teacher_suggest}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.showSuggestVisible = false;
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

                }.bind(this));



            },
            submit_result() {
                submit_result({result:this.current.homework_question, result_other:this.result_other,from_type:1, main_id:this.current.homework_id,sub_id:this.current.classid,student_id:this.current.student_id}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.reckon_result();
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.msg
                        });
                    }
                }.bind(this)).finally(function(){

                }.bind(this));
            },

            reckon_result() {
                reckon_result({homework_id:this.current.homework_id,classid:this.current.classid,student_id:this.current.student_id}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.showSetResultVisible = false;
                        this.list();
                        this.$message({
                            type: 'success',
                            message: '提交成功'
                        });
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.msg
                        });
                    }
                }.bind(this)).finally(function(){

                }.bind(this));
            },


            del(item, index) {

                this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    student_homework_result_del({id:item.id}).then(function(res){
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
            querySearchAsync(queryString, cb) {
                this.classinfo = {};
                var results = [];
                class_list({name:queryString}).then(function (res) {
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
                this.homeworkinfo = {};
                var results = [];
                homework_list({name:queryString, classid:this.classinfo.classid,page:1,page_size:20}).then(function (res) {
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

            querySearchAsyncStudent(queryString, cb) {
                this.studentinfo = {};
                var results = [];
                //console.log(this.classinfo);
                getResultHomeWorkStudentlist({student_name:queryString, classid:this.classinfo.classid,homework_id:this.homeworkinfo.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        results = res.data;
                        results.forEach(function(val){
                            val.value = val.name
                        });
                        cb(results);
                    } else {
                        cb([]);
                    }
                }.bind(this));


            },
            handleSelectStudent(item) {
                this.studentinfo = item;
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
