package com.example.workitems;

import java.time.OffsetDateTime;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

public class WorkItemDto {
    public String id;
    public String customerName;
    public String contractNo;
    public String type;
    public WorkItemStatus status;
    public int priority;
    public OffsetDateTime receivedAt;
    public String assignedTo;

    @Schema
    public WorkItemDto() {
    }

    public WorkItemDto(String id, String customerName, String contractNo, String type, WorkItemStatus status, int priority,
            OffsetDateTime receivedAt, String assignedTo) {
        this.id = id;
        this.customerName = customerName;
        this.contractNo = contractNo;
        this.type = type;
        this.status = status;
        this.priority = priority;
        this.receivedAt = receivedAt;
        this.assignedTo = assignedTo;
    }
}
