# Human review workbench
A small interaction study by **Luke Dooley**, Senior Product Designer and AI-assisted builder.

A runnable example of an AI-assisted support workflow: inspect evidence, edit a suggestion, explicitly approve it, and reopen it when necessary.

**Portfolio demonstration, created with AI assistance.** Responses and customer data are fictional. There is no AI API, backend, delivery integration or persistent storage. This is new sample code, not extracted from a shipped product.

## Try it
Clone or download this repository, then serve its root:
```sh
python3 -m http.server 8000
```
Open http://localhost:8000. A static server is needed because the demo uses JavaScript modules.

## Explore
1. **Evidence available:** generate, inspect the two evidence cards, edit and acknowledge the response, then approve locally.
2. **Missing account context:** see how the draft asks for missing information rather than promising an unsupported capability.
3. **Generation fails:** recover with a retry or another scenario.
4. **Reopen:** change an approved response and review it again.

## Design decisions
| Decision | Why it matters |
| --- | --- |
| Evidence sits beside the draft | Reviewers can compare the suggestion with its basis. |
| No invented confidence percentage | A number would imply calibration this simulation does not have. |
| Approval requires a review acknowledgement | Generating text is separate from deciding to use it. |
| Editing clears acknowledgement | Approval applies to the current wording. |
| Approved drafts are locked until reopened | The state and next action stay explicit. |
| Error and reset states are recoverable | Failure does not strand the reviewer. |

## Implementation
- Plain HTML/CSS and native JavaScript modules; no build step or dependencies.
- Pure state transitions in `model.mjs`.
- UI rendering uses `textContent` for dynamic text.
- Native labelled controls, visible focus states and a polite live status region.
- Responsive two-panel layout that stacks on smaller screens.
- A generation token prevents an old delayed result from appearing after reset.

## Validation
```sh
node --test model.test.mjs
```
Four tests cover approval gating, invalidated acknowledgement after editing, reopening, and failure/stale-result handling. Browser checks cover the main review and recovery paths. This is not a formal accessibility audit or a production security assessment.

## Next steps for a real product
A production implementation would need authenticated reviewer identity, server-side enforcement, durable audit history, an evidence-provenance model, model evaluation, and a separate confirmed delivery action. Those are intentionally outside this small interaction study.

[Product showcases](https://github.com/Amahuaca) · [Portfolio](https://lukedooley.design)
