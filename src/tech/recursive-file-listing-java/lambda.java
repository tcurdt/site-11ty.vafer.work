package main;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.Path;
import java.nio.file.FileVisitor;
import java.nio.file.FileVisitResult;
import java.nio.file.attribute.BasicFileAttributes;
import java.io.IOException;

public class Lambda {

    public static final class FileTraversal {

      public interface DirectoryCallback {
        boolean call(Path p, BasicFileAttributes a);
      }

      public interface FileCallback {
        void call(Path p, BasicFileAttributes a);
      }

      private DirectoryCallback directoryCb;
      private FileCallback fileCb;

      public FileTraversal onDirectory(DirectoryCallback cb) {
        directoryCb = cb;
        return this;
      }

      public FileTraversal onFile(FileCallback cb) {
        fileCb = cb;
        return this;
      }

      private class Visitor implements FileVisitor<Path> {

        public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs)
          throws IOException {
           return directoryCb.call(dir, attrs)
           ? FileVisitResult.CONTINUE
           : FileVisitResult.SKIP_SUBTREE;
        }

        public FileVisitResult visitFile(Path file, BasicFileAttributes attrs)
          throws IOException {
            fileCb.call(file, attrs);
            return FileVisitResult.CONTINUE;
        }

        public FileVisitResult visitFileFailed(Path file, IOException e)
          throws IOException {
            return FileVisitResult.CONTINUE;
        }

        public FileVisitResult postVisitDirectory(Path dir, IOException e)
          throws IOException {
           return FileVisitResult.CONTINUE;
        }

      }

      public void traverse( Path dir ) throws IOException {
        Files.walkFileTree(dir, new Visitor());
      }
    }

  public static void main(String[] args) throws Exception {

    new FileTraversal()
    .onDirectory((path,attrs) -> {
      System.out.println("dir: " + path);
      return true;
    })
    .onFile((path,attrs) -> {
      System.out.println("file: " + path);
    })
    .traverse(Paths.get("/"));

  }
}
