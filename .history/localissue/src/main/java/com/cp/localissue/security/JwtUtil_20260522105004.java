package com.cp.localissue.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;
C:\Users\LENOVO\Intership Project\localissue>mvnw.cmd spring-boot:run
[INFO] Scanning for projects...
[INFO] 
[INFO] -------------------------< com.cp:localissue >--------------------------
[INFO] Building  0.0.1-SNAPSHOT
[INFO]   from pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] >>> spring-boot:4.0.6:run (default-cli) > test-compile @ localissue >>>
[INFO] 
[INFO] --- resources:3.3.1:resources (default-resources) @ localissue ---
[INFO] Copying 1 resource from src\main\resources to target\classes
[INFO] Copying 0 resource from src\main\resources to target\classes
[INFO] 
[INFO] --- compiler:3.14.1:compile (default-compile) @ localissue ---
[INFO] Recompiling the module because of added or removed source files.
[INFO] Compiling 23 source files with javac [debug parameters release 21] to target\classes
WARNING: A terminally deprecated method in sun.misc.Unsafe has been called
WARNING: sun.misc.Unsafe::objectFieldOffset has been called by lombok.permit.Permit
WARNING: Please consider reporting this to the maintainers of class lombok.permit.Permit
WARNING: sun.misc.Unsafe::objectFieldOffset will be removed in a future release
[INFO] 
[INFO] --- resources:3.3.1:testResources (default-testResources) @ localissue ---
[INFO] skip non existing resourceDirectory C:\Users\LENOVO\Intership Project\localissue\src\test\resources
[INFO] 
[INFO] --- compiler:3.14.1:testCompile (default-testCompile) @ localissue ---
[INFO] Recompiling the module because of changed dependency.
[INFO] Compiling 1 source file with javac [debug parameters release 21] to target\test-classes
[INFO] 
[INFO] <<< spring-boot:4.0.6:run (default-cli) < test-compile @ localissue <<<
[INFO] 
[INFO] 
[INFO] --- spring-boot:4.0.6:run (default-cli) @ localissue ---
[INFO] Attaching agents: []

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

 :: Spring Boot ::                (v4.0.6)

2026-05-22T10:38:16.040+05:30  INFO 10080 --- [localissue] [           main] c.cp.localissue.LocalissueApplication    : Starting LocalissueApplication using Java 25 with PID 10080 (C:\Users\LENOVO\Intership Project\localissue\target\classes started by LENOVO in C:\Users\LENOVO\Intership Project\localissue)
2026-05-22T10:38:16.047+05:30  INFO 10080 --- [localissue] [           main] c.cp.localissue.LocalissueApplication    : No active profile set, falling back to 1 default profile: "default"
2026-05-22T10:38:17.334+05:30  INFO 10080 --- [localissue] [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data JPA repositories in DEFAULT mode.
2026-05-22T10:38:17.431+05:30  INFO 10080 --- [localissue] [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 82 ms. Found 2 JPA repository interfaces.
2026-05-22T10:38:18.346+05:30  INFO 10080 --- [localissue] [           main] o.s.boot.tomcat.TomcatWebServer          : Tomcat initialized with port 8080 (http)
2026-05-22T10:38:18.376+05:30  INFO 10080 --- [localissue] [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2026-05-22T10:38:18.377+05:30  INFO 10080 --- [localissue] [           main] o.apache.catalina.core.StandardEngine    : Starting Servlet engine: [Apache Tomcat/11.0.21]
2026-05-22T10:38:18.518+05:30  INFO 10080 --- [localissue] [           main] b.w.c.s.WebApplicationContextInitializer : Root WebApplicationContext: initialization completed in 2363 ms
2026-05-22T10:38:18.841+05:30  INFO 10080 --- [localissue] [           main] org.hibernate.orm.jpa                    : HHH008540: Processing PersistenceUnitInfo [name: default]
2026-05-22T10:38:18.914+05:30  INFO 10080 --- [localissue] [           main] org.hibernate.orm.core                   : HHH000001: Hibernate ORM core version 7.2.12.Final
2026-05-22T10:38:19.791+05:30  INFO 10080 --- [localissue] [           main] o.s.o.j.p.SpringPersistenceUnitInfo      : No LoadTimeWeaver setup: ignoring JPA class transformer
2026-05-22T10:38:19.871+05:30  INFO 10080 --- [localissue] [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
2026-05-22T10:38:20.127+05:30  INFO 10080 --- [localissue] [           main] com.zaxxer.hikari.pool.HikariPool        : HikariPool-1 - Added connection org.postgresql.jdbc.PgConnection@7e38e254
2026-05-22T10:38:20.129+05:30  INFO 10080 --- [localissue] [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.
2026-05-22T10:38:20.236+05:30  INFO 10080 --- [localissue] [           main] org.hibernate.orm.connections.pooling    : HHH10001005: Database info:
        Database JDBC URL [jdbc:postgresql://localhost:5432/local_issue_db]
        Database driver: PostgreSQL JDBC Driver
        Database dialect: PostgreSQLDialect
        Database version: 18.4
        Default catalog/schema: local_issue_db/public
        Autocommit mode: undefined/unknown
        Isolation level: READ_COMMITTED [default READ_COMMITTED]
        JDBC fetch size: none
        Pool: DataSourceConnectionProvider
        Minimum pool size: undefined/unknown
        Maximum pool size: undefined/unknown
2026-05-22T10:38:22.206+05:30  INFO 10080 --- [localissue] [           main] org.hibernate.orm.core                   : HHH000489: No JTA platform available (set 'hibernate.transaction.jta.platform' to enable JTA platform integration)
2026-05-22T10:38:22.311+05:30  INFO 10080 --- [localissue] [           main] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'default'
2026-05-22T10:38:22.415+05:30  INFO 10080 --- [localissue] [           main] o.s.d.j.r.query.QueryEnhancerFactories   : Hibernate is in classpath; If applicable, HQL parser will be used.
2026-05-22T10:38:22.698+05:30  WARN 10080 --- [localissue] [           main] JpaBaseConfiguration$JpaWebConfiguration : spring.jpa.open-in-view is enabled by default. Therefore, database queries may be performed during view rendering. Explicitly configure spring.jpa.open-in-view to disable this warning
2026-05-22T10:38:22.818+05:30  WARN 10080 --- [localissue] [           main] .s.a.UserDetailsServiceAutoConfiguration : 

Using generated security password: b5144384-d9f1-41b5-aa94-b5f3babeed64

This generated password is for development use only. Your security configuration must be updated before running your application in production.

2026-05-22T10:38:22.826+05:30  INFO 10080 --- [localissue] [           main] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with UserDetailsService bean with name inMemoryUserDetailsManager
2026-05-22T10:38:23.693+05:30  INFO 10080 --- [localissue] [           main] o.s.boot.tomcat.TomcatWebServer          : Tomcat started on port 8080 (http) with context path '/'
2026-05-22T10:38:23.722+05:30  INFO 10080 --- [localissue] [           main] c.cp.localissue.LocalissueApplication    : Started LocalissueApplication in 8.571 seconds (process running for 9.419)
2026-05-22T10:40:43.998+05:30  INFO 10080 --- [localissue] [ionShutdownHook] o.s.boot.tomcat.GracefulShutdown         : Commencing graceful shutdown. Waiting for active requests to complete
2026-05-22T10:40:44.016+05:30  INFO 10080 --- [localissue] [tomcat-shutdown] o.s.boot.tomcat.GracefulShutdown         : Graceful shutdown complete
2026-05-22T10:40:44.028+05:30  INFO 10080 --- [localissue] [ionShutdownHook] j.LocalContainerEntityManagerFactoryBean : Closing JPA EntityManagerFactory for persistence unit 'default'
2026-05-22T10:40:44.033+05:30  INFO 10080 --- [localissue] [ionShutdownHook] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Shutdown initiated...
2026-05-22T10:40:44.050+05:30  INFO 10080 --- [localissue] [ionShutdownHook] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Shutdown completed.
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  02:40 min
[INFO] Finished at: 2026-05-22T10:40:44+05:30
[INFO] ------------------------------------------------------------------------
Terminate batch job (Y/N)? Y

C:\Users\LENOVO\Intership Project\localissue>mvnw.cmd spring-boot:run
[INFO] Scanning for projects...
[INFO] 
[INFO] -------------------------< com.cp:localissue >--------------------------
[INFO] Building  0.0.1-SNAPSHOT
[INFO]   from pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] >>> spring-boot:4.0.6:run (default-cli) > test-compile @ localissue >>>
[INFO] 
[INFO] --- resources:3.3.1:resources (default-resources) @ localissue ---
[INFO] Copying 1 resource from src\main\resources to target\classes
[INFO] Copying 0 resource from src\main\resources to target\classes
[INFO] 
[INFO] --- compiler:3.14.1:compile (default-compile) @ localissue ---
[INFO] Nothing to compile - all classes are up to date.
[INFO] 
[INFO] --- resources:3.3.1:testResources (default-testResources) @ localissue ---
[INFO] skip non existing resourceDirectory C:\Users\LENOVO\Intership Project\localissue\src\test\resources
[INFO] 
[INFO] --- compiler:3.14.1:testCompile (default-testCompile) @ localissue ---
[INFO] Nothing to compile - all classes are up to date.
[INFO] 
[INFO] <<< spring-boot:4.0.6:run (default-cli) < test-compile @ localissue <<<
[INFO] 
[INFO] 
[INFO] --- spring-boot:4.0.6:run (default-cli) @ localissue ---
[INFO] Attaching agents: []

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

 :: Spring Boot ::                (v4.0.6)

2026-05-22T10:41:02.917+05:30  INFO 5560 --- [localissue] [           main] c.cp.localissue.LocalissueApplication    : Starting LocalissueApplication using Java 25 with PID 5560 (C:\Users\LENOVO\Intership Project\localissue\target\classes started by LENOVO in C:\Users\LENOVO\Intership Project\localissue)
2026-05-22T10:41:02.924+05:30  INFO 5560 --- [localissue] [           main] c.cp.localissue.LocalissueApplication    : No active profile set, falling back to 1 default profile: "default"
2026-05-22T10:41:04.492+05:30  INFO 5560 --- [localissue] [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data JPA repositories in DEFAULT mode.
2026-05-22T10:41:04.617+05:30  INFO 5560 --- [localissue] [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 100 ms. Found 2 JPA repository interfaces.
2026-05-22T10:41:05.912+05:30  INFO 5560 --- [localissue] [           main] o.s.boot.tomcat.TomcatWebServer          : Tomcat initialized with port 8080 (http)
2026-05-22T10:41:06.339+05:30  INFO 5560 --- [localissue] [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2026-05-22T10:41:06.341+05:30  INFO 5560 --- [localissue] [           main] o.apache.catalina.core.StandardEngine    : Starting Servlet engine: [Apache Tomcat/11.0.21]
2026-05-22T10:41:06.511+05:30  INFO 5560 --- [localissue] [           main] b.w.c.s.WebApplicationContextInitializer : Root WebApplicationContext: initialization completed in 3464 ms
2026-05-22T10:41:11.344+05:30  INFO 5560 --- [localissue] [           main] org.hibernate.orm.jpa                    : HHH008540: Processing PersistenceUnitInfo [name: default]
2026-05-22T10:41:11.521+05:30  INFO 5560 --- [localissue] [           main] org.hibernate.orm.core                   : HHH000001: Hibernate ORM core version 7.2.12.Final
2026-05-22T10:41:13.293+05:30  INFO 5560 --- [localissue] [           main] o.s.o.j.p.SpringPersistenceUnitInfo      : No LoadTimeWeaver setup: ignoring JPA class transformer
2026-05-22T10:41:13.411+05:30  INFO 5560 --- [localissue] [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
2026-05-22T10:41:13.693+05:30  INFO 5560 --- [localissue] [           main] com.zaxxer.hikari.pool.HikariPool        : HikariPool-1 - Added connection org.postgresql.jdbc.PgConnection@7e38e254
2026-05-22T10:41:13.708+05:30  INFO 5560 --- [localissue] [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.
2026-05-22T10:41:13.902+05:30  INFO 5560 --- [localissue] [           main] org.hibernate.orm.connections.pooling    : HHH10001005: Database info:
        Database JDBC URL [jdbc:postgresql://localhost:5432/local_issue_db]
        Database driver: PostgreSQL JDBC Driver
        Database dialect: PostgreSQLDialect
        Database version: 18.4
        Default catalog/schema: local_issue_db/public
        Autocommit mode: undefined/unknown
        Isolation level: READ_COMMITTED [default READ_COMMITTED]
        JDBC fetch size: none
        Pool: DataSourceConnectionProvider
        Minimum pool size: undefined/unknown
        Maximum pool size: undefined/unknown
2026-05-22T10:41:17.054+05:30  INFO 5560 --- [localissue] [           main] org.hibernate.orm.core                   : HHH000489: No JTA platform available (set 'hibernate.transaction.jta.platform' to enable JTA platform integration)
2026-05-22T10:41:17.257+05:30  INFO 5560 --- [localissue] [           main] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'default'
2026-05-22T10:41:17.481+05:30  INFO 5560 --- [localissue] [           main] o.s.d.j.r.query.QueryEnhancerFactories   : Hibernate is in classpath; If applicable, HQL parser will be used.
2026-05-22T10:41:18.046+05:30  WARN 5560 --- [localissue] [           main] JpaBaseConfiguration$JpaWebConfiguration : spring.jpa.open-in-view is enabled by default. Therefore, database queries may be performed during view rendering. Explicitly configure spring.jpa.open-in-view to disable this warning
2026-05-22T10:41:18.306+05:30  WARN 5560 --- [localissue] [           main] .s.a.UserDetailsServiceAutoConfiguration : 

Using generated security password: 74848f62-8d07-4ae5-ae77-075cadac8b9b

This generated password is for development use only. Your security configuration must be updated before running your application in production.

2026-05-22T10:41:18.343+05:30  INFO 5560 --- [localissue] [           main] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with UserDetailsService bean with name inMemoryUserDetailsManager
2026-05-22T10:41:19.591+05:30  INFO 5560 --- [localissue] [           main] o.s.boot.tomcat.TomcatWebServer          : Tomcat started on port 8080 (http) with context path '/'
2026-05-22T10:41:19.604+05:30  INFO 5560 --- [localissue] [           main] c.cp.localissue.LocalissueApplication    : Started LocalissueApplication in 17.388 seconds (process running for 18.088)
2026-05-22T10:44:53.591+05:30  INFO 5560 --- [localissue] [nio-8080-exec-2] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring DispatcherServlet 'dispatcherServlet'
2026-05-22T10:44:53.592+05:30  INFO 5560 --- [localissue] [nio-8080-exec-2] o.s.web.servlet.DispatcherServlet        : Initializing Servlet 'dispatcherServlet'
2026-05-22T10:44:53.594+05:30  INFO 5560 --- [localissue] [nio-8080-exec-2] o.s.web.servlet.DispatcherServlet        : Completed initialization in 2 ms
TOKEN: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb3JkYW4xMjNAZ21haWwuY29tIiwiaWF0IjoxNzc5NDI2MjQwLCJleHAiOjE3Nzk0Mjk4NDB9._qZqFoVMyim4arkl8DzW2FavjuskqIX7hkFjk_KmxAE
2026-05-22T10:44:53.655+05:30  WARN 5560 --- [localissue] [nio-8080-exec-2] .w.s.m.s.DefaultHandlerExceptionResolver : Resolved [org.springframework.web.HttpRequestMethodNotSupportedException: Request method 'DELETE' is not supported]
TOKEN: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb3JkYW4xMjNAZ21haWwuY29tIiwiaWF0IjoxNzc5NDI2MjQwLCJleHAiOjE3Nzk0Mjk4NDB9._qZqFoVMyim4arkl8DzW2FavjuskqIX7hkFjk_KmxAE"
2026-05-22T10:45:20.246+05:30  WARN 5560 --- [localissue] [nio-8080-exec-3] .w.s.m.s.DefaultHandlerExceptionResolver : Resolved [org.springframework.web.HttpRequestMethodNotSupportedException: Request method 'DELETE' is not supported]


import java.util.Date;
import io.jsonwebtoken.security.Keys;
import java.security.Key;

@Component
public class JwtUtil {

    private final Key SECRET_KEY =
        Keys.hmacShaKeyFor(
                "mysecretkeymysecretkeymysecretkey"
                        .getBytes()
        );

    public String generateToken(String email) {

        return Jwts.builder()

                .setSubject(email)

                .setIssuedAt(new Date())

                .setExpiration(
                        new Date(System.currentTimeMillis()
                                + 1000 * 60 * 60)
                )

                .signWith(SECRET_KEY)

                .compact();
    }
}