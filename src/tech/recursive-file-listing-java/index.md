---
layout: layouts/article
date: 2007-11-12
title: Recursive file listing in java
description: Walking the tree the better way.
keywords: java, iteration, recursive, file directory walk
tags:
- java
---

When the first version of this post was published, a search on the web for "recursive file java" returned only horrible examples on how to implement directory traversal. I published a version based on anonymous classes to improve on that. More than 10 years later it's time to re-evaluate.

## Using Streams

With `File.walk` java has gotten a [streaming API][1] that visits the given path in a depth-first manner. The most commonly found example is simple and straight forward.

    Files.walk(Paths.get(path))
      .filter(Files::isRegularFile)
      .forEach(System.out::println);

Unfortunately, a "hello world" example like this hides the shortcomings in real-world usage scenarios. While you can filter the emitted paths of the stream, there is no way to skip directories during traversal. Even worse - there is [no way to gracefully handle exceptions][2] that are bound to happen. With `Files.find` you can pass in a predicate that might help to reduce redundant retrieval of file attributes - but other than that it suffers from the very same problems. I'd recommend avoiding both API methods because of that.


## Using the Visitor

This leaves us with [`Files.walkFileTree`][6] which accepts a [`FileVisitor`][5] instead of returning a stream.

    FileTraversal visitor = new FileTraversal();
    Files.walkFileTree(Paths.get("/"), visitor);

I've never been a fan of the formal implementation of the Visitor pattern and even extending the [`SimpleFileVisitor`][4] only helps to reduce some of the cruft of the interface.

    public class FileTraversal extends SimpleFileVisitor<Path> {

      public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs)
        throws IOException {
         return onDirectory(dir, attrs)
         ? FileVisitResult.CONTINUE
         : FileVisitResult.SKIP_SUBTREE;
      }

      public FileVisitResult visitFile(Path file, BasicFileAttributes attrs)
        throws IOException {
          onFile(file, attrs);
          return FileVisitResult.CONTINUE;
      }

      public boolean onDirectory(Path dir, BasicFileAttributes attrs) {
        return true;
      }

      public void onFile(Path file, BasicFileAttributes attrs) {
      }

      public void traverse( Path dir ) throws IOException {
        Files.walkFileTree(dir, this);
      }

    }

    new FileTraversal() {
      public boolean onFile(Path dir, BasicFileAttributes attrs) {
        System.out.println("dir: " + dir);
        return true;
      }
      public void onFile(Path file, BasicFileAttributes attrs) {
        System.out.println("file: " + file);
      }
    }.traverse(Paths.get("/"));

By basing off the [`SimpleFileVisitor`][4] it comes quite close to the original version using the old File interface. Except that I find the old code still much easier to read and understand. I do believe, in comparison, the old code has aged gracefully.

    public class FileTraversal {
      public final void traverse( File f ) throws IOException {
        if (f.isDirectory()) {
          if (onDirectory(f)) {
            File[] childs = f.listFiles();
            for( File child : childs ) {
              traverse(child);
            }
            return;
          }
        }
        onFile(f);
      }

      public boolean onDirectory( File d ) {
        return true;
      }

      public void onFile( File f ) {
      }
    }

While the anonymous class approach never felt great it was quite effective. Despite being a believer in delegation over inheritance, I could not come up with a concise version that mirrors the clear elegance.


## Conclusion

What would should you use today? A fluent API implementation of the [`FileVisitor`][5] interface in combination with lambdas is probably the most compact version as of today - if you think about the usage and don't look at the [bloated implementaion][3] that is.

    new FileTraversal()
      .onDir((path, attrs) -> {
        return true;
      })
      .onFile((path, attrs) -> {
        System.out.println(path);
      })
      .traverse(path);

At least in theory the visitor approach should also allow for some easy paralelisation. If you enjoy simplicity I'd argue there is no need to replace the old code - unless you have a good reason to. If performance is a major concern it might be worth to consider the upgrade.

[1]: https://docs.oracle.com/javase/tutorial/essential/io/walk.html
[2]: https://bugs.openjdk.org/browse/JDK-8039910
[3]: lambda.java
[4]: https://docs.oracle.com/javase/10/docs/api/java/nio/file/SimpleFileVisitor.html
[5]: https://docs.oracle.com/javase/10/docs/api/java/nio/file/FileVisitor.html
[6]: https://docs.oracle.com/javase/10/docs/api/java/nio/file/Files.html#walkFileTree(java.nio.file.Path,java.nio.file.FileVisitor)
