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
function test() {
  console.log("clicked");
}
function showEmail(email_id) {
  fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
      console.log(`email id: ${email.id}`);
    })

}

function load_mailbox(mailbox) {
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
  else if (document.getElementById("show-email").clicked == true) {
    console.log("hello world");
  }

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}