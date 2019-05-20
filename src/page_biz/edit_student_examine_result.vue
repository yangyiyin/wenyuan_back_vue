<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="background: #fff5d4" v-if="info">
            <p style="margin: 0 auto;font-size: 20px;text-align: center;font-weight: bolder">{{info.examine_paper_info.title}}</p>

            <p>
                <template v-for="(paper, key, index) in info.papers">
                    <a href="javascript:;" v-if="key < 0" @click="current_img=paper;showimg=true" style="margin-left:10px">答题卡{{-key}}</a>

                </template>

            </p>
            <div style="width: 750px;min-height: 20px;" v-for="(item, index) in info.questions_with_types">
                <p style="margin-top: 20px">{{item.name}}</p>
                <div v-for="(question, index2) in item.list" style="margin-top: 10px;border-bottom: 1px solid #999">
                    <p style="max-height: 150px;overflow-y: auto" v-html="(index2+1) +'.  ' +question.question_content"></p>

                    <p v-if="question.answer" style="background: #fff;">学生答案:{{question.answer}}</p>
                    <p v-if="question.extra_link" style="background: #fff;">学生答案:<img style="vertical-align: middle" :src="question.extra_link"/></p>


                    <p style="float: right">
                        得分:<el-input style="width: 140px;" :max="question.score" type="number" v-model="question.result"  auto-complete="off"></el-input><span>共{{question.score}}分</span>
                        <el-button v-if="question.type == 1 || question.type==2" size="mini" @click="dialogFormVisibleedit_answer=true;current = question">修正答案</el-button>
                    </p>
                    <div style="clear: both"></div>
                    <div v-if="!question.is_show_answer" style="color: rgb(20,200,20);cursor: pointer;padding: 10px;" @click="question.is_show_answer=1" >显示答案</div>
                    <div v-if="question.is_show_answer" style="color: rgb(20,200,20);cursor: pointer;padding: 10px;" @click="question.is_show_answer=0" >隐藏答案</div>
                    <div v-if="!question.is_show_answer">
                        <p v-if="question.type == 3" >
                            <span>答案:</span>
                            <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in question.question_answer.answer">({{index3+1}}){{answer_item.text}}</span>
                        </p>
                        <p v-else-if="question.type == 6" >
                            <span>答案:</span>
                            <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in question.question_answer.answer">({{index3+1}}){{answer_item}}</span>
                        </p>
                        <p v-else v-html="'标准答案:'+question.question_answer.answer"></p>
                        <p v-html="'答案解析:'+question.question_answer.answer_parse"></p>
                    </div>
                </div>
            </div>
            <div style="text-align: right;width: 750px;margin-top: 20px;">
                <el-button @click="back();">返 回</el-button>
                <el-button type="primary" @click="submit_result()" :loading="loadingBtn">提 交</el-button>
            </div>

        </div>
        <el-dialog title="答题卡" :visible.sync="showimg" width="80%">

            <img style="width: 100%" :src="'https://api.yixsu.com/static/' + current_img.replace('/data/', '')"/>

        </el-dialog>
        <el-dialog title="修正答案和得分" :visible.sync="dialogFormVisibleedit_answer" width="50%">

            <p>
                <el-input
                        style="display: inline-block;width: 250px;"
                        placeholder="答案"
                        v-model="current.answer"
                        clearable>
                </el-input>
            </p>

            <!--<p>-->
                <!--<el-input-->
                        <!--style="display: inline-block;width: 250px;"-->
                        <!--placeholder="答案图片地址"-->
                        <!--v-model="current.extra_link"-->
                        <!--clearable>-->
                <!--</el-input>-->
            <!--</p>-->

            <p>
                <el-input
                        style="display: inline-block;width: 250px;"
                        placeholder="得分"
                        v-model="current.result"
                        clearable>
                </el-input>
            </p>
            <div slot="footer" class="dialog-footer" >
                <el-button @click="set_student_question_answer_result">确 认</el-button>
                <el-button @click="dialogFormVisibleedit_answer = false">关 闭</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {student_examine_result_info, reckon_result, submit_result, set_student_question_answer_result} from '@/api/getDatastudent_examine_result'
    export default {
        data(){
            return {
                info: null,
                dialogFormVisible:false,
                dialogFormVisibleedit_answer:false,
                current:{},
                title:'',
                loadingBtn:false,
                current_img:'',
                showimg:false
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
                // 通过 `vm` 访问组件实例
                vm.id = to.query.id ? to.query.id : 0;
                vm.get_info();
        })
        },
        methods: {
            get_info() {
                student_examine_result_info({id:this.id}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.info = res.data;
                    }
                }.bind(this));

            },

            submit_result() {

                this.loadingBtn = true;

                var result = {};
                for(var i in this.info.questions_with_types){
                    var val = this.info.questions_with_types[i];
                    val.list.forEach((question) => {
                        result[question.id] = {
                            qid:question.id,
                            result:question.result,
                            answer:question.answer,
                            extra_link:question.extra_link,
                        }
                    })
                }

//                console.log(result);
                submit_result({student_examine_result_status:2,result:result,from_type:2, main_id:this.info.examine_id,sub_id:this.info.examine_paper_id,ticket_id:this.info.ticket_id}).then(function(res){
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
                reckon_result({examine_id:this.info.examine_id,examine_paper_id:this.info.examine_paper_id,ticket_id:this.info.ticket_id}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
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
                    this.loadingBtn = false;
                    this.back();
                }.bind(this)).finally(function(){

                }.bind(this));
            },
            back() {
                history.go(-1);
            },
            set_student_question_answer_result(){
                set_student_question_answer_result({examine_id:this.info.examine_id,examine_paper_id:this.info.examine_paper_id,ticket_id:this.info.ticket_id,
                    qid:this.current.id,answer:this.current.answer,extra_link:this.current.extra_link,result:this.current.result}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
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
                    this.dialogFormVisibleedit_answer = false;
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
