# NON-NEGOTIABLE AI CODING RULES

These rules apply to every coding task in the Madurai South Civic Connect project.

## RULE 1 — READ BEFORE MODIFYING

Before modifying any file:

* Read the file.
* Understand its purpose.
* Check its dependencies.
* Check where it is imported.
* Check whether other pages depend on it.

Never modify code blindly.

## RULE 2 — DO NOT REWRITE THE PROJECT

Do not rebuild the application from scratch unless explicitly instructed.

Preserve working code.

Make the smallest clean change necessary.

## RULE 3 — NO DUPLICATION

Do not duplicate:

* Components
* API logic
* Validation
* Translation strings
* Database queries
* Styling patterns

Create reusable utilities/components when repetition appears.

## RULE 4 — NO HARDCODED BUSINESS LOGIC IN UI

Do not put important business rules directly inside visual components.

For example, constituency validation should not be implemented inside a button component.

Create dedicated logic such as:

```text
locationValidator
geoService
constituencyService
```

## RULE 5 — LOCATION VALIDATION MUST BE REAL

This is non-negotiable.

The user must not be able to submit an issue outside Madurai South.

The server must validate:

```text
latitude
longitude
```

against the official constituency boundary.

Frontend validation alone is NOT sufficient.

## RULE 6 — LANGUAGE MUST NEVER MIX

**English selected → 100% English UI**

**தமிழ் selected → 100% Tamil UI**

Never create:

```text
Report an Issue / பிரச்சினையை பதிவு செய்ய
```

inside the same UI.

Use centralized translation files.

## RULE 7 — NO FAKE OFFICIAL DATA

Never create fake:

* Ward boundaries
* Constituency boundaries
* Government statistics
* Representative details
* Official department data

Use clearly labelled demo data until real data is available.

## RULE 8 — SERVER VALIDATION

Never trust:

* Client-side roles
* Client-side issue status
* Client-side priority
* Client-side location validation
* Client-submitted permissions

Validate important data server-side.

## RULE 9 — SECURITY FIRST

Never:

* Commit `.env`
* Expose service keys
* Put secrets in frontend code
* Log passwords
* Log sensitive citizen data
* Expose private citizen information through public APIs

## RULE 10 — RESPONSIVE BY DEFAULT

Every component must work on:

* Desktop
* Tablet
* Mobile

Do not build desktop first and “fix mobile later.”

Citizen reporting and tracking are mobile-first.

## RULE 11 — ACCESSIBILITY

Every interactive element must have:

* Accessible label
* Keyboard support
* Visible focus state
* Appropriate contrast

Do not use color alone to communicate status.

## RULE 12 — LOADING / ERROR / EMPTY STATES

Every data-driven component must consider:

```text
Loading
Success
Empty
Error
```

Do not leave users staring at blank screens.

## RULE 13 — API ERRORS

Never expose raw database errors to users.

Convert technical errors into safe user-friendly messages.

Detailed errors can be logged securely for developers.

## RULE 14 — DATABASE DESIGN

Do not put everything into one giant table.

Keep logical entities separated.

At minimum support:

```text
users
issues
issue_groups
categories
wards
action_updates
issue_evidence
citizen_verifications
```

## RULE 15 — ISSUE STATUS

Use controlled status values.

Do not allow arbitrary status strings.

Core lifecycle:

```text
SUBMITTED
RECEIVED
VERIFIED
ASSIGNED
IN_PROGRESS
ACTION_TAKEN
RESOLVED
CITIZEN_VERIFICATION
REOPENED
```

## RULE 16 — CITIZEN VERIFICATION

An issue marked resolved must support citizen verification.

If the citizen says:

**NO, STILL A PROBLEM**

the system must support reopening the issue.

## RULE 17 — DUPLICATE ISSUES

Do not treat every duplicate complaint as an independent public problem.

Support grouping related complaints into community issues.

Individual reports may remain separate internally, while the public/councillor view can show the grouped problem.

## RULE 18 — PUBLIC PRIVACY

Public users must never see private citizen details.

The public issue map should represent the civic problem, not expose unnecessary personal information.

## RULE 19 — PERFORMANCE

Avoid unnecessary:

* API calls
* Database queries
* Re-renders
* Large client bundles
* Huge images
* Blocking operations

Optimize only after understanding the actual bottleneck.

## RULE 20 — COMMENTS

Do not write comments explaining obvious code.

Use comments only for:

* Complex business rules
* Geospatial calculations
* Security decisions
* Non-obvious workarounds
* Important architectural decisions

## RULE 21 — TYPESCRIPT

Avoid:

```text
any
```

unless genuinely unavoidable.

Prefer explicit types/interfaces.

## RULE 22 — ENVIRONMENT VARIABLES

Use:

```text
NEXT_PUBLIC_*
```

only for values that are safe to expose publicly.

Never expose server secrets through public environment variables.

## RULE 23 — GIT SAFETY

Before large changes:

* Check current Git status.
* Avoid deleting unrelated work.
* Keep changes focused.
* Use meaningful commits when asked.

Never reset or force-delete user work without explicit permission.

## RULE 24 — TEST AFTER CHANGES

After implementing a feature:

1. Run type checking.
2. Run linting.
3. Run relevant tests.
4. Start/build the application if appropriate.
5. Check browser console errors.
6. Check mobile layout.
7. Check English mode.
8. Check Tamil mode.

## RULE 25 — DO NOT CLAIM SUCCESS WITHOUT VERIFYING

Never say:

“Everything works”

unless you actually checked the relevant implementation.

If something cannot be tested because required data/API credentials are missing, clearly state that.

## RULE 26 — BUILD IN SMALL STEPS

Do not generate the entire platform in one huge operation.

Recommended sequence:

```text
Foundation
↓
Design System
↓
Language System
↓
Homepage
↓
Report Issue
↓
Live Map
↓
Boundary Validation
↓
Database
↓
Tracking
↓
Councillor Dashboard
↓
MLA Dashboard
↓
Public Dashboard
↓
Authentication
↓
Testing
```

## RULE 27 — ASK ONLY WHEN NECESSARY

Do not repeatedly ask for confirmation for obvious implementation decisions.

Make reasonable technical decisions when requirements are clear.

Ask only when a decision would materially change:

* Architecture
* Security
* Data model
* Product behaviour
* Existing user work

## FINAL RULE

Every implementation must satisfy:

**FUNCTIONALITY + SECURITY + ACCESSIBILITY + RESPONSIVENESS + BILINGUAL CONSISTENCY + MAINTAINABILITY**

Do not sacrifice one of these just to make the UI look good.
