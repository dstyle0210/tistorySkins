import fs from 'fs';
import path from 'path';
import {src,dest,watch} from "gulp";
import nodeSass from "sass";
import gulpSass from "gulp-sass";
import globsLoop from '../utils/globsLoop';
import timeStamp from '../utils/timeStamp';
const Sass = gulpSass(nodeSass);

const asyncSassCompiler = (_path:string):Promise<void> => {
    return new Promise((resolve,reject)=>{
        src(_path,{base:"./src"})
        .pipe(Sass())
        .pipe(dest("./dist"))
        .on("end",()=>{
            resolve();
        });
    });
};

const GulpSassCompiler = async (_globs):Promise<void> => {
    await asyncSassCompiler(_globs);
    // console.log(`[${timeStamp()}] [asyncSassCompiler] 완료`);
};

const GulpSassWatcher = (_globs):Promise<void> => {
    return new Promise((resolve,reject)=>{
        watch(_globs,{usePolling:true}).on("change",async (_path)=>{
            await asyncSassCompiler(_path);
            console.log(`[${timeStamp()}] [GulpSassWatcher] ${_path}`);
        }).on("ready",async () => {
            console.log(`[${timeStamp()}] [GulpSassWatcher] 준비완료`);
            resolve();
        });
    });
};

export {GulpSassCompiler,GulpSassWatcher};