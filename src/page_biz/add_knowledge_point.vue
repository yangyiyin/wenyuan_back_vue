<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">

            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>分组:</span>
                <el-select v-model="group" value-key="id" placeholder="请选择">
                    <el-option
                            v-for="item in groups"
                            :key="item.id"
                            :label="item.name"
                            :value="item">
                    </el-option>
                </el-select>
                <el-select v-model="group_subject" value-key="id" placeholder="请选择">
                    <el-option
                            v-for="item in groups_subject"
                            :key="item.id"
                            :label="item.name"
                            :value="item">
                    </el-option>
                </el-select>
            </div>


            <div class="search_item">
                <span class="pre_info" style="font-size: 16px;font-weight: bolder;"><i style="color:red;">*</i>名称:</span>
                <el-input clearable placeholder="请输入名称" v-model="name" style="width: 350px">

                </el-input>
            </div>


            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">提交</el-button>


        </div>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {knowledge_point_edit,knowledge_point_info,get_groups,get_groups_subject} from '@/api/getDataknowledge_point'
    export default {
        data(){
            return {
                id:0,
                loading:false,
                name:'',
                group:{},
                groups:[],
                group_subject:{},
                groups_subject:[]
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
            vm.init_options().then(function(){
                if (vm.id && vm.id > 0) {
                    vm.get_info();
                } else {
                    vm.init();
                }
            })


        })
        },
        methods: {

            init_options(){
                return new Promise(function(resolve,reject){
                    this.loading_info = true;
                    get_groups({}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.groups = res.data;

                            get_groups_subject({}).then(function (res) {
                                if (res.code == this.$store.state.constant.status_success) {
                                    this.groups_subject = res.data;

                                } else {
                                    this.$message({
                                        message: res.msg,
                                        type: 'warning'
                                    });
                                }
                                this.loading_info = false;
                                resolve();
                            }.bind(this));

                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }
                        //this.loading_info = false;
                        //resolve();
                    }.bind(this));
                }.bind(this))
            },

            init() {
                this.loading = false;
                this.name = '';
            },
            get_info() {
                knowledge_point_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.name = res.data.name;
                        this.group = {
                            id:parseInt(res.data.group_id),
                            name:res.data.group_name,
                        }
                        this.group_subject = {
                            id:parseInt(res.data.group_id_subject),
                            name:res.data.group_name_subject,
                        }
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },
            submit: function () {

                if (!this.name) {
                    var error_msg = '请填写名称';
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
                    knowledge_point_edit({id:this.id,name:this.name,group:this.group,group_subject:this.group_subject}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            this.$router.push({path:'knowledge_point',query:{}});
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

</style>
