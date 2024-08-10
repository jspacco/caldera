package caldera.server;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;


@Service
public class DataService
{
    //TODO: integrate into EventService
    
    @Value("classpath:testcalendar.html")
    Resource testHtmlPath;

    @Value("classpath:templates/calendar.html")
    Resource calendarHtmlPath;

    @Value("classpath:./static/events.json")
    Resource baseEventsPath;

    //TODO: add method for loading current events from wherever they are

    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper;

    // Constructor injection
    public DataService(ResourceLoader resourceLoader, ObjectMapper objectMapper) {
        this.resourceLoader = resourceLoader;
        this.objectMapper = objectMapper;
    }

    private List<Event> loadEvents() throws IOException
    {
        try (InputStream inputStream = baseEventsPath.getInputStream()) {
            List<Event> events = objectMapper.readValue(inputStream, new TypeReference<List<Event>>() {});
            events.add(new Event("TODAY", "Today is the day", "todayness", LocalDate.now(), "Galesburg, IL", "admin", "today"));
            return events;
        }
    }

    public String loadCalendarWithEvents() throws IOException
    {
        String calendarHtml = loadCalendarHtml();
        String json = objectMapper.writeValueAsString(loadEvents());
        calendarHtml = calendarHtml.replace("{{EVENTS}}", json);
        return calendarHtml;        
    }

    public String loadCalendarHtml() throws IOException
    {
        return new String(Files.readAllBytes(Paths.get(calendarHtmlPath.getURI())));
    }

}
