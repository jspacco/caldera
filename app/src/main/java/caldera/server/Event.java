package caldera.server;

import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity
public class Event
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate date;
    private String type;
    private String location;
    private String username;
    private boolean everyYear = true;
    @Column(columnDefinition = "TEXT")
    @Convert(converter = StringListConverter.class)
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

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
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
