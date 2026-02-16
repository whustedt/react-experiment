package com.example.workitems.dto;

import java.time.OffsetDateTime;

import com.example.workitems.model.DomainObjectType;
import com.example.workitems.model.WorkItemStatus;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema
public class WorkItemDto {
    public String id;
    public DomainObjectType objectType;
    public String objectId;
    public String objectLabel;
    public String customerName;
    public String contractNo;
    public String claimNo;
    public String title;
    public String description;
    public WorkItemStatus status;
    public int priority;
    public OffsetDateTime receivedAt;
    public OffsetDateTime dueAt;
    public String assignedTo;
    public String team;

    public WorkItemDto() {
    }

    public WorkItemDto(String id, DomainObjectType objectType, String objectId, String objectLabel, String customerName,
            String contractNo, String claimNo, String title, String description, WorkItemStatus status, int priority,
            OffsetDateTime receivedAt, OffsetDateTime dueAt, String assignedTo, String team) {
        this.id = id;
        this.objectType = objectType;
        this.objectId = objectId;
        this.objectLabel = objectLabel;
        this.customerName = customerName;
        this.contractNo = contractNo;
        this.claimNo = claimNo;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.receivedAt = receivedAt;
        this.dueAt = dueAt;
        this.assignedTo = assignedTo;
        this.team = team;
    }
}
