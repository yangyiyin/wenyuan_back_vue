<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">
            <div class="search_item">
                <div style="float:right;text-align: right">
                    <p style="font-weight: bolder;font-size:20px;">
                        {{data.title}}
                    </p>
                    <p style="font-weight: bolder;font-size:14px;">试卷总分:{{scores.total}}</p>
                </div>

                <div style="clear: both"></div>
            </div>

                    <div class="search_item">
                        <span style="font-size: 16px;">选择题库题目:</span>

                        <el-button size="small" type="primary" @click="dialogFormVisibleQuestions = true;">直接选择题目</el-button>
                        <el-button size="small" type="primary" @click="dialogFormVisibleQuestionsRand = true;">随机选择题目</el-button>
                        <!--<p style="display: inline-block">-->
                            <!--&lt;!&ndash;<span v-for="(item,index) in data.questions">{{item.title.substring(0,10)}}...</span>&ndash;&gt;-->
                            <!--<template v-for="(item,index) in data.questions">-->
                                <!--<el-popover-->
                                            <!--placement="top"-->
                                            <!--width="160"-->
                                            <!--v-model="item.visible"-->
                                            <!--style="margin-left: 5px;">-->
                                    <!--<p>{{item.title}}</p>-->
                                    <!--<div style="text-align: center; margin: 0">-->

                                        <!--<el-button type="danger" size="mini" @click="data.questions.splice(index, 1)">删除</el-button>-->
                                    <!--</div>-->
                                    <!--<el-button slot="reference">{{item.title.substring(0,10)}}...</el-button>-->
                                <!--</el-popover>-->
                            <!--</template>-->
                        <!--</p>-->
                    </div>


                    <div class="search_item">
                        <div class="question_block">
                            <el-tag>一、选择题[共{{scores.type1}}分]</el-tag>
                            <template v-for="(item,index) in data.questions">

                                <div class="question_item" v-if="item.type==1">
                                   <span style="font-weight: bolder;color:#000">{{index+1}}.</span>{{item.title}}

                                    <div>
                                        <el-button style="float: right" type="danger" size="mini" @click="data.questions.splice(index, 1);set_scores()">删除</el-button>
                                        <p style="margin-right:10px;float: right">
                                            排序:<el-input size="mini" type="number" @change="set_question_sort()" clearable placeholder="排序值" v-model="item.sort_value" style="width: 80px;"></el-input>
                                        </p>
                                        <p style="margin-right:10px;float: right">
                                            分值:<el-input size="mini" clearable placeholder="分值" @change="set_scores()" v-model="item.score" style="width: 80px;"></el-input>
                                        </p>
                                        <div style="clear: both"></div>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <div class="question_block">
                            <el-tag>二、判断题[共{{scores.type2}}分]</el-tag>
                            <template v-for="(item,index) in data.questions">

                                <div class="question_item" v-if="item.type==2">
                                    <span style="font-weight: bolder;color:#000">{{index+1}}.</span>{{item.title}}
                                    <div>
                                        <el-button style="float: right" type="danger" size="mini" @click="data.questions.splice(index, 1);set_scores()">删除</el-button>
                                        <p style="margin-right:10px;float: right">
                                            排序:<el-input size="mini" type="number" @change="set_question_sort()" clearable placeholder="排序值" v-model="item.sort_value" style="width: 80px;"></el-input>
                                        </p>
                                        <p style="margin-right:10px;float: right">
                                            分值:<el-input size="mini" clearable placeholder="分值" @change="set_scores()" v-model="item.score" style="width: 80px;"></el-input>
                                        </p>

                                        <div style="clear: both"></div>
                                    </div>

                                </div>
                            </template>
                        </div>
                        <div class="question_block">
                            <el-tag>三、填空题[共{{scores.type3}}分]</el-tag>
                            <template v-for="(item,index) in data.questions">

                                <div class="question_item" v-if="item.type==3">
                                    <span style="font-weight: bolder;color:#000">{{index+1}}.</span>{{item.title}}
                                    <div>
                                        <div style="clear: both"></div>
                                        <el-button style="float: right" type="danger" size="mini" @click="data.questions.splice(index, 1);set_scores()">删除</el-button>
                                        <p style="margin-right:10px;float: right">
                                            排序:<el-input size="mini" type="number" @change="set_question_sort()" clearable placeholder="排序值" v-model="item.sort_value" style="width: 80px;"></el-input>
                                        </p>
                                        <p style="margin-right:10px;float: right">
                                            分值:<el-input size="mini" clearable placeholder="分值" @change="set_scores()" v-model="item.score" style="width: 80px;"></el-input>
                                        </p>
                                    </div>

                                </div>
                            </template>
                        </div>
                        <div class="question_block">
                            <el-tag>四、简答题[共{{scores.type4}}分]</el-tag>
                            <template v-for="(item,index) in data.questions">

                                <div class="question_item" v-if="item.type==4">
                                    <span style="font-weight: bolder;color:#000">{{index+1}}.</span>{{item.title}}
                                    <div>
                                        <div style="clear: both"></div>
                                        <el-button style="float: right" type="danger" size="mini" @click="data.questions.splice(index, 1);set_scores()">删除</el-button>
                                        <p style="margin-right:10px;float: right">
                                            排序:<el-input size="mini" type="number" @change="set_question_sort()" clearable placeholder="排序值" v-model="item.sort_value" style="width: 80px;"></el-input>
                                        </p>
                                        <p style="margin-right:10px;float: right">
                                            分值:<el-input size="mini" clearable placeholder="分值" @change="set_scores()" v-model="item.score" style="width: 80px;"></el-input>
                                        </p>
                                    </div>

                                </div>
                            </template>
                        </div>
                        <div class="question_block">
                            <el-tag>五、其他题[共{{scores.type5}}分]</el-tag>
                            <template v-for="(item,index) in data.questions">

                                <div class="question_item" v-if="item.type==5">
                                    <span style="font-weight: bolder;color:#000">{{index+1}}.</span>{{item.title}}
                                    <div>
                                        <div style="clear: both"></div>
                                        <el-button style="float: right" type="danger" size="mini" @click="data.questions.splice(index, 1);set_scores()">删除</el-button>
                                        <p style="margin-right:10px;float: right">
                                            排序:<el-input size="mini" type="number" @change="set_question_sort()" clearable placeholder="排序值" v-model="item.sort_value" style="width: 80px;"></el-input>
                                        </p>
                                        <p style="margin-right:10px;float: right">
                                            分值:<el-input size="mini" clearable placeholder="分值" @change="set_scores()" v-model="item.score" style="width: 80px;"></el-input>
                                        </p>
                                    </div>

                                </div>
                            </template>
                        </div>
                    </div>

            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">提交</el-button>


        </div>

        <el-dialog title="题库" :visible.sync="dialogFormVisibleQuestions" width="80%">

            <p>
                <questions v-if="dialogFormVisibleQuestions" :checked="data.questions" v-on:SelectionChange="SelectionChange"></questions>
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleQuestions = false">关 闭</el-button>
            </div>
        </el-dialog>

        <el-dialog title="题库" :visible.sync="dialogFormVisibleQuestionsRand" width="80%">

            <p>
                请选择条件:
                <el-select v-model="grade_ids" placeholder="年级" multiple clearable >
                    <el-option
                            v-for="item in grades"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>

                <el-select v-model="entity" placeholder="科目" clearable >
                    <el-option
                            v-for="item in [{label:'语文',value:1},{label:'数学',value:2},{label:'英语',value:3}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>


                <el-select v-model="useway_ids" placeholder="绝密等级" multiple clearable>
                    <el-option
                            v-for="item in [{label:'等级一',value:1},{label:'等级二',value:2},{label:'等级三',value:3},{label:'等级四',value:4}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                难度:
                <el-input
                        style="display: inline-block;width: 100px;"
                        type="number"
                        placeholder="难度"
                        v-model="hard_level_min"
                        clearable>
                </el-input>
                至
                <el-input
                        style="display: inline-block;width: 100px;"
                        type="number"
                        placeholder="难度"
                        v-model="hard_level_max"
                        clearable>
                </el-input>
            </p>

            <p>
                选择题数量:
                <el-input
                        style="display: inline-block;width: 120px;"
                        placeholder=""
                        v-model="question_nums[0]"
                        type="number"
                        clearable>
                </el-input>
            </p>

            <p>
                判断题数量:
                <el-input
                        style="display: inline-block;width: 120px;"
                        placeholder=""
                        v-model="question_nums[1]"
                        type="number"
                        clearable>
                </el-input>
            </p>

            <p>
                填空题数量:
                <el-input
                        style="display: inline-block;width: 120px;"
                        placeholder=""
                        v-model="question_nums[2]"
                        type="number"
                        clearable>
                </el-input>
            </p>
            <p>
                简答题数量:
                <el-input
                        style="display: inline-block;width: 120px;"
                        placeholder=""
                        v-model="question_nums[3]"
                        type="number"
                        clearable>
                </el-input>
            </p>
            <p>
                其他题数量:
                <el-input
                        style="display: inline-block;width: 120px;"
                        placeholder=""
                        v-model="question_nums[4]"
                        type="number"
                        clearable>
                </el-input>
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="rand_questions()">随 机</el-button>
                <el-button @click="dialogFormVisibleQuestionsRand = false">关 闭</el-button>
            </div>
        </el-dialog>

</div>

</template>

<script>
    import headTop from '../components/headTop'
    import questions from '../components/questions'
    import {deepCopy, sortByKey} from '../config/mUtils'
    import {get_grades, rand_questions} from '@/api/getDataEarth'
    import {examine_paper_info,examine_paper_set_questions} from '@/api/getDataexamine_paper'

    export default {
        data(){
            return {
                id:0,
                loading:false,
                name:'',
                data:{
                    questions:[]

                },
                authors:[],
                fullscreenLoading:false,
                fileList:[],
                fileList_audio:[],
                upload_url:this.$store.state.constant.upload_url_local,
                dialogFormVisibleQuestions:false,
                dialogFormVisibleQuestionsRand:false,
                deepCopy:deepCopy,
                grade:{},
                grades:[],
                hard_level_min:'0',
                hard_level_max:'9',
                useway_ids:[],
                grade_ids:[],
                entity:'',
                question_nums:[0,0,0,0,0],
                scores:{
                    total:0,
                    type1:0,
                    type2:0,
                    type3:0,
                    type4:0,
                    type5:0,
                }
            }

        },
        components: {
            headTop,
            questions
        },
        created(){

        },
        mounted(){
        },

        beforeRouteEnter (to, from, next) {
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.id = to.query.id ? to.query.id : 0;
//                console.log(vm.id )
            vm.init_grades().then(()=>{
                if (vm.id && vm.id > 0) {
                    vm.get_info();
                } else {
                    vm.init();
                }
            })


        })
        },
        methods: {

            init() {
                this.loading = false;
                this.name = '';
                this.data = {
                    questions:[]
                }
                this.scores = {
                    total:0,
                    type1:0,
                    type2:0,
                    type3:0,
                    type4:0,
                    type5:0,
                }
            },
            init_grades(){
                return new Promise(function(resolve,reject){
                    this.loading_info = true;
                    get_grades({}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.grades = res.data;

                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }
                        this.loading_info = false;
                        resolve();
                    }.bind(this));
                }.bind(this))
            },
            get_info() {
                examine_paper_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.data.questions = res.data.questions;
                        this.data.title = res.data.title;
                        this.set_question_sort(res.data.questions);
                        this.set_scores();
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },
            submit(){
                var error_msg = '';

               // if (!this.data.name) error_msg = '请填写作业标题';

                if (error_msg) {
                    this.$message({
                        type: 'warning',
                        message: error_msg
                    });
                    return;
                }

                this.$confirm('确认无误, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    this.loading = true;
                    examine_paper_set_questions({id:this.id,questions:this.data.questions}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            this.$router.push({path:'examine_paper',query:{}});
                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }

                    }.bind(this));

                }.bind(this)).catch(() => {

                }).finally(function(){
                    this.loading = false;
                }.bind(this));
            },

            SelectionChange(multipleSelectionAll){
                //var questions = multipleSelectionAll;

                //设置排序值
                this.set_question_sort(multipleSelectionAll);
                this.set_scores();

            },
            set_question_sort(_multipleSelectionAll){
                var multipleSelectionAll = _multipleSelectionAll ? deepCopy(_multipleSelectionAll) : deepCopy(this.data.questions);
                //this.data.questions = [];
                var questions = {
                    type1:[],
                    type2:[],
                    type3:[],
                    type4:[],
                    type5:[],
                }
                //console.log( this.data.questions);
//                var questions_copy = deepCopy(this.data.questions);

                multipleSelectionAll.forEach((val,index)=>{

//                    questions_copy.forEach((val_old)=>{
//                        if (val_old.id == val.id) {
//                            val.sort_value = val_old.sort_value;
//                            val.score = val_old.score;
//                        }
//                    })
                    val.sort_value = val.sort_value ? val.sort_value : val.hard_level;
                    if (val.type == 1) {
                        questions.type1.push(val);
                    }
                    if (val.type == 2) {
                        questions.type2.push(val);
                    }
                    if (val.type == 3) {
                        questions.type3.push(val);
                    }
                    if (val.type == 4) {
                        questions.type4.push(val);
                    }
                    if (val.type == 5) {
                        questions.type5.push(val);
                    }
                });
                //console.log(questions);
                //整体排序
//                console.log(sortByKey);
                questions.type1 = sortByKey(questions.type1, 'sort_value');
                questions.type2 = sortByKey(questions.type2, 'sort_value');
                questions.type3 = sortByKey(questions.type3, 'sort_value');
                questions.type4 = sortByKey(questions.type4, 'sort_value');
                questions.type5 = sortByKey(questions.type5, 'sort_value');

                this.data.questions = [];
                questions.type1.forEach((val) => {
                    this.data.questions.push(val);
                });
                questions.type2.forEach((val) =>{
                    this.data.questions.push(val);
                });
                questions.type3.forEach((val) =>{
                    this.data.questions.push(val);
                });
                questions.type4.forEach((val) =>{
                    this.data.questions.push(val);
                });
                questions.type5.forEach((val) =>{
                    this.data.questions.push(val);
                });

            },
            rand_questions(){
                this.data.questions = [];
                this.question_nums.forEach((val, index)=>{
                    if (val > 0) {
                        rand_questions({num:val,type:(index+1),entity:this.entity,grade_ids:this.grade_ids,hard_level:[this.hard_level_min,this.hard_level_max],useway_ids:this.useway_ids}).then(function (res) {
                            if (res.code == this.$store.state.constant.status_success) {
                                this.data.questions = this.data.questions.concat(res.data);
                                this.set_question_sort(this.data.questions);
                                this.set_scores();
//                                console.log(this.data.questions);
                            } else {
                                this.$message({
                                    message: res.msg,
                                    type: 'warning'
                                });
                            }

                        }.bind(this));

                    }
                });
            },
            set_scores(){
                this.scores = {
                    total:0,
                    type1:0,
                    type2:0,
                    type3:0,
                    type4:0,
                    type5:0,
                }
                this.data.questions.forEach((val,index)=>{
                    this.scores.total += Number(val.score);
                    if (val.type == 1) {

                        this.scores.type1 += Number(val.score);
                    }
                    if (val.type == 2) {

                        this.scores.type2 += Number(val.score);
                    }
                    if (val.type == 3) {

                        this.scores.type3 += Number(val.score);
                    }
                    if (val.type == 4) {

                        this.scores.type4 += Number(val.score);
                    }
                    if (val.type == 5) {
                        this.scores.type5 += Number(val.score);
                    }
                });
            }

        }
    }
</script>

<style lang="less">
    @import '../style/mixin';
    .search_item{

        margin-top: 10px;

    }
    .pre_info{
        width: 150px;
        display:inline-block ;
    }

    .question_block{

        border:1px solid #ddd;
        margin: 10px 0px;
    }

    .question_item{
        border-bottom:1px solid #eee;
        padding: 10px;
    }
</style>
