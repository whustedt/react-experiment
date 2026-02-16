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

## Backend-Struktur

Um Backend-Code schneller zu erfassen, ist die Struktur logisch getrennt:

```text
backend/src/main/java/com/example/workitems/
  WorkItemResource.java              # REST-Endpunkte
  *.java                             # DTOs / Commands / Enums (API-Vertrag)
  store/WorkItemInMemoryStore.java   # In-Memory Datenhaltung + Seed-Daten
```

Leitlinie:

- Resource-Klassen enthalten HTTP-orientierte Orchestrierung.
- Seed- und Speicherlogik liegt separat in `store/*`.
- DTOs und Enums bleiben zentral als API-Vertrag sichtbar.

## Frontend-Stack und Begründung

Die wichtigsten React-Erweiterungen sind bewusst gewählt und ergänzen sich:

- **TanStack Router**: typsicheres Routing inkl. Parametern (`/work-items/$id`) und zentraler Fehlerbehandlung.
- **TanStack Query**: Server-State-Caching, Retry-Strategien und kontrolliertes Refetch-Verhalten.
- **React Hook Form + Zod**: performante Formularsteuerung plus deklarative, typnahe Validierung.
- **Material UI (MUI)**: einheitliches Designsystem, DataGrid für tabellarische Enterprise-Use-Cases, Icons und Theme-Unterstützung.

Diese Kombination trennt Verantwortlichkeiten sauber:

- Navigation und Seitenkomposition (Router)
- Backend-Datenlebenszyklus (Query)
- Formzustand und Validierung (React Hook Form + Zod)
- Visuelle Konsistenz (MUI)

Dadurch bleibt die Codebasis auch bei wachsendem Funktionsumfang stabil und wartbar.

### Verantwortlichkeiten

- `app/`: keine Fachlogik, nur Komposition.
- `shared/`: wiederverwendbare technische Bausteine ohne Fachbezug.
- `api/`: zentraler Zugriff auf Backend; UI ruft niemals `fetch` direkt auf.
- `features/`: kapseln Use-Cases Ende-zu-Ende.

## API- und Datenstrategie

- DTOs kommen ausschließlich aus dem OpenAPI Generator (`src/api/generated`).
- `src/api/workItems.ts` normalisiert optionale Werte, damit die UI mit stabilen Datentypen arbeitet.
- Query Keys liegen pro Feature in `features/*/api/queries.ts`.

## Formular- und Validierungsstrategie

- Jedes relevante Formular besitzt ein eigenes Zod-Schema im jeweiligen Feature.
- Types werden über `z.infer` direkt aus dem Schema abgeleitet (keine doppelten Interfaces).
- Die Schemata sind per `zodResolver` in React Hook Form eingebunden.
- Validierungsfehler werden feldnah im UI angezeigt.

Ziel: Die fachlichen Regeln stehen an einer Stelle und sind gleichzeitig Laufzeit- und Typschutz.

## Fehlerbehandlung

- Router hat eine zentrale `defaultErrorComponent`.
- Unerwartete Laufzeitfehler werden über `ErrorFallback` konsistent dargestellt.
- QueryClient-Defaults reduzieren ungewollte Refetches und sorgen für reproduzierbares Verhalten.

## Qualitätsziele

- TypeScript strict mode.
- Einheitliches Designsystem über Material UI Theme.
- Klare Commit-Historie (kleine, fachlich trennbare Changesets).
- Architekturentscheidungen über ADRs (empfohlen, z. B. unter `docs/adr/`).
