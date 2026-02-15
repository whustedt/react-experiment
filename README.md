# Quarkus + React Enterprise Starter (Workbasket)

Dieses Repository ist als **ausbaufähige Enterprise-Basis** für fachlich komplexe Anwendungen gedacht.
Der Fokus liegt auf:

- klaren Architekturgrenzen,
- stabilen API-Verträgen,
- nachvollziehbarer Teamarbeit,
- guter Einarbeitung für Kolleg:innen mit JEE-Hintergrund.

## Warum diese Basis?

Viele Enterprise-Projekte scheitern nicht an Technologie, sondern an fehlender Struktur.
Dieses Setup adressiert genau das:

- **Quarkus Backend** für robuste REST-APIs,
- **React + TypeScript Frontend** mit klarer Modularisierung,
- **OpenAPI als Vertrag** zwischen Backend und Frontend,
- **Feature-first Organisation** für langfristige Wartbarkeit.

## Projektstruktur

```text
backend/
  src/main/java/...         # REST API und DTOs
  src/test/java/...         # Backend-Tests
frontend/
  src/
    app/                    # Bootstrapping, Router, Theme, Provider
    shared/                 # technische Querschnittsfunktionen
    api/                    # API-Client + OpenAPI generated types
    features/               # fachliche Module (UI + Query Hooks)
docs/
  architecture.md           # Zielarchitektur und Leitplanken
  onboarding-java-devs.md   # Einstieg für JEE-Kolleg:innen
  contributing.md           # Teamkonventionen
```

## Architekturprinzipien

1. **API first**: OpenAPI beschreibt den Vertrag.
2. **Single source of truth**: Serverdaten über TanStack Query.
3. **Feature ownership**: Fachlogik liegt pro Feature gebündelt.
4. **UI entkoppelt von HTTP**: Komponenten konsumieren Hooks/Fassaden statt `fetch`.
5. **Strict TypeScript**: Frühzeitige Fehlererkennung statt späte Laufzeitfehler.

Details siehe `docs/architecture.md`.

## Einstieg (für Teams)

### 1) Backend starten

```bash
cd backend
mvn test
mvn quarkus:dev
```

### 2) Frontend starten

```bash
cd frontend
npm install
npm run dev
```

### 3) OpenAPI Client aktualisieren

```bash
cd frontend
npm run api:gen
```

## Qualitätschecks

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend:

```bash
cd backend
mvn test
```

## Empfehlungen für den weiteren Ausbau

- ADRs einführen (`docs/adr/`).
- CI Pipeline mit `mvn test`, `npm run lint`, `npm run build`.
- Frontend-Komponententests (Vitest + Testing Library) ergänzen.
- Error- und Audit-Standards fachübergreifend festlegen.

## Zusätzliche Doku

- Architektur: `docs/architecture.md`
- JEE-Onboarding: `docs/onboarding-java-devs.md`
- Contribution Guide: `docs/contributing.md`
