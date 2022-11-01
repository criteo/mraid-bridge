import org.gradle.jvm.tasks.Jar
import com.github.gradle.node.npm.task.NpmTask
import groovy.json.JsonSlurper
import org.gradle.api.internal.artifacts.ivyservice.ivyresolve.parser.MetaDataParseException

plugins {
    `java-library`
    `maven-publish`
    signing
    id("com.github.node-gradle.node") version "3.5.0"
    id("io.github.gradle-nexus.publish-plugin") version "1.1.0"
}

/**
 * Generates file which is packaged into dummy sources.jar and javadoc.jar
 * Sonatype requires those two files to be included when publishing artifact
 */
val generateEmptyReadme by tasks.registering {
    val buildDir = File("${project.buildDir}")
    if (!buildDir.exists()) {
        buildDir.mkdirs()
    }

    File("${project.buildDir}/README.md").bufferedWriter().use {
        it.write("Not available")
    }
}

val generateSourcesJar by tasks.registering(Jar::class) {
    dependsOn(generateEmptyReadme)

    archiveFileName.set("mraid-bridge-sources.jar")
    archiveClassifier.set("sources")
    from("${project.buildDir}/README.md")
}

val generateJavadocJar by tasks.registering(Jar::class) {
    dependsOn(generateEmptyReadme)

    archiveFileName.set("mraid-bridge-javadoc.jar")
    archiveClassifier.set("javadoc")
    from("${project.buildDir}/README.md")
}

val buildJs by tasks.registering(NpmTask::class) {
    dependsOn("npmInstall")
    args.set(listOf("run", "build"))
}

val copyMraidFileIntoAssetsFolder by tasks.registering(Copy::class) {
    dependsOn(buildJs)
    from("${project.buildDir}/criteo-mraid.js")
    into("${project.buildDir}/assets/")
}

val generateJar by tasks.registering(Jar::class) {
    dependsOn(copyMraidFileIntoAssetsFolder)
    from("${project.buildDir}")
    include("assets/**")
    archiveFileName.set("mraid-bridge.jar")
}

publishing {
    publications {
        create<MavenPublication>("mraid") {
            artifact(generateJar)
            artifact(generateSourcesJar)
            artifact(generateJavadocJar)

            groupId = "com.criteo.publisher"
            artifactId = "mraid-bridge"

            val artifactVersion = getVersionFromProjectJson()
            version = if (isSnapshot()) "${artifactVersion}-SNAPSHOT" else artifactVersion

            pom {
                name.set("com.criteo.publisher:mraid-bridge")
                url.set("https://github.com/criteo/mraid-bridge")
                description.set("Bridge between an Ad and WebView based on MRAID spec")
                packaging = "jar"

                licenses {
                    license {
                        name.set("Apache License, Version 2.0")
                        url.set("http://www.apache.org/licenses/LICENSE-2.0.txt")
                        distribution.set("repo")
                    }
                }

                developers {
                    developer {
                        name.set("R&D Direct")
                        email.set("pubsdk-owner@criteo.com")
                        organization.set("Criteo")
                        organizationUrl.set("https://www.criteo.com/")
                    }
                }

                scm {
                    url.set("https://github.com/criteo/mraid-bridge")
                    connection.set("scm:git:git://github.com/criteo/mraid-bridge.git")
                    developerConnection.set("scm:git:ssh://github.com:criteo/mraid-bridge.git")
                }
            }
        }
    }
}

signing {
    val secretKey = System.getenv("MAVEN_SECRING_GPG_BASE64")
    val password = System.getenv("MAVEN_SECRING_PASSWORD")

    if (secretKey != null && password != null) {
        useInMemoryPgpKeys(secretKey, password)
        sign(publishing.publications)
    }
}

nexusPublishing {
    repositories {
        sonatype {
            username.set("criteo-oss")
            password.set(System.getenv("SONATYPE_PASSWORD"))
        }
    }
}

fun Project.isSnapshot(): Boolean {
    return properties["isRelease"] != "true"
}

fun getVersionFromProjectJson(): String {
    try {
        val inputFile = File("${rootDir}/package.json")
        val json = JsonSlurper().parseText(inputFile.readText()) as Map<String, String>
        val parsedVersion = json["version"]

        if (parsedVersion.isNullOrEmpty()) {
            throw MetaDataParseException("Version from project.json is empty or absent")
        }
        return parsedVersion
    } catch (t: Throwable) {
        throw GradleException("Error getting version from project.json", t)
    }
}