# Tech Stack & Dependency Guide

Dieses Dokument erklärt, **welche Abhängigkeiten im Repo verwendet werden, wofür sie da sind und warum sie in dieser Kombination sinnvoll sind**.

## Backend (`backend/pom.xml`)

### Laufzeit

- **Quarkus 3.x (BOM)**
  - **Was:** Plattform für Java-Microservices.
  - **Warum:** Schneller Dev-Loop, geringe Startzeit, gute Developer Experience.

- **`io.quarkus:quarkus-rest-jackson`**
  - **Was:** JAX-RS REST-Endpunkte + JSON-Serialisierung via Jackson.
  - **Warum:** Saubere API-Implementierung, DTOs direkt als JSON transportierbar.

- **`io.quarkus:quarkus-smallrye-openapi`**
  - **Was:** Automatische OpenAPI-Generierung aus JAX-RS + Annotationen.
  - **Warum:** API-first Workflow; Frontend kann daraus typsichere Clients generieren.

- **`io.quarkiverse.quinoa:quarkus-quinoa`**
  - **Was:** Integration von Frontend-Build/Assets in Quarkus.
  - **Warum:** Vereinfacht lokalen Fullstack-Betrieb und reduziert Integrationsaufwand.

### Test

- **`io.quarkus:quarkus-junit5`**
  - **Was:** Quarkus-Testintegration mit JUnit 5.
  - **Warum:** API-Tests mit echter Quarkus-Runtime, aber weiterhin schnell.

- **`io.rest-assured:rest-assured`**
  - **Was:** DSL für HTTP-Integrationstests.
  - **Warum:** Lesbare End-to-End-Checks für REST-Verträge.

## Frontend (`frontend/package.json`)

### UI & Rendering

- **`react`, `react-dom`**
  - **Was:** UI-Library + Browser-Rendering.
  - **Warum:** Industriestandard mit großem Ökosystem.

- **`@mui/material`, `@mui/icons-material`, `@mui/x-data-grid`**
  - **Was:** Komponentenbibliothek inkl. Icons und Grid.
  - **Warum:** Konsistente Enterprise-UI, hohe Entwicklungsgeschwindigkeit, robuste Tabellen.

- **`@emotion/react`, `@emotion/styled`**
  - **Was:** Styling-Engine hinter MUI.
  - **Warum:** Theme-basierte Styles und flexible Component-Styling-Patterns.

### Routing, Daten und Validierung

- **`@tanstack/react-router`**
  - **Was:** Typsicheres Routing.
  - **Warum:** Klare Navigation mit compile-time Sicherheit bei Params.

- **`@tanstack/react-query`**
  - **Was:** Server-State Management (Caching, Refetching, Loading/Error States).
  - **Warum:** Vorhersagbarer Datenfluss und weniger Boilerplate in Feature-Komponenten.

- **`react-hook-form` + `@hookform/resolvers` + `zod`**
  - **Was:** Form-State, Resolver-Integration, Schema-Validierung.
  - **Warum:** Performante Formulare mit zentralen, typsicheren Validierungsregeln.

### Tooling (Dev)

- **`vite` + `@vitejs/plugin-react`**
  - **Was:** Dev-Server + Build-Tooling.
  - **Warum:** Schneller lokaler Entwicklungszyklus.

- **`typescript` + `@types/*`**
  - **Was:** Typisierung.
  - **Warum:** Frühes Auffinden von Fehlern und sichere Refactorings.

- **`eslint` + TypeScript/React Plugins + `eslint-config-prettier`**
  - **Was:** Linting.
  - **Warum:** Einheitlicher Code-Stil und weniger Review-Reibung.

- **`prettier`**
  - **Was:** Code-Formatierung.
  - **Warum:** Konsistente Lesbarkeit im gesamten Team.

- **`@openapitools/openapi-generator-cli`**
  - **Was:** Generator für den typsicheren API-Client (`src/api/generated`).
  - **Warum:** Kein manuelles Pflegen von Request/Response-Typen.

## Warum diese Kombination im Repo gut funktioniert

1. **OpenAPI als Schnittstelle** zwischen Quarkus und React hält Backend und Frontend synchron.
2. **Typsicherheit Ende-zu-Ende** (Java DTOs → OpenAPI → TypeScript Models) reduziert Integrationsfehler.
3. **Feature-first Frontend + Service-orientiertes Backend** verbessert Lesbarkeit und Wartbarkeit bei wachsender Fachlogik.
