package org.example.backend.rest;

import jakarta.ejb.EJB;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.example.backend.dto.PointDTO;
import org.example.backend.service.PointService;
import org.example.backend.model.Result;

import javax.net.ssl.HandshakeCompletedEvent;

@Path("/points")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PointResource {
    @EJB
    private PointService pointService;

    @Context
    private HttpServletRequest httpRequest;

    @POST
    @Path("/")
    public Response addPoint(PointDTO dto) {
        String owner = (String) httpRequest.getSession().getAttribute("user");
        Result result = pointService.checkAndSave(dto.x, dto.y, dto.r, owner);
        return Response.ok(result).build();
    }

    @GET
    @Path("/")
    public Response getHistory() {
        String owner = (String) httpRequest.getSession().getAttribute("user");
        return Response.ok(pointService.getHistory(owner)).build();
    }

    @DELETE
    @Path("/")
    public Response clearHistory(@QueryParam("user") String user) {
        pointService.deleteAll(user);
        return Response.noContent().build();
    }
}
