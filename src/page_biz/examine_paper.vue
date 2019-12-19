<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="标题"
                    v-model="name"
                    clearable>
            </el-input>

            <el-select v-model="grade" placeholder="年级" clearable >
                <el-option
                        v-for="item in grades"
                        :key="item.value"
                        :label="item.label"
                        :value="item">
                </el-option>
            </el-select>

            <el-select v-model="entity" placeholder="科目" clearable >
                <el-option
                        v-for="item in [{label:'语文',value:1},{label:'数学',value:2},{label:'英语',value:3}]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>


            <el-select v-model="useway_ids" placeholder="绝密等级" multiple clearable>
                <el-option
                        v-for="item in [{label:'等级一',value:1},{label:'等级二',value:2},{label:'等级三',value:3},{label:'等级四',value:4}]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>

            <el-input
                    style="display: inline-block;width: 100px;"
                    type="number"
                    placeholder="难度"
                    v-model="hard_level"
                    clearable>
            </el-input>

            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button style="float: right" type="primary" @click="goto_edit_examine_paper(0)">新增试卷</el-button>

        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="标题" >
                                <span>{{ props.row.title }}</span>
                            </el-form-item>
                            <el-form-item label="考试时间" >
                                <span>{{ props.row.time_limit_min }}</span>
                            </el-form-item>
                            <el-form-item label="总分" >
                                <span>{{ props.row.total_score }}</span>
                            </el-form-item>
                            <el-form-item label="备注" >
                                <span>{{ props.row.remark }}</span>
                            </el-form-item>
                            <el-form-item label="录入者" >
                                <span v-for="(author,index) in props.row.inputer">{{ author.show_name }};</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>

                <!--<el-table-column label="id" prop="id"></el-table-column>-->
                <el-table-column label="标题" prop="title_short"></el-table-column>
                <el-table-column label="学科" prop="entity_desc"></el-table-column>
                <el-table-column label="年级" >
                    <template slot-scope="scope">
                        <span v-for="(grade, index) in scope.row.grade">{{grade.label}};</span>
                    </template>
                </el-table-column>
                <el-table-column label="难度" prop="hard_level"></el-table-column>
                <el-table-column label="绝密等级" >
                    <template slot-scope="scope">
                        <span v-for="(name, index) in scope.row.examine_paper_useway_names">{{name}};</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建日期" prop="create_time"></el-table-column>
                <el-table-column label="操作" width="400">
                    <template slot-scope="scope">
                        <el-button type="danger" v-if="!scope.row.questions.length" size="mini" @click="set_question(scope.row)">!添加题目</el-button>
                        <el-button v-if="scope.row.questions.length" size="mini" @click="set_question(scope.row)">设置题目</el-button>
                        <el-button v-if="scope.row.questions.length" size="mini" @click="pre_print(1,scope.row)">预览</el-button>
                        <el-button size="mini" @click="goto_edit_examine_paper(scope.row.id)">编辑</el-button>
                        <el-button size="mini" v-if="scope.row.status == 1" @click="verify(scope, 0)" :loading="loadingBtn == scope.$index">下架</el-button>
                        <el-button size="mini" v-if="scope.row.status == 0" @click="verify(scope, 1)" :loading="loadingBtn == scope.$index">上架</el-button>
                        <el-button size="mini" @click="del(scope.row, scope.$index)">删除</el-button>
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
        <el-dialog title="修改排序" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="current">
                <el-form-item label="排序值(越大越靠前)">
                    <el-input v-model="current.sort" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="sort">确 定</el-button>
            </div>
        </el-dialog>

        <!--<el-dialog title="预览" :visible.sync="dialogFormVisiblePreview" width="80%">-->
            <!--<div style="display: none">-->
                <!--<div id="preview" style="width: 794px;">-->
                    <!--<div class="question_block" style="height:1123px;" v-for="(aa,index) in count_test">-->
                        <!--<template v-for="(item,index) in current.questions">-->

                            <!--<div class="question_item">-->
                                <!--{{index+1}}.{{item.title}}-->
                            <!--</div>-->
                        <!--</template>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
            <!--<div class="question_block" style="height:1123px;width: 794px;margin: 0 auto;border: 1px solid #ddd; " >-->
                <!--<template v-for="(item,index) in current.questions">-->

                    <!--<div class="question_item">-->
                        <!--{{index+1}}.{{item.title}}-->
                    <!--</div>-->
                <!--</template>-->
            <!--</div>-->

            <!--<div slot="footer" class="dialog-footer">-->
                <!--<el-button type="primary" @click="print()">打 印</el-button>-->
                <!--<el-button @click="dialogFormVisiblePreview = false">关 闭</el-button>-->
            <!--</div>-->
        <!--</el-dialog>-->

        <!--<el-dialog title="预览" :visible.sync="dialogFormVisiblePreview" width="80%">-->

            <!--<div id="preview" class="question_block" style="width: 754px;padding:20px;margin: 0 auto;border: 1px solid #ddd;position: relative " >-->
                <!--&lt;!&ndash;<template v-for="(item,index) in current.questions">&ndash;&gt;-->

                <!--&lt;!&ndash;<div class="question_item">&ndash;&gt;-->
                <!--&lt;!&ndash;{{index+1}}.{{item.title}}&ndash;&gt;-->
                <!--&lt;!&ndash;</div>&ndash;&gt;-->
                <!--&lt;!&ndash;</template>&ndash;&gt;-->

                <!--<template v-if="preview_content.id">-->
                    <!--<p style="text-align: center;font-size: 20px;font-weight: bolder">{{preview_content.title}}</p>-->
                    <!--<p style="text-align: center;font-size: 12px;margin-bottom: 20px;">考试时间:{{preview_content.time_limit_min}}分钟</p>-->
                    <!--<div style="font-size: 14px;margin-bottom: 10px;" v-for="(_question, type, index2) in preview_content.questions_with_types">-->
                        <!--<p style="float: 16px;font-weight: bolder;margin-top:20px;">{{_question.name}}</p>-->

                        <!--<template v-for="(question, index) in _question.list">-->
                            <!--<div style="margin-top: 10px;">-->
                                <!--<div style="float: left;vertical-align:top;width: 20px;" v-html="'<p style=\'display:inline-block\'>'+(index+1)+'、</p>'"></div>-->
                                <!--<div style="float: right;vertical-align:top;width: 50px;" v-html="'<p style=\'display:inline-block\'>['+question.score+'分]</p>'"></div>-->
                                <!--<div style="float: left;vertical-align:top;width: 670px;" v-html="question.question_content"></div>-->
                                <!--<div style="clear: both"></div>-->
                                <!--<template v-if="question.type==1">-->
                                    <!--<div style="float: left;vertical-align:top;width: 300px;margin-top:5px;margin-left: 20px;" v-for="(option,index) in question.question_answer.answer_options">-->
                                        <!--{{option.label}}.{{option.text}}-->
                                    <!--</div>-->

                                <!--</template>-->

                                <!--<template v-if="question.type==2">-->
                                    <!--<div style="float: left;vertical-align:top;width: 300px;margin-top:5px;margin-left: 20px;" v-for="(option,index) in question.question_answer.answer_options2">-->
                                        <!--{{option.label}}.{{option.text}}-->
                                    <!--</div>-->

                                <!--</template>-->

                                <!--<template v-if="question.type==6">-->
                                    <!--<div style="" v-for="(option,index) in question.question_answer.sub_content">-->
                                        <!--<div style="margin-left: 20px;">-->
                                            <!--<p>({{index+1}}){{option.title}}</p>-->
                                            <!--<template v-if="option.type==1">-->
                                                <!--<div style="float: left;vertical-align:top;width: 300px;margin-top:5px;margin-left: 20px;" v-for="(option2,index2) in option.answer_options">-->
                                                    <!--{{option2.label}}.{{option2.text}}-->
                                                <!--</div>-->
                                                <!--<div style="clear: both"></div>-->
                                            <!--</template>-->
                                        <!--</div>-->
                                    <!--</div>-->

                                <!--</template>-->

                                <!--<div style="clear: both"></div>-->
                            <!--</div>-->
                        <!--</template>-->
                    <!--</div>-->

                <!--</template>-->
            <!--</div>-->

            <!--<div slot="footer" class="dialog-footer" style="position: fixed;bottom:20px;left:50%">-->
                <!--&lt;!&ndash;<el-button type="primary" @click="print()">打 印</el-button>&ndash;&gt;-->
                <!--<el-button @click="dialogFormVisiblePreview = false">关 闭</el-button>-->
            <!--</div>-->
        <!--</el-dialog>-->


        <div style="display: none">
            <div id="preview" style="width: 794px;height:1115px;position: relative">
                <template v-if="preview_content.id">
                    <p style="text-align: center;font-size: 20px;font-weight: bolder">{{preview_content.title}}</p>
                    <p style="text-align: center;font-size: 12px;margin-bottom: 20px;">考试时间:{{preview_content.time_limit_min}}分钟</p>
                    <div style="font-size: 14px;margin-bottom: 10px;" v-for="(_question, type, index2) in preview_content.questions_with_types">
                        <p style="float: 16px;font-weight: bolder;margin-top:20px;">{{_question.name}}</p>

                        <template v-for="(question, index) in _question.list">
                            <div style="margin-top: 10px;">
                                <div style="float: left;vertical-align:top;width: 20px;" v-html="'<p style=\'display:inline-block\'>'+(index+1)+'、</p>'"></div>
                                <div style="float: right;vertical-align:top;width: 50px;" v-html="'<p style=\'display:inline-block\'>['+question.score+'分]</p>'"></div>
                                <div style="float: left;vertical-align:top;width: 670px;" v-html="question.question_content"></div>
                                <div style="clear: both"></div>
                                <template v-if="question.type==1">
                                    <div style="float: left;vertical-align:top;width: 300px;margin-top:5px;margin-left: 20px;" v-for="(option,index) in question.question_answer.answer_options">
                                        {{option.label}}.{{option.text}}
                                    </div>

                                </template>

                                <template v-if="question.type==2">
                                    <div style="float: left;vertical-align:top;width: 300px;margin-top:5px;margin-left: 20px;" v-for="(option,index) in question.question_answer.answer_options2">
                                        {{option.label}}.{{option.text}}
                                    </div>

                                </template>

                                <template v-if="question.type==6">
                                    <div style="" v-for="(option,index) in question.question_answer.sub_content">
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

                                </template>
                                <div style="clear: both"></div>

                                <template v-if="show_answer">
                                    <div style="color: red;font-weight: bolder">

                                        <p v-if="question.type == 3" >
                                            <span>答案:</span>
                                            <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in question.question_answer.answer">({{index3+1}}){{answer_item.text}}</span>
                                        </p>
                                        <p v-else-if="question.type == 6" >
                                            <span>答案:</span>
                                            <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in question.question_answer.answer">({{index3+1}}){{answer_item}}</span>
                                        </p>
                                        <p v-else v-html="'答案:'+question.question_answer.answer"></p>
                                        <p v-html="'答案解析:'+question.question_answer.answer_parse"></p>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </div>

                </template>

                <template v-if="preview_content_datika.question_positions">

                    <div  style="height:1115px;width: 794px;margin: 0 auto;position: relative " v-for="(question_position, order_id) in preview_content_datika.question_positions" >

                        <div style="position: absolute;left: 0;top:0; background: #000;width: 26px;height: 26px;border-radius: 26px;"></div>
                        <div style="position: absolute;right: 0;top:0;background: #000;width: 26px;height: 26px;border-radius: 26px;"></div>
                        <div style="position: absolute;left: 0;bottom:0;background: #000;width: 26px;height: 26px;border-radius: 26px;"></div>
                        <div style="position: absolute;right: 0;bottom:0;background: #000;width: 26px;height: 26px;border-radius: 26px;"></div>

                        <div style="position: absolute;left: 13px;top:13px;width: 768px;height:1089px;border: 1px solid #000"></div>

                        <div style="text-align: center;color:#E188BA;font-size: 24px;font-weight: bolder;position: absolute;top:40px;width: 100%;">{{preview_content_datika.title}}答题卡({{order_id+1}})</div>

                        <div style="position:absolute;left: 30px;top:100px;width: 150px;height:160px;line-height:60px;border: 2px solid #E188BA">
                            <p>姓名:</p>
                            <p>准考证号:</p>
                        </div>

                        <div style="position:absolute;left: 230px;top:100px;width: 380px;height:220px;border: 2px solid #E188BA"></div>
                        <div style="position: absolute;left: 235px;top:110px;">准考证号:</div>
                        <!--准考证号-->
                        <template v-if="question_position.zhunkaozheng">
                            <div v-for="(item,index) in question_position.zhunkaozheng" :style="'font-size: 10px;letter-spacing:5px;font-family: \'Arial\';position: absolute;left: '+(item.x+13)+'px;top:'+(item.y+13)+'px;margin-left: -11px;margin-top: -5px;'">[{{index%10}}]</div>
                        </template>

                        <!--序号-->
                        <div style="position:absolute;left: 630px;top:100px;width: 120px;height:220px;border: 2px solid #E188BA"></div>
                        <template v-if="question_position.xuhao">
                            <div v-for="(item,index) in question_position.xuhao" :style="'font-size: 10px;letter-spacing:5px;font-family: \'Arial\';position: absolute;left: '+(item.x+13)+'px;top:'+(item.y+13)+'px;margin-left: -11px;margin-top: -5px;width: 22px;height: 10px;background: '+item.color"></div>
                        </template>

                        <div style="position:absolute;left: 50px;top:340px;width: 694px;height:2px;background: #E188BA"></div>
                        <div :style="'position:absolute;left: '+(title.x+13)+'px;top:'+(title.y+13)+'px;height:2px;'" v-for="(title, index) in question_position.titles">{{title.text}}</div>


                        <template v-for="(_question,index) in question_position.questions">
                            <div v-if="(_question.type==1 || _question.type==2) && _question.is_sub_title" :style="'font-size: 12px;letter-spacing:5px;font-family: \'Arial\';position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;margin-left: -11px;margin-top: -5px;text-align: center;width: 22px;'">{{_question.text}}</div>
                            <div v-if="(_question.type==3 || _question.type==4 || _question.type==5 || _question.type==6|| _question.type==7) && _question.is_sub_title" :style="'position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;'">{{_question.text}}、</div>
                            <div v-if="(_question.type==3 || _question.type==4 || _question.type==5 || _question.type==6) && _question.is_sub_sub_title" :style="'position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;'">{{_question.text}}</div>

                            <div v-if="(_question.type==1 || _question.type==2) && !_question.is_sub_title && !_question.is_sub_sub_title" :style="'font-size: 10px;letter-spacing:5px;font-family: \'Arial\';position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;margin-left: -11px;margin-top: -5px;'">{{_question.text}}</div>
                            <div v-if="(_question.type==3 || _question.type==4 || _question.type==5 || _question.type==6 || _question.type==7) && !_question.is_sub_title && !_question.is_sub_sub_title" :style="'position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;width: '+_question.width+'px;height:'+_question.height+'px;border: 2px solid #E188BA'"></div>
                            <div v-if="(_question.type==8) && !_question.is_sub_title && !_question.is_sub_sub_title" :style="'position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;width: '+_question.width+'px;height:'+_question.height+'px;border: 2px solid #E188BA'">
                                <div style="border-bottom: 1px dashed #333;height:28px;" v-for="(line, index) in lines"></div>
                            </div>


                        </template>

                        <div style="page-break-after: always;"></div>
                    </div>


                </template>

            </div>
        </div>

        <el-dialog title="预览" :visible.sync="dialogFormVisiblePreview1" width="80%">

            <div class="question_block" style="width: 754px;padding:20px;margin: 0 auto;border: 1px solid #ddd;position: relative " >
                <!--<template v-for="(item,index) in current.questions">-->

                <!--<div class="question_item">-->
                <!--{{index+1}}.{{item.title}}-->
                <!--</div>-->
                <!--</template>-->

                <template v-if="preview_content.id">
                    <p style="text-align: center;font-size: 20px;font-weight: bolder">{{preview_content.title}}</p>
                    <p style="text-align: center;font-size: 12px;margin-bottom: 20px;">考试时间:{{preview_content.time_limit_min}}分钟</p>
                    <div style="font-size: 14px;margin-bottom: 10px;" v-for="(_question, type, index2) in preview_content.questions_with_types">
                        <p style="float: 16px;font-weight: bolder;margin-top:20px;">{{_question.name}}</p>

                        <template v-for="(question, index) in _question.list">
                            <div style="margin-top: 10px;">
                                <div style="float: left;vertical-align:top;width: 20px;" v-html="'<p style=\'display:inline-block\'>'+(index+1)+'、</p>'"></div>
                                <div style="float: right;vertical-align:top;width: 50px;" v-html="'<p style=\'display:inline-block\'>['+question.score+'分]</p>'"></div>
                                <div style="float: left;vertical-align:top;width: 670px;" v-html="question.question_content"></div>
                                <div style="clear: both"></div>
                                <template v-if="question.type==1">
                                    <div style="float: left;vertical-align:top;width: 300px;margin-top:5px;margin-left: 20px;" v-for="(option,index) in question.question_answer.answer_options">
                                        {{option.label}}.{{option.text}}
                                    </div>

                                </template>

                                <template v-if="question.type==2">
                                    <div style="float: left;vertical-align:top;width: 300px;margin-top:5px;margin-left: 20px;" v-for="(option,index) in question.question_answer.answer_options2">
                                        {{option.label}}.{{option.text}}
                                    </div>

                                </template>

                                <template v-if="question.type==6">
                                    <div style="" v-for="(option,index) in question.question_answer.sub_content">
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

                                </template>
                                <div style="clear: both"></div>
                                <template v-if="show_answer">
                                    <div style="color: red;font-weight: bolder">
                                        <p v-if="question.type == 3" >
                                            <span>答案:</span>
                                            <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in question.question_answer.answer">({{index3+1}}){{answer_item.text}}</span>
                                        </p>
                                        <p v-else-if="question.type == 6" >
                                            <span>答案:</span>
                                            <span style="display:block;margin-left: 15px;text-decoration: underline" v-for="(answer_item, index3) in question.question_answer.answer">({{index3}}){{answer_item}}</span>
                                        </p>
                                        <p v-else v-html="'答案:'+question.question_answer.answer"></p>
                                        <p v-html="'答案解析:'+question.question_answer.answer_parse"></p>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </div>

                </template>
            </div>

            <div slot="footer" class="dialog-footer" style="position: fixed;bottom:20px;left:50%">
                <el-button type="primary" @click="print(1)">打 印</el-button>
                <el-button @click="dialogFormVisiblePreview1 = false">关 闭</el-button>
            </div>
        </el-dialog>

        <el-dialog title="预览" :visible.sync="dialogFormVisiblePreview2" width="80%">

            <div  style="height:1115px;width: 794px;margin: 0 auto;position: relative " v-for="(question_position, order_id) in preview_content_datika.question_positions" >

                <div style="position: absolute;left: 0;top:0; background: #000;width: 26px;height: 26px;border-radius: 26px;"></div>
                <div style="position: absolute;right: 0;top:0;background: #000;width: 26px;height: 26px;border-radius: 26px;"></div>
                <div style="position: absolute;left: 0;bottom:0;background: #000;width: 26px;height: 26px;border-radius: 26px;"></div>
                <div style="position: absolute;right: 0;bottom:0;background: #000;width: 26px;height: 26px;border-radius: 26px;"></div>

                <div style="position: absolute;left: 13px;top:13px;width: 768px;height:1089px;border: 1px solid #000"></div>

                <div style="text-align: center;color:#E188BA;font-size: 24px;font-weight: bolder;position: absolute;top:40px;width: 100%;">{{preview_content_datika.title}}答题卡({{order_id+1}})</div>

                <div style="position:absolute;left: 30px;top:100px;width: 150px;height:160px;line-height:60px;border: 2px solid #E188BA">
                    <p>姓名:</p>
                    <p>准考证号:</p>
                </div>

                <div style="position:absolute;left: 230px;top:100px;width: 380px;height:220px;border: 2px solid #E188BA"></div>
                <div style="position: absolute;left: 235px;top:110px;">准考证号:</div>
                <!--准考证号-->
                <template v-if="question_position.zhunkaozheng">
                    <div v-for="(item,index) in question_position.zhunkaozheng" :style="'font-size: 10px;letter-spacing:5px;font-family: \'Arial\';position: absolute;left: '+(item.x+13)+'px;top:'+(item.y+13)+'px;margin-left: -11px;margin-top: -5px;'">[{{index%10}}]</div>
                </template>

                <!--序号-->
                <div style="position:absolute;left: 630px;top:100px;width: 120px;height:220px;border: 2px solid #E188BA"></div>
                <template v-if="question_position.xuhao">
                    <div v-for="(item,index) in question_position.xuhao" :style="'font-size: 10px;letter-spacing:5px;font-family: \'Arial\';position: absolute;left: '+(item.x+13)+'px;top:'+(item.y+13)+'px;margin-left: -11px;margin-top: -5px;width: 22px;height: 10px;background: '+item.color"></div>
                </template>

                <div style="position:absolute;left: 50px;top:340px;width: 694px;height:2px;background: #E188BA"></div>
                <div :style="'position:absolute;left: '+(title.x+13)+'px;top:'+(title.y+13)+'px;height:2px;'" v-for="(title, index) in question_position.titles">{{title.text}}</div>


                <template v-for="(_question,index) in question_position.questions">
                    <div v-if="(_question.type==1 || _question.type==2) && _question.is_sub_title" :style="'font-size: 12px;letter-spacing:5px;font-family: \'Arial\';position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;margin-left: -11px;margin-top: -5px;text-align: center;width: 22px;'">{{_question.text}}</div>
                    <div v-if="(_question.type==3 || _question.type==4 || _question.type==5 || _question.type==6|| _question.type==7) && _question.is_sub_title" :style="'position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;'">{{_question.text}}、</div>
                    <div v-if="(_question.type==3 || _question.type==4 || _question.type==5 || _question.type==6) && _question.is_sub_sub_title" :style="'position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;'">{{_question.text}}</div>

                    <div v-if="(_question.type==1 || _question.type==2) && !_question.is_sub_title && !_question.is_sub_sub_title" :style="'font-size: 10px;letter-spacing:5px;font-family: \'Arial\';position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;margin-left: -11px;margin-top: -5px;'">{{_question.text}}</div>
                    <div v-if="(_question.type==3 || _question.type==4 || _question.type==5 || _question.type==6 || _question.type==7) && !_question.is_sub_title && !_question.is_sub_sub_title" :style="'position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;width: '+_question.width+'px;height:'+_question.height+'px;border: 2px solid #E188BA'"></div>
                    <div v-if="(_question.type==8) && !_question.is_sub_title && !_question.is_sub_sub_title" :style="'position: absolute;left: '+(_question.x+13)+'px;top:'+(_question.y+13)+'px;width: '+_question.width+'px;height:'+_question.height+'px;border: 2px solid #E188BA'">
                        <div style="border-bottom: 1px dashed #333;height:28px;" v-for="(line, index) in lines"></div>

                    </div>


                </template>
            </div>
            <!--<div style="page-break-after: always;"></div>-->


            <div slot="footer" class="dialog-footer" style="position: fixed;bottom:20px;left:50%">
                <el-button type="primary" @click="print(2)">打 印</el-button>
                <el-button @click="dialogFormVisiblePreview2 = false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {get_grades} from '@/api/getDataEarth'
    import {examine_paper_list,examine_paper_del,examine_paper_verify,examine_paper_sort,examine_paper_info} from '@/api/getDataexamine_paper'

    import '@/assets/js/jquery-1.4.4.min';
    import '@/assets/js/jquery.jqprint-0.3';

    export default {
        data(){
            return {
                tableData: [],
                limit: 10,
                count: 0,
                currentPage: 1,
                dialogFormVisible:false,
                dialogFormVisiblePreview:false,
                dialogFormVisiblePreview1:false,
                dialogFormVisiblePreview2:false,
                current:{},
//                remark:'',
//                choose_categories:[],
//                categories:[],
                name:'',
                loadingBtn:-1,
                grade:{},
                grades:[],
                hard_level:'',
                useway_ids:[],
                entity:'',
                count_test:[1],
                preview_content:{},
                preview_content:{},
                preview_content_datika: {},
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
                vm.init_grades().then(function(){vm.list();});
        })
        },
        methods: {
            list() {
                examine_paper_list({page:this.currentPage,page_size:this.limit,name:this.name,entity:this.entity,
                    hard_level:this.hard_level,grade:this.grade,useway_ids:this.useway_ids}).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.tableData = res.data.list;
                        this.count = parseInt(res.data.count);
                    }
                }.bind(this));

            },
            init_grades(){
                return new Promise(function(resolve,reject){
                    this.loading_info = true;
                    get_grades({}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.grades = res.data;

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
            goto_edit_examine_paper(id) {
                this.$router.push({path:'add_examine_paper',query:{id:id}});
            },
            verify(scope, status) {

                this.$confirm('确认此操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    var item = scope.row;
                    this.loadingBtn = scope.$index;
                    examine_paper_verify({id:item.id,status:status}).then(function(res){
                        if (res.code == this.$store.state.constant.status_success) {
                            item.status = status;
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
            del(item, index) {

                this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    examine_paper_del({id:item.id}).then(function(res){
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
            handleSort(row){
                this.dialogFormVisible = true;
                this.current = row;
            },
            sort() {
                examine_paper_sort({
                    id:this.current.id,
                    sort:this.current.sort

                }).then(function(res){
                    if (res.code == this.$store.state.constant.status_success) {
                        this.dialogFormVisible = false;
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
                this.dialogFormVisible = false;
            },
            set_question(item){
                this.$router.push({path:'examine_paper_set_questions',query:{id:item.id}});
            },
            print2() {
                setTimeout(()=>{
                    $("#preview").jqprint();
                })

            },
            pre_print2(paper) {
                this.dialogFormVisiblePreview=true;
                this.preview_content = {};
                this.current=paper;
                examine_paper_info({id:this.current.id, datika:0}).then((res) => {
                    if (res.code == this.$store.state.constant.status_success) {
                    this.preview_content = res.data;
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'warning'
                    });
                }
            });


            },

            pre_print(type, paper, show_answer) {
                this.preview_content = {};
                this.preview_content_datika = {};
                this.current=paper;
                this.show_answer = show_answer ? true : false;
                var datika = 0;
                if(type == 1) {//试卷
                    datika = 0;
                } else if(type == 2){//答题卡
                    datika = 1;
                } else {
                    return ;
                }
                examine_paper_info({id:this.current.id, datika:datika}).then((res) => {
                    if (res.code == this.$store.state.constant.status_success) {

                    if(type == 1) {//试卷
                        this.preview_content = res.data;
                    } else if(type == 2){//答题卡
                        this.preview_content_datika = res.data.datika_info;
                        this.preview_content_datika.title = res.data.title;
                    }

                    this['dialogFormVisiblePreview'+type]=true;


                } else {
                    this.$message({
                        message: res.msg,
                        type: 'warning'
                    });
                }
            });


            },
            print() {
                setTimeout(()=>{
                    $("#preview").find('.kfformula').css('vertical-align', 'middle');
                    $("#preview").jqprint();
            })

            },
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
    img.kfformula {
        vertical-align: middle;
    }
</style>
