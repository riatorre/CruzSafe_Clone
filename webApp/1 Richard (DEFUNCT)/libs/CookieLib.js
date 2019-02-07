/*
 * CookieLib.js
 * A Library of functions used to manage cookies
 */
 
 /* set a Cookie with given name and value with defined duration(num_days)
  * May be used to update Cookie as well
  */
 function setCookie(name, val, num_days) {
  var d = new Date();
  d.setTime(d.getTime() + (num_days*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = name + "=" + val + ";" + expires + ";path=/";
}

/* gets a Cookie with given name
 * Splits all Cookie strings and itterates through array to find
 * cookie with given name.
 * Returns the value of the Cookie if found, otherwise it returns an empty string.
 */
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/* Deletes Cookie by overwriting value and setting expiration date to current time.
 * As shown, simply uses setCookie();
 */
function deleteCookie(cname) {
	setCookie(cname, '', 0);
}