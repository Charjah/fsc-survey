// ===== VARIABLES =====
const questionsEL = document.getElementById("questions");
const totalScoreEl = document.getElementById("totalScore");
const emailLink = document.getElementById("emailLink");

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzoM2xrxrZzSP6HAdVrYrzT4i-UaUIiCgYhg7tTNh_N48_o-cTHND1s_1vNIcxucMMQ/exec";

// ===== QUESTIONS =====
const questions = [
  { id: 1, text: "Leadership actively communicates and promotes the importance of a positive food safety and quality culture." },
  { id: 2, text: "Leadership recognises and rewards those people who have embraced good practices surrounding our food safety and quality culture." },
  { id: 3, text: "How often do you perform internal food safety audits? 1 - 5 = 1 Annually to 5 Monthly" },
  { id: 4, text: "Our organisation knows how effective our process are in delivering safe quality products." },
  { id: 5, text: "We track and analyse trends in food safety / quality control incidents and near misses." },
  { id: 6, text: "How often do food operators report potential / actual hazards or near misses? 5 = 1 Annually to 5 Daily." },
  { id: 7, text: "Our organisation has determined and selected opportunities to improve the suitability, adequacy and effectiveness of our food safety and quality culture." },
  { id: 8, text: "Our induction process covers the importance and content of a positive food safety and quality culture very well." },
  { id: 9, text: "The internal and external issues that may impact our food safety and quality culture have been risk assessed and muitigated to a high standard." },
  { id: 10, text: "I am confident that all of our outsourced processes are controlled not to bring additional risks to the food safety and quality of our products." },
  { id: 11, text: "Enought budget is allocated to tecnical / operational teams so that the proudction area can be maintained to a high standard, non-conformities can be remedied, potential hazards removed and all staff can be trained to a high standard." },
  { id: 12, text: "Accurate documented evidence is continually filled out and kept up to date, demonstrating that processes have been carried out as planned in documented policy and procedure." },
  { id: 13, text: "Operators always have adequate time to perform tasks without choosing between maintaining good food safety / quality practices and getting orders out on time." },
  { id: 14, text: "Staff at all levels are actively encouraged to suggest improvements to encourage better food safety and quality outcomes." },
  { id: 15, text: "Messages concerning food safety and quality culture are constructed well and frequently communicated across the entire organisation." },
  { id: 16, text: "I am confident that all staff take communication concerning food safety and quality culture seriously, and that the content of these messages is understood by all staff." },
  { id: 17, text: "Site visitors and suppliers are required to follow site safety and quality procedures. This is always well understood and followed by these site visitors." },
  { id: 18, text: "When dealing with customer complaints and satisfaction, root cause analysis is performed appropriately." },
  { id: 19, text: "Does your organisation have food safety and quality culture champions?", type: "yesno" },
  { id: 20, text: "Does a member of top management / directorship own all non-conformities picked up at audit?", type: "yesno" },
  { id: 21, text: "Are food safety and quality a regular permanent item on senior management meetings, and is this item always discussed (not postponed / cancelled if other items overrun).", type: "yesno" },
  { id: 22, text: "Do top leadership (i.e. CEO) ever walk the line and engage with where incidents / non-conformities have taken place to see that mitigating actions have been put into place to prevent recurrence?", type: "yesno" },
  { id: 23, text: "Leadership actively communicates and promotes the importance of a positive food safety and quality culture." }
];

// ===== SCALES =====
const likert = [
  { label: "Strongly disagree", value: 1 },
  { label: "Disagree", value: 2 },
  { label: "Not sure", value: 3 },
  { label: "Agree", value: 4 },
  { label: "Strongly agree", value: 5 }
];

const yesno = [
  { label: "No", value: 1 },
  { label: "Yes", value: 5 }
];

// ===== RENDER =====
function render() {
  questionsEL.innerHTML = "";

  for (const q of questions) {
    const row = document.createElement("div");
    row.className = "qrow";

    const qtext = document.createElement("div");
    qtext.className = "qtext";
    qtext.textContent = `${q.id}. ${q.text}`;

    const cells = document.createElement("div");
    cells.className = "qanswers";

    // ✅ Mobile-only Likert labels (ONLY for Likert questions)
    if (q.type !== "yesno") {
      const mobileScale = document.createElement("div");
      mobileScale.className = "mobile-scale";
      mobileScale.innerHTML = `
        <span>Strongly<br>disagree</span>
        <span>Disagree</span>
        <span>Not<br>sure</span>
        <span>Agree</span>
        <span>Strongly<br>agree</span>
      `;
      cells.appendChild(mobileScale);
    }

    const choices = document.createElement("div");
    choices.className = "qchoices";
    if (q.type === "yesno") choices.classList.add("yesno");

    const scale = q.type === "yesno" ? yesno : likert;

    for (const opt of scale) {
      const wrap = document.createElement("label");
      wrap.className = "choice";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${q.id}`;
      input.value = String(opt.value);
      input.addEventListener("change", updateScore);

      const dot = document.createElement("span");
      dot.className = "dot";

      const sr = document.createElement("span");
      sr.className = "sr-only";
      sr.textContent = opt.label;

      wrap.appendChild(input);
      wrap.appendChild(dot);
      wrap.appendChild(sr);

      // show text labels only for YES/NO
      if (q.type === "yesno") {
        const vis = document.createElement("span");
        vis.className = "choice-label";
        vis.textContent = opt.label;
        wrap.appendChild(vis);
      }

      choices.appendChild(wrap);
    }

    cells.appendChild(choices);

    row.appendChild(qtext);
    row.appendChild(cells);
    questionsEL.appendChild(row);
  }
}

// ===== UPDATE SCORE =====
function updateScore() {
  let total = 0;

  for (const q of questions) {
    const chosen = document.querySelector(`input[name="q${q.id}"]:checked`);
    if (chosen) total += Number(chosen.value);
  }

  totalScoreEl.textContent = String(total);

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim() || "admin@corecompliance.biz";
  const trainer = document.getElementById("trainer").value.trim();
  const site = document.getElementById("site").value.trim();

  const interpretation = getScoreMessage(total);

  const subject = encodeURIComponent("Food Safety Culture Self-Assessment Results");
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nTrainer: ${trainer}\nSite: ${site}\n` +
    `Total Score: ${total}\n\n` +
    `Interpretation:\n${interpretation}\n`
  );

  emailLink.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

// ===== GET SCORE MESSAGE =====
function getScoreMessage(score) {
  if (score <= 40) return "0 - 40: Your organization's understanding of the importance of food safety and quality culture, and a positive implementation of this could be putting your organization at risk.";
  if (score <= 59) return "41 - 59: You have an understanding, but there are clear areas for improvement of food safety and quality culture in your organization. Leadership buy in is key to achieving success see our whitepaper on food safety and quality culture.";
  if (score <= 84) return "60 - 84: You are well on your way to creating a positive quality culture in your organization, in the spirit of continual improvement, take a look at training courses on leadership, food safety and quality systems or HACCP to see how you can take your score to the next level.";
  if (score <= 99) return "85 - 99: You have a good understanding of the importance food safety and quality culture within your organization. Remember the importance of embedding this at every available opportunity, and try to engage all staff including senior management, shift leaders and operatives to strive for excellence.";
  return "100 - 110: Excellent job! You understand the importance of continual improvement in food safety and quality culture, commicate well at all levels and have management buy in. Be sure to share these excellent results with your customers!";
}

// ===== RESET BUTTON =====
document.getElementById("resetBtn").addEventListener("click", () => {
  document.querySelectorAll("input[type='text'], input[type='email']").forEach(i => (i.value = ""));
  document.querySelectorAll("input[type='radio']").forEach(r => (r.checked = false));
  totalScoreEl.textContent = "0";
  updateScore();
});

// ===== SUBMIT BUTTON =====
document.getElementById("submitBtn").addEventListener("click", async () => {
  const btn = document.getElementById("submitBtn");
  btn.disabled = true;
  btn.textContent = "Submitting...";

  const payload = {
    Timestamp: new Date().toISOString(),
    Name: document.getElementById("name").value.trim(),
    Email: document.getElementById("email").value.trim(),
    Trainer: document.getElementById("trainer").value.trim(),
    Site: document.getElementById("site").value.trim(),
    TotalScore: Number(totalScoreEl.textContent)
  };

  for (const q of questions) {
    const chosen = document.querySelector(`input[name="q${q.id}"]:checked`);
    payload[`Q${q.id}`] = chosen ? Number(chosen.value) : "";
  }

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    alert(
      `✅ Submission successful!\n\n` +
      `Your total score: ${payload.TotalScore}\n\n` +
      `${getScoreMessage(payload.TotalScore)}`
    );

    document.querySelectorAll("input").forEach(i => {
      if (i.type === "radio") i.checked = false;
      else i.value = "";
    });

    totalScoreEl.textContent = "0";
    updateScore();
  } catch (err) {
    alert("❌ Submission failed. Please try again.");
  } finally {
    btn.disabled = false;
    btn.textContent = "SUBMIT";
  }
});

// boot
render();
updateScore();
