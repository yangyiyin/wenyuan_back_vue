import fetch from '@/config/fetch'

/**
 * 登陆
 */

export const login = data => fetch('/wenyuanjiaoyu/admin/login', data, 'POST');


