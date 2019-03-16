import fetch from '@/config/fetch'
import router from '@/router'
import {check_login} from '@/config/mUtils'


export const student_homework_result_list = data => fetch('/wenyuanjiaoyu/student_homework_result/index', data, 'POST').then(check_login);
export const student_homework_result_all_list = data => fetch('/wenyuanjiaoyu/student_homework_result/get_all', data, 'POST').then(check_login);
export const student_homework_result_edit = data => fetch('/wenyuanjiaoyu/student_homework_result/edit', data, 'POST').then(check_login);
export const student_homework_result_verify = data => fetch('/wenyuanjiaoyu/student_homework_result/verify', data, 'POST').then(check_login);
export const student_homework_result_del = data => fetch('/wenyuanjiaoyu/student_homework_result/del', data, 'POST').then(check_login);
export const student_homework_result_info = data => fetch('/wenyuanjiaoyu/student_homework_result/info', data, 'POST').then(check_login);
export const student_homework_result_sort = data => fetch('/wenyuanjiaoyu/student_homework_result/sort', data, 'POST').then(check_login);
export const teacher_suggest = data => fetch('/wenyuanjiaoyu/student_homework_result/teacher_suggest', data, 'POST').then(check_login);
export const reckon_result = data => fetch('/wenyuanjiaoyu/student_homework_result/reckon_result', data, 'POST').then(check_login);
export const getResultHomeWorkStudentlist = data => fetch('/wenyuanjiaoyu/student_homework_result/getResultHomeWorkStudentlist', data, 'POST').then(check_login);
export const submit_result = data => fetch('/wenyuanjiaoyu/question_student_result/submit_result', data, 'POST').then(check_login);



