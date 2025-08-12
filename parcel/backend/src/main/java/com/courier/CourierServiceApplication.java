package com.courier;

// Import Spring Boot core classes
import org.springframework.boot.SpringApplication; // Main class to bootstrap and launch Spring Boot application
import org.springframework.boot.autoconfigure.SpringBootApplication; // Annotation that enables auto-configuration

/**
 * Main Spring Boot Application Class
 * 
 * This is the entry point of our Courier Management System backend application.
 * Think of this as the "main door" to our application - everything starts here.
 * 
 * The @SpringBootApplication annotation is a convenience annotation that adds all of the following:
 * - @Configuration: Tags the class as a source of bean definitions for the application context
 *   (A "bean" is a Java object that Spring manages - like a component or service)
 * - @EnableAutoConfiguration: Tells Spring Boot to start adding beans based on classpath settings
 *   (This means Spring will automatically configure things like database connections, web servers, etc.)
 * - @ComponentScan: Tells Spring to look for other components, configurations, and services in the com/courier package
 *   (This scans your code to find classes marked with @Component, @Service, @Controller, etc.)
 * 
 * When this application starts, Spring Boot will:
 * 1. Scan for components in the com.courier package (look for classes with special annotations)
 * 2. Auto-configure the application based on dependencies (set up database, web server, etc.)
 * 3. Start the embedded web server (Tomcat by default - this makes your app accessible via HTTP)
 * 4. Make the application available on http://localhost:8080 (or another port if 8080 is busy)
 * 
 * What is Spring Boot?
 * - Spring Boot is a framework that makes it easy to create stand-alone, production-grade Spring applications
 * - It reduces boilerplate code and configuration
 * - It provides embedded servers (so you don't need to install Tomcat separately)
 * - It automatically configures Spring and third-party libraries based on your project dependencies
 */
@SpringBootApplication
public class CourierServiceApplication {

    /**
     * Main method - The entry point of the application
     * 
     * This method is called when the JAR file is executed or when running the application
     * from an IDE. It's like the "ON" button for your application.
     * 
     * In Java, every application must have a main method with this exact signature:
     * - public: accessible from outside the class
     * - static: belongs to the class itself, not to any specific instance
     * - void: doesn't return any value
     * - main: special method name that Java looks for to start the program
     * - String[] args: command line arguments passed to the application
     * 
     * @param args Command line arguments passed to the application
     *             (These are extra parameters you can pass when starting the app)
     */
    public static void main(String[] args) {
        // SpringApplication.run() starts the Spring application context
        // Think of this as "turning on" the Spring framework
        // 
        // What happens when you call SpringApplication.run():
        // 1. Creates the ApplicationContext (the container that holds all your application components)
        // 2. Registers the CommandLinePropertySource (allows command line arguments to override configuration)
        // 3. Refreshes the context (loads all beans and starts the application)
        // 4. Starts the embedded web server
        // 5. Makes your REST API endpoints available for HTTP requests
        SpringApplication.run(CourierServiceApplication.class, args);
        
        // After this line executes, your application is running and listening for HTTP requests!
        // You can access it in your web browser at http://localhost:8080
    }
} 