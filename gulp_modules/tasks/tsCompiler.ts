import fs from 'fs';
import path from 'path';
import {src,dest,watch} from "gulp";
import ts from "gulp-typescript";
import globsLoop from '../utils/globsLoop';
import timeStamp from '../utils/timeStamp';

const tsProject = ts.createProject("tsconfig.json");

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

const GulpTsCompiler = async (_globs):Promise<void> => {
    await asyncTsCompiler(_globs);
    // console.log(`[${timeStamp()}] [asyncTsCompiler] 완료`);
};

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
