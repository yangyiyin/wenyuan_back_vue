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
		],
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
