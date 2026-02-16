package com.example.workitems.dto;

import java.util.List;

import com.example.workitems.model.DomainObjectType;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema
public class ContextViewDto {
    public DomainObjectType objectType;
    public String objectId;
    public String title;
    public String subtitle;
    public List<WorkItemDto> tasks;
    public List<DocumentDto> documents;
    public List<ProtocolEntryDto> protocolEntries;

    public ContextViewDto() {
    }

    public ContextViewDto(DomainObjectType objectType, String objectId, String title, String subtitle,
            List<WorkItemDto> tasks, List<DocumentDto> documents, List<ProtocolEntryDto> protocolEntries) {
        this.objectType = objectType;
        this.objectId = objectId;
        this.title = title;
        this.subtitle = subtitle;
        this.tasks = tasks;
        this.documents = documents;
        this.protocolEntries = protocolEntries;
    }
}
