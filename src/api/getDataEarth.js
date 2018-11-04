import fetch from '@/config/fetch'
import router from '@/router'
/**
 * 获取电话记录
 */

var check_login = function(res){
    return new Promise(function(resolve,reject){
        if (res.code == 999) {
            router.push('/');
        } else {
            resolve(res);
        }

    });
}

export const news_list = data => fetch('/wenyuanjiaoyu/news/index', data, 'POST').then(check_login);
export const news_info = data => fetch('/wenyuanjiaoyu/news/info', data, 'POST').then(check_login);
export const news_verify = data => fetch('/wenyuanjiaoyu/news/verify', data, 'POST').then(check_login);
export const news_del = data => fetch('/wenyuanjiaoyu/news/del', data, 'POST').then(check_login);
export const news_edit = data => fetch('/wenyuanjiaoyu/news/edit', data, 'POST').then(check_login);
export const news_sort = data => fetch('/wenyuanjiaoyu/news/sort', data, 'POST').then(check_login);
export const sign_info_default = data => fetch('/wenyuanjiaoyu/sign/sign_info_default', data, 'POST').then(check_login);
export const sign_edit = data => fetch('/wenyuanjiaoyu/sign/edit', data, 'POST').then(check_login);
export const sign_signs_list = data => fetch('/wenyuanjiaoyu/sign_signs/index', data, 'POST').then(check_login);
export const sign_signs_del = data => fetch('/wenyuanjiaoyu/sign_signs/del', data, 'POST').then(check_login);
export const sign_signs_areas = data => fetch('/wenyuanjiaoyu/sign_signs/areas', data, 'POST').then(check_login);
export const check_bind_student = data => fetch('/wenyuanjiaoyu/student/check_bind_student', data, 'POST').then(check_login);
export const examination_list = data => fetch('/wenyuanjiaoyu/examination/index', data, 'POST').then(check_login);
export const examination_info = data => fetch('/wenyuanjiaoyu/examination/info', data, 'POST').then(check_login);
export const examination_verify = data => fetch('/wenyuanjiaoyu/examination/verify', data, 'POST').then(check_login);
export const examination_del = data => fetch('/wenyuanjiaoyu/examination/del', data, 'POST').then(check_login);
export const examination_edit = data => fetch('/wenyuanjiaoyu/examination/edit', data, 'POST').then(check_login);
export const examination_sign_options = data => fetch('/wenyuanjiaoyu/examination/get_sign_options', data, 'POST').then(check_login);
export const examination_sort = data => fetch('/wenyuanjiaoyu/examination/sort', data, 'POST').then(check_login);
export const examination_excel_out = data => fetch('/wenyuanjiaoyu/examination_signs/excel_out', data, 'POST').then(check_login);
export const examination_gen_ticket = data => fetch('/wenyuanjiaoyu/examination_signs/gen_ticket', data, 'POST').then(check_login);
export const examination_signs_change_data = data => fetch('/wenyuanjiaoyu/examination_signs/change_data', data, 'POST').then(check_login);
export const examination_send_mail = data => fetch('/wenyuanjiaoyu/examination_signs/send_mail', data, 'POST').then(check_login);
export const examination_signs_list = data => fetch('/wenyuanjiaoyu/examination_signs/index', data, 'POST').then(check_login);
export const examination_sign_del = data => fetch('/wenyuanjiaoyu/examination_signs/del', data, 'POST').then(check_login);
export const examination_signs_edit = data => fetch('/wenyuanjiaoyu/examination_signs/edit', data, 'POST').then(check_login);
export const setCanEditAvatar = data => fetch('/wenyuanjiaoyu/examination_signs/setCanEditAvatar', data, 'POST').then(check_login);
export const users_list = data => fetch('/wenyuanjiaoyu/users/index', data, 'POST').then(check_login);
export const users_verify = data => fetch('/wenyuanjiaoyu/users/verify', data, 'POST').then(check_login);
export const users_del = data => fetch('/wenyuanjiaoyu/users/del', data, 'POST').then(check_login);
export const config_list = data => fetch('/wenyuanjiaoyu/config/index', data, 'POST').then(check_login);
export const config_edit = data => fetch('/wenyuanjiaoyu/config/edit', data, 'POST').then(check_login);
export const get_course_list = data => fetch('/wenyuanjiaoyu/student/get_course_list', data, 'POST').then(check_login);
export const suggest_list = data => fetch('/wenyuanjiaoyu/suggest/index', data, 'POST').then(check_login);
export const words_list = data => fetch('/wenyuanjiaoyu/words/index', data, 'POST').then(check_login);
export const words_edit = data => fetch('/wenyuanjiaoyu/words/edit', data, 'POST').then(check_login);
export const words_del = data => fetch('/wenyuanjiaoyu/words/del', data, 'POST').then(check_login);
export const words_info = data => fetch('/wenyuanjiaoyu/words/info', data, 'POST').then(check_login);
export const words_content_list = data => fetch('/wenyuanjiaoyu/words_content/index', data, 'POST').then(check_login);
export const words_content_edit = data => fetch('/wenyuanjiaoyu/words_content/edit', data, 'POST').then(check_login);
export const words_content_excel_out = data => fetch('/wenyuanjiaoyu/words_content/excel_out', data, 'POST').then(check_login);
export const suggest_excel_out = data => fetch('/wenyuanjiaoyu/suggest/excel_out', data, 'POST').then(check_login);
export const goods_list = data => fetch('/wenyuanjiaoyu/goods/index', data, 'POST').then(check_login);
export const goods_info = data => fetch('/wenyuanjiaoyu/goods/info', data, 'POST').then(check_login);
export const goods_verify = data => fetch('/wenyuanjiaoyu/goods/verify', data, 'POST').then(check_login);
export const goods_del = data => fetch('/wenyuanjiaoyu/goods/del', data, 'POST').then(check_login);
export const goods_edit = data => fetch('/wenyuanjiaoyu/goods/edit', data, 'POST').then(check_login);
export const goods_sort = data => fetch('/wenyuanjiaoyu/goods/sort', data, 'POST').then(check_login);
export const get_all_properties = data => fetch('/wenyuanjiaoyu/goods/get_all_properties', data, 'POST').then(check_login);
export const order_list = data => fetch('/wenyuanjiaoyu/order/index', data, 'POST').then(check_login);
export const cancel_order_force = data => fetch('/wenyuanjiaoyu/order/cancel_order_force', data, 'POST').then(check_login);
export const pay_left_money = data => fetch('/wenyuanjiaoyu/order/pay_left_money', data, 'POST').then(check_login);
export const upload_avatar = data => fetch('/wenyuanjiaoyu/examination_signs/upload_avatar', data, 'POST').then(check_login);
export const order_excel_out = data => fetch('/wenyuanjiaoyu/order/excel_out', data, 'POST').then(check_login);
export const order_pay_left_log_list = data => fetch('/wenyuanjiaoyu/order_pay_left_log/index', data, 'POST').then(check_login);

export const admin_user_list = data => fetch('/wenyuanjiaoyu/admin_user/index', data, 'POST').then(check_login);
export const admin_user_edit = data => fetch('/wenyuanjiaoyu/admin_user/edit', data, 'POST').then(check_login);
export const admin_user_verify = data => fetch('/wenyuanjiaoyu/admin_user/verify', data, 'POST').then(check_login);
export const admin_user_del = data => fetch('/wenyuanjiaoyu/admin_user/del', data, 'POST').then(check_login);
export const admin_user_info = data => fetch('/wenyuanjiaoyu/admin_user/info', data, 'POST').then(check_login);
export const admin_group_list = data => fetch('/wenyuanjiaoyu/admin_group/index', data, 'POST').then(check_login);
export const admin_group_all_list = data => fetch('/wenyuanjiaoyu/admin_group/all_list', data, 'POST').then(check_login);
export const admin_group_edit = data => fetch('/wenyuanjiaoyu/admin_group/edit', data, 'POST').then(check_login);
export const admin_group_verify = data => fetch('/wenyuanjiaoyu/admin_group/verify', data, 'POST').then(check_login);
export const admin_group_del = data => fetch('/wenyuanjiaoyu/admin_group/del', data, 'POST').then(check_login);
export const admin_group_info = data => fetch('/wenyuanjiaoyu/admin_group/info', data, 'POST').then(check_login);
export const admin_group_sort = data => fetch('/wenyuanjiaoyu/admin_group/sort', data, 'POST').then(check_login);
export const admin_purview_tree = data => fetch('/wenyuanjiaoyu/admin_purview/tree', data, 'POST').then(check_login);
export const admin_purview_all_list = data => fetch('/wenyuanjiaoyu/admin_purview/all_list', data, 'POST').then(check_login);
export const admin_purview_edit = data => fetch('/wenyuanjiaoyu/admin_purview/edit', data, 'POST').then(check_login);
export const admin_purview_verify = data => fetch('/wenyuanjiaoyu/admin_purview/verify', data, 'POST').then(check_login);
export const admin_purview_del = data => fetch('/wenyuanjiaoyu/admin_purview/del', data, 'POST').then(check_login);
export const admin_purview_info = data => fetch('/wenyuanjiaoyu/admin_purview/info', data, 'POST').then(check_login);
export const admin_purview_sort = data => fetch('/wenyuanjiaoyu/admin_purview/sort', data, 'POST').then(check_login);
export const get_menu = data => fetch('/wenyuanjiaoyu/admin_purview/get_menu', data, 'POST').then(check_login);


