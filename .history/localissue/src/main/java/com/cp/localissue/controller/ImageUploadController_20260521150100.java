package com.cp.localissue.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/images")
public class ImageUploadController {

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(
            @RequestParam("image") MultipartFile file) {

        try {

            // Create uploads folder if not exists
            File uploadDir = new File(UPLOAD_DIR);

            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // Unique filename
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();

            // Save file
            File destination = new File(UPLOAD_DIR + filename);

            file.transferTo(destination);

            // Return image path
            return ResponseEntity.ok("/uploads/" + filename);

        }

    }
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

2026-05-21T14:59:47.382+05:30  INFO 18800 --- [localissue] [           main] c.cp.localissue.LocalissueApplication    : Starting LocalissueApplication using Java 25 with PID 18800 (C:\Users\LENOVO\Intership Project\localissue\target\classes started by LENOVO in C:\Users\LENOVO\Intership Project\localissue)
2026-05-21T14:59:47.387+05:30  INFO 18800 --- [localissue] [           main] c.cp.localissue.LocalissueApplication    : No active profile set, falling back to 1 default profile: "default"
2026-05-21T14:59:48.340+05:30  INFO 18800 --- [localissue] [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data JPA repositories in DEFAULT mode.
2026-05-21T14:59:48.414+05:30  INFO 18800 --- [localissue] [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 61 ms. Found 1 JPA repository interface.
2026-05-21T14:59:49.021+05:30  INFO 18800 --- [localissue] [           main] o.s.boot.tomcat.TomcatWebServer          : Tomcat initialized with port 8080 (http)
2026-05-21T14:59:49.038+05:30  INFO 18800 --- [localissue] [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2026-05-21T14:59:49.039+05:30  INFO 18800 --- [localissue] [           main] o.apache.catalina.core.StandardEngine    : Starting Servlet engine: [Apache Tomcat/11.0.21]
2026-05-21T14:59:49.115+05:30  INFO 18800 --- [localissue] [           main] b.w.c.s.WebApplicationContextInitializer : Root WebApplicationContext: initialization completed in 1636 ms
2026-05-21T14:59:49.338+05:30  INFO 18800 --- [localissue] [           main] org.hibernate.orm.jpa                    : HHH008540: Processing PersistenceUnitInfo [name: default]
2026-05-21T14:59:49.405+05:30  INFO 18800 --- [localissue] [           main] org.hibernate.orm.core                   : HHH000001: Hibernate ORM core version 7.2.12.Final
2026-05-21T14:59:50.079+05:30  INFO 18800 --- [localissue] [           main] o.s.o.j.p.SpringPersistenceUnitInfo      : No LoadTimeWeaver setup: ignoring JPA class transformer
2026-05-21T14:59:50.120+05:30  INFO 18800 --- [localissue] [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
2026-05-21T14:59:50.358+05:30  INFO 18800 --- [localissue] [           main] com.zaxxer.hikari.pool.HikariPool        : HikariPool-1 - Added connection org.postgresql.jdbc.PgConnection@443af394
2026-05-21T14:59:50.360+05:30  INFO 18800 --- [localissue] [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.
2026-05-21T14:59:50.504+05:30  INFO 18800 --- [localissue] [           main] org.hibernate.orm.connections.pooling    : HHH10001005: Database info:
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
2026-05-21T14:59:51.793+05:30  INFO 18800 --- [localissue] [           main] org.hibernate.orm.core                   : HHH000489: No JTA platform available (set 'hibernate.transaction.jta.platform' to enable JTA platform integration)
2026-05-21T14:59:51.876+05:30  INFO 18800 --- [localissue] [           main] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'default'
2026-05-21T14:59:51.988+05:30  INFO 18800 --- [localissue] [           main] o.s.d.j.r.query.QueryEnhancerFactories   : Hibernate is in classpath; If applicable, HQL parser will be used.
2026-05-21T14:59:52.159+05:30  WARN 18800 --- [localissue] [           main] JpaBaseConfiguration$JpaWebConfiguration : spring.jpa.open-in-view is enabled by default. Therefore, database queries may be performed during view rendering. Explicitly configure spring.jpa.open-in-view to disable this warning
2026-05-21T14:59:52.592+05:30  INFO 18800 --- [localissue] [           main] o.s.boot.tomcat.TomcatWebServer          : Tomcat started on port 8080 (http) with context path '/'
2026-05-21T14:59:52.603+05:30  INFO 18800 --- [localissue] [           main] c.cp.localissue.LocalissueApplication    : Started LocalissueApplication in 5.797 seconds (process running for 6.379)

}