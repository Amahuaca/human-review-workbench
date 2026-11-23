// Pure transitions keep approval separate from suggestion generation.
export const initial = () => ({phase:'idle', draft:'', evidence:[], reviewed:false, history:[]});
export function transition(state, event) {
  const next = {...state, history:[...state.history]};
  if(event.type === 'reset') return initial();
  if(event.type === 'generate' && ['idle','error','review'].includes(state.phase)) {
    return {...next, phase:'generating', reviewed:false, draft:'', evidence:[]};
  }
  if(event.type === 'result' && state.phase === 'generating') {
    return {...next, phase:'review', draft:event.draft, evidence:event.evidence, reviewed:false};
  }
  if(event.type === 'fail' && state.phase === 'generating') return {...next,phase:'error'};
  if(event.type === 'edit' && state.phase === 'review') return {...next,draft:event.value,reviewed:false};
  if(event.type === 'reviewed' && state.phase === 'review') return {...next,reviewed:event.value};
  if(event.type === 'approve' && state.phase === 'review' && state.reviewed && state.draft.trim()) {
    return {...next,phase:'approved',history:[...state.history,'Approved by reviewer']};
  }
  if(event.type === 'reopen' && state.phase === 'approved') return {...next,phase:'review',reviewed:false,history:[...state.history,'Reopened for review']};
  return state;
}
