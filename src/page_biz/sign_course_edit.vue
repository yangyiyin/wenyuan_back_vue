<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">
            <div class="search_item">
                <span  style="font-size: 14px;vertical-align: top;color: red;margin-left: 20px;padding: 10px">{{stage_name}}</span>

            </div>

            <div class="search_item">
                <span  style="font-size: 14px;vertical-align: top;color: red;margin-left: 20px;padding: 10px">选择课程:</span>
                <div v-loading="loading_course" style="border-bottom: 1px solid #999;">
                    <el-checkbox v-model="checkList" @change="change_courses" style="margin-left: 30px;margin-bottom: 10px;" v-for="item in courselist" :disabled="item.disabled" :label="item.courseid">{{item.coursename}}</el-checkbox>

                </div>
            </div>

            <div class="block search_item">
                <span class="pre_info" style="font-size: 14px;margin-left: 30px;width: 150px;">批量设置原班报名开始时间:</span>
                <el-date-picker
                        @change="set_time_batch('start_time')"
                        v-model="start_time"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间">
                </el-date-picker>
            </div>
            <div class="block search_item">
                <span class="pre_info" style="font-size: 14px;margin-left: 30px;width: 150px;">批量设置所有老生报名开始时间:</span>
                <el-date-picker
                        @change="set_time_batch('end_time_self')"
                        v-model="end_time_self"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间">
                </el-date-picker>
            </div>
            <div class="block search_item">
                <span class="pre_info" style="font-size: 14px;margin-left: 30px;width: 150px;">批量设置新生报名开始时间:</span>
                <el-date-picker
                        @change="set_time_batch('end_time_old')"
                        v-model="end_time_old"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间">
                </el-date-picker>
            </div>
            <div class="block search_item">
                <span class="pre_info" style="font-size: 14px;margin-left: 30px;width: 150px;">批量设置所有人可报名截止时间:</span>
                <el-date-picker
                        @change="set_time_batch('end_time_public')"
                        v-model="end_time_public"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间">
                </el-date-picker>
            </div>

            <div class="search_item" style="margin-bottom: 20px;">
                <span class="pre_info" style="font-size: 14px;margin-left: 30px;width: 150px;">批量设置押金</span>
                <el-input @change="set_time_batch('deposit')" clearable placeholder="金额" type="number" v-model="deposit" style="width: 150px">

                </el-input>
            </div>
            <div v-for="item in courses_data" :key="item.courseid" style="border: 1px dashed #999;margin: 10px;padding-bottom: 10px;">
                <el-tag style="font-size: 18px;">{{item.coursename}}</el-tag>
                <div class="search_item" style="margin-top: 20px">
                    <span  style="font-size: 14px;vertical-align: top;color: red;margin-left: 20px;padding: 10px;">1.选择班级(已筛选-未报满):</span>
                    <div  v-loading="item.loading_class">
                        <template v-if="item.class_list && item.class_list.length">
                            <el-checkbox v-model="item.classes_ids" @change="change_class(item)" style="margin-left: 30px;margin-bottom: 10px;" v-for="item2 in item.class_list" :label="item2.classid">{{item2.classname}}</el-checkbox>

                        </template>
                        <template v-else>
                            <span style="color:red;font-weight: bold">该课程下没有未报满班级数据，请核对麦田系统后台数据，如麦田有数据，则应是网络问题造成，可在上方重新勾选该课程以刷新</span>
                        </template>
                        <!--<el-checkbox-group v-model="item.classes">-->
                            <!--<el-checkbox style="margin-left: 30px;margin-bottom: 10px;" v-for="item2 in item.class_list" :key="item2.classid" :label="item2">{{item2.classname}}</el-checkbox>-->
                        <!--</el-checkbox-group>-->
                    </div>

                </div>
                <div class="search_item" style="margin-top: 20px">
                    <span  style="font-size: 14px;vertical-align: top;color: red;margin-left: 20px;padding: 10px">2.选择考试条件:</span>
                    <div style="margin-left: 20px;">
                        <el-autocomplete
                                v-model="item.examine_str"
                                :fetch-suggestions="querySearchAsync"
                                placeholder="输入标题，搜索考试"
                                @select="handleSelect"
                                clearable="true"
                                style="width: 400px;"
                        ></el-autocomplete>
                        <el-button type="warning" style="margin-bottom: 10px;" v-on:click="add_examine(item)" :loading="loading"><i class="iconfont el-icon-cc">&#xe658;</i></el-button>
                        <div v-for="(item2,index2) in item.examine_rules">

                            <el-tag style="margin-right: 10px;">id{{item2.examine_id}}_{{item2.index}}</el-tag>
                            <el-tag type="warning" style="width: 400px;margin-right: 10px;">{{item2.name}}</el-tag>
                            <span style="font-size: 14px;">条件:</span>
                            <el-select v-model="item2.field" placeholder="字段" style="width: 180px;">
                                <el-option
                                        v-for="item in [{value:'A1_score',label:'一试总分'},{value:'A2_score',label:'二试总分'},{value:'A12_score',label:'合计分'},{value:'B_english_score',label:'英语达人赛综合分'},{value:'B_maths_score',label:'数学晋级考总分'},{value:'C_score',label:'新生入学测试总分'},{value:'remark_luqu',label:'录取班级'},{value:'remark_luqu2',label:'录取班级2'},{value:'remark_luqu3',label:'录取班级3'},{value:'remark',label:'考试结果备注'}]"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="item2.logic" placeholder="逻辑" style="width: 80px;">
                                <el-option
                                        v-for="item in [{value:'gt',label:'大于'},{value:'eq',label:'等于'},{value:'lt',label:'小于'}]"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                            <el-input clearable placeholder="值" v-model="item2.value" style="width: 180px"></el-input>
                            <el-button type="danger" style="margin-bottom: 10px;" v-on:click="del_examine(item,index2)" :loading="loading"><i class="iconfont el-icon-cc">&#xe603;</i></el-button>

                        </div>
                       <div>
                           <el-tag >逻辑描述</el-tag>
                           <el-input clearable placeholder="如：(id1 or id4) or (id2 and id3) ..." v-model="item.logic_text"  style="width: 450px"></el-input>

                       </div>
                    </div>

                </div>
                <div class="search_item" style="margin-top: 20px">
                    <span  style="font-size: 14px;vertical-align: top;color: red;margin-left: 20px;padding: 10px">3.时间设置:</span>
                    <div style="margin-left: 20px;">
                        <div class="block search_item">
                            <span class="pre_info" style="font-size: 14px;">原班老生报名开始时间:</span>
                            <el-date-picker
                                    v-model="item.start_time"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </div>
                        <div class="block search_item">
                            <span class="pre_info" style="font-size: 14px;">所有老生报名开始时间:</span>
                            <el-date-picker
                                    v-model="item.end_time_self"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </div>
                        <div class="block search_item">
                            <span class="pre_info" style="font-size: 14px;">新生报名开始时间:</span>
                            <el-date-picker
                                    v-model="item.end_time_old"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </div>
                        <div class="block search_item">
                            <span class="pre_info" style="font-size: 14px;">所有人报名截止时间:</span>
                            <el-date-picker
                                    v-model="item.end_time_public"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </div>
                        <div class="search_item">
                            <span class="pre_info" style="font-size: 14px;">押金<span style="font-size: 12px;">（全额{{item.unitprice}}元）</span>:</span>
                            <el-input clearable placeholder="金额" v-model="item.deposit" type="number" style="width: 150px"></el-input>
                        </div>
                        <div class="search_item">
                            <el-checkbox v-model="item.is_only_old_sign" style="margin-left: 30px;margin-bottom: 10px;" :label="item.courseid">只限老生报名</el-checkbox>

                        </div>
                    </div>
                </div>
            </div>



            <!--<div class="search_item" v-if="!all_visible">-->
                <!--对应课程结束-->
                <!--<el-input clearable placeholder="" v-model="visible_time_limit" style="width: 100px">-->
                <!--</el-input>天后学生依然可见-->
            <!--</div>-->




            <el-button type="success" style="margin: 20px;" v-on:click="submit" :loading="loading">好了，发布</el-button>

        </div>
    </div>

</template>

<script>
    import headTop from '../components/headTop'
    import {sign_course_info,get_course_list,sign_course_edit,get_class_list,examination_all_list} from '@/api/getDataEarth'
    export default {
        data(){
            return {
                id:0,
                stage_id:0,
                stage_name:'',
                loading:false,
                start_time:'',
                end_time_self:'',
                end_time_old:'',
                end_time_public:'',
                deposit:'',
                loading_course:false,
                checkList:[],
                courselist:[],
                class_list:[],
                examine:'',
                courses_data:[
                    // {
                    //     courseid:0,
                    //     coursename:'',
                    //     class_list:[],
                    //     classes:[],
                    //     examine_rules:[
                    //         {id:0,field:'',logic:'gt',value:0}
                    //     ],
                    //     start_time:'',
                    //     end_time_self:'',
                    //     end_time_public:''
                    // }
                ]

            }

        },
        components: {
            headTop
        },
        created(){

        },
        mounted(){

            //console.log(this.$route.query);
        },

        beforeRouteEnter (to, from, next) {
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.id = to.query.id ? to.query.id : 0;
                vm.stage_id = to.query.stage_id ? to.query.stage_id : 0;
                vm.stage_name = to.query.stage_name ? to.query.stage_name : '';
                // vm.get_course_list(vm).then(function(){
                //     if (vm.id && vm.id > 0) {
                //         vm.get_info();
                //     } else {
                //         vm.init();
                //     }
                // })
                if (vm.id && vm.id > 0) {

                    vm.get_info().then(function () {
                        vm.get_course_list();
                    })

                } else {
                    vm.init();
                    vm.get_course_list();
                }


            })
        },
        methods: {

            init() {
                this.loading = false;
                this.examine = '';
                this.checkList=[];
                this.courselist=[];
                this.class_list=[];
                this.courses_data=[];

                this.start_time = '';
                this.end_time_self = '';
                this.end_time_old = '';
                this.end_time_public = '';
                this.deposit = '';

            },
            get_course_list(vm, checklist) {
                return new Promise(function(resolve,reject){
                    this.courselist = [];
                    this.loading_course = true;
                    get_course_list({}).then(function (res) {
                        this.loading_course = false;
                        if (res.code == this.$store.state.constant.status_success) {
                            if (this.checkList && this.checkList.length) {
                                // this.courselist = this.set_checked_course(res.data);
                                this.courselist = res.data
                            } else {
                                this.courselist = res.data
                            }

                            if (this.id && this.id>0) {
                                this.courselist.forEach(function(v){
                                    v.disabled = true;
                                })
                            }

                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }
                        resolve();
                    }.bind(this));
                }.bind(this))

            },
            get_info() {
                return new Promise(function(resolve,reject) {
                    sign_course_info({id: this.id}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                             res.data.content.loading_class = false;
                            this.courses_data = [res.data.content];
                            this.get_class_list(res.data.content.courseid, this.courses_data[0]);
                            this.checkList = [res.data.content.courseid];
                            //this.set_checked_course();

                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }
                        resolve();
                    }.bind(this));
                }.bind(this));
            },
            submit: function () {

                var error_msg = [];
                if (!this.courses_data || !this.courses_data.length) {
                    error_msg.push('请选择课程');
                }
                this.courses_data.forEach(function(course,i){

                    if (!course.classes || !course.classes.length) {
                        error_msg.push('请选择课程“'+course.coursename+'”的班级');
                    }

                    if (course.examine_rules && course.examine_rules.length) {
                        course.examine_rules.forEach(function(rule,index){
                            if (!rule.examine_id || !rule.name || !rule.field || !rule.logic || (!rule.value && rule.value!='0')) {
                                error_msg.push('请检查课程“'+course.coursename+'”的考试条件信息第【'+(index+1)+'】项是否填写完整');
                            }
                        })
                    }
                    if (!course.start_time) {
                        error_msg.push('请检查课程“'+course.coursename+'”的原班老生报名开始时间是否填写');
                    }
                    if (!course.end_time_self) {
                        error_msg.push('请检查课程“'+course.coursename+'”的所有老生报名开始时间是否填写');
                    }
                    if (!course.end_time_old) {
                        error_msg.push('请检查课程“'+course.coursename+'”的新生报名开始时间是否填写');
                    }
                    if (!course.end_time_public) {
                        error_msg.push('请检查课程“'+course.coursename+'”的所有人可报名截止时间是否填写');
                    }

                })


                if (error_msg && error_msg.length) {
                    this.$message({
                        type: 'warning',
                        message: error_msg.join('。')
                    });
                    return;
                }

                //console.log(this.courses_data);return;
                this.$confirm('共计'+this.courses_data.length+'个课程报名信息即将发布, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    this.loading = true;
                    sign_course_edit({
                        id:this.id,
                        stage_id:this.stage_id,
                        courses_data:this.courses_data
                    }).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            this.$router.push({path:'sign_course',query:{id:this.stage_id,name:this.stage_name}});
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
            querySearchAsync(queryString, cb) {
                this.examination_select = {};
                var results = [];
                examination_all_list({title:queryString}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                       results = res.data;
                        results.unshift({
                            id: "0",
                            title: "没参加以上考试的",
                            type: "1",
                            value: "没参加以上考试的"
                        })
                        results.unshift({
                            id: "-1",
                            title: "没参加以上考试的(原班级老生)",
                            type: "1",
                            value: "没参加以上考试的(原班级老生)"
                        })
                        cb(results);
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }
                }.bind(this));


            },
            handleSelect(item) {
                this.examination_select = item;
            },
            get_course_by_id(courseid){
                var course = {};
                this.courselist.forEach(function (v) {
                    if (v.courseid == courseid ) {
                        course = v;
                        return;
                    }
                });
                return course;
            },
            get_class_by_id(classid,item){
                var _class = {};
                item.class_list.forEach(function (v) {
                    if (v.classid == classid ) {
                        item.classes.forEach(function(v2){
                            if(v2.classid == v.classid && v2.id) {
                                v.id = v2.id;
                                return;
                            }
                        }.bind(this))
                        _class = v;
                        return;
                    }
                });
                return _class;
            },
            change_class(item){
                var classes = [];
                item.classes_ids.forEach(function(v){
                    classes.push(this.get_class_by_id(v,item));
                }.bind(this))
                item.classes = classes;
            },
            change_courses(){
                // console.log(this.checkList);
                //this.courses_data = [];
                var add=[], old = [];
                this.checkList.forEach(function(courseid,i){
                    var course = this.get_course_by_id(courseid);
                    var has = false;
                    this.courses_data.forEach(function(old_course,i2){
                        if (course.courseid == old_course.courseid) {
                            has = true;
                        }
                    }.bind(this));
                    if (!has) {
                        add.push(course);
                    }
                }.bind(this));

                this.courses_data.forEach(function(course,i){

                    this.checkList.forEach(function(old_course_id,i2){
                        var old_course = this.get_course_by_id(old_course_id);
                        if (course.courseid == old_course.courseid) {
                            old.push(course);
                        }
                    }.bind(this));

                }.bind(this));
                if (add.length) {

                    add.forEach(function(course,i){
                        this.$set(course,'classes',[]);
                        this.$set(course,'classes_ids',[]);
                        this.$set(course,'class_list',[]);
                        this.$set(course,'examine_rules',[]);
                        this.$set(course,'loading_class',true);
                        //获取班级列表
                        old.push(course);
                        this.get_class_list(course.courseid,course);
                    }.bind(this));
                }
                this.courses_data = old;

            },
            get_class_list(course_id,obj) {

                get_class_list({course_id:course_id}).then(function (res) {
                    obj.loading_class = false;
                    if (res.code == this.$store.state.constant.status_success) {
                        // obj.class_list = res.data;
                        obj.class_list = res.data;
                        // this.$set(obj,'class_list',res.data);
                        //console.log(this.courses_data)
                    } else {
                        //obj.loading_class = false;
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },
            add_examine(item){
                if (!this.examination_select||!this.examination_select.id) {
                    this.$message({
                        message: '请先搜索考试，然后选择其中之一',
                        type: 'warning'
                    });
                    return;
                }
                var rule = {
                    examine_id:this.examination_select.id,
                    name:this.examination_select.title,
                    field:'A1_score',
                    logic:'gt',
                    value:0

                }

                item.examine_rules.push(rule);
                this.gen_default_logic_text(item);

            },
            del_examine(item,index){
                item.examine_rules.splice(index,1);
                this.gen_default_logic_text(item);
            },
            gen_default_logic_text(item){

                var logic_text_arr = [];
                var logic_id_arr = [];
                item.examine_rules.forEach(function(val){
                    var index = 0;
                    logic_id_arr.forEach(function(val2){
                        if (val.examine_id == val2) {
                            index++;

                        }
                    })
                    val.index = index;
                    logic_text_arr.push('id'+val.examine_id+'_'+index);
                    logic_id_arr.push(val.examine_id);
                })
                item.logic_text = logic_text_arr.join(' or ');
            },
            // set_checked_course(courselist) {
            //
            //     courselist.forEach(function (v) {
            //         this.checkList.forEach(function (v2) {
            //             if (v.courseid == v2.courseid) {
            //                 //console.log(v.courseid);
            //                 v.checked = true;
            //                 return;
            //             }
            //         })
            //     }.bind(this));
            //     return courselist;
            // },
            // set_checked_class(classlist,classes) {
            //
            //     classlist.forEach(function (v) {
            //         classes.forEach(function (v2) {
            //             if (v.classid == v2.classid) {
            //                 //console.log(v.courseid);
            //                 v.checked = true;
            //                 return;
            //             }
            //         })
            //     }.bind(this));
            //     return classlist;
            // },
            // change_classes(item) {
            //     console.log(item);
            // }
            set_time_batch(name){
                setTimeout(function(){
                    this.courses_data.forEach(function(val){
                        this.$set(val, name, this[name]);
                    }.bind(this))
                }.bind(this))

            },
        }
    }
</script>

<style lang="less">
    @import '../style/mixin';
    .search_item{

        margin-top: 10px;

    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 200px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }

    .ql-editor{
        min-height: 300px;
    }
    .pre_info{
        display:inline-block ;
        width: 150px;
    }
</style>
