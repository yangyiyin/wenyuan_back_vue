/**
 * Created by yyy on 18/6/25.
 */
import { baseUrl } from './env'
export default {
    status_success : 100,
    upload_url:baseUrl + '/waibao/common/qiniu_upload?bucket=wenyuanjiaoyu',
    upload_url_local:'//api.yixsu.com/index.php' + '/waibao/common/local_upload?bucket=wenyuanjiaoyu',
    upload_video_url_local:'//api.yixsu.com/index.php' + '/waibao/common/local_upload?bucket=wenyuanjiaoyu_video',
    examination_daoru_excel_url:baseUrl + '/wenyuanjiaoyu/examination_signs/excel_in',
    examination_daoru_excel_out:baseUrl + '/wenyuanjiaoyu/examination_signs/excel_out',
    statistics_student_examinations_export:baseUrl + '/wenyuanjiaoyu/examination_signs/statistics_student_examinations_export',
    statistics_student_examinations:baseUrl + '/wenyuanjiaoyu/task/statisticsStudentExaminations',
    homework_result_excel_out:baseUrl + '/wenyuanjiaoyu/student_homework_result/excel_out',
    homework_result_excel_in:baseUrl + '/wenyuanjiaoyu/student_homework_result/teacher_suggest_excel_in',
    words_content_daoru_excel_in:baseUrl + '/wenyuanjiaoyu/words_content/excel_in',
    words_content_daochu_excel_out:baseUrl + '/wenyuanjiaoyu/words_content/excel_out',
    suggest_excel_out:baseUrl + '/wenyuanjiaoyu/suggest/excel_out',
    order_excel_out:baseUrl + '/wenyuanjiaoyu/order/excel_out',
    order_pay_left_log_excel_out:baseUrl + '/wenyuanjiaoyu/order_pay_left_log/excel_out',
    question_daoru_excel_url:baseUrl + '/wenyuanjiaoyu/question/excel_in',

    upload_examine_paper_zip_chunk:baseUrl + '/wenyuanjiaoyu/student_examine_result/upload_examine_paper_zip_chunk?bucket=wenyuanjiaoyu',

}