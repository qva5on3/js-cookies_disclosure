/**
  Copyright (C) 2011 by Ollie Phillips
  Copyright (C) 2013 by Lukasz Zachulski

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

var jQuery_version = '1.9.1';

function cookies_disclosure(position, display_times, privacy_policy_uri) {
  if((position.toLowerCase() != 'top') && (position.toLowerCase() != 'bottom')) {
    position = 'top';
  }

  if (window.jQuery === undefined || window.jQuery.fn.jquery < jQuery_version) {
    var s = document.createElement("script");
    s.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + jQuery_version + "/jquery.min.js";
    s.type = "text/javascript";
    s.onload = s.onreadystatechange = function() {
      if ((!s.readyState || s.readyState == "loaded" || s.readyState == "complete")) {
        cookies_check(position, display_times, privacy_policy_uri);
      }
    }
    document.getElementsByTagName("head")[0].appendChild(s);
  } else {
    // There is already jQuery and it's in right version
    cookies_check(position, display_times, privacy_policy_uri);
  }
}

function cookies_check(position, display_times, privacy_policy_uri) {
    if(!read_cookie('cookies_disclosure')) {
      if(display_times > 0) {
        // Limits the number of times this is displayed.
        if(!read_cookie('cookie_disclosure_count')) {
          create_cookie('cookie_disclosure_count',1,1);
          display_disclosure(position, privacy_policy_uri);
        } else {
          if(display_times > read_cookie('cookie_disclosure_count')) {
            var count = read_cookie('cookie_disclosure_count');
            count ++;
            create_cookie('cookie_disclosure_count', count, 1);
            display_disclosure(position, privacy_policy_uri);
          }
        }
      } else {
        display_disclosure(position, privacy_policy_uri);
      }
    } else {
      // Cookies accepted.
    }
}

function display_disclosure(position, privacy_policy_uri) {
  // The disclosure narrative pretty much follows that on the Information Commissioners Office website

  // Create our overlay with message
  var div_node = document.createElement('div');
  div_node.setAttribute('id','cookiesdisclosureframe');
  div_node.innerHTML= disclosure_text(position, privacy_policy_uri);
  document.body.appendChild(div_node);

  // Bring our overlay in
  if(position.toLowerCase() == 'top') {
    display_disclosure_position(position);
  } else {
    display_disclosure_position(position);
  }

}

function display_disclosure_position(position, display_seconds) {
  position = typeof position !== 'undefined' ? position : 'top';
  display_seconds = typeof display_seconds !== 'undefined' ? display_seconds : 0;

  $('#cookiesdirective').animate(
    position == 'top' ? { top: '0' } : {bottom: '0'},
    1000, function() {
      // Overlay is displayed, set a listener on the button.
      $('#cookiessubmit').click(function() {
        // Set a cookie to prevent this being displayed again
        create_cookie('cookies_disclosure',1,365);
        // Close the overlay
        $('#cookiesdirective').animate(
          position == 'top' ? { top:'-300' } : {bottom: '-300'},
          1000,function(){
            $('#cookiesdirective').remove();
            location.reload(true);
          });
      });
      if (display_seconds > 0) {
        // Set a timer to remove the warning after 10 seconds
        setTimeout(function(){
          $('#cookiesdirective').animate({
            opacity:'0'
          },2000, function(){
            $('#cookiesdirective').css(position,'-300px');
          });
        },display_seconds * 1000);
      }
    });
}

function disclosure_text(position, privacy_policy_uri) {
  var css_position = 'fixed';

  if(detect_IE789()) {
    // In IE 8 & presumably lower, position:fixed does not work
    // IE 9 in compatibility mode also means script won't work
    // Means we need to force to top of viewport and set position absolute
    position = 'top';
    css_position = 'absolute';
  }

  var disclosure = '<div id="cookiesdirective" \
                      style="\
                        position:'+ css_position + ';' +
                        position + ':-300px;\
                        left:0px;\
                        width:100%;\
                        height:auto;\
                        background:#efefef;\
                        opacity:.95; \
                        -ms-filter: “alpha(opacity=95)”; \
                        filter: alpha(opacity=95);\
                        -khtml-opacity: .95; \
                        -moz-opacity: .95; \
                        color:#000000;\
                        font-family:arial;\
                        font-size:12px;\
                        text-align:justify;\
                        z-index:1000;\
                      ">';
  disclosure +='<div \
                  style="\
                    position:relative;\
                    height:auto;\
                    width:90%;\
                    padding:15px;\
                    margin-left:auto;\
                    margin-right:auto;">';

  disclosure += 'Nasze strony wykorzystują pliki cookies. <br/> \
                 Na naszych stronach używamy informacji zapisanych za pomocą \
                 cookies w celach reklamowy, statystycznych oraz w celu \
                 dostosowania stron do indywidualnych potrzeb użytkowników.<br/>\
                 W przeglądarce można zmienić ustawienia dotyczące cookies. \
                 Korzystanie z naszych stron bez zmiań ustawień dotyczących \
                 plików cookies oznacza, że będą one zapisane w pamięci \
                 urządzenia. Więcej informacji można znaleźć w naszym \
                 <a style="color:#ca0000;font-weight:bold;" href="'+ privacy_policy_uri + '">regulaminie</a>.';

  disclosure += '<br/><br/>';
  disclosure += '<input type="submit" name="cookiessubmit" id="cookiessubmit" value="Akceptuję"/>';
  disclosure += '</div>';
  disclosure += '</div>';

  return disclosure;
}

function read_cookie(name) {
  var ca = document.cookie.split(';');
  name = name + "=";

  for(var i=0;i < ca.length;i++) {
    var c = ca[i];

    while (c.charAt(0)==' ') {
      c = c.substring(1, c.length);
    }

    if (c.indexOf(name) == 0) {
      return unescape(c.substring(name.length, c.length));
    }
  }

  return null;
}

function create_cookie(name, value, days) {
  var date = new Date();
  date.setTime(date.getTime()+(days*24*60*60*1000));

  value= escape(value) + (days ? "; expires="+date.toUTCString() : "");

  document.cookie = name + "=" + value + "; path=/";
}

function detect_IE789(){
  // Detect IE less than version 9.0
  var version;

  if (navigator.appName == 'Microsoft Internet Explorer') {
    var ua = navigator.userAgent;
    var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");

    if (re.exec(ua) != null) {
      version = parseFloat(RegExp.$1);
    }

    if (version <= 8.0) {
      return true;
    } else {
      if(version == 9.0) {
        if(document.compatMode == "BackCompat") {
          // IE9 in quirks mode won't run the script properly, set to emulate IE8
          var mA = document.createElement("meta");
          mA.content = "IE=EmulateIE8";
          document.getElementsByTagName('head')[0].appendChild(mA);
          return true;
        } else {
          return false;
        }
      }
      return false;
    }
  } else {
    return false;
  }

  return false;
}
