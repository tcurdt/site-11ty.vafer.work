---
layout: layouts/article
date: 2011-05-13
title: Random Lines from Large Files
description: Reading or even sorting text files just to extract some lines becomes unfeasible at a certain size.
keywords: shell, random lines, large files
tags:
- shell
---

When working with big data taking samples is the only road to quick answers. Unfortunately, that already posts a bigger hurdle than it should be. When you ask people how to get a random sample of lines from a file you most likely will get these as an answer:

    cat file.txt | shuf -n 10 | head -n 10
    cat file.txt | sort --random-sort | head -n 10

Unsurprisingly, `sort` and big data do not mix all that well. And even `shuf` [reads the whole input file into memory][1] first.

But if using *stdin* is not a requirement providing a file allows for seeking and reading the file size. This allows for picking some random positions not based on lines but on byte positions. A quick seek, then skipping the remainder of line and output the next full line as the random value.

Simple and fast - even on big files.

    lines = 10
    filename = "filename.txt"

    filesize = File.size(filename)
    positions = lines.times.map { rand(filesize) }.sort

    File.open(filename) do |file|
      positions.each do |pos|
        file.pos = [0, pos - 1].max
        file.gets
        puts file.gets
      end
    end

<aside>

If the lines have a quite even length distribution this approach is fine. If not this can cause a skew in the randomness of the lines selected. Whether that's really a problem for taking samples is not so easy to answer - but surely something to be conscious of.
</aside>

[1]: https://github.com/coreutils/coreutils/blob/master/src/shuf.c
