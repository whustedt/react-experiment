# Architekturleitfaden (Enterprise-Basis)

## Ziele

- **Trennscharfe Schichten** (UI, Feature, API, Backend) für wartbare Teams.
- **Konvention statt Einzelfall**: neue Features folgen einem identischen Ablauf.
- **Stabile Integrationsgrenze** über OpenAPI.

## Frontend-Struktur

```text
frontend/src/
  app/                 # globale App-Komposition (Theme, Router, Provider, Env)
  api/                 # OpenAPI client + stabiler Wrapper
  features/            # fachliche Features inkl. UI + query hooks
  shared/              # wiederverwendbare UI-/Domain-Bausteine
```

### Schichtenregel (wichtig)

1. `features/*/ui` darf **nicht direkt** HTTP machen.
2. API-Aufrufe nur über `api/workItems.ts` + Feature Query-Hooks.
3. `shared/` enthält keine Feature-spezifische Business-Logik.
4. Generierter Code (`api/generated`) wird nicht manuell angepasst.

## State-Management

- **Server-State**: TanStack Query.
- **Form-State**: React Hook Form + Zod.
- **UI-State**: lokaler Component State.

## Fehlerbehandlung

- Route-level Fallback über `errorComponent` und `notFoundComponent`.
- Query-Fallbacks als Alerts/Loader in den Seiten.

## Erweiterungsstrategie

Für jedes neue Feature:

1. `features/<name>/api/queries.ts`
2. `features/<name>/ui/<Name>Page.tsx`
3. Routeeintrag in `app/router.tsx`
4. API-Wrapper ggf. in `api/workItems.ts` ergänzen

Damit bleibt die Struktur auch mit vielen Teams konsistent.
