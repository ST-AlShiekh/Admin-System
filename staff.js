/* ===== Scary Town — صفحة الجرد والسترايكات (محمية بكلمة مرور) ===== */
/* ملاحظة: الحماية هنا من جهة المتصفح فقط (تخفي الصفحة عن الزوار العاديين) — ليست حماية خوادم. */
(function(){
const H=s=>{let a=0xdeadbeef,b=0x41c6ce57;for(let i=0,c;i<s.length;i++){c=s.charCodeAt(i);a=Math.imul(a^c,2654435761);b=Math.imul(b^c,1597334677)}
  a=Math.imul(a^(a>>>16),2246822507)^Math.imul(b^(b>>>13),3266489909);b=Math.imul(b^(b>>>16),2246822507)^Math.imul(a^(a>>>13),3266489909);
  return (4294967296*(2097151&b)+(a>>>0)).toString(36)+s.length};
const KEY='o5167pqiv66',SS='st_inv_gate';
let booted=false;
function unlock(){
  document.body.classList.remove('locked');document.body.classList.add('unlocked');
  const g=document.getElementById('gate');if(g)g.hidden=true;
  if(!booted){booted=true;boot()}
}
function lock(){try{sessionStorage.removeItem(SS)}catch(e){}location.reload()}
document.addEventListener('DOMContentLoaded',()=>{
  const f=document.getElementById('gateForm'),inp=document.getElementById('gatePw'),err=document.getElementById('gateErr'),card=document.getElementById("gateForm");
  try{if(sessionStorage.getItem(SS)===KEY)return unlock()}catch(e){}
  setTimeout(()=>inp&&inp.focus(),80);
  f.addEventListener('submit',e=>{e.preventDefault();
    if(H(inp.value)===KEY){try{sessionStorage.setItem(SS,KEY)}catch(e){}unlock()}
    else{err.textContent='كلمة المرور غير صحيحة';card.classList.remove('shake');void card.offsetWidth;card.classList.add('shake');inp.value='';inp.focus()}});
  inp.addEventListener('input',()=>err.textContent='');
});
document.addEventListener('click',e=>{if(e.target.closest('#invLock'))lock()});

function boot(){
document.querySelectorAll('.reveal').forEach((el,i)=>setTimeout(()=>el.classList.add('visible'),60+i*40));
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const load=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const stag=root=>root&&[...root.children].forEach((c,i)=>c.style.setProperty('--i',Math.min(i,14)));

/* ---------- tabs ---------- */
function ind(tabs){const a=tabs.querySelector('.tab.active'),i=tabs.querySelector('.ind');if(a&&i){i.style.width=a.offsetWidth+'px';i.style.right=(tabs.offsetWidth-a.offsetLeft-a.offsetWidth-1)+'px'}}
function openTab(tabs,id){
  tabs.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.t===id));
  const box=tabs.closest('section');box.querySelectorAll('.tpanel').forEach(p=>p.classList.toggle('active',p.id===id));
  ind(tabs);box.querySelectorAll('#'+id+' .stg').forEach(stag);
}
document.querySelectorAll('.tabs').forEach(t=>{t.insertAdjacentHTML('afterbegin','<span class="ind"></span>');t.addEventListener('click',e=>{const b=e.target.closest('.tab');if(b)openTab(t,b.dataset.t)});setTimeout(()=>ind(t),60)});
addEventListener('resize',()=>document.querySelectorAll('.tabs').forEach(ind));
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(!g)return;const [sec,tab]=g.dataset.go.split(':');const s=$(sec);if(!s)return;
  if(tab)openTab(s.querySelector('.tabs'),tab);s.scrollIntoView({behavior:'smooth'})});
/* accordion */
document.addEventListener('click',e=>{const h=e.target.closest('.acc-h,.rg-h');if(h)h.parentElement.classList.toggle('open')});
document.addEventListener('click',e=>{const b=e.target.closest('[data-all]');if(!b)return;const p=$(b.dataset.all);const open=b.dataset.s!=='1';p.querySelectorAll('.rg,.acc').forEach(x=>x.classList.toggle('open',open));b.dataset.s=open?'1':'0';b.textContent=open?'إغلاق الكل':'فتح الكل'});
/* ripple + spotlight + tilt */
document.addEventListener('click',e=>{const b=e.target.closest('.ad-btn');if(!b)return;const r=b.getBoundingClientRect(),s=document.createElement('span');s.className='rp';const d=Math.max(r.width,r.height);s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;b.appendChild(s);setTimeout(()=>s.remove(),600)});
document.addEventListener('mousemove',e=>{const c=e.target.closest('.dept,.chan');if(!c)return;const r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');
  if(c.classList.contains('dept')){c.style.transform=`perspective(900px) rotateX(${((y/r.height)-.5)*-6}deg) rotateY(${((x/r.width)-.5)*6}deg) translateY(-4px)`}});
document.addEventListener('mouseout',e=>{const c=e.target.closest&&e.target.closest('.dept');if(c&&!c.contains(e.relatedTarget))c.style.transform=''});
/* scroll bar + embers */
const sb=document.createElement('div');sb.id='scrollBar';document.body.appendChild(sb);
addEventListener('scroll',()=>{sb.style.width=(scrollY/(document.documentElement.scrollHeight-innerHeight)*100)+'%'},{passive:true});
const cv=document.createElement('canvas');cv.id='fxEmbers';document.body.appendChild(cv);const cx=cv.getContext('2d');let P=[];
function rs(){cv.width=innerWidth;cv.height=innerHeight;P=Array.from({length:Math.min(70,innerWidth/14)},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*1.8+.4,v:Math.random()*.4+.1,a:Math.random()*6,d:Math.random()*.6-.3}))}
rs();addEventListener('resize',rs);
(function f(){cx.clearRect(0,0,cv.width,cv.height);P.forEach(p=>{p.y-=p.v;p.x+=Math.sin(p.a)*.3+p.d*.2;p.a+=.02;if(p.y<-5){p.y=cv.height+5;p.x=Math.random()*cv.width}cx.fillStyle=`rgba(255,${90+p.r*40|0},90,${.25+.35*Math.sin(p.a*2)})`;cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.fill()});requestAnimationFrame(f)})();
/* count-up */
const cio=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;const el=en.target,t=+el.dataset.count,s=performance.now();cio.unobserve(el);(function u(n){const p=Math.min((n-s)/1200,1);el.textContent=Math.round(t*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(u)})(s)}),{threshold:.3});
const cnt=el=>{el.dataset.count=el.textContent;el.textContent='0';cio.observe(el)};

const GR=window.ST_GROUPS||[],RO=window.ST_ROSTER||{};
const nkey=s=>String(s||'').toLowerCase().replace(/^st\s*\|\s*/,'').replace(/[^\p{L}\p{N}]+/gu,'');
const initial=s=>([...String(s||'').replace(/[^\p{L}\p{N}]/gu,'')][0]||'?').toUpperCase();
const ROSTER_RANK={};
GR.forEach(([g,ranks])=>ranks.forEach(r=>(RO[r]||[]).forEach(nm=>{const k=nkey(nm);if(k&&!ROSTER_RANK[k])ROSTER_RANK[k]=r})));
const D=[
["التذاكر","Tickets","Tickets Manager","","متابعة التكتات والرد عليها، وهو القسم المشترك لجميع الإداريين.","Mlo",""],
["المراقبة","Spectate","Spectate Manager","Deputy Spectate Manager","مراقبة اللاعبين واستدعاء المخالفين وتنبيههم وتحذيرهم.","Maan",""],
["الباند","Banned","Banned Manager","Deputy Banned Manager","مراجعة قرارات الحظر وطلبات فك الباند بعدالة.","meLon",""],
["المقابلات","Interview","Interview Manager","Deputy Interview Manager","المقابلات الإدارية والقبول الإداري المبدئي.","TYM",""],
["التفعيل","Activation","Activation Manager","Deputy Activation Manager","تفعيل اللاعبين والتأكد من معرفتهم بالقوانين.","Faisal",""],
["اللوقات","Log","Log Manager","","مراجعة سجلات السيرفر ورصد التجاوزات والأخطاء.","abo soso",""],
["التفتيش","HackHunter","HackHunter Manager","","مكافحة الغش والبرامج غير المصرح بها.","Al-Shiekh",""],
["المتجر","Store","Store Manager","","إدارة المتجر ومتابعة الطلبات.","Sami",""],
["النقل","Transfer","Transfer Manager","","متابعة طلبات النقل والتحويل.","Noone",""],
["الدعم","Support","Support Manager","","دعم اللاعبين والإشراف على رتبة الدعم.","Sami",""],
];
let MG=load('st_mgr',{});
/* ---------- نظام الجرد ---------- */
const INV={
ban:{n:"مسؤولية الباند",f:[["acc","عدد القبول"],["rej","عدد الرفض"]]},
spec:{n:"مسؤولية السبكتيت",f:[["att","عدد ارفاق الباند"],["hrs","ساعاته الرقابية"],["pull","طلب سحب والهيل"]]},
oth:{n:"المسؤوليات الباقية",f:[["pts","نقاطه في المسؤولية"]],dept:["التفعيل","الإنترفيو","اللوق","التكتات","التفتيش"]},
adm:{n:"جرد الإدارة",f:[["a_ban","نقاطه في الباند"],["a_int","نقاطه في الإنترفيو"],["a_spec","نقاطه في السبكتيت"],["a_log","نقاطه في اللوق"],["a_tkp","نقاطه في التكتات"],["a_hrs","عدد الساعات"],["a_pull","عدد السحب"],["a_tk","عدد التكتات"]]}};
const RANKS=["Support","Trial Mod","Mod","Senior Mod","Trial","Trusted","Skilled","Supervisor","Expert","Staff","Operator","Admin","Super Admin"];
const RK_DEF={"Support":100,"Trial Mod":150,"Mod":200,"Senior Mod":250,"Trial":300,"Trusted":350,"Skilled":400,"Supervisor":500,"Expert":600,"Staff":700,"Operator":800,"Admin":1000,"Super Admin":0};
let RK=Object.assign({},RK_DEF,load('st_rk3',{}));
let IV=load('st_inv3',{ban:[],spec:[],oth:[]});IV.adm=IV.adm||[];
let MU=load('st_mu3',{ban:{acc:1,rej:1},spec:{att:1,hrs:1,pull:1},oth:{pts:1}});MU.adm=Object.assign({a_ban:1,a_int:1,a_spec:1,a_log:1,a_tkp:1,a_hrs:1,a_pull:1,a_tk:1},MU.adm||{});
const ps=()=>{save('st_inv3',IV);save('st_mu3',MU);save('st_rk3',RK)};
const score=(k,r)=>Math.round(INV[k].f.reduce((s,[f])=>s+(+r.v[f]||0)*(MU[k][f]??1),0)*100)/100;
const stars=(r,id)=>`<span class="stars" data-id="${id}">${[1,2,3,4,5].map(i=>`<button data-s="${i}" class="${i<=r?'on':''}" aria-label="${i}">★</button>`).join('')}</span>`;
function invTpl(k,r){const c=INV[k];const L={acc:"عدد قبول الباند",rej:"عدد رفض الباند",att:"عدد ارفاق الباند",hrs:"عدد ساعاته الرقابيه",pull:"عدد طلب سحب والهيل",pts:"عدد نقاطه في المسؤولية",a_ban:"نقاطه في الباند",a_int:"نقاطه في الإنترفيو",a_spec:"نقاطه في السبكتيت",a_log:"نقاطه في اللوق",a_tkp:"نقاطه في التكتات",a_hrs:"عدد الساعات",a_pull:"عدد السحب",a_tk:"عدد التكتات"};
  return[`اسم الإداري : ${r.name}`].concat(r.rank?[`الرتبة : ${r.rank}`]:[],c.dept?[`المسؤولية : ${r.dept}`]:[],c.f.map(([f])=>`${L[f]} : ${r.v[f]||0}`),[`اي ملاحظه اخرى : ${r.note||'-'}`,`تقييمه في المسؤولية : ${r.rate}/5`]).join('\n')}
const promo=(k,r)=>{const pts=score(k,r);if(!r.rank)return'<span class="promo none">اختر الرتبة</span>';const need=+RK[r.rank]||0,i=RANKS.indexOf(r.rank),nx=RANKS[i+1];if(!need)return'<span class="promo none">'+(nx?'حدد نقاط الترقية':'أعلى رتبة')+'</span>';const p=Math.min(100,Math.round(pts/need*100));return pts>=need?`<span class="promo ok">✓ جاهز للترقية${nx?' → '+nx:''}</span><div class="pbar"><i style="width:100%"></i></div>`:`<span class="promo">${pts} / ${need}</span><div class="pbar"><i style="width:${p}%"></i></div>`};
const rankSel=(v,attr)=>`<select class="ad-input" ${attr}><option value="">— الرتبة —</option>${RANKS.map(x=>`<option${x===v?' selected':''}>${x}</option>`).join('')}</select>`;
function updPromo(k){IV[k].forEach(r=>{const el=document.querySelector(`#tb_${k} tr[data-id="${r.id}"] [data-promo]`);if(el)el.innerHTML=promo(k,r)})}
function renderInv(k){
  const c=INV[k],rows=IV[k];
  $('mu_'+k).innerHTML=c.f.map(([f,l])=>`<label>${l} × <input class="ad-input n" type="number" step="0.1" data-mu="${k}.${f}" value="${MU[k][f]??1}"></label>`).join('');
  const sum=rows.reduce((s,r)=>s+score(k,r),0),avg=rows.length?rows.reduce((s,r)=>s+r.rate,0)/rows.length:0;
  $('kp_'+k).innerHTML=`<div class="kpi"><b>${rows.length}</b><span>عدد الجرد</span></div><div class="kpi"><b>${Math.round(sum*100)/100}</b><span>مجموع النقاط</span></div><div class="kpi"><b>${avg.toFixed(1)}</b><span>متوسط التقييم / 5</span></div>`;
  $('tb_'+k).innerHTML=rows.map(r=>`<tr data-id="${r.id}"><td><input class="ad-input" list="names" data-f="name" value="${esc(r.name)}"></td>${c.dept?`<td><select class="ad-input" data-f="dept">${c.dept.map(d=>`<option${d===r.dept?' selected':''}>${d}</option>`).join('')}</select></td>`:''}${c.f.map(([f])=>`<td><input class="ad-input n" type="number" min="0" data-v="${f}" value="${r.v[f]||0}"></td>`).join('')}<td class="pts" data-pts>${score(k,r)}</td><td>${rankSel(r.rank||'','data-f="rank"')}</td><td class="promo-c" data-promo>${promo(k,r)}</td><td>${stars(r.rate,r.id)}</td><td><input class="ad-input note-i" data-f="note" placeholder="ملاحظة" value="${esc(r.note)}"></td><td style="white-space:nowrap"><button class="ad-btn" data-copy="${r.id}">نسخ</button> <button class="ad-btn red" data-del="${r.id}">حذف</button></td></tr>`).join('')||`<tr><td colspan="14" class="empty">لا يوجد جرد بعد. أضف أول إداري من الأعلى.</td></tr>`;
  stag($('tb_'+k));
}
Object.keys(INV).forEach(k=>{
  const c=INV[k],p=$('inv_'+k);
  $('hd_'+k).innerHTML=`<tr><th>الإداري</th>${c.dept?'<th>المسؤولية</th>':''}${c.f.map(([,l])=>`<th>${l}</th>`).join('')}<th>النقاط</th><th>الرتبة</th><th>الترقية</th><th>التقييم</th><th>ملاحظة</th><th></th></tr>`;
  $('ad_'+k).innerHTML=`<input class="ad-input" id="nm_${k}" list="names" placeholder="اسم الإداري">${c.dept?`<select class="ad-input" id="dp_${k}" style="flex:0 0 160px">${c.dept.map(d=>`<option>${d}</option>`).join('')}</select>`:''}<select class="ad-input" id="rk_${k}" style="flex:0 0 170px"><option value="">— الرتبة —</option>${RANKS.map(x=>`<option>${x}</option>`).join('')}</select><button class="ad-btn pri" data-add="${k}">إضافة للجرد</button><button class="ad-btn" data-copyall="${k}">نسخ الجرد كامل</button><button class="ad-btn red" data-clr="${k}">مسح</button>`;
  p.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
    if(t.dataset.add){const nm=$('nm_'+k).value.trim();if(!nm)return $('nm_'+k).focus();IV[k].push({id:Date.now(),name:nm,dept:c.dept?$('dp_'+k).value:'',rank:$('rk_'+k).value||ROSTER_RANK[nkey(nm)]||'',v:{},rate:3,note:''});$('nm_'+k).value='';ps();renderInv(k);names()}
    if(t.dataset.del&&confirm('حذف هذا السجل؟')){IV[k]=IV[k].filter(r=>r.id!=t.dataset.del);ps();renderInv(k)}
    if(t.dataset.clr&&confirm('مسح كل جرد '+c.n+'؟')){IV[k]=[];ps();renderInv(k)}
    if(t.dataset.s){const id=t.parentElement.dataset.id,r=IV[k].find(x=>x.id==id);r.rate=+t.dataset.s;ps();renderInv(k)}
    const cp=(txt,b)=>{(navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).catch(()=>{}).finally(()=>{const o=b.textContent;b.textContent='تم النسخ ✓';setTimeout(()=>b.textContent=o,1200)})};
    if(t.dataset.copy)cp(invTpl(k,IV[k].find(r=>r.id==t.dataset.copy)),t);
    if(t.dataset.copyall)cp(`〢 ${c.n}\n\n`+IV[k].map(r=>invTpl(k,r)).join('\n\n'),t)});
  p.addEventListener('input',e=>{const tr=e.target.closest('tr[data-id]');
    if(e.target.dataset.mu){const[kk,f]=e.target.dataset.mu.split('.');MU[kk][f]=+e.target.value||0;ps();const keep=document.activeElement;renderInvKeep(k);return}
    if(!tr)return;const r=IV[k].find(x=>x.id==tr.dataset.id);const d=e.target.dataset;
    if(d.f)r[d.f]=e.target.value;if(d.v)r.v[d.v]=+e.target.value||0;ps();tr.querySelector('[data-pts]').textContent=score(k,r);tr.querySelector('[data-promo]').innerHTML=promo(k,r);if(d.f==='name')names();kp(k)});
  renderInv(k);
});
function kp(k){const rows=IV[k],sum=rows.reduce((s,r)=>s+score(k,r),0),avg=rows.length?rows.reduce((s,r)=>s+r.rate,0)/rows.length:0;const b=$('kp_'+k).querySelectorAll('b');b[1].textContent=Math.round(sum*100)/100;b[2].textContent=avg.toFixed(1)}
function renderInvKeep(k){const rows=IV[k];rows.forEach(r=>{const tr=document.querySelector(`#tb_${k} tr[data-id="${r.id}"] [data-pts]`);if(tr)tr.textContent=score(k,r)});updPromo(k);kp(k)}

/* ---------- نقاط الترقية لكل رتبة ---------- */
function renderRk(){$('rkPts').innerHTML=RANKS.map((r,i)=>`<label class="rk"><span><b>${i+1}</b>${r}</span><input class="ad-input n" type="number" min="0" data-rk="${r}" value="${RK[r]||''}" placeholder="0"></label>`).join('')}
renderRk();
$('rkPts').addEventListener('input',e=>{const r=e.target.dataset.rk;if(!r)return;RK[r]=+e.target.value||0;ps();Object.keys(INV).forEach(updPromo)});
$('rkReset').onclick=()=>{if(!confirm('إعادة نقاط الترقية للقيم الافتراضية؟'))return;RK=Object.assign({},RK_DEF);ps();renderRk();Object.keys(INV).forEach(updPromo)};

/* ---------- السترايكات ---------- */
const ACTION={1:"تنبيه",2:"إنذار نهائي",3:"سحب المسؤولية"};
let ST=load('st_str3',[]);
$('stDept').innerHTML=D.map(d=>`<option>${d[0]}</option>`).join('');
function renderSt(){
  $('stBody').innerHTML=ST.map(a=>{const c=a.s.length;return`<tr><td>${esc(a.name)}</td><td>${esc(a.dept)}</td><td><span class="pill ${c?'s'+Math.min(c,3):'s0'}">${c?'Strike '+c:'نظيف'}</span>${c?`<div style="font-size:11px;color:#8f98b3;margin-top:4px">${ACTION[Math.min(c,3)]}</div>`:''}</td><td><div class="chips">${a.s.map((x,i)=>`<span class="chip">#${i+1} ${esc(x.r)} · ${esc(x.d)}</span>`).join('')||'<span style="color:#8f98b3">لا توجد استرايكات</span>'}</div></td><td style="white-space:nowrap"><button class="ad-btn pri" data-sa="${a.id}">+ سترايك</button> <button class="ad-btn" data-sr="${a.id}">− إزالة</button> <button class="ad-btn red" data-sd="${a.id}">حذف</button></td></tr>`}).join('')||'<tr><td colspan="5" class="empty">لا يوجد مسؤولين في سجل السترايكات. أضف أول مسؤول من الأعلى.</td></tr>';
  const q=n=>ST.filter(a=>n===3?a.s.length>=3:a.s.length===n).length;
  $('kp_st').innerHTML=`<div class="kpi"><b>${ST.reduce((s,a)=>s+a.s.length,0)}</b><span>إجمالي السترايكات</span></div><div class="kpi"><b>${q(1)}</b><span>Strike 1</span></div><div class="kpi"><b>${q(2)}</b><span>Strike 2</span></div><div class="kpi"><b>${q(3)}</b><span>Strike 3 </span></div>`;
  stag($('stBody'));
}
$('stAdd').onclick=()=>{const nm=$('stName').value.trim();if(!nm)return $('stName').focus();ST.push({id:Date.now(),name:nm,dept:$('stDept').value,s:[]});$('stName').value='';save('st_str3',ST);renderSt();names()};
$('stBody').addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=t.dataset;
  if(d.sa){const a=ST.find(x=>x.id==d.sa),r=prompt('سبب السترايك؟');if(r===null)return;a.s.push({r:r.trim()||'بدون سبب',d:new Date().toLocaleDateString('ar-EG')});save('st_str3',ST);renderSt();if(a.s.length>=3)alert(a.name+' وصل إلى Strike '+a.s.length+' → '+ACTION[3])}
  if(d.sr){ST.find(x=>x.id==d.sr).s.pop();save('st_str3',ST);renderSt()}
  if(d.sd&&confirm('حذف من السجل؟')){ST=ST.filter(x=>x.id!=d.sd);save('st_str3',ST);renderSt()}});
/* names datalist */
function names(){const s=new Set();Object.values(RO).flat().forEach(v=>v&&s.add(v));Object.values(MG).forEach(v=>v&&s.add(v));D.forEach((d,i)=>{[d[5],d[6]].forEach(v=>v&&s.add(v))});Object.values(IV).flat().forEach(r=>s.add(r.name));ST.forEach(a=>s.add(a.name));$('names').innerHTML=[...s].map(v=>`<option value="${esc(v)}">`).join('')}
renderSt();names();
document.querySelectorAll('.stg').forEach(stag);
}
})();
