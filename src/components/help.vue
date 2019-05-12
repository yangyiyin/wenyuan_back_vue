<template>
    <div>
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
