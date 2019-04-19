<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px"  v-loading="loading_info">

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;width: 150px;font-weight: bolder"><i style="color:red;">*</i>试卷标题:</span>
                <el-input clearable placeholder="" v-model="data.title" style="width: 450px"></el-input>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;width: 150px;font-weight: bolder"><i style="color:red;">*</i>所属科目:</span>
                <el-radio-group v-model="data.entity" size="small">
                    <el-radio label="1" border>语文</el-radio>
                    <el-radio label="2" border >数学</el-radio>
                    <el-radio label="3" border >英语</el-radio>
                </el-radio-group>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>年级:</span>
                <el-select v-model="data.grade" placeholder="请选择年级" multiple value-key="value">
                    <el-option
                            v-for="item in options.grades"
                            :key="item.value"
                            :label="item.label"
                            :value="item">
                    </el-option>
                </el-select>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;width: 150px;font-weight: bolder"><i style="color:red;">*</i>考试时间(分钟):</span>
                <el-input clearable placeholder="" v-model="data.time_limit_min" type="number" style="width: 120px"></el-input>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder"><i style="color:red;">*</i>绝密等级:</span>
                <el-checkbox-group v-model="data.useway" size="mini" style="display: inline-block">
                    <el-checkbox label="1" border>等级一</el-checkbox>
                    <el-checkbox label="2" border>等级二</el-checkbox>
                    <el-checkbox label="3" border>等级三</el-checkbox>
                    <el-checkbox label="4" border>等级四</el-checkbox>
                </el-checkbox-group>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;width: 150px;font-weight: bolder">备注:</span>
                <el-input  type="textarea" clearable placeholder="" v-model="data.remark" style="width: 350px;vertical-align: middle"></el-input>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>录入者:</span>
                <el-select v-model="data.author" multiple value-key="id" placeholder="请选择">
                    <el-option
                            v-for="item in options.authors"
                            :key="item.id"
                            :label="item.show_name"
                            :value="item">
                    </el-option>
                </el-select>
            </div>

            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">提交</el-button>


        </div>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {examine_paper_edit,examine_paper_info} from '@/api/getDataexamine_paper'
    import {get_grades,admin_user_all_list} from '@/api/getDataEarth'
    export default {
        data(){
            return {
                id:0,
                loading:false,
                name:'',
                data:{
                    title:'',
                    entity:'',
                    grade:[],
                    time_limit_min:'',
                    useway:[],
                    author:[],
                    remark:'',
                },
                options:{
                    grades:[],
                    authors:[]
                },
                loading_info:false
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
            vm.init_authors().then(()=>{return vm.init_grades();}).then(()=>{
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
                this.data = {
                    title:'',
                    entity:'',
                    grade:[],
                    time_limit_min:'',
                    useway:[],
                    author:[],
                    remark:'',
                }
            },
            init_grades(){
                return new Promise(function(resolve,reject){
                    this.loading_info = true;
                    get_grades({}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.options.grades = res.data;

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
            init_authors(){
                return new Promise(function(resolve,reject) {
                    this.loading_info = true;
                    admin_user_all_list({}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.options.authors = res.data;

                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }
                        this.loading_info = false;
                        resolve();
                    }.bind(this));
                }.bind(this));
            },
            get_info() {
                examine_paper_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.data = res.data.examine_paper_data;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },
            submit: function () {

                if (!this.data.title) {
                    var error_msg = '请填写标题';
                }
                if (!this.data.entity) {
                    var error_msg = '请选择科目';
                }
                if (this.data.grade.length <= 0) {
                    var error_msg = '请选择年级';
                }
                if (this.data.time_limit_min <= 0) {
                    var error_msg = '请输入正确的考试时间';
                }
                if (this.data.useway.length <= 0) {
                    var error_msg = '请选择绝密等级';
                }
                if (this.data.author.length <= 0) {
                    var error_msg = '请选择录入者';
                }

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
                    examine_paper_edit({id:this.id,data:this.data}).then(function (res) {
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
</style>
