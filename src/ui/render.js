/* DOM rendering + interaction state — logic moved verbatim from v1.
   Only changes: wrapped in initApp(), registry/units imported, and
   optional per-calculator resource links rendered on the card. */
import { calculators, CAT_ORDER } from '../registry.js';
import { UNITS } from '../units.js';

export function initApp(){
  const grid=document.getElementById('grid'), catSelect=document.getElementById('catSelect'), countEl=document.getElementById('count'), searchEl=document.getElementById('search'), catWrap=document.getElementById('catWrap');
  const state={ mode:'water', cat:null, query:'' };

  function fmt(x){ if(x==null||!isFinite(x)) return ''; let n=Math.round(x*1e6)/1e6;
    if(Math.abs(n)>=1000) return n.toLocaleString('en-US',{maximumFractionDigits:2}); return String(parseFloat(n.toFixed(4))); }
  function rawNum(el){ const raw=el.value.replace(/,/g,'').trim(); if(raw==='') return null; const n=parseFloat(raw); return isFinite(n)?n:null; }
  function selFor(inputEl){ return document.getElementById(inputEl.id+'__u'); }
  function readField(f, inputEl){ const n=rawNum(inputEl); if(n==null) return null;
    if(f.unit){ const u=selFor(inputEl).value; return n*UNITS[f.unit][u].f; } return n; }
  function writeField(f, inputEl, baseVal){ if(f.unit){ const u=selFor(inputEl).value; inputEl.value=fmt(baseVal/UNITS[f.unit][u].f); } else inputEl.value=fmt(baseVal); }
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

  function cardLinksHtml(c){
    const rows=[];
    if(c.links&&c.links.length) rows.push('Learn more: '+c.links.map(l=>'<a href="'+l.href+'" target="_blank" rel="noopener">'+l.label+'</a>').join(' · '));
    if(c.seeAlso&&c.seeAlso.length) rows.push('Also: '+c.seeAlso.map(id=>'<button type="button" class="linkbtn seealso" data-t="'+titleOf[id]+'">'+titleOf[id]+'</button>').join(' · '));
    return rows.length? '<div class="card-links">'+rows.join('<br>')+'</div>' : '';
  }
  function unitSelectHtml(c, f){
    const list=f.units||Object.keys(UNITS[f.unit]);
    const opts=list.map(u=>'<option value="'+u+'"'+(u===f.def?' selected':'')+'>'+UNITS[f.unit][u].label+'</option>').join('');
    return '<select id="'+c.id+'__'+f.k+'__u" data-cur="'+f.def+'" aria-label="unit">'+opts+'</select>';
  }
  function renderGrid(){
    grid.innerHTML='';
    const searching=state.query.trim()!=='';
    catWrap.style.opacity=searching?'.5':'1';
    const items=visibleItems();
    countEl.innerHTML='<b>'+items.length+'</b> '+(searching?('match'+(items.length===1?'':'es')):('calculator'+(items.length===1?'':'s')));
    if(items.length===0){ const other=state.mode==='water'?'wastewater':'water', otherLbl=other==='water'?'Water':'Wastewater';
      const q=state.query.trim().toLowerCase();
      const otherN=calculators.filter(c=>c.domains.includes(other) && hay(c).includes(q)).length;
      grid.innerHTML='<div class="empty">No matches in '+(state.mode==='water'?'Water':'Wastewater')+' mode.'+(otherN>0?(' Found <b>'+otherN+'</b> in '+otherLbl+'. <button type="button" id="switchMode" class="linkbtn">switch to '+otherLbl+'</button>.'):' Try clearing the search.')+'</div>';
      if(otherN>0) document.getElementById('switchMode').onclick=()=>setMode(other); return; }
    items.forEach(c=>{
      const card=document.createElement('div'); card.className='card';
      let tgl=c.toggle? c.toggle.def : null;
      let fieldsHtml='';
      c.fields.forEach(f=>{ const inp='<input id="'+c.id+'__'+f.k+'" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="–">';
        const body=f.unit? ('<div class="uf">'+inp+unitSelectHtml(c,f)+'</div>') : inp;
        const hide=f.show&&f.show!==tgl;
        fieldsHtml+='<div class="field"'+(f.show?' data-show="'+f.show+'"':'')+(hide?' style="display:none"':'')+'><label for="'+c.id+'__'+f.k+'">'+f.label+'</label>'+body+'</div>'; });
      const tglHtml=c.toggle? '<div class="seg" role="group">'+c.toggle.options.map(o=>'<button type="button" data-v="'+o.v+'" aria-pressed="'+(o.v===tgl)+'">'+o.label+'</button>').join('')+'</div>' : '';
      card.innerHTML='<div class="card-head">'+(searching?'<span class="card-tag">'+c.cat+'</span>':'')+'<h2>'+c.title+'</h2><div class="formula">'+c.formula+'</div><p class="note">'+c.note+'</p>'+tglHtml+'</div>'
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
          const cur=rawNum(i); if(cur!=null){ i.value=fmt(cur*UNITS[f.unit][oldU].f/UNITS[f.unit][newU].f); } sel.dataset.cur=newU; }); }
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
  catSelect.addEventListener('change',()=>{ state.cat=catSelect.value; renderGrid(); });
  searchEl.addEventListener('input',()=>{ state.query=searchEl.value; renderGrid(); });

  document.documentElement.dataset.mode=state.mode; /* active mode styled on first paint */
  buildSelect(); renderGrid();
}
