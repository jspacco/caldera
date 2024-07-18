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

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController
{
    private final AuthenticationService authenticationService;
    private final EventRepository eventRepository;
    private final ObjectMapper objectMapper;
    
    @Autowired
    public EventController(AuthenticationService authenticationService, EventRepository eventRepository, ObjectMapper objectMapper, ResourceLoader resourceLoader)
    {
        this.authenticationService = authenticationService;
        this.eventRepository = eventRepository;
        this.objectMapper = objectMapper;
        
        Resource baseEventsPath = resourceLoader.getResource("classpath:static/base-events.json");
        
        try (InputStream inputStream = baseEventsPath.getInputStream()) {
            List<Event> events = this.objectMapper.readValue(inputStream, new TypeReference<List<Event>>() {});
            events.add(new Event("TODAY", "Today is the day", "todayness", LocalDate.now(), "Galesburg, IL", "admin", "today"));
            eventRepository.saveAll(events);
        } catch (IOException e) {
            //TODO: how to handle this exception?
            throw new RuntimeException(e);
        }
    }

    @GetMapping
    public List<Event> getEvents()
    {
        return eventRepository.findAll();
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
        eventRepository.save(event);
        //events.add(event);
        return new ResponseEntity<>("event added", HttpStatus.CREATED);
    }
}

