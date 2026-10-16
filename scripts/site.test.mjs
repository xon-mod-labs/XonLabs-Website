import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {markdown,safeUrl,published} from '../src/shared.mjs';
test('untrusted Markdown cannot execute scripts or unsafe links',()=>{
 const output=markdown('<script>alert(1)</script><img src="x" onerror="alert(1)"> [bad](javascript:alert) <a href="//evil.test">bad</a><iframe src="https://evil.test"></iframe>');
 assert.doesNotMatch(output,/<script|onerror|href="javascript:|<iframe|href="\/\//i);
 assert.doesNotMatch(markdown('[bad](javascript:alert)'),/href="javascript:/i);
 assert.match(markdown('```js\nconst x = 1;\n```'),/hljs-keyword/);
 assert.equal(safeUrl('javascript:alert(1)'),'#');assert.equal(safeUrl('https://github.com/xon-mod-labs'),'https://github.com/xon-mod-labs');
});
test('unpublished projects are excluded',()=>assert.deepEqual(published([{published:false},{published:true,id:1}]),[{published:true,id:1}]));
async function files(dir){const out=[];for(const entry of await readdir(dir,{withFileTypes:true})){const path=dir+'/'+entry.name;if(entry.isDirectory())out.push(...await files(path));else out.push(path);}return out;}
test('generated HTML internal links and assets resolve',async()=>{
 for(const file of (await files('dist')).filter(p=>p.endsWith('.html'))){const html=await readFile(file,'utf8');for(const [,url] of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)){if(url.startsWith('//'))continue;const target=resolve('dist','.'+url);await assert.doesNotReject(stat(target),'Broken link '+url+' in '+file);}}
});
test('Pages routes, domain, logo, Discord and fallback are generated',async()=>{
 for(const file of ['index.html','projects/index.html','projects/announc/index.html','wiki/announc/index.html','issues/announc/index.html','discord/index.html','404.html','assets/Xonlabs.png'])assert.ok((await stat('dist/'+file)).size);
 assert.equal((await readFile('dist/CNAME','utf8')).trim(),'xonlabs.xyz');
 assert.match(await readFile('dist/discord/index.html','utf8'),/http-equiv="refresh" content="0;url=https:\/\/discord.gg\/tzB3pJt6Zg"/);
 assert.match(await readFile('dist/404.html','utf8'),/id="issue-fallback"/);
 const config=JSON.parse(await readFile('dist/data/config.json'));assert.equal(config.projects[0].modrinthId,'3ZoQg4i7');assert.equal(config.projects[0].repository,null);
});
