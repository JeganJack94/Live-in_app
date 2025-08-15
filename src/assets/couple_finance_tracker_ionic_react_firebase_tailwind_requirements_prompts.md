# Couple Finance Tracker — Product Requirements & Dev Guide

**Stack:** Ionic React (TS) · Firebase Auth + Firestore + Cloud Functions + Storage · TailwindCSS · Capacitor (PWA + Android)\
**Theme:**

- Primary: `#ee617a`
- Accent: `#9f3dee`
- Soft: `#e9f08f`

---

## 1) Problem & Vision

**Problem:** Couples want to manage a *combined* monthly income using the 50/30/20 rule without moving money to a single account. Each partner spends from their own accounts. They need a simple shared view to track: who spent, how much, and whether they’re within the Needs/Savings/Wants allocation—plus clear month/year analytics and exportable reports.

**Vision:** A private, two-person financial tracker that:

- Syncs instantly between both logins.
- Auto-calculates budget caps (Needs 50%, Savings 30%, Wants 20%) from the combined salary.
- Attributes each transaction to a person and category.
- Gives live progress bars, alerts, and month/year reports.
- Works offline (queues writes) and supports CSV export.

**Non-Goals (v1):** Bank sync/aggregators, tax filing, investment execution, multi-currency, >2 users.

---

## 2) Users & Roles

- **Partner A** and **Partner B** (exactly two seats per workspace). Both are admins.
- **Workspace (Couple)**: Encloses the two users, budgets, categories, transactions.

**Login flows:**

- Default, pre-provisioned email/password or magic-link (optional).
- Enforce that the workspace can only have 2 active members.

---

## 3) Core Features

1. **Combined Income Setup**

   - Inputs: monthly salary of A and B.
   - Compute combined: `totalIncome = incomeA + incomeB`.
   - Allocation caps (editable rule percentages, default 50/30/20):
     - Needs Cap = `totalIncome * 0.5`
     - Savings Cap = `totalIncome * 0.3`
     - Wants Cap = `totalIncome * 0.2`
   - Optional: custom rule presets per month (e.g., 55/25/20).

2. **Categories**

   - Default Needs/Wants/Savings parents with common subcategories.
   - Allow custom add/edit; parent type is fixed to one of {Needs, Wants, Savings}.

3. **Transactions**

   - Fields: date, amount, category (parent type locked), payee/notes, paidBy (A|B), attachment (receipt), tags, isRecurring, recurrenceRule.
   - Quick-add (fab button), scan receipt (later), import CSV.

4. **Dashboards**

   - **Month View:** progress bars by Needs/Savings/Wants; spend vs caps; top categories; A vs B contribution.
   - **Year View:** monthly trend, cumulative savings, category heatmap.

5. **Reports**

   - Filters: period, person, category, min/max amount, tags.
   - Export: CSV (transactions), PDF summary (later).

6. **Notifications & Nudges** (optional v1 via FCM)

   - When any bucket reaches 80%, 100% of cap.
   - Weekly digest snapshot (opt-in).

7. **Offline-first**

   - Cache last 90 days; queue writes and retry on reconnect.

8. **Security & Privacy**

   - Firestore rules to isolate each workspace.
   - Only two user UIDs can read/write per workspace.

---

## 4) Data Model (Firestore)

**Collection hierarchy:**

```
/workspaces (doc: {id})
  - name
  - createdAt
  - memberUids: [uidA, uidB] // enforced length=2
  - theme: {primary, accent, soft}
  - rule: {needsPct: number, savingsPct: number, wantsPct: number}
  - incomes: { A: number, B: number, currency: 'INR' }
  - totalsCache: { monthKey: {...caps & usage}, yearKey: {...} }

/workspaces/{wid}/categories (doc)
  - name
  - type: 'NEEDS' | 'SAVINGS' | 'WANTS'
  - archived: boolean
  - createdBy: uid

/workspaces/{wid}/transactions (doc)
  - date: Timestamp
  - amount: number (positive)
  - type: 'NEEDS' | 'SAVINGS' | 'WANTS' // derived from category
  - categoryId
  - paidBy: 'A' | 'B'
  - notes?: string
  - payee?: string
  - tags?: string[]
  - attachmentUrl?: string
  - isRecurring?: boolean
  - recurrenceRule?: string (RRULE)
  - monthKey: 'YYYY-MM'
  - yearKey: 'YYYY'
  - createdAt, createdBy

/workspaces/{wid}/settings (singleton doc)
  - rule: {needsPct, savingsPct, wantsPct}
  - currency: 'INR'
  - startDayOfMonth: number (1)

/workspaces/{wid}/reports (doc per export)
  - type: 'CSV'
  - range: {from, to}
  - filters: {...}
  - status: 'READY'|'PENDING'|'FAILED'
  - fileUrl
```

**Derived fields & caches:**\
On transaction write/update/delete, Cloud Function updates monthly/yearly aggregates in `totalsCache` to keep dashboard snappy.

**Monthly aggregates shape (example):**

```
/workspaces/{wid}/aggregates/month/{YYYY-MM}
  - caps: { needs: number, savings: number, wants: number }
  - spent: { needs: number, savings: number, wants: number }
  - byPerson: {
      A: { needs: number, savings: number, wants: number },
      B: { needs: number, savings: number, wants: number }
    }
  - topCategories: [{categoryId, amount}]
```

---

## 5) Calculations

- **Caps:**
  - `cap.needs = (incomeA + incomeB) * needsPct`
  - `cap.savings = (incomeA + incomeB) * savingsPct`
  - `cap.wants = (incomeA + incomeB) * wantsPct`
- **Usage:** Sum of transactions per type within monthKey.
- **Remaining:** `cap - usage` (min 0 for visuals).
- **Contribution Split:** Sum per person & per type.
- **Compliance:** Green ≤80% of cap, Amber 80–100%, Red >100%.

**Example (₹100,000 total)**

- Needs: ₹50,000, Savings: ₹30,000, Wants: ₹20,000.
- If A spent ₹12,000 (Needs) + ₹3,000 (Wants) and B spent ₹20,000 (Needs):
  - Needs used = ₹32,000 (64% of cap), Wants used = ₹3,000 (15%).

---

## 6) Information Architecture (App Screens)

1. **Onboarding / Workspace Setup**

   - Add names/photos for A & B, set monthly incomes, confirm rule (editable), currency.
   - Guard rail: cannot continue until both incomes set.

2. **Home (Month Dashboard)**

   - Capsule cards: Needs, Savings, Wants — progress rings vs caps.
   - A vs B bar, quick actions (Add Transaction, Edit Income/Rule).
   - Recent 5 transactions list with avatars (A/B chip).

3. **Add/Edit Transaction**

   - Amount keypad, date, category picker (grouped by type), paidBy toggle (A/B), notes, tags, receipt attach.
   - “Mark as recurring” → RRULE dialog.

4. **Analytics**

   - Month: stacked bar of A vs B per type, top categories, daily curve.
   - Year: 12-month trend line, Sankey-like split (later), category heatmap.

5. **Categories**

   - Manage list, add/edit, archive. Parent type fixed.

6. **Reports**

   - Filters + “Export CSV”. Queue job; toast on completion.
   - Download from Storage link.

7. **Settings**

   - Incomes for A & B, rule percentages, start day, theme preview, data reset.

---

## 7) UX & Visual Design

- **Tailwind tokens:**
  - `--color-primary: #ee617a;`
  - `--color-accent: #9f3dee;`
  - `--color-soft: #e9f08f;`
- Use soft pastel backgrounds, rounded-2xl cards, subtle shadows, large tap targets.
- Chips for person (A/B) with small avatars.
- Use Ionic
  - `IonTabs` (Home, Analytics, Reports, Settings)
  - `IonFab` for Add Transaction
  - `IonSegment` for Month/Year toggle

---

## 8) Tech & Architecture

**Frontend:** Ionic React (TypeScript), Tailwind, React Hook Form, React Query (or Firestore listeners), Zustand/Context for lightweight state.\
**Backend:** Firebase (Auth, Firestore, Functions, Storage).\
**Mobile:** Capacitor (Android build).\
**CI:** Vercel/Netlify for web; GitHub Actions for Functions.

**Sync pattern:**

- Client writes transaction → Firestore → Function updates aggregates → client listens to `/aggregates/month/{key}` to refresh.

**Offline:**

- Enable Firestore persistence; queue ops.

---

## 9) Security Rules (Firestore)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isMember(wid) {
      return request.auth != null &&
             wid in get(/databases/$(database)/documents/workspaces).data; // simplified idea
    }

    match /workspaces/{wid} {
      allow read, write: if request.auth != null &&
        request.auth.uid in resource.data.memberUids &&
        resource.data.memberUids.size() == 2;

      match /categories/{cid} {
        allow read, write: if request.auth.uid in get(/databases/$(database)/documents/workspaces/$(wid)).data.memberUids;
      }

      match /transactions/{tid} {
        allow read, write: if request.auth.uid in get(/databases/$(database)/documents/workspaces/$(wid)).data.memberUids;
      }

      match /aggregates/{scope}/{id} {
        allow read: if request.auth.uid in get(/databases/$(database)/documents/workspaces/$(wid)).data.memberUids;
        allow write: if false; // only via Cloud Functions
      }

      match /reports/{rid} {
        allow create, read: if request.auth.uid in get(/databases/$(database)/documents/workspaces/$(wid)).data.memberUids;
        allow delete, update: if false; // immutable once generated
      }

      match /settings/{sid} {
        allow read, write: if request.auth.uid in get(/databases/$(database)/documents/workspaces/$(wid)).data.memberUids;
      }
    }
  }
}
```

*(Adjust helper reads with **`getAfter`**/**`get`** limits as needed.)*

---

## 10) Cloud Functions

- **onWrite: transactions** → recompute monthly/yearly aggregates; clamp negatives; update topCategories.
- **exportCSV(workspaceId, filters)** → query, stream to CSV in Storage, write `/reports` doc.
- **notifyCaps(workspaceId)** → schedule (every hour) to check 80%/100% thresholds and send FCM to both UIDs.

---

## 11) Folder Structure (Frontend)

```
src/
  app/
    main.tsx
    routes.tsx
  components/
    charts/
      BudgetProgress.tsx
      StackedABChart.tsx
      MonthTrend.tsx
    forms/
      TransactionForm.tsx
      IncomeRuleForm.tsx
    ui/
      Card.tsx
      Chip.tsx
      EmptyState.tsx
  contexts/
    AuthContext.tsx
    WorkspaceContext.tsx
  hooks/
    useTransactions.ts
    useAggregates.ts
    useReports.ts
  pages/
    Onboarding.tsx
    Home.tsx
    AddTransaction.tsx
    Analytics.tsx
    Categories.tsx
    Reports.tsx
    Settings.tsx
  services/
    firebase.ts
    firestore.ts
    storage.ts
    csv.ts
    notifications.ts
  styles/
    tailwind.css
  types/
    models.ts
  utils/
    dates.ts
    money.ts
    rrule.ts
  index.css
```

**Tailwind config snippet:**

```ts
// tailwind.config.ts
export default {
  content: ['./index.html','./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: '#ee617a',
        accent: '#9f3dee',
        soft: '#e9f08f',
      }
    }
  },
  plugins: [],
}
```

---

## 12) TypeScript Types

```ts
export type BucketType = 'NEEDS' | 'SAVINGS' | 'WANTS';

export interface Workspace {
  id: string;
  name: string;
  memberUids: [string, string];
  incomes: { A: number; B: number; currency: 'INR' };
  rule: { needsPct: number; savingsPct: number; wantsPct: number };
  theme?: { primary: string; accent: string; soft: string };
}

export interface Category { id: string; name: string; type: BucketType; archived?: boolean; }

export interface Transaction {
  id: string;
  date: string; // ISO
  amount: number; // positive
  type: BucketType;
  categoryId: string;
  paidBy: 'A' | 'B';
  notes?: string;
  payee?: string;
  tags?: string[];
  attachmentUrl?: string;
  isRecurring?: boolean;
  recurrenceRule?: string; // RFC5545
  monthKey: string; // YYYY-MM
  yearKey: string;  // YYYY
}

export interface MonthAggregate {
  caps: { needs: number; savings: number; wants: number };
  spent: { needs: number; savings: number; wants: number };
  byPerson: {
    A: { needs: number; savings: number; wants: number };
    B: { needs: number; savings: number; wants: number };
  };
  topCategories: { categoryId: string; amount: number }[];
}
```

---

## 13) Key UI Components (Behavior Notes)

- **BudgetProgress**: shows ring with % and remaining; props `{used, cap, label}`; color-coded (primary/accent/soft per bucket).
- **StackedABChart**: stacked bars per type (A/B split).
- **TransactionForm**: dual keypad (₹ and decimal), category segmented control; paidBy pill toggle; validates type consistency.
- **IncomeRuleForm**: slider inputs for needs/savings/wants; sum must be 100% (show red if not).

---

## 14) Flows

**Add Transaction** → Save → Function updates aggregates → Home updates instantly via listener.\
**Edit Rule** → Recompute caps for current month and future months (question: retroactive or not? v1: only current & onward).\
**CSV Export** → Create report doc → Function builds CSV → writes Storage → set `fileUrl` → UI shows download.

---

## 15) Testing

- Unit: utils (dates, money), reducers, functions.
- Integration: adding transactions updates aggregates; rule changes reflow caps.
- E2E: onboarding, two-device sync, offline write.

---

## 16) Performance & Indexes

**Firestore composite indexes (examples):**

- transactions by `workspaceId, monthKey`
- transactions by `workspaceId, yearKey`
- reports by `workspaceId, createdAt`

Paginate long lists; use `limit` + `startAfter`.

---

## 17) Prompts (AI / MCP Style Tasks)

> Use these as structured tasks for your “AI Monk/MCP” or OpenAI function calls.

### A. Categorize Transactions

**Instruction:**

- Input: `{ payee, notes, amount, date }`
- Output: `{ type: 'NEEDS'|'SAVINGS'|'WANTS', categoryName }`
- Rules:
  - Essentials like groceries, rent, utilities → `NEEDS`.
  - Long-term deposits, emergency fund, SIP → `SAVINGS`.
  - Dining out, entertainment, shopping (non-essential) → `WANTS`.
- If uncertain, return `typeOnly` with confidence.

**Prompt:**

```
You are a transaction classifier for a couple’s 50/30/20 budget.
Return strict JSON: { type, categoryName, confidence }
Types: NEEDS, SAVINGS, WANTS.
Map common Indian merchants (e.g., Swiggy→WANTS:Food Out; BigBasket→NEEDS:Grocery; Rent→NEEDS:Housing; SIP→SAVINGS:Investments).
If confidence < 0.6, set categoryName = null.
Input: {{transactionJson}}
```

### B. Monthly Summary (Narrative + Tips)

```
Generate a concise monthly summary for a couple’s 50/30/20 budget.
Input: {caps, spent, byPerson, topCategories}
Output (Markdown): Sections: Overview, Bucket Status (with %), Who Spent More, Top 3 Categories, Suggested Actions.
If any bucket >100%, advise recovery steps next month.
Keep under 180 words.
```

### C. Overspend Alerts

```
Given {caps, spent}, return alert JSON list when a bucket crosses 80% or 100% usage.
Include: {bucket, threshold, message}.
Tone: neutral, actionable.
```

### D. CSV Export Formatter

```
You format Firestore transaction docs into CSV headers & rows.
Required headers: Date, Person, Bucket, Category, Amount, Notes, Tags.
Money values should be integers or two decimals. Date in YYYY-MM-DD.
```

### E. Goal Hints (Optional)

```
Given last 6 months of spending by bucket, suggest a small habit change for each bucket (1 sentence each).
```

---

## 18) API Contracts (Client ↔ Functions)

**POST /exportCsv**

- Body: `{ workspaceId, from, to, filters }`
- Returns: `{ reportId }`
- Status via listener on `/reports/{reportId}`.

**GET /aggregates/month/{YYYY-MM}** (Firestore doc)

- Live listener; no REST.

---

## 19) Setup Checklist

-

---

## 20) Sample UI Copy

- Empty state (Home): “Let’s add your first expense. We’ll show Needs/Savings/Wants progress here.”
- Alert 80%: “Heads up—Needs is at 82% of this month’s cap. Consider pausing optional purchases.”

---

## 21) Roadmap

**v1:** Two users, 50/30/20 caps, transactions, month/year analytics, CSV export, offline cache.\
**v1.1:** Recurring transactions, FCM nudges, receipt uploads, import CSV.\
**v1.2:** Budget presets per month, PDF report.\
**v2:** Shared goals, envelope sub-budgets, basic bank CSV parser.

---

## 22) Developer Notes (Gotchas)

- Always derive `type` from category to avoid mismatches.
- Normalize amounts to paise internally (store as integer) to avoid float drift.
- Use `monthKey`/`yearKey` strings for simpler queries and indexes.
- Keep rule percentages summing to 100%; block save otherwise.
- Respect privacy—no 3rd-party analytics in v1.

