package caldera.server;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CalendarController 
{
    private final EventService eventService;

    @Autowired
    public CalendarController(EventService eventService)
    {
        this.eventService = eventService;
    }

    @GetMapping(value = {"/", "/calendar"}, produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> getCalendar()
    {
        try {
            return ResponseEntity.ok(eventService.loadCalendarWithEvents());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error loading calendar");
        }

    }
    
}
