# Quarkus + Quinoa + React Workbasket Beispiel

Dieses Repository zeigt eine stabile, wartbare Enterprise-Basis mit **Quarkus Backend** und **React/Vite Frontend**. Fokus: tabellenlastige Workbasket-App mit klaren Architekturgrenzen.

## Struktur

- `backend/` – Quarkus REST API, OpenAPI, Quinoa Integration
- `frontend/` – React + Vite + TanStack Router/Query + MUI
- `.devcontainer/devcontainer.json` – reproduzierbare Dev-Umgebung
- `README.md`
- `.gitignore`

## Architektur-Überblick

### Schichten

1. **Backend (`backend/`)**
   - Liefert API unter `/api/*`
   - Dokumentiert OpenAPI unter `/q/openapi`
   - Swagger UI unter `/q/swagger-ui`
2. **Frontend (`frontend/`)**
   - Feature-first aufgebaut
   - Routing über TanStack Router
   - Server-State über TanStack Query
3. **OpenAPI Boundary**
   - DTOs kommen aus generated client (`src/api/generated`)
   - Thin Wrapper in `src/api/workItems.ts` normalisiert optionale Felder

### Feature-first Struktur

```text
frontend/src/
  app/
  api/
    generated/
    client.ts
    workItems.ts
  features/
    worklist/
      api/queries.ts
      ui/WorklistPage.tsx
    workItemDetail/
      api/queries.ts
      ui/WorkItemDetailPage.tsx
```

## Teamvereinbarung (7 Regeln)

1. **Kein HTTP in UI-Komponenten** – nur `src/api/*` + Query Hooks.
2. **Pro Feature genau ein Datenzugriffspfad** – Query Keys + Hooks in `features/*/api`.
3. **Forms nur mit React Hook Form + Zod**.
4. **MUI als Standard-UI**.
5. **DTO/Models nur aus OpenAPI**.
6. **Lint/Prettier ab Tag 1**.
7. **Feature-first statt globale technische Ordner**.

## Start im Dev Container

1. Repo in VS Code öffnen.
2. `Reopen in Container` ausführen.
3. Backend starten:
   ```bash
   cd backend
   mvn quarkus:dev
   ```
4. Frontend separat (optional, wenn ohne Quinoa dev flow getestet werden soll):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Start ohne Dev Container

Voraussetzungen:
- Java 17+
- Maven 3.9+
- Node 20+

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

## OpenAPI Regeneration

Wenn das Backend läuft (`localhost:8080`):

```bash
cd frontend
npm run api:gen
```

Der Befehl überschreibt bewusst den Placeholder in `src/api/generated/`.

## Debug-Tipps

### Backend
- API testen: `GET http://localhost:8080/api/work-items`
- OpenAPI: `http://localhost:8080/q/openapi`
- Swagger UI: `http://localhost:8080/q/swagger-ui`

### Frontend
- Vite UI: `http://localhost:4200`
- Query/Filter prüfen über Network Tab (`/api/work-items?...`)
- Detailseite: `/work-items/WI-1001`

## Wichtige URLs

- UI: `http://localhost:4200`
- API Basis: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/q/swagger-ui`
- OpenAPI JSON/YAML: `http://localhost:8080/q/openapi`
