package caldera.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import caldera.Event;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController
{
    private List<Event> events;
    private final DataService dataService;
    private final AuthenticationService authenticationService;
    private final ObjectMapper objectMapper;

    @Autowired
    public EventController(DataService dataService, AuthenticationService authenticationService, ObjectMapper objectMapper)
    {
        this.dataService = dataService;
        this.authenticationService = authenticationService;
        this.objectMapper = objectMapper;
        // load base events
        try {
            this.events = dataService.loadEvents();
        } catch (IOException e) {
            //TODO: handle exception
            e.printStackTrace();
        }
    }

    @GetMapping
    public List<Event> getEvents()
    {
        //TODO: read events from sqlite
        return events;
    }

    @PostMapping
    public ResponseEntity<String> addEvent(@RequestBody Event event,
        @RequestHeader(value = "X-username", required = true) String username,
        @RequestHeader(value = "X-password", required = true) String password)
    {
        if (!authenticationService.authenticateUser(username, password))
        {
            // return unauthorized to client
            return new ResponseEntity<>("username or password incorrect", HttpStatus.UNAUTHORIZED);
        }
        events.add(event);
        return new ResponseEntity<>("event added", HttpStatus.CREATED);
    }
}

