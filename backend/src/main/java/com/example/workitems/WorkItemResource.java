package com.example.workitems;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

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

@Path("/work-items")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "WorkItems")
public class WorkItemResource {

    private static final List<WorkItemDto> WORK_ITEMS = seedItems();

    @GET
    @Operation(operationId = "searchWorkItems")
    public WorkItemsPageDto searchWorkItems(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size,
            @QueryParam("sort") @DefaultValue("receivedAt,desc") String sort,
            @QueryParam("q") String q,
            @QueryParam("status") WorkItemStatus status) {

        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);

        List<WorkItemDto> filtered = WORK_ITEMS.stream()
                .filter(item -> status == null || item.status == status)
                .filter(item -> q == null || q.isBlank() || matchesQuery(item, q))
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

    private static boolean matchesQuery(WorkItemDto item, String rawQuery) {
        String query = rawQuery.toLowerCase(Locale.ROOT);
        return item.customerName.toLowerCase(Locale.ROOT).contains(query)
                || item.contractNo.toLowerCase(Locale.ROOT).contains(query)
                || item.type.toLowerCase(Locale.ROOT).contains(query)
                || item.assignedTo.toLowerCase(Locale.ROOT).contains(query);
    }

    private static Comparator<WorkItemDto> sortComparator(String sort) {
        boolean desc = sort != null && sort.endsWith(",desc");
        Comparator<WorkItemDto> comparator = Comparator.comparing(item -> item.receivedAt);
        return desc ? comparator.reversed() : comparator;
    }

    private static List<WorkItemDto> seedItems() {
        return List.of(
                new WorkItemDto("WI-1001", "Acme GmbH", "C-1001", "New Contract", WorkItemStatus.OPEN, 1,
                        OffsetDateTime.of(2024, 1, 3, 8, 30, 0, 0, ZoneOffset.UTC), "Alice"),
                new WorkItemDto("WI-1002", "Globex AG", "C-1002", "Extension", WorkItemStatus.IN_PROGRESS, 2,
                        OffsetDateTime.of(2024, 1, 5, 10, 15, 0, 0, ZoneOffset.UTC), "Bob"),
                new WorkItemDto("WI-1003", "Initech", "C-1003", "Cancellation", WorkItemStatus.DONE, 3,
                        OffsetDateTime.of(2024, 1, 7, 11, 0, 0, 0, ZoneOffset.UTC), "Clara"),
                new WorkItemDto("WI-1004", "Umbrella Corp", "C-1004", "Data Change", WorkItemStatus.OPEN, 2,
                        OffsetDateTime.of(2024, 1, 10, 9, 45, 0, 0, ZoneOffset.UTC), "Daniel"),
                new WorkItemDto("WI-1005", "Soylent Ltd", "C-1005", "New Contract", WorkItemStatus.IN_PROGRESS, 1,
                        OffsetDateTime.of(2024, 1, 12, 13, 20, 0, 0, ZoneOffset.UTC), "Eva"),
                new WorkItemDto("WI-1006", "Wayne Enterprises", "C-1006", "Extension", WorkItemStatus.DONE, 2,
                        OffsetDateTime.of(2024, 1, 15, 16, 5, 0, 0, ZoneOffset.UTC), "Frank"));
    }
}
