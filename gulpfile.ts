import {task} from "gulp";
import {GulpHtmlCompiler,GulpHtmlWatcher} from "./gulp_modules/tasks/htmlCompiler";
import {GulpSassCompiler,GulpSassWatcher} from "./gulp_modules/tasks/sassCompiler";
import {GulpTsCompiler,GulpTsWatcher} from "./gulp_modules/tasks/tsCompiler";
import serverStart from "./gulp_modules/servers/server";

/**
 * 개발 모드 태스크
 * HTML, SCSS, TypeScript 파일을 컴파일하고 파일 변경을 감시합니다.
 * @param done 완료 콜백 함수
 */
task("dev",async (done)=>{
    await GulpHtmlCompiler("./src/skins/**/skin.html");
    await GulpHtmlWatcher("./src/skins/**/skin.html");
    await GulpSassCompiler("./src/skins/**/style.scss");
    await GulpSassWatcher("./src/skins/**/*.scss");
    await GulpTsCompiler("./src/**/*.ts");
    await GulpTsWatcher("./src/**/*.ts");
    done();
});

/**
 * 서버 시작 태스크
 * 개발 서버를 시작합니다.
 * @param done 완료 콜백 함수
 */
task("serve",async (done)=>{
    await serverStart();
    done();
});