<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="内容"
                    v-model="content"
                    clearable>
            </el-input>
            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="家长手机号"
                    v-model="user_tel"
                    clearable>
            </el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button style="float: right" type="primary" size="mini" @click="handleDaochu()">导出</el-button>
        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <!--<el-table-column label="图片">-->
                    <!--<template slot-scope="scope">-->
                        <!--<img :src="scope.row.img" width="60" height="30"/>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="内容" >
                                <span>{{ props.row.content}}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>

                <el-table-column label="家长手机号" prop="user_tel"></el-table-column>
                <el-table-column label="内容" prop="content_pre"></el-table-column>
                <el-table-column label="反馈时间" prop="create_time"></el-table-column>
                <el-table-column label="学员" prop="bind_students"></el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="scope">
                    <span>{{scope.row.remark}}</span>
                        <el-button  size="mini" type='warning' @click="dialogFormVisibleRemark=true;current=scope.row" >备注</el-button>
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
        <el-dialog title="导出" :visible.sync="dialogFormVisibleDaochu" width="30%">
            <p>
                您即将导出家长反馈数据
            </p>
            <p>
                特别说明:如果报名数据比较多,则导出速度会相应的慢一些哦~
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDaochu = false">取 消</el-button>
                <el-button type="primary" @click="daochu" :loading="loadingBtn == 'daochu'">开始导出</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="'反馈备注-'+current.bind_students" :visible.sync="dialogFormVisibleRemark" width="50%">

            <div class="search_item">

                <el-input clearable placeholder="备注" v-model="current.remark" style="width: 450px">
                    <template slot="prepend">备注</template>
                </el-input>

            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleRemark = false">取 消</el-button>
                <el-button type="primary" @click="remark(current)">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {suggest_list,suggest_excel_out,suggest_edit_info} from '@/api/getDataEarth'
    import {getStore} from '@/config/mUtils'
    export default {
        data(){
            return {
                id:0,
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                dialogFormVisible:false,
                dialogFormVisibleDaochu:false,
                dialogFormVisibleRemark:false,
                current:{},
//                remark:'',
//                choose_categories:[],
//                categories:[],
                content:'',
                user_tel:'',
                loadingBtn:-1
            }
        },
        components: {
            headTop,
        },
        created(){
            //this.list();
        },
        mounted(){

        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.id = to.query.id ? to.query.id : 0;
                vm.list();
        })
        },
        methods: {
            list() {
                suggest_list({id:this.id,page:this.currentPage,page_size:this.limit,content:this.content,user_tel:this.user_tel}).then(function(res){
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
            search() {
                this.currentPage = 1;
                this.list();
            },
            handleDaochu(){
                this.dialogFormVisibleDaochu = true;
            },
            daochu() {
                this.loadingBtn = 'daochu';
                suggest_excel_out({
                    is_ajax:true
                }).then(function(res){
                    this.loadingBtn = '-1';
                    if (res.code == this.$store.state.constant.status_success) {
                        window.open(this.$store.state.constant.suggest_excel_out + '?token=' + (getStore('token') ? getStore('token') : ''));
                        return;
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'warning'
                        });
                        return;
                    }
                    this.dialogFormVisibleDaochu = false;
                }.bind(this));
            },
            remark(current){
                suggest_edit_info({id:current.id,remark:current.remark}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.dialogFormVisibleRemark = false;
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
