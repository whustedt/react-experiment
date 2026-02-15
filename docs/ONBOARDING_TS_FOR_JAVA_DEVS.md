# Java/JEE → TypeScript/React Onboarding

## Mentales Mapping

- `Controller` (JEE) ≈ Route + Page Component
- `Service` ≈ API Wrapper + Query Hook
- `DTO` ≈ OpenAPI generated Type (`type`/`interface`)
- `Bean Validation` ≈ Zod Schema

## Typische Regeln im Projekt

1. `any` vermeiden, Typen explizit halten.
2. Keine fachliche Logik in MUI-Komponenten vergraben.
3. API-Modelle nur im API-Layer normalisieren.
4. Fehlerzustände immer explizit behandeln (`isLoading`, `isError`, empty state).

## TypeScript Quick Wins

- `type` für konkrete Datenformen, `interface` für erweiterbare Verträge.
- Union Types wie `'OPEN' | 'DONE'` statt magischer Strings.
- Nullability ernst nehmen (`undefined` bewusst behandeln).

## Lernpfad für Kolleg:innen

1. `frontend/src/features/worklist` lesen.
2. Danach `frontend/src/api/workItems.ts` analysieren.
3. Erst dann neue Feature-Route implementieren.
