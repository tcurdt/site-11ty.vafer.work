---
layout: layouts/article
date: 2007-01-19
title: Native File Locks in Java
description: Interacting with with the native world has become much easier.
keywords: java, native file locking
tags:
- java
---

Since Java 1.4 there is a native IO layer. Of one the things it allows is, to create native file locks that get acknowledged by both `fcntl` and `flock` style locking. This is tremendously helpful if you need to share resources with native programs. What is in C

    int fd = open("/path/to/file", O_RDWR);

    if (flock(fd,LOCK_EX) != 0 ) { ... }

    printf("locked file\npress return");
    char c = getchar();

    if (flock(fd,LOCK_UN) != 0 ) { ... }

    printf("released file\n");
    close(fd);

and

    int fd = open("/path/to/file", O_RDWR);

    struct flock lock;
    lock.l_type = F_WRLCK;
    lock.l_whence = SEEK_SET;
    lock.l_start = 0;
    lock.l_len = 0;
    lock.l_pid = 0;

    if (fcntl(fd, F_SETLK, &lock) == -1) { ... }

    printf("locked file\npress return");
    char c = getchar();

    lock.l_type = F_UNLCK;

    if (fcntl(fd, F_SETLK, &lock) == -1) { ... }

    printf("released file\n");
    close(fd);

becomes in java

    File file = new File("/path/to/file");
    FileChannel channel =
      new RandomAccessFile(file, "rw").getChannel();
    FileLock lock = channel.lock();

    System.out.println("locked file\npress return");
    System.in.read();

    lock.release();
    System.out.println("released file\n");
