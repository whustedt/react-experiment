package com.example.workitems.dto;

import com.example.workitems.model.DomainObjectType;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema
public class WorkItemContextDto {
    public DomainObjectType objectType;
    public String objectId;
    public String objectLabel;

    public WorkItemContextDto() {
    }

    public WorkItemContextDto(DomainObjectType objectType, String objectId, String objectLabel) {
        this.objectType = objectType;
        this.objectId = objectId;
        this.objectLabel = objectLabel;
    }
}
