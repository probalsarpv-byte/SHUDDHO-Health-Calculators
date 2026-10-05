# SHUDDHO Health Calculators

Bilingual (Bangla + English), client-side nutrition and health calculator platform.

- 53 active calculators
- grouped by body composition, nutrition, metabolic, kidney, labs, heart, fitness, women, clinical nutrition, child health and healthy ageing
- 5 future validated modules reserved for licensed/reference-table based tools
- automatic bilingual SEO page generation
- sitemap.xml + robots.txt generation
- no backend required

Before first workflow run, replace `YOUR-GITHUB-USERNAME` in `.github/workflows/build-seo-pages.yml` with your GitHub username.

Clinical calculators are educational/reference tools and do not replace professional assessment.

## V2 additions
Original SHUDDHO modules (not copies of proprietary/official calculators):
- SHUDDHO Cardiometabolic Risk Explorer
- Child Growth Z-Score Learning Tool
- SHUDDHO Kidney Risk Factor Explorer
- Personalized Nutrition Profile
- Microbiome-Friendly Diet Diversity Score
- Sarcopenia Nutrition Screen
- Protein Distribution Score
- Weekly Plant Diversity
- Sodium Target
- Potassium Gap
- Sleep & Nutrition Recovery
- Metabolic Flexibility Lifestyle Score

The PREVENT/KFRE/WHO-growth concepts were not copied. Where official models require protected coefficients, licensed code or official LMS tables, V2 uses original educational factor explorers or user-supplied reference mathematics instead.

## V5 Health Platform
Beyond calculators, V5 adds:
- 12 original bilingual health assessments with result explanation and suggestions
- health trackers with localStorage trend graph
- lab report interpreter
- Food & Nutrient Tools connected to the Bangladesh Food Composition database
- Medication–Nutrition Awareness connected to MediNutrition
- local health dashboard
- personal health profile
- goal planner
- healthy habit challenges
- symptom & lifestyle checker
- reminders
- education / decision pathways
- printable report generator
- professional mode

Architecture remains static GitHub Pages. Personal entries stay in the user's browser unless the user exports/prints them.

## V5.1 Local-Only Final Structure
V5.1 uses a local-first privacy model:
- no SHUDDHO login required
- no profile/assessment/tracker cloud sync
- profile personalization is stored in browser localStorage
- onboarding, health profile, dashboard recommendations and privacy center
- export/import JSON backup
- one-click deletion of all SHUDDHO local data
- other public databases can be opened/embedded, but local profile data is not intentionally passed to them

Core flow:
Profile → Calculate → Assess → Track → Interpret → Food/Medication Context → Plan → Learn → Report → Follow-up

## V5.2 Hybrid Sync — preserves V5 + V5.1
Nothing from V5 or V5.1 is removed.

V5.2 adds an optional account layer on top of local-first storage:
- guest/local-only mode remains the default fallback
- Google Sign-In
- Email/password sign-in and account creation
- password reset
- local-first auto sync to Firestore when signed in
- sync on login, reconnect, tab return and approximately every 30 seconds while active
- latest-updated copy wins per SHUDDHO local data key
- separate local-data and cloud-data deletion controls
- account + cloud deletion control
- Firebase security rules restricting each user to their own path
- Firebase config placeholders; the site safely stays local-only until configured
- no server/admin secret is required in the GitHub repository

See `firebase/SETUP.md`.

## V5.3 Navigation & Discovery Upgrade
V5.3 preserves all V5/V5.1/V5.2 calculators, assessments, trackers, profile, Firebase optional sync and integrations.

Changes:
- Removed the visible “Embed in Blogger / iframe” section from calculator pages.
- `?embed=1` compact rendering remains available internally for Blogger embedding.
- Back button on calculator pages and every platform module page.
- Food-database-style compact calculator directory.
- Sticky horizontal filtering instead of long group-by-group scrolling.
- Four discovery axes: category, disease/health area, gender, and age.
- Search works together with classification.
- Important platform modules and popular calculators are shown on the landing page.
- Calculator pages use a cleaner compact visual hierarchy.
- Mobile order is calculator → result → related → details → how it works → limitations → FAQ → references.

## V5.4 — Unified Health Intelligence
V5.4 preserves every V5, V5.1, V5.2 and V5.3 module and adds one major new module:

### SHUDDHO Unified Health Profile
- separate prominent landing-page card; existing Health Assessments remain unchanged
- Quick Mode for basic measurements/lifestyle
- Advanced Mode with optional lab values
- original SHUDDHO educational context score (0–100), explicitly not a validated disease-risk probability
- domain map for body composition, metabolic health, heart, kidney, liver, nutrition, sleep/recovery, muscle/function and lifestyle/gut
- radar-style health wheel
- top priorities, protective factors and missing-data detection
- data-coverage confidence level
- suggested next steps and linked SHUDDHO tools
- red-flag symptom gate before scoring
- local profile/tracker auto-fill
- local save + optional Firebase sync compatibility
- dashboard and report integration
- Print / Save PDF support
- back navigation retained throughout the platform
