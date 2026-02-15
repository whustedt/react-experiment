# Contribution Guide

## Branching und Commits

- Kleine, klar abgegrenzte Commits.
- Commit Message im Imperativ, z. B. `feat(frontend): add global error fallback`.
- Vor dem Push immer Lint und Build ausführen.

## Definition of Done

- [ ] Fachlichkeit umgesetzt.
- [ ] TypeScript Build erfolgreich.
- [ ] Lint erfolgreich.
- [ ] Dokumentation aktualisiert (README/Docs).
- [ ] Keine toten Exporte oder ungenutzten Imports.

## Frontend-Konventionen

- Feature-first Struktur beibehalten.
- Cross-cutting Utilities in `shared/`.
- App-Komposition ausschließlich in `app/`.
- API-Vertrag nicht manuell in `generated/` ändern.

## Backend-Konventionen

- REST-Ressourcen schlank halten.
- DTOs explizit und verständlich benennen.
- API-Verträge rückwärtskompatibel ändern oder versionieren.
