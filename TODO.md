# Goals

* ensure we create the data folder if it doesn't exist
* configure logging
* instructions in README.md
* read in student accounts and passwords from a file
    * why can't we get @Value annotations to work? why can't we read CLI args?
        * OK, @Value are initialized after, not before, so the values are not set in the constructor
    * utility to generate student accounts and keys
    * should automatically read users.properties from the same folder as the jarfile
* for testing, use JUnit to startup a server and client and run some tests
* modify build.gradle to create a jarfile for the client
* 
* error conditions
    * should these be exceptions or return values?
    * invalid date
        * probably use date as year, month, day as separate values for filtering
    * null for any of the values
