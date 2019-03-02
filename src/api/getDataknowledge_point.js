import fetch from '@/config/fetch'
import router from '@/router'
import {check_login} from '@/config/mUtils'


export const knowledge_point_list = data => fetch('/wenyuanjiaoyu/knowledge_point/index', data, 'POST').then(check_login);
export const knowledge_point_all_list = data => fetch('/wenyuanjiaoyu/knowledge_point/get_all', data, 'POST').then(check_login);
export const knowledge_point_edit = data => fetch('/wenyuanjiaoyu/knowledge_point/edit', data, 'POST').then(check_login);
export const knowledge_point_verify = data => fetch('/wenyuanjiaoyu/knowledge_point/verify', data, 'POST').then(check_login);
export const knowledge_point_del = data => fetch('/wenyuanjiaoyu/knowledge_point/del', data, 'POST').then(check_login);
export const knowledge_point_info = data => fetch('/wenyuanjiaoyu/knowledge_point/info', data, 'POST').then(check_login);
export const knowledge_point_sort = data => fetch('/wenyuanjiaoyu/knowledge_point/sort', data, 'POST').then(check_login);



