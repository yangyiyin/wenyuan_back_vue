<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <div style="margin-bottom: 10px">
                <el-select v-model="type" placeholder="类型">
                    <el-option
                            v-for="item in [{label:'全部',value:0},{label:'精品课',value:1},{label:'选班',value:2}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
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
                <el-input
                        style="display: inline-block;width: 250px;"
                        placeholder="课程名[属性]"
                        v-model="goods_title"
                        clearable>
                </el-input>
            </div>
            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="订单编号"
                    v-model="order_no"
                    clearable>
            </el-input>

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="手机号"
                    v-model="tel"
                    clearable>
            </el-input>
            <el-select v-model="status" placeholder="状态">
                <el-option
                        v-for="item in status_options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>

            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button  @click="dialogFormVisibleDaochu = true;">导出</el-button>
        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form v-if="props.row.type==1" label-position="left" inline class="demo-table-expand">
                            <el-form-item label="课程:" >
                                <span>{{ props.row.goods_title }}</span>
                            </el-form-item>
                            <el-form-item label="授课老师:" >
                                <span>{{ props.row.order_sub.goods.teacher }}</span>
                            </el-form-item>
                            <el-form-item label="学生信息:" >
                                <template v-if="props.row.extra_data">
                                    <p>照片:  <img :src="props.row.extra_data.avatar" style="width: 50px;height: 50px;border-radius: 50px;"></p>
                                    <p>姓名:{{ props.row.extra_data.name }}</p>
                                    <p>学校:{{ props.row.extra_data.school }}</p>
                                    <p>年级:{{ props.row.extra_data.grade }}</p>
                                </template>
                            </el-form-item>
                            <el-form-item label="用户备注:" >

                                {{ props.row.remark }}
                            </el-form-item>
                            <el-form-item label="后台备注:" >

                                {{ props.row.remark_back }}
                            </el-form-item>
                            <el-form-item v-if="props.row.course_arrange_test" style="width: 100%" label="试听课:" >

                                上课时间：{{ props.row.course_arrange_test.time }}；上课地点：{{ props.row.course_arrange_test.place }}；上课老师：{{ props.row.course_arrange_test.teacher }}教学顾问：{{ props.row.course_arrange_test.adviser }}；备注：{{ props.row.course_arrange_test.remark }}

                                <el-button type="warning" size="mini" @click="dialogFormVisibleCourseArrangeTest=true;current=props.row;course_arrange_info.test=props.row.course_arrange_test">编辑</el-button>
                                <el-button type="warning" size="mini" @click="del_arrange(props.row.course_arrange_test.id,1,props.row)">删除</el-button>
                            </el-form-item>
                            <el-form-item  v-if="props.row.course_arrange_official" style="width: 100%"label="正式上课:" >

                                上课地点：{{ props.row.course_arrange_official.place }}；上课规律：{{ props.row.course_arrange_official.arrange }}；预期结束：{{ props.row.course_arrange_official.end_time }}；上课老师：{{ props.row.course_arrange_official.teacher }}教学顾问：{{ props.row.course_arrange_official.adviser }}；备注：{{ props.row.course_arrange_official.remark }}
                                <el-button type="warning" size="mini" @click="dialogFormVisibleCourseArrange=true;current=props.row;course_arrange_info.official=props.row.course_arrange_official">编辑</el-button>
                                <el-button type="warning" size="mini" @click="del_arrange(props.row.course_arrange_official.id,2,props.row)">删除</el-button>

                            </el-form-item>
                            <el-button type="warning" v-if="(props.row.status==2||props.row.status==3 ||props.row.status==4) && props.row.order_sub.goods.type==2 && !props.row.course_arrange_test" size="mini" @click="dialogFormVisibleCourseArrangeTest=true;current=props.row;course_arrange_info.test={time:'',place:'',teacher:'',adviser:'',remark:''}">设置试听课</el-button>
                            <el-button type="warning" v-if="(props.row.status==2||props.row.status==3 ||props.row.status==4) && props.row.order_sub.goods.type==2 && !props.row.course_arrange_official" size="mini" @click="dialogFormVisibleCourseArrange=true;current=props.row;course_arrange_info.official={arrange:'',teacher:'',adviser:'',remark:''}">设置正式上课</el-button>

                        </el-form>
                        <el-form v-if="props.row.type==2" label-position="left" inline class="demo-table-expand">
                            <el-form-item label="课程:" >
                                <span>{{ props.row.goods_title }}</span>
                            </el-form-item>
                            <template v-if="props.row.member_info.is_new == 1">
                                <el-form-item label="学生:" >
                                    {{ props.row.member_info.content.student.name }}
                                </el-form-item>
                                <el-form-item label="头像:" >
                                    <img :src="props.row.member_info.content.student.avatar" style="width: 50px;height: 50px;border-radius: 50px;">
                                </el-form-item>
                                <el-form-item label="是否新生:" >
                                    是
                                </el-form-item>
                                <el-form-item label="性别:" >
                                    {{ props.row.member_info.content.student.sex == 1?'男':'女' }}
                                </el-form-item>
                                <el-form-item label="备用电话:" >
                                    {{ props.row.member_info.content.student.tel2 }}
                                </el-form-item>
                                <el-form-item label="原学校:" >
                                    {{ props.row.member_info.content.student.school }}
                                </el-form-item>
                                <el-form-item label="原年级:" >
                                    {{ props.row.member_info.content.student.grade }}
                                </el-form-item>
                                <el-form-item label="原班级:" >
                                    {{ props.row.member_info.content.student.class }}
                                </el-form-item>
                                <el-form-item label="备注:" >
                                    {{ props.row.member_info.content.student.remark }}
                                </el-form-item>
                            </template>
                            <template v-else>
                                <el-form-item label="学生:" >
                                    {{ props.row.member_info.content.student.student_info.name }}
                                </el-form-item>
                                <el-form-item label="头像:" >
                                    <img :src="props.row.member_info.content.student.student_info.avatar" style="width: 50px;height: 50px;border-radius: 50px;">
                                </el-form-item>
                                <el-form-item label="学号:" >
                                    {{ props.row.member_info.content.student.student_info.studentid }}
                                </el-form-item>
                                <el-form-item label="是否新生:" >
                                    否
                                </el-form-item>
                            </template>
                        </el-form>
                    </template>
                </el-table-column>


                <el-table-column label="订单编号" prop="order_no"></el-table-column>
                <el-table-column label="课程" prop="goods_title_short"></el-table-column>
                <el-table-column label="手机号" prop="tel"></el-table-column>
                <el-table-column label="价格">
                    <template slot-scope="scope">
                        {{scope.row.price}}
                        <el-button v-if="scope.row.status==1||scope.row.status==2" size="mini" type='warning' @click="dialogFormVisibleEditPrice=true;current=scope.row" >修改价格</el-button>

                    </template>
                </el-table-column>
                <el-table-column label="已付金额" prop="payed_money"></el-table-column>
                <el-table-column label="支付单号" prop="pay_no"></el-table-column>
                <el-table-column label="状态" width="140">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status==1" >{{scope.row.status_desc}}</el-tag>
                        <el-tag v-else-if="scope.row.status==2">{{scope.row.status_desc}}</el-tag>
                        <el-tag v-else-if="scope.row.status==3" >{{scope.row.status_desc}}</el-tag>
                        <el-tag v-else-if="scope.row.status==4" type="success">{{scope.row.status_desc}}</el-tag>
                        <el-tag v-else-if="scope.row.status==8" type="success">{{scope.row.status_desc}}</el-tag>
                        <el-tag v-else-if="scope.row.status==11" type="success">{{scope.row.status_desc}}</el-tag>
                        <el-tag v-else type="danger">{{scope.row.status_desc}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="学生姓名">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type==1">{{scope.row.extra_data.name}}</span>
                        <span v-if="scope.row.type==2">{{scope.row.member_info.student_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="用户备注" prop="remark_less"></el-table-column>

                <el-table-column label="创建日期" prop="create_time" width="180"></el-table-column>

                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button v-if="(scope.row.status==1||scope.row.status==2) && scope.row.type==1" size="mini" @click="cancel_force(scope)" :loading="loadingBtn == scope.$index">取消订单</el-button>
                        <el-button v-if="(scope.row.status==1||scope.row.status==2) && scope.row.type==2" size="mini" @click="cancel_force_sign_course(scope)" :loading="loadingBtn == scope.$index">取消订单</el-button>
                        <el-button type="warning" v-if="(scope.row.status==2||scope.row.status==3 ||scope.row.status==4) && scope.row.price_type==1 && scope.row.type==1 && parseInt(scope.row.payed_money) < parseInt(scope.row.price)" size="mini" @click="pay_left_money(scope)" :loading="loadingBtn == scope.$index">补缴余款</el-button>
                        <el-button v-if="scope.row.status==1||scope.row.status==2" size="mini" type='warning' @click="dialogFormVisibleRemark=true;current=scope.row" >备注</el-button>
                        <el-button v-if="(scope.row.status!=8&&scope.row.status!=11)&&scope.row.type==2" size="mini" type='warning' @click="complete_order(scope)" >人工处理完成</el-button>
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
        <!--<el-dialog title="修改排序" :visible.sync="dialogFormVisible" width="30%">-->
            <!--<el-form :model="current">-->
                <!--<el-form-item label="排序值(越大越靠前)">-->
                    <!--<el-input v-model="current.sort" auto-complete="off"></el-input>-->
                <!--</el-form-item>-->
            <!--</el-form>-->
            <!--<div slot="footer" class="dialog-footer">-->
                <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
                <!--<el-button type="primary" @click="sort">确 定</el-button>-->
            <!--</div>-->
        <!--</el-dialog>-->

        <el-dialog title="导出" :visible.sync="dialogFormVisibleDaochu" width="30%">
            <p>
                您即将导出订单数据,条件为:[时间:{{start_time?start_time:'无限制'}}至{{end_time?end_time:'无限制'}}][课程:{{goods_title?goods_title:'无限制'}}][订单编号:{{order_no?order_no:'无限制'}}][手机号:{{tel?tel:'无限制'}}][状态:{{status}}]。
            </p>
            <p>
                特别说明:如果报名数据比较多,则导出速度会相应的慢一些哦~
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDaochu = false">取 消</el-button>
                <el-button type="primary" @click="daochu" :loading="loadingBtn == 'daochu'">开始导出</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="'修改订单价格-'+current.order_no" :visible.sync="dialogFormVisibleEditPrice" width="50%">

            <div class="search_item">

                <el-input clearable placeholder="价格" v-model="current.price" style="width: 450px">
                    <template slot="prepend">价格</template>
                </el-input>
            </div>
            <div class="search_item">

                <el-input clearable placeholder="备注" v-model="current.remark_back" style="width: 450px">
                    <template slot="prepend">备注</template>
                </el-input>

            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleEditPrice = false">取 消</el-button>
                <el-button type="primary" @click="edit_info(current)">确认</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="'备注-'+current.order_no" :visible.sync="dialogFormVisibleRemark" width="50%">

            <div class="search_item">

                <el-input clearable placeholder="备注" v-model="current.remark_back" style="width: 450px">
                    <template slot="prepend">备注</template>
                </el-input>

            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleRemark = false">取 消</el-button>
                <el-button type="primary" @click="edit_info(current)">确认</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="'试听课-'+current.extra_data.name" :visible.sync="dialogFormVisibleCourseArrangeTest" width="50%">

            <div class="search_item">

                <el-input clearable placeholder="试听课时间" v-model="course_arrange_info.test.time" style="width: 450px">
                    <template slot="prepend">试听课时间</template>
                </el-input>
            </div>
            <div class="search_item">

                <el-input clearable placeholder="试听课地点" v-model="course_arrange_info.test.place" style="width: 450px">
                    <template slot="prepend">试听课地点</template>
                </el-input>
            </div>
            <div class="search_item">
                <el-input clearable placeholder="上课老师" v-model="course_arrange_info.test.teacher" style="width: 450px">
                    <template slot="prepend">上课老师</template>
                </el-input>
            </div>
            <div class="search_item">
                <el-input clearable placeholder="教学顾问" v-model="course_arrange_info.test.adviser" style="width: 450px">
                    <template slot="prepend">教学顾问</template>
                </el-input>
            </div>
            <div class="search_item">
                <el-input clearable placeholder="备注" v-model="course_arrange_info.test.remark" style="width: 450px">
                    <template slot="prepend">备注</template>
                </el-input>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleCourseArrangeTest = false">取 消</el-button>
                <el-button type="primary" @click="course_arrange_test(current)" :loading="loadingBtn == 'course_arrange_test'">确认</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="'正式上课规律-'+current.extra_data.name" :visible.sync="dialogFormVisibleCourseArrange" width="50%">


            <div class="search_item">

                <el-input clearable placeholder="上课地点" v-model="course_arrange_info.official.place" style="width: 450px">
                    <template slot="prepend">上课地点</template>
                </el-input>
            </div>
            <div class="search_item">

                <el-input clearable placeholder="上课规律" v-model="course_arrange_info.official.arrange" style="width: 450px">
                    <template slot="prepend">上课规律</template>
                </el-input>

            </div>
            <div class="search_item">

                <el-input clearable placeholder="预期结束时间" v-model="course_arrange_info.official.end_time" style="width: 450px">
                    <template slot="prepend">预期结束时间</template>
                </el-input>
            </div>
            <div class="search_item">

                <el-input clearable placeholder="上课老师" v-model="course_arrange_info.official.teacher" style="width: 450px">
                    <template slot="prepend">上课老师</template>
                </el-input>

            </div>

            <div class="search_item">

                <el-input clearable placeholder="教学顾问" v-model="course_arrange_info.official.adviser" style="width: 450px">
                    <template slot="prepend">教学顾问</template>
                </el-input>

            </div>
            <div class="search_item">

                <el-input clearable placeholder="备注" v-model="course_arrange_info.official.remark" style="width: 450px">
                    <template slot="prepend">备注</template>
                </el-input>

            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleCourseArrange = false">取 消</el-button>
                <el-button type="primary" @click="course_arrange(current)" :loading="loadingBtn == 'course_arrange'">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {order_list,cancel_order_force,cancel_order_force_sign_course,complete_order,pay_left_money,course_arrange,course_arrange_del,order_edit_info} from '@/api/getDataEarth'
    import {getStore} from '@/config/mUtils'
    export default {
        data(){
            return {
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                dialogFormVisible:false,
                dialogFormVisibleDaochu:false,
                dialogFormVisibleCourseArrangeTest:false,
                dialogFormVisibleCourseArrange:false,
                dialogFormVisibleEditPrice:false,
                dialogFormVisibleRemark:false,
                current:{extra_data:{}},
//                remark:'',
//                choose_categories:[],
//                categories:[],
                tel:'',
                order_no:'',
                goods_title:'',
                type:0,
                status:-1,
                start_time:'',
                end_time:'',
                status_options:[
                    {label:'全部',value:-1},
                    {label:'待付款',value:1},
                    {label:'已付款,待签到',value:2},
                    {label:'已完成,待评价',value:3},
                    {label:'已完成',value:4},
                    {label:'已关闭',value:9},
                    {label:'新生报名失败',value:5},
                    {label:'新生报名成功,但报班失败',value:6},
                    {label:'报班失败',value:7},
                    {label:'报班成功',value:8},
                    {label:'报班成功（人工）',value:11},
                ],
                course_arrange_info:{
                    test:{
                        time:'',
                        place:'',
                        teacher:'',
                        adviser:'',
                        remark:'',
                    },
                    official:{
                        arrange:'',
                        teacher:'',
                        adviser:'',
                        remark:'',
                    }
                },
                loadingBtn:-1
            }
        },
        components: {
            headTop,
        },
        created(){
            this.list();
        },
        mounted(){

        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.list();
        })
        },
        methods: {
            list() {
                order_list({page:this.currentPage,page_size:this.limit,tel:this.tel,order_no:this.order_no,goods_title:this.goods_title,status:this.status,start_time:this.start_time,end_time:this.end_time,type:this.type}).then(function(res){
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
            handleEdit(row){
                this.dialogFormVisible = true;
                if (row) {
                    this.current_entity = row;
                } else {
                    this.current_entity = {};
                }

            },
            search() {
                this.currentPage = 1;
                this.list();
            },
//            goto_edit_goods(id) {
//                this.$router.push({path:'add_goods',query:{id:id}});
//            },
//            goto_order(id) {
//                this.$router.push({path:'order',query:{id:id}});
//            },
            complete_order(scope) {

                this.$confirm('确认此操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    var item = scope.row;
                    this.loadingBtn = scope.$index;
                    complete_order({id:item.id}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            item.status = 11;
                            item.status_desc = '报班成功（人工）';
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
                    }.bind(this)).finally(function(){
                        this.loadingBtn = -1;
                    }.bind(this));
                }.bind(this));



            },
            cancel_force(scope) {

                this.$confirm('确认此操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    var item = scope.row;
                    this.loadingBtn = scope.$index;
                    cancel_order_force({id:item.id}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            item.status = 9;
                            item.status_desc = '已关闭';
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
                    }.bind(this)).finally(function(){
                        this.loadingBtn = -1;
                    }.bind(this));
                }.bind(this));



            },
            cancel_force_sign_course(scope) {

                this.$confirm('确认此操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    var item = scope.row;
                    this.loadingBtn = scope.$index;
                    cancel_order_force_sign_course({id:item.id}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            item.status = 9;
                            item.status_desc = '已关闭';
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
                    }.bind(this)).finally(function(){
                        this.loadingBtn = -1;
                    }.bind(this));
                }.bind(this));
            },

            pay_left_money(scope) {

                this.$confirm('补缴余款金额:¥'+(scope.row.price - scope.row.payed_money)+',确认此操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    var item = scope.row;
                    this.loadingBtn = scope.$index;
                    pay_left_money({id:item.id}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {

                            this.list();
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
                    }.bind(this)).finally(function(){
                        this.loadingBtn = -1;
                    }.bind(this));
                }.bind(this));



            },
            daochu() {
                window.open(this.$store.state.constant.order_excel_out + '?tel='+this.tel+'&order_no=' + this.order_no+'&goods_title=' + this.goods_title+'&status=' + this.status+'&start_time=' + this.start_time+'&end_time=' + this.end_time+'&token=' + (getStore('token') ? getStore('token') : ''));
            },
//            del(item, index) {
//
//                this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
//                    confirmButtonText: '确定',
//                    cancelButtonText: '取消',
//                    type: 'warning'
//                }).then(function(){
//                    goods_del({id:item.id}).then(function(res){
//                        if (res.code == this.$store.state.constant.status_success) {
//                            this.tableData.splice(index,1);
//                            this.count --;
//                            this.$message({
//                                type: 'success',
//                                message: '操作成功'
//                            });
//                        } else {
//                            this.$message({
//                                type: 'warning',
//                                message: res.msg
//                            });
//                        }
//                    }.bind(this));
//                }.bind(this))
//
//            },
//            handleSort(row){
//                this.dialogFormVisible = true;
//                this.current = row;
//            },
            course_arrange_test(row) {
                course_arrange({
                    order_id:this.current.id,
                    type:1,
                   data:this.course_arrange_info.test

               }).then(function(res){
                   if (res.code == this.$store.state.constant.status_success) {
                       this.dialogFormVisibleCourseArrangeTest = false;
                       row.course_arrange_test = this.course_arrange_info.test;
                       this.$message({
                           type: 'success',
                           message: '操作成功'
                       });
                   } else {
                       this.$message({
                           showClose: true,
                           message: res.msg,
                           type: 'warning'
                       });
                   }
               }.bind(this));
               this.dialogFormVisibleCourseArrangeTest = false;
           },
            course_arrange(row) {
                course_arrange({
                    order_id:this.current.id,
                    type:2,
                    data:this.course_arrange_info.official

                }).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.dialogFormVisibleCourseArrange = false;
                        row.course_arrange_official = this.course_arrange_info.official;
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'warning'
                        });
                    }
                }.bind(this));
                this.dialogFormVisibleCourseArrange = false;
            },
            del_arrange(id,type,row){
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    if (type == 1) {
                        row.course_arrange_test = '';
                    } else if (type == 2) {
                        row.course_arrange_official = '';
                    }
                    course_arrange_del({id:id}).then(function(res){
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
                    }.bind(this));
                }.bind(this));

            },
            edit_info(current_order){
                order_edit_info({id:current_order.id,price:current_order.price,remark_back:current_order.remark_back}).then(function(res){
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
    .search_item{

        margin-top: 10px;

    }
</style>
