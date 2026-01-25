---
layout: layouts/article
date: 2005-03-23
title: Why Javadocs Suck
description: Bad documentation of code often comes from misguided rules and tooling. It's a case where deviating from the standard can be a good thing.
keywords: java, documentation, javadoc, checkstyle
series: featured
tags:
- programming
- java
---

Over the years I've been exposed to a number of Java code bases. And over time it has became painfully obvious that

> Javadocs just suck. Not as a concept, but what most teams make out of them.

The main problem of documentation is that it needs to kept up to date. Having it separate from the code makes it really hard to mantain. Which means the idea behind Javadocs is not so bad. But let's have a look at the following code and Javadoc snippet:

    public class FooEntry implements ArchiveEntry {

        /** The entry's name. */
        private String name = "";

        /**
         * Construct an entry with only a name.
         *
         * @param name the entry name
         */
        public FooEntry(String name) {
            this.name = name;
        }

        /**
         * Get this entry's name.
         *
         * @return This entry's name.
         */
        public String getName() {
            return name;
        }

        /**
         * Write an entry's header information to a stream.
         *
         * @param out an OutputStream to write to
         * @throws IOException on error
         */
        public void writeEntryHeader(OutputStream out)
            throws IOException {

            // write first byte
            out.write(1);
            // write second byte
            out.write(2);
        }
    }


What's the benefit of having Javadocs like the above? They are mostly re-iterating what is already expressed in code. A lot of it is nothing more than redundant boilerplate. Usually we programmers <span class="nobr">-as a species-</span> hate redundency. It makes you wonder.

> Why do some developers write such bad Javadocs?

For one there is a good chance they *did not* write (much of) these docs in the first place - instead they just let their IDE generate them. I wouldn't be surprised if the primary goal was to have just enough Javadocs in place to let checkstyle pass the build.

Of course the above snippet is a bit of an abstraction and exaggeration but we all know better than calling this unheard of.

## How to write better Javadocs?

First and foremost just empathize with the person reading and trying to understand your code.

Focus on self-explanationary class, function and variable names. Often that's even better than comments because the explanation is visible not only at declaration time but with every use.
That's the path to [code as documentation][1]. A lot of comments and Javadocs then become duplication and can just be removed. This lets developers see the code flow with less visual clutter.

Explain algorithms and usage as much as possible at the *class level*. Focus on the *Why?*, explain the important parts of the *How?* and give *Notice* of any things important for usage. This helps people looking for usage information and it helps developers digging into the implementation.

If you want to force proper Javadocs with checkstyle do it only for *non-private* or even *public* scoped elements.

For the above example this could look as easy as this:

    /**
      * Explain what "FooArchiveEntry" is used for.
      * Explain how is works.
      * Mention things like thread-safety and other usage specifics.
      */
    public class FooArchiveEntry implements ArchiveEntry {

        /*
        Implementation specifics should be explained here.
        */

        private String name = "";

        public FooArchiveEntry(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }

        public void writeEntryHeader(OutputStream out)
            throws IOException {

            out.write(1);
            out.write(2);
        }
    }

While this post focused on purely Java this concept is of course applicable to other languages as well. As with many things it's the mindset that counts.

 [1]: https://martinfowler.com/bliki/CodeAsDocumentation.html
