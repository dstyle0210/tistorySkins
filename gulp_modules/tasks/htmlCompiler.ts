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
 * @param _htmlRaw 원본 HTML 문자열
 * @returns 치환된 HTML 문자열
 */
const htmlToTattertools = (_htmlRaw:string) => {
    return _htmlRaw;
}

/**
 * 비동기 HTML 컴파일러
 * 파일을 읽어 치환 로직을 거친 후 dist 폴더에 저장합니다.
 * @param _path 파일 경로
 */
const asyncHtmlCompiler = async (_path:string) => {
    const HtmlRaw = htmlToTattertools( htmlToEjs( await fs.promises.readFile(_path, { encoding: 'utf-8' }) ) );
    const DistPath = _path.replace("\src","\dist");
    await fs.promises.mkdir(path.dirname(DistPath), { recursive: true });
    await fs.promises.writeFile(DistPath, HtmlRaw, { encoding: 'utf-8' });
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