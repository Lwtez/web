package org.example.backend.rest;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Produces;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.example.backend.model.User;
import org.example.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.Context;

@Path("/auth")
@Transactional
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {
    @Inject
    private UserService userService;

    @Context
    private HttpServletRequest httpRequest;

    @POST
    @Path("/login")
    public Response login(User credentials) {
        if (userService.login(credentials.getLogin(), credentials.getPassword())) {
            httpRequest.getSession(true).setAttribute("user", credentials.getLogin());
            return Response.ok("{\"status\": \"ok\"}").build();
        }
        return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    @POST
    @Path("/register")
    public Response register(User credentials) {
        if (userService.register(credentials.getLogin(), credentials.getPassword())) {
            return Response.ok().entity("{\"status\": \"created\"}").build();
        }
        return Response.status(Response.Status.BAD_REQUEST).entity("{\"error\": \"Login taken\"}").build();
    }

    @POST
    @Path("/logout")
    public Response logout() {
        httpRequest.getSession().invalidate();
        return Response.ok().build();
    }
}
