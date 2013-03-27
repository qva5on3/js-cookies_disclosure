js-cookies_disclosure
=====================

Displays cookies disclosure information based on EU directive.

Description
-----------
This script is based on *The cookiesDirective.js* script by Ollie Phillips (http://cookiesdirective.com). It has been stripped down by removing part which has been blocking scripts/cookies from executing till user explicitly approve these.

It has been rewritten for personal use to make my website comply with EU/Polish law.

Currently *cookies_disclosure.js* doesn't block scripts/cookies priori to user's consent. In consequence it only displays overlay with legal informations and points to url with site policy.

Example
-------
```html
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  </head>
  <body>
  <script type="text/javascript" src="cookies_disclosure.js">
  </script>
  <script type="text/javascript">
    // Parameters:
    //  - The position of the disclosure ('top' or 'bottom').
    //  - Number of times to display disclosure. Enter 0 to show it forever.
    //  - The URI of your privacy policy.
    cookies_disclosure('top', 0, 'privacy.html');
  </script>
  </body>
</html>
```

Background
----------
On 26 May 2011 the European Commission made the controversial 'Cookies Directive' law. It applies to the UK and all European countries. It mandates that the use of cookies on European businesses' websites must be disclosed and explicit consent for their use be obtained from your users.

In Poland the Act will introduce new rules on cookies and data breach notification, applicable only to the telecommunications sector, which will come into effect on March 22, 2013.

License
-------
*cookies_disclosure.js* is distributed under MIT license.
