<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">


            <img :src="homework_pic" width="650">
            <p v-if="!homework_pic" style="text-align: center">加载图片中...</p>

        <div class="ql-editor" id="question_paper" style="padding:0;width:690px;position:absolute;top:-9999999px;height:auto;background: #fff;font-size:20px;">
            <div ref="questions_paper"  style="padding:20px 30px;font-variant: normal;border-bottom: 1px solid #ddd;width:650px;white-space:normal">
                <p style="width: 650px;text-align: center;font-size: 16px;font-weight: bolder;padding: 10px;">{{data.name}}</p>
                <template v-for="(item, index) in data.questions2">

                    <div v-if="item.type==1" style="font-size: 14px;margin-top:10px;line-height: 25px;overflow: hidden;position: relative">
                        <p style="font-weight: bolder;font-size: 20px;">(单选题【难度{{item.hard_level}}】题目id:{{item.id}}):</p>
                        <p v-html="item.question_content.content" ></p>
                        <p v-for="(option) in item.question_answer.answer_options" style="'position:absolute;top: '+(50+20*index)+'px;'">
                            <span>{{option.label}}.{{option.text}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </p>


                        <div style="color: red;font-weight: bolder">
                            <p v-if="item.type == 3" >
                                <span>答案:</span>
                                <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in item.question_answer.answer">({{index3+1}}){{answer_item.text}}</span>
                            </p>
                            <p v-else-if="item.type == 6" >
                                <span>答案:</span>
                                <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in item.question_answer.answer">({{index3}}){{answer_item}}</span>
                            </p>
                            <p v-else v-html="'答案:'+item.question_answer.answer"></p>
                            <p v-html="'答案解析:'+item.question_answer.answer_parse"></p>
                        </div>

                    </div>

                </template>
                <template v-for="(item, index) in data.questions2">


                    <div  v-if="item.type==2" style="font-size: 14px;margin-top:10px;line-height: 25px;overflow: hidden;position: relative">
                        <p style="font-size: 20px;font-weight: bolder">(判断题【难度{{item.hard_level}}】题目id:{{item.id}}):</p>


                        <p v-html="item.question_content.content" ></p>

                        <p  v-for="(option2,index) in item.question_answer.answer_options2" :style="'position:absolute;top: '+(50+20*index)+'px;'">
                            <span>{{option2.label}}.{{option2.text}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </p>
                        <div style="color: red;font-weight: bolder">
                            <p v-if="item.type == 3" >
                                <span>答案:</span>
                                <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in item.question_answer.answer">({{index3+1}}){{answer_item.text}}</span>
                            </p>
                            <p v-else-if="item.type == 6" >
                                <span>答案:</span>
                                <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in item.question_answer.answer">({{index3}}){{answer_item}}</span>
                            </p>
                            <p v-else v-html="'答案:'+item.question_answer.answer"></p>
                            <p v-html="'答案解析:'+item.question_answer.answer_parse"></p>
                        </div>
                    </div>

                </template>
                <template v-for="(item, index) in data.questions2">
                    <div v-if="item.type==3" style="font-size: 14px;margin-top:10px;line-height: 25px;overflow: hidden;position: relative">
                        <p v-if="item.type==3"  style="font-size: 20px;font-weight: bolder">(填空题【难度{{item.hard_level}}】题目id:{{item.id}}):</p>
                        <p v-html="item.question_content.content"></p>
                        <div style="color: red;font-weight: bolder">
                            <p v-if="item.type == 3" >
                                <span>答案:</span>
                                <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in item.question_answer.answer">({{index3+1}}){{answer_item.text}}</span>
                            </p>
                            <p v-else-if="item.type == 6" >
                                <span>答案:</span>
                                <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in item.question_answer.answer">({{index3}}){{answer_item}}</span>
                            </p>
                            <p v-else v-html="'答案:'+item.question_answer.answer"></p>
                            <p v-html="'答案解析:'+item.question_answer.answer_parse"></p>
                        </div>
                    </div>
                </template>
                <template v-for="(item, index) in data.questions2">

                        <div v-if="item.type==4" style="font-size: 14px;margin-top:10px;line-height: 25px;overflow: hidden;position: relative">
                            <p style="font-size: 20px;font-weight: bolder">(简答题【难度{{item.hard_level}}】题目id:{{item.id}}):</p>

                            <p v-html="item.question_content.content"></p>
                            <div style="color: red;font-weight: bolder">
                                <p v-if="item.type == 3" >
                                    <span>答案:</span>
                                    <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in item.question_answer.answer">({{index3+1}}){{answer_item.text}}</span>
                                </p>
                                <p v-else-if="item.type == 6" >
                                    <span>答案:</span>
                                    <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in item.question_answer.answer">({{index3}}){{answer_item}}</span>
                                </p>
                                <p v-else v-html="'答案:'+item.question_answer.answer"></p>
                                <p v-html="'答案解析:'+item.question_answer.answer_parse"></p>
                            </div>
                        </div>

                </template>


                <template v-for="(item, index) in data.questions2">

                    <div v-if="item.type==6" style="font-size: 14px;margin-top:10px;line-height: 25px;overflow: hidden;position: relative">
                        <p style="font-size: 20px;font-weight: bolder">(阅读题【难度{{item.hard_level}}】题目id:{{item.id}}):</p>

                        <p v-html="item.question_content.content"></p>

                        <div style="" v-for="(option,index) in item.question_answer.sub_content">
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
                        <div style="color: red;font-weight: bolder">
                            <p v-if="item.type == 3" >
                                <span>答案:</span>
                                <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in item.question_answer.answer">({{index3+1}}){{answer_item.text}}</span>
                            </p>
                            <p v-else-if="item.type == 6" >
                                <span>答案:</span>
                                <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in item.question_answer.answer">({{index3}}){{answer_item}}</span>
                            </p>
                            <p v-else v-html="'答案:'+item.question_answer.answer"></p>
                            <p v-html="'答案解析:'+item.question_answer.answer_parse"></p>
                        </div>

                    </div>
                </template>

                <template v-for="(item, index) in data.questions2">

                    <div v-if="item.type==7" style="font-size: 14px;margin-top:10px;line-height: 25px;overflow: hidden;position: relative">
                        <p style="font-size: 20px;font-weight: bolder">(计算题【难度{{item.hard_level}}】题目id:{{item.id}}):</p>

                        <p v-html="item.question_content.content"></p>
                        <div style="color: red;font-weight: bolder">
                            <p v-if="item.type == 3" >
                                <span>答案:</span>
                                <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in item.question_answer.answer">({{index3+1}}){{answer_item.text}}</span>
                            </p>
                            <p v-else-if="item.type == 6" >
                                <span>答案:</span>
                                <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in item.question_answer.answer">({{index3}}){{answer_item}}</span>
                            </p>
                            <p v-else v-html="'答案:'+item.question_answer.answer"></p>
                            <p v-html="'答案解析:'+item.question_answer.answer_parse"></p>
                        </div>
                    </div>
                </template>

                <template v-for="(item, index) in data.questions2">

                    <div v-if="item.type==8" style="font-size: 14px;margin-top:10px;line-height: 25px;overflow: hidden;position: relative">
                        <p style="font-size: 20px;font-weight: bolder">(作文题【难度{{item.hard_level}}】题目id:{{item.id}}):</p>

                        <p v-html="item.question_content.content"></p>
                        <div style="color: red;font-weight: bolder">
                            <p v-if="item.type == 3" >
                                <span>答案:</span>
                                <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in item.question_answer.answer">({{index3+1}}){{answer_item.text}}</span>
                            </p>
                            <p v-else-if="item.type == 6" >
                                <span>答案:</span>
                                <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in item.question_answer.answer">({{index3}}){{answer_item}}</span>
                            </p>
                            <p v-else v-html="'答案:'+item.question_answer.answer"></p>
                            <p v-html="'答案解析:'+item.question_answer.answer_parse"></p>
                        </div>
                    </div>
                </template>
                <template v-for="(item, index) in data.questions2">

                    <div v-if="item.type==5" style="font-size: 14px;margin-top:10px;line-height: 25px;overflow: hidden;position: relative">
                        <p style="font-size: 20px;font-weight: bolder">(其他题【难度{{item.hard_level}}】题目id:{{item.id}}):</p>

                        <p v-html="item.question_content.content"></p>
                        <div style="color: red;font-weight: bolder">
                            <p v-if="item.type == 3" >
                                <span>答案:</span>
                                <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in item.question_answer.answer">({{index3+1}}){{answer_item.text}}</span>
                            </p>
                            <p v-else-if="item.type == 6" >
                                <span>答案:</span>
                                <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in item.question_answer.answer">({{index3}}){{answer_item}}</span>
                            </p>
                            <p v-else v-html="'答案:'+item.question_answer.answer"></p>
                            <p v-html="'答案解析:'+item.question_answer.answer_parse"></p>
                        </div>
                    </div>
                </template>

            </div>
        </div>

        </div>
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
    import {homework_info} from '@/api/getDatahomework'
    import html2canvas from 'html2canvas';
    export default {
        data(){
            return {
                id: 0,
                homework_pic:'',
                data: {
                    name: '',
                    response_type: '2',
                    limit_min: 0,
                    content: '',
                    homework_downloads: '',
                    homework_downloads_objs: '',
                    other_downloads: '',
                    teacher_name: '',
                    total_score_extra: '0',
                    content_extra: '',
                    questions: [],
                    questions2: [],
                    classes: [],
                    author: [],
                    need_record_voice: '0',
                    need_upload_pic: '0',
                    need_manual_check: '0',

                },
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
                this.data = {
                    name:'',
                    response_type:'2',
                    limit_min:0,
                    content:'',
                    homework_downloads:'',
                    homework_downloads_objs:'',
                    other_downloads:'',
                    teacher_name:'',
                    total_score_extra:'0',
                    content_extra:'',
                    questions:[],
                    questions2:[],
                    classes:[],
                    author:[],
                    need_record_voice:'0',
                    need_upload_pic:'0',
                    need_manual_check:'0',
                }
            },
            get_info() {
                homework_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.data = res.data.homework_data;
//                        this.$set(this.data, 'questions', '123')

                        setTimeout(()=>{
                            var total_height = this.$refs.questions_paper.offsetHeight;
                        if (total_height > 0) {
                            html2canvas(document.querySelector('#question_paper'), {useCORS: true}).then(function (canvas) {
                                this.homework_pic = canvas.toDataURL();

                            }.bind(this))
                        }
                        }, 3000);
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },


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

</style>
