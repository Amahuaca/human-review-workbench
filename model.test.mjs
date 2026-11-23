import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initial,transition as step} from './model.mjs';
const review=()=>step(step(initial(),{type:'generate'}),{type:'result',draft:'A draft',evidence:[]});
test('approval requires review and non-empty content',()=>{let s=review();assert.equal(step(s,{type:'approve'}).phase,'review');s=step(s,{type:'reviewed',value:true});assert.equal(step(s,{type:'approve'}).phase,'approved');s=step(s,{type:'edit',value:'  '});s=step(s,{type:'reviewed',value:true});assert.equal(step(s,{type:'approve'}).phase,'review');});
test('editing invalidates previous acknowledgement',()=>{let s=step(review(),{type:'reviewed',value:true});s=step(s,{type:'edit',value:'Changed'});assert.equal(s.reviewed,false);assert.equal(step(s,{type:'approve'}).phase,'review');});
test('approved content is locked until reopened',()=>{let s=step(step(review(),{type:'reviewed',value:true}),{type:'approve'});assert.equal(step(s,{type:'edit',value:'Unexpected'}).draft,'A draft');s=step(s,{type:'reopen'});assert.equal(s.phase,'review');assert.equal(s.reviewed,false);assert.equal(s.history.length,2);});
test('failure is recoverable and stale results cannot enter idle state',()=>{const failed=step(step(initial(),{type:'generate'}),{type:'fail'});assert.equal(step(failed,{type:'generate'}).phase,'generating');assert.deepEqual(step(initial(),{type:'result',draft:'Stale',evidence:[]}),initial());});
