package com.example.workitems.dto;

import java.time.OffsetDateTime;

import com.example.workitems.model.WorkItemActionType;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema
public class WorkItemActionCommand {
    public WorkItemActionType action;
    public String comment;
    public String assignee;
    public OffsetDateTime followUpAt;
}
