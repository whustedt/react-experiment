package com.example.workitems.store;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.example.workitems.DocumentDto;
import com.example.workitems.DomainObjectType;
import com.example.workitems.ProtocolEntryDto;
import com.example.workitems.WorkItemDto;
import com.example.workitems.WorkItemStatus;

public final class WorkItemInMemoryStore {

    private static final List<WorkItemDto> WORK_ITEMS = new ArrayList<>(seedItems());
    private static final Map<String, List<DocumentDto>> DOCUMENTS_BY_OBJECT = seedDocuments();
    private static final Map<String, List<ProtocolEntryDto>> PROTOCOL_BY_OBJECT = seedProtocolEntries();

    private WorkItemInMemoryStore() {
    }

    public static List<WorkItemDto> workItems() {
        return WORK_ITEMS;
    }

    public static Map<String, List<DocumentDto>> documentsByObject() {
        return DOCUMENTS_BY_OBJECT;
    }

    public static Map<String, List<ProtocolEntryDto>> protocolByObject() {
        return PROTOCOL_BY_OBJECT;
    }

    public static String contextKey(DomainObjectType objectType, String objectId) {
        return objectType + ":" + objectId.toUpperCase(Locale.ROOT);
    }

    public static void resetState() {
        WORK_ITEMS.clear();
        WORK_ITEMS.addAll(new ArrayList<>(seedItems()));

        DOCUMENTS_BY_OBJECT.clear();
        DOCUMENTS_BY_OBJECT.putAll(seedDocuments());

        PROTOCOL_BY_OBJECT.clear();
        PROTOCOL_BY_OBJECT.putAll(seedProtocolEntries());
    }

    private static List<WorkItemDto> seedItems() {
        return List.of(
                new WorkItemDto("WI-3001", DomainObjectType.CUSTOMER, "K-1001", "Kunde K-1001", "Müller GmbH",
                        "V-1001", "S-2001", "Adressänderung prüfen", "Neue Korrespondenzadresse validieren.",
                        WorkItemStatus.OPEN, 1,
                        OffsetDateTime.of(2024, 6, 3, 8, 30, 0, 0, ZoneOffset.UTC),
                        OffsetDateTime.of(2024, 6, 7, 16, 0, 0, 0, ZoneOffset.UTC), "Alice", "Leistung-Team Nord"),
                new WorkItemDto("WI-3002", DomainObjectType.CONTRACT, "V-1001", "Vertrag V-1001", "Müller GmbH",
                        "V-1001", "S-2001", "Vertragsverlängerung vorbereiten", "Deckung prüfen und Angebot erstellen.",
                        WorkItemStatus.IN_PROGRESS, 2,
                        OffsetDateTime.of(2024, 6, 2, 9, 15, 0, 0, ZoneOffset.UTC),
                        OffsetDateTime.of(2024, 6, 10, 12, 0, 0, 0, ZoneOffset.UTC), "Bob", "Leistung-Team Nord"),
                new WorkItemDto("WI-3003", DomainObjectType.CLAIM, "S-2001", "Schaden S-2001", "Müller GmbH",
                        "V-1001", "S-2001", "Reparaturrechnung nachfordern", "Werkstatt hat keine Rechnung geliefert.",
                        WorkItemStatus.BLOCKED, 1,
                        OffsetDateTime.of(2024, 6, 1, 11, 0, 0, 0, ZoneOffset.UTC),
                        OffsetDateTime.of(2024, 6, 8, 14, 0, 0, 0, ZoneOffset.UTC), "Clara", "Leistung-Team Nord"),
                new WorkItemDto("WI-3004", DomainObjectType.CLAIM, "S-2002", "Schaden S-2002", "Schmidt AG",
                        "V-2001", "S-2002", "Regress prüfen", "Prüfung Fremdverschulden erforderlich.",
                        WorkItemStatus.OPEN, 2,
                        OffsetDateTime.of(2024, 6, 4, 13, 20, 0, 0, ZoneOffset.UTC),
                        OffsetDateTime.of(2024, 6, 11, 10, 0, 0, 0, ZoneOffset.UTC), "Alice", "Leistung-Team Süd"),
                new WorkItemDto("WI-3005", DomainObjectType.CUSTOMER, "K-1002", "Kunde K-1002", "Schmidt AG",
                        "V-2001", "S-2002", "Bonitätsprüfung dokumentieren", "Aktuelle Auskunft ablegen.",
                        WorkItemStatus.DONE, 3,
                        OffsetDateTime.of(2024, 5, 29, 7, 45, 0, 0, ZoneOffset.UTC),
                        OffsetDateTime.of(2024, 6, 5, 18, 0, 0, 0, ZoneOffset.UTC), "Daniel", "Leistung-Team Süd"),
                new WorkItemDto("WI-3006", DomainObjectType.CONTRACT, "V-2001", "Vertrag V-2001", "Schmidt AG",
                        "V-2001", "S-2002", "SEPA-Mandat nachhalten", "Mandat fehlt in den Stammdaten.",
                        WorkItemStatus.IN_PROGRESS, 2,
                        OffsetDateTime.of(2024, 6, 6, 10, 5, 0, 0, ZoneOffset.UTC),
                        OffsetDateTime.of(2024, 6, 12, 17, 0, 0, 0, ZoneOffset.UTC), "Eva", "Leistung-Team Nord"));
    }

    private static Map<String, List<DocumentDto>> seedDocuments() {
        Map<String, List<DocumentDto>> docs = new HashMap<>();
        docs.put(contextKey(DomainObjectType.CLAIM, "S-2001"), new ArrayList<>(List.of(
                new DocumentDto("DOC-1001", "Reparaturkostenvoranschlag.pdf", "application/pdf", 232_112,
                        List.of("Schaden", "Werkstatt", "Kalkulation"),
                        OffsetDateTime.of(2024, 6, 1, 11, 30, 0, 0, ZoneOffset.UTC), "Clara"),
                new DocumentDto("DOC-1002", "Schadenfoto_01.jpg", "image/jpeg", 1_102_112,
                        List.of("Foto", "Frontschaden"),
                        OffsetDateTime.of(2024, 6, 1, 11, 32, 0, 0, ZoneOffset.UTC), "Clara"))));

        docs.put(contextKey(DomainObjectType.CONTRACT, "V-1001"), new ArrayList<>(List.of(
                new DocumentDto("DOC-1003", "Vertragsentwurf_v2.docx",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 92_400,
                        List.of("Angebot", "Vertragsänderung"),
                        OffsetDateTime.of(2024, 6, 2, 10, 0, 0, 0, ZoneOffset.UTC), "Bob"))));
        return docs;
    }

    private static Map<String, List<ProtocolEntryDto>> seedProtocolEntries() {
        Map<String, List<ProtocolEntryDto>> logs = new HashMap<>();
        logs.put(contextKey(DomainObjectType.CLAIM, "S-2001"), new ArrayList<>(List.of(
                new ProtocolEntryDto("LOG-2001", OffsetDateTime.of(2024, 6, 1, 11, 40, 0, 0, ZoneOffset.UTC),
                        "Fachprotokoll", "Schadenmeldung eingegangen und Erstprüfung gestartet."),
                new ProtocolEntryDto("LOG-2002", OffsetDateTime.of(2024, 6, 2, 9, 0, 0, 0, ZoneOffset.UTC),
                        "Regelwerk", "Automatische Deckungsprüfung ohne Treffer abgeschlossen."))));

        logs.put(contextKey(DomainObjectType.CONTRACT, "V-1001"), new ArrayList<>(List.of(
                new ProtocolEntryDto("LOG-2003", OffsetDateTime.of(2024, 6, 2, 9, 30, 0, 0, ZoneOffset.UTC),
                        "Bestand", "Vertragsverlängerung aus Bestand ausgelöst."))));
        return logs;
    }
}
