/* ===== Scary Town===== */
(function(){
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

/* ---------- جدول الإداريين ورتبهم (البيانات في roster.js) ---------- */
const GR=window.ST_GROUPS||[],RO=window.ST_ROSTER||{};
const nkey=s=>String(s||'').toLowerCase().replace(/^st\s*\|\s*/,'').replace(/[^\p{L}\p{N}]+/gu,'');
const initial=s=>([...String(s||'').replace(/[^\p{L}\p{N}]/gu,'')][0]||'?').toUpperCase();
const ROSTER_RANK={};
GR.forEach(([g,ranks])=>ranks.forEach(r=>(RO[r]||[]).forEach(nm=>{const k=nkey(nm);if(k&&!ROSTER_RANK[k])ROSTER_RANK[k]=r})));
const rankTotal=GR.reduce((s,[,r])=>s+r.length,0),admTotal=GR.reduce((s,[,ranks])=>s+ranks.reduce((t,r)=>t+(RO[r]||[]).length,0),0);
function renderRoster(){
  const q=($('rtQ').value||'').trim().toLowerCase(),hideEmpty=$('rtEmpty').checked;let n=0,html='';
  GR.forEach(([g,ranks])=>{let rows='',gm=0;
    ranks.forEach(r=>{const ppl=RO[r]||[];
      if(!ppl.length){if(hideEmpty||q)return;rows+=`<tr class="rt-empty"><td>—</td><td class="rt-n"><span class="rt-none">لا يوجد إداري في هذه الرتبة</span></td><td class="en"><span class="rk-pill">ST | ${esc(r)}</span></td></tr>`;return}
      ppl.forEach(nm=>{if(q&&!(nm.toLowerCase().includes(q)||r.toLowerCase().includes(q)))return;gm++;n++;
        rows+=`<tr><td>${String(n).padStart(2,'0')}</td><td class="rt-n"><span class="rt-av">${esc(initial(nm))}</span><b>${esc(nm)}</b></td><td class="en"><span class="rk-pill">ST | ${esc(r)}</span></td></tr>`})});
    if(rows)html+=`<tbody class="stg"><tr class="rt-g"><th colspan="3">${esc(g)}<em>${gm} إداري</em></th></tr>${rows}</tbody>`});
  $('allRanks').innerHTML=`<div class="tbl-wrap"><table class="rank-table rt"><thead><tr><th width="80">#</th><th>الإداري</th><th width="340">الرتبة</th></tr></thead>${html||'<tbody><tr><td colspan="3" class="empty">لا توجد نتائج</td></tr></tbody>'}</table></div>`;
  $('allRanks').querySelectorAll('.stg').forEach(stag);
}
$('rkTotal').textContent=rankTotal;$('memTotal').textContent=admTotal;cnt($('rkTotal'));cnt($('memTotal'));
$('rtQ').addEventListener('input',renderRoster);$('rtEmpty').addEventListener('change',renderRoster);
renderRoster();

/* ---------- المسؤوليات (مانجر + ديبوتي فقط) ---------- */
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
const mrow=(k,role,lab,dp,def)=>role?`<div class="who${dp?' dp':''}"><div class="av">${dp?'D':'M'}</div><div style="flex:1"><label>${lab} · ST | ${role}</label><input class="nm" list="names" data-m="${k}" placeholder="اكتب الاسم" value="${esc(MG[k]??def)}"></div></div>`:`<div class="who none">لا يوجد ديبوتي لهذا القسم</div>`;
$('deptGrid').innerHTML=D.map((d,i)=>`<div class="dept"><h3>${d[0]}</h3><small>${d[1]} Team</small><p>${d[4]}</p>${mrow('m'+i,d[2],'المانجر',0,d[5])}${mrow('d'+i,d[3],'الديبوتي',1,d[6])}</div>`).join('');
stag($('deptGrid'));
$('deptGrid').addEventListener('input',e=>{const k=e.target.dataset.m;if(k){MG[k]=e.target.value;save('st_mgr',MG);names()}});
$('deptCount').textContent=D.length;cnt($('deptCount'));

/* ---------- القوانين ---------- */
const RL=[["أولًا — التسلسل الإداري",["يُعتبر المشرف الأول المرجع الأساسي للإشراف على المسؤوليات، ومتابعة أداء المسؤولين وتقييمهم ضمن الصلاحيات المعتمدة.","يلتزم جميع المسؤولين بالتوجيهات والقرارات الصادرة من الإدارة العليا والمشرف الأول، وعدم مخالفتها دون الرجوع للجهة المختصة.","يُمنع تجاوز التسلسل الإداري أو التدخل في مسؤولية أخرى دون تنسيق أو إذن من المسؤول المختص."]],
["ثانيًا — الانضباط الإداري",["الالتزام بالتعاميم والقوانين الإدارية واجب، ويُمنع تجاهل التعليمات أو تعطيل تنفيذها.","يُمنع استغلال المنصب أو الصلاحيات لتحقيق مصالح شخصية أو تصفية الحسابات أو محاباة أي عضو.","يلتزم كل مسؤول بمتابعة مسؤوليته باستمرار، وعدم إهمال المهام أو تركها دون تسليم واضح."]],
["ثالثًا — إدارة الأعضاء",["يجب متابعة نشاط الأعضاء وتقييم أدائهم والتأكد من التزامهم بالمهام والقوانين.","لا يتم تعيين Supervisor أو منحه صلاحيات إلا بعد التأكد من كفاءته والتزامه واتباع آلية الموافقة المعتمدة.","يتحمل مسؤول المسؤولية مسؤولية متابعة المشرفين التابعين له، وتقييم أدائهم ومعالجة تقصيرهم ضمن صلاحياته."]],
["رابعًا — الجرد والتقارير",["يلتزم كل مسؤول بتقديم جرد دقيق يشمل الأعضاء والنشاط والأداء والمخالفات والنواقص وفق المواعيد المحددة.","يجب أن تكون التقارير صحيحة وواضحة، ويُمنع تزوير المعلومات أو إخفاء المخالفات أو تقديم بيانات مضللة.","يحق للمشرف الأول طلب تقارير إضافية أو جرد مفاجئ عند الحاجة، ويلتزم المسؤول بالتعاون وتقديم المعلومات المطلوبة."]],
["خامسًا — المخالفات والمحاسبة",["يجب توثيق المخالفات والإجراءات الإدارية المهمة، ويُمنع التستر على المخالفات أو اتخاذ عقوبات تعسفية دون مبررات واضحة.","يحق للمشرف مراجعة أداء أي مسؤول أو تقييم صلاحياته أو إعفاؤه عند ثبوت الإهمال أو تكرار التقصير أو إساءة استخدام الصلاحيات.","تُرفع الاعتراضات والشكاوى عبر الرومات المحدده وبأسلوب محترم، ويُمنع النقاشات فيها أو إثارة الفوضى بسبب القرارات."]]];
let rn=0;
const grp=(g,i,body)=>`<div class="rg${i===0?' open':''}"><button class="rg-h"><i></i>〢 ${g}</button><div class="rg-b"><div><div class="rg-in">${body}</div></div></div></div>`;
$('rulesList').innerHTML=RL.map(([g,l],i)=>grp(g,i,l.map(t=>`<div class="ru"><b>${++rn}</b><span>${t}</span></div>`).join(''))).join('');
const dots=l=>l.map(t=>`<div class="ru dot"><b></b><span>${t}</span></div>`).join('');
const nums=l=>l.map((t,i)=>`<div class="ru"><b>${i+1}</b><span>${t}</span></div>`).join('');
const RQ=[
["أولًا — المهام الأساسية",`<h5>1. إدارة المسؤولية والإشراف</h5>`+dots(["الإشراف الكامل على سير العمل ومتابعة تنفيذ المهام دون تأخير.","تنظيم العمل وتوزيع المهام على أعضاء الطاقم.","تعيين Supervisor عند الحاجة، بعد التأكد من كفاءته ونشاطه، وتحديد صلاحياته ومهامه.","متابعة أداء السوبرفايزر ومحاسبته عند التقصير.","عدم منح صلاحيات دون حاجة أو تجاوز الصلاحيات الممنوحة."])+`<h5>2. متابعة الأعضاء</h5>`+dots(["متابعة نشاط الأعضاء والتزامهم بالقوانين والتعليمات.","تقييم الأداء من حيث النشاط والجودة والانضباط.","رصد الغياب والتقصير والمخالفات، ورفع الحالات التي تتطلب تدخل الإدارة.","ترشيح المتميزين للترقية والمقصرين للتنبيه أو الإعفاء.","التأكد من معرفة كل عضو بمهامه وصلاحياته."])+`<h5>3. تطوير المسؤولية</h5>`+dots(["رصد الأخطاء والمشاكل والعمل على حلها.","تقديم اقتراحات لتحسين الأداء وتنظيم العمل.","تدريب الأعضاء الجدد ومتابعة تطورهم.","رفع الاحتياجات والنواقص التي تعيق سير العمل."])],
["ثانيًا — المتطلبات الإدارية",dots(["الالتزام بتعاميم وقرارات الإدارة العليا.","التواجد والمتابعة بما يتناسب مع حجم المسؤولية.","التعامل بعدل واحترافية دون محاباة أو استغلال للمنصب.","الحفاظ على سرية المعلومات والسجلات الإدارية.","توثيق المخالفات والتنبيهات والقرارات المهمة.","متابعة الشكاوى وعدم تجاهلها.","التعاون مع بقية المسؤولين والالتزام بمواعيد التقارير والجرد."])],
["ثالثًا — الجرد والتقارير",`<p>يلتزم كل مسؤول بإجراء جرد دوري كل اسبوعين و يشمل:</p>`+nums(["الأعضاء: العدد، النشاط، الغياب، والمقصرون.","الطاقم الإشرافي: الأسماء، المهام، النشاط، ومستوى الالتزام.","تقييم الأداء: المتميزون والمقصرون والمشاكل القائمة.","المخالفات: الحالات المسجلة والإجراءات والأدلة المتوفرة.","سير العمل: الإنجازات والمهام المتأخرة والنواقص.","التطوير: الاقتراحات والحلول وخطة العمل القادمة."])+`<p>يجب أن تكون التقارير واضحة ودقيقة ومدعومة بالأدلة عند الحاجة، ولا يُقبل الجرد الشكلي دون تقييم فعلي للشخص.</p>`],
["رابعًا — المحاسبة والإجراءات",dots(["توثيق حالات التقصير ومراجعتها قبل اتخاذ الإجراء.","معالجة المخالفات وفق الأنظمة والصلاحيات المعتمدة.","رفع المخالفات المتكررة أو الجسيمة للإدارة مع الأدلة.","يُمنع اتخاذ إجراءات تعسفية أو تجاوز الصلاحيات.","يحق للإدارة تقييم أي مسؤول أو إعفاؤه عند ثبوت عدم كفاءته أو إهماله."])],
["خامسًا — المطلوب حاليًا",`<p>على جميع المسؤولين:</p>`+dots(["مراجعة وضع المسؤولية وتحديد النواقص والمشاكل.","إعداد قائمة محدثة بالأعضاء والمشرفين أو تعيين مشرفين جدد.","تقييم النشاط والأداء والالتزام.","مراجعة صلاحيات الطاقم الإشرافي وتحديد الحاجة للتغيير.","تنظيم توزيع المهام وآلية متابعتها.","رفع تقرير شامل يتضمن الوضع الحالي والملاحظات والمخالفات وخطة التطوير.","الاستمرار في المتابعة بعد تسليم التقرير."])],
["سادسًا — المسؤولية والمحاسبة",`<p>منصب مسؤول المسؤولية ليس رتبة شكلية، بل تكليف يتطلب العمل والمتابعة وتحمل النتائج. لن يُعتمد على الوعود أو النشاط المؤقت، بل على الأداء الفعلي والالتزام المستمر.</p><p>أي مسؤول يهمل مسؤوليتَه، أو يتجاهل أعضاءه، أو يكرر التأخر في الجرد والتقارير، سيخضع للمحاسبة، وقد تُسحب منه المسؤولية وتُمنح لمن هو أكثر كفاءة.</p><p>الهدف هو ضمان كفاءة العمل، وانضباط الطاقم، ومعالجة كل تقصير بجدية.</p>`]];
$('reqList').innerHTML=RQ.map(([g,b],i)=>grp(g,i,b)).join('');
/* ---------- القوانين العامة (أكورديون) ---------- */
const GA=["يُمنع سحب إداري من روم دون إذنه مهما كان السبب.", "يُمنع سحب لاعب يتبع لإداري آخر دون أخذ إذنه.", "يُمنع سحب لاعب من قائمة الانتظار (الويتينق) ثم تجاهله.", "يُمنع ذكر سلبيات السيرفر أمام أي لاعب أو إداري آخر. في حال وجود مشكلة، يُرجى التواصل على الخاص أو فتح تذكرة رقابية أو طرحها في الشاتات المخصصة.", "يُمنع إعطاء دفن في قسم الدعم، ويُسمح فقط بإعطاء ميوت.", "يُمنع سب أو شتم أي لاعب أو إداري حتى لو كان صديقك، لأنه في حال الشكوى سيتم محاسبتك.", "يُمنع فك مشاركة الشاشة (السكرين) واللعب أو جمع الأصدقاء في روم سواء في الدعم أو غيره. إذا أردت اللعب، اذهب إلى البريك وقم بالدفن بدون مشاركة شاشة.", "بصفتك إداريًا، فأنت تمثل السيرفر داخل اللعبة وخارجها، وكثرة مخالفاتك قد تتحول إلى محاسبة إدارية إضافة إلى الادارة.", "دخولك في إحدى المسؤوليات أو استلامك لها يساعدك في الترقيات.", "يُمنع الدخول إلى روم والصراخ أو السب أو التلميح لأمور جنسية.", "يُمنع التطرق إلى الأمور الدينية أو القبلية أو الاجتماعية.", "في حال ارتكبت خطأ، يُمنع الإنكار أو التظاهر بعدم الفهم.", "يجب أن يكون التصوير (التسجيل) مفعلاً منذ دخولك السيرفر كإداري.", "احترام الرتب الأعلى منك والإداريين واللاعبين والرقابيين واجب أساسي. إن كنت لا تستطيع الالتزام بذلك، يُفضل الاستقالة.", "يُمنع التحدث بأسلوب سيء أو استفزاز اللاعبين أو أي شخص آخر.", "العلاقة بينك وبين اللاعب هي علاقة مساعدة فقط، لا أكثر ولا أقل.", "يُسمح الادارة بحظر الإداريين عند المخالفة.", "في حال مخالفتك للقوانين، ستكون محاسبتك مضاعفة.", "بصفتك لاعبًا وإداريًا، فأنت موافق على جميع شروط وأحكام وبنود وتعليمات السيرفر.", "عدم تفاعلك مع الرتبة الممنوحة لك قد يؤدي إلى سحبها ومحاسبتك.", "يُمنع طلب إجازة وأنت أصلًا تفاعلك ضعيف.", "أي استدعاء يصلك يجب التوجه إليه سواء كان إداري.", "شات الإدارة مخصص للتواصل بين الإداريين فقط، ويُمنع تحويله إلى مكان للمشاكل.", "القوانين قابلة للإضافة أو التعديل أو الحذف في أي وقت.", "مدة التحذير هي 3 أيام، وقد تزيد في بعض الحالات.", "دخول الاداره لا يقتصر على رتبة معينة.", "إعطاء نفسك ميوت ثم تجاهل قائمة الانتظار = تحذير.", "بعض القوانين قد لا تنطبق على الإدارة العليا.", "يُمنع إحضار صديق إلى روم البريك فقط للحديث.", "المحاسبة الرقابية تكون مضاعفة (2X).", "الاحترام والتحدث بصوت هادئ واجب عليك وليس خيارًا.", "إخراج لاعب قبل إنهاء مشكلته أو وضعه في دفن أثناء حديثه معك حتى لو لثانية قد يؤدي إلى الفصل، لأن ذلك يضر بسمعة السيرفر"];
const GT=["لا ترد على التكت وانت منشغل لانه غالبا  يحتاج فراغ ووقت ويمنع  اهمال التكت لساعات لأن هذا يعطي انطباع سيء عن الإدارة", "لا ترد على التكت قبل ما يطرح الشخص مشكلته بشكل كامل وخله يوضح جميع التفاصيل قبل تبدأ معه وبعدها ترد عليه مره وحده ويمنع تكثر الكلام يرجى ارسالها مره وحده وبتوضيح", "إذا رديت على شخص وما رد خلال 3 ساعات أرسل تنبيه داخل التكت بأنه راح يتقفل خلال 6 ساعات إذا ما كان فيه أي رد يحق لك تقفيل التكت بشكل كامل", "يمنع منعًا باتًا التدخل باي تكت مستلمه اداري اخر ويرجى اخذ الاذن منه داخل التكت لمنع الفوضى بالتكت والتداخل", "إذا التكت يحتاج مسؤول لا تحوله إلا بعد ما تجمع جميع التفاصيل وتوضح المشكلة بشكل كامل وبعدها ينتقل للمسؤول يكمل التكت", "يمنع منعًا باتًا إهمال أي تكت حتى لو تحول لمسؤولين أو مبرمجين لازم تتابع المشكله وأي إهمال عليه محاسبة شديده", "يمنع توجيه الشخص للدعم الفني ويرجى استكمال الموضوع بالتكت ولا يتصعد الموضوع لروم صوتي او عبر الخاص", "إذا الشخص فتح تكت وما كتب مشكلته يرجى اعطاءه تنبيه وفي حال مارد لمده 6 ساعات يحق لك تقفيل التكت دون الرجوع اليه", "إذا ما تعرف حل المشكلة أو ما عندك خلفية عنها راجع الموضوع مع الاداره واستفسر باسرع وقت", "يمنع اقفال اي تكت لاداري اخر ومن غير اخذ اذنه ومن يحق له فعل ذالك مسوؤلين التكتات", "تعامل مع الجميع باحترام مهما كانت طريقة الشخص ولا تدخل في أي نقاش أو جدال خارج نطاق المشكلة", "اقرأ التكت كامل قبل ترد وتأكد إنك فاهم المشكلة حتى ما تطلب معلومات سبق وكتبها صاحب التكت", "إذا احتجت وقت للتأكد من معلومة أو مراجعة شيء بلغ صاحب التكت حتى يعرف أن التكت تحت المتابعة ويرجى ابلاغه بالصيغه الاتيه ::QUOTE::التكت تحت المراجعه والتدقيق من قبل المسوؤلين في حال الانتهاء سيتم ابلاغك وفي حال مرت 3  ساعات ولم ياتيك قرار يحق لك المنشن والاستفسار عن موضوعك", "يمنع إعطاء أي وعود أو قرارات نهائية إلا إذا كنت متأكد منها أو عندك صلاحية بذلك", "حافظ على سرية محتوى التكت ويمنع نقل أي معلومات أو صور أو محادثات خارج التكت بدون إذن من المسؤولين", "إذا انحلت المشكلة تأكد من رضا صاحب التكت قبل إغلاقه،ولا تستعجل في الإقفال", "في حال تكرر فتح التكت لنفس المشكلة راجع التكتات السابقة قبل تبدأ من جديد حتى ما تضيع وقت الطرفين", "إذا لاحظت إساءة استخدام للتكتات أو فتح تكتات بدون سبب ارفع الموضوع للمسؤولين ولا تتصرف من نفسك", "أي إجراء يتم داخل التكت لازم يكون واضح ومبرر وفي حال احتجت تصعيد الموضوع يكون فيه شرح كامل للمسؤول المستلم"];
const gnum=(l,q)=>l.map((t,i)=>{let x=t,extra='';if(x.includes('::QUOTE::')){const p=x.split('::QUOTE::');x=p[0];extra=`<div class="callout" style="margin:10px 0 0">${p[1]}</div>`}return`<div class="ru"><b>${i+1}</b><span>${x}${extra}</span></div>`}).join('');
$('genList').innerHTML=grp('قوانين التعامل مع التكتات',0,gnum(GT)+`<div class="callout warn">ملاحظة: أي مخالفة لهذه التعليمات أو التقصير في متابعة التكتات يعرّض الإداري للمساءلة واتخاذ الإجراء المناسب حسب ما يراه المسؤولون.</div>`)+grp('قوانين الإدارة في السيرفر',1,gnum(GA));


/* ---------- بيانات الجرد (للقراءة فقط — لقائمة المتصدرين). نظام الجرد نفسه صار في Staff.html ---------- */
const INV={
ban:{n:"مسؤولية الباند",f:[["acc","عدد القبول"],["rej","عدد الرفض"]]},
spec:{n:"مسؤولية السبكتيت",f:[["att","عدد ارفاق الباند"],["hrs","ساعاته الرقابية"],["pull","طلب سحب والهيل"]]},
oth:{n:"المسؤوليات الباقية",f:[["pts","نقاطه في المسؤولية"]],dept:["التفعيل","الإنترفيو","اللوق","التكتات","التفتيش"]},
adm:{n:"جرد الإدارة",f:[["a_ban","نقاطه في الباند"],["a_int","نقاطه في الإنترفيو"],["a_spec","نقاطه في السبكتيت"],["a_log","نقاطه في اللوق"],["a_tkp","نقاطه في التكتات"],["a_hrs","عدد الساعات"],["a_pull","عدد السحب"],["a_tk","عدد التكتات"]]}};
let IV=load('st_inv3',{ban:[],spec:[],oth:[]});IV.adm=IV.adm||[];
let MU=load('st_mu3',{ban:{acc:1,rej:1},spec:{att:1,hrs:1,pull:1},oth:{pts:1}});MU.adm=Object.assign({a_ban:1,a_int:1,a_spec:1,a_log:1,a_tkp:1,a_hrs:1,a_pull:1,a_tk:1},MU.adm||{});
const score=(k,r)=>Math.round(INV[k].f.reduce((s,[f])=>s+(+r.v[f]||0)*(MU[k][f]??1),0)*100)/100;

/* ---------- قائمة المتصدرين (Top 10 من بيانات الجرد) ---------- */
const fmtN=v=>(Math.round(v*100)/100).toLocaleString('en');
function lbData(){
  const m=new Map();
  Object.keys(INV).forEach(k=>(IV[k]||[]).forEach(r=>{const key=nkey(r.name);if(!key)return;
    const e=m.get(key)||{name:String(r.name).trim().replace(/^st\s*\|\s*/i,''),pts:0,n:0,rate:0,rank:''};
    e.pts+=score(k,r);e.n++;e.rate+=(+r.rate||0);if(r.rank&&!e.rank)e.rank=r.rank;m.set(key,e)}));
  return [...m.entries()].map(([key,e])=>({...e,rank:ROSTER_RANK[key]||e.rank,avg:e.n?e.rate/e.n:0}))
    .filter(e=>e.pts>0).sort((a,b)=>b.pts-a.pts||b.avg-a.avg||a.name.localeCompare(b.name)).slice(0,10);
}
function renderLB(){
  const d=lbData(),top=d.length?d[0].pts:0;
  $('lbList').innerHTML=d.length?d.map((e,i)=>`<li class="lb-i p${i+1}" style="--i:${i};--w:${Math.max(5,Math.round(e.pts/top*100))}%"><span class="lb-pos">${i+1}</span><span class="lb-av">${esc(initial(e.name))}</span><span class="lb-m"><b>${esc(e.name)}</b><small><span class="lb-rk">${e.rank?'ST | '+esc(e.rank):'بدون رتبة'}</span><i class="lb-d"></i><span class="lb-n">${e.n} جرد</span><i class="lb-d"></i><span class="lb-st">★ ${e.avg.toFixed(1)}</span></small><i class="lb-bar"><u></u></i></span><span class="lb-pt"><b>${fmtN(e.pts)}</b><small>نقطة</small></span></li>`).join(''):`<li class="lb-empty"><b>لا توجد بيانات بعد</b><span>أضف جرد الإداريين من نظام الجرد لتظهر هنا قائمة أفضل 10 إداريين متفاعلين.</span></li>`;
}
const lbWrap=$('lbWrap'),lbBtn=$('lbBtn'),lbPanel=$('lbPanel');
function lbPlace(){if(innerWidth<=640){lbPanel.style.top=lbPanel.style.left='';return}
  const r=lbBtn.getBoundingClientRect(),w=lbPanel.offsetWidth||430;
  lbPanel.style.top=Math.round(r.bottom+16)+'px';lbPanel.style.left=Math.round(Math.min(Math.max(12,r.left),innerWidth-w-12))+'px'}
function lbOpen(o){if(o)lbPlace();lbWrap.classList.toggle('open',o);lbPanel.classList.toggle('open',o);lbBtn.setAttribute('aria-expanded',o?'true':'false')}
lbBtn.addEventListener('click',e=>{e.stopPropagation();lbOpen(!lbPanel.classList.contains('open'))});
document.addEventListener('click',e=>{if(!e.target.closest('#lbWrap,#lbPanel'))lbOpen(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')lbOpen(false)});
addEventListener('resize',()=>{if(lbPanel.classList.contains('open'))lbPlace()});
addEventListener('scroll',()=>{if(lbPanel.classList.contains('open'))lbPlace()},{passive:true});
renderLB();
addEventListener('storage',e=>{if(e.key==='st_inv3'||e.key==='st_mu3'){IV=load('st_inv3',{ban:[],spec:[],oth:[]});IV.adm=IV.adm||[];MU=load('st_mu3',MU);renderLB()}});
/* names datalist */
function names(){const s=new Set();Object.values(RO).flat().forEach(v=>v&&s.add(v));Object.values(MG).forEach(v=>v&&s.add(v));D.forEach((d,i)=>{[d[5],d[6]].forEach(v=>v&&s.add(v))});$('names').innerHTML=[...s].map(v=>`<option value="${esc(v)}">`).join('')}
names();
document.querySelectorAll('.stg').forEach(stag);
})();
