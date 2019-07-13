<template>
    <div style="height: 500px;overflow-y: auto">
        <el-scrollbar style="height: 100%;">

            <p style="font-size: 16px;font-weight: bolder">2019.7.13重要更新内容:</p>
            <p style="line-height: 22px;">1.考试卷预览增加打印按钮,可打印试卷。</p>
            <p style="height: 20px;"></p>

            <p style="font-size: 16px;font-weight: bolder">2019.7.1重要更新内容:</p>
            <p style="line-height: 22px;">1.当录入题目未选择绝密等级的时候，系统默认为等级四。</p>
            <p style="line-height: 22px;">2.增加题目检查者，流程：录入题目之后，可再次进入编辑，在最下面选择检查者。添加完检查者，表示该题目已检查。可在题库列表中进行条件筛选。</p>
            <p style="height: 20px;"></p>

            <p style="font-size: 16px;font-weight: bolder">2019.5.26重要更新内容:</p>
            <p style="line-height: 22px;">1.修复题库条件搜索bug</p>
            <p style="line-height: 22px;">2.增加用户报名须知同意功能</p>
            <p style="line-height: 22px;">3.修复其他一部分已知bug</p>
            <p style="height: 20px;"></p>

            <p style="font-size: 16px;font-weight: bolder">答卷异常处理:</p>
            <p style="line-height: 22px;">1.查看冲突或错误日志,对于解析头不出来的,需重新扫描,或人工登分,做好记录。对于冲突的,查看双方答卷,并人工逐一解决</p>
            <p style="line-height: 22px;">2.查询student_examine_result表papers少于额定数量的,进行人工修复。如果有其他冲突考号,或不存在考号,人工修复</p>
            <p style="line-height: 22px;">3.查询客观题答案缺少的学生,进行人工给答案和给分</p>
            <p style="height: 20px;"></p>

            <p style="font-size: 16px;font-weight: bolder">2019.5.16重要更新内容:</p>
            <p style="line-height: 22px;">1.增加后台考试卷相关权限</p>
            <p style="line-height: 22px;">2.增加考试卷相关操作日志</p>
            <p style="line-height: 22px;">3.增加题目标签筛选</p>
            <p style="line-height: 22px;">4.增加作文题</p>
            <p style="height: 20px;"></p>

            <p style="font-size: 16px;font-weight: bolder">2019.5.15重要更新内容:</p>
            <p style="line-height: 22px;">1.修改答题卡解析参数,是解析器更加适合实际情况</p>
            <p style="line-height: 22px;">2.增加学生批阅界面序号和原答卷链接</p>
            <p style="height: 20px;"></p>

            <p style="font-size: 16px;font-weight: bolder">2019.5.13重要更新内容:</p>
            <p style="line-height: 22px;">1.修复打印答卷不显示bug</p>
            <p style="line-height: 22px;">2.题库增加计算题题型</p>
            <p style="line-height: 22px;">3.题库题型在考卷中的排序逻辑修改</p>
            <p style="height: 20px;"></p>

            <p style="font-size: 16px;font-weight: bolder">2019.5.12重要更新内容:</p>
            <p style="line-height: 22px;">1.试题增加了阅读题。阅读题也可以理解为一个主题干下,有多个小题,小题的形式目前支持单选和填空。
                只支持在考试卷中使用,且需人工审批。在考试卷人工审批过程中,阅读题的给分以每个小题分别给分的形式给分。</p>
            <p style="line-height: 22px;">2.修复和完善机器自动审批试卷机制</p>
            <p style="line-height: 22px;">3.考试卷选题增加知识点配置，可随机分配到已选题型</p>
            <p style="line-height: 22px;">4.增加人工审批试卷可选择某一题进行审批的功能</p>
            <p style="line-height: 22px;">5.增加试卷(含答案)打印</p>
            <p style="line-height: 22px;">6.增加考试卷批阅完，成绩可同步至考试报名信息中的功能</p>
            <p style="line-height: 22px;">7.增加系统>小程序页面二维码的功能,可配置二维码跳转到指定页面</p>
            <p style="line-height: 22px;">8.其他:修复已知bug</p>
        </el-scrollbar>

    </div>
</template>
<script>
    export default {
        name: 'help',
        data () {
            return { editor: null
            }
        },
    }
</script>
