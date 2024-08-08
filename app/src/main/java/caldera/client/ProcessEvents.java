package caldera.client;

import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import caldera.server.Event;

public class ProcessEvents
{
    public static List<Event> getEvents(InputStream inputStream) throws Exception
    {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        List<Event> events = objectMapper.readValue(inputStream, new TypeReference<List<Event>>() {});
        return events;
    }

    static void countBattles(List<Event> events)
    {
        long numBattles = events.stream().filter(event -> event.getType().equalsIgnoreCase("battle")).count();
        System.out.println("Number of battles: " + numBattles);
    }

    static void countBattles2(List<Event> events)
    {
        int numBattles = 0;
        for (Event event : events)
        {
            if (event.getType().equalsIgnoreCase("battle"))
            {
                numBattles++;
            }
        }
        System.out.println("Number of battles: " + numBattles);
    }

    static void getPossibleDuplicates2(List<Event> events)
    {
        for (int i = 0; i < events.size(); i++)
        {
            for (int j = i + 1; j < events.size(); j++)
            {
                Event event1 = events.get(i);
                Event event2 = events.get(j);
                if (event1.getName().equalsIgnoreCase(event2.getName()) &&
                    event1.getDate().equals(event2.getDate()))
                {
                    System.out.println("Possible duplicate: " + event1.getName());
                }
            }
        }
    }

    static void getPossibleDuplicates(List<Event> events)
    {
        // this really needs old-school for loops
        for (Event event1 : events)
        {
            for (Event event2 : events)
            {
                if (event1 == event2)
                {
                    continue;
                }
                // check that they name is the same and they are on the same day
                if (event1.getName().equalsIgnoreCase(event2.getName()) &&
                    event1.getDate().equals(event2.getDate()))
                {
                    System.out.println("Possible duplicate: " + event1.getName());
                }
            }
        }
    }

    public static void getAllTags(List<Event> events)
    {
        List<String> tags = events.stream()
            .flatMap(event -> event.getTags().stream().map(x -> x.toLowerCase()))
            .distinct()
            .collect(Collectors.toList());
        
        System.out.println("All tags: " + tags.size());
    }
    public static void main(String[] args) throws Exception
    {
        InputStream inputStream = ProcessEvents.class.getResourceAsStream("/static/base-events.json");
        List<Event> events = getEvents(inputStream);
        
        countBattles(events);

        getPossibleDuplicates(events);

        getAllTags(events);

    }
    
}
