# Upload Rules (Draft)

> Legal agent maintains. Not legal advice.

## Allowed (with rights)

- Original AI-generated video where uploader has commercial/non-commercial rights per tool ToS
- Content uploader created or has explicit license to distribute
- Properly attributed CC-licensed work (license type recorded)

## Restricted / review

- Real-person likeness without consent
- Copyrighted music, movie clips, game assets without license
- Minors depicted
- Deepfake of identifiable persons

## Prohibited

- Full re-upload of others' work without rights
- Malware links, phishing
- Illegal content per applicable law

## Platform actions

| Trigger | Action |
|---------|--------|
| User report | Queue for review; hide pending threshold |
| Repeat reports | Suspend upload; notify user |
| DMCA notice | Takedown workflow (see POLICY_DRAFTS/dmca.md) |

## Implementation handoff

- **Data:** `reports` table, `uploads.license_confirmed`, moderation flags
- **UI:** Upload form checkboxes + tool metadata fields
- **Security:** rate limits on upload API
