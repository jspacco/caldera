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

import jakarta.annotation.PostConstruct;

@Service
public class EventService
{
    // base events file for fresh installs
    // can be configured in application.properties
    @Value("${caldera.events.file:classpath:./static/events.json}")
    private String baseEventsFile;

    @Value("${spring.datasource.url:jdbc\\:h2\\:file\\:./data/events}")
    private String databaseUrl;

    // html calendar with {{EVENTS}} placeholder
    // this is pre-loaded with the installation and should not
    // need to be changed 
    @Value("classpath:templates/calendar.html")
    Resource calendarHtmlPath;

    private final ResourceLoader resourceLoader;
    private final EventRepository eventRepository;
    private final ObjectMapper objectMapper;

    public EventService(ResourceLoader resourceLoader, EventRepository eventRepository, ObjectMapper objectMapper)
    {
        this.resourceLoader = resourceLoader;
        this.eventRepository = eventRepository;
        this.objectMapper = objectMapper;
    }

    public String loadCalendarWithEvents() throws IOException
    {
        String calendarHtml = new String(Files.readAllBytes(Paths.get(calendarHtmlPath.getURI())));
        String json = objectMapper.writeValueAsString(eventRepository.findAll());
        calendarHtml = calendarHtml.replace("{{EVENTS}}", json);
        return calendarHtml;        
    }

    private Resource findEventsFile() 
    {
        String[] locations = {
            "file:./config/events.json",    // /config subdirectory of the current directory
            "file:./events.json",           // current directory
            "classpath:config/events.json", // /config subdirectory of the classpath
            "classpath:events.json"        // root of the classpath
        };

        for (String location : locations) {
            Resource resource = resourceLoader.getResource(location);
            if (resource.exists()) {
                return resource;
            }
        }
        return null;
    }

    private void createNewEventDatabase() throws IOException
    {
        Resource baseEventsPath = resourceLoader.getResource(baseEventsFile);
        if (baseEventsPath == null)
        {
            // try to find an events file the standard locations
            baseEventsPath = findEventsFile();
        }
        if (baseEventsPath != null && baseEventsPath.exists())
        {
            // create a new database and load the events
            InputStream inputStream = baseEventsPath.getInputStream();
            List<Event> events = this.objectMapper.readValue(inputStream, new TypeReference<List<Event>>() {});
            events.add(new Event("TODAY", "Today is the day", "todayness", LocalDate.now(), "Galesburg, IL", "admin", "today"));
            eventRepository.saveAll(events);
        }
        // otherwise we have an empty database
    }
    
    private boolean doesDatabaseExist()
    {
        try {
            long size = eventRepository.count();
            System.out.println("Database size: " + size);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @PostConstruct
    public void init() throws IOException
    {
        if (databaseUrl != null || !doesDatabaseExist())
        {
            // create a new database if we don't have a url or the database doesn't exist
            createNewEventDatabase();
        }
    }

    //TODO: should we delegate here and have everything go through
    // EventService, or let EventController and CalendarController
    // have direct access to EventRepository?
    public List<Event> getAll()
    {
        return eventRepository.findAll();
    }

    public void save(Event event)
    {
        eventRepository.save(event);
    }
}
