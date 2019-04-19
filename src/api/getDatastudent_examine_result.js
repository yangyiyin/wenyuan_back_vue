import fetch from '@/config/fetch'
import router from '@/router'
import {check_login} from '@/config/mUtils'


export const student_examine_result_list = data => fetch('/wenyuanjiaoyu/student_examine_result/index', data, 'POST').then(check_login);
export const student_examine_result_all_list = data => fetch('/wenyuanjiaoyu/student_examine_result/get_all', data, 'POST').then(check_login);
export const student_examine_result_edit = data => fetch('/wenyuanjiaoyu/student_examine_result/edit', data, 'POST').then(check_login);
export const student_examine_result_verify = data => fetch('/wenyuanjiaoyu/student_examine_result/verify', data, 'POST').then(check_login);
export const student_examine_result_del = data => fetch('/wenyuanjiaoyu/student_examine_result/del', data, 'POST').then(check_login);
export const student_examine_result_info = data => fetch('/wenyuanjiaoyu/student_examine_result/info', data, 'POST').then(check_login);
export const student_examine_result_sort = data => fetch('/wenyuanjiaoyu/student_examine_result/sort', data, 'POST').then(check_login);



