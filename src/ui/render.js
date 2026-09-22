/* DOM rendering + interaction state — logic moved verbatim from v1.
   Only changes: wrapped in initApp(), registry/units imported, and
   optional per-calculator resource links rendered on the card. */
import { calculators, CAT_ORDER } from '../registry.js';
import { UNITS, uConv, unitList, targetUnit, fieldToBase, fieldFromBase } from '../units.js';
import { trackComplete } from '../shared/analytics.js';
import { getSystem, setSystem, subscribe } from '../shared/units-store.js';

export function initApp(){
  const grid=document.getElementById('grid'), catSelect=document.getElementById('catSelect'), countEl=document.getElementById('count'), searchEl=document.getElementById('search'), catWrap=document.getElementById('catWrap');
  const state={ mode:'water', cat:null, query:'' };
  /* COMPLETION (WW-14, 2026-09-10). One entry per calculator id that has
     put a result on screen this page load. This page carries 76 calculators
     on one URL, so "once per page load" (the manager rule) becomes "once per
     calculator per page load": finishing chlorine-dose and then detention
     time is two completions of two different tools; recalculating
     chlorine-dose three times is still one. */
  const completed={};

  function fmt(x){ if(x==null||!isFinite(x)) return ''; let n=Math.round(x*1e6)/1e6;
    if(Math.abs(n)>=1000) return n.toLocaleString('en-US',{maximumFractionDigits:2}); return String(parseFloat(n.toFixed(4))); }
  function rawNum(el){ const raw=el.value.replace(/,/g,'').trim(); if(raw==='') return null; const n=parseFloat(raw); return isFinite(n)?n:null; }
  function selFor(inputEl){ return document.getElementById(inputEl.id+'__u'); }
  /* The only conversion boundary (WW-01): a solver receives the field's
     base unit (its group anchor, or `base` when the field names the unit
     its math expects) and hands values back the same way; the select
     decides what the reader sees. */
  function readField(f, inputEl){ const n=rawNum(inputEl); if(n==null) return null;
    if(f.unit){ const u=selFor(inputEl).value; return fieldToBase(f, n, u); } return n; }
  function writeField(f, inputEl, baseVal){ if(f.unit){ const u=selFor(inputEl).value; inputEl.value=fmt(fieldFromBase(f, baseVal, u)); } else inputEl.value=fmt(baseVal); }
  /* The unit a field shows on first paint in the current system. */
  function initialUnit(f){ return getSystem()==='metric' ? targetUnit(f, f.def, 'metric') : f.def; }
  function formulaText(c){ return (getSystem()==='metric' && c.formulaSI) ? c.formulaSI : c.formula; }
  function availableCats(mode){ return CAT_ORDER.filter(c=>calculators.some(k=>k.cat===c && k.domains.includes(mode))); }
  function buildSelect(){ const cats=availableCats(state.mode); if(!cats.includes(state.cat)) state.cat=cats[0];
    catSelect.innerHTML=cats.map(c=>'<option value="'+c+'">'+c+'</option>').join(''); catSelect.value=state.cat; }
  function setMode(m){ if(state.mode===m) return; state.mode=m; document.documentElement.dataset.mode=m;
    document.querySelectorAll('.mode-btn').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.m===m))); buildSelect(); renderGrid(); }
  function hay(c){ return (c.title+' '+c.note+' '+c.formula+' '+c.cat+' '+((c.keywords||[]).join(' '))).toLowerCase(); }
  function visibleItems(){ const q=state.query.trim().toLowerCase();
    if(q) return calculators.filter(c=>c.domains.includes(state.mode) && hay(c).includes(q));
    return calculators.filter(c=>c.cat===state.cat && c.domains.includes(state.mode)); }
  const titleOf=Object.fromEntries(calculators.map(c=>[c.id,c.title]));

  /* FIT PASS 2026-09-22: one row per kind, each its own block (was <br>-joined
     inline text), so a long title wraps under its own label on a phone. */
  function cardLinksHtml(c){
    const rows=[];
    if(c.links&&c.links.length) rows.push('<div class="card-links-row"><span class="card-links-lbl">Learn more:</span> '+c.links.map(l=>'<a href="'+l.href+'" target="_blank" rel="noopener">'+l.label+'</a>').join('<span class="card-links-sep">·</span>')+'</div>');
    if(c.seeAlso&&c.seeAlso.length) rows.push('<div class="card-links-row"><span class="card-links-lbl">Also:</span> '+c.seeAlso.map(id=>'<button type="button" class="linkbtn seealso" data-t="'+titleOf[id]+'">'+titleOf[id]+'</button>').join('<span class="card-links-sep">·</span>')+'</div>');
    return rows.length? '<div class="card-links">'+rows.join('')+'</div>' : '';
  }
  /* FIT PASS 2026-09-22: the host page's header. On ziptility.com the global
     site header is sticky (75px desktop, 61px phone); this tool's toolbar is
     sticky too, and before this pass both sat at top:0, so the toolbar slid
     under the site header and a deep-linked card (#chlorine-dose from a
     practice question) scrolled to y=0, hidden behind both. The bundle
     cannot know the host's header at build time (the same file runs in the
     bare preview page), so it measures whatever fixed/sticky element covers
     the top of the viewport outside the mount and hands it to CSS:
       --zip-top     the toolbar's sticky offset
       --zip-anchor  scroll-margin-top for cards (site header + toolbar + gap)
     Guarded against a full-screen fixed overlay (cookie modal): anything
     taller than 40% of the viewport is not a header. Re-measured on resize. */
  const mount=document.getElementById('ziptility-calculator');
  const control=document.querySelector('#ziptility-calculator .control');
  function measureChrome(){
    let top=0;
    try{
      const els=document.elementsFromPoint(Math.floor(window.innerWidth/2), 1);
      for(const el of els){
        if(el===document.documentElement||el===document.body||el.closest('#ziptility-calculator')) continue;
        const cs=getComputedStyle(el);
        if(cs.position!=='fixed'&&cs.position!=='sticky') continue;
        const b=el.getBoundingClientRect();
        if(b.top<=1&&b.height>0&&b.height<window.innerHeight*0.4) top=Math.max(top,b.bottom);
      }
    }catch(e){}
    top=Math.round(top);
    const ctlH=control?Math.round(control.getBoundingClientRect().height):0;
    if(mount){ mount.style.setProperty('--zip-top', top+'px'); mount.style.setProperty('--zip-anchor', (top+ctlH+12)+'px'); }
  }
  let rsT=null;
  window.addEventListener('resize',()=>{ clearTimeout(rsT); rsT=setTimeout(measureChrome,120); });
  function unitSelectHtml(c, f){
    const init=initialUnit(f), list=unitList(f, getSystem()); if(!list.includes(init)) list.push(init);
    const opts=list.map(u=>'<option value="'+u+'"'+(u===init?' selected':'')+'>'+UNITS[f.unit][u].label+'</option>').join('');
    return '<select id="'+c.id+'__'+f.k+'__u" data-cur="'+init+'" aria-label="unit">'+opts+'</select>';
  }
  /* One flip moves every rendered field at once (WW-01 shape a). A typed
     value is converted in place, never re-derived, so what the reader
     entered is still what the reader entered, in the other unit. The
     formula chips and the reference constants follow. */
  function applySystem(sys){
    document.querySelectorAll('.sys-seg button').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.sys===sys)));
    const ref=document.querySelector('.ref'); if(ref) ref.dataset.system=sys;
    grid.querySelectorAll('.card').forEach(card=>{
      const c=calculators.find(k=>k.id===card.id); if(!c) return;
      const chip=card.querySelector('.formula'); if(chip) chip.textContent=formulaText(c);
      c.fields.forEach(f=>{ if(!f.unit) return;
        const inp=document.getElementById(c.id+'__'+f.k), sel=selFor(inp); if(!inp||!sel) return;
        const oldU=sel.dataset.cur, newU=targetUnit(f, oldU, sys); if(newU===oldU) return;
        if(!sel.querySelector('option[value="'+newU+'"]')){ const o=document.createElement('option'); o.value=newU; o.textContent=UNITS[f.unit][newU].label; sel.appendChild(o); }
        const cur=rawNum(inp); if(cur!=null) inp.value=fmt(uConv(cur, oldU, newU, f.unit));
        sel.value=newU; sel.dataset.cur=newU; });
    });
  }
  function renderGrid(){
    grid.innerHTML='';
    const searching=state.query.trim()!=='';
    catWrap.style.opacity=searching?'.5':'1';
    const items=visibleItems();
    countEl.innerHTML='<b>'+items.length+'</b> <span class="count-w">'+(searching?('match'+(items.length===1?'':'es')):('calculator'+(items.length===1?'':'s')))+'</span>';
    if(items.length===0){ const other=state.mode==='water'?'wastewater':'water', otherLbl=other==='water'?'Water':'Wastewater';
      const q=state.query.trim().toLowerCase();
      const otherN=calculators.filter(c=>c.domains.includes(other) && hay(c).includes(q)).length;
      grid.innerHTML='<div class="empty">No matches in '+(state.mode==='water'?'Water':'Wastewater')+' mode.'+(otherN>0?(' Found <b>'+otherN+'</b> in '+otherLbl+'. <button type="button" id="switchMode" class="linkbtn">switch to '+otherLbl+'</button>.'):' Try clearing the search.')+'</div>';
      if(otherN>0) document.getElementById('switchMode').onclick=()=>setMode(other); return; }
    items.forEach(c=>{
      const card=document.createElement('div'); card.className='card';
      /* The card carries the calculator's own id so #<id> lands ON IT.
         Without this the only ids in the DOM were on the buttons inside
         (calc-<id>, clear-<id>, copy-<id>), so every deep link built as
         calcUrl + '#' + q.calculator, which is what each practice-test
         question emits for "Run this math in the Operator Calculator",
         resolved to nothing and dropped the reader at the top of a page
         of 50-plus calculators. */
      card.id=c.id;
      let tgl=c.toggle? c.toggle.def : null;
      let fieldsHtml='';
      c.fields.forEach(f=>{ const inp='<input id="'+c.id+'__'+f.k+'" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="–">';
        const body=f.unit? ('<div class="uf">'+inp+unitSelectHtml(c,f)+'</div>') : inp;
        const hide=f.show&&f.show!==tgl;
        fieldsHtml+='<div class="field"'+(f.show?' data-show="'+f.show+'"':'')+(hide?' style="display:none"':'')+'><label for="'+c.id+'__'+f.k+'">'+f.label+'</label>'+body+'</div>'; });
      const tglHtml=c.toggle? '<div class="seg" role="group">'+c.toggle.options.map(o=>'<button type="button" data-v="'+o.v+'" aria-pressed="'+(o.v===tgl)+'">'+o.label+'</button>').join('')+'</div>' : '';
      card.innerHTML='<div class="card-head">'+(searching?'<span class="card-tag">'+c.cat+'</span>':'')+'<h2>'+c.title+'</h2><div class="formula">'+formulaText(c)+'</div><p class="note">'+c.note+'</p>'+tglHtml+'</div>'
        +'<div class="fields '+(c.fields.length<=2?'one-col':'')+'">'+fieldsHtml+'</div>'
        +'<div class="actions"><button class="btn btn-calc" id="calc-'+c.id+'" type="button">Calculate</button><button class="btn btn-clear" id="clear-'+c.id+'" type="button">Clear</button><button class="btn btn-copy" id="copy-'+c.id+'" type="button">Copy</button></div>'
        +'<div class="msg" id="msg-'+c.id+'" aria-live="polite"></div><div class="insight" id="ins-'+c.id+'" aria-live="polite"></div>'
        +cardLinksHtml(c);
      grid.appendChild(card);
      card.querySelectorAll('.seealso').forEach(b=>b.onclick=()=>{ searchEl.value=b.dataset.t; state.query=b.dataset.t; renderGrid(); });

      const inputs=c.fields.map(f=>document.getElementById(c.id+'__'+f.k));
      const getTgl=()=>tgl;
      if(c.toggle) card.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{ if(b.dataset.v===tgl) return; tgl=b.dataset.v;
        card.querySelectorAll('.seg button').forEach(x=>x.setAttribute('aria-pressed', String(x.dataset.v===tgl)));
        card.querySelectorAll('.field[data-show]').forEach(w=>{ w.style.display=(w.dataset.show===tgl)?'':'none'; }); });
      const run=()=>runCalc(c, inputs, getTgl);
      document.getElementById('calc-'+c.id).onclick=run;
      document.getElementById('clear-'+c.id).onclick=()=>{ inputs.forEach(i=>{i.value=''; i.classList.remove('computed');});
        document.getElementById('msg-'+c.id).textContent=''; const ins=document.getElementById('ins-'+c.id); ins.className='insight'; ins.textContent=''; };
      document.getElementById('copy-'+c.id).onclick=()=>copyResult(c, inputs, getTgl);
      c.fields.forEach((f,idx)=>{ const i=inputs[idx];
        i.addEventListener('keydown',e=>{ if(e.key==='Enter') run(); });
        i.addEventListener('input',()=>i.classList.remove('computed'));
        if(f.unit){ const sel=selFor(i); sel.addEventListener('change',()=>{ const oldU=sel.dataset.cur, newU=sel.value;
          const cur=rawNum(i); if(cur!=null){ i.value=fmt(uConv(cur, oldU, newU, f.unit)); } sel.dataset.cur=newU; }); }
      });
    });
  }
  function runCalc(c, inputs, getTgl){
    const tgl=getTgl?getTgl():null;
    const v={}; c.fields.forEach((f,idx)=>{ v[f.k]=(f.show&&f.show!==tgl)?null:readField(f, inputs[idx]); });
    if(c.toggle) v[c.toggle.k]=tgl;
    const res=c.solve(v), msg=document.getElementById('msg-'+c.id), insEl=document.getElementById('ins-'+c.id);
    inputs.forEach(i=>i.classList.remove('computed')); msg.className='msg'; insEl.className='insight'; insEl.textContent='';
    if(res.error){ msg.textContent=res.error; return; }
    msg.textContent=''; let bad=false;
    c.fields.forEach((f,idx)=>{ if(f.k in res.values){ const val=res.values[f.k]; if(val==null||!isFinite(val)){ bad=true; return; }
      writeField(f, inputs[idx], val); if(res.computed.includes(f.k)) inputs[idx].classList.add('computed'); } });
    if(bad){ msg.textContent='Check inputs: result is undefined (divide by zero?).'; return; }
    /* A result is on screen: every guard above has passed. tool_name is the
       page slug (the GA4 report groups every tool by the slug its URL and
       embed use); tool_calc is the card id the deep links use, so the same
       id answers "which of the 76 gets finished". No reader input rides
       the payload, only ids. Fire and forget: analytics never throws into
       the tool. */
    if(!completed[c.id]){ completed[c.id]=true; try{ trackComplete('calculator', { calc:c.id, mode:state.mode }); }catch(e){} }
    if(c.interpret){ const merged=Object.assign({}, v, res.values); const ins=c.interpret(merged);
      if(ins){ insEl.className='insight show '+ins.level; insEl.innerHTML='<span class="lead">Note</span>'+ins.text; } }
  }
  function copyResult(c, inputs, getTgl){
    const tgl=getTgl?getTgl():null;
    const parts=[]; c.fields.forEach((f,idx)=>{ if(f.show&&f.show!==tgl) return;
      const val=inputs[idx].value.trim(); if(val!==''){ let u=''; if(f.unit){ u=' '+UNITS[f.unit][selFor(inputs[idx]).value].label; } parts.push(f.label+': '+val+u); } });
    const msg=document.getElementById('msg-'+c.id);
    if(parts.length===0){ msg.className='msg'; msg.textContent='Nothing to copy yet. Run a calculation first.'; return; }
    const text=c.title+': '+parts.join('; ');
    const done=()=>{ msg.className='msg ok'; msg.textContent='Copied to clipboard.'; setTimeout(()=>{ if(msg.textContent==='Copied to clipboard.'){msg.textContent='';msg.className='msg';} },1800); };
    if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done,()=>fallbackCopy(text,done)); } else fallbackCopy(text,done);
  }
  function fallbackCopy(text,done){ const ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.opacity='0';
    document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); done(); }catch(e){} document.body.removeChild(ta); }

  document.querySelectorAll('.mode-btn').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.m)));
  document.querySelectorAll('.sys-seg button').forEach(b=>b.addEventListener('click',()=>setSystem(b.dataset.sys)));
  subscribe(applySystem);
  applySystem(getSystem()); /* the strip and the constants agree with the remembered system on first paint */
  catSelect.addEventListener('change',()=>{ state.cat=catSelect.value; renderGrid(); });
  searchEl.addEventListener('input',()=>{ state.query=searchEl.value; renderGrid(); });

  /* Deep link to one calculator: /tools/calculator#filtration-rate.
     Every practice-test question with a `calculator` field emits exactly
     this, as its "Run this math in the Operator Calculator" link.

     Giving each card an id is necessary but not sufficient: the grid only
     ever renders ONE category of ONE mode at a time (visibleItems()), so
     a card the reader has not navigated to is not merely off-screen, it
     is not in the DOM at all, and the browser has nothing to scroll to.
     So resolve the target first, switch mode and category to wherever it
     lives, render, and only then scroll.

     Focus as well as scroll, because a keyboard or screen-reader user
     who followed the link should arrive at the calculator rather than at
     the top of the document with the view moved out from under them.
     tabindex -1 makes a div focusable without adding it to the tab order. */
  function gotoHash(){
    let id='';
    try{ id=decodeURIComponent((location.hash||'').replace(/^#/,'')); }catch(e){ return; }
    if(!id) return;
    const target=calculators.find(c=>c.id===id);
    if(!target) return; /* not ours: leave the browser's own behaviour alone */

    state.query=''; searchEl.value='';
    if(!target.domains.includes(state.mode)) setMode(target.domains[0]);
    state.cat=target.cat; buildSelect(); catSelect.value=state.cat;
    renderGrid();

    const card=document.getElementById(id);
    if(!card) return;
    card.setAttribute('tabindex','-1');
    measureChrome(); /* the card's scroll-margin-top reads --zip-anchor, so it must be current before the scroll */
    card.scrollIntoView({block:'start'});
    card.focus({preventScroll:true});
  }
  window.addEventListener('hashchange',gotoHash);

  document.documentElement.dataset.mode=state.mode; /* active mode styled on first paint */
  buildSelect(); renderGrid();
  measureChrome();
  gotoHash();
}
