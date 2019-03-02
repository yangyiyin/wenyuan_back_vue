import fetch from '@/config/fetch'
import router from '@/router'
import {check_login} from '@/config/mUtils'


export const homework_list = data => fetch('/wenyuanjiaoyu/homework/index', data, 'POST').then(check_login);
export const homework_all_list = data => fetch('/wenyuanjiaoyu/homework/get_all', data, 'POST').then(check_login);
export const homework_edit = data => fetch('/wenyuanjiaoyu/homework/edit', data, 'POST').then(check_login);
export const homework_verify = data => fetch('/wenyuanjiaoyu/homework/verify', data, 'POST').then(check_login);
export const homework_del = data => fetch('/wenyuanjiaoyu/homework/del', data, 'POST').then(check_login);
export const homework_info = data => fetch('/wenyuanjiaoyu/homework/info', data, 'POST').then(check_login);
export const homework_sort = data => fetch('/wenyuanjiaoyu/homework/sort', data, 'POST').then(check_login);



