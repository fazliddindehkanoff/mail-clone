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

function load_mailbox(mailbox) {
  if (mailbox === "inbox") {
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
      for (let index = 0; index < emails.length; index++) {
        const email_view = document.getElementById("emails-view")
        const card = document.createElement("div")
        card.classList.add("card")
        card.classList.add("mt-2")
        const card_body = document.createElement('div')
        card_body.classList.add("card-body")
        const param = document.createElement("p")
        param.innerHTML += "<b>" + emails[index].sender + "</b>" + "<span class='tab'></span>";
        param.innerHTML += (emails[index].body.substring(0, 15));
        param.innerHTML += "<span class='float-right'>" + emails[index].timestamp + "</span>"
        card_body.appendChild(param)
        card.appendChild(card_body)
        email_view.appendChild(card)
      }
    });
  }

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}