# TECH STACK SYSTEM PROMPT

Use the following technical architecture for Madurai South Civic Connect unless the existing project already contains an equivalent or better implementation.

## FRONTEND

### Framework

Use:

**Next.js + TypeScript**

Prefer the modern App Router architecture.

Use TypeScript strictly.

Do NOT use plain JavaScript for new application code unless there is a specific compatibility reason.

## UI

Use:

**Tailwind CSS**

Use:

**shadcn/ui**

for reusable accessible UI primitives where appropriate.

The visual design must remain custom and match the approved Madurai South Civic Connect design.

Do not make the website look like a default shadcn demo.

## ICONS

Use:

**Lucide React**

Do not use random icon libraries for individual components.

Keep iconography consistent.

## FORMS

Use:

**React Hook Form**

with:

**Zod**

for validation.

Client-side validation should provide immediate feedback.

Server-side validation must also be performed before storing important data.

## DATABASE

Use:

**PostgreSQL**

Preferred platform:

**Supabase**

Use PostgreSQL for:

* Users
* Issues
* Issue groups
* Wards
* Categories
* Action updates
* Evidence
* Citizen verification
* Roles
* Analytics data

## GEOLOCATION

Use:

**PostGIS**

for spatial database functionality when available.

The database should support:

* Latitude
* Longitude
* Point geometry
* Constituency polygon
* Ward polygon
* Point-in-polygon queries

## MAP

Use:

**Leaflet**

with:

**OpenStreetMap**

unless an existing approved map provider is already implemented.

The map must support:

* Interactive markers
* Constituency boundary polygon
* Location selection
* Marker dragging
* Current location
* Zoom
* Location validation

## LOCATION VALIDATION

Do not validate constituency membership using text matching.

Never do:

```text
if address.includes("Madurai South")
```

Instead:

```text
Address
→ Geocoding
→ Latitude/Longitude
→ Spatial point-in-polygon check
→ Constituency validation
```

Use PostGIS or a reliable GeoJSON point-in-polygon implementation.

## GEOJSON

Keep official boundary files separate from application logic.

Recommended structure:

```text
data/
  boundaries/
    madurai-south.geojson
    wards/
```

Do not hardcode hundreds of polygon coordinates inside React components.

## AUTHENTICATION

Preferred:

**Supabase Auth**

Implement role-based access control.

Roles:

```text
citizen
councillor
mla
admin
```

Do not trust role information sent from the client.

Verify permissions server-side.

## FILE STORAGE

Citizen evidence such as:

* Images
* Videos

should be stored using a proper object/file storage service.

Preferred:

**Supabase Storage**

Do not store large binary files directly inside PostgreSQL.

Store the file reference/URL and metadata in the database.

## API

Use clean API/server architecture.

Separate:

* UI
* Business logic
* Database access
* Validation
* Authentication
* File handling
* Geospatial logic

Do not put database queries directly inside large UI components.

## STATE MANAGEMENT

Do not introduce Redux automatically.

Use:

* React state
* Server state
* URL state
* Context where genuinely useful

Introduce a dedicated state library only if the project actually requires it.

## INTERNATIONALIZATION

Use a proper i18n architecture.

Required languages:

```text
en
ta
```

English and Tamil must be completely separated.

Never hardcode bilingual strings inside components.

## TYPOGRAPHY

Use a professional modern font for English.

For Tamil, ensure proper Unicode support.

Preferred Tamil font:

**Noto Sans Tamil**

## CHARTS

For dashboards, use a maintainable chart library such as:

**Recharts**

Charts must use real backend data once available.

During development, clearly separate demo data from production data.

## TESTING

Use:

* TypeScript checking
* ESLint
* Unit tests where appropriate
* Integration tests for critical flows
* End-to-end tests for major user journeys

Critical flows requiring testing:

1. Citizen reporting
2. Location validation
3. Outside-boundary rejection
4. Issue submission
5. Issue tracking
6. Citizen verification
7. Reopening an issue
8. Role-based access
9. Language switching

## DEPLOYMENT

Preferred architecture:

```text
Frontend / Next.js
        ↓
Supabase
        ↓
PostgreSQL + PostGIS
        ↓
Storage
        ↓
Authentication
```

Use environment variables for deployment configuration.

Never commit secrets to Git.

## IMPORTANT

If the existing repository already uses a different stack that is working correctly:

**DO NOT MIGRATE THE ENTIRE PROJECT JUST TO MATCH THIS STACK.**

Inspect first.

Preserve compatible existing architecture.

Only change technology when there is a clear technical reason.
