import {task} from "gulp";



import {GulpHtmlCompiler,GulpHtmlWatcher} from "./gulp_modules/tasks/htmlCompiler";
import {GulpSassCompiler,GulpSassWatcher} from "./gulp_modules/tasks/sassCompiler";
import {GulpTsCompiler,GulpTsWatcher} from "./gulp_modules/tasks/tsCompiler";
task("dev",async (done)=>{
    await GulpHtmlCompiler("./src/skins/**/skin.html");
    await GulpHtmlWatcher("./src/skins/**/skin.html");
    await GulpSassCompiler("./src/skins/**/style.scss");
    await GulpSassWatcher("./src/skins/**/*.scss");
    await GulpTsCompiler("./src/**/*.ts");
    await GulpTsWatcher("./src/**/*.ts");
    done();
});


import serverStart from "./gulp_modules/servers/server";
task("serve",async (done)=>{
    await serverStart();
    done();
});