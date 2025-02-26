---
layout: layouts/article
date: 2008-12-03
title: Java classpath and directories
description: The wildcard for jars has arrived.
keywords: java, classpath, jvm
tags:
- java
---

The java classpath has always been quite a sad story. Countless of shell script were written to start java applications.

Of course we were always able to pass a directory of classes to the jvm like this:

    java -classpath dirwithclasses Main

But what you usually deal with are jars. Often quite a bunch of them. If you add them the same way

    java -classpath dirwithclasses:dirwithjars Main

until java 5 all you got was a *ClassNotFoundException*. Java just did not search for jars, but only classes in the directories. It completely ignored the jars. So what pretty much everyone ended up doing is providing yet another shell script to build up the classpath and pass it to the jvm via command line. Another kind of classpath hell.

    java -classpath lib/commons-logging-1.1.1.jar:lib/commons-jci-core-1.0.jar:commons-io-1.2.jar:lib/junit-3.8.2.jar:lib/maven-project-2.0.8.jar:lib/rhino-js-1.6.5.jar: ...

Since Java 6 you can use wildcards in the classpath.

    java -classpath classes:lib/'*' Main

Naturally this means the order of the jars is implicit. Which in turn means you need to be extra careful how you name your jars. But it's a nice feature that should have been there from day one.
