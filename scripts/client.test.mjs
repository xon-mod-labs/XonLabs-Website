import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
const fixture={slug:'test',name:'Test',repository:'owner/test',issuesEnabled:true,platforms:[]};
const issue=(n,state='open')=>({number:n,title:'Issue '+n,state,user:{login:'tester'},labels:[{name:'bug'}],created_at:'2026-01-01',updated_at:'2026-01-02',comments:1,body:'**Hello** <img src="x" onerror="alert(1)">',html_url:'https://github.com/owner/test/issues/'+n});
let count=0;
async function run(html,url,respond,project=fixture){
 const dom=new JSDOM(html,{url});
 for(const key of ['document','location','sessionStorage'])globalThis[key]=dom.window[key];
 globalThis.fetch=async url=>{if(url==='/data/config.json')return {ok:true,json:async()=>({site:{organization:'owner'},projects:[project]})};const result=respond(String(url));return {ok:result.status===undefined||result.status===200,status:result.status||200,json:async()=>result.data??result};};
 await import('../src/client.mjs?test='+count++);
 await new Promise(resolve=>setTimeout(resolve,25));
 return dom;
}
const response=url=>url.endsWith('/owner/test')?{has_issues:true}:url.includes('/releases')?[]:url.includes('/comments')?[{user:{login:'reply'},created_at:'2026-01-02',body:'A comment'}]:url.includes('/issues/1')?issue(1):[issue(1),issue(2,'closed'),{...issue(3),pull_request:{url:'pr'}}];
test('issue list excludes PRs and filters state, labels, and search',async()=>{
 const dom=await run('<div id="issue-app" data-slug="test"></div>','https://xonlabs.xyz/issues/test/',response);
 const doc=dom.window.document;assert.match(doc.querySelector('#issue-list').textContent,/Issue 1/);assert.doesNotMatch(doc.querySelector('#issue-list').textContent,/Issue 3|Issue 2/);
 const select=doc.querySelector('#issue-state');select.value='all';select.dispatchEvent(new dom.window.Event('input'));assert.match(doc.querySelector('#issue-list').textContent,/Issue 2/);assert.doesNotMatch(doc.querySelector('#issue-list').textContent,/Issue 3/);
 const input=doc.querySelector('#issue-search');input.value='missing';input.dispatchEvent(new dom.window.Event('input'));assert.match(doc.querySelector('#issue-list').textContent,/No issues/);
 assert.ok(doc.querySelector('#report-form'));dom.window.close();
});
test('direct issue fallback renders comments and sanitizes body',async()=>{
 const dom=await run('<div id="not-found"></div><div id="issue-fallback"></div>','https://xonlabs.xyz/issues/test/1/',response);
 assert.equal(dom.window.document.querySelector('#not-found').hidden,true);const root=dom.window.document.querySelector('#issue-fallback');assert.match(root.textContent,/Issue 1/);assert.match(root.textContent,/A comment/);assert.doesNotMatch(root.innerHTML,/onerror/);dom.window.close();
});
test('disabled GitHub Issues suppresses report form',async()=>{
 const dom=await run('<div id="issue-app" data-slug="test"></div>','https://xonlabs.xyz/issues/test/',url=>url.endsWith('/owner/test')?{has_issues:false}:[]);
 assert.match(dom.window.document.body.textContent,/disabled/);assert.equal(dom.window.document.querySelector('#report-form'),null);dom.window.close();
});
test('rate limit renders actionable fallback',async()=>{
 const dom=await run('<div id="issue-app" data-slug="test"></div>','https://xonlabs.xyz/issues/test/',()=>({status:429}));
 assert.match(dom.window.document.body.textContent,/API access is limited/);assert.ok(dom.window.document.querySelector('a[href="https://github.com/owner/test/issues"]'));dom.window.close();
});
test('unconfigured project never fetches an unrelated issue repository',async()=>{
 const urls=[];const dom=await run('<div id="issue-app" data-slug="test"></div>','https://xonlabs.xyz/issues/test/',url=>{urls.push(url);return [];},{...fixture,repository:null,issuesEnabled:false});
 assert.match(dom.window.document.body.textContent,/Issue reporting unavailable/);assert.deepEqual(urls,[]);dom.window.close();
});
