import {task} from "gulp";



import {GulpHtmlCompiler,GulpHtmlWatcher} from "./gulp_modules/tasks/htmlCompiler";
task("test",async (done)=>{
    await GulpHtmlCompiler("./src/skins/**/skin.html");
    await GulpHtmlWatcher("./src/skins/**/skin.html");
    done();
});


import serverStart from "./gulp_modules/servers/server";
task("serve",async (done)=>{
    await serverStart();
    done();
});