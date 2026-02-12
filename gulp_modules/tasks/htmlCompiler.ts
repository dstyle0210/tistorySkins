import fs from 'fs';
import path from 'path';
import globsLoop from '../utils/globsLoop';

// 커스텀 Ejs 치환
const htmlToEjs = (_htmlRaw:string) => {
    return _htmlRaw;
}
// 테터툴즈 변수치환(preview 용)
const htmlToTattertools = (_htmlRaw:string) => {
    return _htmlRaw;
}
const asyncHtmlCompiler = async (_path:string) => {
    const HtmlRaw = htmlToTattertools( htmlToEjs( await fs.promises.readFile(_path, { encoding: 'utf-8' }) ) );
    const DistPath = _path.replace("\src","\dist");
    await fs.promises.mkdir(path.dirname(DistPath), { recursive: true });
    await fs.promises.writeFile(DistPath, HtmlRaw, { encoding: 'utf-8' });
}
const GulpHtmlCompiler = async (globs) => {
    await globsLoop(globs,async (entry)=>{
       await asyncHtmlCompiler(entry);
    });
}
export default GulpHtmlCompiler;