/* ---- Configuration: update these when the apps and legal pages are live ---- */
var APP_LINKS = { ios: "https://apps.apple.com/", android: "https://play.google.com/" };
var CONTACT = { email: "fixaplexhomeservices@gmail.com", endpoint: "" }; /* set the support email and the approved form endpoint */
var LEGAL = { privacy: "#", terms: "#", cookies: "#" };

(function(){
 var ua = navigator.userAgent, isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform==="MacIntel" && navigator.maxTouchPoints>1), isAndroid = /Android/.test(ua);
 function $$(s){return Array.prototype.slice.call(document.querySelectorAll(s));}
 $$(".store-ios").forEach(function(a){a.href=APP_LINKS.ios;a.rel="noopener";});
 $$(".store-android").forEach(function(a){a.href=APP_LINKS.android;a.rel="noopener";});
 /* On phones, primary download buttons go straight to the right store; on desktop they jump to the section showing both. */
 if(isIOS||isAndroid){$$("a.dl").forEach(function(a){a.href=isIOS?APP_LINKS.ios:APP_LINKS.android;a.dataset.event=isIOS?"app_download_ios_click":"app_download_android_click";});}
 var l=$$("[data-legal]");["privacy","terms","cookies"].forEach(function(k,i){if(l[i])l[i].href=LEGAL[k];});
 if(CONTACT.email){var m=document.getElementById("mail");m.href="mailto:"+CONTACT.email;m.textContent=CONTACT.email;}
 /* Analytics hook: pushes named events only; connect to the approved analytics setup. */
 window.dataLayer=window.dataLayer||[];
 document.addEventListener("click",function(e){var t=e.target.closest("[data-event]");if(t)window.dataLayer.push({event:t.dataset.event});});
 $$("details").forEach(function(d){d.addEventListener("toggle",function(){if(d.open)window.dataLayer.push({event:"faq_open"});});});
 /* Open the collapsed FAQ / Contact section when a link or URL hash points to it. */
 function openHash(){var t=location.hash&&document.querySelector(location.hash+" details.faq-all");if(t)t.open=true;}
 document.addEventListener("click",function(e){var a=e.target.closest('a[href="#faq"],a[href="#contact"]');if(a){var d=document.querySelector(a.getAttribute("href")+" details.faq-all");if(d)d.open=true;}});
 window.addEventListener("hashchange",openHash);openHash();
 var nav=document.getElementById("nav"),btn=document.getElementById("menu");
 function setMenu(o){nav.classList.toggle("open",o);btn.setAttribute("aria-expanded",o);btn.textContent=o?"✕":"☰";btn.setAttribute("aria-label",o?"Close menu":"Open menu");}
 btn.addEventListener("click",function(){setMenu(!nav.classList.contains("open"));});
 nav.addEventListener("click",function(e){if(e.target.tagName==="A")setMenu(false);});
 document.getElementById("cform").addEventListener("submit",function(e){
  e.preventDefault();var f=e.target,msg=document.getElementById("fmsg");
  if(f.website.value)return;
  if(!f.name.value.trim()||!/^\S+@\S+\.\S+$/.test(f.email.value)||!f.message.value.trim()){msg.textContent="Please enter your name, a valid email address and a message.";return;}
  if(!CONTACT.endpoint){msg.textContent="The contact form is not connected yet. Please email us instead.";return;}
  msg.textContent="Sending…";
  fetch(CONTACT.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:f.name.value,email:f.email.value,type:f.type.value,message:f.message.value})})
   .then(function(r){if(!r.ok)throw 0;f.reset();msg.textContent="Thanks. Your message has been sent.";window.dataLayer.push({event:"contact_form_submit"});})
   .catch(function(){msg.textContent="Something went wrong. Please try again or email us.";});
 });
})();
