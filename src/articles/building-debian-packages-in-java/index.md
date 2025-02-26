---
layout: layouts/article
date: 2007-01-19
title: Building Debian Packages in Java
description: A truely platform independent way to build Debian packages without the native tools.
keywords: java, debian, packaging, maven, ant
tags:
- packaging
- java
---

Using native packaging formats to install Java applications leverages existing and well-tested tools and infrastructure for software deployment. But one of the perks of Java has always been the cross-platform build. Using the standard native tools to create these native packages breaks the promise of a cross-platform Java build.

With the [jdeb][1] project there is a way to create native Debian packages directly from your [ant][2] or [maven][3] build. It lets you create

> Debian packages without using the native tools.

So whether you build on Linux, Windows or macOS you get a valid package that is ready to be deployed.

The only requirement is to add a control file that provides metadata about the package. It declares things like name, version and most importantly dependencies.

    Package: [[name]]
    Version: [[version]]
    Section: misc
    Priority: low
    Architecture: all
    Description: [[description]]
    Maintainer: Torsten Curdt <tcurdt@foo.org>
    Depends: default-jre | java6-runtime

The integration is easy with [ant][2]. Just specify the paths and provide the data that should get included in the package.

    <deb
      destfile="${build.dir}/${ant.project.name}.deb"
      control="${build.dir}/deb/control"
      verbose="true" >
      <data type="file"
        src="${build.dir}/jar/${ant.project.name}-${version}.jar" >
        <mapper type="perm" prefix="/usr/share/jdeb/lib"/>
      </data>
    </deb>

With [maven][3] jdeb attaches to the *package* phase. A build now creates the *jar* then builds the package and attaches it as a secondary artifact.

    <plugin>
      <artifactId>jdeb</artifactId>
      <groupId>org.vafer</groupId>
      <version>1.7</version>
      <executions>
        <execution>
          <phase>package</phase>
          <goals>
            <goal>jdeb</goal>
          </goals>
          <configuration>
            <controlDir>${basedir}/src/deb/control</controlDir>
            <dataSet>
              <data>
                <src>${project.build.directory}/${project.build.finalName}.jar</src>
                <type>file</type>
                <mapper>
                  <type>perm</type>
                  <prefix>/usr/share/jdeb/lib</prefix>
                  <user>loader</user>
                  <group>loader</group>
                  <filemode>640</filemode>
                </mapper>
              </data>
            </dataSet>
          </configuration>
        </execution>
      </executions>
    </plugin>


For more information check out the [documentation][4] and the [examples][5] or join the community for a chat on [gitter][5].


[1]: https://github.com/tcurdt/jdeb
[2]: https://ant.apache.org/
[3]: https://maven.apache.org/
[4]: https://github.com/tcurdt/jdeb/tree/master/docs
[5]: https://github.com/tcurdt/jdeb/tree/master/src/examples
[6]: https://gitter.im/tcurdt/jdeb
