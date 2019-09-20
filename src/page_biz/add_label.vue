<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">

            <div class="search_item">
                <el-input clearable placeholder="请输入名称" v-model="name" style="width: 350px">
                    <template slot="prepend">名称</template>
                </el-input>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;">标签组:</span>
                <el-select v-model="group_id" placeholder="类型">
                    <el-option
                            v-for="item in groups"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>

            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">提交</el-button>


        </div>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {label_edit, label_info, label_group_list, label_group_all_list, label_group_info} from '@/api/getDatalabel'
    export default {
        data(){
            return {
                id:0,
                loading:false,
                name:'',
                groups: [],
                group_id:'',
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
                vm.get_label_group_list_all();
            } else {
                vm.get_label_group_list_all().then(vm.init);
            }

            })
        },
        methods: {

            init() {
                this.loading = false;
                this.name = '';
                this.group_id = '';
            },
            get_info() {
                label_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.name = res.data.name;
                        this.group_id = res.data.group_id;
                        label_group_info({id:this.group_id}).then(function (res) {
                            if (res.code == this.$store.state.constant.status_success) {
                                if(res.data.deleted === '1') this.group_id = ''
                            } else {
                                this.$message({
                                    message: res.msg,
                                    type: 'warning'
                                });
                            }
                        }.bind(this))
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },
            get_label_group_list_all() {
                return label_group_all_list().then(function(res){
                    return new Promise(function(resolve,reject){
                        if (res.code == this.$store.state.constant.status_success) {
                            this.groups = res.data
                        }
                        resolve();
                    }.bind(this));

                }.bind(this));
            },
            submit: function () {
                if (!this.name) {
                    var error_msg = '请填写名称';
                }
                if (!this.group_id) {
                    var error_msg = '请选择组';
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
                    label_edit({id:this.id,name:this.name, group_id:this.group_id}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            this.$router.push({path:'label',query:{}});
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
