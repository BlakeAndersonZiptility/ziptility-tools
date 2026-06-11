/* Lead capture — HubSpot Forms POST with mailto fallback (verbatim from v1). */
import { LEAD } from '../config.js';

export function initLead(){
  /* ---- Lead capture ---- */
  const leadModal=document.getElementById('leadModal');
  function openLead(){ leadModal.classList.add('show'); document.getElementById('leadForm').style.display='block'; document.getElementById('leadOk').style.display='none'; }
  function closeLead(){ leadModal.classList.remove('show'); }
  document.getElementById('openSheet').onclick=openLead;
  document.getElementById('leadClose').onclick=closeLead;
  leadModal.addEventListener('click',e=>{ if(e.target===leadModal) closeLead(); });
  document.getElementById('leadSubmit').onclick=()=>{
    const name=document.getElementById('ld-name').value.trim(), email=document.getElementById('ld-email').value.trim(), util=document.getElementById('ld-util').value.trim();
    if(!email||!/.+@.+\..+/.test(email)){ document.getElementById('ld-email').focus(); return; }
    const showOk=(m)=>{ document.getElementById('leadForm').style.display='none'; const ok=document.getElementById('leadOk'); ok.style.display='block'; if(m) document.getElementById('leadOkMsg').textContent=m; };
    if(LEAD.hubspotPortalId && LEAD.hubspotFormId){
      fetch('https://api.hsforms.com/submissions/v3/integration/submit/'+LEAD.hubspotPortalId+'/'+LEAD.hubspotFormId,{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ fields:[{name:'email',value:email},{name:'firstname',value:name},{name:'company',value:util}] })
      }).then(r=>showOk()).catch(()=>showOk('Saved. We\u2019ll be in touch shortly.'));
    } else {
      const body=encodeURIComponent('Please send the operator formula sheet.\n\nName: '+name+'\nUtility: '+util+'\nEmail: '+email);
      window.location.href='mailto:'+LEAD.fallbackEmail+'?subject=Formula%20sheet%20request&body='+body;
      showOk('Opening your email app to finish the request.');
    }
  };
}
