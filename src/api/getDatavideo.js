import fetch from '@/config/fetch'
import router from '@/router'
import {check_login} from '@/config/mUtils'


export const video_list = data => fetch('/wenyuanjiaoyu/video/index', data, 'POST').then(check_login);
export const video_all_list = data => fetch('/wenyuanjiaoyu/video/get_all', data, 'POST').then(check_login);
export const video_edit = data => fetch('/wenyuanjiaoyu/video/edit', data, 'POST').then(check_login);
export const video_verify = data => fetch('/wenyuanjiaoyu/video/verify', data, 'POST').then(check_login);
export const video_del = data => fetch('/wenyuanjiaoyu/video/del', data, 'POST').then(check_login);
export const video_info = data => fetch('/wenyuanjiaoyu/video/info', data, 'POST').then(check_login);
export const video_sort = data => fetch('/wenyuanjiaoyu/video/sort', data, 'POST').then(check_login);



