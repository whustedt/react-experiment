package com.example.workitems;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.UUID;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import com.example.workitems.store.WorkItemInMemoryStore;

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

        List<WorkItemDto> filtered = WorkItemInMemoryStore.workItems().stream()
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
        return findWorkItem(id);
    }

    @POST
    @Path("/{id}/actions")
    @Operation(operationId = "performWorkItemAction")
    public WorkItemDto performWorkItemAction(@PathParam("id") String id, WorkItemActionCommand command) {
        WorkItemDto item = findWorkItem(id);

        if (command == null || command.action == null) {
            throw new NotFoundException("Action command requires action");
        }

        switch (command.action) {
            case START -> {
                item.status = WorkItemStatus.IN_PROGRESS;
                item.assignedTo = CURRENT_USER;
                addProtocol(item, "Aktion", "%s hat die Aufgabe gestartet.".formatted(CURRENT_USER), command.comment);
            }
            case FORWARD -> {
                String assignee = command.assignee == null || command.assignee.isBlank() ? null : command.assignee;
                if (assignee == null) {
                    throw new NotFoundException("Forward action requires assignee");
                }
                item.assignedTo = assignee;
                item.status = WorkItemStatus.OPEN;
                addProtocol(item, "Aktion", "%s hat die Aufgabe an %s weitergeleitet.".formatted(CURRENT_USER, assignee),
                        command.comment);
            }
            case RESCHEDULE -> {
                if (command.followUpAt == null) {
                    throw new NotFoundException("Reschedule action requires followUpAt");
                }
                item.dueAt = command.followUpAt;
                item.status = WorkItemStatus.BLOCKED;
                addProtocol(item, "Aktion", "%s hat die Aufgabe auf Wiedervorlage gesetzt (%s).".formatted(
                        CURRENT_USER,
                        command.followUpAt.toLocalDate()), command.comment);
            }
            case COMPLETE -> {
                item.status = WorkItemStatus.DONE;
                addProtocol(item, "Aktion", "%s hat die Aufgabe abgeschlossen.".formatted(CURRENT_USER), command.comment);
            }
            default -> throw new NotFoundException("Unsupported action " + command.action);
        }

        return item;
    }

    @GET
    @Path("/context")
    @Operation(operationId = "getContextView")
    public ContextViewDto getContextView(@QueryParam("objectType") DomainObjectType objectType,
            @QueryParam("objectId") String objectId) {
        if (objectType == null || objectId == null || objectId.isBlank()) {
            throw new NotFoundException("Context requires objectType and objectId");
        }

        List<WorkItemDto> tasks = WorkItemInMemoryStore.workItems().stream()
                .filter(item -> item.objectType == objectType && item.objectId.equalsIgnoreCase(objectId))
                .sorted(Comparator.comparing(item -> item.receivedAt, Comparator.reverseOrder()))
                .toList();

        if (tasks.isEmpty()) {
            throw new NotFoundException("No context found for " + objectType + " / " + objectId);
        }

        WorkItemDto first = tasks.get(0);
        String contextKey = WorkItemInMemoryStore.contextKey(objectType, objectId);
        return new ContextViewDto(
                objectType,
                objectId,
                first.objectLabel,
                "%s · Vertrag %s · Schaden %s".formatted(
                        first.customerName,
                        safe(first.contractNo),
                        safe(first.claimNo)),
                tasks,
                WorkItemInMemoryStore.documentsByObject().getOrDefault(contextKey, List.of()),
                WorkItemInMemoryStore.protocolByObject().getOrDefault(contextKey, List.of()));
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

        String key = WorkItemInMemoryStore.contextKey(objectType, objectId);
        DocumentDto document = new DocumentDto(
                "DOC-" + UUID.randomUUID().toString().substring(0, 8),
                command.fileName,
                command.mimeType == null || command.mimeType.isBlank() ? "application/octet-stream" : command.mimeType,
                Math.max(command.sizeInBytes, 0L),
                command.indexKeywords == null ? List.of() : command.indexKeywords,
                OffsetDateTime.now(ZoneOffset.UTC),
                command.uploadedBy == null || command.uploadedBy.isBlank() ? CURRENT_USER : command.uploadedBy);

        WorkItemInMemoryStore.documentsByObject().computeIfAbsent(key, k -> new ArrayList<>()).add(0, document);
        WorkItemInMemoryStore.protocolByObject().computeIfAbsent(key, k -> new ArrayList<>()).add(0,
                new ProtocolEntryDto(
                        "LOG-" + UUID.randomUUID().toString().substring(0, 8),
                        OffsetDateTime.now(ZoneOffset.UTC),
                        "Dokumentenservice",
                        "Dokument %s hochgeladen und indexiert.".formatted(command.fileName)));

        return document;
    }

    private static WorkItemDto findWorkItem(String id) {
        return WorkItemInMemoryStore.workItems().stream().filter(item -> item.id.equals(id)).findFirst()
                .orElseThrow(() -> new NotFoundException("Work item not found: " + id));
    }

    private static void addProtocol(WorkItemDto item, String source, String message, String comment) {
        String details = comment == null || comment.isBlank() ? message : message + " Hinweis: " + comment;
        WorkItemInMemoryStore.protocolByObject().computeIfAbsent(WorkItemInMemoryStore.contextKey(item.objectType, item.objectId),
                k -> new ArrayList<>()).add(0,
                        new ProtocolEntryDto(
                                "LOG-" + UUID.randomUUID().toString().substring(0, 8),
                                OffsetDateTime.now(ZoneOffset.UTC),
                                source,
                                details));
    }

    private static boolean basketFilter(WorkItemDto item, BasketScope basket, String colleague) {
        return switch (basket) {
            case MY -> Objects.equals(item.assignedTo, CURRENT_USER);
            case TEAM -> Objects.equals(item.team, CURRENT_TEAM);
            case COLLEAGUE -> colleague != null && !colleague.isBlank() && item.assignedTo.equalsIgnoreCase(colleague);
        };
    }

    private static boolean matchesQuery(WorkItemDto item, String q) {
        String query = q.toLowerCase(Locale.ROOT).trim();
        return safe(item.title).toLowerCase(Locale.ROOT).contains(query)
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

    private static String safe(String value) {
        return value == null ? "-" : value;
    }

    public static void resetState() {
        WorkItemInMemoryStore.resetState();
    }
}
