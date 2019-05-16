<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">

            <!--<div class="question_block">-->
                <!--<el-tag>五、其他题</el-tag>-->
                <!--<template v-for="(item,index) in data.questions">-->

                    <!--<div class="question_item" v-if="item.type==5">-->
                        <!--{{index+1}}.{{item.title}}-->
                        <!--<el-button style="float: right" type="danger" size="mini" @click="data.questions.splice(index, 1)">删除</el-button>-->
                        <!--<p style="margin-right:10px;float: right">-->
                            <!--排序:<el-input size="mini" type="number" @change="set_question_sort()" clearable placeholder="排序值" v-model="item.sort_value" style="width: 80px;"></el-input>-->
                        <!--</p>-->
                        <!--<p style="margin-right:10px;float: right">-->
                            <!--分值:<el-input size="mini" clearable placeholder="分值" v-model="item.score" style="width: 80px;"></el-input>-->
                        <!--</p>-->
                    <!--</div>-->
                <!--</template>-->
            <!--</div>-->


            <div v-for="(paper, index) in data.papers" style="width: 900px;margin: 0 auto;padding:5px;margin-top: 20px;text-align: center;border-bottom: 1px solid #ddd">
                <p style="display: inline-block;margin-top: 10px;">试卷:{{paper.title}}</p>
                <p>
                    <el-button type="warning" size="mini"  @click="pre_print(1, paper)">打印试卷</el-button>
                    <el-button type="warning" size="mini"  @click="pre_print(1, paper, true)">打印试卷(含答案)</el-button>
                    <el-button type="warning" size="mini"  @click="pre_print(2, paper)">打印答题卡</el-button>
                    <el-button type="primary" size="mini"  @click="goto_review_examine_paper(paper)" v-if="has_gaoquanxian">学生答卷</el-button>
                    <el-button type="primary" size="mini"  @click="review_examine_question(paper)">批阅题目</el-button>
                    <el-button type="primary" size="mini" :loading="loading1===index"  @click="reckon_result_batch(paper,index)" v-if="has_gaoquanxian">计算成绩</el-button>
                    <el-button type="primary" size="mini" :loading="loading2===index" @click="set_publish_examine_paper_result(paper,index)" v-if="has_gaoquanxian">发布成绩</el-button>
                    <el-button type="danger" size="mini"  @click="del(paper)" v-if="has_gaoquanxian">删除</el-button>
                </p>

            </div>

            <div v-if="!data.papers.length" style="width: 600px;margin: 0 auto;margin-top: 20px;text-align: center">
               您还没有添加试卷,请输入试卷名称搜索并添加试卷
            </div>

            <div style="width: 600px;margin: 0 auto;margin-top: 20px;text-align: center">
                <el-autocomplete
                        v-model="name"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入试卷名称"
                        @select="handleSelect"
                        clearable
                        style="width: 250px;"
                ></el-autocomplete>
                <el-button type="success"  @click="add()">添加</el-button>
            </div>

        </div>

        <div style="display: none">
            <div id="preview" style="width: 794px;height:1115px;position: relative">
                <template v-if="preview_content.id">
                    <p style="text-align: center;font-size: 20px;font-weight: bolder">{{preview_content.title}}</p>
                    <p style="text-align: center;font-size: 12px;margin-bottom: 20px;">考试时间:{{preview_content.time_limit_min}}分钟</p>
                    <div style="font-size: 14px;margin-bottom: 10px;" v-for="(_question, type, index2) in preview_content.questions_with_types">
                        <p style="float: 16px;font-weight: bolder;margin-top:20px;">{{_question.name}}</p>

                        <template v-for="(question, index) in _question.list">
                            <div style="margin-top: 10px;">
                                <div style="float: left;vertical-align:top;width: 20px;" v-html="'<p style=\'display:inline-block\'>'+(index+1)+'、</p>'"></div>
                                <div style="float: right;vertical-align:top;width: 50px;" v-html="'<p style=\'display:inline-block\'>['+question.score+'分]</p>'"></div>
                                <div style="float: left;vertical-align:top;width: 670px;" v-html="question.question_content"></div>
                                <div style="clear: both"></div>
                                <template v-if="question.type==1">
                                    <div style="float: left;vertical-align:top;width: 300px;margin-top:5px;margin-left: 20px;" v-for="(option,index) in question.question_answer.answer_options">
                                        {{option.label}}.{{option.text}}
                                    </div>

                                </template>

                                <template v-if="question.type==2">
                                    <div style="float: left;vertical-align:top;width: 300px;margin-top:5px;margin-left: 20px;" v-for="(option,index) in question.question_answer.answer_options2">
                                        {{option.label}}.{{option.text}}
                                    </div>

                                </template>

                                <template v-if="question.type==6">
                                    <div style="" v-for="(option,index) in question.question_answer.sub_content">
                                        <div style="margin-left: 20px;">
                                            <p>({{index+1}}){{option.title}}</p>
                                            <template v-if="option.type==1">
                                                <div style="float: left;vertical-align:top;width: 300px;margin-top:5px;margin-left: 20px;" v-for="(option2,index2) in option.answer_options">
                                                    {{option2.label}}.{{option2.text}}
                                                </div>
                                                <div style="clear: both"></div>
                                            </template>
                                        </div>
                                    </div>

                                </template>
                                <div style="clear: both"></div>

                                <template v-if="show_answer">
                                    <div style="color: red;font-weight: bolder">

                                        <p v-if="question.type == 3" >
                                            <span>答案:</span>
                                            <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in question.question_answer.answer">({{index3+1}}){{answer_item.text}}</span>
                                        </p>
                                        <p v-else-if="question.type == 6" >
                                            <span>答案:</span>
                                            <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in question.question_answer.answer">({{index3+1}}){{answer_item}}</span>
                                        </p>
                                        <p v-else v-html="'答案:'+question.question_answer.answer"></p>
                                        <p v-html="'答案解析:'+question.question_answer.answer_parse"></p>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </div>

                </template>

                <template v-if="preview_content_datika.question_positions">

                    <div  style="height:1115px;width: 794px;margin: 0 auto;position: relative " v-for="(question_position, order_id) in preview_content_datika.question_positions" >

                        <div style="position: absolute;left: 0;top:0; background: #000;width: 26px;height: 26px;border-radius: 26px;"></div>
                        <div style="position: absolute;right: 0;top:0;background: #000;width: 26px;height: 26px;border-radius: 26px;"></div>
                        <div style="position: absolute;left: 0;bottom:0;background: #000;width: 26px;height: 26px;border-radius: 26px;"></div>
                        <div style="position: absolute;right: 0;bottom:0;background: #000;width: 26px;height: 26px;border-radius: 26px;"></div>

                        <div style="position: absolute;left: 13px;top:13px;width: 768px;height:1089px;border: 1px solid #000"></div>

                        <div style="text-align: center;color:#E188BA;font-size: 24px;font-weight: bolder;position: absolute;top:40px;width: 100%;">{{preview_content_datika.title}}答题卡({{order_id+1}})</div>

                        <div style="position:absolute;left: 30px;top:100px;width: 150px;height:160px;line-height:60px;border: 2px solid #E188BA">
                            <p>姓名:</p>
                            <p>准考证号:</p>
                        </div>

                        <div style="position:absolute;left: 230px;top:100px;width: 380px;height:220px;border: 2px solid #E188BA"></div>
                        <div style="position: absolute;left: 235px;top:110px;">准考证号:</div>
                        <!--准考证号-->
                        <template v-if="question_position.zhunkaozheng">
                            <div v-for="(item,index) in question_position.zhunkaozheng" :style="'font-size: 10px;letter-spacing:5px;font-family: \'Arial\';position: absolute;left: '+(item.x+13)+'px;top:'+(item.y+13)+'px;margin-left: -11px;margin-top: -5px;'">[{{index%10}}]</div>
                        </template>

                        <!--序号-->
                        <div style="position:absolute;left: 630px;top:100px;width: 120px;height:220px;border: 2px solid #E188BA"></div>
                        <template v-if="question_position.xuhao">
                            <div v-for="(item,index) in question_position.xuhao" :style="'font-size: 10px;letter-spacing:5px;font-family: \'Arial\';position: absolute;left: '+(item.x+13)+'px;top:'+(item.y+13)+'px;margin-left: -11px;margin-top: -5px;width: 22px;height: 10px;background: '+item.color"></div>
                        </template>

                        <div style="position:absolute;left: 50px;top:340px;width: 694px;height:2px;background: #E188BA"></div>
                        <div :style="'position:absolute;left: '+(title.x+13)+'px;top:'+(title.y+13)+'px;height:2px;'" v-for="(title, index) in question_position.titles">{{title.text}}</div>


                        <template v-for="(_question,index) in question_position.questions">
                            <div v-if="(_question.type==1 || _question.type==2) && _question.is_sub_title" :style="'font-size: 12px;letter-spacing:5px;font-family: \'Arial\';position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;margin-left: -11px;margin-top: -5px;text-align: center;width: 22px;'">{{_question.text}}</div>
                            <div v-if="(_question.type==3 || _question.type==4 || _question.type==5 || _question.type==6|| _question.type==7) && _question.is_sub_title" :style="'position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;'">{{_question.text}}、</div>
                            <div v-if="(_question.type==3 || _question.type==4 || _question.type==5 || _question.type==6) && _question.is_sub_sub_title" :style="'position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;'">{{_question.text}}</div>

                            <div v-if="(_question.type==1 || _question.type==2) && !_question.is_sub_title && !_question.is_sub_sub_title" :style="'font-size: 10px;letter-spacing:5px;font-family: \'Arial\';position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;margin-left: -11px;margin-top: -5px;'">{{_question.text}}</div>
                            <div v-if="(_question.type==3 || _question.type==4 || _question.type==5 || _question.type==6 || _question.type==7) && !_question.is_sub_title && !_question.is_sub_sub_title" :style="'position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;width: '+_question.width+'px;height:'+_question.height+'px;border: 2px solid #E188BA'"></div>
                            <div v-if="(_question.type==8) && !_question.is_sub_title && !_question.is_sub_sub_title" :style="'position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;width: '+_question.width+'px;height:'+_question.height+'px;border: 2px solid #E188BA'">
                                <div style="border-bottom: 1px dashed #333;height:28px;" v-for="(line, index) in lines"></div>
                            </div>


                        </template>

                        <div style="page-break-after: always;"></div>
                    </div>


                </template>

            </div>
        </div>

        <el-dialog title="预览" :visible.sync="dialogFormVisiblePreview1" width="80%">

            <div class="question_block" style="width: 754px;padding:20px;margin: 0 auto;border: 1px solid #ddd;position: relative " >
                <!--<template v-for="(item,index) in current.questions">-->

                    <!--<div class="question_item">-->
                        <!--{{index+1}}.{{item.title}}-->
                    <!--</div>-->
                <!--</template>-->

                <template v-if="preview_content.id">
                    <p style="text-align: center;font-size: 20px;font-weight: bolder">{{preview_content.title}}</p>
                    <p style="text-align: center;font-size: 12px;margin-bottom: 20px;">考试时间:{{preview_content.time_limit_min}}分钟</p>
                    <div style="font-size: 14px;margin-bottom: 10px;" v-for="(_question, type, index2) in preview_content.questions_with_types">
                        <p style="float: 16px;font-weight: bolder;margin-top:20px;">{{_question.name}}</p>

                        <template v-for="(question, index) in _question.list">
                            <div style="margin-top: 10px;">
                                <div style="float: left;vertical-align:top;width: 20px;" v-html="'<p style=\'display:inline-block\'>'+(index+1)+'、</p>'"></div>
                                <div style="float: right;vertical-align:top;width: 50px;" v-html="'<p style=\'display:inline-block\'>['+question.score+'分]</p>'"></div>
                                <div style="float: left;vertical-align:top;width: 670px;" v-html="question.question_content"></div>
                                <div style="clear: both"></div>
                                <template v-if="question.type==1">
                                    <div style="float: left;vertical-align:top;width: 300px;margin-top:5px;margin-left: 20px;" v-for="(option,index) in question.question_answer.answer_options">
                                        {{option.label}}.{{option.text}}
                                    </div>

                                </template>

                                <template v-if="question.type==2">
                                    <div style="float: left;vertical-align:top;width: 300px;margin-top:5px;margin-left: 20px;" v-for="(option,index) in question.question_answer.answer_options2">
                                        {{option.label}}.{{option.text}}
                                    </div>

                                </template>

                                <template v-if="question.type==6">
                                    <div style="" v-for="(option,index) in question.question_answer.sub_content">
                                        <div style="margin-left: 20px;">
                                            <p>({{index+1}}){{option.title}}</p>
                                            <template v-if="option.type==1">
                                                <div style="float: left;vertical-align:top;width: 300px;margin-top:5px;margin-left: 20px;" v-for="(option2,index2) in option.answer_options">
                                                    {{option2.label}}.{{option2.text}}
                                                </div>
                                                <div style="clear: both"></div>
                                            </template>
                                        </div>
                                    </div>

                                </template>
                                <div style="clear: both"></div>
                                <template v-if="show_answer">
                                    <div style="color: red;font-weight: bolder">
                                        <p v-if="question.type == 3" >
                                            <span>答案:</span>
                                            <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in question.question_answer.answer">({{index3+1}}){{answer_item.text}}</span>
                                        </p>
                                        <p v-else-if="question.type == 6" >
                                            <span>答案:</span>
                                            <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in question.question_answer.answer">({{index3}}){{answer_item}}</span>
                                        </p>
                                        <p v-else v-html="'答案:'+question.question_answer.answer"></p>
                                        <p v-html="'答案解析:'+question.question_answer.answer_parse"></p>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </div>

                </template>
            </div>

            <div slot="footer" class="dialog-footer" style="position: fixed;bottom:20px;left:50%">
                <el-button type="primary" @click="print(1)">打 印</el-button>
                <el-button @click="dialogFormVisiblePreview1 = false">关 闭</el-button>
            </div>
        </el-dialog>

        <el-dialog title="预览" :visible.sync="dialogFormVisiblePreview2" width="80%">

            <div  style="height:1115px;width: 794px;margin: 0 auto;position: relative " v-for="(question_position, order_id) in preview_content_datika.question_positions" >

                <div style="position: absolute;left: 0;top:0; background: #000;width: 26px;height: 26px;border-radius: 26px;"></div>
                <div style="position: absolute;right: 0;top:0;background: #000;width: 26px;height: 26px;border-radius: 26px;"></div>
                <div style="position: absolute;left: 0;bottom:0;background: #000;width: 26px;height: 26px;border-radius: 26px;"></div>
                <div style="position: absolute;right: 0;bottom:0;background: #000;width: 26px;height: 26px;border-radius: 26px;"></div>

                <div style="position: absolute;left: 13px;top:13px;width: 768px;height:1089px;border: 1px solid #000"></div>

                <div style="text-align: center;color:#E188BA;font-size: 24px;font-weight: bolder;position: absolute;top:40px;width: 100%;">{{preview_content_datika.title}}答题卡({{order_id+1}})</div>

                <div style="position:absolute;left: 30px;top:100px;width: 150px;height:160px;line-height:60px;border: 2px solid #E188BA">
                    <p>姓名:</p>
                    <p>准考证号:</p>
                </div>

                <div style="position:absolute;left: 230px;top:100px;width: 380px;height:220px;border: 2px solid #E188BA"></div>
                <div style="position: absolute;left: 235px;top:110px;">准考证号:</div>
                <!--准考证号-->
                <template v-if="question_position.zhunkaozheng">
                    <div v-for="(item,index) in question_position.zhunkaozheng" :style="'font-size: 10px;letter-spacing:5px;font-family: \'Arial\';position: absolute;left: '+(item.x+13)+'px;top:'+(item.y+13)+'px;margin-left: -11px;margin-top: -5px;'">[{{index%10}}]</div>
                </template>

                <!--序号-->
                <div style="position:absolute;left: 630px;top:100px;width: 120px;height:220px;border: 2px solid #E188BA"></div>
                <template v-if="question_position.xuhao">
                    <div v-for="(item,index) in question_position.xuhao" :style="'font-size: 10px;letter-spacing:5px;font-family: \'Arial\';position: absolute;left: '+(item.x+13)+'px;top:'+(item.y+13)+'px;margin-left: -11px;margin-top: -5px;width: 22px;height: 10px;background: '+item.color"></div>
                </template>

                <div style="position:absolute;left: 50px;top:340px;width: 694px;height:2px;background: #E188BA"></div>
                <div :style="'position:absolute;left: '+(title.x+13)+'px;top:'+(title.y+13)+'px;height:2px;'" v-for="(title, index) in question_position.titles">{{title.text}}</div>


                <template v-for="(_question,index) in question_position.questions">
                    <div v-if="(_question.type==1 || _question.type==2) && _question.is_sub_title" :style="'font-size: 12px;letter-spacing:5px;font-family: \'Arial\';position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;margin-left: -11px;margin-top: -5px;text-align: center;width: 22px;'">{{_question.text}}</div>
                    <div v-if="(_question.type==3 || _question.type==4 || _question.type==5 || _question.type==6|| _question.type==7) && _question.is_sub_title" :style="'position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;'">{{_question.text}}、</div>
                    <div v-if="(_question.type==3 || _question.type==4 || _question.type==5 || _question.type==6) && _question.is_sub_sub_title" :style="'position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;'">{{_question.text}}</div>

                    <div v-if="(_question.type==1 || _question.type==2) && !_question.is_sub_title && !_question.is_sub_sub_title" :style="'font-size: 10px;letter-spacing:5px;font-family: \'Arial\';position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;margin-left: -11px;margin-top: -5px;'">{{_question.text}}</div>
                    <div v-if="(_question.type==3 || _question.type==4 || _question.type==5 || _question.type==6 || _question.type==7) && !_question.is_sub_title && !_question.is_sub_sub_title" :style="'position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;width: '+_question.width+'px;height:'+_question.height+'px;border: 2px solid #E188BA'"></div>
                    <div v-if="(_question.type==8) && !_question.is_sub_title && !_question.is_sub_sub_title" :style="'position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;width: '+_question.width+'px;height:'+_question.height+'px;border: 2px solid #E188BA'">
                        <div style="border-bottom: 1px dashed #333;height:28px;" v-for="(line, index) in lines"></div>

                    </div>


                </template>
            </div>
            <!--<div style="page-break-after: always;"></div>-->


            <div slot="footer" class="dialog-footer" style="position: fixed;bottom:20px;left:50%">
                <el-button type="primary" @click="print(2)">打 印</el-button>
                <el-button @click="dialogFormVisiblePreview2 = false">关 闭</el-button>
            </div>
        </el-dialog>


        <el-dialog title="选择批阅的题目" :visible.sync="reviewQuestionPreview" width="50%">

            <div v-for="(quesiton,index) in reviewPaperQuestion">
                <p style="float: 16px;">{{quesiton.name}}</p>
                <p @click="goto_review_examine_question(q)" class="question_item_review" v-for="(q,i) in quesiton.list">
                    第{{i+1}}题
                    <el-tag type="success" size="mini" v-if="q.is_review == 1">(已批阅)</el-tag>
                </p>

            </div>

            <div slot="footer" class="dialog-footer"">
                <el-button @click="reviewQuestionPreview = false">关 闭</el-button>
            </div>
        </el-dialog>

    </div>

</template>

<script>
    import headTop from '../components/headTop'
    import {get_examine_papers, set_examine_paper,set_publish_examine_paper_result} from '@/api/getDataEarth'
    import {examine_paper_all_list, examine_paper_info} from '@/api/getDataexamine_paper'
    import {reckon_result_batch} from '@/api/getDatastudent_examine_result'
    import '@/assets/js/jquery-1.4.4.min';
    import '@/assets/js/jquery.jqprint-0.3';
    export default {
        data(){
            return {
                id:0,
                loading:false,
                loading1:false,
                loading2:false,
                name:'',
                lines:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
                data:{
                    papers:[],
                    all_papers:[]

                },
                add_paper:{},
                dialogFormVisible:false,
                dialogFormVisiblePreview1:false,
                dialogFormVisiblePreview2:false,
                reviewQuestionPreview:false,
                reviewPaperQuestion:[],
                preview_content:{},
                preview_content_datika: {},
                show_answer:false,

                current:{},
                current_paper:{},
                has_gaoquanxian:false
            }

        },
        components: {
            headTop
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
            if (vm.id && vm.id > 0) {
                vm.get_info();
            } else {
                vm.init();
            }


        })
        },
        methods: {

            init() {
                this.loading = false;
                this.loading1 = false;
                this.loading2 = false;
                this.name = '';
                this.data = {
                    papers:[],
                    all_papers:[]

                }
                this.add_paper = {};
                this.has_gaoquanxian = false;
            },
            get_info() {
                get_examine_papers({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.data.papers = res.data.papers;
                        this.has_gaoquanxian = res.data.has_gaoquanxian;

                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },
            add(){
                if (!this.add_paper.id) {
                    return;
                }
                set_examine_paper({examination_id:this.id, examine_paper_id:this.add_paper.id, add:1}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.get_info();
                        this.name = '';
                        this.add_paper = {}
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },
            del(row){
                this.$confirm('此操作将删除试卷,并且该试卷下的学生考试成绩也将无法查询, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    set_examine_paper({examination_id:this.id, examine_paper_id:row.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.get_info();

                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
                })

            },
            querySearchAsync(queryString, cb) {
                var results = [];
                if (!this.name) {
                    cb([]);
                    return ;
                }
                examine_paper_all_list({name:this.name,status:1}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        results = res.data;
                        results.forEach(function(val){
                            val.value = val.title;
                        });
                        cb(results);
                    } else {
                        cb([]);
                    }
                }.bind(this));


            },
            handleSelect(item) {
                this.add_paper = item;
            },
            pre_print(type, paper, show_answer) {
                this.preview_content = {};
                this.preview_content_datika = {};
                this.current=paper;
                this.show_answer = show_answer ? true : false;
                var datika = 0;
                if(type == 1) {//试卷
                    datika = 0;
                } else if(type == 2){//答题卡
                    datika = 1;
                } else {
                    return ;
                }
                examine_paper_info({id:this.current.id, datika:datika}).then((res) => {
                    if (res.code == this.$store.state.constant.status_success) {

                        if(type == 1) {//试卷
                            this.preview_content = res.data;
                        } else if(type == 2){//答题卡
                            this.preview_content_datika = res.data.datika_info;
                            this.preview_content_datika.title = res.data.title;
                        }

                        this['dialogFormVisiblePreview'+type]=true;


                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }
                });


            },
            print() {
                setTimeout(()=>{
                    $("#preview").jqprint();
                })

            },

            goto_review_examine_paper(row){
                this.$router.push({path:'student_examine_result',query:{examine_id:this.id, examine_paper_id:row.id}});
            },
            goto_review_examine_question(row){
                this.reviewQuestionPreview = false;
                this.$router.push({path:'review_student_examine_question',query:{examine_id:this.id, examine_paper_id:this.current_paper.id, question_id:row.id}});
            },
            review_examine_question(paper){
                this.current_paper = paper;
                examine_paper_info({id:paper.id, examine_id:this.id}).then((res) => {
                    if (res.code == this.$store.state.constant.status_success) {

                        this.reviewQuestionPreview = true;

                        this.reviewPaperQuestion = res.data.questions_with_types;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }
                });


            },
            reckon_result_batch(paper, i){
                this.loading1 = i;
                reckon_result_batch({examine_paper_id:paper.id, examine_id:this.id}).then((res) => {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });

                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }
                    this.loading1 = false
                });
            },
            set_publish_examine_paper_result(paper,i){
                this.loading2 = i;
                set_publish_examine_paper_result({examine_paper_id:paper.id, examine_id:this.id, is_publish:1}).then((res) => {
                    if (res.code == this.$store.state.constant.status_success) {
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    });

                } else {
                    this.$message({
                        message: res.msg,
                        type: 'warning'
                    });
                }
                this.loading2 = false;
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
    .paper{
        text-align: center;
    }
    .paper:hover{
        background: #eee;
    }
    .question_item_review{
        font-size: 14px;
        cursor: pointer;
    }
    .question_item_review:hover{
        background: #eee;
    }
    /*.location_point{*/
        /*background: #000;*/
        /*width: 26px;*/
        /*height: 26px;*/
        /*border-radius: 26px;*/
    /*}*/
    /*.label{*/
        /*font-size: 10px;*/
        /*letter-spacing:5px;*/
    /*}*/
</style>
