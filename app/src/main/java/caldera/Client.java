package caldera;

import java.io.PrintStream;
import java.net.Socket;
import java.time.LocalDate;
import java.util.Scanner;

public class Client
{
    public static void postEvent(String host, int port, String username, String key, Event event) throws Exception
    {
        Socket socket = null;
        try {
            socket = new Socket(host, port);
            PrintStream out  = new PrintStream(socket.getOutputStream());
            out.println(username);
            out.println(key);
            out.println(event.toJson());
            out.flush();

            System.err.println("Sent event");
            
            Scanner scanner = new Scanner(socket.getInputStream());

            String responseJson = scanner.nextLine();
            Response response = Response.fromJson(responseJson);

            // success; just return
            if (response.getResponseCode() == ResponseCode.SUCCESS)
            {
                return;
            }
            
            // failure; throw an exception
            if (response.getResponseCode() == ResponseCode.AUTHENTICATION_FAILURE)
            {
                throw new AuthenticationException("Authentication failed: " + response.getMessage());
            }
            else if (response.getResponseCode() == ResponseCode.FAILURE)
            {
                System.err.println("Event post failed: " + response.getMessage());
            }
            
            System.out.println(response);
        } finally {
            if (socket != null && !socket.isClosed()) socket.close();
        }
    }
    public static void main(String[] args) throws Exception
    {
        String host = "localhost";
        int port = 8889;
        String username = "jspacco";
        String key = "12345";

        Event event = new Event("D-Day", 
            "The day the Allies invaded Normandy", 
            "Battle",
            LocalDate.of(1944, 6, 6),
            "Normandy, France",
            "admin",
            "history", "military", "world war 2");
            

        postEvent(host, port, username, key, event);

        Event e2 = new Event("Battle of Hastings", 
            "The Norman Conquest of England", 
            "Battle",
            LocalDate.of(1066, 10, 14),
            "Hastings, England",
            "admin",
            "history", "military", "medieval");


        postEvent(host, port, username, key, e2);
    }
    
}
