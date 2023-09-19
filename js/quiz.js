/**
 * Add actions to page buttons 
 */
function addButtonActions() {
    var startButton = document.getElementById('button-start');
    var loginButton = document.getElementById('button-login');
    var questionsButton = document.getElementById('button-questions');
    var LeaderbordButton1 = document.getElementById('button-leaderbord1');
    var LeaderbordButton = document.getElementById('button-leaderbord');
    var quitButton = document.getElementById('button-quit');
    var leaderbordquitButton = document.getElementById('button-leaderbordquit');

    startButton.addEventListener("click", function() {
        showLoginPage();
    });
    loginButton.addEventListener("click", function() {
        const studentnummer = document.getElementById('studentnummer').value;
        console.log(studentnummer);
        if (studentnummer !== "") {
            var regex = /^(s|p|[a-z]{2})(\d{7})$/g;
            var valideer = studentnummer.match(regex);
            console.log(valideer);
            if (valideer == null) {
                const err = document.getElementById('error')
                err.innerText = 'Studentnummer moet tenminste èèn "s" en 7 characters bevatten of Leraarnummer moet tenminste een "p" en 7 characters bevatten';
            } else {
                checkStudent(studentnummer);

            }

        } else {
            // mag niet leeg zijn 
            const err = document.getElementById('error')
            err.innerText = 'studentnummer mag niet leeg.';
        }
    });
    questionsButton.addEventListener("click", function() {
        showQuestionsPage();
        startTimer();
    });
    LeaderbordButton.addEventListener("click", function() {
        showLeaderbordPage();
        leaderboard();
    });
    LeaderbordButton1.addEventListener("click", function() {
        showLeaderbordPage();
        leaderboard();
    });
    quitButton.addEventListener("click", function() {


        location.reload();
    });
    leaderbordquitButton.addEventListener("click", function() {


        location.reload();
    });

}



/**
 * Hide all pages
 */
function hideAllPages() {
    var landingPage = document.getElementById('page-landing');
    var startPage = document.getElementById('page-start');
    var loginPage = document.getElementById('page-login');
    var questionsPage = document.getElementById('page-questions');
    var ResultatenPage = document.getElementById('page-resultaten');
    var LeaderbordPage = document.getElementById('page-leaderbord');

    landingPage.style.display = 'none';
    startPage.style.display = 'none';
    loginPage.style.display = 'none';
    questionsPage.style.display = 'none';
    ResultatenPage.style.display = 'none';
    LeaderbordPage.style.display = 'none';
}
/**
 * Show Landing page
 */
function showLandingPage() {
    var page = document.getElementById('page-landing');

    hideAllPages();

    page.style.display = 'block';

    console.info('Je bent nu op de Landingpagina');
}


/**
 * Show start page
 */
function showLoginPage() {
    var page = document.getElementById('page-login');

    hideAllPages();

    page.style.display = 'block';

    console.info('Je bent nu op de loginpagina');

}

function showStartPage() {
    var page = document.getElementById('page-start');

    hideAllPages();

    page.style.display = 'block';

    console.info('Je bent nu op de startpagina');
}



/**
 * Show questions page
 */
function showQuestionsPage() {
    var page = document.getElementById('page-questions');

    hideAllPages();

    page.style.display = 'block';

    console.info('Je bent nu op de vragenpagina');
    showVragen(0); //roept showQestions function
    vragenTeller(1); //stuurt 1 parameter naar vragenTeller
    next_btn.classList.remove("show"); //hide the next button
}
/**
 * Show questions page
 */
function showResultatenPage() {
    var page = document.getElementById('page-resultaten');

    hideAllPages();

    page.style.display = 'block';

    console.info('Je bent nu op de resultatenpagina');
    showResultaten();
    showScore(gebruikerScore);
    stopTimer();

}
/**
 * Show questions page
 */
function showLeaderbordPage() {
    var page = document.getElementById('page-leaderbord');

    hideAllPages();

    page.style.display = 'block';

    console.info('Je bent nu op de LeaderbordPagepagina');

}

/**
 * Check student number using the API
 */
function checkStudent(studentnummer) {
    var xHttp = new XMLHttpRequest();
    xHttp.onreadystatechange = function() {
        if (xHttp.readyState == XMLHttpRequest.DONE) {
            var response = JSON.parse(xHttp.response);
            if (xHttp.status == 200) {
                studentIdentificationSucces(response);
            } else {
                studentIdentificationFailed(response);
            }
        }
    };
    xHttp.onerror = function() {
        studentIdentificationFailed(xHttp.statusText);
    };
    xHttp.open("GET", "https://quiz.clow.nl/v1/student/" + studentnummer, true);
    xHttp.send();
}

/**
 * Student is successfully identified
 */
function studentIdentificationSucces(student) {

    const studentdata = Object.values(student);
    console.info(student); // Een Javascript-object met studentnummer, voornaam en achternaam
    // console.log(naam[1]);
    globalThis.studentnummer = studentdata[0];
    var voornaam = studentdata[1];
    globalThis.achternaam = studentdata[2];
    const gebruiker = document.getElementById('naam');
    gebruiker.innerText = voornaam;

    // Schrijf hier de code die uitgevoerd moet worden als het studentnummer klopt
    showStartPage();
}

/**
 * Student number is incorrect
 */
function studentIdentificationFailed(errorMessage) {

    const err = document.getElementById('error')
    err.innerText = "De studentnummer bestaat niet";
    console.error(errorMessage);

    // Schrijf hier de code die uitgevoerd moet worden als het studentnummer NIET klopt
}
/**
 * Sends score of the player to the Quiz-API.
 * @param student Student number of player
 * @param points Points of player
 */
quizMasterCode = "s1175134";

function sendScore(studentnummer, gebruikerScore, time) {
    var xHttp = new XMLHttpRequest();
    console.log("tijd = " + totalenSeconden);

    xHttp.onreadystatechange = function() {
        if (xHttp.readyState == XMLHttpRequest.DONE) {
            if (xHttp.status == 200) {
                console.info("Score succesvol opgeslagen");

                var apiScore = document.getElementById('score_opgestuurd')
                apiScore.innerText = "Score succesvol opgeslagen";

            } else {
                console.error("Score niet succesvol opgeslagen");
            }
        }
    };

    xHttp.onerror = function() {
        console.error("Score niet succesvol opgeslagen");
    };

    xHttp.open("POST", "https://quiz.clow.nl/v1/score", true);
    xHttp.setRequestHeader('Content-Type', 'application/json');
    xHttp.send(JSON.stringify({
        quizMaster: quizMasterCode,
        student: studentnummer,
        points: gebruikerScore,
        time: totalenSeconden
    }));
}
/**
 * LEADERBOARD FUNCTION
 */
function leaderboard() {
    var xHttp = new XMLHttpRequest();
    xHttp.onreadystatechange = function() {
        if (xHttp.readyState == XMLHttpRequest.DONE) {
            var spelers = JSON.parse(xHttp.response);
            if (xHttp.status == 200) {
                console.log(spelers);
                showLeaderbord(spelers);
            } else {
                const error_message = document.getElementById("leaderboard-title");
                error_message.innerHTML = `<p class="score_error">Leaderboard kon niet geladen worden.</p>`;
            };
        }
    };

    xHttp.open("GET", "https://quiz.clow.nl/v1/highscores/s1175134", true);
    xHttp.send();
}

function showLeaderbord(spelers) {

    // if (spelers[o].hasOwnProperty("time")) {
    //     console.log(spelers[o].player.number + " | " + spelers[o].player.firstName + " " + spelers[o].player.lastName + " | P: " + spelers[o].points + " | S: " + spelers[o].time);
    //     console.log("speler heeft tijd")
    //     console.log(spelers[o].hasOwnProperty("time"))
    // } else {
    //     console.log("geen tijd")
    //     console.log(spelers[o].player.hasOwnProperty("time"))
    // }
    //


    let NullTijdSpelers = spelers.filter(spelers => spelers.time !== null);
    console.log(NullTijdSpelers);
    let tijdSpelers = NullTijdSpelers.filter(spelers => spelers.time > 5);
    console.log(tijdSpelers);
    let sorteerTijdSpelers = tijdSpelers.sort((c1, c2) => (c1.time > c2.time) ? 1 : (c1.time < c2.time) ? -1 : 0);
    console.log(sorteerTijdSpelers);
    let sorteerSpelers = sorteerTijdSpelers.sort((c1, c2) => (c1.points < c2.points) ? 1 : (c1.points > c2.points) ? -1 : 0);
    console.log(sorteerSpelers);
    let text = "";
    let o = 1;
    for (let i = 0; i < 10; i++) {

        console.log(sorteerSpelers[i].player.number + " | " + sorteerSpelers[i].player.firstName + " " + sorteerSpelers[i].player.lastName + " | P: " + sorteerSpelers[i].points + " | S: " + sorteerSpelers[i].time);
        text += " | " + o + "." + sorteerSpelers[i].player.number + " | " + sorteerSpelers[i].player.firstName + " " + sorteerSpelers[i].player.lastName + " | Punten: " + sorteerSpelers[i].points + " | Tijd: " + sorteerSpelers[i].time + "<br>";
        o++;
    }
    document.getElementById("scoreboard").innerHTML = text;
}

const antwoordenlijst = document.querySelector(".antwoordenlijst");

const bottom_vragen_reeks = document.querySelector(".footer_voor_quiz .totalen_vragen");
const headerScore = document.querySelector(".score");

let vragen_teller = 0;
let Vragen_num = 1;
let gebruikerScore = 0;
let reeks;
let reeksLine;

const resultaten_box = document.querySelector(".resultaten_box");
const next_btn = document.querySelector(".footer_voor_quiz .next_btn");
const bottom_ques_counter = document.querySelector("footer_voor_quiz .totalen_vragen");
//timer functie
var minutenSpan = document.getElementById("minuten");
var secondenSpan = document.getElementById("seconden");
var totalenSeconden = 0;

function startTimer() {

    time = setInterval(setTime, 1000);

    function setTime() {
        ++totalenSeconden;
        secondenSpan.innerHTML = pad(totalenSeconden % 60);
        minutenSpan.innerHTML = pad(parseInt(totalenSeconden / 60));

        if (totalenSeconden > 3600) {
            location.reload();
        }
    }

    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    }

}

function stopTimer() {
    clearInterval(time);
}
// als de volgende knop is gedrukt
next_btn.onclick = () => {
    if (vragen_teller < questions.length - 1) { // als de vragen teller hoger is dan de aantal vragen
        vragen_teller++; //vragen teller erbij
        Vragen_num++; //vraag nummer erbij
        showVragen(vragen_teller); //roept call functie
        vragenTeller(Vragen_num); //zet de vraag nummer in vragenteller
        showScore(gebruikerScore);
        clearInterval(reeks); //clear reeks
        clearInterval(reeksLine); //clear reeksLine
        next_btn.classList.remove("show"); //verstopt de volgende knop
    } else {
        clearInterval(reeks); //clear reeks
        clearInterval(reeksLine); //clear reeksLine

        showResultatenPage(); //laat resultatenpagina zien
        // console.log("nummer = " + studentnummer + " " + gebruikerScore)
        sendScore(studentnummer, gebruikerScore, time)
    }
}

function showScore(gebruikerScore) {
    const huidigeScore = document.getElementById('score')
    huidigeScore.innerText = gebruikerScore;


}
// krijgt vragen van vragen array
function showVragen(index) {
    const vragen = document.querySelector(".vragen");

    // maakt een nieuwe span en div tag voor elke vraag , optie en de value doormiddel van array index
    let vragen_tag = '<span>' + questions[index].numb + ". " + questions[index].question + '</span>';
    let antwoordoptie_tag = '<div disabled class="antwoordoptie"><span>' + questions[index].options[0] + '</span></div>' +
        '<div class="antwoordoptie"><span>' + questions[index].options[1] + '</span></div>' +
        '<div class="antwoordoptie"><span>' + questions[index].options[2] + '</span></div>' +
        '<div class="antwoordoptie"><span>' + questions[index].options[3] + '</span></div>';
    vragen.innerHTML = vragen_tag; //voegt een nieuwe span in vragen_tag
    antwoordenlijst.innerHTML = antwoordoptie_tag; //voegt een nieuwe div tag in antwoordenlijst

    const antwoordoptie = antwoordenlijst.querySelectorAll(".antwoordoptie");

    // set onclick attribute to all available options
    for (i = 0; i < antwoordoptie.length; i++) {
        antwoordoptie[i].setAttribute("onclick", "antwoordoptieSelected(this)");
    }
}
// creating the new div tags which for icons
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

//als de gebruiker op een antwoord drukt
function antwoordoptieSelected(answer) {
    clearInterval(reeks); //clear reeks
    clearInterval(reeksLine); //clear reeksLine
    let gebruikerAnt = answer.textContent; //krijgt gebruiker gedrukte optie
    let correctAnt = questions[vragen_teller].answer; //krijgt Goede Antwoord van array
    const allOptions = antwoordenlijst.children.length; //krijgt alle optie items

    if (gebruikerAnt == correctAnt) { //als de gebruiker antwoord zelfde is als array Goede Antwoord
        gebruikerScore += 1; //voegt score met 1 bij
        answer.classList.add("correct"); //groene kleur
        answer.insertAdjacentHTML("beforeend", tickIconTag); //voegt groene tikje toe
        console.log("Goede Antwoord");
        console.log("Jouw score = " + gebruikerScore);
    } else {
        answer.classList.add("incorrect"); //roode kleur
        answer.insertAdjacentHTML("beforeend", crossIconTag); //voegt rode kruisje
        console.log("Foute Antwoord");

        for (i = 0; i < allOptions; i++) { //laat de goede antwoord zien
            if (antwoordenlijst.children[i].textContent == correctAnt) { //als er een zelfde antwoord/optie matcht met array antwoord
                antwoordenlijst.children[i].setAttribute("class", "antwoordoptie correct"); //voegt groene tickje toe
                antwoordenlijst.children[i].insertAdjacentHTML("beforeend", tickIconTag); //voegt groen
                console.log("Automatisch het goede antwoord selecteren.");
            }
        }
    }
    for (i = 0; i < allOptions; i++) {
        antwoordenlijst.children[i].classList.add("disabled"); //nadat de gebruiker antwoordt heeft gedrukt niet meer de andere antwoord kunnen indrukken


    }

    next_btn.classList.add("show"); //laat de volgende knop zien zodra er op een antwoord is gedrukt
}

function vragenTeller(index) {
    //creating a new span tag and passing the question number and total question
    let totalenVragenTeller = '<span>' + index + ' van de ' + questions.length + ' vragen </span>';
    bottom_vragen_reeks.innerHTML = totalenVragenTeller; //adding new span tag inside bottom_vragen_reeks
}


function showResultaten() {
    const scoreText = resultaten_box.querySelector(".score_text");

    if (gebruikerScore > 8) { // als gebruiker meer dan 8 heeft
        // span gebruiker einde van de quiz tekst
        let scoreTag = '<span>WAUWW!!! , Jij hebt ' + gebruikerScore + ' van de ' + questions.length + ' jij raakt sowieso geen gras aan. </span>';
        scoreText.innerHTML = scoreTag; //voeft nieuwe span op pagina
    } else if (gebruikerScore > 7) { // als gebruiker meer dan 7 heeft
        let scoreTag = '<span>Nice, Jij hebt ' + gebruikerScore + ' van de ' + questions.length + ' goed gedaan.</span>';
        scoreText.innerHTML = scoreTag;
    } else if (gebruikerScore > 5) { // als gebruiker meer dan 5 heeft
        let scoreTag = '<span>Goed gedaan , Jij hebt ' + gebruikerScore + ' van de ' + questions.length + ' jij weet je dingen.</span>';
        scoreText.innerHTML = scoreTag;
    } else if (gebruikerScore > 3) { // als gebruiker meer dan 3 heeft
        let scoreTag = '<span>EEUHHH... , Jij hebt ' + gebruikerScore + ' van de ' + questions.length + ' je hebt het ten minste geprobeerd.</span>';
        scoreText.innerHTML = scoreTag;
    } else if (gebruikerScore > 1) { // als gebruiker meer dan 1 heeft
        let scoreTag = '<span>Domme likkie , Jij hebt  ' + gebruikerScore + ' van de ' + questions.length + ' ga de wereld verkennen dombo.</span>';
        scoreText.innerHTML = scoreTag;
    } else { // als gebruiker minder dan 1 heeft
        let scoreTag = '<span>Te dom voor woorden, Jij hebt ' + gebruikerScore + ' van de ' + questions.length + ' zelfs met gokken kan je een betere scoren halen.</span>';
        scoreText.innerHTML = scoreTag;
    }
}

// Initialize
addButtonActions();
showLandingPage();