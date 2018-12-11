<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="学生姓名"
                    v-model="student_name"
                    clearable>
            </el-input>
            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="家长手机号"
                    v-model="parent_tel"
                    clearable>
            </el-input>
            <el-date-picker
                    v-model="start_time"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="开始时间">
            </el-date-picker>

            <el-date-picker
                    v-model="end_time"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="结束时间">
            </el-date-picker>

            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>

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
                            <el-form-item label="家长手机1:" >
                                <span>{{ props.row.content.father_tel }}</span>
                            </el-form-item>
                            <el-form-item label="家长手机2:" >
                                <span>{{ props.row.content.mother_tel }}</span>
                            </el-form-item>
                            <el-form-item label="是否新生:" >
                                <span>{{ props.row.is_new == 1 ? '是':'否' }}</span>
                            </el-form-item>
                            <el-form-item label="结果备注:" >
                                <span>{{ props.row.content.remark }}</span>
                            </el-form-item>
                            <el-form-item label="照片:" >
                                <span><img style="width: 80px;" v-bind:src="props.row.content.avatar"/></span>
                            </el-form-item>
                            <el-form-item label="修改照片:" >

                                <el-button v-if="!props.row.can_edit_avatar || props.row.can_edit_avatar == 0" size="mini"  type="warning" @click="handleSetCanEditAvatar(props.row, 1)">设为允许</el-button>
                                <el-button v-if="props.row.can_edit_avatar && props.row.can_edit_avatar != 0" size="mini"  type="warning" @click="handleSetCanEditAvatar(props.row, 0)">设为不允许</el-button>
                            </el-form-item>
                            <el-form-item label="准考证:" >
                                <span><img style="width: 200px;" v-bind:src="props.row.ticket_url"/></span>
                            </el-form-item>

                            <el-form-item label="生成准考证:" >
                                <el-button size="mini"  type="warning" @click="handleGenTicket(props.row)">生成准考证</el-button>
                            </el-form-item>

                            <el-form-item label="数据信息:">
                                <span>{{ props.row.sign_data }}</span>
                                <el-button size="mini"  type="warning" @click="dialogFormVisibleData=true;current_data=props.row">修改</el-button>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="学生姓名" prop="student_name"></el-table-column>
                <el-table-column label="家长手机号" prop="parent_tel"></el-table-column>
                <el-table-column label="来源" prop="from"></el-table-column>
                <el-table-column label="报名时间" prop="create_time"></el-table-column>
                <el-table-column label="支付单号" prop="pay_no"></el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">

                        <el-button size="mini"   @click="del(scope.row, scope.$index)">删除</el-button>
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

        <el-dialog title="生成准考证" :visible.sync="dialogFormVisibleTicket" width="30%">
            <p>
                您即将为【{{current.student_name}}】生成准考证图片
            </p>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleTicket = false">取 消</el-button>
                <el-button type="primary" @click="genticket" :loading="loadingBtn == 'ticket'">开始生成</el-button>
            </div>
        </el-dialog>


        <el-dialog v-if="current_data.content" :title="'修改信息:'+current_data.student_name" :visible.sync="dialogFormVisibleData" width="50%">

            <div>
                <span>头像:</span>
                <el-input clearable placeholder="" v-model="current_data.content.avatar_origin" style="width: 80%;display: inline-block"></el-input>
            </div>

            <div>
                <span>年级:</span>
                <el-input clearable placeholder="" v-model="current_data.content.grade" style="width: 80%;display: inline-block"></el-input>
            </div>
            <div>
                <span>准考证号:</span>
                <el-input clearable placeholder="" v-model="current_data.content.ticket" style="width: 60%;display: inline-block"></el-input>
            </div>
            <div>
                <span>准考证姓名:</span>
                <el-input clearable placeholder="" v-model="current_data.content.name" style="width: 60%;display: inline-block"></el-input>
            </div>
            <div>
                <span>是否允许生成准考证:</span>
                <el-input clearable placeholder="是/否" v-model="current_data.content.can_gen_ticket" style="width: 60%;display: inline-block"></el-input>
            </div>
            <div>
                <span>一试考场:</span>
                <el-input clearable placeholder="" v-model="current_data.content.A1_place" style="width: 80%;display: inline-block"></el-input>
            </div>
            <div>
                <span>二试考场:</span>
                <el-input clearable placeholder="" v-model="current_data.content.A2_place" style="width: 80%;display: inline-block"></el-input>
            </div>
            <div>
                <span>录取班级:(仅超级管理员可改)</span>
                <el-input clearable placeholder="" v-model="current_data.content.remark_luqu" style="width: 60%;display: inline-block"></el-input>
            </div>


            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleData = false">取 消</el-button>
                <el-button type="primary" @click="change_data()" :loading="loadingBtn == 'data'">修改</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {examination_signs_list,examination_gen_ticket,setCanEditAvatar,examination_sign_del,examination_signs_change_data} from '@/api/getDataEarth'
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
                dialogFormVisibleDaoru:false,
                dialogFormVisibleDaochu:false,
                dialogFormVisibleTicket:false,
                current:{},
                current_data:{},
                dialogFormVisibleData:false,
//                remark:'',
//                choose_categories:[],
//                categories:[],
                student_name:'',
                parent_tel:'',
                start_time:'',
                end_time:'',
                loadingBtn:-1,
                upload_url:this.$store.state.constant.examination_daoru_excel_url,
                upload_data:{token:getStore('token') ? getStore('token') : ''}
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
                examination_signs_list({id:this.id,page:this.currentPage,page_size:this.limit,student_name:this.student_name,parent_tel:this.parent_tel,start_time:this.start_time,end_time:this.end_time}).then(function(res){
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
            handleGenTicket(row){
                this.dialogFormVisibleTicket = true;
                this.current = row;
            },
            handleSetCanEditAvatar(row, can_edit) {
                this.$confirm('此操作将让用户拥有是否可重新设置自己考试照片的权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    setCanEditAvatar({id:row.id, can_edit:can_edit}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            row.can_edit_avatar = can_edit;
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

            genticket(){
                this.loadingBtn = 'ticket';
                examination_gen_ticket({
                    sign_id:this.current.id
                }).then(function(res){
                    this.loadingBtn = '-1';
                    if (res.code == this.$store.state.constant.status_success) {
                        this.dialogFormVisibleTicket = false;
                        this.$message({
                            type: 'success',
                            message: '生成成功'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'warning'
                        });
                        return;
                    }
                    this.dialogFormVisibleTicket = false;
                }.bind(this));
            },
            del(item, index) {

                this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    examination_sign_del({id:item.id}).then(function(res){
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
            change_data(){
                this.loadingBtn = 'data';
                examination_signs_change_data({
                    id:this.current_data.id,
                    avatar_origin:this.current_data.content.avatar_origin,
                    grade:this.current_data.content.grade,
                    remark_luqu:this.current_data.content.remark_luqu,
                    can_gen_ticket:this.current_data.content.can_gen_ticket,
                    ticket:this.current_data.content.ticket,
                    name:this.current_data.content.name,
                    A1_place:this.current_data.content.A1_place,
                    A2_place:this.current_data.content.A2_place,
                }).then(function(res){
                    this.loadingBtn = '-1';
                    if (res.code == this.$store.state.constant.status_success) {
                        this.list();
                        this.$message({
                            type: 'success',
                            message: '修改成功'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'warning'
                        });
                        return;
                    }
                    this.dialogFormVisibleData = false;
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
