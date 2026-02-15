# Quarkus + React Enterprise Starter (Workbasket)

Dieses Repository ist als **ausbaufähige Enterprise-Basis** aufgebaut: Quarkus Backend, React/Vite Frontend, klare Schichten, nachvollziehbare Konventionen und Team-Onboarding für Kolleg:innen mit starkem Java/JEE-Hintergrund.

## Warum diese Basis?

- **Skalierbarkeit im Team**: Feature-first Struktur statt ungeordneter Ordnerlandschaft.
- **Wartbarkeit**: API-Grenze über OpenAPI, UI und Datenzugriff sauber getrennt.
- **Einarbeitung**: klare Regeln und Leitfäden, damit auch JS/TS-Einsteiger schnell produktiv werden.

## Projektstruktur

- `backend/` – Quarkus REST API, OpenAPI Spezifikation
- `frontend/` – React + TypeScript + TanStack Router/Query + MUI
- `docs/ARCHITECTURE.md` – Architekturregeln und Erweiterungsstrategie
- `docs/ONBOARDING_TS_FOR_JAVA_DEVS.md` – Einstieg für Java/JEE Kolleg:innen

## Architekturprinzipien

1. **Feature-first Frontend** (`features/*`) statt technischer Sammelordner.
2. **Server-State in TanStack Query**, nicht in globalen Singleton-Stores.
3. **Formvalidierung mit React Hook Form + Zod**.
4. **OpenAPI als Vertragsgrenze** zwischen Frontend und Backend.
5. **Gemeinsame Wiederverwendung in `shared/`**, aber ohne versteckte Fachlogik.

## Frontend Überblick

```text
frontend/src/
  app/
    config/            # env + app defaults
    providers.tsx      # Theme + QueryClient + Router
    queryClient.ts     # zentrale Query Defaults
    router.tsx         # Route-Definition inkl. Error/NotFound
    theme.ts           # MUI Theme
  api/
    generated/         # OpenAPI generated client (nicht manuell editieren)
    client.ts
    workItems.ts       # normalisierender Wrapper
  features/
    worklist/
    workItemDetail/
    domainObjectDetail/
  shared/
    domain/            # z. B. Label-/Status-Mappings
    ui/                # z. B. QueryState
```

## Start im Dev-Setup

### Backend

```bash
cd backend
mvn test
mvn quarkus:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Qualitätschecks

```bash
cd frontend
npm run lint
npm run build
```

```bash
cd backend
mvn test
```

## OpenAPI Client regenerieren

(Backend muss unter `localhost:8080` laufen)

```bash
cd frontend
npm run api:gen
```

## URLs

- UI: `http://localhost:4200`
- API: `http://localhost:8080/api`
- OpenAPI: `http://localhost:8080/q/openapi`
- Swagger UI: `http://localhost:8080/q/swagger-ui`
