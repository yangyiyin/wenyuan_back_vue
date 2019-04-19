import fetch from '@/config/fetch'
import router from '@/router'
import {check_login} from '@/config/mUtils'


export const examine_paper_list = data => fetch('/wenyuanjiaoyu/examine_paper/index', data, 'POST').then(check_login);
export const examine_paper_all_list = data => fetch('/wenyuanjiaoyu/examine_paper/get_all', data, 'POST').then(check_login);
export const examine_paper_edit = data => fetch('/wenyuanjiaoyu/examine_paper/edit', data, 'POST').then(check_login);
export const examine_paper_verify = data => fetch('/wenyuanjiaoyu/examine_paper/verify', data, 'POST').then(check_login);
export const examine_paper_del = data => fetch('/wenyuanjiaoyu/examine_paper/del', data, 'POST').then(check_login);
export const examine_paper_info = data => fetch('/wenyuanjiaoyu/examine_paper/info', data, 'POST').then(check_login);
export const examine_paper_sort = data => fetch('/wenyuanjiaoyu/examine_paper/sort', data, 'POST').then(check_login);
export const examine_paper_set_questions = data => fetch('/wenyuanjiaoyu/examine_paper/set_questions', data, 'POST').then(check_login);



