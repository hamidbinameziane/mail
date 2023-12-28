document.addEventListener('DOMContentLoaded', function() {
  globalThis.rcps = document.querySelector('#compose-recipients');
  globalThis.sbjt = document.querySelector('#compose-subject');
  globalThis.bd = document.querySelector('#compose-body');

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector('#compose-form').onsubmit = send_email;

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#view-email').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function replay_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#view-email').style.display = 'none'
  document.querySelector('#compose-view').style.display = 'block';

}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  document.querySelector('#view-email').style.display = 'none';
  document.querySelector('#view-email').innerHTML = ""

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      emails.forEach(element => {
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const div3 = document.createElement('div');
        const div4 = document.createElement('div');
        const div5 = document.createElement('div');
        const div6 = document.createElement('div');
        const div7 = document.createElement('div');
        const div8 = document.createElement('div');
        const div9 = document.createElement('div');
        const div10 = document.createElement('textarea');
        const div11 = document.createElement('div');
        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        const span3 = document.createElement('span');
        const span4 = document.createElement('span');
        const span5 = document.createElement('span');
        const span6 = document.createElement('span');
        const span7 = document.createElement('span');
        const span8 = document.createElement('span');
        const archive_b = document.createElement('button');
        const archive2_b = document.createElement('button');
        const replay_b= document.createElement('button');
        div2.innerHTML = element.sender;
        div2.style.float = 'left';
        div2.style.fontWeight = 'bold'
        div2.setAttribute('class', 'col');       
        div1.append(div2)
        div3.innerHTML = element.subject;
        div3.setAttribute('class', 'col'); 
        div1.append(div3)
        div4.innerHTML = element.timestamp;
        div4.style.float = 'right';
        div4.setAttribute('class', 'col text-muted');
        div1.append(div4)
        if (element.read === true) {
          div1.style.backgroundColor = 'lightgray';
        }
        div1.setAttribute('class', 'row row-cols-auto');
        div1.addEventListener('click', event => {
          const elm = event.target;
          console.log(elm);
          if (elm.className !== 'btn btn-outline-primary'){
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#view-email').style.display = 'block';
          fetch(`/emails/${element.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                read: true
            })
          })
          fetch(`/emails/${element.id}`)
          .then(response => response.json())
          .then(email => {
            span1.innerHTML = 'From: ';
            span1.style.fontWeight = 'bold'           
            div5.append(span1)
            span2.innerHTML = email.sender;        
            div5.append(span2)
            div5.setAttribute('class', 'col');
            div11.append(div5)
            span3.innerHTML = 'To: ';
            span3.style.fontWeight = 'bold'
            div6.append(span3)
            span4.innerHTML = email.recipients;    
            div6.append(span4)
            div6.setAttribute('class', 'col');
            div11.append(div6)

            span5.innerHTML = 'Subject: ';
            span5.style.fontWeight = 'bold'
            div7.append(span5)
            span6.innerHTML = email.subject;        
            div7.append(span6)
            div7.setAttribute('class', 'col');
            div11.append(div7)

            span7.innerHTML = 'Timestamp: ';
            span7.style.fontWeight = 'bold'
            div8.append(span7)
            span8.innerHTML = email.timestamp;        
            div8.append(span8)
            div8.setAttribute('class', 'col');
            div11.append(div8)

            replay_b.innerHTML = 'Replay'
            replay_b.setAttribute('class', 'btn btn-outline-primary col-1');
            replay_b.style.marginBottom = '5px'
            replay_b.addEventListener('click', function() {
              rcps.value = email.sender
              if (email.subject.startsWith('Re: ')) {
                sbjt.value = email.subject
              }
              else {
                sbjt.value = `Re: ${email.subject}`
              }
              bd.value = `"On ${email.timestamp} ${email.sender} wrote: ${email.body}"`
              replay_email()
            })
            div11.append(replay_b)
            div10.innerHTML = email.body;
            div10.setAttribute('class', 'form-control');
            div10.style.padding = '5px'       
            div11.append(div10)

            div11.setAttribute('class', 'row row-cols-1');
            document.querySelector('#view-email').append(div11);
          })
        }
      });      
        if (mailbox == 'inbox') {
          archive_b.innerHTML = 'Archive'
          archive_b.setAttribute('class', 'btn btn-outline-primary');
          div1.append(archive_b)
          archive_b.addEventListener('click', function() {
            fetch(`/emails/${element.id}`, {
              method: 'PUT',
              body: JSON.stringify({
                archived: true,
              })
            })
            setTimeout(() => {
              load_mailbox('inbox')
            }, 50)
            })
          }
          else if (mailbox == 'archive') {
            archive2_b.innerHTML = 'Unarchive'
            archive2_b.setAttribute('class', 'btn btn-outline-primary');
            div1.append(archive2_b)
            archive2_b.addEventListener('click', function() {
              fetch(`/emails/${element.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                  archived: false
                })
                
              })
              setTimeout(() => {
                load_mailbox('inbox')
              }, 50)
              
          })
          }
          document.querySelector('#emails-view').append(div1);
      })
    })

}

function send_email() {

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: rcps.value,
        subject: sbjt.value,
        body: bd.value
    })
  })
  .then(response => response.json())
  .then(result => {
  });
  setTimeout(() => {
    load_mailbox('sent')
  }, 50)
  return false;
}