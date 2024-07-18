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
    private String calendarHtml;
    //private List<Event> events;
    private final DataService dataService;

    @Autowired
    public CalendarController(DataService dataService) {
        this.dataService = dataService;
        try {
            calendarHtml = dataService.loadCalendarWithEvents();
        } catch (IOException e) {
            //TODO: handle exception
            e.printStackTrace();
        }
    }

    @GetMapping(value = {"/", "/calendar"}, produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> getCalendar()
    {
        //TODO: get the events and add them to the calendarHtml
        try {
            return ResponseEntity.ok(dataService.loadCalendarWithEvents());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error loading calendar");
        }

    }
    
}
