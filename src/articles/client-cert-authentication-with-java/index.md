---
layout: layouts/article
date: 2006-10-10
title: SSL Client Cert Authentication with Java
description: Using a PKCS12 certificate for authentication requires a bit more work.
keywords: java, client certificate, cert, ssl, tls, pkcs12, x509
series: featured
tags:
- java
- ssl
related:
- debugging-https
---

Connecting to an https URL is easy in java. Just create a URL object and you are ready to go. If you need to provide a client certificate it gets a little more complicated to get right. You have to create a properly set up `SSLSocketFactory` to establish an authenticated connection. Next, you need to load the PKCS12 certificate into a keystore and provide that store to the `SSLContext`.

    private SSLSocketFactory getFactory( File pKeyFile, String pKeyPassword ) throws ... {
      KeyManagerFactory keyManagerFactory =
        KeyManagerFactory.getInstance("SunX509");
      KeyStore keyStore =
        KeyStore.getInstance("PKCS12");

      InputStream keyInput = new FileInputStream(pKeyFile);
      keyStore.load(keyInput, pKeyPassword.toCharArray());
      keyInput.close();

      keyManagerFactory.init(keyStore, pKeyPassword.toCharArray());

      SSLContext context = SSLContext.getInstance("TLS");
      context.init(
        keyManagerFactory.getKeyManagers(),
        null,
        new SecureRandom()
      );

      return context.getSocketFactory();
    }

    URL url = new URL("https://someurl");
    HttpsURLConnection con = (HttpsURLConnection) url.openConnection();
    con.setSSLSocketFactory(getFactory(new File("file.p12"), "secret"));

If the client certificate was issued by your private CA you also need to
make sure the full certificate chain is in your JVMs keystore.

    STORE=/path/to/JRE/cacerts
    sudo keytool -importcert \
      -trustcacerts \
      -keystore $STORE \
      -storepass changeit \
      -noprompt \
      -file myca.pem \
      -alias myca
