import {initial,transition} from './model.mjs';
const $=id=>document.getElementById(id);
let state=initial(), generation=0;
const messages={idle:'Generate a suggestion to begin.',generating:'Preparing a simulated suggestion…',review:'Check the evidence before approving. You can edit every word.',error:'The suggestion could not be generated. Your request is unchanged. Try another scenario or retry.',approved:'Approved in this demo only. No message has been sent.'};
function dispatch(event){state=transition(state,event);render();}
function render(){
  $('status').textContent=messages[state.phase];
  $('badge').textContent={idle:'Not started',generating:'Preparing',review:'Needs review',error:'Try again',approved:'Approved'}[state.phase];
  $('draft').disabled=state.phase!=='review';
  if($('draft').value!==state.draft)$('draft').value=state.draft;
  $('reviewed').disabled=state.phase!=='review';$('reviewed').checked=state.reviewed;
  $('approve').disabled=!(state.phase==='review'&&state.reviewed&&state.draft.trim());
  $('generate').disabled=['generating','approved'].includes(state.phase);
  $('scenario').disabled=['generating','approved'].includes(state.phase);
  $('generate').textContent=state.phase==='error'?'Retry suggestion':state.phase==='review'?'Regenerate suggestion':'Generate a suggestion';
  $('reopen').hidden=state.phase!=='approved';
  $('evidence').replaceChildren(...state.evidence.map(e=>{const box=document.createElement('div');box.className='evidence-card'+(e.warning?' warning':'');const title=document.createElement('h3');title.textContent=e.title;const body=document.createElement('p');body.textContent=e.text;box.append(title,body);return box;}));
  $('history').replaceChildren(...state.history.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
}
$('generate').addEventListener('click',()=>{
 const scenario=$('scenario').value,token=++generation;dispatch({type:'generate'});
 setTimeout(()=>{if(token!==generation)return;
  if(scenario==='failure'){dispatch({type:'fail'});return;}
  const partial=scenario==='partial';
  dispatch({type:'result',draft:partial?'Hi Alex — I can help investigate the export limit. Could you confirm your workspace plan and whether you are exporting the current view or the full report? I’ll use those details to check the next step.':'Hi Alex — the current-view export is limited to 500 rows. In the report menu, choose “Export full report” to include all rows. Please let me know if that option is missing and I can help investigate.',evidence:[{title:'Fictional help article · export modes',text:'Current-view exports are capped at 500 rows. Full-report export is available on the Team plan.'},partial?{title:'Missing evidence · account context',text:'The workspace plan is unknown. Ask for context before promising that full-report export is available.',warning:true}:{title:'Fictional account record',text:'This example workspace is on the Team plan.'}]});
 },650);
});
$('draft').addEventListener('input',e=>dispatch({type:'edit',value:e.target.value}));
$('reviewed').addEventListener('change',e=>dispatch({type:'reviewed',value:e.target.checked}));
$('approve').addEventListener('click',()=>dispatch({type:'approve'}));
$('reopen').addEventListener('click',()=>{dispatch({type:'reopen'});$('draft').focus();});
$('reset').addEventListener('click',()=>{generation++;dispatch({type:'reset'});$('generate').focus();});
render();
