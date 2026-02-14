package com.example.workitems;

import java.util.List;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

public class WorkItemsPageDto {
    @Schema(required = true)
    public List<WorkItemDto> items;

    @Schema(required = true)
    public long total;

    @Schema
    public WorkItemsPageDto() {
    }

    public WorkItemsPageDto(List<WorkItemDto> items, long total) {
        this.items = items;
        this.total = total;
    }
}
