// Select DOM elements to work with
const welcomeDiv = document.getElementById("WelcomeMessage");
const signInButton = document.getElementById("SignIn");
const cardDiv = document.getElementById("card-div");
const mailButton = document.getElementById("readMail");
const profileButton = document.getElementById("seeProfile");
const profileDiv = document.getElementById("profile-div");

function showWelcomeMessage(username) {
  // Reconfiguring DOM elements
  cardDiv.style.display = "initial";
  welcomeDiv.innerHTML = `Welcome ${username}`;
  signInButton.setAttribute("onclick", "signOut();");
  signInButton.setAttribute("class", "btn btn-success");
  signInButton.innerHTML = "Sign Out";
}

function updateUI(data, endpoint) {
  console.log("Graph API responded at: " + new Date().toString());

  if (endpoint === graphConfig.graphMeEndpoint) {
    profileDiv.innerHTML = "";
    const title = document.createElement("p");
    title.innerHTML = "<strong>Title: </strong>" + data.jobTitle;
    const email = document.createElement("p");
    email.innerHTML = "<strong>Mail: </strong>" + data.mail;
    const phone = document.createElement("p");
    phone.innerHTML = "<strong>Phone: </strong>" + data.businessPhones[0];
    const address = document.createElement("p");
    address.innerHTML = "<strong>Location: </strong>" + data.officeLocation;
    profileDiv.appendChild(title);
    profileDiv.appendChild(email);
    profileDiv.appendChild(phone);
    profileDiv.appendChild(address);
  } else if (endpoint === graphConfig.graphMailEndpoint) {
    if (!data.value) {
      alert("You do not have a mailbox!");
    } else if (data.value.length < 1) {
      alert("Your mailbox is empty!");
    } else {
      const tabContent = document.getElementById("nav-tabContent");
      const tabList = document.getElementById("list-tab");
      tabList.innerHTML = ""; // clear tabList at each readMail call

      data.value.map((d, i) => {
        // Keeping it simple
        if (i < 10) {
          const listItem = document.createElement("a");
          listItem.setAttribute(
            "class",
            "list-group-item list-group-item-action"
          );
          listItem.setAttribute("id", "list" + i + "list");
          listItem.setAttribute("data-toggle", "list");
          listItem.setAttribute("href", "#list" + i);
          listItem.setAttribute("role", "tab");
          listItem.setAttribute("aria-controls", i);
          listItem.innerHTML = d.subject;
          tabList.appendChild(listItem);

          const contentItem = document.createElement("div");
          contentItem.setAttribute("class", "tab-pane fade");
          contentItem.setAttribute("id", "list" + i);
          contentItem.setAttribute("role", "tabpanel");
          contentItem.setAttribute("aria-labelledby", "list" + i + "list");
          contentItem.innerHTML =
            "<strong> from: " +
            d.from.emailAddress.address +
            "</strong><br><br>" +
            d.bodyPreview +
            "...";
          tabContent.appendChild(contentItem);
        }
      });
    }
  } else if (endpoint === graphConfig.getJunkEmail) {
    const junkMails = [];
    let deletedCount = 0;
    const phrases = document
      .getElementById("phrases")
      .value.split("\n")
      .map((p) => p.toLowerCase());

    for (const message of data.value) {
      junkMails.push({
        id: message.id,
        subject: message.subject,
        senderName: message.sender.emailAddress.name,
      });
    }

    for (const junkMail of junkMails) {
      const subject = junkMail.subject.toLowerCase();
      const senderName = junkMail.senderName.toLowerCase();

      let isMatch = false;
      for (phrase of phrases) {
        if (phrase.length === 0) {
          continue;
        }

        if (
          subject.includes(phrase.toLowerCase()) ||
          senderName.includes(phrase.toLowerCase())
        ) {
          isMatch = true;
          break;
        }
      }

      if (isMatch) {
        setTimeout(() => {
          console.log(
            "deleting message: " +
              junkMail.id +
              ' with subject: "' +
              junkMail.subject +
              '"'
          );
          deleteJunkEmail(junkMail.id);
        }, deletedCount * 250);
        deletedCount++;
      }
    }

    alert(`${deletedCount} mails deleted`);
  }
}
