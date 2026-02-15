package com.example.workitems;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("/work-items")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "WorkItems")
public class WorkItemResource {

    private static final String CURRENT_USER = "Alice";
    private static final String CURRENT_TEAM = "Leistung-Team Nord";

    private static final List<WorkItemDto> WORK_ITEMS = seedItems();
    private static final Map<String, List<DocumentDto>> DOCUMENTS_BY_OBJECT = seedDocuments();
    private static final Map<String, List<ProtocolEntryDto>> PROTOCOL_BY_OBJECT = seedProtocolEntries();

    @GET
    @Operation(operationId = "searchWorkItems")
    public WorkItemsPageDto searchWorkItems(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size,
            @QueryParam("sort") @DefaultValue("receivedAt,desc") String sort,
            @QueryParam("q") String q,
            @QueryParam("status") WorkItemStatus status,
            @QueryParam("basket") @DefaultValue("MY") BasketScope basket,
            @QueryParam("colleague") String colleague,
            @QueryParam("objectType") DomainObjectType objectType,
            @QueryParam("objectId") String objectId) {

        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);

        List<WorkItemDto> filtered = WORK_ITEMS.stream()
                .filter(item -> status == null || item.status == status)
                .filter(item -> objectType == null || item.objectType == objectType)
                .filter(item -> objectId == null || objectId.isBlank() || item.objectId.equalsIgnoreCase(objectId))
                .filter(item -> q == null || q.isBlank() || matchesQuery(item, q))
                .filter(item -> basketFilter(item, basket, colleague))
                .sorted(sortComparator(sort))
                .toList();

        int fromIndex = Math.min(safePage * safeSize, filtered.size());
        int toIndex = Math.min(fromIndex + safeSize, filtered.size());

        return new WorkItemsPageDto(new ArrayList<>(filtered.subList(fromIndex, toIndex)), filtered.size());
    }

    @GET
    @Path("/{id}")
    @Operation(operationId = "getWorkItemById")
    public WorkItemDto getWorkItemById(@PathParam("id") String id) {
        return WORK_ITEMS.stream().filter(item -> item.id.equals(id)).findFirst()
                .orElseThrow(() -> new NotFoundException("Work item not found: " + id));
    }

    @GET
    @Path("/context")
    @Operation(operationId = "getContextView")
    public ContextViewDto getContextView(@QueryParam("objectType") DomainObjectType objectType,
            @QueryParam("objectId") String objectId) {
        if (objectType == null || objectId == null || objectId.isBlank()) {
            throw new NotFoundException("Context requires objectType and objectId");
        }

        List<WorkItemDto> tasks = WORK_ITEMS.stream()
                .filter(item -> item.objectType == objectType && item.objectId.equalsIgnoreCase(objectId))
                .sorted(Comparator.comparing(item -> item.receivedAt, Comparator.reverseOrder()))
                .toList();

        if (tasks.isEmpty()) {
            throw new NotFoundException("No context found for " + objectType + " / " + objectId);
        }

        WorkItemDto first = tasks.get(0);
        String contextKey = contextKey(objectType, objectId);
        return new ContextViewDto(
                objectType,
                objectId,
                first.objectLabel,
                "%s · Vertrag %s · Schaden %s".formatted(
                        first.customerName,
                        safe(first.contractNo),
                        safe(first.claimNo)),
                tasks,
                DOCUMENTS_BY_OBJECT.getOrDefault(contextKey, List.of()),
                PROTOCOL_BY_OBJECT.getOrDefault(contextKey, List.of()));
    }


    @POST
    @Path("/{id}/actions")
    @Operation(operationId = "applyWorkItemAction")
    public WorkItemDto applyWorkItemAction(@PathParam("id") String id, WorkItemActionCommand command) {
        WorkItemDto item = WORK_ITEMS.stream().filter(workItem -> workItem.id.equals(id)).findFirst()
                .orElseThrow(() -> new NotFoundException("Work item not found: " + id));

        if (command == null || command.action == null) {
            throw new NotFoundException("Action command requires action");
        }

        switch (command.action) {
            case START -> item.status = WorkItemStatus.IN_PROGRESS;
            case FORWARD -> {
                if (command.assignee == null || command.assignee.isBlank()) {
                    throw new NotFoundException("Forward action requires assignee");
                }
                item.assignedTo = command.assignee;
                item.status = WorkItemStatus.OPEN;
            }
            case RESCHEDULE -> {
                if (command.reminderAt == null) {
                    throw new NotFoundException("Reschedule action requires reminderAt");
                }
                item.dueAt = command.reminderAt;
                item.status = WorkItemStatus.BLOCKED;
            }
            case COMPLETE -> item.status = WorkItemStatus.DONE;
        }

        PROTOCOL_BY_OBJECT.computeIfAbsent(contextKey(item.objectType, item.objectId), k -> new ArrayList<>()).add(0,
                new ProtocolEntryDto(
                        "LOG-" + UUID.randomUUID().toString().substring(0, 8),
                        OffsetDateTime.now(ZoneOffset.UTC),
                        "Arbeitskorb",
                        actionMessage(item, command)));

        return item;
    }

    @POST
    @Path("/context/{objectType}/{objectId}/documents")
    @Operation(operationId = "uploadDocument")
    public DocumentDto uploadDocument(@PathParam("objectType") DomainObjectType objectType,
            @PathParam("objectId") String objectId,
            UploadDocumentCommand command) {
        if (command == null || command.fileName == null || command.fileName.isBlank()) {
            throw new NotFoundException("Document requires fileName");
        }

        String key = contextKey(objectType, objectId);
        DocumentDto document = new DocumentDto(
                "DOC-" + UUID.randomUUID().toString().substring(0, 8),
                command.fileName,
                command.mimeType == null || command.mimeType.isBlank() ? "application/octet-stream" : command.mimeType,
                Math.max(command.sizeInBytes, 0L),
                command.indexKeywords == null ? List.of() : command.indexKeywords,
                OffsetDateTime.now(ZoneOffset.UTC),
                command.uploadedBy == null || command.uploadedBy.isBlank() ? CURRENT_USER : command.uploadedBy);

        DOCUMENTS_BY_OBJECT.computeIfAbsent(key, k -> new ArrayList<>()).add(0, document);
        PROTOCOL_BY_OBJECT.computeIfAbsent(key, k -> new ArrayList<>()).add(0,
                new ProtocolEntryDto(
                        "LOG-" + UUID.randomUUID().toString().substring(0, 8),
                        OffsetDateTime.now(ZoneOffset.UTC),
                        "Dokumentenservice",
                        "Dokument %s hochgeladen und indexiert (%s).".formatted(document.fileName,
                                String.join(", ", document.indexKeywords))));

        return document;
    }


    private static String actionMessage(WorkItemDto item, WorkItemActionCommand command) {
        return switch (command.action) {
            case START -> "Aufgabe %s wurde gestartet.".formatted(item.id);
            case FORWARD -> "Aufgabe %s wurde an %s weitergeleitet.".formatted(item.id, command.assignee);
            case RESCHEDULE -> "Aufgabe %s wurde auf Wiedervorlage %s gesetzt.".formatted(item.id, command.reminderAt);
            case COMPLETE -> "Aufgabe %s wurde abgeschlossen.".formatted(item.id);
        };
    }

    private static boolean basketFilter(WorkItemDto item, BasketScope basket, String colleague) {
        return switch (basket == null ? BasketScope.MY : basket) {
            case MY -> Objects.equals(item.assignedTo, CURRENT_USER);
            case TEAM -> Objects.equals(item.team, CURRENT_TEAM);
            case COLLEAGUE -> colleague != null && !colleague.isBlank() && item.assignedTo.equalsIgnoreCase(colleague);
        };
    }

    private static boolean matchesQuery(WorkItemDto item, String rawQuery) {
        String query = rawQuery.toLowerCase(Locale.ROOT);
        return safe(item.customerName).toLowerCase(Locale.ROOT).contains(query)
                || safe(item.contractNo).toLowerCase(Locale.ROOT).contains(query)
                || safe(item.claimNo).toLowerCase(Locale.ROOT).contains(query)
                || safe(item.title).toLowerCase(Locale.ROOT).contains(query)
                || safe(item.description).toLowerCase(Locale.ROOT).contains(query)
                || safe(item.assignedTo).toLowerCase(Locale.ROOT).contains(query)
                || safe(item.objectId).toLowerCase(Locale.ROOT).contains(query)
                || safe(item.objectLabel).toLowerCase(Locale.ROOT).contains(query);
    }

    private static Comparator<WorkItemDto> sortComparator(String sort) {
        boolean desc = sort != null && sort.endsWith(",desc");
        Comparator<WorkItemDto> comparator = Comparator.comparing(item -> item.receivedAt);
        return desc ? comparator.reversed() : comparator;
    }

    private static String contextKey(DomainObjectType objectType, String objectId) {
        return objectType + ":" + objectId.toUpperCase(Locale.ROOT);
    }

    private static String safe(String value) {
        return value == null ? "-" : value;
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
