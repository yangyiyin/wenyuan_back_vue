import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const error = r => require.ensure([], () => r(require('@/page/error')), 'error');
const news = r => require.ensure([], () => r(require('@/page_biz/news')), 'news');
const add_news = r => require.ensure([], () => r(require('@/page_biz/add_news')), 'add_news');
const sign = r => require.ensure([], () => r(require('@/page_biz/sign')), 'sign');
const sign_edit = r => require.ensure([], () => r(require('@/page_biz/sign_edit')), 'sign_edit');
const examination = r => require.ensure([], () => r(require('@/page_biz/examination')), 'examination');
const examination_edit = r => require.ensure([], () => r(require('@/page_biz/examination_edit')), 'examination_edit');
const examination_signs = r => require.ensure([], () => r(require('@/page_biz/examination_signs')), 'examination_signs');
const examination_signs_add = r => require.ensure([], () => r(require('@/page_biz/examination_signs_add')), 'examination_signs_add');
const users = r => require.ensure([], () => r(require('@/page_biz/users')), 'users');
const config = r => require.ensure([], () => r(require('@/page_biz/config')), 'config');
const suggest = r => require.ensure([], () => r(require('@/page_biz/suggest')), 'suggest');
const words = r => require.ensure([], () => r(require('@/page_biz/words')), 'words');
const words_content = r => require.ensure([], () => r(require('@/page_biz/words_content')), 'words_content');
const words_edit = r => require.ensure([], () => r(require('@/page_biz/words_edit')), 'words_edit');
const goods = r => require.ensure([], () => r(require('@/page_biz/goods')), 'goods');
const order = r => require.ensure([], () => r(require('@/page_biz/order')), 'order');
const add_goods = r => require.ensure([], () => r(require('@/page_biz/add_goods')), 'add_goods');
const avatar_upload = r => require.ensure([], () => r(require('@/page_biz/avatar_upload')), 'avatar_upload');
const order_pay_left_log = r => require.ensure([], () => r(require('@/page_biz/order_pay_left_log')), 'order_pay_left_log');
const admin_user = r => require.ensure([], () => r(require('@/page_biz/admin_user')), 'admin_user');
const add_admin_user = r => require.ensure([], () => r(require('@/page_biz/add_admin_user')), 'add_admin_user');
const admin_group = r => require.ensure([], () => r(require('@/page_biz/admin_group')), 'admin_group');
const add_admin_group = r => require.ensure([], () => r(require('@/page_biz/add_admin_group')), 'add_admin_group');
const admin_purview = r => require.ensure([], () => r(require('@/page_biz/admin_purview')), 'admin_purview');
const add_admin_purview = r => require.ensure([], () => r(require('@/page_biz/add_admin_purview')), 'add_admin_purview');
const group_purview = r => require.ensure([], () => r(require('@/page_biz/group_purview')), 'group_purview');
const sign_course_edit = r => require.ensure([], () => r(require('@/page_biz/sign_course_edit')), 'sign_course_edit');
const sign_course = r => require.ensure([], () => r(require('@/page_biz/sign_course')), 'sign_course');
const sign_stage = r => require.ensure([], () => r(require('@/page_biz/sign_stage')), 'sign_stage');
const sign_stage_edit = r => require.ensure([], () => r(require('@/page_biz/sign_stage_edit')), 'sign_stage_edit');
const question = r => require.ensure([], () => r(require('@/page_biz/question')), 'question');
const question_edit = r => require.ensure([], () => r(require('@/page_biz/question_edit')), 'question_edit');

const label = r => require.ensure([], () => r(require('@/page_biz/label')), 'label');
const add_label = r => require.ensure([], () => r(require('@/page_biz/add_label')), 'add_label');
const knowledge_point = r => require.ensure([], () => r(require('@/page_biz/knowledge_point')), 'knowledge_point');
const add_knowledge_point = r => require.ensure([], () => r(require('@/page_biz/add_knowledge_point')), 'add_knowledge_point');
const homework = r => require.ensure([], () => r(require('@/page_biz/homework')), 'homework');
const add_homework = r => require.ensure([], () => r(require('@/page_biz/add_homework')), 'add_homework');
const student_homework_result = r => require.ensure([], () => r(require('@/page_biz/student_homework_result')), 'student_homework_result');
const show_img = r => require.ensure([], () => r(require('@/page_biz/show_img')), 'show_img');
const admin_log = r => require.ensure([], () => r(require('@/page_biz/admin_log')), 'admin_log');
const examine_paper = r => require.ensure([], () => r(require('@/page_biz/examine_paper')), 'examine_paper');
const add_examine_paper = r => require.ensure([], () => r(require('@/page_biz/add_examine_paper')), 'add_examine_paper');
const examine_paper_set_questions = r => require.ensure([], () => r(require('@/page_biz/examine_paper_set_questions')), 'examine_paper_set_questions');
const student_examine_result = r => require.ensure([], () => r(require('@/page_biz/student_examine_result')), 'student_examine_result');
const add_student_examine_result = r => require.ensure([], () => r(require('@/page_biz/add_student_examine_result')), 'add_student_examine_result');
const examination_examine_paper = r => require.ensure([], () => r(require('@/page_biz/examination_examine_paper')), 'examination_examine_paper');
const edit_student_examine_result = r => require.ensure([], () => r(require('@/page_biz/edit_student_examine_result')), 'edit_student_examine_result');
const review_student_examine_question = r => require.ensure([], () => r(require('@/page_biz/review_student_examine_question')), 'review_student_examine_question');
const minipro_qrcode = r => require.ensure([], () => r(require('@/page_biz/minipro_qrcode')), 'minipro_qrcode');
const user_notice_agreement = r => require.ensure([], () => r(require('@/page_biz/user_notice_agreement')), 'user_notice_agreement');
const add_user_notice_agreement = r => require.ensure([], () => r(require('@/page_biz/add_user_notice_agreement')), 'add_user_notice_agreement');
const answer_paper_edit = r => require.ensure([], () => r(require('@/page_biz/answer_paper_edit')), 'answer_paper_edit');
//{#replace1#}

const routes = [
	{
		path: '/',
		component: login
	},
	{
		path: '/manage',
		component: manage,
		name: '',
		children: [
			{
				path: '/error',
				component: error,
				meta: ['错误', '错误'],
			},
			{
				path: '/news',
				component: news,
				meta: ['学校管理', '新闻列表'],
			},
			{
				path: '/add_news',
				component: add_news,
				meta: ['学校管理', '编辑新闻'],
			},
			{
				path: '/sign',
				component: sign,
				meta: ['学校管理', '报名管理'],
			},
			{
				path: '/sign_edit',
				component: sign_edit,
				meta: ['学校管理', '编辑报名简章'],
			},
			{
				path: '/examination',
				component: examination,
				meta: ['学校管理', '考试管理'],
			},
			{
				path: '/examination_edit',
				component: examination_edit,
				meta: ['学校管理', '编辑考试'],
			},
			{
				path: '/examination_signs',
				component: examination_signs,
				meta: ['学校管理', '考试学员情况'],
			},
			{
				path: '/examination_signs_add',
				component: examination_signs_add,
				meta: ['学校管理', '考试线下报名'],
			},
			{
				path: '/users',
				component: users,
				meta: ['学校管理', '微信小程序用户'],
			},
			{
				path: '/suggest',
				component: suggest,
				meta: ['学校管理', '家长反馈'],
			},
			{
				path: '/words',
				component: words,
				meta: ['学校管理', '教师评语'],
			},
			{
				path: '/words_edit',
				component: words_edit,
				meta: ['学校管理', '教师评语'],
			},
			{
				path: '/words_content',
				component: words_content,
				meta: ['学校管理', '教师评语'],
			},

			{
				path: '/config',
				component: config,
				meta: ['系统设置', '参数配置'],
			},
			{
				path: '/goods',
				component: goods,
				meta: ['精品课程', '课程'],
			},
			{
				path: '/add_goods',
				component: add_goods,
				meta: ['精品课程', '编辑课程'],
			},
			{
				path: '/avatar_upload',
				component: avatar_upload,
				meta: ['学校管理', '头像上传'],
			},
			{
				path: '/order',
				component: order,
				meta: ['精品课程', '订单'],
			},
			{
				path: '/order_pay_left_log',
				component: order_pay_left_log,
				meta: ['精品课程', '余款收账记录'],
			},

            {
                path: '/sign_stage',
                component: sign_stage,
                meta: ['快捷报班', '列表'],
            },
            {
                path: '/sign_stage_edit',
                component: sign_stage_edit,
                meta: ['快捷报班', '编辑快捷报班'],
            },

            {
                path: '/sign_course',
                component: sign_course,
                meta: ['快捷报班-课程', '列表'],
            },
            {
                path: '/sign_course_edit',
                component: sign_course_edit,
                meta: ['快捷报班-课程', '编辑快捷报班'],
            },

			{
				path: '/admin_user',
				component: admin_user,
				meta: ['后台管理', '用户管理'],
			},
			{
				path: '/add_admin_user',
				component: add_admin_user,
				meta: ['后台管理', '添加用户'],
			},
			{
				path: '/admin_group',
				component: admin_group,
				meta: ['后台管理', '组管理'],
			},
			{
				path: '/add_admin_group',
				component: add_admin_group,
				meta: ['后台管理', '添加组'],
			},
			{
				path: '/admin_purview',
				component: admin_purview,
				meta: ['系统', '权限管理'],
			},
			{
				path: '/add_admin_purview',
				component: add_admin_purview,
				meta: ['系统', '添加权限'],
			},
			{
				path: '/group_purview',
				component: group_purview,
				meta: ['后台管理', '权限组权限'],
			},

			{
				path: '/question',
				component: question,
				meta: ['题库', '试题列表'],
			},
			{
				path: '/question_edit',
				component: question_edit,
				meta: ['题库', '编辑试题'],
			},

			{path: '/label',component: label,meta: ['题库', '标签'],},
{path: '/add_label',component: add_label,meta: ['题库', '设置标签'],},
{path: '/knowledge_point',component: knowledge_point,meta: ['题库', '知识点'],},
{path: '/add_knowledge_point',component: add_knowledge_point,meta: ['题库', '设置知识点'],},
{path: '/homework',component: homework,meta: ['题库', '家庭作业'],},
{path: '/add_homework',component: add_homework,meta: ['题库', '设置家庭作业'],},
{path: '/student_homework_result',component: student_homework_result,meta: ['题库', '批改作业'],},
{path: '/show_img',component: show_img,meta: ['题库', '作业图'],},
{path: '/admin_log',component: admin_log,meta: ['用户管理', '操作日志'],},
{path: '/examine_paper',component: examine_paper,meta: ['题库', '试卷'],},
{path: '/add_examine_paper',component: add_examine_paper,meta: ['题库', '编辑试卷'],},
{path: '/examine_paper_set_questions',component: examine_paper_set_questions,meta: ['考试卷', '设置题目'],},
{path: '/student_examine_result',component: student_examine_result,meta: ['考试', '学生答卷'],},
{path: '/add_student_examine_result',component: add_student_examine_result,meta: ['考试', '编辑答卷'],},
{path: '/examination_examine_paper',component: examination_examine_paper,meta: ['考试', '试卷'],},
{path: '/student_examine_result',component: student_examine_result,meta: ['考试', '学生试卷'],},
{path: '/edit_student_examine_result',component: edit_student_examine_result,meta: ['考试', '批阅学生答卷'],},
{path: '/review_student_examine_question',component: review_student_examine_question,meta: ['考试', '批阅题目'],},
{path: '/minipro_qrcode',component: minipro_qrcode,meta: ['系统', '小程序二维码'],},
{path: '/user_notice_agreement',component: user_notice_agreement,meta: ['学校管理', '同意书'],},
{path: '/add_user_notice_agreement',component: add_user_notice_agreement,meta: ['学校管理', '同意书'],},
{path: '/answer_paper_edit',component: answer_paper_edit,meta: ['题库', '答题卷制作'],},
//{#replace2#}
		],
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
