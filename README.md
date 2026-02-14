# Quarkus + Quinoa + React (Vite) Beispielprojekt

Ein vollständiges, lauffähiges Beispiel für eine „boring“, stabile Enterprise-Arbeitskorb-App mit klarer Schichtentrennung:

- **Backend**: Quarkus (REST + OpenAPI + Swagger UI) und Quinoa
- **Frontend**: React + Vite + TypeScript + TanStack Router + TanStack Query + MUI
- **API-Vertrag**: OpenAPI als Single Source of Truth, Frontend-DTOs via Generator
- **Dev Experience**: Dev Container inklusive Java/Node/Quarkus

## Repository-Struktur

```text
.
├── backend/
├── frontend/
├── .devcontainer/devcontainer.json
├── README.md
└── .gitignore
```

## Architektur-Überblick

### Schichten

1. **Backend (Quarkus)**
   - Liefert REST-Endpunkte unter `/api/*`
   - Exportiert OpenAPI unter `/q/openapi`
   - Stellt Swagger UI unter `/q/swagger-ui` bereit

2. **Frontend (React/Vite)**
   - Feature-first organisiert
   - UI spricht **nie direkt HTTP**
   - Datenzugriff zentral über `src/api/workItems.ts` + Feature-Queries

3. **OpenAPI Client Layer**
   - Generiert nach `frontend/src/api/generated`
   - Wrapper in `frontend/src/api/workItems.ts` normalisiert optionale Felder einmalig

### Feature-first Struktur (Frontend)

```text
frontend/src/
  app/            # Router, Shell, globale Provider
  api/            # generated client + thin wrappers
    generated/    # OpenAPI Generator Output (nicht manuell bearbeiten)
    client.ts
    workItems.ts
  features/
    worklist/
      api/queries.ts
      ui/WorklistPage.tsx
    workItemDetail/
      api/queries.ts
      ui/WorkItemDetailPage.tsx
  shared/
```

## Starten im Dev Container

1. Repo in VS Code öffnen
2. **Reopen in Container**
3. Danach:

```bash
# Terminal 1: Backend
cd backend
mvn quarkus:dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:4200
- Backend: http://localhost:8080

## Starten ohne Dev Container

### Voraussetzungen

- Java 21+
- Maven 3.9+
- Node.js 20+

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

## OpenAPI Regeneration (`api:gen`)

Wenn das Backend läuft, kannst du den Client neu generieren:

```bash
cd frontend
npm run api:gen
```

- Quelle: `http://localhost:8080/q/openapi`
- Ziel: `frontend/src/api/generated`
- Das Placeholder-Setup stellt sicher, dass das Frontend auch vor der ersten Generierung buildbar bleibt.

## Debug-Tipps

### Backend

- Quarkus Dev UI/Endpoints unter `/q/*`
- OpenAPI prüfen: `http://localhost:8080/q/openapi`
- Swagger UI prüfen: `http://localhost:8080/q/swagger-ui`

### Frontend

- Vite auf Port `4200`
- Dev-Proxy `/api -> http://localhost:8080` (Rewrite entfernt `/api` Prefix)
- Bei Query-Problemen zuerst Network-Tab + Query Keys prüfen

## Teamvereinbarung: 7 Architektur-Regeln

1. **Kein HTTP in UI-Komponenten** – nur in `src/api/*` Wrappern + TanStack Query Hooks
2. **Pro Feature genau ein Datenzugriff** – Query Keys + Hooks in `features/*/api`
3. **Forms nur mit React Hook Form + Zod**
4. **MUI als Standard-UI**
5. **DTO/Models nur aus OpenAPI** (keine manuell gepflegte Any-Wüste)
6. **Lint/Prettier von Tag 1**
7. **Feature-first Struktur** statt globaler `components/services/models`

## Wichtige Pfade und URLs

- Backend API: `http://localhost:8080/api/work-items`
- Backend OpenAPI: `http://localhost:8080/q/openapi`
- Swagger UI: `http://localhost:8080/q/swagger-ui`
- Frontend App: `http://localhost:4200`

## Hinweise zur lokalen Entwicklung

- Quinoa ist so konfiguriert, dass `../frontend` genutzt wird und der Vite-Dev-Server auf `4200` gemanaged wird.
- SPA Routing ist aktiv, wobei `/api`, `/q` und `/@` ignoriert werden, damit Backend- und Tooling-Pfade nicht überschrieben werden.
