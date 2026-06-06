function openLink(u){window.open(u,'_blank')}

// CURSOR
const cur=document.getElementById('cur'),ring=document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx-4+'px';cur.style.top=my-4+'px'});
(function loop(){rx+=(mx-rx-16)*.12;ry+=(my-ry-16)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop)})();
document.querySelectorAll('a,button,.pc,.sk-chip,.form-submit,.n-toggle').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.style.transform='scale(2)';ring.style.transform='scale(1.5)'});
  el.addEventListener('mouseleave',()=>{cur.style.transform='scale(1)';ring.style.transform='scale(1)'});
});

// PARTICLES
const cv=document.getElementById('pcv'),ctx=cv.getContext('2d');
function rsz(){cv.width=window.innerWidth;cv.height=window.innerHeight}rsz();
window.addEventListener('resize',rsz);
const dots=Array.from({length:55},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,r:Math.random()*1.4+.4}));
(function ploop(){
  ctx.clearRect(0,0,cv.width,cv.height);
  dots.forEach(d=>{d.x+=d.vx;d.y+=d.vy;if(d.x<0||d.x>cv.width)d.vx*=-1;if(d.y<0||d.y>cv.height)d.vy*=-1;ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fillStyle='rgba(99,179,237,.5)';ctx.fill()});
  for(let i=0;i<dots.length;i++)for(let j=i+1;j<dots.length;j++){const dx=dots[i].x-dots[j].x,dy=dots[i].y-dots[j].y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<110){ctx.beginPath();ctx.moveTo(dots[i].x,dots[i].y);ctx.lineTo(dots[j].x,dots[j].y);ctx.strokeStyle=`rgba(59,130,246,${.08*(1-dist/110)})`;ctx.lineWidth=.5;ctx.stroke()}}
  requestAnimationFrame(ploop);
})();

// TYPEWRITER
const roles=['Associate Data Analyst','SQL & Python Specialist','Power BI Developer','Financial Data Analyst','Machine Learning Engineer','Big Data Practitioner'];
let ri=0,ci=0,del=false;const tw=document.getElementById('tw');
function tloop(){const r=roles[ri];if(!del){tw.textContent=r.slice(0,++ci);if(ci===r.length){del=true;setTimeout(tloop,2400);return}setTimeout(tloop,62)}else{tw.textContent=r.slice(0,--ci);if(ci===0){del=false;ri=(ri+1)%roles.length}setTimeout(tloop,25)}}

// COUNTER
function cnt(el,target,suf,dur){let v=0,step=target/60;const t=setInterval(()=>{v+=step;if(v>=target){v=target;clearInterval(t)}el.textContent=Math.floor(v)+(suf||'')},dur/60)}

// TREND CHART DATA
const trendData=[
  {yr:'2003',cs:50,eco:180},{yr:'2004',cs:65,eco:190},{yr:'2005',cs:80,eco:210},
  {yr:'2006',cs:110,eco:230},{yr:'2007',cs:130,eco:260},{yr:'2008',cs:160,eco:840},
  {yr:'2009',cs:180,eco:580},{yr:'2010',cs:200,eco:430},{yr:'2011',cs:220,eco:440},
  {yr:'2012',cs:240,eco:360},{yr:'2013',cs:260,eco:80},{yr:'2014',cs:290,eco:130},
  {yr:'2015',cs:320,eco:150},{yr:'2016',cs:380,eco:160},{yr:'2017',cs:450,eco:170},
  {yr:'2018',cs:520,eco:190},{yr:'2019',cs:650,eco:730},{yr:'2020',cs:860,eco:130},
  {yr:'2021',cs:1202,eco:1100}
];
const deptData=[
  {name:'Economics',val:4100,color:'linear-gradient(90deg,#06B6D4,#67E8F9)'},
  {name:'Public Admin',val:3800,color:'linear-gradient(90deg,#3B82F6,#93C5FD)'},
  {name:'Pharmacy',val:3400,color:'linear-gradient(90deg,#8B5CF6,#C4B5FD)'},
  {name:'Computer Sci',val:3100,color:'linear-gradient(90deg,#10B981,#6EE7B7)'},
  {name:'Mathematics',val:2600,color:'linear-gradient(90deg,#F59E0B,#FDE68A)'},
  {name:'Commerce',val:2500,color:'linear-gradient(90deg,#EF4444,#FCA5A5)'},
];

function getChartWidth(el){
  const wrap=el?.closest('.chart-wrap');
  const rect=wrap?wrap.getBoundingClientRect():el?.getBoundingClientRect();
  const w=rect?.width||window.innerWidth-48;
  return Math.max(260,Math.floor(w));
}

function buildChart(includeDept=true){
  const chart=document.getElementById('trend-chart');
  if(!chart)return;
  chart.innerHTML='';
  const svgNS='http://www.w3.org/2000/svg';
  const w=Math.max(520,chart.clientWidth||720);
  const h=220;
  const pad={l:36,r:12,t:12,b:36};
  const svg=document.createElementNS(svgNS,'svg');
  svg.setAttribute('width','100%');svg.setAttribute('height',h);
  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);

  const maxVal=Math.max(...trendData.map(d=>Math.max(d.cs,d.eco)));
  const stepX = (w - pad.l - pad.r) / (trendData.length - 1);

  function buildPath(key){
    let d='';
    trendData.forEach((pt,i)=>{
      const x = pad.l + i * stepX;
      const val = pt[key];
      const y = pad.t + (1 - val/maxVal) * (h - pad.t - pad.b);
      d += (i===0?`M ${x} ${y}`:` L ${x} ${y}`);
    });
    return d;
  }

  // gradients
  const defs = document.createElementNS(svgNS,'defs');
  const g1 = document.createElementNS(svgNS,'linearGradient'); g1.id='grad-cs'; g1.setAttribute('x1','0'); g1.setAttribute('x2','1');
  g1.innerHTML=`<stop offset="0%" stop-color="#60A5FA"/><stop offset="100%" stop-color="#93C5FD"/>`;
  const g2 = document.createElementNS(svgNS,'linearGradient'); g2.id='grad-eco'; g2.setAttribute('x1','0'); g2.setAttribute('x2','1');
  g2.innerHTML=`<stop offset="0%" stop-color="#06B6D4"/><stop offset="100%" stop-color="#67E8F9"/>`;
  defs.appendChild(g1); defs.appendChild(g2); svg.appendChild(defs);

  // cs path
  const pathCS = document.createElementNS(svgNS,'path');
  pathCS.setAttribute('d', buildPath('cs'));
  pathCS.setAttribute('fill','none'); pathCS.setAttribute('stroke','url(#grad-cs)');
  pathCS.setAttribute('stroke-width','3'); pathCS.setAttribute('stroke-linecap','round'); pathCS.setAttribute('stroke-linejoin','round');
  pathCS.setAttribute('class','trend-path cs');
  svg.appendChild(pathCS);

  // eco path
  const pathEco = document.createElementNS(svgNS,'path');
  pathEco.setAttribute('d', buildPath('eco'));
  pathEco.setAttribute('fill','none'); pathEco.setAttribute('stroke','url(#grad-eco)');
  pathEco.setAttribute('stroke-width','3'); pathEco.setAttribute('stroke-linecap','round'); pathEco.setAttribute('stroke-linejoin','round');
  pathEco.setAttribute('class','trend-path eco');
  svg.appendChild(pathEco);

  trendData.forEach((pt,i)=>{
    const x=pad.l+i*stepX;
    const txt=document.createElementNS(svgNS,'text');
    txt.setAttribute('x',x);txt.setAttribute('y',h-6);txt.setAttribute('font-size','9');txt.setAttribute('fill','#94A3B8');txt.setAttribute('text-anchor','middle');
    txt.textContent=pt.yr;
    svg.appendChild(txt);
  });

  // markers and tooltips (simple)
  function addMarkers(key, cls){
    trendData.forEach((pt,i)=>{
      const x = pad.l + i * stepX;
      const val = pt[key];
      const y = pad.t + (1 - val/maxVal) * (h - pad.t - pad.b);
      const c = document.createElementNS(svgNS,'circle');
      c.setAttribute('cx',x); c.setAttribute('cy',y); c.setAttribute('r',3.2); c.setAttribute('fill', cls==='cs'?'#60A5FA':'#06B6D4'); c.setAttribute('opacity','0'); c.setAttribute('class',`m-${cls}`);
      svg.appendChild(c);
    });
  }
  addMarkers('cs','cs'); addMarkers('eco','eco');

  chart.appendChild(svg);

  if(includeDept){
    const deptC=document.getElementById('dept-bars');
    if(deptC){
      deptC.innerHTML='';
      deptData.forEach(d=>{
        const row=document.createElement('div');row.className='dept-bar-row';
        row.innerHTML=`<div class="dept-lbl">${d.name}</div>
          <div class="dept-bar-bg"><div class="dept-fill" data-w="${Math.round(d.val/4100*100)}%" style="background:${d.color}"><span class="dept-val">${(d.val/1000).toFixed(1)}K</span></div></div>`;
        deptC.appendChild(row);
      });
    }
  }
}

function animateChart(){
  // animate SVG stroke drawing
  document.querySelectorAll('.trend-path').forEach((p,i)=>{
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
    p.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.2,.8,.2,1)';
    setTimeout(()=>{p.style.strokeDashoffset = '0'}, i*220 + 120);
  });
  // fade in markers
  setTimeout(()=>{document.querySelectorAll('.m-cs,.m-eco').forEach(c=>c.setAttribute('opacity','1'))},900);
  document.querySelectorAll('.dept-fill').forEach((f,i)=>{
    setTimeout(()=>{f.style.width=f.dataset.w},i*80+400);
  });
}

// INTRO → MAIN (no loader)
let statsAnim=false,accAnim=false,edu1Anim=false;
// Show intro immediately - no blank screen
const intro=document.getElementById('intro');
intro.classList.add('on');
setTimeout(()=>document.getElementById('iw').classList.add('pop'),60);
// Fade in particles with intro (not before)
setTimeout(()=>{document.getElementById('pcv').style.opacity='.35'},300);

document.getElementById('iw-enter').addEventListener('click',()=>{
  const iw=document.getElementById('iw');
  const intro=document.getElementById('intro');
  // Remove any CSS transition so the overlay disappears instantly (no blank gap)
  try{ iw.style.transition='none'; intro.style.transition='none'; }catch(e){}
  // slight visual nudge then hide immediately
  iw.style.transform='scale(.95) translateY(-6px)'; iw.style.opacity='0';
  // force-hide the intro overlay to avoid any post-click blank screen
  intro.classList.remove('on');
  intro.style.opacity='0'; intro.style.visibility='hidden'; intro.style.display='none';
  // reveal main + nav immediately
  document.getElementById('main').classList.add('on');
  document.getElementById('nav').classList.add('on');
  tloop();
  initObs();
  setTimeout(rebuildAllCharts,100);
});

function initObs(){
  const revealSel='.rv,.rv-left,.rv-right,.rv-scale,.sk-chip';
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      e.target.classList.add('in');
      if(e.target.classList.contains('sk-chip')){
        const b=e.target.querySelector('.sk-b');
        if(b)setTimeout(()=>{b.style.width=b.dataset.w},200);
      }
      io.unobserve(e.target);
    });
  },{threshold:.06,rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll(revealSel).forEach(el=>io.observe(el));

  const statsIO=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting&&!statsAnim){
        statsAnim=true;
        document.querySelectorAll('.s-card').forEach(c=>c.classList.add('anim'));
        setTimeout(()=>cnt(document.getElementById('s1'),4,'',600),200);
        setTimeout(()=>cnt(document.getElementById('s2'),15,'K+',1000),360);
        setTimeout(()=>{const el=document.getElementById('s3');let v=0;const t=setInterval(()=>{v+=1.66;if(v>=99.63){v=99.63;clearInterval(t)}el.textContent=v.toFixed(1)+'%'},16)},520);
        statsIO.unobserve(e.target);
      }
    });
  },{threshold:.15});
  const ss=document.getElementById('stats-sec');if(ss)statsIO.observe(ss);

  const eduIO=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      if(e.target.id==='edu1'&&!edu1Anim){edu1Anim=true;setTimeout(()=>cnt(document.getElementById('e1'),8,'',600),400);setTimeout(()=>cnt(document.getElementById('e2'),46,'',800),560);setTimeout(()=>cnt(document.getElementById('e3'),12,'',700),720)}
      if(e.target.id==='edu2'&&!accAnim){accAnim=true;setTimeout(()=>{const bar=document.getElementById('acc-bar'),pct=document.getElementById('acc-pct');bar.style.width='99.63%';let v=0;const t=setInterval(()=>{v+=1.66;if(v>=99.63){v=99.63;clearInterval(t)}pct.textContent=v.toFixed(1)+'%'},16)},500)}
      eduIO.unobserve(e.target);
    });
  },{threshold:.15});
  ['edu1','edu2'].forEach(id=>{const el=document.getElementById(id);if(el)eduIO.observe(el)});

  // chart animation
  const chartIO=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){animateChart();chartIO.unobserve(e.target)}});
  },{threshold:.1});
  const tc=document.getElementById('trend-chart');if(tc)chartIO.observe(tc);
}

// Mutual Fund Carousel: cinematic fade + slide
;(function(){
  const card = document.querySelector('.pc .mf-carousel');
  if(!card) return;
  const slides = card.querySelectorAll('.mf-slides img');
  let idx=0, t=null, playing=true;
  function show(i){
    slides.forEach((s,j)=>{
      s.style.opacity = (j===i)?'1':'0';
      s.style.transform = (j===i)?'translateY(0)':'translateY(8px)';
      s.style.zIndex = (j===i)?'2':'1';
    });
  }
  function next(){ idx = (idx+1)%slides.length; show(idx); }
  function prev(){ idx = (idx-1+slides.length)%slides.length; show(idx); }
  // autoplay
  t = setInterval(next, 2600);
  card.addEventListener('mouseenter', ()=>{ clearInterval(t); playing=false });
  card.addEventListener('mouseleave', ()=>{ if(!playing){ t=setInterval(next,2600); playing=true }});
  const btnNext = card.querySelector('.mf-next');
  const btnPrev = card.querySelector('.mf-prev');
  btnNext.addEventListener('click', ()=>{ next(); clearInterval(t); playing=false });
  btnPrev.addEventListener('click', ()=>{ prev(); clearInterval(t); playing=false });
  show(0);
})();

// Build cinematic SVG charts for Mutual Fund and Customer trends
let buildMFChart, buildCustChart, animateMFChart, animateCustChart;

;(function(){
  const mfData = [
    {m:'2020-01',F1:100,F2:98,F3:102},{m:'2020-06',F1:112,F2:105,F3:108},
    {m:'2021-01',F1:125,F2:115,F3:118},{m:'2021-12',F1:138,F2:130,F3:127},
    {m:'2022-12',F1:160,F2:142,F3:135},{m:'2023-12',F1:195,F2:155,F3:150},{m:'2024-12',F1:242,F2:170,F3:163}
  ];

  // sample customer monthly KPIs
  const custData = [
    {m:'Jan', revenue:820, orders:120},{m:'Feb', revenue:760, orders:105},{m:'Mar', revenue:980, orders:140},
    {m:'Apr', revenue:1120, orders:160},{m:'May', revenue:1340, orders:185},{m:'Jun', revenue:1210, orders:172},
    {m:'Jul', revenue:1450, orders:210},{m:'Aug', revenue:1580, orders:225},{m:'Sep', revenue:1700, orders:234},
    {m:'Oct', revenue:1890, orders:260},{m:'Nov', revenue:2010, orders:280},{m:'Dec', revenue:2240, orders:310}
  ];

  // helper: create SVG element
  function svgEl(tag){ return document.createElementNS('http://www.w3.org/2000/svg', tag); }

  buildMFChart=function(){
    const c=document.getElementById('mf-chart');if(!c)return;c.innerHTML='';
    const w=getChartWidth(c),h=w<360?190:220,pad={l:w<360?32:44,t:16,b:w<360?32:36,r:8};
    const fontSize=w<360?7:9;
    const svg=svgEl('svg');svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('width','100%');svg.setAttribute('height',h);svg.setAttribute('preserveAspectRatio','xMidYMid meet');
    // gradients
    const defs = svgEl('defs'); defs.innerHTML = `
      <linearGradient id="mfG1" x1="0" x2="1"><stop offset="0%" stop-color="#60A5FA"/><stop offset="100%" stop-color="#3B82F6"/></linearGradient>
      <linearGradient id="mfG2" x1="0" x2="1"><stop offset="0%" stop-color="#06B6D4"/><stop offset="100%" stop-color="#14B8A6"/></linearGradient>
      <linearGradient id="mfG3" x1="0" x2="1"><stop offset="0%" stop-color="#8B5CF6"/><stop offset="100%" stop-color="#C4B5FD"/></linearGradient>
    `; svg.appendChild(defs);
    const keys=['F1','F2','F3'], colors=['url(#mfG1)','url(#mfG2)','url(#mfG3)'];
    const maxVal = Math.max(...mfData.flatMap(d=>keys.map(k=>d[k])));
    const stepX = (w - pad.l - pad.r) / (mfData.length - 1);
    function pathD(key){ return mfData.map((pt,i)=>{ const x = pad.l + i*stepX; const y = pad.t + (1 - pt[key]/maxVal) * (h - pad.t - pad.b); return (i===0?`M ${x} ${y}`:`L ${x} ${y}`); }).join(' '); }
    keys.forEach((k,i)=>{ const p = svgEl('path'); p.setAttribute('d', pathD(k)); p.setAttribute('fill','none'); p.setAttribute('stroke', colors[i]); p.setAttribute('stroke-width','3'); p.setAttribute('class','mf-path'); svg.appendChild(p); });
    // x labels
    mfData.forEach((d,i)=>{const txt=svgEl('text');txt.setAttribute('x',pad.l+i*stepX);txt.setAttribute('y',h-8);txt.setAttribute('font-size',fontSize);txt.setAttribute('fill','#94A3B8');txt.setAttribute('text-anchor','middle');txt.textContent=w<400?d.m.slice(2,7):d.m;svg.appendChild(txt);});
    c.appendChild(svg);
  };

  animateMFChart=function(){document.querySelectorAll('#mf-chart .mf-path').forEach((p,i)=>{const len=p.getTotalLength();p.style.strokeDasharray=len;p.style.strokeDashoffset=len;p.style.transition='stroke-dashoffset 1.6s cubic-bezier(.2,.8,.2,1)';setTimeout(()=>{p.style.strokeDashoffset='0'},i*240+120)});};

  buildCustChart=function(){
    const c=document.getElementById('cust-chart');if(!c)return;c.innerHTML='';
    const w=getChartWidth(c),h=w<360?190:220,pad={l:w<360?28:44,t:16,b:w<360?32:36,r:8};
    const fontSize=w<360?7:9;
    const labelStep=w<400?2:1;
    const svg=svgEl('svg');svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('width','100%');svg.setAttribute('height',h);svg.setAttribute('preserveAspectRatio','xMidYMid meet');
    const maxRev = Math.max(...custData.map(d=>d.revenue)); const stepX = (w - pad.l - pad.r)/(custData.length-1);
    // area
    let areaD = `M ${pad.l} ${h-pad.b} ` + custData.map((pt,i)=>{ const x=pad.l+i*stepX; const y = pad.t + (1-pt.revenue/maxRev)*(h-pad.t-pad.b); return `L ${x} ${y}`; }).join(' ') + ` L ${pad.l+(custData.length-1)*stepX} ${h-pad.b} Z`;
    const defs = svgEl('defs'); defs.innerHTML = `<linearGradient id="custGrad" x1="0" x2="0"><stop offset="0%" stop-color="#60A5FA" stop-opacity=".18"/><stop offset="100%" stop-color="#06B6D4" stop-opacity="0"/></linearGradient>`; svg.appendChild(defs);
    const area = svgEl('path'); area.setAttribute('d', areaD); area.setAttribute('fill','url(#custGrad)'); area.setAttribute('opacity','0.18'); svg.appendChild(area);
    // line
    const lineD = custData.map((pt,i)=>{ const x=pad.l+i*stepX; const y = pad.t + (1-pt.revenue/maxRev)*(h-pad.t-pad.b); return (i===0?`M ${x} ${y}`:`L ${x} ${y}`); }).join(' ');
    const line = svgEl('path'); line.setAttribute('d', lineD); line.setAttribute('fill','none'); line.setAttribute('stroke','#60A5FA'); line.setAttribute('stroke-width','3'); line.setAttribute('class','cust-line'); svg.appendChild(line);
    // dots
    custData.forEach((pt,i)=>{ const x=pad.l+i*stepX; const y = pad.t + (1-pt.revenue/maxRev)*(h-pad.t-pad.b); const dot = svgEl('circle'); dot.setAttribute('cx',x); dot.setAttribute('cy',y); dot.setAttribute('r',3.6); dot.setAttribute('fill','#60A5FA'); dot.setAttribute('opacity','0'); dot.setAttribute('class','cust-dot'); svg.appendChild(dot); });
    // x labels
    custData.forEach((d,i)=>{
      if(i%labelStep)return;
      const txt=svgEl('text');txt.setAttribute('x',pad.l+i*stepX);txt.setAttribute('y',h-8);txt.setAttribute('font-size',fontSize);txt.setAttribute('fill','#94A3B8');txt.setAttribute('text-anchor','middle');txt.textContent=d.m;svg.appendChild(txt);
    });
    c.appendChild(svg);
  };

  animateCustChart=function(){const p=document.querySelector('#cust-chart .cust-line');if(p){const len=p.getTotalLength();p.style.strokeDasharray=len;p.style.strokeDashoffset=len;p.style.transition='stroke-dashoffset 1.6s cubic-bezier(.2,.8,.2,1)';setTimeout(()=>p.style.strokeDashoffset='0',120)}setTimeout(()=>{document.querySelectorAll('#cust-chart .cust-dot').forEach((d,i)=>setTimeout(()=>d.setAttribute('opacity','1'),i*90+600))},300);};

  // attach observers to animate when visible
  const mfEl = document.getElementById('mf-chart'); if(mfEl){ const io = new IntersectionObserver(entries=>{ entries.forEach(e=>{ if(e.isIntersecting){ animateMFChart(); io.unobserve(e.target); } }); },{threshold:.12}); io.observe(mfEl); }
  const cuEl = document.getElementById('cust-chart'); if(cuEl){ const io2 = new IntersectionObserver(entries=>{ entries.forEach(e=>{ if(e.isIntersecting){ animateCustChart(); io2.unobserve(e.target); } }); },{threshold:.12}); io2.observe(cuEl); }
})();

function rebuildAllCharts(includeDept=false){
  buildChart(includeDept);
  if(buildMFChart)buildMFChart();
  if(buildCustChart)buildCustChart();
}
rebuildAllCharts(true);

let chartResizeTimer;
window.addEventListener('resize',()=>{
  clearTimeout(chartResizeTimer);
  chartResizeTimer=setTimeout(rebuildAllCharts,200);
});

// ===== NEURAL NETWORK BACKGROUND =====
(function(){
  const c=document.createElement('canvas');
  c.id='neural-bg';
  // apply direct styles to ensure canvas sits behind content and is non-interactive
  c.style.position='fixed'; c.style.inset='0'; c.style.zIndex='0'; c.style.opacity='0.12'; c.style.pointerEvents='none';
  document.body.insertBefore(c,document.body.firstChild);
  const ctx2=c.getContext('2d');
  function rsz2(){c.width=window.innerWidth;c.height=window.innerHeight}
  rsz2();window.addEventListener('resize',rsz2);
  // reduce node count and sizes to make background less busy
  const nodes=Array.from({length:40},()=>({
    x:Math.random()*c.width,y:Math.random()*c.height,
    vx:(Math.random()-.5)*.14,vy:(Math.random()-.5)*.14,
    pulse:Math.random()*Math.PI*2,r:Math.random()*1.2+.4
  }));
  (function nloop(){
    ctx2.clearRect(0,0,c.width,c.height);
    nodes.forEach(n=>{
      n.x+=n.vx;n.y+=n.vy;n.pulse+=.02;
      if(n.x<0||n.x>c.width)n.vx*=-1;
      if(n.y<0||n.y>c.height)n.vy*=-1;
      const glow=Math.sin(n.pulse)*.5+.5;
      ctx2.beginPath();ctx2.arc(n.x,n.y,n.r+glow,0,Math.PI*2);
      ctx2.fillStyle=`rgba(99,179,237,${.4+glow*.3})`;ctx2.fill();
    });
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        // shorter connection distance -> fewer lines
        if(d<100){
          ctx2.beginPath();ctx2.moveTo(nodes[i].x,nodes[i].y);ctx2.lineTo(nodes[j].x,nodes[j].y);
          const alpha=.045*(1-d/100);
          const pulse=(Math.sin(nodes[i].pulse)+Math.sin(nodes[j].pulse))/2*.4+.4;
          ctx2.strokeStyle=`rgba(59,130,246,${Math.max(0,alpha+pulse*.03)})`;
          ctx2.lineWidth=.45;ctx2.stroke();
        }
      }
    }
    requestAnimationFrame(nloop);
  })();
})();

// ===== 3D TILT ON SKILL CHIPS =====
document.querySelectorAll('.sk-chip').forEach(chip=>{
  chip.addEventListener('mousemove',e=>{
    const r=chip.getBoundingClientRect();
    const x=e.clientX-r.left,y=e.clientY-r.top;
    const cx=r.width/2,cy=r.height/2;
    const rotX=((y-cy)/cy)*-10,rotY=((x-cx)/cx)*10;
    chip.style.transform=`perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
  });
  chip.addEventListener('mouseleave',()=>{
    chip.style.transform='perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    chip.style.transition='transform 0.4s ease';
  });
  chip.addEventListener('mouseenter',()=>{chip.style.transition='transform 0.1s ease-out'});
});


// MOBILE NAV
const navToggle=document.getElementById('nav-toggle');
const navLinks=document.getElementById('nav-links');
function closeNav(){
  if(navToggle)navToggle.classList.remove('open');
  if(navLinks)navLinks.classList.remove('open');
  if(navToggle)navToggle.setAttribute('aria-expanded','false');
}
if(navToggle&&navLinks){
  navToggle.addEventListener('click',()=>{
    const open=navLinks.classList.toggle('open');
    navToggle.classList.toggle('open',open);
    navToggle.setAttribute('aria-expanded',open?'true':'false');
  });
  navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNav));
}

// CONTACT MODAL + FORMSPREE
const contactModal=document.getElementById('contact-modal');
const contactForm=document.getElementById('contact-form');
const formSuccess=document.getElementById('form-success');
const formSubmitBtn=document.getElementById('form-submit');

function openContactModal(){
  if(!contactModal)return;
  contactModal.classList.add('on');
  contactModal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  closeNav();
}
function closeContactModal(){
  if(!contactModal)return;
  contactModal.classList.remove('on');
  contactModal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}
['nav-contact-btn','nav-contact-btn-desktop','nav-contact-btn-mobile','ct-contact-btn'].forEach(id=>{
  const btn=document.getElementById(id);
  if(btn)btn.addEventListener('click',openContactModal);
});
document.getElementById('contact-close')?.addEventListener('click',closeContactModal);
document.getElementById('contact-overlay')?.addEventListener('click',closeContactModal);
document.getElementById('form-success-close')?.addEventListener('click',()=>{
  closeContactModal();
  if(contactForm){contactForm.reset();contactForm.hidden=false}
  if(formSuccess)formSuccess.hidden=true;
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&contactModal?.classList.contains('on'))closeContactModal();
});

if(contactForm){
  contactForm.addEventListener('submit',async e=>{
    e.preventDefault();
    const emailInput=document.getElementById('form-email');
    const replyto=document.getElementById('form-replyto');
    if(replyto&&emailInput)replyto.value=emailInput.value;
    if(formSubmitBtn){formSubmitBtn.disabled=true;formSubmitBtn.textContent='Sending...'}
    try{
      const res=await fetch('https://formspree.io/f/mwvjlewj',{
        method:'POST',
        body:new FormData(contactForm),
        headers:{'Accept':'application/json'}
      });
      if(res.ok){
        contactForm.hidden=true;
        if(formSuccess)formSuccess.hidden=false;
      }else{
        const data=await res.json().catch(()=>({}));
        alert(data.error||'Something went wrong. Please try again.');
      }
    }catch{
      alert('Network error. Please check your connection and try again.');
    }finally{
      if(formSubmitBtn){formSubmitBtn.disabled=false;formSubmitBtn.textContent='Send Message →'}
    }
  });
}

// THEME TOGGLE
const themeBtn = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
if(savedTheme === 'light'){document.body.classList.add('light');themeBtn.textContent='☀️'}
themeBtn.addEventListener('click',()=>{
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  themeBtn.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});
