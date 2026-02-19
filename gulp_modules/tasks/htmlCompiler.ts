import fs from 'fs';
import path from 'path';
import {watch} from "gulp";
import globsLoop from '../utils/globsLoop';
import timeStamp from '../utils/timeStamp';


/**
 * 커스텀 Ejs 치환
 * @param _htmlRaw 원본 HTML 문자열
 * @returns 치환된 HTML 문자열
 */
const htmlToEjs = (_htmlRaw:string) => {
    return _htmlRaw;
}

/**
 * 테터툴즈 변수치환(preview 용)
 * 테터툴즈 치환자를 샘플 값으로 변경하여 미리보기용 HTML을 생성합니다.
 * @param _htmlRaw 원본 HTML 문자열
 * @returns 치환된 HTML 문자열
 */
const htmlToTattertools = (_htmlRaw:string) => {
    let html = _htmlRaw;

    // 기본 블로그 정보 치환
    html = html.replace(/\[##_page_title_##\]/g, '블로그 제목 - 포스트 제목');
    html = html.replace(/\[##_title_##\]/g, '블로그 제목');
    html = html.replace(/\[##_blog_link_##\]/g, '#');
    html = html.replace(/\[##_body_id_##\]/g, 'index');
    html = html.replace(/\[##_owner_url_##\]/g, '#');

    // 카테고리 및 메뉴 치환
    html = html.replace(/\[##_category_list_##\]/g, '<ul><li><a href="#">카테고리 1</a></li><li><a href="#">카테고리 2</a></li><li><a href="#">카테고리 3</a></li></ul>');
    html = html.replace(/\[##_blog_menu_##\]/g, '<ul><li><a href="#">메뉴 1</a></li><li><a href="#">메뉴 2</a></li></ul>');

    // 검색 관련 치환
    html = html.replace(/\[##_search_name_##\]/g, 'search');
    html = html.replace(/\[##_search_text_##\]/g, '');
    html = html.replace(/\[##_search_onclick_submit_##\]/g, 'return false;');

    // 변수 치환 (var_*)
    html = html.replace(/\[##_var_color-type_##\]/g, 'light');
    html = html.replace(/\[##_var_post-type_##\]/g, 'list');
    html = html.replace(/\[##_var_sns-pinterest_##\]/g, 'https://pinterest.com');
    html = html.replace(/\[##_var_sns-facebook_##\]/g, 'https://facebook.com');
    html = html.replace(/\[##_var_sns-twitter_##\]/g, 'https://twitter.com');
    html = html.replace(/\[##_var_sns-instagram_##\]/g, 'https://instagram.com');
    html = html.replace(/\[##_var_footer-image_##\]/g, '');
    html = html.replace(/\[##_var_footer-text_##\]/g, 'Footer Text');

    // 조건문 태그 처리 (<s_if_*>, <s_if_not_*>)
    // 조건문이 true인 경우 내용 표시, false인 경우 제거
    html = html.replace(/<s_if_var_color-type>([\s\S]*?)<\/s_if_var_color-type>/g, '$1');
    html = html.replace(/<s_if_var_post-type>([\s\S]*?)<\/s_if_var_post-type>/g, '$1');
    html = html.replace(/<s_if_var_view-more>([\s\S]*?)<\/s_if_var_view-more>/g, '');
    html = html.replace(/<s_if_var_sns-pinterest>([\s\S]*?)<\/s_if_var_sns-pinterest>/g, '$1');
    html = html.replace(/<s_if_var_sns-facebook>([\s\S]*?)<\/s_if_var_sns-facebook>/g, '$1');
    html = html.replace(/<s_if_var_sns-twitter>([\s\S]*?)<\/s_if_var_sns-twitter>/g, '$1');
    html = html.replace(/<s_if_var_sns-instagram>([\s\S]*?)<\/s_if_var_sns-instagram>/g, '$1');
    html = html.replace(/<s_if_var_footer-image>([\s\S]*?)<\/s_if_var_footer-image>/g, '');
    html = html.replace(/<s_if_var_footer-text>([\s\S]*?)<\/s_if_var_footer-text>/g, '$1');

    // s_cover 관련 치환 처리 (문서 구조에 맞게 순서대로 처리)
    // 1. s_cover_group 내부에서 s_cover_rep 처리
    html = html.replace(/<s_cover_group>([\s\S]*?)<\/s_cover_group>/g, function(match, content) {
        // s_cover_rep 내부의 각 s_cover 처리
        return content.replace(/<s_cover_rep>([\s\S]*?)<\/s_cover_rep>/g, function(match2, coverRepContent) {
            // 각 s_cover 태그 처리 (name 속성 포함)
            return coverRepContent.replace(/<s_cover\s+name=['"]([^'"]+)['"]>([\s\S]*?)<\/s_cover>/g, function(match3, coverName, coverContent) {
                // 커버 타이틀 치환
                let processedCover = coverContent.replace(/\[##_cover_title_##\]/g, '커버 제목');
                
                // s_cover_url 처리 (있는 경우에만 표시)
                processedCover = processedCover.replace(/<s_cover_url>([\s\S]*?)<\/s_cover_url>/g, function(match4, urlContent) {
                    return urlContent.replace(/\[##_cover_url_##\]/g, '#');
                });
                
                // s_cover_item 처리 (반복 - 샘플로 3개 생성)
                processedCover = processedCover.replace(/<s_cover_item>([\s\S]*?)<\/s_cover_item>/g, function(match5, itemContent) {
                    // 샘플 아이템 데이터 (3개 생성)
                    const sampleItems = [];
                    for (let i = 1; i <= 3; i++) {
                        let processedItem = itemContent;
                        
                        // s_cover_item_not_article_info 처리 (글이 아닌 경우)
                        processedItem = processedItem.replace(/<s_cover_item_not_article_info>([\s\S]*?)<\/s_cover_item_not_article_info>/g, function(match6, notArticleContent) {
                            return notArticleContent
                                .replace(/\[##_cover_item_title_##\]/g, `커버 아이템 제목 ${i}`)
                                .replace(/\[##_cover_item_summary_##\]/g, `커버 아이템 요약 ${i}`)
                                .replace(/\[##_cover_item_url_##\]/g, '#')
                                .replace(/\[##_cover_item_thumbnail_##\]/g, `https://localhost:3000/dummy/300x200?text=Item${i}`);
                        });
                        
                        // s_cover_item_article_info 처리 (글인 경우)
                        processedItem = processedItem.replace(/<s_cover_item_article_info>([\s\S]*?)<\/s_cover_item_article_info>/g, function(match7, articleContent) {
                            return articleContent
                                .replace(/\[##_cover_item_title_##\]/g, `포스트 제목 ${i}`)
                                .replace(/\[##_cover_item_summary_##\]/g, `포스트 요약 내용 ${i}입니다.`)
                                .replace(/\[##_cover_item_url_##\]/g, '#')
                                .replace(/\[##_cover_item_category_##\]/g, '카테고리')
                                .replace(/\[##_cover_item_category_url_##\]/g, '#')
                                .replace(/\[##_cover_item_date_##\]/g, '2024.01.01 12:00')
                                .replace(/\[##_cover_item_simple_date_##\]/g, '2024.01.01')
                                .replace(/\[##_cover_item_comment_count_##\]/g, '0')
                                .replace(/\[##_cover_item_thumbnail_##\]/g, `https://localhost:3000/dummy/300x200?text=Post${i}`);
                        });
                        
                        // s_cover_item_thumbnail 처리 (이미지가 있는 경우)
                        processedItem = processedItem.replace(/<s_cover_item_thumbnail>([\s\S]*?)<\/s_cover_item_thumbnail>/g, function(match8, thumbnailContent) {
                            return thumbnailContent.replace(/\[##_cover_item_thumbnail_##\]/g, `https://localhost:3000/dummy/300x200?text=Thumb${i}`);
                        });
                        
                        // 기본 치환자 처리 (태그 밖에 있는 경우)
                        processedItem = processedItem
                            .replace(/\[##_cover_item_title_##\]/g, `포스트 제목 ${i}`)
                            .replace(/\[##_cover_item_summary_##\]/g, `포스트 요약 내용 ${i}입니다.`)
                            .replace(/\[##_cover_item_url_##\]/g, '#')
                            .replace(/\[##_cover_item_category_##\]/g, '카테고리')
                            .replace(/\[##_cover_item_category_url_##\]/g, '#')
                            .replace(/\[##_cover_item_date_##\]/g, '2024.01.01 12:00')
                            .replace(/\[##_cover_item_simple_date_##\]/g, '2024.01.01')
                            .replace(/\[##_cover_item_comment_count_##\]/g, '0')
                            .replace(/\[##_cover_item_thumbnail_##\]/g, `https://localhost:3000/dummy/300x200?text=Thumb${i}`);
                        
                        sampleItems.push(processedItem);
                    }
                    return sampleItems.join('');
                });
                
                return processedCover;
            });
        });
    });
    
    // 남은 s_cover 태그들 제거 (처리되지 않은 경우)
    html = html.replace(/<s_cover_group>/g, '');
    html = html.replace(/<\/s_cover_group>/g, '');
    html = html.replace(/<s_cover_rep>/g, '');
    html = html.replace(/<\/s_cover_rep>/g, '');
    html = html.replace(/<s_cover\s+name=['"]([^'"]+)['"]>/g, '');
    html = html.replace(/<\/s_cover>/g, '');
    html = html.replace(/<s_cover_item>/g, '');
    html = html.replace(/<\/s_cover_item>/g, '');
    html = html.replace(/<s_cover_url>/g, '');
    html = html.replace(/<\/s_cover_url>/g, '');
    html = html.replace(/<s_cover_item_not_article_info>/g, '');
    html = html.replace(/<\/s_cover_item_not_article_info>/g, '');
    html = html.replace(/<s_cover_item_article_info>/g, '');
    html = html.replace(/<\/s_cover_item_article_info>/g, '');
    html = html.replace(/<s_cover_item_thumbnail>/g, '');
    html = html.replace(/<\/s_cover_item_thumbnail>/g, '');

    // 페이지 관련 치환
    html = html.replace(/\[##_list_conform_##\]/g, '전체 글');
    html = html.replace(/\[##_list_count_##\]/g, '10');
    html = html.replace(/\[##_revenue_list_upper_##\]/g, '');
    html = html.replace(/\[##_revenue_list_lower_##\]/g, '');

    // 게시글 관련 치환
    html = html.replace(/\[##_article_rep_title_##\]/g, '샘플 포스트 제목');
    html = html.replace(/\[##_article_rep_title_text_##\]/g, '샘플 포스트 제목');
    html = html.replace(/\[##_article_rep_link_##\]/g, '#');
    html = html.replace(/\[##_article_rep_desc_##\]/g, '<p>샘플 포스트 내용입니다. 이 부분은 실제 포스트 내용으로 대체됩니다.</p>');
    html = html.replace(/\[##_article_rep_summary_##\]/g, '포스트 요약 내용입니다.');
    html = html.replace(/\[##_article_rep_category_##\]/g, '카테고리');
    html = html.replace(/\[##_article_rep_author_##\]/g, '작성자');
    html = html.replace(/\[##_article_rep_date_##\]/g, '2024.01.01');
    html = html.replace(/\[##_article_rep_thumbnail_url_##\]/g, 'https://localhost:3000/dummy/300x200');
    html = html.replace(/\[##_article_rep_thumbnail_raw_url_##\]/g, 'https://localhost:3000/dummy/300x200');
    html = html.replace(/\[##_article_password_##\]/g, 'password');
    html = html.replace(/\[##_article_dissolve_##\]/g, 'return false;');

    // 공지사항 관련 치환
    html = html.replace(/\[##_notice_rep_title_##\]/g, '공지사항 제목');
    html = html.replace(/\[##__notice_rep_author_##\]/g, '관리자');
    html = html.replace(/\[##_notice_rep_date_##\]/g, '2024.01.01');
    html = html.replace(/\[##_notice_rep_desc_##\]/g, '<p>공지사항 내용입니다.</p>');

    // 태그 관련 치환
    html = html.replace(/\[##_tag_label_rep_##\]/g, '<a href="#">태그1</a> <a href="#">태그2</a> <a href="#">태그3</a>');
    html = html.replace(/\[##_tag_link_##\]/g, '#');
    html = html.replace(/\[##_tag_name_##\]/g, '태그');

    // 관련 글 치환
    html = html.replace(/\[##_article_related_rep_link_##\]/g, '#');
    html = html.replace(/\[##_article_related_rep_title_##\]/g, '관련 글 제목');
    html = html.replace(/\[##_article_related_rep_thumbnail_link_##\]/g, 'https://localhost:3000/dummy/300x200');
    html = html.replace(/<s_article_related_rep>([\s\S]*?)<\/s_article_related_rep>/g, function(match) {
        return match
            .replace(/\[##_article_related_rep_link_##\]/g, '#')
            .replace(/\[##_article_related_rep_title_##\]/g, '관련 글 제목')
            .replace(/\[##_article_related_rep_thumbnail_link_##\]/g, 'https://localhost:3000/dummy/300x200');
    });
    html = html.replace(/<s_article_related_rep_thumbnail>([\s\S]*?)<\/s_article_related_rep_thumbnail>/g, '$1');

    // 댓글 관련 치환
    html = html.replace(/\[##_comment_group_##\]/g, '<div class="comment-list"><p>댓글이 없습니다.</p></div>');
    html = html.replace(/\[##_guestbook_group_##\]/g, '<div class="guestbook-list"><p>방명록이 없습니다.</p></div>');

    // 페이지네이션 치환
    html = html.replace(/\[##_prev_page_##\]/g, 'href="#"');
    html = html.replace(/\[##_next_page_##\]/g, 'href="#"');
    html = html.replace(/\[##_no_more_prev_##\]/g, '');
    html = html.replace(/\[##_no_more_next_##\]/g, '');
    html = html.replace(/\[##_paging_rep_link_##\]/g, 'href="#"');
    html = html.replace(/\[##_paging_rep_link_num_##\]/g, '1');
    html = html.replace(/<s_paging_rep>([\s\S]*?)<\/s_paging_rep>/g, function(match) {
        return match
            .replace(/\[##_paging_rep_link_##\]/g, 'href="#"')
            .replace(/\[##_paging_rep_link_num_##\]/g, '1');
    });

    // 광고 관련 치환
    html = html.replace(/\[##_s_ad_isolation_##\]/g, '');

    // 반복문 태그 제거 (이미 처리된 경우)
    html = html.replace(/<s_t3>/g, '');
    html = html.replace(/<\/s_t3>/g, '');
    html = html.replace(/<s_search>/g, '');
    html = html.replace(/<\/s_search>/g, '');
    html = html.replace(/<s_list>/g, '');
    html = html.replace(/<\/s_list>/g, '');
    html = html.replace(/<s_article_protected>/g, '');
    html = html.replace(/<\/s_article_protected>/g, '');
    html = html.replace(/<s_article_rep>/g, '');
    html = html.replace(/<\/s_article_rep>/g, '');
    html = html.replace(/<s_index_article_rep>/g, '');
    html = html.replace(/<\/s_index_article_rep>/g, '');
    html = html.replace(/<s_permalink_article_rep>/g, '');
    html = html.replace(/<\/s_permalink_article_rep>/g, '');
    html = html.replace(/<s_article_rep_thumbnail>/g, '');
    html = html.replace(/<\/s_article_rep_thumbnail>/g, '');
    html = html.replace(/<s_page_rep>/g, '');
    html = html.replace(/<\/s_page_rep>/g, '');
    html = html.replace(/<s_notice_rep>/g, '');
    html = html.replace(/<\/s_notice_rep>/g, '');
    html = html.replace(/<s_tag>/g, '');
    html = html.replace(/<\/s_tag>/g, '');
    html = html.replace(/<s_tag_rep>/g, '');
    html = html.replace(/<\/s_tag_rep>/g, '');
    html = html.replace(/<s_tag_label>/g, '');
    html = html.replace(/<\/s_tag_label>/g, '');
    html = html.replace(/<s_guest>/g, '');
    html = html.replace(/<\/s_guest>/g, '');
    html = html.replace(/<s_paging>/g, '');
    html = html.replace(/<\/s_paging>/g, '');
    html = html.replace(/<s_article_related>/g, '');
    html = html.replace(/<\/s_article_related>/g, '');
    html = html.replace(/<s_rp>/g, '');
    html = html.replace(/<\/s_rp>/g, '');

    return html;
}

/**
 * build 할때 이쁘게(?) 정리하기
 * @param _htmlRaw 원본 HTML 문자열
 * @returns 치환된 HTML 문자열
 */
const prettyHtml = (_htmlRaw:string) => {
    return _htmlRaw;
}

/**
 * 비동기 HTML 컴파일러
 * 파일을 읽어 치환 로직을 거친 후 dist 폴더에 저장합니다.
 * @param _path 파일 경로
 */
const asyncHtmlCompiler = async (_path:string) => {
    const HtmlRaw = htmlToEjs( await fs.promises.readFile(_path, { encoding: 'utf-8' }) );

    // 스킨 HTML
    const skinHtml = prettyHtml(HtmlRaw);
    const skinPath = _path.replace("\src","\dist");

    // 미리보기 HTML
    let previewHtml = prettyHtml( htmlToTattertools( HtmlRaw ) );
    previewHtml = previewHtml.replace(/src=\"\/\/i1\.daumcdn\.net\/thumb\/C([0-9x]{7}).+\"/g, "src=\"https://localhost:3000/dummy/$1\"");
    const previewPath = skinPath.replace("skin.html","preview.html"); 

    await fs.promises.mkdir(path.dirname(skinPath), { recursive: true }); // 폴더 생성
    await fs.promises.writeFile(skinPath, skinHtml, { encoding: 'utf-8' }); // 스킨저장
    await fs.promises.writeFile(previewPath, previewHtml, { encoding: 'utf-8' }); // 미리보기 저장
}

/**
 * Gulp HTML 전체 컴파일 태스크
 * @param _globs 대상 파일 패턴
 */
const GulpHtmlCompiler = async (_globs):Promise<void> => {
    await globsLoop(_globs,async (entry)=>{
       await asyncHtmlCompiler(entry);
    });
    // console.log(`[${timeStamp()}] [GulpHtmlCompiler] 완료`);
};

/**
 * Gulp HTML 실시간 감시 태스크
 * @param _globs 대상 파일 패턴
 */
const GulpHtmlWatcher = (_globs):Promise<void> => {
    return new Promise((resolve,reject)=>{
        watch(_globs,{usePolling:true}).on("change",async (_path)=>{
            await asyncHtmlCompiler(_path);
            console.log(`[${timeStamp()}] [GulpHtmlWatcher] ${_path}`);
        }).on("ready",async () => {
            console.log(`[${timeStamp()}] [GulpHtmlWatcher] 준비완료`);
            resolve();
        });
    });
};


export {GulpHtmlCompiler,GulpHtmlWatcher};