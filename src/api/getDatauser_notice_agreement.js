import fetch from '@/config/fetch'
import router from '@/router'
import {check_login} from '@/config/mUtils'


export const user_notice_agreement_list = data => fetch('/wenyuanjiaoyu/user_notice_agreement/index', data, 'POST').then(check_login);
export const user_notice_agreement_all_list = data => fetch('/wenyuanjiaoyu/user_notice_agreement/get_all', data, 'POST').then(check_login);
export const user_notice_agreement_edit = data => fetch('/wenyuanjiaoyu/user_notice_agreement/edit', data, 'POST').then(check_login);
export const user_notice_agreement_verify = data => fetch('/wenyuanjiaoyu/user_notice_agreement/verify', data, 'POST').then(check_login);
export const user_notice_agreement_del = data => fetch('/wenyuanjiaoyu/user_notice_agreement/del', data, 'POST').then(check_login);
export const user_notice_agreement_info = data => fetch('/wenyuanjiaoyu/user_notice_agreement/info', data, 'POST').then(check_login);
export const user_notice_agreement_sort = data => fetch('/wenyuanjiaoyu/user_notice_agreement/sort', data, 'POST').then(check_login);



