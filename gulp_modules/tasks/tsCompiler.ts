import fs from 'fs';
import path from 'path';
import {src,dest,watch} from "gulp";
import ts from "gulp-typescript";
import globsLoop from '../utils/globsLoop';
import timeStamp from '../utils/timeStamp';

/**
 * TypeScript 프로젝트 설정
 * tsconfig.json 파일을 기반으로 TypeScript 컴파일러 프로젝트를 생성합니다.
 */
const tsProject = ts.createProject("tsconfig.json");

/**
 * 비동기 TypeScript 컴파일러
 * TypeScript 파일을 JavaScript로 컴파일하여 dist 폴더에 저장합니다.
 * @param _path 컴파일할 파일 경로 또는 파일 패턴
 * @returns Promise<void> 컴파일 완료 시 resolve
 */
const asyncTsCompiler = (_path:string):Promise<void> => {
    return new Promise((resolve,reject)=>{
        src(_path,{base:"./src"})
        .pipe(tsProject())
        .pipe(dest("./dist"))
        .on("end",()=>{
            resolve();
        })
        .on("error",(err)=>{
            reject(err);
        });
    });
};

/**
 * Gulp TypeScript 전체 컴파일 태스크
 * 지정된 패턴의 모든 TypeScript 파일을 컴파일합니다.
 * @param _globs 대상 파일 패턴
 * @returns Promise<void> 컴파일 완료 시 resolve
 */
const GulpTsCompiler = async (_globs):Promise<void> => {
    await asyncTsCompiler(_globs);
    // console.log(`[${timeStamp()}] [asyncTsCompiler] 완료`);
};

/**
 * Gulp TypeScript 실시간 감시 태스크
 * 파일 변경을 감지하여 자동으로 재컴파일합니다.
 * @param _globs 감시할 파일 패턴
 * @returns Promise<void> 감시 준비 완료 시 resolve
 */
const GulpTsWatcher = (_globs):Promise<void> => {
    return new Promise((resolve,reject)=>{
        watch(_globs,{usePolling:true}).on("change",async (_path)=>{
            await asyncTsCompiler(_path);
            console.log(`[${timeStamp()}] [GulpTsWatcher] ${_path}`);
        }).on("ready",async () => {
            console.log(`[${timeStamp()}] [GulpTsWatcher] 준비완료`);
            resolve();
        });
    });
};

export {GulpTsCompiler,GulpTsWatcher};
