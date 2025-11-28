/* =================================================================== */
/* BASE DE DONNÉES SIMULÉE (POUR LE PFE)                 */
/* =================================================================== */
/* Dans un vrai projet, ces données viendraient d'un serveur.
    Pour votre PFE, nous les mettons directement ici.
    Les images sont des placeholders (liens génériques).
*/

// Étape 1 : Définir les médicaments
const dbMedicaments = {
    "med1": {
        id: "med1",
        dci: "FUROSÉMIDE",
        nomCommercial: "Lasilix",
        image: ""
    },
    "med2": {
        id: "med2",
        dci: "OMÉPRAZOLE",
        nomCommercial: "Losec",
        image: "https://via.placeholder.com/150/0000FF/FFFFFF?text=Losec+20mg"
    },
    "med3": {
        id: "med3",
        dci: "HYDRALAZINE",
        nomCommercial: "Hydralazine",
        image: "https://via.placeholder.com/150/00FF00/000000?text=Hydralazine"
    },
    "med4": {
        id: "med4",
        dci: "HYDROXYZINE",
        nomCommercial: "Atarax",
        image: "https://via.placeholder.com/150/FFFF00/000000?text=Atarax+25mg"
    },
    "med5": {
        id: "med5",
        dci: "DOPAMINE",
        nomCommercial: "Dopamine",
        image: "https://via.placeholder.com/150/FF00FF/FFFFFF?text=DOPAMINE"
    },
    "med6": {
        id: "med6",
        dci: "DOBUTAMINE",
        nomCommercial: "Dobutamine",
        image: "https://via.placeholder.com/150/00FFFF/000000?text=DOBUTAMINE"
    }
    // Ajoutez ici d'autres médicaments que vous trouvez en Tunisie
};

// Étape 2 : Définir les paires LASA
const dbLasaPaires = [
    {
        paireId: "paire1",
        medA_id: "med1", // Lasilix
        medB_id: "med2", // Losec
        typeConfusion: "Emballage et Sonorité",
        descriptionRisque: "Risque de confusion élevé entre Lasilix (Diurétique) et Losec (IPP). Les emballages peuvent se ressembler."
    },
    {
        paireId: "paire2",
        medA_id: "med3", // Hydralazine
        medB_id: "med4", // Hydroxyzine (Atarax)
        typeConfusion: "Phonétique/Orthographique",
        descriptionRisque: "Risque de confusion majeur à l'oral et à l'écrit entre Hydralazine (Vasodilatateur) et Hydroxyzine (Anxiolytique)."
    },
    {
        paireId: "paire3",
        medA_id: "med5", // Dopamine
        medB_id: "med6", // Dobutamine
        typeConfusion: "Phonétique et rangement",
        descriptionRisque: "Confusion critique entre deux catécholamines aux effets différents (Dopamine vs Dobutamine). Souvent rangées côte à côte."
    }
    // Ajoutez ici d'autres paires
];


/* =================================================================== */
/* LOGIQUE DE NAVIGATION DES MODULES                   */
/* =================================================================== */

function showModule(moduleId) {
    // 1. Cacher tous les modules
    document.querySelectorAll('.module').forEach(module => {
        module.classList.remove('active');
    });
    
    // 2. Afficher seulement le module cliqué
    document.getElementById(moduleId).classList.add('active');
}


/* =================================================================== */
/* MODULE 1 : LOGIQUE DE VÉRIFICATION                  */
/* =================================================================== */

function verifierLasa() {
    const inputPrescrit = document.getElementById('medPrescrit').value.trim().toLowerCase();
    const inputPrepare = document.getElementById('medPrepare').value.trim().toLowerCase();
    const resultatBox = document.getElementById('resultatVerification');
    
    if (inputPrescrit === "" || inputPrepare === "") {
        resultatBox.className = 'resultat-box alerte';
        resultatBox.innerHTML = "Veuillez saisir les deux noms de médicaments à comparer.";
        return;
    }
    
    let risqueTrouve = null;
    
    // On parcourt la base de données des paires LASA
    for (const paire of dbLasaPaires) {
        const medA = dbMedicaments[paire.medA_id];
        const medB = dbMedicaments[paire.medB_id];
        
        // Normaliser les noms de la BDD pour la comparaison
        const nomsMedA = [medA.dci.toLowerCase(), medA.nomCommercial.toLowerCase()];
        const nomsMedB = [medB.dci.toLowerCase(), medB.nomCommercial.toLowerCase()];
        
        // Vérifier si les inputs correspondent à la paire (dans n'importe quel ordre)
        if ( (nomsMedA.includes(inputPrescrit) && nomsMedB.includes(inputPrepare)) ||
             (nomsMedA.includes(inputPrepare) && nomsMedB.includes(inputPrescrit)) ) {
            risqueTrouve = paire.descriptionRisque;
            break; // On a trouvé un risque, on arrête de chercher
        }
    }
    
    // Afficher le résultat
    if (risqueTrouve) {
        resultatBox.className = 'resultat-box alerte';
        resultatBox.innerHTML = `🚨 <strong>ALERTE DE SÉCURITÉ LASA !</strong><br>${risqueTrouve}`;
    } else {
        resultatBox.className = 'resultat-box succes';
        resultatBox.innerHTML = `✅ Aucun risque LASA majeur identifié dans la base. <br>Procédez toujours au contrôle des 6 BONS.`;
    }
}


/* =================================================================== */
/* MODULE 2 : LOGIQUE DE SIGNALEMENT                   */
/* =================================================================== */

function soumettreSignalement() {
    const med1 = document.getElementById('medConfus1').value;
    const med2 = document.getElementById('medConfus2').value;
    const typeIncident = document.querySelector('input[name="typeIncident"]:checked').value;
    const cause = document.getElementById('causeConfusion').value;
    const resultatBox = document.getElementById('resultatSignalement');
    
    if (med1 === "" || med2 === "") {
        resultatBox.className = 'resultat-box alerte';
        resultatBox.innerHTML = "Veuillez remplir au moins les deux noms de médicaments.";
        return;
    }
    
    // --- SIMULATION D'ENVOI À LA BASE DE DONNÉES ---
    // Dans un vrai projet, on enverrait ces données à un serveur.
    // Pour le PFE, on affiche juste un succès et on logue en console.
    console.log("Nouveau signalement (anonyme) :");
    console.log({ med1, med2, typeIncident, cause });
    // --- FIN DE LA SIMULATION ---
    
    resultatBox.className = 'resultat-box succes';
    resultatBox.innerHTML = "Signalement enregistré. Merci pour votre contribution à la sécurité !";
    
    // Vider le formulaire
    document.getElementById('formSignalement').reset();
}


/* =================================================================== */
/* MODULE 3 : LOGIQUE DU QUIZ                         */
/* =================================================================== */

// Base de données des questions du Quiz
const quizQuestions = [
    {
        question: "Quelle paire représente le risque de confusion LASA le plus critique aux urgences ?",
        options: ["Paracétamol / Ibuprofène", "Dopamine / Dobutamine", "Sérum Salé / Sérum Glucosé"],
        correct: "Dopamine / Dobutamine"
    },
    {
        question: "Le médecin prescrit 'Atarax' pour un patient anxieux. Vous lisez 'Hydralazine'. Quel est le risque ?",
        options: ["Risque d'allergie", "Risque d'hypotension sévère", "Risque de sédation excessive"],
        correct: "Risque d'hypotension sévère"
    },
    {
        question: "La stratégie 'Tall Man Lettering' (ex: hydrOXYzine / hydrALAZINE) sert à :",
        options: ["Augmenter la taille de la police", "Mettre en majuscules les lettres qui diffèrent", "Utiliser uniquement des majuscules"],
        correct: "Mettre en majuscules les lettres qui diffèrent"
    }
];

let currentQuestionIndex = 0;
let quizScore = 0;

function startQuiz() {
    currentQuestionIndex = 0;
    quizScore = 0;
    document.getElementById('quizResultat').innerHTML = "";
    document.getElementById('quizResultat').className = "resultat-box";
    document.getElementById('quizButton').style.display = 'none';
    showQuizQuestion();
}

function showQuizQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        showQuizResult();
        return;
    }
    
    const q = quizQuestions[currentQuestionIndex];
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = ""; // Vider le conteneur
    
    const questionElement = document.createElement('div');
    questionElement.className = 'quiz-question';
    questionElement.innerText = `${currentQuestionIndex + 1}. ${q.question}`;
    quizContainer.appendChild(questionElement);
    
    q.options.forEach(option => {
        const optionLabel = document.createElement('label');
        optionLabel.className = 'quiz-option';
        
        const optionInput = document.createElement('input');
        optionInput.type = 'radio';
        optionInput.name = 'quizOption';
        optionInput.value = option;
        
        optionLabel.appendChild(optionInput);
        optionLabel.appendChild(document.createTextNode(` ${option}`));
        quizContainer.appendChild(optionLabel);
    });
    
    const submitButton = document.createElement('button');
    submitButton.className = 'action-button';
    submitButton.innerText = "Valider la réponse";
    submitButton.onclick = submitQuizAnswer;
    quizContainer.appendChild(submitButton);
}

function submitQuizAnswer() {
    const selectedOption = document.querySelector('input[name="quizOption"]:checked');
    if (!selectedOption) {
        alert("Veuillez choisir une réponse.");
        return;
    }
    
    if (selectedOption.value === quizQuestions[currentQuestionIndex].correct) {
        quizScore++;
    }
    
    currentQuestionIndex++;
    showQuizQuestion();
}

function showQuizResult() {
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = "<p>Quiz terminé !</p>";
    
    const resultatBox = document.getElementById('quizResultat');
    resultatBox.className = 'resultat-box succes';
    resultatBox.innerHTML = `Votre score : ${quizScore} / ${quizQuestions.length}`;
    
    document.getElementById('quizButton').style.display = 'block';
    document.getElementById('quizButton').innerText = "Recommencer le Quiz";
}


/* =================================================================== */
/* MODULE 4 : LOGIQUE DE LA BIBLIOTHÈQUE               */
/* =================================================================== */

// Fonction pour charger la bibliothèque au démarrage
function loadBibliotheque() {
    const biblioContainer = document.getElementById('biblioContainer');
    biblioContainer.innerHTML = ""; // Vider pour éviter les doublons
    
    if (dbLasaPaires.length === 0) {
        biblioContainer.innerHTML = "<p>La base de données LASA est vide.</p>";
        return;
    }
    
    // Créer une "carte" HTML pour chaque paire
    dbLasaPaires.forEach(paire => {
        const medA = dbMedicaments[paire.medA_id];
        const medB = dbMedicaments[paire.medB_id];
        
        const card = document.createElement('div');
        card.className = 'lasa-card';
        card.innerHTML = `
            <div class="lasa-med med-a">
                <img src="${medA.image}" alt="${medA.nomCommercial}">
                <h4>${medA.nomCommercial}</h4>
                <p>(DCI: ${medA.dci})</p>
            </div>
            <div class="lasa-med med-b">
                <img src="${medB.image}" alt="${medB.nomCommercial}">
                <h4>${medB.nomCommercial}</h4>
                <p>(DCI: ${medB.dci})</p>
            </div>
            <div class="lasa-card-info">
                <strong>Type de confusion :</strong> ${paire.typeConfusion}<br>
                <strong>Description du Risque :</strong> ${paire.descriptionRisque}
            </div>
        `;
        biblioContainer.appendChild(card);
    });
}

// Fonction pour filtrer la bibliothèque (connectée à l'input de recherche)
function filtrerBiblio() {
    const filtre = document.getElementById('rechercheBiblio').value.toLowerCase();
    const cards = document.querySelectorAll('.lasa-card');
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(filtre)) {
            card.style.display = "flex"; // "flex" car c'est le display de base de la carte
        } else {
            card.style.display = "none"; // Cacher la carte
        }
    });
}


/* =================================================================== */
/* INITIALISATION DE LA PAGE                         */
/* =================================================================== */

// Cette fonction s'exécute quand la page est entièrement chargée
window.onload = () => {
    // Affiche le premier module par défaut
    showModule('module1');
    // Charge la bibliothèque en arrière-plan
    loadBibliotheque();
};