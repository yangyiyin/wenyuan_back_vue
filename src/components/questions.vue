<template>
    <div style="text-align: left">

        <div class="table_container" style="padding-bottom: 0">

            <el-select v-model="entity" placeholder="科目">
                <el-option
                        v-for="item in [{label:'全部',value:0},{label:'语文',value:1},{label:'数学',value:2},{label:'英语',value:3}]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>

            <el-select v-model="type" placeholder="类型">
                <el-option
                        v-for="item in [{label:'全部',value:0},{label:'单选题',value:1},{label:'判断题',value:2},{label:'填空题',value:3},{label:'简答题',value:4}]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="题干关键词"
                    v-model="title"
                    clearable>
            </el-input>


            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </div>
        <div class="table_container">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    @selection-change="handleSelectionChange"
                    style="width: 100%">

                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="题干" style="width: 100%">
                                <span>{{ props.row.title}}</span>
                            </el-form-item>
                        </el-form>
                        <el-form v-if="props.row.type==1" label-position="left" inline class="demo-table-expand">
                            <el-form-item label="答案选项" style="width: 100%">
                                <template v-for="(item, index) in props.row.question_answer.answer_options">
                                    <p style="display: inline-block;margin-left: 20px;"><el-tag size="mini">{{item.label}}:</el-tag>{{item.text}}</p>
                                </template>

                            </el-form-item>
                        </el-form>
                        <el-form v-if="props.row.type==2" label-position="left" inline class="demo-table-expand">
                            <el-form-item label="答案选项" style="width: 100%">
                                <template v-for="(item, index) in props.row.question_answer.answer_options">
                                    <p style="display: inline-block;margin-left: 20px;"><el-tag size="mini">{{item.label}}:</el-tag>{{item.text}}</p>
                                </template>
                            </el-form-item>
                        </el-form>
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="答案" v-if="props.row.type != 3">
                                <p >{{ props.row.question_answer.answer}}</p>
                            </el-form-item>
                            <el-form-item label="答案" v-if="props.row.type == 3">
                                <template v-for="(item, index) in props.row.question_answer.answer">
                                    <p style="display: inline-block;margin-left: 20px;"><el-tag size="mini">{{index+1}}处:</el-tag>{{item.text}}</p>
                                </template>
                            </el-form-item>
                            <el-form-item label="答案解析" >
                                <span v-html="props.row.question_answer.answer_parse">{{ props.row.question_answer.answer_parse}}</span>
                            </el-form-item>
                        </el-form>

                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="分值" >
                                <span>{{ props.row.score}}</span>
                            </el-form-item>
                            <el-form-item label="难度" >
                                <span>{{ props.row.hard_level}}</span>
                            </el-form-item>
                        </el-form>
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="绝密性" >
                                <el-tag size="mini" v-for="name in props.row.question_useway_names">{{ name}}</el-tag>
                            </el-form-item>
                            <el-form-item label="年级" >
                                <span>{{ props.row.grade}}</span>
                            </el-form-item>
                        </el-form>
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="知识点" >
                                <el-tag size="mini" v-for="name in props.row.question_knowledge_point_names">{{ name}}</el-tag>
                            </el-form-item>
                            <el-form-item label="标签" >
                                <el-tag size="mini" v-for="name in props.row.question_label_names">{{ name}}</el-tag>
                            </el-form-item>
                        </el-form>
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="录入者" >
                                <span>{{ props.row.inputer}}</span>
                            </el-form-item>
                            <el-form-item label="年份" >
                                <span>{{ props.row.year}}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>

                <el-table-column label="科目" prop="entity_desc"></el-table-column>
                <el-table-column label="类型" prop="type_desc"></el-table-column>
                <el-table-column label="题干" prop="title_short"></el-table-column>
                <el-table-column label="分值" prop="score"></el-table-column>
                <!--<el-table-column label="简介" prop="desc_pre"></el-table-column>-->
                <el-table-column label="创建时间" prop="create_time"></el-table-column>
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

    </div>

</template>

<script>
    import {question_list} from '@/api/getDataEarth'
    import {deepCopy} from '@/config/mUtils'
    export default {
        props: ['checked'],
        data(){
            return {
                id:0,
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                entity:0,
                type:0,
                tag:'',
                title:'',

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
            this.list();
        },
        mounted(){

        },
        methods: {
            list() {
                question_list({id:this.id,page:this.currentPage,page_size:this.limit,entity:this.entity,title:this.title,type:this.type,tag:this.tag}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.tableData = res.data.list;
                        this.count = parseInt(res.data.count);
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

                            if (row1.id == row.id){
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

                        if (row1.id == row.id){
                                this.$refs.multipleTable.toggleRowSelection(row1);
                             return;
                            }
                        })

                    });
                }
            }
        }

    }
</script>

<style lang="less" scoped>
	@import '../style/mixin';

</style>
