import fs from 'fs';
import path from 'path';
import {src,dest,watch} from "gulp";
import nodeSass from "sass";
import gulpSass from "gulp-sass";
import globsLoop from '../utils/globsLoop';
import timeStamp from '../utils/timeStamp';

/**
 * Gulp Sass 컴파일러 인스턴스
 * node-sass를 gulp-sass로 래핑한 컴파일러입니다.
 */
const Sass = gulpSass(nodeSass);

/**
 * 비동기 SCSS 컴파일러
 * SCSS 파일을 CSS로 컴파일하여 dist 폴더에 저장합니다.
 * @param _path 컴파일할 파일 경로 또는 파일 패턴
 * @returns Promise<void> 컴파일 완료 시 resolve
 */
const asyncSassCompiler = (_path:string):Promise<void> => {
    return new Promise((resolve,reject)=>{
        console.log('_path : '+_path);
        src(_path,{base:"./src"})
        .pipe(Sass())
        .pipe(dest("./dist"))
        .on("end",()=>{
            resolve();
        });
    });
};

/**
 * Gulp SCSS 전체 컴파일 태스크
 * 지정된 패턴의 모든 SCSS 파일을 컴파일합니다.
 * @param _globs 대상 파일 패턴
 * @returns Promise<void> 컴파일 완료 시 resolve
 */
const GulpSassCompiler = async (_globs):Promise<void> => {
    await asyncSassCompiler(_globs);
    // console.log(`[${timeStamp()}] [asyncSassCompiler] 완료`);
};

/**
 * Gulp SCSS 실시간 감시 태스크
 * 파일 변경을 감지하여 자동으로 재컴파일합니다.
 * @param _globs 감시할 파일 패턴
 * @returns Promise<void> 감시 준비 완료 시 resolve
 */
const GulpSassWatcher = (_globs):Promise<void> => {
    return new Promise((resolve,reject)=>{
        watch(_globs,{usePolling:true}).on("change",async (_path)=>{
            const scssFileName = path.basename(_path);
            const isStyleScss = scssFileName === 'style.scss'; // 스타일 SCSS 인지 여부
            const scssPath = (isStyleScss) ? _path : path.join( path.resolve( path.dirname(_path) , '..'), 'style.scss');

            await asyncSassCompiler(scssPath);
            console.log(`[${timeStamp()}] [GulpSassWatcher] ${scssPath}`);
        }).on("ready",async () => {
            console.log(`[${timeStamp()}] [GulpSassWatcher] 준비완료`);
            resolve();
        });
    });
};

export {GulpSassCompiler,GulpSassWatcher};