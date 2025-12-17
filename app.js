// ===== VARIABLES =====
const questionsEL = document.getElementById("questions");
const totalScoreEl = document.getElementById("totalScore");
const emailLink = document.getElementById("emailLink");
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzoM2xrxrZzSP6HAdVrYrzT4i-UaUIiCgYhg7tTNh_N48_o-cTHND1s_1vNIcxucMMQ/exec";


// ===== QUESTIONS =====
const questions = [
    {id: 1, text: "Leadership actively communicates and promotes the importance of a positive food safety and quality culture."},
    {id: 2, text: "Leadership recognises and rewards those people who have embraced good practices surrounding our food safety and quality culture."},
    {id: 3, text: "How often do you perform internal food safety audits? 1 - 5 = 1 Annually to 5 Monthly"},
    {id: 4, text: "Our organisation knows how effective our porcess are in delivering safe quality products."},
    {id: 5, text: "We track and analyse trends in food safety / quality control incidents and near misses."},
    {id: 6, text: "How often do food operators report potential / actual hazards or near misses? 5 = 1 Annually to 5 Daily."},
    {id: 7, text: "Our organisation has determined and selected opportunities to improve the suitability, adequacy and effectiveness of our food safety and quality culture."},
    {id: 8, text: "Our induction process covers the importance and content of a positive food safety and quality culture very well."},
    {id: 9, text: "The internal and external issues that may impact our food safety and quality culture have been risk assessed and muitigated to a high standard."},
    {id: 10, text: "I am confident that all of our outsourced processes are controlled not to bring additional risks to the food safety and quality of our products."},
    {id: 11, text: "Enought budget is allocated to tecnical / operational teams so that the proudction area can be maintained to a high standard, non-conformities can be remedied, potential hazards removed and all staff can be trained to a high standard."},
    {id: 12, text: "Accurate documented evidence is continually filled out and kept up to date, demonstrating that processes have been carried out as planned in documented policy and procedure."},
    {id: 13, text: "Operators always have adequate time to perform tasks without choosing between maintaining good food safety / quality practices and getting orders out on time."},
    {id: 14, text: "Staff at all levels are actively encouraged to suggest improvements to encourage better food safety and quality outcomes."},
    {id: 15, text: "Messages concerning food safety and quality culture are constructed well and frequently communicated across the entire organisation."},
    {id: 16, text: "I am confident that all staff take communication concerning food safety and quality culture seriously, and that the content of these messages is understood by all staff."},
    {id: 17, text: "Site visitors and suppliers are required to follow site safety and quality procedures. This is always well understood and followed by these site visitors."},
    {id: 18, text: "When dealing with customer complaints and satisfaction, root cause analysis is performed appropriately."},
    {id: 19, text: "Does your organisation have food safety and quality culture champions?"},
    {id: 20, text: "Does a member of top management / directorship own all non-conformities picked up at audit?"},
    {id: 21, text: "Are food safety and quality a regular permanent item on senior management meetings, and is this item always discussed (not postponed / cancelled if other items overrun)."},
    {id: 22, text: "Do top leadership (i.e. CEO) ever walk the line and engage with where incidents / non-conformities have taken place to see that mitigating actions have been put into place to prevent recurrence?"}, 
    {id: 23, text: "Leadership actively communicates and promotes the importance of a positive food safety and quality culture."},
];


// ===== LIKERT SCALE =====
const likert = [
    { label: "Strongly disagree", value: 1 },
    { label: "Disagree",  value: 2 },
    { label: "Not sure",  value: 3 },
    { label: "Agree",  value: 4 },
    { label: "Strongly agree", value: 5 },
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
        cells.className = "qchoices";

        for(const opt of likert) {
            const wrap = document.createElement("label");
            wrap.className = "choice";

            const input = document.createElement("input");
            input.type = "radio";
            input.name = `q${q.id}`;
            input.value = String(opt.value);
            input.dataset.qid = String(q.id);
            input.addEventListener("change", updateScore);
            
            const dot = document.createElement("span");
            dot.className = "dot";

            // Accessible lable (screen readers) but not visually repeated
            const sr = document.createElement("span");
            sr.className = "sr-only";
            sr.textContent = opt.label;

            wrap.appendChild(input);
            wrap.appendChild(dot);
            wrap.appendChild(sr);

            cells.appendChild(wrap);
        }

        row.appendChild(qtext);
        row.appendChild(cells);
        questionsEL.appendChild(row);
    }
}


// ===== UPDATE SCORE =====
function updateScore () {
    let total = 0;

    for(const q of questions) {
        const chosen = document.querySelector(`input[name="q${q.id}"]:checked`);
        if(chosen) total += Number(chosen.value);
    }

    totalScoreEl.textContent = String(total);

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim() || "admin@corecompliance.biz";
    const trainer = document.getElementById("trainer").value.trim();
    const site = document.getElementById("site").value.trim();

    const subject = encodeURIComponent("Food Safety Culture Self-Assessment Results");
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nTotal Score: ${total}\n`);
    emailLink.href = `mailto:${email}?subject=${subject}&body=${body}`;
}


// ===== RESET BUTTON =====
document.getElementById("resetBtn").addEventListener("click", () => {
  // clear text/email inputs
  document.querySelectorAll("input[type='text'], input[type='email']").forEach(i => {
    i.value = "";
  });

  // clear all likert radios
  document.querySelectorAll("input[type='radio']").forEach(r => {
    r.checked = false;
  });

  totalScoreEl.textContent = "0";
  updateScore();
});


// ===== SUBMIT BUTTON =====
document.getElementById("submitBtn").addEventListener("click", async () => {
    
    // 1. Validate required fields
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const trainer = document.getElementById("trainer").value.trim();
    const site = document.getElementById("site").value.trim();

    if(!name || !email || !trainer || !site) {
        alert("Please fill in Name, Email, Trainer Name, and Site.");
        return;
    }

    // 2. Force all questions answered
    for (const q of questions) {
        const chosen = document.querySelector(`input[name="q${q.id}"]:checked`);
        if(!chosen) {
            alert(`Please answer Question ${q.id}.`);
            return;
        }
    }

    // 3. Build answers array Q1...q23
    const answers = questions.map(q => {
        const chosen = document.querySelector(`input[name="q${q.id}"]:checked`);
        return chosen ? Number(chosen.value) : "";
    });

    // 4. Total score (already calculated on screen)
    const totalScore = Number(totalScoreEl.textContent || 0);

  const payload = {
    name,
    email,
    trainer,
    site,
    totalScore,
    answers
  };


  // 5) Submit to Google Apps Script
  try {
    const btn = document.getElementById("submitBtn");
    btn.disabled = true;
    btn.textContent = "SUBMITTING...";

    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    const json = await res.json();

    if (json.ok) {
      alert("Submitted successfully!");

      // Optional: reset after submit
      document.getElementById("resetBtn").click();
    } else {
      alert("Submit failed. Please try again.");
    }

btn.disabled = false;
    btn.textContent = "SUBMIT";
  } catch (err) {
    console.error(err);
    alert("Could not submit (internet or URL issue).");
    const btn = document.getElementById("submitBtn");
    btn.disabled = false;
    btn.textContent = "SUBMIT";
  }
});

    
render();
updateScore();