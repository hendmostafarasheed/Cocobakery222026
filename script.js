// Set the actual grand-opening date here when it is confirmed.
// Current suggested date: November 1, 2026 at 10:00 AM Cairo time.
const OPENING_DATE = new Date("2026-11-01T10:00:00+02:00");
function updateCountdown(){
  const distance = OPENING_DATE.getTime() - Date.now();
  const values = distance <= 0
    ? {days:0,hours:0,minutes:0,seconds:0}
    : {days:Math.floor(distance/86400000),hours:Math.floor((distance%86400000)/3600000),minutes:Math.floor((distance%3600000)/60000),seconds:Math.floor((distance%60000)/1000)};
  for(const [key,value] of Object.entries(values)){
    const el=document.getElementById(key);
    if(el) el.textContent=String(value).padStart(2,"0");
  }
}
updateCountdown(); setInterval(updateCountdown,1000);

const modal=document.getElementById("modal");
const modalTitle=document.getElementById("modal-title");
const modalContent=document.getElementById("modal-content");
function showModal(title, html){
  if(!modal)return;
  modalTitle.textContent=title; modalContent.innerHTML=html; modal.hidden=false;
}
function closeModal(){if(modal)modal.hidden=true}
document.querySelectorAll("[data-action]").forEach(button=>button.addEventListener("click",async()=>{
  const action=button.dataset.action;
  if(action==="rsvp"){
    showModal("Confirm Your Attendance", `
      <p>We'd love to welcome you to CoCo Bakery's grand opening!</p>
      <form id="rsvp-form">
        <label for="guest-name">Your name</label><input id="guest-name" name="guest" required placeholder="Full name">
        <label for="guest-count">Guests attending</label><select id="guest-count" name="count"><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option></select>
        <button class="modal-action" type="submit">Save RSVP</button>
      </form>
      <p class="note">Demo RSVP: this page has no connected guest list, so your response will not be sent to the bakery.</p>`);
    document.getElementById("rsvp-form").addEventListener("submit",e=>{
      e.preventDefault();
      const name=document.getElementById("guest-name").value.trim();
      const count=document.getElementById("guest-count").value;
      showModal("Thank You!",`<p>Thank you, ${escapeHtml(name)}! Your RSVP has been recorded on this screen for ${escapeHtml(count)} guest(s).</p><p class="note">To send responses to the bakery, connect this form to a real RSVP service before publishing.</p><button class="modal-action" onclick="closeModal()">Close</button>`);
    });
  }else if(action==="offers"){
    showModal("Grand Opening Offers",`<p><strong>Freshly baked, made to celebrate.</strong></p><ul><li>Opening-day bakery specials</li><li>French pastries and artisan bread highlights</li><li>Limited-time offers announced in store</li></ul><p class="note">Offer amounts and availability will be announced by CoCo Bakery.</p><button class="modal-action" onclick="closeModal()">Sounds delicious</button>`);
  }else if(action==="photos"){
    showModal("Opening Photos",`<p>Our photo gallery will be available after the grand opening.</p><p class="note">Come back soon for fresh moments from CoCo Bakery.</p><button class="modal-action" onclick="closeModal()">Close</button>`);
  }else if(action==="share"){
    const shareData={title:"CoCo Bakery — Grand Opening",text:"You're invited to the CoCo Bakery grand opening in Dokki, Cairo!",url:window.location.href};
    try{
      if(navigator.share){await navigator.share(shareData);}
      else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(shareData.text+" "+shareData.url);showModal("Invitation Ready to Share","<p>Invitation link copied. You can now paste it into a message.</p><button class=\"modal-action\" onclick=\"closeModal()\">Close</button>");}
      else{showModal("Share Invitation",`<p>Copy this link and share it with your friends:</p><input readonly value="${escapeHtml(window.location.href)}" onclick="this.select()">`);}
    }catch(err){ if(err.name!=="AbortError") showModal("Share Invitation",`<p>Copy this page link to share the invitation:</p><input readonly value="${escapeHtml(window.location.href)}" onclick="this.select()">`); }
  }
}));
document.querySelector(".modal-close")?.addEventListener("click",closeModal);
modal?.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
