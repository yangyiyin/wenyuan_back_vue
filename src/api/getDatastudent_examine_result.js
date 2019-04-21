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
export const parse_zip = data => fetch('/wenyuanjiaoyu/student_examine_result/parse_zip', data, 'POST').then(check_login);
export const get_parse_zip_process = data => fetch('/wenyuanjiaoyu/student_examine_result/get_parse_zip_process', data, 'POST').then(check_login);
export const reckon_result = data => fetch('/wenyuanjiaoyu/student_examine_result/reckon_result', data, 'POST').then(check_login);
export const submit_result = data => fetch('/wenyuanjiaoyu/question_student_result/submit_result_examine', data, 'POST').then(check_login);



