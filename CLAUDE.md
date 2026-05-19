# CLAUDE.md — Afoma Francis n8n Portfolio

## Project Overview
GitHub Pages portfolio site + 8 production-ready n8n automation workflow JSON files.

- **Live site:** https://afoma94.github.io
- **n8n instance:** https://n8n.srv1589918.hstgr.cloud
- **Error logging:** Google Sheets — "n8n Error Log" spreadsheet

---

## File Structure

```
Afoma94.github.io/
├── index.html                          # Portfolio site (single page)
├── css/styles.css                      # Design system & responsive styles
├── js/main.js                          # Nav, scroll animations, mobile menu
├── .gitignore                          # Excludes secrets, keys, node_modules
├── CLAUDE.md                           # This file
└── workflows/
    ├── shared/
    │   └── error-handler.json          # Shared error sub-workflow (import FIRST)
    ├── 01-salon-booking.json
    ├── 02-ai-video-posting.json
    ├── 03-claim-settlement-feedback.json
    ├── 04-ai-invoice-sap.json
    ├── 05-resume-avatar-video.json
    ├── 06-linkedin-outreach.json
    ├── 07-social-media-approvals.json
    └── 08-rag-agent-clothing.json
```

---

## How to Import Workflows into n8n

### Step 1 — Import the shared error handler FIRST
1. Open your n8n instance
2. Click **+ New Workflow** → **Import from file**
3. Select `workflows/shared/error-handler.json`
4. Save and **note the workflow ID** shown in the URL (e.g., `wf_abc123`)
5. This ID goes into every other workflow's `errorWorkflow` field (see Step 4)

### Step 2 — Import each numbered workflow
Repeat for `01-salon-booking.json` through `08-rag-agent-clothing.json`:
1. Import from file as above
2. n8n will show unfilled credential slots — fill each one (see credential list below)
3. Update all `REPLACE_WITH_*` placeholder values (see placeholder reference below)
4. Save and activate

### Step 3 — Fill in credentials
Create each credential in **n8n → Settings → Credentials** before or after import:

| Credential Name in n8n | Type | Used in Workflow(s) |
|---|---|---|
| Google Sheets OAuth2 | googleSheetsOAuth2Api | 01, 02, 03, 06, 07, error-handler |
| Google Calendar OAuth2 | googleCalendarOAuth2Api | 01 |
| Twilio Account | twilioApi | 01, 08 |
| Gmail OAuth2 | gmailOAuth2 | 01, 03, 04, 05, 06 |
| OpenAI API | openAiApi | 02, 03, 04, 05, 06, 07, 08 |
| HeyGen API Key | httpHeaderAuth (name: HeyGen API Key) | 02, 05 |
| Buffer API | httpHeaderAuth (name: Buffer API) | 02, 07 |
| HubSpot API | hubspotApi | 03, 06 |
| Google Drive OAuth2 | googleDriveOAuth2 | 04, 05 |
| Airtable API | airtableTokenApi | 04, 08 |
| SAP API Credentials | httpBasicAuth | 04 |
| Slack Bot Token | slackApi | 04, 06, 07, 08 |
| PhantomBuster API | httpHeaderAuth (name: PhantomBuster API) | 06 |
| Pinecone API | httpHeaderAuth (name: Pinecone API) | 08 |
| Shopify API | shopifyApi | 08 |

### Step 4 — Replace all placeholder values

Search for `REPLACE_WITH_` in each workflow after import and substitute:

| Placeholder | What to put there |
|---|---|
| `REPLACE_WITH_ERROR_HANDLER_WORKFLOW_ID` | Workflow ID of the imported error-handler (from Step 1) |
| `REPLACE_WITH_CREDENTIAL_ID` | The credential ID assigned by n8n after creating it |
| `REPLACE_WITH_SPREADSHEET_ID` | Google Sheets spreadsheet ID (from the URL of your sheet) |
| `REPLACE_WITH_DRIVE_FOLDER_ID` | Google Drive folder ID for PDF archive |
| `REPLACE_WITH_AIRTABLE_BASE_ID` | Airtable base ID (from airtable.com/api) |
| `REPLACE_WITH_SAP_HOST` | Your SAP environment hostname |
| `REPLACE_WITH_COMPANY_CODE` | Your SAP company code |
| `REPLACE_WITH_CONTENT_APPROVALS_CHANNEL_ID` | Slack channel ID for social media approvals |
| `REPLACE_WITH_OUTREACH_APPROVALS_CHANNEL_ID` | Slack channel ID for LinkedIn outreach approvals |
| `REPLACE_WITH_FINANCE_CHANNEL_ID` | Slack channel ID for finance/invoice alerts |
| `REPLACE_WITH_SUPPORT_CHANNEL_ID` | Slack channel ID for customer support escalations |
| `REPLACE_WITH_AVATAR_ID` | HeyGen avatar ID from your HeyGen account |
| `REPLACE_WITH_VOICE_ID` | HeyGen voice ID |
| `REPLACE_WITH_ELEVENLABS_VOICE_ID` | ElevenLabs voice ID |
| `REPLACE_WITH_PHANTOM_ID` | PhantomBuster phantom (agent) ID |
| `REPLACE_WITH_PINECONE_INDEX_HOST` | Pinecone index host URL |

---

## Google Sheets Setup

Create a Google Spreadsheet with these tabs:

### Error Handler spreadsheet — "n8n Error Log" tab
Columns: `timestamp` | `workflow_name` | `node_name` | `error_message` | `execution_id` | `input_summary`

### Workflow 01 — Salon Booking — "Booking Log" tab
Columns: `timestamp` | `name` | `email` | `phone` | `service` | `appointment_date` | `calendar_event_id` | `status`

### Workflow 02 — Content Queue — "Content Queue" tab
Columns: `date` | `prompt` | `status` | `video_url` | `posted_at` | `platforms`

### Workflow 03 — Claims — "Claims Log" tab
Columns: `timestamp` | `claim_id` | `claimant_email` | `sentiment` | `category` | `priority` | `summary` | `response_sent`

### Workflow 06 — LinkedIn Outreach — "Prospects" tab
Columns: `name` | `linkedin_url` | `company` | `status` | `message_sent` | `sent_at`

### Workflow 07 — Social Media — "Content Calendar" tab
Columns: `date` | `topic` | `platform_targets` | `tone` | `status` | `instagram_copy` | `linkedin_copy` | `twitter_copy` | `updated_at`

---

## Security Notes

- Zero hardcoded API keys in any workflow JSON file
- All credentials use the `REPLACE_WITH_CREDENTIAL_ID` placeholder pattern
- Webhook endpoints should have n8n Header Auth enabled in production
- SAP node uses HTTPS only — never HTTP
- Phone numbers in logs are masked to last 4 digits
- The `.gitignore` excludes all secret/key file patterns

**After completing setup, rotate your n8n API key** in n8n → Settings → API → Revoke and re-generate.

---

## Workflow 08 — RAG Setup (Pinecone)

Before activating workflow 08, you need a populated Pinecone index:

1. Create a Pinecone index named `clothing-catalogue`
2. Use `text-embedding-3-small` embedding model (1536 dimensions)
3. Upload your product catalogue vectors with namespace `clothing-catalogue`
4. Each vector metadata should include: `product_name`, `description`, `price`, `category`, `sku`

---

## Contact / Portfolio Updates

To update the live contact email and LinkedIn URL:
- File: `index.html`
- Search for `hello@afomafrancis.com` and replace with your real email
- Search for `https://linkedin.com/in/afomafrancis` and replace with your LinkedIn URL

---

## Deployment

```bash
git init
git remote add origin https://github.com/Afoma94/Afoma94.github.io.git
git add .
git commit -m "feat: portfolio site + 8 production n8n automation workflows"
git push -u origin main
```

GitHub Pages serves automatically from the `main` branch root.
Live at **https://afoma94.github.io** (~2 minutes after first push).
