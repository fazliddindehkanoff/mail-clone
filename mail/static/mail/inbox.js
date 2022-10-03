document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  document.getElementById("email-detail").innerHTML = ""
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function fetchEmail(email, color = "white") {
  const email_view = document.getElementById("emails-view")
  const card = document.createElement("div")
  const card_body = document.createElement('div')
  const param = document.createElement("p")
  const link = document.createElement('a')
  card.classList.add("card")
  card.classList.add("mt-2")
  card_body.classList.add("card-body")
  param.innerHTML += "<b>" + email.sender + "</b>" + "<span class='tab'></span>";
  param.innerHTML += (email.body.substring(0, 15));
  param.innerHTML += "<span class='float-right text-muted'>" + email.timestamp + "</span>"
  link.setAttribute("id", "show-email")
  link.setAttribute("data-id", email.id)
  link.setAttribute("onclick", `showEmail(${email.id})`)
  link.appendChild(param)
  card_body.appendChild(link)
  card.appendChild(card_body)
  email_view.appendChild(card)
  if (color !== "white") {
    card.classList.add("read")
  }
}

function makeRead(email_id) {
  const url = `/emails/${email_id}`
  fetch(url, {
  method: 'PUT',
  body: JSON.stringify({
      "read": true
  })
})
}

function sendEmail() {
  const resiever = document.getElementById("compose-recipients")

}

function showEmail(email_id) {
  fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
      makeRead(email.id)
      document.getElementById("email-detail").style.display = "block"
      const param = document.createElement("p")
      const reply_btn = document.createElement("button")
      const back_btn = document.createElement("button")
      const hr_elem = document.createElement("hr")
      const email_body = document.createElement("p")
      reply_btn.innerText = "Reply"
      back_btn.innerText = "Back"
      reply_btn.setAttribute("class", "btn btn-outline-primary")
      back_btn.setAttribute("class", "btn btn-outline-secondary ml-2")
      back_btn.setAttribute("onclick", "load_mailbox('inbox')")
      param.innerHTML += "<b>From: </b>" + email.sender + "<br>";
      param.innerHTML += "<b>To: </b>" + document.getElementById("email-detail").getAttribute("data-receiver") + "<br>";
      param.innerHTML += "<b>Subject: </b>" + email.subject + "<br>";
      param.innerHTML += "<b>Timestamp: </b>" + email.timestamp + "<br>";
      email_body.innerText = email.body
      document.getElementById("emails-view").style.display = "none"
      document.getElementById("email-detail").appendChild(param)
      document.getElementById("email-detail").appendChild(reply_btn)
      document.getElementById("email-detail").appendChild(back_btn)
      document.getElementById("email-detail").appendChild(hr_elem)
      document.getElementById("email-detail").appendChild(email_body)
    })

}

function load_mailbox(mailbox) {
  document.getElementById("email-detail").innerHTML = ""
  if (mailbox === "inbox") {
    fetch('/emails/inbox')
      .then(response => response.json())
      .then(emails => {
        for (let index = 0; index < emails.length; index++) {
          if (emails[index].read) {
            fetchEmail(emails[index], color="gray")
          } else {
            fetchEmail(emails[index])            
          }
        }
      });
  }
  else if (mailbox === "archive") {
    fetch('/emails/archive')
      .then(response => response.json())
      .then(emails => {
        for (let index = 0; index < emails.length; index++) {
          fetchEmail(emails[index], color="gray")
        }
      });
  }
  else if (mailbox === 'sent') {
    fetch('/emails/sent')
      .then(response => response.json())
      .then(emails => {
        for (let index = 0; index < emails.length; index++) {
          fetchEmail(emails[index])
        }
      });
  }

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}