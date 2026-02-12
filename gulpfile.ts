import {task} from "gulp";



import {GulpHtmlCompiler,GulpHtmlWatcher} from "./gulp_modules/tasks/htmlCompiler";
task("test",async (done)=>{
    await GulpHtmlCompiler("./src/skins/**/*.html");
    await GulpHtmlWatcher("./src/skins/**/*.html");
    done();
});