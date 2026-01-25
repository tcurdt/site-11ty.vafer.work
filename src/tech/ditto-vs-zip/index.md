---
layout: layouts/article
date: 2006-05-02
title: Compress using ditto vs zip
description: For copying files with all their metadata ditto is the first choice.
keywords: zip, ditto, metadata, resourceforks
tags:
- macos
- shell
---

In versions of macOS up until 10.4 the `zip` command did not support [resource forks][1] at all. Which always was a bit strange given they are a remnant of the old Apple's classic Mac OS. It was a feature of the MFS and HFS file system that allows storing meta data along side to files.

In order to zip up folders containing _all_ data, you were meant to use `ditto` instead. Which is what the Finder uses to create archives, too.

    ditto -c -k -X --rsrc some_folder some_folder.zip

Times have changed slightly though. The standard `zip` now does support resource forks and copying resource forks is now the default behavior for `ditto`. If you want to *avoid* copying the additional metadata `--norsrc` is your friend.

    --rsrc

      Preserve resource forks and HFS meta-data. ditto will
      store this data in Carbon-compatible ._ AppleDouble
      files on filesystems that do not natively support
      resource forks. As of Mac OS X 10.4,
      --rsrc is default behavior.

    --norsrc

      Do not preserve resource forks and HFS meta-data.
      If both --norsrc and --rsrc are passed, whichever
      is passed last will take precedence. Both options
      override DITTONORSRC. Unless explicitly specified,
      --norsrc also implies --noextattr and --noacl to
      match the behavior of Mac OS X 10.4.

And the idea of resource forks did not die with the introduction of [APFS][2]. APFS also supports, what is now called *extended attributes*. If you ever wondered how macOS remembers when you downloaded a file from the internet - that's how. And Finder makes use of extended attributes to store things like tags for example. They are the quasi equivalent of resource forks in this new brave world.

The command line tool `xattr` can be used to read and write the attributes.

    $ echo "foo" > foo
    $ xattr -w attr_name attr_value foo
    $ xattr -p attr_name foo

Checking the behaviour of `zip` and `ditto` on APFS, the special `._foo` file (which holds the extended attributes data) is unfortunately only included in the zip created by `ditto`.

    $ zip foo-zip.zip foo
    $ ditto -ck foo foo-ditto.zip
    % unzip -l foo-ditto.zip
    Archive:  foo-ditto.zip
      Length      Date    Time    Name
    ---------  ---------- -----   ----
          408  01-17-2020 00:41   foo
          154  01-17-2020 00:41   ._foo
    ---------                     -------
          562                     2 files

In the end there are now resources forks, extended attributes and a new file system. And still you should use `ditto` over `zip` to create an archive to include all meta data. Somehow this feels like history repeating.

TLTR: Just keep using `ditto`.


[1]: https://en.wikipedia.org/wiki/Resource_fork
[2]: https://en.wikipedia.org/wiki/Apple_File_System
