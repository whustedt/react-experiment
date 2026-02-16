package com.example.workitems.api;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import jakarta.inject.Inject;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

import com.example.workitems.application.WorkItemService;
import com.example.workitems.dto.ContextViewDto;
import com.example.workitems.dto.DocumentDto;
import com.example.workitems.dto.UploadDocumentCommand;
import com.example.workitems.dto.WorkItemActionCommand;
import com.example.workitems.dto.WorkItemDto;
import com.example.workitems.dto.WorkItemsPageDto;
import com.example.workitems.model.BasketScope;
import com.example.workitems.model.DomainObjectType;
import com.example.workitems.model.WorkItemStatus;

@Path("/work-items")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "WorkItems")
public class WorkItemResource {

    @Inject
    WorkItemService workItemService;

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
        return workItemService.searchWorkItems(page, size, sort, q, status, basket, colleague, objectType, objectId);
    }

    @GET
    @Path("/{id}")
    @Operation(operationId = "getWorkItemById")
    public WorkItemDto getWorkItemById(@PathParam("id") String id) {
        return workItemService.getWorkItemById(id);
    }

    @POST
    @Path("/{id}/actions")
    @Operation(operationId = "performWorkItemAction")
    public WorkItemDto performWorkItemAction(@PathParam("id") String id, WorkItemActionCommand command) {
        return workItemService.performWorkItemAction(id, command);
    }

    @GET
    @Path("/context")
    @Operation(operationId = "getContextView")
    public ContextViewDto getContextView(@QueryParam("objectType") DomainObjectType objectType,
            @QueryParam("objectId") String objectId) {
        return workItemService.getContextView(objectType, objectId);
    }

    @POST
    @Path("/context/{objectType}/{objectId}/documents")
    @Operation(operationId = "uploadDocument")
    public DocumentDto uploadDocument(@PathParam("objectType") DomainObjectType objectType,
            @PathParam("objectId") String objectId,
            UploadDocumentCommand command) {
        return workItemService.uploadDocument(objectType, objectId, command);
    }
}
