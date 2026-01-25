---
layout: layouts/article
date: 2007-12-19
title: Not Enough Entropy?
description: The moment when your TLS/SSL connection somehow just gets stuck.
keywords: ssl, tls, entropy, randomness
tags:
- linux
- ssl
---

When establishing a TLS/SSL connection somehow gets stuck there is a good chance that you are just lacking enough [entropy][1]. The tricky part is that you cannot find anything about this in the logs. If you experience similar problems, on Linux the first thing to check if there is enough entropy available.

    cat /proc/sys/kernel/random/entropy_avail

If the number is below 1000 that might be the problem. It means that your system does not generate enough randomness for cryptographically secure communications - and waits until there is.


## What is Entropy?

While the concept of randomness is a familiar concept, the distinction to entropy is less clear. The material I found from [Blackhat session][7] is not just really interesting, it also explains it in a surprisingly easy way.

Entropy
: is the uncertainty of a future outcome.

Randomness
: is the quality of uncertainty of historic outcomes.


## Why not use PRNG?

An easy but terrible workaround is to only use a pseudo-random generator.

    mv /dev/random /dev/random.old
    ln -s /dev/urandom /dev/random

By definition, these pseudo-random numbers cannot be really random. Mouse movements, key presses, audio or video input or disk access can be sources for proper randomness. There are dedicated daemones like [haveged][2], [egd][3], [prngd][4] or [others][5] that do just that. Unfortunately on a virtual server, your mileage may vary.

Cryptography algorithms rely heavily on access to high quality random numbers. They are needed for key and nonce creation. I remember a time where I was asked to move a mouse to create a good encryption key - go figure. If the bandwidth and quality of random numbers suffers, the security of the underlying can be compromised.

How bad this can be is to look at [what (almost) happend at Debian][8] in 2009. It should demonstrate very clearly how bad the "workaround" from above really is.

> The impact [...] is that every signature generated on a vulnerable system reveals the signer’s private key

So don't skimp on entropy, your security may depend on it. There is enough randomness in this life - use it.

[1]: https://en.wikipedia.org/wiki/Entropy_(computing)
[2]: https://www.issihosts.com/haveged/
[3]: http://egd.sourceforge.net/
[4]: http://prngd.sourceforge.net/
[5]: https://wiki.debian.org/Entropy
[6]: https://en.wikipedia.org/wiki/Entropy_(information_theory)#Limitations_of_entropy_in_cryptography
[7]: https://www.blackhat.com/docs/us-15/materials/us-15-Potter-Understanding-And-Managing-Entropy-Usage-wp.pdf
[8]: https://rdist.root.org/2009/05/17/the-debian-pgp-disaster-that-almost-was/
