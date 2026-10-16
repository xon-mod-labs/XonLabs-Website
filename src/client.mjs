import {escape as e, safeUrl, markdown} from './shared.mjs';
const $ = (s,root=document) => root.querySelector(s);
const $$ = (s,root=document) => [...root.querySelectorAll(s)];
const date = x => x ? new Date(x).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}) : 'Unavailable';
const number = x => Number.isFinite(x)?x.toLocaleString():'Unavailable';
const a = (url,text,cls='') => `<a class="${cls}" href="${e(safeUrl(url))}">${text}</a>`;
const errorText = err => e(err?.message || 'Data unavailable. Please try again later.');
const pending = new Map();
export async function api(url) {
 if (pending.has(url)) return pending.get(url);
 const work=(async()=>{
  try {const cached=JSON.parse(sessionStorage.getItem(url));if(cached && Date.now()-cached.time<300000)return cached.data;}catch{}
  const response=await fetch(url,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(15000)});
  if(!response.ok) {
   if(response.status===403||response.status===429)throw new Error('API access is limited. Please retry later or open the project on its source website.');
   if(response.status===404)throw new Error('This information is not publicly available.');
   throw new Error('The service is unavailable ('+response.status+'). Please retry later.');
  }
  const data=await response.json();try{sessionStorage.setItem(url,JSON.stringify({time:Date.now(),data}));}catch{}return data;
 })();pending.set(url,work);try{return await work;}finally{pending.delete(url);}
}
async function all(url) {const out=[];for(let page=1;page<=100;page++){const data=await api(url+(url.includes('?')?'&':'?')+'per_page=100&page='+page);out.push(...data);if(data.length<100)return out;}throw new Error('Dataset too large to display completely. Open GitHub for the full list.');}
const github = path => 'https://api.github.com/'+path;
const config = await fetch('/data/config.json').then(r=>{if(!r.ok)throw Error('Configuration unavailable');return r.json();});
const {site,projects}=config;
$$('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
$('.menu')?.addEventListener('click',()=>{const b=$('.menu'),open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(open));$('#navigation').classList.toggle('open',open);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){$('.menu')?.setAttribute('aria-expanded','false');$('#navigation')?.classList.remove('open');}});
if(location.pathname==='/discord/'||location.pathname==='/discord')location.replace(site.discord);
function stat(key,value){$$('[data-stat]').filter(el=>el.dataset.stat===key).forEach(el=>el.textContent=number(value));}
async function metadata(p){
 const [mod,versions,repo,releases]=await Promise.allSettled([
  p.modrinthId?api('https://api.modrinth.com/v2/project/'+p.modrinthId):Promise.resolve(null),
  p.modrinthId?api('https://api.modrinth.com/v2/project/'+p.modrinthId+'/version'):Promise.resolve([]),
  p.repository?api(github('repos/'+p.repository)):Promise.resolve(null),
  p.repository?all(github('repos/'+p.repository+'/releases')):Promise.resolve([])
 ]);
 return {mod:mod.value,versions:versions.value||[],repo:repo.value,releases:releases.value||[],errors:[mod,versions,repo,releases].filter(x=>x.status==='rejected').map(x=>x.reason)};
}
const projectData=new Map(projects.map(p=>[p.slug,metadata(p)]));
function releaseRows(releases){return releases.length?releases.map(r=>`<article class="release-row"><div><span class="release-dot"></span><strong>${e(r.name||r.tag_name||r.version_number)}</strong><span class="subtle">${date(r.published_at||r.date_published)}</span></div>${a(r.html_url||'https://modrinth.com/version/'+r.id,'View release ↗','text-link')}</article>`).join(''):'<p class="empty">No published releases yet.</p>';}
async function homepage(){
 if(!$('#stats-note'))return;
 try {const repos=await all(github('orgs/'+site.organization+'/repos?type=public'));stat('repos',repos.length);stat('stars',repos.reduce((n,r)=>n+r.stargazers_count,0));
  const releases=await Promise.all(repos.map(r=>all(github('repos/'+r.full_name+'/releases'))));stat('releases',releases.flat().length);
 }catch(err){['repos','stars','releases'].forEach(key=>{const el=$(`[data-stat="${key}"]`);if(el?.querySelector('.skeleton'))stat(key,null);});$('#stats-note').textContent=err.message;}
 const data=await Promise.all([...projectData.values()]);const configured=projects.filter(p=>p.modrinthId);const available=data.filter(d=>d.mod);
 stat('downloads',configured.length&&available.length===configured.length?available.reduce((n,d)=>n+d.mod.downloads,0):null);
 const updates=data.flatMap(d=>d.releases.length?d.releases:d.versions).sort((a,b)=>new Date(b.published_at||b.date_published)-new Date(a.published_at||a.date_published)).slice(0,5);
 $('#updates').innerHTML=updates.length?releaseRows(updates):data.some(d=>d.errors.length)?'<p class="empty">Release data unavailable. Please try again later.</p>':releaseRows([]);
}
homepage();
for(const p of projects) projectData.get(p.slug).then(d=>{
 const stable=d.versions.filter(v=>v.version_type==='release').sort((a,b)=>new Date(b.date_published)-new Date(a.date_published))[0]||d.releases.find(r=>!r.prerelease&&!r.draft);
 $$(`[data-version="${p.slug}"]`).forEach(el=>el.textContent=stable?.version_number||stable?.tag_name||p.versionFallback||'Version unavailable');
 const card=$(`[data-project="${p.slug}"]`);if(card)card.dataset.updated=d.mod?.updated||d.repo?.updated_at||'';
 if($('[data-project-stats]')){
  stat(p.slug+'-downloads',d.mod?.downloads);stat(p.slug+'-stars',d.repo?.stargazers_count);stat(p.slug+'-forks',d.repo?.forks_count);stat(p.slug+'-issues',null);
  if(d.repo?.has_issues&&p.issuesEnabled) all(github('repos/'+p.repository+'/issues?state=open')).then(items=>stat(p.slug+'-issues',items.filter(i=>!i.pull_request).length)).catch(()=>stat(p.slug+'-issues',null));
 }
 const details=$(`[data-project-details="${p.slug}"]`);
 if(details){$('[data-stable]',details).textContent=stable?.version_number||stable?.tag_name||p.versionFallback||'Unavailable';$('[data-released]',details).textContent=date(stable?.date_published||stable?.published_at);$('[data-game-versions]',details).textContent=d.mod?.game_versions?.join(', ')||'Unavailable';$('[data-project-error]',details).textContent=d.errors.map(err=>err.message).join(' ');}
 const releases=$(`[data-releases="${p.slug}"]`);
 if(releases){const items=d.versions.length?d.versions:d.releases;releases.innerHTML=items.length?items.map(r=>`<details class="panel release-detail"><summary><strong>${e(r.name||r.tag_name)}</strong><span>${e(r.version_number||r.tag_name)} · ${date(r.date_published||r.published_at)}</span></summary><div class="prose">${markdown(r.changelog||r.body||'No release notes provided.')}</div><div class="actions">${r.files?.length?r.files.map(f=>a(f.url,'Download '+e(f.filename),'button')).join(''):a(r.html_url,'View downloads on GitHub ↗','button')}</div><p class="data-note">${e((r.loaders||[]).join(', '))} ${e((r.game_versions||[]).join(', '))}</p></details>`).join(''): `<p class="empty">${d.errors.length?'Releases unavailable. Please try again later.':'No releases published.'}</p>`;decorateCode(releases);}
 const gallery=$(`[data-gallery="${p.slug}"]`);if(gallery&&d.mod?.gallery?.length)gallery.innerHTML='<h2>In action</h2>'+d.mod.gallery.map(g=>`<figure><img src="${e(safeUrl(g.url))}" alt="${e(g.title||p.name+' screenshot')}" loading="lazy"><figcaption>${e(g.description||g.title||'')}</figcaption></figure>`).join('');
 if($('#project-sort')?.value==='updated')filterProjects();
});
function filterProjects(){const query=$('#project-search').value.toLowerCase(),category=$('#project-category').value,status=$('#project-status').value;const cards=$$('[data-project]');cards.sort((a,b)=>$('#project-sort').value==='updated'?(b.dataset.updated||'').localeCompare(a.dataset.updated||''):a.dataset.name.localeCompare(b.dataset.name));let count=0;cards.forEach(card=>{card.hidden=!(card.dataset.name.toLowerCase().includes(query)&&(!category||card.dataset.category.split('|').includes(category))&&(!status||card.dataset.status===status));if(!card.hidden)count++;$('#project-grid').append(card);});$('#project-count').textContent=count+' project(s)'+($('#project-sort').value==='updated'?' · unavailable update dates appear last':'');$('#no-projects').hidden=count!==0;}
['project-search','project-category','project-status','project-sort'].forEach(id=>$('#'+id)?.addEventListener('input',filterProjects));
function decorateCode(root=document){$$('pre',root).forEach(pre=>{if($('button',pre))return;const b=document.createElement('button');b.textContent='Copy';b.className='copy';b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('code',pre)?.textContent||pre.textContent);b.textContent='Copied';}catch{b.textContent='Select text to copy';}setTimeout(()=>b.textContent='Copy',2500);});pre.append(b);});}
decorateCode();
if($('#doc-content')){
 const headings=$$('h2,h3',$('#doc-content'));headings.forEach((h,i)=>{h.id='section-'+i;$('#toc').insertAdjacentHTML('beforeend',a('#'+h.id,e(h.textContent),h.tagName==='H3'?'indent':''));});
 let docsPromise;
 $('#docs-search').addEventListener('input',async event=>{const query=event.target.value.trim().toLowerCase();const target=$('#docs-results');if(!query){target.replaceChildren();return;}try{docsPromise??=fetch('/data/docs.json').then(r=>r.json());const docs=await docsPromise;if($('#docs-search').value.trim().toLowerCase()!==query)return;target.innerHTML=docs.filter(d=>(d.title+' '+d.project+' '+d.content).toLowerCase().includes(query)).slice(0,10).map(d=>a(d.path,e(d.project+' · '+d.title))).join('')||'<p>No matching articles.</p>';}catch{target.textContent='Search unavailable. Browse the navigation below.';}});
}
for(const el of $$('[data-issue-count]')){const p=projects.find(p=>p.slug===el.dataset.issueCount);if(p?.repository&&p.issuesEnabled)try{const repo=await api(github('repos/'+p.repository));if(!repo.has_issues){el.textContent='GitHub Issues disabled';continue;}const items=(await all(github('repos/'+p.repository+'/issues?state=all'))).filter(x=>!x.pull_request);el.textContent=items.filter(x=>x.state==='open').length+' open · '+items.filter(x=>x.state==='closed').length+' closed';}catch(err){el.textContent=err.message;}}
function issueMeta(i){return `<span class="badge ${i.state==='open'?'green':'purple'}">${e(i.state)}</span><span>#${i.number} · ${e(i.user?.login||'Unknown author')} · Created ${date(i.created_at)} · Updated ${date(i.updated_at)} · ${number(i.comments)} comments</span><div class="tags">${(i.labels||[]).map(l=>`<span>${e(l.name)}</span>`).join('')}</div>`;}
function reportForm(p){return `<details class="panel report"><summary>Report an issue ↗</summary><p>Prepare a report, then review and submit it on GitHub. A GitHub account is required.</p><form id="report-form"><label>Issue type<select name="type"><option>Bug report</option><option>Feature request</option><option>Enhancement</option></select></label><label>Title<input name="title" required maxlength="180"></label>${[['description','Description'],['version','Project version'],...(p.minecraft?[['minecraft','Minecraft version'],['platform','Server platform / mod loader']]:[]),['steps','Steps to reproduce'],['expected','Expected behavior'],['actual','Actual behavior'],['logs','Error logs']].map(([name,label])=>`<label>${label}<textarea name="${name}" ${name==='description'?'required':''} rows="${name==='description'||name==='logs'?4:2}"></textarea></label>`).join('')}<p class="data-note">Remove passwords, tokens, and private player information from logs.</p><button class="button primary">Continue on GitHub ↗</button><p id="report-status" role="status"></p></form></details>`;}
async function issues(root,p,numberId){
 if(!p){root.innerHTML='<h1>Project not found</h1>'+a('/issues/','Browse issue trackers');return;}
 if(!p.repository||!p.issuesEnabled){root.innerHTML=`<div class="panel empty"><h2>Issue reporting unavailable</h2><p>A public GitHub issue tracker has not been configured for ${e(p.name)}.</p>${a('/discord/','Get help on Discord ↗','button')}${a('/projects/'+p.slug+'/','Project overview','button')}</div>`;return;}
 try{
  const repo=await api(github('repos/'+p.repository));if(!repo.has_issues){root.innerHTML='<div class="empty panel"><h2>Issue reporting unavailable</h2><p>This repository has GitHub Issues disabled.</p></div>';return;}
  if(numberId){const issue=await api(github('repos/'+p.repository+'/issues/'+numberId));if(issue.pull_request)throw Error('This is a pull request, not a project issue.');const comments=await all(github('repos/'+p.repository+'/issues/'+numberId+'/comments'));root.innerHTML=`<div class="breadcrumbs">${a('/issues/'+p.slug+'/',e(p.name)+' issues')} / #${numberId}</div><h1 class="issue-title">${e(issue.title)}</h1><div class="issue-meta">${issueMeta(issue)}</div><article class="panel prose">${markdown(issue.body||'No description provided.')}</article><h2 class="section">Discussion</h2>${comments.length?comments.map(c=>`<article class="panel comment"><div class="subtle">${e(c.user?.login)} · ${date(c.created_at)}</div><div class="prose">${markdown(c.body)}</div></article>`).join(''):'<p class="empty">No comments yet.</p>'}${a(issue.html_url,'Open on GitHub ↗','button primary')}`;decorateCode(root);document.title=issue.title+' — XonLabs';return;}
  const items=(await all(github('repos/'+p.repository+'/issues?state=all'))).filter(i=>!i.pull_request);
  root.innerHTML=`<div class="toolbar"><label>Search issues<input type="search" id="issue-search" placeholder="Search title or number…"></label><label>Status<select id="issue-state"><option value="open">Open</option><option value="closed">Closed</option><option value="all">All</option></select></label><label>Type<select id="issue-type"><option value="">All types</option><option value="bug">Bugs</option><option value="feature">Feature requests</option><option value="enhancement">Enhancements</option></select></label><label>Sort<select id="issue-sort"><option value="updated">Recently updated</option><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label></div><div id="issue-list" aria-live="polite"></div>${reportForm(p)}`;
  function render(){const query=$('#issue-search').value.toLowerCase(),state=$('#issue-state').value,type=$('#issue-type').value,sort=$('#issue-sort').value;const filtered=items.filter(i=>(state==='all'||i.state===state)&&(!type||i.labels.some(l=>l.name.toLowerCase().includes(type)))&&(i.title.toLowerCase().includes(query)||String(i.number).includes(query))).sort((a,b)=>sort==='oldest'?new Date(a.created_at)-new Date(b.created_at):new Date(b[sort==='updated'?'updated_at':'created_at'])-new Date(a[sort==='updated'?'updated_at':'created_at']));$('#issue-list').innerHTML=filtered.length?filtered.map(i=>`<article class="panel issue"><h2>${a('/issues/'+p.slug+'/'+i.number+'/',e(i.title))}</h2><div class="issue-meta">${issueMeta(i)}</div></article>`).join(''):'<div class="empty panel">No issues match these filters.</div>';}
  ['issue-search','issue-state','issue-type','issue-sort'].forEach(id=>$('#'+id).addEventListener('input',render));render();
  $('#report-form').addEventListener('submit',event=>{event.preventDefault();const f=new FormData(event.target);const body=[...f].filter(([key])=>key!=='title').map(([key,value])=>'### '+key+'\n'+value).join('\n\n');const url=new URL('https://github.com/'+p.repository+'/issues/new');url.searchParams.set('title',f.get('title'));url.searchParams.set('body',body);if(p.issueTemplates?.[f.get('type')])url.searchParams.set('template',p.issueTemplates[f.get('type')]);if(url.href.length>7500){$('#report-status').textContent='Your report is too long for a GitHub link. Shorten the logs or include a link to them.';return;}location.assign(url.href);});
 }catch(err){root.innerHTML=`<div class="empty panel"><h2>Unable to load issues</h2><p>${errorText(err)}</p>${a('https://github.com/'+p.repository+'/issues','Open tracker on GitHub ↗','button')}</div>`;}
}
const issueRoot=$('#issue-app');if(issueRoot)issues(issueRoot,projects.find(p=>p.slug===issueRoot.dataset.slug));
const match=location.pathname.match(/^\/issues\/([a-z0-9-]+)\/([1-9]\d*)\/?$/);
if(match&&$('#issue-fallback')){$('#not-found').hidden=true;issues($('#issue-fallback'),projects.find(p=>p.slug===match[1]),match[2]);}
