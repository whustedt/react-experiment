# Architekturleitfaden (Enterprise-Basis)

## Zielbild

Die Anwendung folgt einer **modularen, schichtenorientierten Architektur**:

- **Backend (Quarkus)** stellt stabil versionierbare REST-Schnittstellen bereit.
- **Frontend (React + TypeScript)** ist feature-first organisiert.
- **OpenAPI** ist der Vertrag zwischen beiden Welten.

Damit bleibt das System auch bei vielen Teams und wachsender Fachlichkeit wartbar.

## Frontend-Schichten

```text
src/
  app/          # Bootstrapping, Router, Provider, Theme
  shared/       # technische Querschnittsfunktionen (z. B. QueryClient)
  api/          # API-Client, Generated Types, API-Fassade
  features/     # fachliche Module mit UI + Query Hooks
```

### Verantwortlichkeiten

- `app/`: keine Fachlogik, nur Komposition.
- `shared/`: wiederverwendbare technische Bausteine ohne Fachbezug.
- `api/`: zentraler Zugriff auf Backend; UI ruft niemals `fetch` direkt auf.
- `features/`: kapseln Use-Cases Ende-zu-Ende.

## API- und Datenstrategie

- DTOs kommen ausschließlich aus dem OpenAPI Generator (`src/api/generated`).
- `src/api/workItems.ts` normalisiert optionale Werte, damit die UI mit stabilen Datentypen arbeitet.
- Query Keys liegen pro Feature in `features/*/api/queries.ts`.

## Fehlerbehandlung

- Router hat eine zentrale `defaultErrorComponent`.
- Unerwartete Laufzeitfehler werden über `ErrorFallback` konsistent dargestellt.
- QueryClient-Defaults reduzieren ungewollte Refetches und sorgen für reproduzierbares Verhalten.

## Qualitätsziele

- TypeScript strict mode.
- Einheitliches Designsystem über Material UI Theme.
- Klare Commit-Historie (kleine, fachlich trennbare Changesets).
- Architekturentscheidungen über ADRs (empfohlen, z. B. unter `docs/adr/`).
