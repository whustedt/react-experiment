# Onboarding für Kolleg:innen mit JEE-Hintergrund

## Denkmodell: JEE -> React/TypeScript

- **JAX-RS Resource** ≈ API-Endpunkte im Quarkus Backend (bleibt gleich).
- **Service/Facade** ≈ `src/api/workItems.ts` im Frontend.
- **View + Controller** ≈ React-Komponente + Hook-Logik.
- **Serverseitiger Session-State** ≈ Client-seitiger UI-State + Query Cache.

## Wichtige Regeln im Frontend

1. Keine HTTP-Aufrufe direkt in Komponenten.
2. Datenzugriff nur über `api/*` und Feature-Query-Hooks.
3. Formulare mit React Hook Form + Zod.
4. Keine `any`-Typen; lieber generische Typen oder DTOs aus OpenAPI.
5. Pro Feature eigene Ordnerstruktur (`ui`, `api`, später optional `model`).

## Typischer Entwicklungsablauf

1. Backend-API anpassen (`backend/`).
2. OpenAPI neu generieren (`npm run api:gen`).
3. API-Fassade (`src/api/workItems.ts`) erweitern.
4. Query Hook im Feature ergänzen.
5. UI auf Hook aufsetzen.
6. Lint + Build + Tests lokal ausführen.

## Häufige Stolperfallen

- **`undefined` Felder aus Backend**: immer normalisieren.
- **State-Duplikation**: Serverdaten in TanStack Query halten, nicht mehrfach im lokalen State.
- **Zu große Komponenten**: in kleinere Unterkomponenten extrahieren.
