import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'
const globsLoop = async (globs:string,callback:(entry:string)=>any):Promise<string[]> => {
    return new Promise(async (resolve, reject)=>{
        const htmls = await glob(globs, { ignore: 'node_modules/**' });
        for await (const html of htmls) {
            await callback(html);
        };
        resolve(htmls);
    })
};
export default globsLoop;