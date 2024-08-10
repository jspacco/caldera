package caldera.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.annotation.PostConstruct;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController
{
    private final AuthenticationService authenticationService;
    private final EventService eventService;
    
    @Autowired
    public EventController(AuthenticationService authenticationService, EventService eventService)
    {
        this.authenticationService = authenticationService;
        this.eventService = eventService;
    }

    @GetMapping
    public List<Event> getEvents()
    {
        return eventService.getAll();
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
        //TODO: handle exceptions
        eventService.save(event);
        return new ResponseEntity<>("event added", HttpStatus.CREATED);
    }

    
}

