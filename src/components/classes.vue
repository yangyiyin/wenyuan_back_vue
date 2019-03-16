<template>
    <div style="text-align: left">

        <div class="table_container" style="padding-bottom: 0">

            <el-select v-model="courseid" placeholder="课程">
                <el-option
                        v-for="item in courses"
                        :key="item.courseid"
                        :label="item.coursename"
                        :value="item.courseid">
                </el-option>
            </el-select>

            <el-autocomplete
                    v-model="classname"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入班级名称"
                    @select="handleSelect"
                    clearable="true"
                    style="width: 250px;"
            ></el-autocomplete>

            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
        <div class="table_container">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    @selection-change="handleSelectionChange"
                    style="width: 100%">

                <el-table-column label="班级" prop="classname"></el-table-column>
                <!--<el-table-column label="类型" prop="type_desc"></el-table-column>-->
                <!--<el-table-column label="题干" prop="title_short"></el-table-column>-->
                <!--&lt;!&ndash;<el-table-column label="简介" prop="desc_pre"></el-table-column>&ndash;&gt;-->
                <!--<el-table-column label="创建时间" prop="create_time"></el-table-column>-->
                <!--<el-table-column label="评语" width="300">-->
                <!--<template slot-scope="scope">-->
                <!--<el-button size="mini" @click="handleDaoru(scope.row)">导入</el-button>-->
                <!--<el-button size="mini" @click="handleDaochu(scope.row)">导出</el-button>-->
                <!--<el-button size="mini"  type="primary" @click="goto_words_content(scope.row.id)">查看</el-button>-->

                <!--</template>-->
                <!--</el-table-column>-->

                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
            </el-table>
            <!--<div class="Pagination" style="text-align: left;margin-top: 10px;">-->
                <!--<el-pagination-->
                        <!--@current-change="handleCurrentChange"-->
                        <!--:current-page="currentPage"-->
                        <!--:page-size="limit"-->
                        <!--layout="total, prev, pager, next"-->
                        <!--:total="count"-->
                        <!--background>-->
                <!--</el-pagination>-->
            <!--</div>-->
        </div>

    </div>

</template>

<script>
    import {course_list, class_list} from '@/api/getDataEarth'
    import {deepCopy} from '@/config/mUtils'
    export default {
        props: ['checked'],
        data(){
            return {
                id:0,
                tableData: [],
                limit: 1000,
                count: 0,
                currentPage: 1,
                courseid:'',
                courses:[],
                classname:'',
                classinfo:{
                    value:''
                },

                dialogFormVisible:false,
                dialogFormVisibleDaoru:false,
                dialogFormVisibleDaochu:false,

                current:{},
                loadingBtn:-1,
                multipleSelection:[],
                multipleSelectionAll:[]

            }
        },
        components: {

        },
        created(){
            this.multipleSelectionAll = this.checked;
            this.course_list();
        },
        mounted(){

        },
        methods: {
            course_list() {
                course_list({}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.courses = res.data;

                    }
                }.bind(this));

            },
            list() {
                class_list({courseid:this.courseid,name:this.classname}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.tableData = res.data;
                        setTimeout(()=>{
                            this.toggleSelection();
                        })
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                        this.tableData = [];
                        setTimeout(()=>{
                            this.toggleSelection();
                    })
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
            handleSelectionChange(val) {
//                this.multipleSelection = val;
                setTimeout(()=>{
                    //全部删除
                    this.tableData.forEach(row1 => {
                        this.multipleSelectionAll.forEach((row, index) => {

                            if (row1.classid == row.classid){
                                this.multipleSelectionAll.splice(index, 1);
                                return;
                            }
                        })

                    });


                    val.forEach((row, index) => {

                        this.multipleSelectionAll.push(row);
                    })


                    //发送事件
                    this.$emit('SelectionChange', this.multipleSelectionAll);
                })

            },
            toggleSelection() {
                if (this.multipleSelectionAll) {

                    this.tableData.forEach(row1 => {

                        this.multipleSelectionAll.forEach(row => {

                        if (row1.classid == row.classid){
                                this.$refs.multipleTable.toggleRowSelection(row1);
                             return;
                            }
                        })

                    });
                }
            },

            querySearchAsync(queryString, cb) {
                this.classinfo = {};
                var results = [];
                class_list({name:queryString}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        results = res.data;
                        results.forEach(function(val){
                            val.value = val.classname
                        });
                        cb(results);
                    } else {
                        cb([]);
                    }
                }.bind(this));


            },
            handleSelect(item) {
                this.classinfo = item;
            },


        },

    }
</script>

<style lang="less" scoped>
	@import '../style/mixin';

</style>
