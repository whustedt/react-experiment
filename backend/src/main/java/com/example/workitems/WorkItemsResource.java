package com.example.workitems;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Stream;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("/api/work-items")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "WorkItems")
public class WorkItemsResource {

    private static final List<WorkItemDto> DATA = List.of(
            new WorkItemDto("WI-1001", "Müller GmbH", "C-10001", "Contract Review", WorkItemStatus.OPEN, "HIGH",
                    OffsetDateTime.parse("2025-01-10T08:30:00Z"), "Alice"),
            new WorkItemDto("WI-1002", "Nord Logistics", "C-10002", "Incident", WorkItemStatus.IN_PROGRESS, "MEDIUM",
                    OffsetDateTime.parse("2025-01-12T12:00:00Z"), "Bob"),
            new WorkItemDto("WI-1003", "Delta Retail", "C-10003", "Onboarding", WorkItemStatus.DONE, "LOW",
                    OffsetDateTime.parse("2025-01-15T09:15:00Z"), "Carol"),
            new WorkItemDto("WI-1004", "Acme AG", "C-10004", "Contract Review", WorkItemStatus.OPEN, "MEDIUM",
                    OffsetDateTime.parse("2025-01-18T16:45:00Z"), "Dave"),
            new WorkItemDto("WI-1005", "FinCorp", "C-10005", "Incident", WorkItemStatus.IN_PROGRESS, "HIGH",
                    OffsetDateTime.parse("2025-01-20T10:05:00Z"), "Emma"));

    private static final Map<String, Function<WorkItemDto, Comparable<?>>> SORTS = Map.of(
            "receivedAt", WorkItemDto::receivedAt,
            "customerName", WorkItemDto::customerName,
            "priority", WorkItemDto::priority);

    @GET
    @Operation(operationId = "searchWorkItems", summary = "Search work items with paging, sorting, and filtering")
    public WorkItemsPageDto searchWorkItems(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size,
            @QueryParam("sort") @DefaultValue("receivedAt,desc") String sort,
            @QueryParam("q") String q,
            @QueryParam("status") WorkItemStatus status) {

        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);

        Stream<WorkItemDto> filtered = DATA.stream()
                .filter(item -> status == null || item.status() == status)
                .filter(item -> matchesQuery(item, q));

        List<WorkItemDto> sorted = filtered.sorted(resolveSort(sort)).toList();
        long total = sorted.size();

        int start = safePage * safeSize;
        if (start >= sorted.size()) {
            return new WorkItemsPageDto(List.of(), total);
        }

        int end = Math.min(start + safeSize, sorted.size());
        return new WorkItemsPageDto(new ArrayList<>(sorted.subList(start, end)), total);
    }

    @GET
    @Path("/{id}")
    @Operation(operationId = "getWorkItemById", summary = "Get work item details")
    public WorkItemDto getWorkItemById(@PathParam("id") String id) {
        return DATA.stream()
                .filter(item -> item.id().equals(id))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Work item not found: " + id));
    }

    private boolean matchesQuery(WorkItemDto item, String q) {
        if (q == null || q.isBlank()) {
            return true;
        }
        String normalized = q.toLowerCase(Locale.ROOT);
        return item.id().toLowerCase(Locale.ROOT).contains(normalized)
                || item.customerName().toLowerCase(Locale.ROOT).contains(normalized)
                || item.contractNo().toLowerCase(Locale.ROOT).contains(normalized)
                || item.type().toLowerCase(Locale.ROOT).contains(normalized)
                || Optional.ofNullable(item.assignedTo()).orElse("").toLowerCase(Locale.ROOT).contains(normalized);
    }

    private Comparator<WorkItemDto> resolveSort(String sort) {
        String[] parts = sort.split(",");
        String field = parts.length > 0 ? parts[0] : "receivedAt";
        String direction = parts.length > 1 ? parts[1] : "desc";

        Function<WorkItemDto, Comparable<?>> extractor = SORTS.getOrDefault(field, WorkItemDto::receivedAt);
        Comparator<WorkItemDto> comparator = Comparator.comparing(extractor, Comparator.nullsLast(Comparator.naturalOrder()));
        return "asc".equalsIgnoreCase(direction) ? comparator : comparator.reversed();
    }
}
