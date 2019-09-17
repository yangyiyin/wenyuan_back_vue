import fetch from '@/config/fetch'
import router from '@/router'
import {check_login} from '@/config/mUtils'


export const label_list = data => fetch('/wenyuanjiaoyu/label/index', data, 'POST').then(check_login);
export const label_all_list = data => fetch('/wenyuanjiaoyu/label/get_all', data, 'POST').then(check_login);
export const label_edit = data => fetch('/wenyuanjiaoyu/label/edit', data, 'POST').then(check_login);
export const label_verify = data => fetch('/wenyuanjiaoyu/label/verify', data, 'POST').then(check_login);
export const label_del = data => fetch('/wenyuanjiaoyu/label/del', data, 'POST').then(check_login);
export const label_info = data => fetch('/wenyuanjiaoyu/label/info', data, 'POST').then(check_login);
export const label_sort = data => fetch('/wenyuanjiaoyu/label/sort', data, 'POST').then(check_login);

export const label_group_list = data => fetch('/wenyuanjiaoyu/label_group/index', data, 'POST').then(check_login);
export const label_group_all_list = data => fetch('/wenyuanjiaoyu/label_group/get_all', data, 'POST').then(check_login);
export const label_group_info = data => fetch('/wenyuanjiaoyu/label_group/info', data, 'POST').then(check_login);
export const label_group_edit = data => fetch('/wenyuanjiaoyu/label_group/edit', data, 'POST').then(check_login);
export const label_group_del = data => fetch('/wenyuanjiaoyu/label_group/del', data, 'POST').then(check_login);


