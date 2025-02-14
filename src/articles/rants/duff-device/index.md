---
date: 2006-01-10
title: The Duff Device
description: Reducing loop overhead by abusing the C Language.
keywords: c, programming, optimization, duff device, loop unrolling
tags:
- programming
related:
- modulo-of-negative-numbers
tweet: "1354591601474097160"
---

"[Duff's Device][1]" was discovered by Tom Duff in November 1983. It's a technique more commonly seen in assembly code. It is used to reduce the counting and comparison overhead of loops - similar to [loop unrolling][2].

Let's say we start with a simple loop to copy some memory.

    for(int i=0; i<len; i++) {
      *output++ = *input++;
    }

For longer loops, the overhead of checking the loop condition adds up. On every iteration, the loop needs to check the loop counter against the `len`.

This is what the same loop looks like using a [Duff's Device][1].

    int n = (len + 8 - 1) / 8
    switch(len % 8) {
      case 0: do { *output++ = *input++;
      case 7:      *output++ = *input++;
      case 6:      *output++ = *input++;
      case 5:      *output++ = *input++;
      case 4:      *output++ = *input++;
      case 3:      *output++ = *input++;
      case 2:      *output++ = *input++;
      case 1:      *output++ = *input++;
      } while(--n > 0);
    }


It looks like someone tricked the parser but for better or worse it really is a valid C program. When you disentangle the two constructs it becomes a little easier to follow what is going on.

    int n = (len + 8 - 1) / 8
    switch(len % 8) {
      case 0: *output++ = *input++;
      case 7: *output++ = *input++;
      case 6: *output++ = *input++;
      case 5: *output++ = *input++;
      case 4: *output++ = *input++;
      case 3: *output++ = *input++;
      case 2: *output++ = *input++;
      case 1: *output++ = *input++;
    }
    do {
      *output++ = *input++;
      *output++ = *input++;
      *output++ = *input++;
      *output++ = *input++;
      *output++ = *input++;
      *output++ = *input++;
      *output++ = *input++;
      *output++ = *input++;
    } while(--n > 0);

In this example, we are left with only 1/8 of the original loop overhead. After the calculation of the remainder, the `switch` acts as a jump table to first copy the bytes of the remainder. After that, it's just a loop of 8 copy instructions each until the copy is complete.

I've chosen a memory copy operation only for demonstration purposes. In the real world, the standard C library version of `memcpy` should be preferred. It may contain architecture-specific optimizations that could still make it significantly faster.

For other applications, it's an interesting way of code optimization. That said if the code duplication is not too bad I would always prefer the disentangled version for clarity reasons. And as always it's important to measure before doing any optimizations. It's hard to know what optimizations the compiler will already apply automatically.

[1]: https://en.wikipedia.org/wiki/Duff%27s_device
[2]: https://en.wikipedia.org/wiki/Loop_unrolling