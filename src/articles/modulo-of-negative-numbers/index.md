---
layout: layouts/article
date: 2011-06-28
title: Modulo of Negative Numbers
description: The modulo operator returns the remainder of a division. But things get a little more tricky when you throw negative numbers into the mix.
keywords: programming, modulo operator, modulo operation, negative numbers, bitmasks, modulo negative
tags:
- programming
related:
- duff-device
tweet: "1353130747364835332"
---

The modulo or often referred to as "mod" represents the remainder of a division. In 1801 Gauss published a book covering modular arithmetics. Later a widely accepted mathematical definition was given by [Donald Knuth][1]

    mod(a, n) = a - n * floor(a / n)

Doing an integer division and then multiplying it again means finding the biggest number smaller than `a` that is dividable by `n` without a remainder. Subtracting this from `a` yields the remainder of the division and by that the modulo.

But what does the modulu operation do? What can it be used for when coding?

## Restricting Bounds

In programming, the modulo operator (`%` or sometimes `mod`) often is used to restrict an index to the bounds of an array or length limited data structure.

    values = [ 3, 4, 5 ]
    index = 5
    value_at_index = values[ index % values.length ]

For the above example this means `5 mod 3 = 2` following the definition is `5 - floor(5/3)*3 = 2`. This means that no matter the value `index` has, the array bounds are met.

**But is that really the case?**

What happens if the dividend or the divisor is signed and holds a negative value?
Turns out the rules of modulo on negative numbers indeed depend on the language you are using.

How does modulus work in java?<br>
How does modulus work in javascript?<br>
How does modulus work in python?<br>

While the code looks pretty much the same in most languages, printing the result shows languages in mostly two different camps.

Only two languages take a different stance: Dart and in particular Zig, which
[distinguishes both cases](https://github.com/ziglang/zig/issues/217) as `@rem(a,b)` and `@mod(a,b)` and errors out on a negative divisor.

Language   | 13 mod 3 | -13 mod 3 | 13 mod -3 | -13 mod -3|
:----------|:--------:|:---------:|:---------:|:---------:|
C          | 1        | -1        | 1         | -1        |
C#         | 1        | -1        | 1         | -1        |
C++        | 1        | -1        | 1         | -1        |
Elixir     | 1        | -1        | 1         | -1        |
Erlang     | 1        | -1        | 1         | -1        |
Go         | 1        | -1        | 1         | -1        |
Java       | 1        | -1        | 1         | -1        |
Javascript | 1        | -1        | 1         | -1        |
Kotlin     | 1        | -1        | 1         | -1        |
Nim        | 1        | -1        | 1         | -1        |
PHP        | 1        | -1        | 1         | -1        |
Rust       | 1        | -1        | 1         | -1        |
Scala      | 1        | -1        | 1         | -1        |
Swift      | 1        | -1        | 1         | -1        |
Crystal    | 1        | 2         | -2        | -1        |
Haskell    | 1        | 2         | -2        | -1        |
Lua        | 1        | 2         | -2        | -1        |
Python     | 1        | 2         | -2        | -1        |
Ruby       | 1        | 2         | -2        | -1        |
Dart       | 1        | 2         | 1         | 2         |
Zig @rem   | 1        | -1        | error     | error     |
Zig @mod   | 1        | 2         | error     | error     |
<!--
Ada        | ?        | ?         | -?        | -?        |
cobol      | ?        | ?         | -?        | -?        |
Clojure    | ?        | ?         | -?        | -?        |
D          | ?        | ?         | -?        | -?        |
Groovy     | ?        | ?         | -?        | -?        |
Lisp       | ?        | ?         | -?        | -?        |
Perl       | ?        | ?         | -?        | -?        |
V          | ?        | ?         | -?        | -?        |
OCaml      | ?        | ?         | -?        | -?        |
Pascal     | ?        | ?         | -?        | -?        |
Smalltalk  | ?        | ?         | -?        | -?        |
-->

So if you use the modulo operator to ensure correct bounds for accessing a collection, beware that some languages need a little more diligence. A simple and efficient way is to check the sign.

    int mod(a, b) {
      c = a % b
      return (c < 0) ? c + b : c
    }

As another option, you could also apply the modulo twice.

    int mod(a, b) {
      (((a % b) + b) % b)
    }

## Even or Odd

Another pitfall to watch out for is when testing whether a number is odd or even using the modulo operator. Based on the above findings you should always compare against `0`.

    bool is_odd(int n) {
        return n % 2 != 0; // could be 1 or -1
    }

But anyone that has ever looked a layer below C will point out that using the modulo isn't necessarily the best implementation for `is_odd` anyway. Multiplication and especially divisions are some of the most expensive instructions on a CPU. If you are dealing with 2-based numbers there is often a faster way.

    x % 2n == x & (2n - 1) // for n>0

At least for a positive divisor, the modulo operation can be replaced with a simple bitwise `and` operation.

    x % 2 == x & 1
    x % 4 == x & 3
    x % 8 == x & 7
    ...

Which allows for a much faster implementation of `is_odd`.

    bool is_odd(int n) {
        return n & 1 != 0;
    }

## In Summary

The modulo operator can be incredibly useful but developers need also to be aware of the above edge cases and when to use or not use it.

For a more detailed discussion see the [wikipedia article][2].

[1]: https://en.wikipedia.org/wiki/Donald_Knuth
[2]: https://en.wikipedia.org/wiki/Modulo_operation
