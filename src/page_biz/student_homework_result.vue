<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <el-select clearable v-model="schoolid" value-key="id" placeholder="校区">
                <el-option
                        v-for="item in schools"
                        :key="item.schoolid"
                        :label="item.schoolname"
                        :value="item.schoolid">
                </el-option>
            </el-select>

            <el-select clearable v-model="courseid" value-key="id" placeholder="课程">
                <el-option
                        v-for="item in courses"
                        :key="item.courseid"
                        :label="item.coursename"
                        :value="item.courseid">
                </el-option>
            </el-select>

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

            <el-autocomplete
                    v-model="studentname"
                    :fetch-suggestions="querySearchAsyncStudent"
                    placeholder="请输入学生姓名"
                    @select="handleSelectStudent"
                    @focus="focusInput('studentname', 'studentinfo')"
                    clearable
                    style="width: 250px;"
            ></el-autocomplete>

            <el-select v-model="search_param.status" placeholder="请选择状态" clearable>
                <el-option
                        v-for="item in [{label:'未提交',value:1},{label:'已提交',value:2},{label:'已批改',value:3},{label:'已出成绩',value:4},{label:'已评价',value:5}]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button style="margin: 5px;" type="primary" @click="dialogFormVisibleDaoru=true">批量导入评价</el-button>
        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="重置成绩" style="width: 50%">
                                <el-button
                                        size="mini" type="primary"
                                        @click="img_class='class1';current=props.row;current.is_redo=true;showSetResultVisible=true;current_result={};result_other.total_score=props.row.homework.total_score_extra;result_other.score=props.row.homework.score_extra">
                                    重置成绩
                                </el-button>
                            </el-form-item>

                            <el-form-item label="教师点拨" style="width: 50%">

                                {{props.row.answer_comment}}
                            </el-form-item>

                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="学生" >
                    <template slot-scope="scope">
                        {{scope.row.student.name}}
                    </template>
                </el-table-column>
                <el-table-column label="作业" prop="homework.name"></el-table-column>
                <el-table-column label="班级" prop="classinfo.classname"></el-table-column>
                <el-table-column label="成绩" prop="total_score"></el-table-column>
                <el-table-column label="星级" prop="star_2"></el-table-column>
                <el-table-column label="作业完成率" prop="homework_complete_rate"></el-table-column>
                <el-table-column label="当前状态">
                    <template slot-scope="scope">
                        <el-tag size="mini" type="success" v-if="scope.row.is_submit_offline == 0 && scope.row.is_submit == 0">未提交</el-tag>
                        <el-tag size="mini" type="success" v-if="scope.row.is_submit_offline == 1">已提交</el-tag>
                        <el-tag size="mini" type="success" v-if="scope.row.is_manual_resulted == 1">已批改</el-tag>
                        <el-tag size="mini" type="success" v-if="scope.row.total_score">已出成绩</el-tag>
                        <el-tag size="mini" type="success" v-if="scope.row.teacher_suggest">已评价</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建日期" prop="create_time"></el-table-column>
                <el-table-column label="操作" width="400">
                    <template slot-scope="scope">
                        <!--<el-button size="mini" v-if="scope.row.status == 1" @click="verify(scope, 0)" :loading="loadingBtn == scope.$index">下架</el-button>-->
                        <!--<el-button size="mini" v-if="scope.row.status == 0" @click="verify(scope, 1)" :loading="loadingBtn == scope.$index">上架</el-button>-->
                        <el-button
                                size="mini" type="primary"
                                @click="img_class='class1';current=scope.row;current.is_redo=false;showSetResultVisible=true;current_result={};result_other.total_score=scope.row.homework.total_score_extra;result_other.score=props.row.homework.score_extra"
                                v-if="scope.row.homework.need_manual_check && !scope.row.total_score && scope.row.is_submit_offline == 1 && scope.row.is_manual_resulted == 0">
                            批改作业
                        </el-button>
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

            <div style="height:100%;overflow-y: scroll;width: 50%;padding-left: 5%;float: left;">
                <div v-for="(item) in current.homework_upload_objs">
                    <audio :src="item" controls="controls"></audio>
                </div>

                <div v-for="(item,index) in current.homework_upload_docs">
                    <img @click="changeRotation(index)" :id="'img'+index" :class="imgs[index].img_class"  :style="'display:block;margin:0 auto;width:'+imgs[0].width" :src="item">
                </div>
            </div>

            <div class="check" style="height:85%;padding:10px 0;overflow-y: auto;width: 20%;float: right;margin-right: 5%;background: #fff;border-radius: 10px;">
                 <el-tag>单选题</el-tag>
                <p v-for="(question, index) in current.homework_question2" >
                    <template v-if="question.useto == 2 && current.question_map[question.qid] && current.question_map[question.qid].type == 1">
                        <p>【题目id:{{question.qid}}】:<el-input style="width: 40%;margin: 5px;" type="number" placeholder="输入得分" v-model="question.result"></el-input><span>{{current.question_map[question.qid] ? current.question_map[question.qid].score : 0}}分</span></p>
                        <p style="border-radius:5px;background: #eee;font-size: 12px;width: 90%;margin: 0 auto">答案:{{current.question_answer_map[question.qid] ? current.question_answer_map[question.qid].answer : ''}}</p>
                        <el-button size="mini" v-if="current.question_answer_map[question.qid]" @click="parse = current.question_answer_map[question.qid].answer_parse;showParse = true;">显示答案解析</el-button>
                <!--<p style="border-radius:5px;background: #eee;font-size: 12px;width: 90%;margin: 0 auto" v-html="'答案解析:'+(current.question_answer_map[question.qid] ? current.question_answer_map[question.qid].answer_parse : '')"><p/>-->

</template>


                </p>
<div style="height: 30px;border-bottom: 1px solid #999"></div>

                <el-tag>判断题</el-tag>
                <p v-for="(question, index) in current.homework_question2" >
                    <template v-if="question.useto == 2 && current.question_map[question.qid] && current.question_map[question.qid].type == 2">
<p>【题目id:{{question.qid}}】:<el-input style="width: 40%;margin: 5px;" type="number" placeholder="输入得分" v-model="question.result"></el-input><span>{{current.question_map[question.qid] ? current.question_map[question.qid].score : 0}}分</span></p>
<p style="border-radius:5px;background: #eee;font-size: 12px;width: 90%;margin: 0 auto">答案:{{current.question_answer_map[question.qid] ? current.question_answer_map[question.qid].answer : ''}}</p>
<el-button size="mini" v-if="current.question_answer_map[question.qid]" @click="parse = current.question_answer_map[question.qid].answer_parse;showParse = true;">显示答案解析</el-button>

                    </template>
                </p>
<div style="height: 30px;border-bottom: 1px solid #999"></div>
                <el-tag>填空题</el-tag>
                <p v-for="(question, index) in current.homework_question2" >
                    <template v-if="question.useto == 2 && current.question_map[question.qid] && current.question_map[question.qid].type == 3">
<p>【题目id:{{question.qid}}】:<el-input style="width: 40%;margin: 5px;" type="number" placeholder="输入得分" v-model="question.result"></el-input><span>{{current.question_map[question.qid] ? current.question_map[question.qid].score : 0}}分</span></p>
<p style="border-radius:5px;background: #eee;font-size: 12px;width: 90%;margin: 0 auto">答案:{{current.question_answer_map[question.qid] ? JSON.parse(current.question_answer_map[question.qid].answer) : ''}}</p>
<el-button size="mini" v-if="current.question_answer_map[question.qid]" @click="parse = current.question_answer_map[question.qid].answer_parse;showParse = true;">显示答案解析</el-button>

                    </template>
                </p>
<div style="height: 30px;border-bottom: 1px solid #999"></div>
                <el-tag>简答题</el-tag>
                <p v-for="(question, index) in current.homework_question2" >
                    <template v-if="question.useto == 2 && current.question_map[question.qid] && current.question_map[question.qid].type == 4">
<p>【题目id:{{question.qid}}】:<el-input style="width: 40%;margin: 5px;" type="number" placeholder="输入得分" v-model="question.result"></el-input><span>{{current.question_map[question.qid] ? current.question_map[question.qid].score : 0}}分</span></p>
<p style="border-radius:5px;background: #eee;font-size: 12px;width: 90%;margin: 0 auto" v-html="current.question_answer_map[question.qid] ? '答案:'+current.question_answer_map[question.qid].answer : '答案:'"></p>
<el-button size="mini" v-if="current.question_answer_map[question.qid]" @click="parse = current.question_answer_map[question.qid].answer_parse;showParse = true;">显示答案解析</el-button>

                    </template>
                </p>

<div style="height: 30px;border-bottom: 1px solid #999"></div>
<el-tag>阅读题</el-tag>
<p v-for="(question, index) in current.homework_question2" >
    <template v-if="question.useto == 2 && current.question_map[question.qid] && current.question_map[question.qid].type == 6">
<p>【题目id:{{question.qid}}】:<el-input style="width: 40%;margin: 5px;" type="number" placeholder="输入得分" v-model="question.result"></el-input><span>{{current.question_map[question.qid] ? current.question_map[question.qid].score : 0}}分</span></p>
<p style="border-radius:5px;background: #eee;font-size: 12px;width: 90%;margin: 0 auto">答案:{{current.question_answer_map[question.qid] ? JSON.parse(current.question_answer_map[question.qid].answer) : ''}}</p>
<el-button size="mini" v-if="current.question_answer_map[question.qid]" @click="parse = current.question_answer_map[question.qid].answer_parse;showParse = true;">显示答案解析</el-button>

</template>
</p>

<div style="height: 30px;border-bottom: 1px solid #999"></div>
<el-tag>计算题</el-tag>
<p v-for="(question, index) in current.homework_question2" >
    <template v-if="question.useto == 2 && current.question_map[question.qid] && current.question_map[question.qid].type == 7">
<p>【题目id:{{question.qid}}】:<el-input style="width: 40%;margin: 5px;" type="number" placeholder="输入得分" v-model="question.result"></el-input><span>{{current.question_map[question.qid] ? current.question_map[question.qid].score : 0}}分</span></p>
<p style="border-radius:5px;background: #eee;font-size: 12px;width: 90%;margin: 0 auto" v-html="current.question_answer_map[question.qid] ? '答案:'+current.question_answer_map[question.qid].answer : '答案:'"></p>
<el-button size="mini" v-if="current.question_answer_map[question.qid]" @click="parse = current.question_answer_map[question.qid].answer_parse;showParse = true;">显示答案解析</el-button>

</template>
</p>

<div style="height: 30px;border-bottom: 1px solid #999"></div>
<el-tag>作文题</el-tag>
<p v-for="(question, index) in current.homework_question2" >
    <template v-if="question.useto == 2 && current.question_map[question.qid] && current.question_map[question.qid].type == 8">
<p>【题目id:{{question.qid}}】:<el-input style="width: 40%;margin: 5px;" type="number" placeholder="输入得分" v-model="question.result"></el-input><span>{{current.question_map[question.qid] ? current.question_map[question.qid].score : 0}}分</span></p>
<p style="border-radius:5px;background: #eee;font-size: 12px;width: 90%;margin: 0 auto" v-html="current.question_answer_map[question.qid] ? '答案:'+current.question_answer_map[question.qid].answer : '答案:'"></p>
<el-button size="mini" v-if="current.question_answer_map[question.qid]" @click="parse = current.question_answer_map[question.qid].answer_parse;showParse = true;">显示答案解析</el-button>

</template>
</p>

<div style="height: 30px;border-bottom: 1px solid #999"></div>
                <el-tag>其他题</el-tag>
                <p v-for="(question, index) in current.homework_question2" >
                    <template v-if="question.useto == 2 && current.question_map[question.qid] && current.question_map[question.qid].type == 5">
                <p>【题目id:{{question.qid}}】:<el-input style="width: 40%;margin: 5px;" type="number" placeholder="输入得分" v-model="question.result"></el-input><span>{{current.question_map[question.qid] ? current.question_map[question.qid].score : 0}}分</span></p>
                <p style="border-radius:5px;background: #eee;font-size: 12px;width: 90%;margin: 0 auto" v-html="current.question_answer_map[question.qid] ? '答案:'+current.question_answer_map[question.qid].answer : '答案:'"></p>
<el-button size="mini" v-if="current.question_answer_map[question.qid]" @click="parse = current.question_answer_map[question.qid].answer_parse;showParse = true;">显示答案解析</el-button>

                </template>
                </p>
                <div style="height: 30px;border-bottom: 1px solid #999"></div>

<template v-if="result_other.total_score > 0">
    <el-tag>非题库题</el-tag>
    <p>【题目id:0】:<el-input style="width: 40%;margin: 5px;" type="number" placeholder="输入得分" v-model="result_other.score"></el-input><span>{{result_other.total_score}}分</span></p>


</template>
<div style="height: 30px;border-bottom: 1px solid #999"></div>
<el-tag>教师点拨</el-tag>
<p><el-input style="width: 90%;margin: 5px;" type="textarea" placeholder="输入内容" v-model="current.answer_comment"></el-input></p>


</div>
            <el-button type="success" style="position: fixed;bottom: 20px;right: 18%;" :loading="loadingsubmit" @click="submit_result">确 认</el-button>
            <el-button type="danger" style="position: fixed;bottom: 20px;right: 6%;" @click="showSetResultVisible = false">关 闭</el-button>

        </div>
<el-dialog title="答案解析" :visible.sync="showParse" width="80%">
    <p style="border-radius:5px;background: #eee;font-size: 12px;width: 90%;margin: 0 auto" v-html="'答案解析:'+parse"><p/>

</el-dialog>

<el-dialog title="导入" :visible.sync="dialogFormVisibleDaoru" width="30%">
    <p>
        批量导入试题数据
    </p>
    <p>
        特别说明:导入前请务必点击链接导出现有数据excel,根据现有数据excel进行评价输入,然后导入excel。
        <a style="text-decoration: underline;color: green" href="javascript:;" @click="daochu()">点击导出现有数据</a>
    </p>
    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleDaoru = false">取 消</el-button>
        <!--<el-button type="primary" @click="daoru">开始导入</el-button>-->
        <el-upload

                class=""
                :action="upload_url+'?id='+current.id"
                :data="upload_data"
                :show-file-list="false"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                style="display: inline-block;">
            <!--<img v-if="img" :src="img" class="avatar">-->
            <el-button type="primary" :loading="loadingBtn == 'daoru'">开始导入</el-button>
        </el-upload>
    </div>
</el-dialog>


    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {student_homework_result_list,student_homework_result_del,student_homework_result_verify,teacher_suggest, reckon_result, submit_result,getResultHomeWorkStudentlist,homework_result_excel_out,homework_result_excel_in} from '@/api/getDatastudent_homework_result'
    import {class_list,school_list,course_list} from '@/api/getDataEarth'
    import {homework_list} from '@/api/getDataHomework'
    import {getStore} from '@/config/mUtils'
    export default {
        data(){
            return {
                tableData: [],
                limit: 10,
                count: 0,
                loadingsubmit:false,
                schools:'',
                parse:'',
                imgs:[
                    {rotation:0,img_class:'',width:'100%'},
                    {rotation:0,img_class:'',width:'100%'},
                    {rotation:0,img_class:'',width:'100%'},
                    {rotation:0,img_class:'',width:'100%'},
                    {rotation:0,img_class:'',width:'100%'},
                    {rotation:0,img_class:'',width:'100%'},
                ],
                schoolid:'',
                courses:'',
                courseid:'',
                currentPage: 1,
                dialogFormVisible:false,
                showResultVisible:false,
                showParse:false,
                showSuggestVisible:false,
                showSetResultVisible:false,
                dialogFormVisibleDaoru:false,
                current:{},
                result_other:{
                    score:0,
                    total_score:0
                },
                answer_comment:'',
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
                current_result:{},
//                imgs:[],
                img_class:'class1',
                search_param:{
                    status:''
                },
                upload_url:this.$store.state.constant.homework_result_excel_in,
                upload_data:{token:getStore('token') ? getStore('token') : ''}
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
                vm.init_options();
                vm.list();
        })
        },
        methods: {
            async init_options(){
                await school_list().then( (res) =>{
                    if (res.code == this.$store.state.constant.status_success) {
                        this.schools = res.data;
                    }
                });
                await course_list().then( (res) =>{
                    if (res.code == this.$store.state.constant.status_success) {
                        this.courses = res.data;
                    }
                });
            },
            list() {
                student_homework_result_list({search_param:this.search_param,page:this.currentPage,page_size:this.limit,
                    schoolid:this.schoolid,courseid:this.courseid,classid:this.classinfo.classid, homework_id:this.homeworkinfo.id,student_id:this.studentinfo.id}).then(function(res){
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
            async submit_result() {
                this.loadingsubmit = true;
                submit_result({manual_check:1,is_redo:this.current.is_redo,answer_comment:this.current.answer_comment,result:this.current.homework_question2, result_other:this.result_other,from_type:1, main_id:this.current.homework_id,sub_id:this.current.classid,student_id:this.current.student_id}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.reckon_result();
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.msg
                        });
                    }
                    this.loadingsubmit = false;
                }.bind(this)).finally(function(){

                }.bind(this));
            },

             async reckon_result() {
                await reckon_result({manual_check:1,is_redo:this.current.is_redo,homework_id:this.current.homework_id,classid:this.current.classid,student_id:this.current.student_id}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                       // this.showSetResultVisible = false;
//                        this.list();
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
            this.loadingsubmit = false;
                    this.list();
                    this.showSetResultVisible = false;
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
                //this.classinfo = {};
                var results = [];
                class_list({name:this.classname,schoolid:this.schoolid,courseid:this.courseid}).then(function (res) {
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
                //this.homeworkinfo = {};
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

            querySearchAsyncStudent(queryString, cb) {
                //this.studentinfo = {};
                var results = [];
                //console.log(this.classinfo);
                getResultHomeWorkStudentlist({student_name:this.studentname, classid:this.classinfo.classid,homework_id:this.homeworkinfo.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        results = res.data;
                        results.forEach(function(val){
                            val.value = val.name+'('+val.studentid+')';
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
            focusInput(name,info){
                this[name] = '';
                this[info] = {};
            },
            changeRotation(index){
                if (!this.imgs[index]) {
                   return;
                }
                var width = document.body.offsetWidth  / 2;
                var height = document.getElementById("img"+index).offsetHeight;

                if (!this.imgs[index].rate && width < height) {
                    this.imgs[index].rate = width / height;
                }
                this.imgs[index].rotation = this.imgs[index].rotation ?(this.imgs[index].rotation + 90):90;

                if (!(this.imgs[index].rotation % 360)) {
                    this.imgs[index].img_class = 'class1';
                    this.imgs[index].width = width + 'px';
                }
                else if (!(this.imgs[index].rotation % 270)) {
                    this.imgs[index].img_class = 'class2';
                    this.imgs[index].width = width * this.imgs[index].rate+ 'px';;
                }
                else if (!(this.imgs[index].rotation % 180)) {
                    this.imgs[index].img_class = 'class3';
                    this.imgs[index].width = width+ 'px';;
                }
                else {
                    this.imgs[index].img_class = 'class4';
                    this.imgs[index].width = width * this.imgs[index].rate+ 'px';;
                }
//console.log(index,this.imgs[index]);

            },
            daochu() {
                var param1 = {
                    is_ajax:true,
                    search_param:this.search_param,classid:this.classinfo.classid, homework_id:this.homeworkinfo.id,student_id:this.studentinfo.id
                };
                var param2 = {
                    search_param:this.search_param,classid:this.classinfo.classid, homework_id:this.homeworkinfo.id,student_id:this.studentinfo.id
                };
                homework_result_excel_out(param1).then(function(res){
                    //this.loadingBtn = '-1';
                    if (res.code == this.$store.state.constant.status_success) {
                        window.open(this.$store.state.constant.homework_result_excel_out + '?param='+JSON.stringify(param2)+'&token=' + (getStore('token') ? getStore('token') : ''));
                        return;
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'warning'
                        });
                        return;
                    }
                }.bind(this));
            },

            beforeUpload(file) {
                this.loadingBtn = 'daoru';
                var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
                const extension = testmsg === 'xls'
                const extension2 = testmsg === 'xlsx'
                const isLt2M = file.size / 1024 / 1024 < 20
                if(!extension && !extension2) {
                    this.$message({
                        message: '上传文件只能是 xls、xlsx格式!',
                        type: 'warning'
                    });
                }
                if(!isLt2M) {
                    this.$message({
                        message: '上传文件大小不能超过 20MB!',
                        type: 'warning'
                    });
                }
                this.upload_loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                return extension || extension2 && isLt2M;
            },
            handleSuccess(res, file) {
                this.loadingBtn = '-1';
                if (this.upload_loading) {
                    this.upload_loading.close();
                }

                if (res.code == this.$store.state.constant.status_success) {
                    this.list();
                    this.dialogFormVisibleDaoru = false;
                    this.$message({
                        type: 'success',
                        message: res.msg
                    });
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.msg
                    });
                }

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

    .class1{
        transform:rotate(0deg);
    }
    .class2{
        transform:rotate(270deg);

    }
    .class3{
        transform:rotate(180deg);

    }
    .class4{
        transform:rotate(90deg);
    }
</style>
