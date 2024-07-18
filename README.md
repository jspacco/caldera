# Caldera
Really simple calendar server for CS-1/CS-2 assignments


## Goals
* read in student accounts and passwords from a file
    * why can't get get @Value annotations to work? why can't we read CLI args?
    * utility to generate student accounts and keys
    * should automatically read users.properties from the same folder as the jarfile
* for testing, use JUnit to startup a server and client and run some tests
* modify build.gradle to create a jarfile for the client
* Fix issues with @Value annotations not being populated
* SQLite
* 
* error conditions
    * should these be exceptions or return values?
    * invalid date
        * probably use date as year, month, day as separate values for filtering
    * null for any of the values
