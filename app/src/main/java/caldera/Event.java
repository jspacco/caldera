package caldera;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.google.gson.Gson;

public class Event
{
    private String id = UUID.randomUUID().toString();
    private String name;
    private String description;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate date;
    private String type;
    private String location;
    private String username;
    private boolean everyYear = true;
    private List<String> tags = new LinkedList<>();

    public Event() {}

    public Event(String name, String description, String type, LocalDate date, String location, String username, List<String> tags)
    {
        this.name = name;
        this.description = description;
        this.type = type;
        this.date = date;
        this.location = location;
        this.username = username;
        this.tags = tags;
    }

    public Event(String name, String description, String type, String date, String location, String username, List<String> tags)
    {
        this(name, description, type, LocalDate.parse(date), location, username, tags);
    }

    public Event(String name, String description, String type, String date, String location, String username, String... tags)
    {
        this(name, description, type, LocalDate.parse(date), location, username, List.of(tags));
    }

    public Event(String name, String description, String type, LocalDate date, String location, String username, String... tags)
    {
        this(name, description, type, date, location, username, List.of(tags));
    }

    @Override
    public String toString()
    {
        return String.format("Event: %s, %s, %s, %s, %s, %s, %s", name, description, type, date, location, username, tags);
    }

    
    public Map<String, Object> toMap()
	{
		Map<String, Object> map = new HashMap<>();
		map.put("name", getName());
        map.put("description", getDescription());
        map.put("date", getDate().toString());
        map.put("location", getLocation());
        map.put("username", getUsername());
        map.put("tags", getTags());
		return map;
	}

    public String toJson()
    {
        return new Gson().toJson(toMap());
    }

    public static Event fromMap(Map<String, Object> map)
    {
        return new Event((String) map.get("name"), 
            (String) map.get("description"), 
            (String) map.get("type"),
            LocalDate.parse((String) map.get("date")),
            (String) map.get("location"),
            (String) map.get("username"),
            (List<String>) map.get("tags"));
    }

    public static Event fromJson(String json)
    {
        Map<String, Object> map = new Gson().fromJson(json, Map.class);
        return fromMap(map);
    }

    public static List<Event> fromJsonArray(String json)
    {
        List<Map<String, Object>> list = new Gson().fromJson(json, List.class);
        List<Event> events = new LinkedList<>();
        for (Map<String, Object> map : list)
        {
            events.add(fromMap(map));
        }
        return events;
    }
	
	public void writeJsonToFile(String filePath) throws IOException
	{
		writeJsonToFile(new File(filePath));
	}
	
	public void writeJsonToFile(File file) throws IOException
	{
        try (FileWriter writer = new FileWriter(file)) {
            writer.write(toJson());
            writer.flush();
            writer.close();
        }
	}

    // generate get/set methods for all instance variables
    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    public String getType()
    {
        return type;
    }

    public void setType(String type)
    {
        this.type = type;
    }

    public LocalDate getDate()
    {
        return date;
    }

    public void setDate(LocalDate date)
    {
        this.date = date;
    }

    public String getLocation()
    {
        return location;
    }

    public void setLocation(String location)
    {
        this.location = location;
    }

    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    public List<String> getTags()
    {
        return tags;
    }

    public void setTags(List<String> tags)
    {
        this.tags = tags;
    }

    public void addTag(String tag)
    {
        tags.add(tag);
    }

    public String getId()
    {
        return id;
    }

    public void setId(String id)
    {
        this.id = id;
    }

    public boolean isEveryYear()
    {
        return everyYear;
    }

    public void setEveryYear(boolean everyYear)
    {
        this.everyYear = everyYear;
    }
}
