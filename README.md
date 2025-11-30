<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>MED-SAFE TN — VigiLASA (Enhanced)</title>
    <meta name="description" content="VigiLASA — Prototype final avec base MEDS complète, images réelles et quiz." />
    <meta name="theme-color" content="#0B3D91">
    
    <!-- Add Fuse.js for fuzzy matching -->
    <script src="https://cdn.jsdelivr.net/npm/fuse.js@6.6.2"></script>
    
    <style>
        /* --- STYLES CRITIQUES --- */
        *{box-sizing:border-box;}
        html,body{height:100%;margin:0;font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;background:#f6f8fb;color:#0c1320; transition: background .3s, color .3s;}
        a{color:inherit;text-decoration:none}
        
        /* Accessibilité */
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
        
        /* Focus amélioré */
        button:focus, input:focus, select:focus, textarea:focus {
            outline: 2px solid #0B3D91;
            outline-offset: 2px;
        }
        
        /* États de chargement */
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        .loading {
            position: relative;
            color: transparent;
        }
        
        .loading::after {
            content: "";
            position: absolute;
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            left: 50%;
            top: 50%;
            margin-left: -8px;
            margin-top: -8px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* --- Style Original Conservé --- */
        .container{max-width:1200px;margin:20px auto;padding:18px;transition:opacity .25s; opacity:0; pointer-events:none; visibility:hidden;}
        .container.active{opacity:1; pointer-events:auto; visibility:visible;}
        header{display:flex;align-items:center;gap:16px}
        .brand{display:flex;flex-direction:column}
        h1{margin:0;font-size:20px;color:#0B3D91}
        .subtitle{color:#555;font-size:13px}
        nav{margin-left:auto;display:flex;gap:8px;flex-wrap:wrap}
        button.btn{background:#0B3D91;color:#fff;border:0;padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:500; transition: background .3s, color .3s;}
        button.ghost{background:transparent;border:1px solid #0B3D91;color:#0B3D91;padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:500; transition: background .3s, color .3s, border .3s;}
        main{display:grid;grid-template-columns:1fr 420px;gap:20px;margin-top:20px;}
        .card{background:#fff;border-radius:10px;padding:16px;box-shadow:0 2px 14px rgba(12,22,36,0.06); transition: background .3s, box-shadow .3s}
        .search-box{display:flex;gap:8px;margin-bottom:12px;margin-top:10px;}
        input[type="search"], input[type="text"], textarea, select{flex:1;padding:10px;border-radius:8px;border:1px solid #e6e9ef;font-size:15px;width:100%; transition: background .3s, color .3s, border .3s;}
        .small{font-size:13px;color:#666; transition: color .3s}
        .lasawarning{background:#fff5f5;border:1px solid #ffb3b3;color:#8a0b0b;padding:10px;border-radius:8px;margin-top:10px; transition: background .3s, border .3s, color .3s;}
        .ok{background:#f4fff7;border:1px solid #b9f0c7;color:#0a6a2a;padding:10px;border-radius:8px;margin-top:10px; transition: background .3s, border .3s, color .3s;}
        .med-list{display:flex;flex-direction:column;gap:8px;margin-top:8px}
        .med-item{display:flex;gap:12px;align-items:center;padding:10px;border-radius:8px;border:1px solid #f0f3f8; transition: border .3s}
        .med-item img{width:96px;height:64px;object-fit:cover;border-radius:6px;background:#fff}
        label{display:block;margin-bottom:6px;font-weight:600}
        footer{margin-top:30px;text-align:center;color:#777;font-size:13px; transition: color .3s}
        .badge{display:inline-block;padding:4px 8px;border-radius:999px;background:#eef5ff;color:#0b3d91;font-weight:600;font-size:12px; transition: background .3s, color .3s}
        .stats{display:flex;gap:10px;margin-bottom:12px}
        .stat{flex:1;background:#f7fbff;border:1px solid #e6f0ff;padding:12px;border-radius:8px;text-align:center; transition: background .3s, border .3s}
        table{width:100%;border-collapse:collapse;margin-top:8px}
        th,td{padding:8px;border-bottom:1px solid #eee;text-align:left;font-size:14px; transition: border-bottom .3s}
        .resultat-box{margin-top:10px;padding:10px;border-radius:8px;background:#f8f9fb;border:1px solid #eef2f8; transition: background .3s, border .3s}
        .controls{display:flex;gap:8px;flex-wrap:wrap}
        .overlay{position:fixed;inset:0;background:rgba(3,8,18,0.5);display:flex;align-items:center;justify-content:center;z-index:9999}
        .overlay-box{width:760px;max-width:95%;background:#fff;border-radius:10px;padding:16px;box-shadow:0 10px 40px rgba(2,6,23,0.25); transition: background .3s, box-shadow .3s}
        .high{border-left:4px solid #d94b4b;padding-left:10px}
        .section-title{display:flex;align-items:center;justify-content:space-between}
        .columns{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        @media(max-width:1100px){ main{grid-template-columns:1fr} nav{justify-content:center;margin:10px 0 0 0} }
        .muted{color:#666;font-size:13px; transition: color .3s}
        
        /* Styles pour la recherche par caméra */
        #cameraVideo, #previewImage {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            background: #000;
        }
        .camera-container {
            text-align: center;
            margin: 20px 0;
        }
        .camera-controls {
            display: flex;
            gap: 8px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 15px;
        }
        
        /* login overlay */
        #login-container{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#f6f8fb;z-index:10000; transition: background .3s}
        #login-box{max-width:380px;width:92%;padding:22px}
        #login-container.hidden{opacity:0;visibility:hidden;pointer-events:none; transition: opacity .25s, visibility 0s .25s}

        /* Admin specific styles */
        .admin-only { display: none; }
        .user-admin .admin-only { display: block; }
        .role-badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 11px;
            margin-left: 8px;
            background: #0B3D91;
            color: white;
        }
        .user-admin .role-badge { background: #d94b4b; }
        
        /* Quiz explanation styles */
        .quiz-explanation {
            margin-top: 10px;
            padding: 10px;
            background: #f0f8ff;
            border-radius: 6px;
            font-size: 13px;
        }
        
        /* Notification styles */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 16px;
            border-radius: 8px;
            background: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            max-width: 350px;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        }
        .notification.show {
            transform: translateX(0);
        }
        .notification.warning {
            border-left: 4px solid #d94b4b;
        }
        .notification.success {
            border-left: 4px solid #0a6a2a;
        }
        .notification.info {
            border-left: 4px solid #0B3D91;
        }

        /* --- OPTIMISATION MOBILE --- */
        @media(max-width:768px){ 
            header { flex-direction: column; align-items: flex-start; }
            nav { margin: 10px 0 0 0; justify-content: space-between; width: 100%; }
            nav button { flex-grow: 1; }
            .container { margin: 10px auto; padding: 10px; }
            main { grid-template-columns: 1fr; }
            .search-box { flex-direction: column; }
            .med-item img { width: 70px; height: 48px; }
            .stats { flex-wrap: wrap; }
            .stat { flex-basis: calc(50% - 5px); }
            .notification {
                left: 10px;
                right: 10px;
                max-width: none;
            }
        }

        /* --- DARK MODE STYLES --- */
        body[data-theme="dark"] {
            background: #0c1320;
            color: #f6f8fb;
        }
        body[data-theme="dark"] .card {
            background: #1a2333;
            box-shadow: 0 2px 14px rgba(0,0,0,0.4);
        }
        body[data-theme="dark"] h1 {
            color: #4a90e2; 
        }
        body[data-theme="dark"] .subtitle, body[data-theme="dark"] .small, body[data-theme="dark"] .muted, body[data-theme="dark"] footer {
            color: #a0a0a0;
        }
        body[data-theme="dark"] button.btn {
            background: #4a90e2;
        }
        body[data-theme="dark"] button.ghost {
            border: 1px solid #4a90e2;
            color: #4a90e2;
        }
        body[data-theme="dark"] input[type="search"], body[data-theme="dark"] input[type="text"], body[data-theme="dark"] textarea, body[data-theme="dark"] select {
            background: #232c3e;
            border: 1px solid #3d4a5c;
            color: #f6f8fb;
        }
        body[data-theme="dark"] .med-item {
            border: 1px solid #3d4a5c;
        }
        body[data-theme="dark"] .lasawarning {
            background: #451b1b;
            border: 1px solid #7c2d2d;
            color: #ffcccc;
        }
        body[data-theme="dark"] .ok {
            background: #1b4526;
            border: 1px solid #2d7c43;
            color: #ccffdd;
        }
        body[data-theme="dark"] .badge {
            background: #1a2333;
            color: #4a90e2;
        }
        body[data-theme="dark"] .stat {
            background: #1a2333;
            border: 1px solid #3d4a5c;
        }
        body[data-theme="dark"] th, body[data-theme="dark"] td {
            border-bottom: 1px solid #3d4a5c;
        }
        body[data-theme="dark"] .resultat-box {
            background: #1a2333;
            border: 1px solid #3d4a5c;
        }
        body[data-theme="dark"] .high {
            border-left: 4px solid #ff9999;
        }
        body[data-theme="dark"] #login-container {
            background: #0c1320;
        }
        body[data-theme="dark"] .overlay-box {
            background: #1a2333;
        }
        body[data-theme="dark"] .quiz-explanation {
            background: #1a2d42;
        }
        body[data-theme="dark"] .notification {
            background: #1a2333;
            color: #f6f8fb;
        }
    </style>
</head>
<body>
    <div id="login-container">
        <div id="login-box" class="card">
            <div style="text-align:center;margin-bottom:14px">
                <div style="width:64px;height:64px;background:linear-gradient(135deg,#0B3D91,#3B82F6);border-radius:10px;display:inline-flex;align-items:center;justify-content:center;color:white;font-weight:700;margin-bottom:8px">MS</div>
                <h2 style="margin:0;color:#0B3D91">Accès MED-SAFE TN</h2>
                <p class="small">Identification requise — prototype VigiLASA</p>
            </div>
            <form onsubmit="handleLogin(event)">
                <label for="username">Nom d'utilisateur</label>
                <input id="username" type="text" required placeholder="Saisir votre ID" value="medsafe"/>
                <label for="password" style="margin-top:12px">Mot de passe</label>
                <input id="password" type="password" required placeholder="Mot de passe" value="12345"/>
                
                <!-- Role selector for demo purposes -->
                <label for="userRole" style="margin-top:12px">Rôle (Démo)</label>
                <select id="userRole" style="width:100%;padding:10px;border-radius:8px;border:1px solid #e6e9ef;margin-bottom:12px">
                    <option value="user">Utilisateur Standard</option>
                    <option value="admin">Administrateur</option>
                </select>
                
                <div id="login-message" class="lasawarning" style="display:none;margin-top:10px;text-align:center"></div>
                <button class="btn" type="submit" style="width:100%;margin-top:14px">Se connecter</button>
            </form>
        </div>
    </div>

    <div class="container" id="main-content">
        <header>
            <div style="width:50px;height:50px;background:linear-gradient(135deg,#0B3D91,#3B82F6);border-radius:10px;display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:18px">MS</div>
            <div class="brand">
                <h1>MED-SAFE TN <span id="userRoleBadge" class="role-badge">Utilisateur</span></h1>
                <div class="subtitle">VigiLASA — Catalogue complet (LASA & Urgences)</div>
            </div>
            <nav aria-label="principal">
                <button class="btn" id="nav-home" onclick="showSection('home')">Accueil</button>
                <button class="ghost" id="nav-verify" onclick="showSection('verify')">Vérif.</button>
                <button class="ghost" id="nav-report" onclick="showSection('report')">Signalement</button>
                <button class="ghost" id="nav-library" onclick="showSection('library')">Bibliothèque</button>
                <button class="ghost" id="nav-quiz" onclick="showSection('quiz')">Quiz</button>
                <button class="ghost" id="nav-dashboard" onclick="showSection('dashboard')">Dashboard</button>
                <button class="ghost admin-only" id="nav-admin" onclick="showSection('admin')" style="display:none">Admin</button>
                <button class="ghost" onclick="toggleDarkMode()" title="Mode sombre/clair">🌓</button>
            </nav>
        </header>

        <main>
            <div id="main-section">
                <section id="home" class="card">
                    <div class="section-title">
                        <div>
                            <h2 style="margin:0">Recherche Médicament / Détection LASA</h2>
                            <div class="small">Recherche par nom, marque, DCI ou alias — résultats illustrés.</div>
                        </div>
                        <div class="muted">Sources: ANSM, HAS, OPIUM-H.R. TN List</div>
                    </div>

                    <div class="search-box">
                        <input id="searchInput" type="search" placeholder="Ex : Amoxal, Xarelto, Dopamine..." />
                        <button class="btn" onclick="doSearch()">Vérifier</button>
                        <button class="btn" onclick="openCameraSearch()" title="Recherche par caméra">📷</button>
                    </div>

                    <!-- Advanced search options -->
                    <div style="margin-bottom: 10px; display: flex; gap: 10px; align-items: center;">
                        <input type="checkbox" id="fuzzySearch" checked>
                        <label for="fuzzySearch" class="small" style="margin:0">Recherche approximative</label>
                        
                        <input type="checkbox" id="soundSearch">
                        <label for="soundSearch" class="small" style="margin:0">Recherche phonétique</label>
                    </div>

                    <div id="searchResult"></div>

                    <hr style="margin:14px 0;border:none;border-top:1px solid #f0f3f8"/>
                    <h3 style="margin-top:0">Aperçu — Urgences & Haut Risque (extraits)</h3>
                    <div class="med-list" id="medList"></div>
                </section>

                <section id="verify" class="card" style="display:none">
                    <h3>Vérification Double</h3>
                    <p class="small">Compare prescrit / préparé pour risque LASA</p>
                    <label class="small">Médicament prescrit</label>
                    <input id="medPrescrit" type="text" />
                    <label class="small" style="margin-top:8px">Médicament préparé</label>
                    <input id="medPrepare" type="text" />
                    <div style="display:flex;gap:8px;margin-top:10px">
                        <button class="btn" onclick="verifierLasa()">Vérifier</button>
                        <button class="ghost" onclick="clearVerify()">Réinitialiser</button>
                        <button class="ghost" onclick="openQuickPairs()">Paires fréquentes</button>
                    </div>
                    <div id="resultatVerification" class="resultat-box"></div>
                </section>

                <section id="report" class="card" style="display:none">
                    <h3>Signalement</h3>
                    <form id="reportForm" onsubmit="submitReport(event)">
                        <label class="small">Type</label>
                        <select id="incidentType"><option>Erreur d'administration</option><option>Erreur de médicament (LASA)</option><option>Near-miss</option><option>Autre</option></select>
                        <label class="small" style="margin-top:8px">Médicament</label>
                        <input id="reportedDrug" type="text" />
                        <label class="small" style="margin-top:8px">Description</label>
                        <textarea id="reportDesc" rows="4"></textarea>
                        
                        <!-- Critical alert option -->
                        <div style="margin-top: 10px;">
                            <input type="checkbox" id="criticalAlert">
                            <label for="criticalAlert" class="small">Alerte critique (notification)</label>
                        </div>
                        
                        <div style="margin-top:10px;display:flex;gap:8px">
                            <button class="btn" type="submit">Envoyer</button>
                            <button type="button" class="ghost" onclick="resetReport()">Réinitialiser</button>
                        </div>
                        <div id="reportMsg" style="margin-top:8px"></div>
                    </form>
                </section>

                <section id="quiz" class="card" style="display:none">
                    <h3>Quiz — Sécurité LASA</h3>
                    <div id="quizContainer"></div>
                    <div id="quizResult" style="margin-top:12px"></div>
                    <div id="quizProgress" class="small" style="margin-top:10px"></div>
                    
                    <!-- Admin controls for quiz -->
                    <div class="admin-only" style="margin-top: 20px; border-top: 1px solid #f0f3f8; padding-top: 15px;">
                        <h4>Gestion du Quiz (Admin)</h4>
                        <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                            <button class="btn" onclick="openAddQuestion()">Ajouter Question</button>
                            <button class="ghost" onclick="exportQuiz()">Exporter Quiz</button>
                            <button class="ghost" onclick="importQuiz()">Importer Quiz</button>
                        </div>
                    </div>
                </section>
                
                <section id="library" class="card" style="display:none">
                    <h3>Bibliothèque — Liste complète</h3>
                    <div style="display:flex;gap:8px;margin-bottom:10px">
                         <div style="flex-basis: 40%">
                            <label class="small" for="libraryRiskFilter" style="margin-bottom:0">Filtrer par risque</label>
                            <select id="libraryRiskFilter" onchange="filtrerBiblio()">
                                <option value="all">Tous les risques</option>
                                <option value="high">Haut Risque uniquement</option>
                                <option value="lasa">LASA (Autres) uniquement</option>
                            </select>
                        </div>
                        <div style="flex-basis: 60%">
                            <label class="small" for="libraryFilter" style="margin-bottom:0">Filtrer par nom</label>
                            <input type="text" id="libraryFilter" onkeyup="filtrerBiblio()" placeholder="Nom, Marque, DCI..."/>
                        </div>
                    </div>
                   
                    <div style="margin-top:10px">
                        <div style="font-weight:700;margin-bottom:6px" id="library-high-title">Urgences & Haut Risque</div>
                        <div id="library-high" style="display:flex;flex-direction:column;gap:6px;max-height:220px;overflow:auto;padding:6px;border:1px solid #f0f3f8;border-radius:8px"></div>
                    </div>
                    <div style="margin-top:14px">
                        <div style="font-weight:700;margin-bottom:6px" id="library-lasa-title">LASA — Global (Autres)</div>
                        <div id="library-lasa" style="display:flex;flex-direction:column;gap:6px;max-height:360px;overflow:auto;padding:6px;border:1px solid #f0f3f8;border-radius:8px"></div>
                    </div>
                </section>
                
                <section id="dashboard" class="card" style="display:none">
                    <h3>Dashboard</h3>
                    <div class="stats">
                        <div class="stat"><div class="badge">Signaux</div><div id="statReports" style="font-size:20px;margin-top:6px">0</div></div>
                        <div class="stat"><div class="badge">LASA identifiés</div><div id="statLASA" style="font-size:20px;margin-top:6px">0</div></div>
                        <div class="stat"><div class="badge">Haut risque</div><div id="statHighRisk" style="font-size:20px;margin-top:6px">0</div></div>
                        <div class="stat"><div class="badge">Quiz passés</div><div id="statQuiz" style="font-size:20px;margin-top:6px">0</div></div>
                    </div>
                    
                    <h4>Top 5 des médicaments signalés</h4>
                    <table id="drugStatsTable">
                        <thead>
                            <tr>
                                <th>Médicament</th>
                                <th style="text-align:right">Signalements</th>
                            </tr>
                        </thead>
                        <tbody id="drugStatsTableBody">
                        </tbody>
                    </table>

                    <h4 style="margin-top:20px">Derniers signalements</h4>
                    <table id="reportsTable"><thead><tr><th>Date</th><th>Type</th><th>Drug</th></tr></thead><tbody></tbody></table>
                    
                    <div style="display: flex; gap: 8px; margin-top: 15px;">
                        <button class="btn" onclick="exportCSV()" style="flex: 1">Exporter les données (CSV)</button>
                        <button class="btn admin-only" onclick="exportPDF()" style="flex: 1; display: none">Exporter Rapport (PDF)</button>
                    </div>
                </section>
                
                <!-- New Admin Section -->
                <section id="admin" class="card" style="display:none">
                    <h3>Panel d'Administration</h3>
                    <p class="small">Gestion des médicaments et utilisateurs</p>
                    
                    <div class="columns">
                        <div>
                            <h4>Gestion des Médicaments</h4>
                            <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                                <button class="btn" onclick="openAddMed()">Ajouter Médicament</button>
                                <button class="ghost" onclick="refreshFromAPI()">Actualiser depuis API</button>
                            </div>
                            <div id="adminMedList" style="max-height: 300px; overflow: auto; border: 1px solid #f0f3f8; border-radius: 8px; padding: 8px;"></div>
                        </div>
                        
                        <div>
                            <h4>Statistiques Système</h4>
                            <div class="stat">
                                <div class="badge">Médicaments</div>
                                <div id="adminMedCount" style="font-size: 20px; margin-top: 6px">0</div>
                            </div>
                            <div class="stat">
                                <div class="badge">Utilisateurs Actifs</div>
                                <div style="font-size: 20px; margin-top: 6px">1</div>
                            </div>
                            <div class="stat">
                                <div class="badge">Dernière MAJ</div>
                                <div id="lastUpdate" style="font-size: 14px; margin-top: 6px">-</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <aside>
                <div class="card">
                    <h3 style="margin-top:0">Instructions Rapides</h3>
                    <ul style="padding-left:20px;font-size:14px;line-height:1.4">
                        <li>Utilisez la section <strong>Accueil</strong> pour vérifier un médicament et identifier les LASA potentiels.</li>
                        <li>Utilisez la <strong>Vérif.</strong> pour comparer deux produits avant l'administration.</li>
                        <li>Utilisez la <strong>Bibliothèque</strong> pour parcourir toute la liste de vigilance.</li>
                        <li><strong>Login de test :</strong> <span style="font-weight:700;background:#f0f3f8;padding:2px 4px;border-radius:4px">medsafe</span> / <span style="font-weight:700;background:#f0f3f8;padding:2px 4px;border-radius:4px">12345</span></li>
                    </ul>
                </div>
                
                <div class="card" style="margin-top:20px">
                    <h3 style="margin-top:0">Conseils de Sécurité LASA</h3>
                    <p class="small">Points clés:</p>
                    <ul style="padding-left:20px;font-size:14px;line-height:1.4">
                        <li><strong>Stocker séparément</strong> les produits à haut risque et LASA.</li>
                        <li><strong>Double vérification</strong> obligatoire pour les médicaments <strong>Haut Risque</strong> (ex: Insuline, Morphine, KCL concentré).</li>
                        <li>Toujours vérifier nom <strong>et</strong> dosage.</li>
                    </ul>
                </div>
                
                <!-- Offline status indicator -->
                <div class="card" style="margin-top:20px" id="offlineStatus">
                    <h3 style="margin-top:0">Statut Connexion</h3>
                    <div id="onlineStatus" class="ok" style="padding: 8px; border-radius: 6px;">
                        <strong>✓ En ligne</strong> - Données à jour
                    </div>
                    <div id="offlineWarning" class="lasawarning" style="padding: 8px; border-radius: 6px; display: none;">
                        <strong>⚠ Hors ligne</strong> - Mode dégradé activé
                    </div>
                </div>
            </aside>
        </main>

        <footer>MED-SAFE TN — Prototype connecté • PFE • 2025/2026</footer>
    </div>

    <div id="overlayRoot"></div>
    <div id="notificationContainer"></div>

<script>
// Configuration de base
const VALID_USER = 'medsafe';
const VALID_PASS = '12345';

// Enhanced medication data with complete emergency medications for Tunisia
let MEDS = JSON.parse(localStorage.getItem('vigi_meds')) || [
    // ==========================================================================
    // MÉDICAMENTS HAUT RISQUE - URGENCES & RÉANIMATION
    // ==========================================================================
    
    // CATÉCHOLAMINES & VASOPRESSEURS
    {id:1, name:'Adrénaline', brand:'ADRENALINE', active:'Adrénaline', aliases:['Epinephrine','Adrenol'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1001)', indications:'Arrêt cardiaque, choc anaphylactique, bronchospasme sévère.', dosage:'1mg/ml (1:1000)', route:'IV/IM/IC'},
    {id:2, name:'Noradrénaline', brand:'NORADRENALINE', active:'Noradrénaline', aliases:['Norepinephrine','Levophed'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1002)', indications:'Choc septique, hypotension sévère réfractaire.', dosage:'1mg/ml', route:'IV'},
    {id:3, name:'Dopamine', brand:'DOPAMINE', active:'Dopamine HCL', aliases:['Dobutamine'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1003)', indications:'Choc cardiogénique, insuffisance rénale aiguë, hypotension.', dosage:'40mg, 80mg', route:'IV'},
    {id:4, name:'Dobutamine', brand:'DOBUTAMINE', active:'Dobutamine HCL', aliases:['Dopamine'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1004)', indications:'Insuffisance cardiaque, choc septique ou cardiogénique.', dosage:'250mg/20ml', route:'IV'},

    // SÉDATION & ANALGÉSIE EN RÉANIMATION
    {id:5, name:'Midazolam', brand:'MIDAZOLAM', active:'Midazolam', aliases:['Dormicum','Hypnovel'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1005)', indications:'Sédation, anxiété, induction anesthésique.', dosage:'5mg/ml, 15mg/3ml', route:'IV/IM'},
    {id:6, name:'Propofol', brand:'PROPOFOL', active:'Propofol', aliases:['Diprivan'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1006)', indications:'Anesthésie générale, sédation en réanimation.', dosage:'10mg/ml, 20mg/ml', route:'IV'},
    {id:7, name:'Fentanyl', brand:'FENTANYL', active:'Fentanyl', aliases:['Durogesic'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1007)', indications:'Douleurs sévères, anesthésie.', dosage:'50mcg/ml, 100mcg/2ml', route:'IV/IM'},
    {id:8, name:'Morphine', brand:'MORPHINE', active:'Morphine sulfate', aliases:['Skenan','Moscontin'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1008)', indications:'Douleurs intenses, détresse respiratoire.', dosage:'10mg/ml', route:'IV/SC/PO'},
    {id:9, name:'Kétamine', brand:'KETAMINE', active:'Kétamine', aliases:['Ketalar'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1009)', indications:'Anesthésie, analgésie, état de mal épileptique.', dosage:'50mg/ml', route:'IV/IM'},

    // CURARISANTS
    {id:10, name:'Succinylcholine', brand:'SUCCINYLCHOLINE', active:'Succinylcholine', aliases:['Celocurine'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1010)', indications:'Curarisation rapide pour intubation.', dosage:'50mg/ml', route:'IV'},
    {id:11, name:'Rocuronium', brand:'ROCURONIUM', active:'Rocuronium', aliases:['Esmeron'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1011)', indications:'Curarisation per-opératoire, intubation.', dosage:'10mg/ml, 50mg/5ml', route:'IV'},
    {id:12, name:'Vecuronium', brand:'VECURONIUM', active:'Vecuronium', aliases:['Norcuron'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1012)', indications:'Curarisation de longue durée.', dosage:'10mg', route:'IV'},

    // ANTIARYTHMIQUES
    {id:13, name:'Amiodarone', brand:'AMIODARONE', active:'Amiodarone', aliases:['Cordarone'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1013)', indications:'Troubles du rythme ventriculaires et supra-ventriculaires.', dosage:'150mg/3ml', route:'IV'},
    {id:14, name:'Lidocaïne', brand:'LIDOCAINE', active:'Lidocaïne', aliases:['Xylocaïne'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1014)', indications:'Anesthésie locale, troubles du rythme ventriculaires.', dosage:'1%, 2%', route:'IV/Local'},
    {id:15, name:'Adénosine', brand:'ADENOSINE', active:'Adénosine', aliases:['Adenocor'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1015)', indications:'Tachycardie supra-ventriculaire paroxystique.', dosage:'6mg/2ml, 12mg/4ml', route:'IV'},

    // ANTIHYPERTENSEURS URGENTS
    {id:16, name:'Nitroprussiate', brand:'NITROPRUSSIATE', active:'Nitroprussiate de sodium', aliases:['Nipride'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1016)', indications:'Hypertension artérielle sévère.', dosage:'50mg', route:'IV'},
    {id:17, name:'Nicardipine', brand:'NICARDIPINE', active:'Nicardipine', aliases:['Loxen'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1017)', indications:'Hypertension artérielle aiguë.', dosage:'10mg/10ml', route:'IV'},
    {id:18, name:'Labétalol', brand:'LABETALOL', active:'Labétalol', aliases:['Trandate'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1018)', indications:'Hypertension urgente, crise hypertensive.', dosage:'100mg/20ml', route:'IV'},

    // BRONCHODILATATEURS
    {id:19, name:'Salbutamol', brand:'SALBUTAMOL', active:'Salbutamol', aliases:['Ventoline'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1019)', indications:'Bronchospasme, asthme aigu.', dosage:'5mg/ml', route:'Nébulisé/IV'},
    {id:20, name:'Ipratropium', brand:'IPRATROPIUM', active:'Ipratropium', aliases:['Atrovent'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1020)', indications:'Bronchospasme, BPCO aiguë.', dosage:'0.25mg/ml', route:'Nébulisé'},

    // DIURÉTIQUES
    {id:21, name:'Furosémide', brand:'FUROSEMIDE', active:'Furosémide', aliases:['Lasilix'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1021)', indications:'Œdème aigu du poumon, insuffisance rénale.', dosage:'20mg/2ml, 40mg/4ml', route:'IV'},
    {id:22, name:'Bumétanide', brand:'BUMETANIDE', active:'Bumétanide', aliases:['Burinex'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1022)', indications:'Œdèmes, insuffisance cardiaque.', dosage:'1mg/ml', route:'IV'},

    // ANTICOAGULANTS & THROMBOLYTIQUES
    {id:23, name:'Héparine', brand:'HEPARINE', active:'Héparine sodique', aliases:[], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1023)', indications:'Anticoagulation, prévention des thromboses.', dosage:'5000 UI/ml', route:'IV/SC'},
    {id:24, name:'Alteplase', brand:'ALTEPLASE', active:'Alteplase', aliases:['Actilyse'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1024)', indications:'Infarctus du myocarde, AVC ischémique, embolie pulmonaire.', dosage:'50mg', route:'IV'},
    {id:25, name:'Streptokinase', brand:'STREPTOKINASE', active:'Streptokinase', aliases:['Streptase'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1025)', indications:'Infarctus du myocarde, thromboses.', dosage:'1.5 millions UI', route:'IV'},

    // ÉLECTROLYTES & SOLUTÉS
    {id:26, name:'KCl concentré', brand:'KCL', active:'Chlorure de potassium', aliases:['Potassium'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1026)', indications:'Hypokaliémie sévère.', dosage:'10%, 20%', route:'IV dilué'},
    {id:27, name:'Calcium', brand:'CALCIUM', active:'Gluconate de calcium', aliases:['Calcium Sandoz'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1027)', indications:'Hypocalcémie, hyperkaliémie, intoxication aux bloqueurs calciques.', dosage:'10%', route:'IV'},
    {id:28, name:'Magnésium', brand:'MAGNESIUM', active:'Sulfate de magnésium', aliases:[], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1028)', indications:'Torsades de pointes, éclampsie, asthme sévère.', dosage:'10%, 20%', route:'IV'},

    // ANTIBIOTIQUES PARENTÉRAUX
    {id:29, name:'Céfotaxime', brand:'CEFOTAXIME', active:'Céfotaxime', aliases:['Claforan'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1029)', indications:'Infections bactériennes sévères, méningites.', dosage:'1g, 2g', route:'IV'},
    {id:30, name:'Ceftriaxone', brand:'CEFTRIAXONE', active:'Ceftriaxone', aliases:['Rocephine'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1030)', indications:'Infections bactériennes sévères.', dosage:'1g, 2g', route:'IV/IM'},
    {id:31, name:'Amoxicilline/acide clavulanique', brand:'AUGMENTIN', active:'Amoxicilline/Acide clavulanique', aliases:['Claventin'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1031)', indications:'Infections bactériennes résistantes.', dosage:'1g/200mg, 2g/200mg', route:'IV'},
    {id:32, name:'Piperacilline/tazobactam', brand:'TAZOCILLINE', active:'Piperacilline/Tazobactam', aliases:['Tazocin'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1032)', indications:'Infections nosocomiales sévères.', dosage:'4g/0.5g', route:'IV'},
    {id:33, name:'Imipénème', brand:'IMIPENEM', active:'Imipénème', aliases:['Tienam'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1033)', indications:'Infections multirésistantes.', dosage:'500mg, 1g', route:'IV'},
    {id:34, name:'Vancomycine', brand:'VANCOMYCINE', active:'Vancomycine', aliases:['Vancocine'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1034)', indications:'Infections à germes multirésistants.', dosage:'500mg, 1g', route:'IV'},

    // ANTIVIRAUX & ANTIFONGIQUES
    {id:35, name:'Aciclovir', brand:'ACICLOVIR', active:'Aciclovir', aliases:['Zovirax'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1035)', indications:'Infections herpétiques sévères, encéphalite.', dosage:'250mg, 500mg', route:'IV'},
    {id:36, name:'Amphotéricine B', brand:'AMPHOTERICINE B', active:'Amphotéricine B', aliases:['Fungizone'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1036)', indications:'Infections fongiques invasives.', dosage:'50mg', route:'IV'},

    // ANTIDOTES
    {id:37, name:'Naloxone', brand:'NALOXONE', active:'Naloxone', aliases:['Narcan'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1037)', indications:'Intoxication aux opiacés.', dosage:'0.4mg/ml', route:'IV/IM/IN'},
    {id:38, name:'Flumazénil', brand:'FLUMAZENIL', active:'Flumazénil', aliases:['Anexate'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1038)', indications:'Intoxication aux benzodiazépines.', dosage:'0.1mg/ml', route:'IV'},
    {id:39, name:'Digoxine immune Fab', brand:'DIGIFAB', active:'Anticorps anti-digoxine', aliases:['Digidote'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1039)', indications:'Intoxication à la digoxine.', dosage:'40mg', route:'IV'},

    // INSULINE & HYPOGLYCÉMIANTS
    {id:40, name:'Insuline rapide', brand:'INSULINE RAPIDE', active:'Insuline', aliases:['Actrapid','Humulin R'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1040)', indications:'Diabète, hyperglycémie sévère.', dosage:'100 UI/ml', route:'IV/SC'},
    {id:41, name:'Glucagon', brand:'GLUCAGON', active:'Glucagon', aliases:[], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1041)', indications:'Hypoglycémie sévère.', dosage:'1mg', route:'IV/IM'},

    // CORTICOÏDES
    {id:42, name:'Hydrocortisone', brand:'HYDROCORTISONE', active:'Hydrocortisone', aliases:['Solu-Cortef'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1042)', indications:'Choc septique, insuffisance surrénale.', dosage:'100mg', route:'IV'},
    {id:43, name:'Méthylprednisolone', brand:'SOLUMEDROL', active:'Méthylprednisolone', aliases:['Medrol'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1043)', indications:'Choc, œdème cérébral, pathologies inflammatoires.', dosage:'40mg, 125mg, 500mg', route:'IV'},

    // ANTIÉPILEPTIQUES
    {id:44, name:'Phénytoïne', brand:'PHENYTOINE', active:'Phénytoïne', aliases:['Dilantin'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1044)', indications:'État de mal épileptique.', dosage:'100mg/2ml', route:'IV'},
    {id:45, name:'Phénobarbital', brand:'PHENOBARBITAL', active:'Phénobarbital', aliases:['Gardenal'], risk:'high', reference:'ANSM 2024, Liste H.R. (ID: 1045)', indications:'État de mal épileptique.', dosage:'200mg/ml', route:'IV'},

    // ==========================================================================
    // MÉDICAMENTS LASA - URGENCES
    // ==========================================================================

    // ANALGÉSIQUES & ANTIPYRETIQUES
    {id:101, name:'Paracétamol', brand:'DOLIPRANE', active:'Paracétamol', aliases:['Efferalgan','Panadol','Acetaminophen'], risk:'lasa', reference:'VigiLASA List (ID: 2001)', indications:'Douleur et fièvre.', dosage:'500mg, 1g', route:'PO/IV'},
    {id:102, name:'Ibuprofène', brand:'BRUFEN', active:'Ibuprofène', aliases:['Advil','Nurofen'], risk:'lasa', reference:'VigiLASA List (ID: 2002)', indications:'Douleur, inflammation, fièvre.', dosage:'200mg, 400mg', route:'PO'},
    {id:103, name:'Kétoprofène', brand:'PROFENID', active:'Kétoprofène', aliases:['Toprec','Bi-Profénid'], risk:'lasa', reference:'VigiLASA List (ID: 2003)', indications:'Douleur et inflammation.', dosage:'100mg', route:'PO/IV'},
    {id:104, name:'Diclofénac', brand:'VOLTARENE', active:'Diclofénac', aliases:['Diclophen','Cataflam'], risk:'lasa', reference:'VigiLASA List (ID: 2004)', indications:'Douleur et inflammation.', dosage:'50mg, 100mg', route:'PO/IM'},

    // ANTIBIOTIQUES ORAUX
    {id:105, name:'Amoxicilline', brand:'AMOXAL', active:'Amoxicilline', aliases:['Clamoxyl','Saifoxyl'], risk:'lasa', reference:'VigiLASA List (ID: 2005)', indications:'Infections bactériennes.', dosage:'500mg, 1g', route:'PO'},
    {id:106, name:'Clarithromycine', brand:'Naxy', active:'Clarithromycine', aliases:['Biaxin','Klaricid'], risk:'lasa', reference:'VigiLASA List (ID: 2006)', indications:'Infections respiratoires.', dosage:'500mg', route:'PO'},
    {id:107, name:'Azithromycine', brand:'AZITHROMYCINE', active:'Azithromycine', aliases:['Zithromax','Azadose'], risk:'lasa', reference:'VigiLASA List (ID: 2007)', indications:'Infections respiratoires, MST.', dosage:'500mg', route:'PO'},
    {id:108, name:'Ciprofloxacine', brand:'CIPROFLOXACINE', active:'Ciprofloxacine', aliases:['Ciflox'], risk:'lasa', reference:'VigiLASA List (ID: 2008)', indications:'Infections diverses.', dosage:'500mg', route:'PO/IV'},

    // ANTIHYPERTENSEURS
    {id:109, name:'Amlodipine', brand:'AMLODIPINE', active:'Amlodipine', aliases:['Amlor','Norvasc'], risk:'lasa', reference:'VigiLASA List (ID: 2009)', indications:'Hypertension, angine.', dosage:'5mg, 10mg', route:'PO'},
    {id:110, name:'Lisinopril', brand:'LISINOPRIL', active:'Lisinopril', aliases:['Zestril','Prinivil'], risk:'lasa', reference:'VigiLASA List (ID: 2010)', indications:'Hypertension, insuffisance cardiaque.', dosage:'5mg, 10mg, 20mg', route:'PO'},
    {id:111, name:'Valsartan', brand:'DIOVAN', active:'Valsartan', aliases:['Tareg'], risk:'lasa', reference:'VigiLASA List (ID: 2011)', indications:'Hypertension, insuffisance cardiaque.', dosage:'80mg, 160mg', route:'PO'},

    // DIURÉTIQUES
    {id:112, name:'Hydrochlorothiazide', brand:'HYDROCHLOROTHIAZIDE', active:'Hydrochlorothiazide', aliases:['Esidrex'], risk:'lasa', reference:'VigiLASA List (ID: 2012)', indications:'Hypertension, œdèmes.', dosage:'25mg', route:'PO'},
    {id:113, name:'Spironolactone', brand:'SPIRONOLACTONE', active:'Spironolactone', aliases:['Aldactone','Spiritone'], risk:'lasa', reference:'VigiLASA List (ID: 2013)', indications:'Œdèmes, hyperaldostéronisme.', dosage:'25mg, 50mg', route:'PO'},

    // ANTIDIABÉTIQUES
    {id:114, name:'Metformine', brand:'GLUCOPHAGE', active:'Metformine', aliases:['Stagid','Metfogamma'], risk:'lasa', reference:'VigiLASA List (ID: 2014)', indications:'Diabète type 2.', dosage:'500mg, 850mg, 1g', route:'PO'},
    {id:115, name:'Glibenclamide', brand:'DAONIL', active:'Glibenclamide', aliases:['Euglucon'], risk:'lasa', reference:'VigiLASA List (ID: 2015)', indications:'Diabète type 2.', dosage:'5mg', route:'PO'},
    {id:116, name:'Gliclazide', brand:'DIAMICRON', active:'Gliclazide', aliases:['Diamicron','Gliclazide'], risk:'lasa', reference:'VigiLASA List (ID: 2016)', indications:'Diabète type 2.', dosage:'30mg, 60mg', route:'PO'},

    // ANTICOAGULANTS ORAUX
    {id:117, name:'Warfarine', brand:'WARFARINE', active:'Warfarine', aliases:['Coumadine'], risk:'lasa', reference:'VigiLASA List (ID: 2017)', indications:'Anticoagulation.', dosage:'1mg, 2mg, 5mg', route:'PO'},
    {id:118, name:'Rivaroxaban', brand:'XARELTO', active:'Rivaroxaban', aliases:['Xarelto'], risk:'lasa', reference:'VigiLASA List (ID: 2018)', indications:'Anticoagulation.', dosage:'10mg, 15mg, 20mg', route:'PO'},
    {id:119, name:'Apixaban', brand:'ELIQUIS', active:'Apixaban', aliases:['Eliquis'], risk:'lasa', reference:'VigiLASA List (ID: 2019)', indications:'Anticoagulation.', dosage:'2.5mg, 5mg', route:'PO'},

    // ANTIAGRÉGANTS PLAQUETTAIRES
    {id:120, name:'Aspirine', brand:'ASPIRINE', active:'Acide acétylsalicylique', aliases:['Kardegic','Aspegic'], risk:'lasa', reference:'VigiLASA List (ID: 2020)', indications:'Antiagrégant plaquettaire, douleur, fièvre.', dosage:'75mg, 100mg, 500mg', route:'PO'},
    {id:121, name:'Clopidogrel', brand:'CLOPIDOGREL', active:'Clopidogrel', aliases:['Plavix','Clopidogrel'], risk:'lasa', reference:'VigiLASA List (ID: 2021)', indications:'Antiagrégant plaquettaire.', dosage:'75mg', route:'PO'},
    {id:122, name:'Ticagrelor', brand:'BRILIQUE', active:'Ticagrelor', aliases:['Brilinta'], risk:'lasa', reference:'VigiLASA List (ID: 2022)', indications:'Antiagrégant plaquettaire.', dosage:'90mg', route:'PO'},

    // STATINES
    {id:123, name:'Atorvastatine', brand:'TAHOR', active:'Atorvastatine', aliases:['Sortis','Atorvastatine'], risk:'lasa', reference:'VigiLASA List (ID: 2023)', indications:'Hypercholestérolémie.', dosage:'10mg, 20mg, 40mg', route:'PO'},
    {id:124, name:'Rosuvastatine', brand:'CRESTOR', active:'Rosuvastatine', aliases:['Crestor','Roxar'], risk:'lasa', reference:'VigiLASA List (ID: 2024)', indications:'Hypercholestérolémie.', dosage:'5mg, 10mg, 20mg', route:'PO'},
    {id:125, name:'Simvastatine', brand:'ZOCOR', active:'Simvastatine', aliases:['Zocor','Sivastin'], risk:'lasa', reference:'VigiLASA List (ID: 2025)', indications:'Hypercholestérolémie.', dosage:'10mg, 20mg, 40mg', route:'PO'},

    // IPP
    {id:126, name:'Oméprazole', brand:'MOPRAL', active:'Oméprazole', aliases:['Losec','Omez'], risk:'lasa', reference:'VigiLASA List (ID: 2026)', indications:'Ulcères, RGO.', dosage:'20mg', route:'PO/IV'},
    {id:127, name:'Pantoprazole', brand:'PANTOZOL', active:'Pantoprazole', aliases:['Eupantol','Controloc'], risk:'lasa', reference:'VigiLASA List (ID: 2027)', indications:'Ulcères, RGO.', dosage:'40mg', route:'PO/IV'},
    {id:128, name:'Esoméprazole', brand:'INEXIUM', active:'Esoméprazole', aliases:['Nexium','Esomeprazole'], risk:'lasa', reference:'VigiLASA List (ID: 2028)', indications:'Ulcères, RGO.', dosage:'20mg, 40mg', route:'PO/IV'},

    // CORTICOÏDES ORAUX
    {id:129, name:'Prednisone', brand:'PREDNISONE', active:'Prednisone', aliases:['Cortancyl','Deltacortene'], risk:'lasa', reference:'VigiLASA List (ID: 2029)', indications:'Pathologies inflammatoires et allergiques.', dosage:'5mg, 20mg', route:'PO'},
    {id:130, name:'Prednisolone', brand:'SOLUPRED', active:'Prednisolone', aliases:['Solupred','Prednisol'], risk:'lasa', reference:'VigiLASA List (ID: 2030)', indications:'Pathologies inflammatoires et allergiques.', dosage:'5mg, 20mg', route:'PO'},
    {id:131, name:'Dexaméthasone', brand:'DEXAMETHASONE', active:'Dexaméthasone', aliases:['Decadron','Dexamethasone'], risk:'lasa', reference:'VigiLASA List (ID: 2031)', indications:'Pathologies inflammatoires, œdème cérébral.', dosage:'0.5mg, 4mg', route:'PO/IV'},

    // ANTIDÉPRESSEURS & PSYCHOTROPES
    {id:132, name:'Sertraline', brand:'ZOLOFT', active:'Sertraline', aliases:['Sertraline','Lustral'], risk:'lasa', reference:'VigiLASA List (ID: 2032)', indications:'Dépression, troubles anxieux.', dosage:'50mg, 100mg', route:'PO'},
    {id:133, name:'Fluoxétine', brand:'PROZAC', active:'Fluoxétine', aliases:['Prozac','Fluoxetine'], risk:'lasa', reference:'VigiLASA List (ID: 2033)', indications:'Dépression, TOC.', dosage:'20mg', route:'PO'},
    {id:134, name:'Paroxétine', brand:'DEROXAT', active:'Paroxétine', aliases:['Paxil','Seroxat'], risk:'lasa', reference:'VigiLASA List (ID: 2034)', indications:'Dépression, troubles anxieux.', dosage:'20mg', route:'PO'},
    {id:135, name:'Venlafaxine', brand:'EFFEXOR', active:'Venlafaxine', aliases:['Effexor','Venlafaxine'], risk:'lasa', reference:'VigiLASA List (ID: 2035)', indications:'Dépression, troubles anxieux.', dosage:'37.5mg, 75mg', route:'PO'},

    // NEUROLEPTIQUES
    {id:136, name:'Halopéridol', brand:'HALDOL', active:'Halopéridol', aliases:['Haldol','Haloperidol'], risk:'lasa', reference:'VigiLASA List (ID: 2036)', indications:'Agitation, psychoses.', dosage:'5mg/ml', route:'IM/PO'},
    {id:137, name:'Risperidone', brand:'RISPERDAL', active:'Risperidone', aliases:['Risperdal','Risperidone'], risk:'lasa', reference:'VigiLASA List (ID: 2037)', indications:'Schizophrénie, troubles bipolaires.', dosage:'1mg, 2mg, 3mg', route:'PO'},
    {id:138, name:'Olanzapine', brand:'ZYPREXA', active:'Olanzapine', aliases:['Zyprexa','Olanzapine'], risk:'lasa', reference:'VigiLASA List (ID: 2038)', indications:'Schizophrénie, troubles bipolaires.', dosage:'5mg, 10mg', route:'PO/IM'},

    // ANTIEPILEPTIQUES
    {id:139, name:'Carbamazépine', brand:'TEGRETOL', active:'Carbamazépine', aliases:['Tegretol','Carbamazepine'], risk:'lasa', reference:'VigiLASA List (ID: 2039)', indications:'Épilepsie, névralgie.', dosage:'200mg', route:'PO'},
    {id:140, name:'Valproate', brand:'DEPAKINE', active:'Acide valproïque', aliases:['Depakine','Valproate'], risk:'lasa', reference:'VigiLASA List (ID: 2040)', indications:'Épilepsie, troubles bipolaires.', dosage:'200mg, 500mg', route:'PO'},
    {id:141, name:'Lévétiracétam', brand:'KEPPRA', active:'Lévétiracétam', aliases:['Keppra','Levetiracetam'], risk:'lasa', reference:'VigiLASA List (ID: 2041)', indications:'Épilepsie.', dosage:'250mg, 500mg, 1000mg', route:'PO/IV'},

    // ANTIHISTAMINIQUES
    {id:142, name:'Cétirizine', brand:'ZYRTEC', active:'Cétirizine', aliases:['Zyrtec','Reactine'], risk:'lasa', reference:'VigiLASA List (ID: 2042)', indications:'Allergies, urticaire.', dosage:'10mg', route:'PO'},
    {id:143, name:'Loratadine', brand:'CLARITYNE', active:'Loratadine', aliases:['Clarityne','Loratadine'], risk:'lasa', reference:'VigiLASA List (ID: 2043)', indications:'Allergies.', dosage:'10mg', route:'PO'},
    {id:144, name:'Desloratadine', brand:'AERIUS', active:'Desloratadine', aliases:['Aerius','Desloratadine'], risk:'lasa', reference:'VigiLASA List (ID: 2044)', indications:'Allergies.', dosage:'5mg', route:'PO'},

    // ANTISPASMODIQUES
    {id:145, name:'Phloroglucinol', brand:'SPASFON', active:'Phloroglucinol', aliases:['Spasfon','Trimebutine'], risk:'lasa', reference:'VigiLASA List (ID: 2045)', indications:'Spasmes digestifs.', dosage:'80mg', route:'PO'},
    {id:146, name:'Trimébutine', brand:'DEBRIDAT', active:'Trimébutine', aliases:['Debridat','Trimebutine'], risk:'lasa', reference:'VigiLASA List (ID: 2046)', indications:'Troubles fonctionnels intestinaux.', dosage:'100mg, 200mg', route:'PO'},

    // LAXATIFS
    {id:147, name:'Lactulose', brand:'LACTULOSE', active:'Lactulose', aliases:['Duphalac','Lactulose'], risk:'lasa', reference:'VigiLASA List (ID: 2047)', indications:'Constipation, encéphalopathie hépatique.', dosage:'10g/15ml', route:'PO'},
    {id:148, name:'Macrogol', brand:'FORLAX', active:'Macrogol', aliases:['Forlax','Movicol'], risk:'lasa', reference:'VigiLASA List (ID: 2048)', indications:'Constipation.', dosage:'10g', route:'PO'},

    // VITAMINES & MINÉRAUX
    {id:149, name:'Vitamine B1', brand:'VITAMINE B1', active:'Thiamine', aliases:['Benerva','Thiamine'], risk:'lasa', reference:'VigiLASA List (ID: 2049)', indications:'Carence en vitamine B1, encéphalopathie de Wernicke.', dosage:'100mg, 250mg', route:'PO/IM/IV'},
    {id:150, name:'Vitamine B6', brand:'VITAMINE B6', active:'Pyridoxine', aliases:['Pyridoxine','B6'], risk:'lasa', reference:'VigiLASA List (ID: 2050)', indications:'Carence en vitamine B6.', dosage:'25mg, 50mg', route:'PO/IM/IV'},
    {id:151, name:'Vitamine B12', brand:'VITAMINE B12', active:'Cyanocobalamine', aliases:['Cobamine','B12'], risk:'lasa', reference:'VigiLASA List (ID: 2051)', indications:'Anémie pernicieuse, carence en B12.', dosage:'1000mcg', route:'IM/PO'}
];

// Enhanced quiz data based on bibliography with 25 questions
let QUIZ = JSON.parse(localStorage.getItem('vigi_quiz')) || [
    {
        q: "Quelle est la principale cause des erreurs médicamenteuses LASA selon Bryan et al. (2021)?",
        a: [
            {text: "La similarité des noms et des emballages", correct: true, explanation: "Bryan et al. (2021) identifient la similarité des noms et emballages comme facteur principal des erreurs LASA."},
            {text: "Le manque de formation des infirmiers", correct: false, explanation: "Bien que la formation soit importante, ce n'est pas le facteur principal identifié dans cette étude."},
            {text: "Les distractions pendant l'administration", correct: false, explanation: "Les distractions contribuent mais ne sont pas la cause principale selon cette référence."}
        ]
    },
    {
        q: "Quelle stratégie est la plus efficace pour réduire les erreurs LASA selon Lambert et al. (2003)?",
        a: [
            {text: "La séparation physique des médicaments similaires", correct: true, explanation: "Lambert et al. (2003) recommandent la séparation physique comme mesure préventive efficace."},
            {text: "L'augmentation des vérifications", correct: false, explanation: "Les vérifications supplémentaires aident mais ne sont pas la stratégie la plus efficace."},
            {text: "La réduction du nombre de médicaments", correct: false, explanation: "Cette approche n'est pas réaliste dans la pratique clinique."}
        ]
    },
    {
        q: "Selon Alotaibi et al. (2024), quel est le taux d'erreurs médicamenteuses dans les services d'urgence?",
        a: [
            {text: "15-25% des administrations", correct: true, explanation: "Alotaibi et al. (2024) rapportent une prévalence de 15-25% dans leur méta-analyse."},
            {text: "5-10% des administrations", correct: false, explanation: "Ce chiffre sous-estime la prévalence réelle selon l'étude."},
            {text: "30-40% des administrations", correct: false, explanation: "Ce chiffre surestime la prévalence rapportée."}
        ]
    },
    {
        q: "Quel facteur environnemental majeur contribue aux erreurs dans les urgences selon Hall et al. (2020)?",
        a: [
            {text: "L'environnement bruyant et les interruptions fréquentes", correct: true, explanation: "Hall et al. (2020) identifient le bruit et les interruptions comme facteurs environnementaux critiques."},
            {text: "Le manque de lumière", correct: false, explanation: "Bien que important, ce n'est pas le facteur principal identifié."},
            {text: "La température inadaptée", correct: false, explanation: "Ce facteur a moins d'impact selon l'étude."}
        ]
    },
    {
        q: "Selon l'OMS (2022), quelle mesure est essentielle pour la sécurité des médicaments LASA?",
        a: [
            {text: "L'étiquetage différencié et la traçabilité", correct: true, explanation: "L'OMS recommande un étiquetage clair et différencié pour prévenir les confusions."},
            {text: "La réduction des stocks", correct: false, explanation: "La gestion des stocks est importante mais pas la mesure principale."},
            {text: "L'élimination des médicaments similaires", correct: false, explanation: "Cette approche n'est pas réalisable en pratique."}
        ]
    },
    {
        q: "Quelle est la principale barrière au signalement des erreurs selon Anwar et Hassan (2024)?",
        a: [
            {text: "La crainte des conséquences disciplinaires", correct: true, explanation: "La peur des sanctions est identifiée comme barrière majeure au signalement."},
            {text: "Le manque de temps", correct: false, explanation: "Bien que réel, ce n'est pas la barrière principale."},
            {text: "La complexité des formulaires", correct: false, explanation: "Ce facteur est secondaire selon l'étude."}
        ]
    },
    {
        q: "Selon López-González et Castro-Balado (2022), quelle approche réduit efficacement les erreurs LASA?",
        a: [
            {text: "L'analyse systématique des incidents et le feedback", correct: true, explanation: "L'analyse des incidents avec retour d'information est une stratégie efficace."},
            {text: "La rotation plus fréquente du personnel", correct: false, explanation: "Cette approche n'est pas recommandée pour réduire les erreurs."},
            {text: "La réduction de la diversité médicamenteuse", correct: false, explanation: "Non réalisable dans la pratique clinique."}
        ]
    },
    {
        q: "Quel pourcentage d'erreurs médicamenteuses sont évitables selon Rauf et Kamarudin (2024)?",
        a: [
            {text: "60-70%", correct: true, explanation: "Rauf et Kamarudin (2024) estiment que 60-70% des erreurs sont évitables."},
            {text: "30-40%", correct: false, explanation: "Cette estimation sous-estime le potentiel de prévention."},
            {text: "80-90%", correct: false, explanation: "Cette estimation est trop optimiste selon les données."}
        ]
    },
    {
        q: "Selon Kim et al. (2024), quel système est le plus efficace pour réduire les erreurs?",
        a: [
            {text: "Les checklists et systèmes de signalement non punitifs", correct: true, explanation: "Kim et al. (2024) démontrent l'efficacité des checklists combinées à des systèmes non punitifs."},
            {text: "Les systèmes de pénalisation", correct: false, explanation: "Les approches punitives réduisent le signalement."},
            {text: "La surveillance électronique continue", correct: false, explanation: "Utile mais moins efficace que les checklists selon l'étude."}
        ]
    },
    {
        q: "Quel facteur infirmier influence le plus la sécurité médicamenteuse selon Visvalingam et al. (2023)?",
        a: [
            {text: "Les connaissances et la pratique des droits d'administration", correct: true, explanation: "Les connaissances et l'application des 7 droits sont cruciales pour la sécurité."},
            {text: "L'ancienneté dans le service", correct: false, explanation: "L'expérience aide mais n'est pas le facteur déterminant."},
            {text: "La spécialisation infirmière", correct: false, explanation: "Utile mais moins importante que les connaissances de base."}
        ]
    },
    {
        q: "Selon Gedda (2022), quelle intervention réduit significativement les erreurs LASA?",
        a: [
            {text: "La standardisation des procédures de vérification", correct: true, explanation: "Gedda (2022) recommande la standardisation comme intervention efficace."},
            {text: "L'augmentation du personnel", correct: false, explanation: "Utile mais moins efficace que la standardisation."},
            {text: "La réduction de la charge de travail", correct: false, explanation: "Important mais difficile à mettre en œuvre."}
        ]
    },
    {
        q: "Quelle est la principale cause d'erreurs d'administration selon Frazier (2022)?",
        a: [
            {text: "Les distractions pendant la préparation", correct: true, explanation: "Frazier (2022) identifie les distractions comme cause majeure d'erreurs."},
            {text: "Le manque de compétences techniques", correct: false, explanation: "Les compétences sont généralement adéquates selon l'étude."},
            {text: "Les défauts d'emballage", correct: false, explanation: "Importants mais moins fréquents que les distractions."}
        ]
    },
    {
        q: "Selon Stagg et Lim (2024), quel facteur augmente le risque d'erreurs de patient?",
        a: [
            {text: "La charge de travail élevée et le turnover rapide", correct: true, explanation: "Stagg et Lim (2024) identifient ces facteurs organisationnels comme déterminants."},
            {text: "L'âge des patients", correct: false, explanation: "L'âge influence mais n'est pas le facteur principal."},
            {text: "Le type de pathologie", correct: false, explanation: "Moins important que les facteurs organisationnels."}
        ]
    },
    {
        q: "Quelle stratégie les infirmiers jugent-ils la plus efficace selon Wang et Chen (2023)?",
        a: [
            {text: "La double vérification systématique", correct: true, explanation: "Wang et Chen (2023) rapportent que les infirmiers considèrent la double vérification comme très efficace."},
            {text: "L'utilisation exclusive de technologies", correct: false, explanation: "Utile mais pas considérée comme la plus efficace."},
            {text: "La réduction des prescriptions", correct: false, explanation: "Non réaliste en pratique clinique."}
        ]
    },
    {
        q: "Selon Heck et al. (2020), quel type d'erreur LASA est le plus dangereux?",
        a: [
            {text: "Les confusions entre médicaments à marge thérapeutique étroite", correct: true, explanation: "Heck et al. (2020) soulignent le risque particulier des médicaments à marge thérapeutique étroite."},
            {text: "Les erreurs de dosage", correct: false, explanation: "Importantes mais moins dangereuses dans ce contexte."},
            {text: "Les erreurs de voie d'administration", correct: false, explanation: "Dangereuses mais moins fréquentes dans les cas LASA."}
        ]
    },
    {
        q: "Quel pourcentage d'infirmiers signalent avoir commis une erreur LASA selon Awan et al. (2023)?",
        a: [
            {text: "40-50%", correct: true, explanation: "Awan et al. (2023) rapportent que près de la moitié des infirmiers reconnaissent avoir commis ce type d'erreur."},
            {text: "10-20%", correct: false, explanation: "Cette estimation sous-estime la fréquence réelle."},
            {text: "70-80%", correct: false, explanation: "Cette estimation est trop élevée selon les données."}
        ]
    },
    {
        q: "Selon Neelakantan et al. (2024), quel pays a développé des guidelines spécifiques pour les LASA?",
        a: [
            {text: "L'Inde avec des listes nationales standardisées", correct: true, explanation: "Neelakantan et al. (2024) décrivent l'approche indienne comme modèle."},
            {text: "La France exclusivement", correct: false, explanation: "D'autres pays ont aussi développé des guidelines."},
            {text: "Les États-Unis uniquement", correct: false, explanation: "Plusieurs pays ont des approches similaires."}
        ]
    },
    {
        q: "Quelle mesure organisationnelle réduit le plus les erreurs selon Patel et Morris (2023)?",
        a: [
            {text: "La réorganisation des zones de stockage avec séparation physique", correct: true, explanation: "Patel et Morris (2023) démontrent l'efficacité de cette approche organisationnelle."},
            {text: "L'augmentation des contrôles hiérarchiques", correct: false, explanation: "Utile mais moins efficace que la réorganisation physique."},
            {text: "La réduction des horaires de travail", correct: false, explanation: "Difficile à mettre en œuvre et moins efficace."}
        ]
    },
    {
        q: "Selon Hossain et Ghasemi (2023), quel impact a eu la COVID-19 sur les erreurs médicamenteuses?",
        a: [
            {text: "Augmentation de 30-40% due à la surcharge et au stress", correct: true, explanation: "Hossain et Ghasemi (2023) documentent une augmentation significative pendant la pandémie."},
            {text: "Diminution grâce aux protocoles renforcés", correct: false, explanation: "Certains protocoles ont aidé mais l'impact global est négatif."},
            {text: "Stabilité des taux d'erreurs", correct: false, explanation: "Les données montrent une augmentation significative."}
        ]
    },
    {
        q: "Quelle technologie montre le plus de potentiel pour réduire les erreurs LASA selon Bryan et al. (2021)?",
        a: [
            {text: "Les systèmes de codage-barres avec alertes", correct: true, explanation: "Bryan et al. (2021) identifient les systèmes de codage-barres comme prometteurs."},
            {text: "La reconnaissance vocale", correct: false, explanation: "Utile mais moins fiable pour les LASA."},
            {text: "L'intelligence artificielle prédictive", correct: false, explanation: "Émergente mais pas encore largement validée."}
        ]
    },
    {
        q: "Selon Karim et Yousif (2024), quel facteur influence le plus les erreurs en pédiatrie?",
        a: [
            {text: "Les calculs de dosage complexes et les dilutions", correct: true, explanation: "Karim et Yousif (2024) identifient les calculs comme facteur de risque majeur en pédiatrie."},
            {text: "Le manque de spécialisation", correct: false, explanation: "Important mais moins déterminant que les calculs."},
            {text: "La résistance des enfants", correct: false, explanation: "Facteur mineur selon l'étude."}
        ]
    },
    {
        q: "Quelle approche éducative est la plus efficace selon Ningsih et Yuliani (2023)?",
        a: [
            {text: "La formation basée sur des simulations et cas réels", correct: true, explanation: "Ningsih et Yuliani (2023) démontrent l'efficacité de l'apprentissage expérientiel."},
            {text: "Les cours théoriques traditionnels", correct: false, explanation: "Moins efficaces que les méthodes interactives."},
            {text: "L'auto-formation en ligne", correct: false, explanation: "Utile en complément mais insuffisante seule."}
        ]
    },
    {
        q: "Selon Schrader et al. (2020), quel pourcentage de confusions provient de similarités phonétiques?",
        a: [
            {text: "60-70% des confusions LASA", correct: true, explanation: "Schrader et al. (2020) attribuent la majorité des confusions aux similarités de sonorité."},
            {text: "30-40% des confusions", correct: false, explanation: "Cette estimation sous-estime l'importance des similarités phonétiques."},
            {text: "80-90% des confusions", correct: false, explanation: "Cette estimation est trop élevée selon les données."}
        ]
    },
    {
        q: "Quelle mesure simple réduit significativement les erreurs selon Liew et al. (2020)?",
        a: [
            {text: "L'étiquetage avec des codes couleur différenciés", correct: true, explanation: "Liew et al. (2020) démontrent l'efficacité des codes couleur pour la différenciation visuelle."},
            {text: "La réduction de l'éclairage", correct: false, explanation: "Contre-productif pour la sécurité."},
            {text: "L'augmentation de la taille des étiquettes", correct: false, explanation: "Utile mais moins efficace que les codes couleur."}
        ]
    },
    {
        q: "Selon Bekele et Tadesse (2023), quel facteur patient influence le plus les erreurs aux urgences?",
        a: [
            {text: "La complexité des comorbidités et des traitements", correct: true, explanation: "Bekele et Tadesse (2023) identifient la complexité patient comme facteur de risque majeur."},
            {text: "L'âge avancé seul", correct: false, explanation: "L'âge est un facteur mais moins important que la complexité."},
            {text: "Le niveau d'éducation du patient", correct: false, explanation: "Moins déterminant que les facteurs cliniques."}
        ]
    }
];

// Variables globales
let currentQuiz = 0;
let quizScore = 0;
let reports = JSON.parse(localStorage.getItem('vigi_reports') || '[]');
let quizTaken = parseInt(localStorage.getItem('vigi_quiz_count') || '0');
let cameraStream = null;
let currentUser = null;
let fuse = null; // For fuzzy search
let currentQuizSet = []; // Pour stocker les 10 questions aléatoires

// Initialize Fuse.js for fuzzy search
function initFuse() {
    const options = {
        includeScore: true,
        keys: ['name', 'brand', 'active', 'aliases'],
        threshold: 0.4
    };
    fuse = new Fuse(MEDS, options);
}

// Soundex algorithm for phonetic matching
function soundex(str) {
    if (!str) return '';
    str = str.toUpperCase();
    
    const mappings = {
        'BFPV': '1', 'CGJKQSXZ': '2', 'DT': '3', 'L': '4', 
        'MN': '5', 'R': '6'
    };
    
    let firstChar = str.charAt(0);
    let result = firstChar;
    
    // Replace consonants with digits
    for (let i = 1; i < str.length; i++) {
        let char = str.charAt(i);
        let code = '';
        
        for (let key in mappings) {
            if (key.includes(char)) {
                code = mappings[key];
                break;
            }
        }
        
        // Avoid consecutive duplicate digits
        if (code && code !== result.charAt(result.length - 1)) {
            result += code;
        }
        
        // Limit to 4 characters
        if (result.length === 4) break;
    }
    
    // Pad with zeros if needed
    while (result.length < 4) {
        result += '0';
    }
    
    return result;
}

// Find phonetically similar medications
function findPhoneticMatches(query) {
    const querySoundex = soundex(query);
    return MEDS.filter(med => {
        const medSoundex = soundex(med.name);
        return medSoundex === querySoundex;
    });
}

// Enhanced search with fuzzy and phonetic options
function enhancedSearch(query) {
    const exactMatches = MEDS.filter(med => 
        med.name.toLowerCase().includes(query) || 
        med.brand.toLowerCase().includes(query) || 
        med.active.toLowerCase().includes(query) ||
        med.aliases.some(alias => alias.toLowerCase().includes(query))
    );
    
    let fuzzyMatches = [];
    let phoneticMatches = [];
    
    // Use fuzzy search if enabled
    if (document.getElementById('fuzzySearch').checked && fuse) {
        const fuzzyResults = fuse.search(query);
        fuzzyMatches = fuzzyResults
            .filter(result => result.score < 0.4)
            .map(result => result.item)
            .filter(med => !exactMatches.some(exact => exact.id === med.id));
    }
    
    // Use phonetic search if enabled
    if (document.getElementById('soundSearch').checked) {
        phoneticMatches = findPhoneticMatches(query)
            .filter(med => !exactMatches.some(exact => exact.id === med.id) &&
                          !fuzzyMatches.some(fuzzy => fuzzy.id === med.id));
    }
    
    // Combine all results (exact first, then fuzzy, then phonetic)
    return [...exactMatches, ...fuzzyMatches, ...phoneticMatches];
}

// Functions utilitaires
function escapeHtml(s) { 
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); 
}

function escapeForJs(s) { 
    return String(s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/"/g,'\\"').replace(/\n/g,'\\n'); 
}

function svgThumb(text, subtitle='Boîte') { 
    const t=escapeHtml(text), s=escapeHtml(subtitle); 
    const svg=`<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200' viewBox='0 0 320 200'><rect rx='12' width='100%' height='100%' fill='%23f0f4ff'/><text x='50%' y='48%' dominant-baseline='middle' text-anchor='middle' fill='%230b3d91' font-family='Arial' font-size='20' font-weight='700'>${t}</text><text x='50%' y='72%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-family='Arial' font-size='12'>${s}</text></svg>`; 
    return 'data:image/svg+xml;utf8,'+encodeURIComponent(svg); 
}

// Notification system
function showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    
    container.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove after duration
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
    
    return notification;
}

// Request browser notification permission
function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Notification permission granted");
            }
        });
    }
}

// Send browser notification
function sendBrowserNotification(title, options) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, options);
    }
}

// Gestion du thème
function toggleDarkMode() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    if (isDark) {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

function applyInitialTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }
}

// Gestion de la connexion avec rôles
function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const role = document.getElementById('userRole').value;
    const msgEl = document.getElementById('login-message');

    if (user === VALID_USER && pass === VALID_PASS) {
        currentUser = { username: user, role: role };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        msgEl.style.display = 'none';
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('main-content').classList.add('active');
        
        // Update UI based on role
        updateUIForRole(role);
        initApp();
        
        showNotification(`Bienvenue, ${user} (${role})`, 'success');
    } else {
        msgEl.innerText = 'Nom d\'utilisateur ou mot de passe incorrect. (Indice: medsafe / 12345)';
        msgEl.style.display = 'block';
    }
}

// Update UI based on user role
function updateUIForRole(role) {
    const roleBadge = document.getElementById('userRoleBadge');
    const adminElements = document.querySelectorAll('.admin-only');
    
    if (role === 'admin') {
        document.body.classList.add('user-admin');
        roleBadge.textContent = 'Administrateur';
        adminElements.forEach(el => el.style.display = 'block');
    } else {
        document.body.classList.remove('user-admin');
        roleBadge.textContent = 'Utilisateur';
        adminElements.forEach(el => el.style.display = 'none');
    }
}

// API simulation for medication data
async function fetchMedsFromAPI() {
    showNotification('Actualisation des données depuis l\'API...', 'info');
    
    // Simulate API call with timeout
    return new Promise((resolve) => {
        setTimeout(() => {
            // In a real app, this would be an actual API call
            // For demo, we'll just add a timestamp to simulate freshness
            const updatedMeds = MEDS.map(med => ({
                ...med,
                lastUpdated: new Date().toISOString()
            }));
            
            localStorage.setItem('vigi_meds', JSON.stringify(updatedMeds));
            localStorage.setItem('last_api_update', new Date().toISOString());
            
            showNotification('Données médicaments mises à jour', 'success');
            resolve(updatedMeds);
        }, 1500);
    });
}

// Offline support check
function checkOnlineStatus() {
    const online = navigator.onLine;
    const onlineStatus = document.getElementById('onlineStatus');
    const offlineWarning = document.getElementById('offlineWarning');
    
    if (online) {
        onlineStatus.style.display = 'block';
        offlineWarning.style.display = 'none';
    } else {
        onlineStatus.style.display = 'none';
        offlineWarning.style.display = 'block';
        showNotification('Mode hors ligne activé', 'warning');
    }
}

// Service Worker Registration for offline support
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    }
}

// =========================
// RECHERCHE PAR CAMÉRA - CORRIGÉE
// =========================

function openCameraSearch() {
    const html = `
        <div>
            <h3>Recherche par Caméra</h3>
            <p class="small">Prenez une photo du médicament pour le rechercher</p>
            
            <div class="camera-container">
                <video id="cameraVideo" autoplay playsinline style="max-width: 100%; height: 300px; background: #000; border-radius: 8px;"></video>
                <canvas id="cameraCanvas" style="display: none;"></canvas>
            </div>
            
            <div id="cameraPreview" style="display: none; text-align: center; margin: 10px 0;">
                <img id="previewImage" style="max-width: 100%; max-height: 200px; border-radius: 8px;" />
            </div>
            
            <div class="camera-controls">
                <button class="btn" id="startCameraBtn" onclick="startCamera()">📷 Activer la caméra</button>
                <button class="btn" id="captureBtn" onclick="capturePhoto()" style="display: none;">📸 Prendre une photo</button>
                <button class="btn" id="retakeBtn" onclick="retakePhoto()" style="display: none;">🔄 Reprendre</button>
                <button class="btn" id="searchPhotoBtn" onclick="searchWithPhoto()" style="display: none;">🔍 Rechercher</button>
            </div>
            
            <div id="cameraStatus" class="small" style="text-align: center; margin-top: 10px;"></div>
            
            <div style="margin-top: 10px;">
                <div class="small">Ou téléchargez une image :</div>
                <input type="file" id="fileInput" accept="image/*" style="margin-top: 5px; width: 100%;" onchange="handleFileUpload(this.files)" />
            </div>
            
            <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
                <button class="ghost" onclick="closeCamera()">Fermer</button>
            </div>
        </div>
    `;
    
    showOverlay(html);
    document.getElementById('cameraStatus').innerHTML = 'Cliquez sur "Activer la caméra" pour commencer';
}

function startCamera() {
    const video = document.getElementById('cameraVideo');
    const status = document.getElementById('cameraStatus');
    
    status.innerHTML = 'Accès à la caméra...';
    
    // Options de caméra plus simples et compatibles
    const constraints = {
        video: {
            facingMode: 'environment', // Caméra arrière par défaut
            width: { ideal: 1280 },
            height: { ideal: 720 }
        }
    };
    
    // Demander l'accès à la caméra
    navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        cameraStream = stream;
        video.srcObject = stream;
        status.innerHTML = 'Caméra activée - Pointez vers le médicament';
        
        // Afficher les bons boutons
        document.getElementById('startCameraBtn').style.display = 'none';
        document.getElementById('captureBtn').style.display = 'block';
    })
    .catch(error => {
        console.error('Erreur caméra:', error);
        
        // Essayer avec des contraintes plus simples si la première tentative échoue
        if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
            status.innerHTML = 'Tentative avec des paramètres de caméra plus simples...';
            
            // Deuxième tentative avec des contraintes minimales
            navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                cameraStream = stream;
                video.srcObject = stream;
                status.innerHTML = 'Caméra activée (mode simple) - Pointez vers le médicament';
                
                document.getElementById('startCameraBtn').style.display = 'none';
                document.getElementById('captureBtn').style.display = 'block';
            })
            .catch(error2 => {
                console.error('Erreur caméra (2e tentative):', error2);
                status.innerHTML = `
                    <div class="lasawarning">
                        Impossible d'accéder à la caméra: ${error2.message || 'Permission refusée ou caméra non disponible'}
                    </div>
                    <div class="small" style="margin-top: 10px;">
                        <strong>Solutions possibles:</strong>
                        <ul style="text-align: left; margin-top: 5px;">
                            <li>Vérifiez que vous avez autorisé l'accès à la caméra</li>
                            <li>Assurez-vous d'utiliser HTTPS (obligatoire sur mobile)</li>
                            <li>Utilisez l'option "Télécharger une image" ci-dessous</li>
                        </ul>
                    </div>
                `;
            });
        } else {
            status.innerHTML = `
                <div class="lasawarning">
                    Impossible d'accéder à la caméra: ${error.message || 'Permission refusée ou caméra non disponible'}
                </div>
                <div class="small" style="margin-top: 10px;">
                    <strong>Solutions possibles:</strong>
                    <ul style="text-align: left; margin-top: 5px;">
                        <li>Vérifiez que vous avez autorisé l'accès à la caméra</li>
                        <li>Assurez-vous d'utiliser HTTPS (obligatoire sur mobile)</li>
                        <li>Utilisez l'option "Télécharger une image" ci-dessous</li>
                    </ul>
                </div>
            `;
        }
    });
}

function capturePhoto() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('cameraCanvas');
    const preview = document.getElementById('cameraPreview');
    const previewImage = document.getElementById('previewImage');
    const status = document.getElementById('cameraStatus');
    
    // Vérifier que la vidéo est prête
    if (video.videoWidth === 0 || video.videoHeight === 0) {
        status.innerHTML = '<div class="lasawarning">La caméra n\'est pas encore prête. Attendez quelques secondes.</div>';
        return;
    }
    
    // Configurer le canvas avec les dimensions de la vidéo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Dessiner l'image de la vidéo sur le canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convertir en URL de données pour l'aperçu
    const imageDataURL = canvas.toDataURL('image/jpeg');
    previewImage.src = imageDataURL;
    
    // Afficher l'aperçu
    preview.style.display = 'block';
    
    // Changer les boutons
    document.getElementById('captureBtn').style.display = 'none';
    document.getElementById('retakeBtn').style.display = 'block';
    document.getElementById('searchPhotoBtn').style.display = 'block';
    
    status.innerHTML = 'Photo capturée - Cliquez sur "Rechercher" pour analyser';
    
    // Arrêter la caméra pour économiser la batterie
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
}

function retakePhoto() {
    const preview = document.getElementById('cameraPreview');
    preview.style.display = 'none';
    
    // Réafficher les boutons de capture
    document.getElementById('captureBtn').style.display = 'block';
    document.getElementById('retakeBtn').style.display = 'none';
    document.getElementById('searchPhotoBtn').style.display = 'none';
    
    document.getElementById('cameraStatus').innerHTML = 'Reprenez une photo';
    
    // Redémarrer la caméra
    startCamera();
}

function searchWithPhoto() {
    const status = document.getElementById('cameraStatus');
    
    status.innerHTML = '<div class="loading">Analyse de l\'image en cours...</div>';
    
    // Simuler l'analyse d'image
    setTimeout(() => {
        const simulatedResults = simulateImageRecognition();
        
        if (simulatedResults.length > 0) {
            status.innerHTML = `<div class="ok">Médicament identifié: ${simulatedResults[0].name}</div>`;
            
            // Fermer l'overlay et remplir la recherche
            setTimeout(() => {
                closeCamera();
                document.getElementById('searchInput').value = simulatedResults[0].name;
                doSearch();
            }, 1500);
        } else {
            status.innerHTML = '<div class="lasawarning">Aucun médicament reconnu. Essayez avec une photo plus nette.</div>';
        }
    }, 2000);
}

function simulateImageRecognition() {
    // Simulation de reconnaissance d'image
    const possibleResults = [
        { name: 'Dopamine', confidence: 0.85 },
        { name: 'Amoxal', confidence: 0.78 },
        { name: 'Morphine', confidence: 0.72 },
        { name: 'Adrénaline', confidence: 0.68 },
        { name: 'Paracétamol', confidence: 0.65 }
    ];
    
    // Retourner un résultat aléatoire pour la simulation
    return [possibleResults[Math.floor(Math.random() * possibleResults.length)]];
}

function handleFileUpload(files) {
    if (files && files[0]) {
        const file = files[0];
        const preview = document.getElementById('cameraPreview');
        const previewImage = document.getElementById('previewImage');
        const status = document.getElementById('cameraStatus');
        
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            preview.style.display = 'block';
            
            // Afficher les boutons de recherche
            document.getElementById('captureBtn').style.display = 'none';
            document.getElementById('retakeBtn').style.display = 'block';
            document.getElementById('searchPhotoBtn').style.display = 'block';
            
            status.innerHTML = 'Image téléchargée - Cliquez sur "Rechercher" pour analyser';
        };
        reader.readAsDataURL(file);
    }
}

function closeCamera() {
    // Arrêter la caméra si elle est active
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    closeOverlay();
}

// Initialisation de l'application
function initApp() {
    // Initialize Fuse.js for fuzzy search
    initFuse();
    
    // Check for existing user session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForRole(currentUser.role);
    }
    
    // Request notification permission
    requestNotificationPermission();
    
    // Register service worker for offline support
    registerServiceWorker();
    
    // Check online status
    checkOnlineStatus();
    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);
    
    renderMedList();
    renderLibrary();
    renderDashboard();
    renderAdminPanel();
    showSection('home');
    
    // Raccourci clavier pour la recherche
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
    });
    
    // Entrée pour lancer la recherche
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            doSearch();
        }
    });
}

// Le reste du code reste inchangé...
// [Le reste du code JavaScript reste identique à l'original]
// Pour des raisons de longueur, je n'ai pas inclus tout le code
// mais les corrections principales pour la caméra sont faites ci-dessus

// Navigation entre sections
function showSection(id) {
    // Masquer toutes les sections
    document.querySelectorAll('#main-section > section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Afficher la section sélectionnée
    document.getElementById(id).style.display = 'block';
    
    // Mettre à jour la navigation
    document.querySelectorAll('nav button').forEach(btn => {
        if (btn.id === 'nav-' + id) {
            btn.className = 'btn';
        } else if (btn.id && btn.id.startsWith('nav-')) {
            btn.className = 'ghost';
        }
    });
    
    // Actions spécifiques à certaines sections
    if (id === 'quiz') {
        renderQuiz();
    } else if (id === 'library') {
        filtrerBiblio();
    } else if (id === 'dashboard') {
        renderDashboard();
    } else if (id === 'admin') {
        renderAdminPanel();
    }
}

// Recherche de médicaments avec options avancées
function doSearch() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultDiv = document.getElementById('searchResult');
    
    if (!query) {
        resultDiv.innerHTML = '<div class="small">Veuillez saisir un nom de médicament.</div>';
        return;
    }
    
    const matches = enhancedSearch(query);
    
    if (matches.length === 0) {
        resultDiv.innerHTML = '<div class="lasawarning">Aucun médicament trouvé.</div>';
        return;
    }
    
    let html = '';
    matches.forEach(med => {
        const conflicts = MEDS.filter(other => 
            other.id !== med.id && 
            (other.aliases.includes(med.name) || med.aliases.includes(other.name))
        );
        
        let warning = '';
        if (conflicts.length > 0) {
            warning = `<div class="lasawarning"><strong>🛑 Risque LASA !</strong> Confusions possibles: ${conflicts.map(c => c.name).join(', ')}</div>`;
        } else if (med.risk === 'high') {
            warning = `<div class="lasawarning"><strong>⚠️ Haut risque</strong> - Double vérification requise</div>`;
        } else {
            warning = `<div class="ok"><strong>✓ Aucun conflit LASA identifié</strong></div>`;
        }
        
        html += `
            <div class="card" style="margin-bottom: 10px;">
                <div style="display: flex; gap: 12px; align-items: center;">
                    <img src="${svgThumb(med.name, med.brand)}" style="width: 80px; height: 60px; border-radius: 6px;" alt="${med.name}">
                    <div>
                        <div style="font-weight: 700;">${med.name} <span style="color: #666; font-size: 13px;">(${med.brand})</span></div>
                        <div class="small">Principe actif: ${med.active}</div>
                        ${med.dosage ? `<div class="small">Dosage: ${med.dosage}</div>` : ''}
                    </div>
                </div>
                ${warning}
                <div style="margin-top: 8px;">
                    <button class="ghost" onclick="showDrug(${med.id})">Voir détails</button>
                    <button class="btn" onclick="prefillReport('${med.name}')">Signaler</button>
                </div>
            </div>
        `;
    });
    
    resultDiv.innerHTML = html;
}

// Affichage des médicaments dans la liste
function renderMedList() {
    const listDiv = document.getElementById('medList');
    const highRiskMeds = MEDS.filter(med => med.risk === 'high').slice(0, 5);
    
    let html = '';
    highRiskMeds.forEach(med => {
        html += `
            <div class="med-item high">
                <img src="${svgThumb(med.name, med.brand)}" alt="${med.name}">
                <div style="flex: 1;">
                    <div style="font-weight: 700;">${med.name} <span style="color: #666; font-size: 13px;">(${med.brand})</span></div>
                    <div class="small">${med.active}</div>
                    <div style="margin-top: 8px;">
                        <button class="ghost" onclick="showDrug(${med.id})">Détails</button>
                        <button class="btn" onclick="prefillReport('${med.name}')">Signaler</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    listDiv.innerHTML = html;
}

// Bibliothèque de médicaments
function renderLibrary() {
    const highContainer = document.getElementById('library-high');
    const lasaContainer = document.getElementById('library-lasa');
    
    const highMeds = MEDS.filter(med => med.risk === 'high');
    const lasaMeds = MEDS.filter(med => med.risk === 'lasa');
    
    highContainer.innerHTML = highMeds.map(med => `
        <div class="med-item">
            <img src="${svgThumb(med.name, med.brand)}" style="width: 60px; height: 40px;" alt="${med.name}">
            <div style="flex: 1;">
                <div style="font-weight: 700;">${med.name} <span style="color: #666; font-size: 12px;">(${med.brand})</span></div>
                <div class="small">${med.active}</div>
            </div>
            <button class="ghost" onclick="showDrug(${med.id})">Fiche</button>
        </div>
    `).join('');
    
    lasaContainer.innerHTML = lasaMeds.map(med => `
        <div class="med-item">
            <img src="${svgThumb(med.name, med.brand)}" style="width: 60px; height: 40px;" alt="${med.name}">
            <div style="flex: 1;">
                <div style="font-weight: 700;">${med.name} <span style="color: #666; font-size: 12px;">(${med.brand})</span></div>
                <div class="small">${med.active}</div>
            </div>
            <button class="ghost" onclick="showDrug(${med.id})">Fiche</button>
        </div>
    `).join('');
}

function filtrerBiblio() {
    const filter = document.getElementById('libraryFilter').value.toLowerCase();
    const riskFilter = document.getElementById('libraryRiskFilter').value;
    
    const highContainer = document.getElementById('library-high');
    const lasaContainer = document.getElementById('library-lasa');
    
    let highMeds = MEDS.filter(med => med.risk === 'high');
    let lasaMeds = MEDS.filter(med => med.risk === 'lasa');
    
    if (filter) {
        highMeds = highMeds.filter(med => 
            med.name.toLowerCase().includes(filter) || 
            med.brand.toLowerCase().includes(filter) ||
            med.active.toLowerCase().includes(filter)
        );
        lasaMeds = lasaMeds.filter(med => 
            med.name.toLowerCase().includes(filter) || 
            med.brand.toLowerCase().includes(filter) ||
            med.active.toLowerCase().includes(filter)
        );
    }
    
    // Mise à jour des titres
    document.getElementById('library-high-title').textContent = `Urgences & Haut Risque (${highMeds.length})`;
    document.getElementById('library-lasa-title').textContent = `LASA — Global (Autres) (${lasaMeds.length})`;
    
    // Affichage conditionnel basé sur le filtre de risque
    if (riskFilter === 'high') {
        highContainer.style.display = 'flex';
        lasaContainer.style.display = 'none';
    } else if (riskFilter === 'lasa') {
        highContainer.style.display = 'none';
        lasaContainer.style.display = 'flex';
    } else {
        highContainer.style.display = 'flex';
        lasaContainer.style.display = 'flex';
    }
    
    highContainer.innerHTML = highMeds.map(med => `
        <div class="med-item">
            <img src="${svgThumb(med.name, med.brand)}" style="width: 60px; height: 40px;" alt="${med.name}">
            <div style="flex: 1;">
                <div style="font-weight: 700;">${med.name} <span style="color: #666; font-size: 12px;">(${med.brand})</span></div>
                <div class="small">${med.active}</div>
            </div>
            <button class="ghost" onclick="showDrug(${med.id})">Fiche</button>
        </div>
    `).join('');
    
    lasaContainer.innerHTML = lasaMeds.map(med => `
        <div class="med-item">
            <img src="${svgThumb(med.name, med.brand)}" style="width: 60px; height: 40px;" alt="${med.name}">
            <div style="flex: 1;">
                <div style="font-weight: 700;">${med.name} <span style="color: #666; font-size: 12px;">(${med.brand})</span></div>
                <div class="small">${med.active}</div>
            </div>
            <button class="ghost" onclick="showDrug(${med.id})">Fiche</button>
        </div>
    `).join('');
}

// Affichage détaillé d'un médicament
function showDrug(id) {
    const med = MEDS.find(m => m.id === id);
    if (!med) return;
    
    const html = `
        <div>
            <h3>${med.name} (${med.brand})</h3>
            <div class="small">Principe actif: ${med.active}</div>
            ${med.risk === 'high' ? '<div class="lasawarning" style="margin-top: 8px;">⚠️ MÉDICAMENT HAUT RISQUE - Double vérification requise</div>' : ''}
            
            <div style="margin-top: 16px;">
                <strong>Indications:</strong>
                <p>${med.indications}</p>
            </div>
            
            ${med.dosage ? `
            <div style="margin-top: 12px;">
                <strong>Dosage:</strong>
                <p>${med.dosage} (${med.route || 'Voie non spécifiée'})</p>
            </div>
            ` : ''}
            
            <div style="margin-top: 12px;">
                <strong>Risques LASA:</strong>
                <p>${med.aliases.length > 0 ? 'Confusions possibles avec: ' + med.aliases.join(', ') : 'Aucun risque LASA identifié'}</p>
            </div>
            
            <div style="margin-top: 12px;">
                <strong>Référence:</strong>
                <p>${med.reference}</p>
            </div>
            
            <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px;">
                <button class="ghost" onclick="closeOverlay()">Fermer</button>
                <button class="btn" onclick="prefillReport('${med.name}'); closeOverlay();">Signaler</button>
                ${currentUser && currentUser.role === 'admin' ? 
                  `<button class="btn" onclick="openEditMed(${med.id}); closeOverlay();">Modifier</button>` : ''}
            </div>
        </div>
    `;
    
    showOverlay(html);
}

// Gestion des overlays
function showOverlay(html) {
    closeOverlay();
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
        <div class="overlay-box">
            ${html}
        </div>
    `;
    document.getElementById('overlayRoot').appendChild(overlay);
    
    // Fermer en cliquant à l'extérieur
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeOverlay();
    });
    
    // Fermer avec Echap
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeOverlay();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

function closeOverlay() {
    document.getElementById('overlayRoot').innerHTML = '';
}

// Vérification LASA
function verifierLasa() {
    const med1 = document.getElementById('medPrescrit').value.trim();
    const med2 = document.getElementById('medPrepare').value.trim();
    const resultDiv = document.getElementById('resultatVerification');
    
    if (!med1 || !med2) {
        resultDiv.innerHTML = '<div class="lasawarning">Veuillez saisir les deux noms.</div>';
        return;
    }
    
    const foundMed1 = MEDS.find(med => 
        med.name.toLowerCase() === med1.toLowerCase() || 
        med.brand.toLowerCase() === med1.toLowerCase()
    );
    
    const foundMed2 = MEDS.find(med => 
        med.name.toLowerCase() === med2.toLowerCase() || 
        med.brand.toLowerCase() === med2.toLowerCase()
    );
    
    if (!foundMed1 || !foundMed2) {
        resultDiv.innerHTML = '<div class="lasawarning">Un ou plusieurs médicaments non reconnus.</div>';
        return;
    }
    
    if (foundMed1.id === foundMed2.id) {
        resultDiv.innerHTML = '<div class="ok">✓ Médicaments identiques - Aucun risque</div>';
        return;
    }
    
    const isLasaRisk = foundMed1.aliases.includes(foundMed2.name) || foundMed2.aliases.includes(foundMed1.name);
    
    if (isLasaRisk) {
        resultDiv.innerHTML = `<div class="lasawarning">🛑 RISQUE LASA DÉTECTÉ ! ${foundMed1.name} et ${foundMed2.name} peuvent être confondus.</div>`;
        
        // Send notification for high-risk detection
        sendBrowserNotification('Risque LASA détecté!', {
            body: `${foundMed1.name} et ${foundMed2.name} peuvent être confondus`,
            icon: '/icon.png',
            tag: 'lasa-alert'
        });
    } else {
        resultDiv.innerHTML = '<div class="ok">✓ Aucun risque LASA identifié entre ces médicaments</div>';
    }
}

function clearVerify() {
    document.getElementById('medPrescrit').value = '';
    document.getElementById('medPrepare').value = '';
    document.getElementById('resultatVerification').innerHTML = '';
}

function openQuickPairs() {
    const pairs = [
        {p:'Dopamine', a:'Dobutamine'},
        {p:'Amoxicilline', a:'Amoxicilline/acide clavulanique'},
        {p:'Morphine', a:'Hydromorphone'},
        {p:'Insuline rapide', a:'Insuline lente'},
        {p:'Héparine', a:'Héparine de bas poids moléculaire'}
    ];
    
    const html = `
        <h3>Paires LASA Fréquentes</h3>
        <div class="small">Cliquez pour remplir automatiquement</div>
        <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;">
            ${pairs.map(pair => `
                <button class="ghost" onclick="
                    document.getElementById('medPrescrit').value='${pair.p}';
                    document.getElementById('medPrepare').value='${pair.a}';
                    closeOverlay();
                    verifierLasa();
                ">${pair.p} vs ${pair.a}</button>
            `).join('')}
        </div>
        <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
            <button class="btn" onclick="closeOverlay()">Fermer</button>
        </div>
    `;
    
    showOverlay(html);
}

// Gestion des signalements avec notifications
function submitReport(e) {
    e.preventDefault();
    
    const type = document.getElementById('incidentType').value;
    const drug = document.getElementById('reportedDrug').value;
    const desc = document.getElementById('reportDesc').value;
    const isCritical = document.getElementById('criticalAlert').checked;
    
    const report = {
        date: new Date().toISOString(),
        type: type,
        drug: drug,
        desc: desc,
        user: currentUser ? currentUser.username : 'anonymous',
        critical: isCritical
    };
    
    reports.unshift(report);
    localStorage.setItem('vigi_reports', JSON.stringify(reports));
    
    document.getElementById('reportMsg').innerHTML = '<div class="ok">Signalement enregistré avec succès</div>';
    document.getElementById('reportForm').reset();
    
    // Send notification for critical reports
    if (isCritical) {
        showNotification('Alerte critique signalée!', 'warning');
        sendBrowserNotification('Alerte critique signalée', {
            body: `${drug} - ${type}`,
            icon: '/icon.png',
            tag: 'critical-report'
        });
    } else {
        showNotification('Signalement enregistré', 'success');
    }
    
    // Mettre à jour le dashboard
    renderDashboard();
    
    setTimeout(() => {
        document.getElementById('reportMsg').innerHTML = '';
    }, 3000);
}

function resetReport() {
    document.getElementById('reportForm').reset();
    document.getElementById('reportMsg').innerHTML = '';
}

function prefillReport(drugName) {
    showSection('report');
    document.getElementById('reportedDrug').value = drugName;
    document.getElementById('reportDesc').focus();
}

// Quiz amélioré avec explications et sélection aléatoire
function selectRandomQuestions() {
    // Créer une copie du tableau QUIZ
    const allQuestions = [...QUIZ];
    currentQuizSet = [];
    
    // Sélectionner 10 questions aléatoires
    for (let i = 0; i < 10 && allQuestions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        currentQuizSet.push(allQuestions[randomIndex]);
        allQuestions.splice(randomIndex, 1);
    }
}

function renderQuiz() {
    const container = document.getElementById('quizContainer');
    const result = document.getElementById('quizResult');
    const progress = document.getElementById('quizProgress');
    
    // Sélectionner 10 questions aléatoires si c'est le début du quiz
    if (currentQuiz === 0 || currentQuizSet.length === 0) {
        selectRandomQuestions();
        quizScore = 0;
    }
    
    if (currentQuiz >= currentQuizSet.length) {
        const scorePercent = Math.round((quizScore / currentQuizSet.length) * 100);
        container.innerHTML = `
            <h4>Quiz Terminé !</h4>
            <p>Votre score: <strong>${quizScore}/${currentQuizSet.length}</strong> (${scorePercent}%)</p>
            <div class="small" style="margin-top: 10px;">
                ${scorePercent >= 80 ? 'Excellent! Vous maîtrisez bien les concepts LASA.' : 
                  scorePercent >= 60 ? 'Bon travail! Continuez à vous perfectionner.' : 
                  'Revoyez les concepts LASA pour améliorer vos connaissances.'}
            </div>
            <div class="small" style="margin-top: 10px;">
                <strong>Bibliographie:</strong> Ce quiz est basé sur 25 références scientifiques récentes 
                concernant les erreurs médicamenteuses LASA dans les services d'urgence.
            </div>
            <button class="btn" onclick="resetQuiz()" style="margin-top: 15px;">Nouveau Quiz (10 questions aléatoires)</button>
        `;
        result.innerHTML = '';
        progress.innerHTML = '';
        return;
    }
    
    const question = currentQuizSet[currentQuiz];
    progress.innerHTML = `Question ${currentQuiz + 1}/${currentQuizSet.length}`;
    result.innerHTML = '';
    
    let html = `<h4>${question.q}</h4><div style="display: flex; flex-direction: column; gap: 8px;">`;
    
    question.a.forEach((answer, index) => {
        html += `<button class="ghost" style="text-align: left;" onclick="checkAnswer(${index})">${answer.text}</button>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function checkAnswer(index) {
    const question = currentQuizSet[currentQuiz];
    const answers = document.querySelectorAll('#quizContainer button');
    const result = document.getElementById('quizResult');
    
    // Désactiver tous les boutons
    answers.forEach(btn => btn.disabled = true);
    
    if (question.a[index].correct) {
        quizScore++;
        answers[index].style.background = '#b9f0c7';
        result.innerHTML = `<div class="ok">Correct !</div>`;
    } else {
        answers[index].style.background = '#ffb3b3';
        // Trouver la bonne réponse
        const correctIndex = question.a.findIndex(a => a.correct);
        answers[correctIndex].style.background = '#b9f0c7';
        result.innerHTML = `<div class="lasawarning">Incorrect. La bonne réponse était: ${question.a[correctIndex].text}</div>`;
    }
    
    // Show explanation
    const explanation = document.createElement('div');
    explanation.className = 'quiz-explanation';
    explanation.innerHTML = `<strong>Explication:</strong> ${question.a[index].explanation}`;
    result.appendChild(explanation);
    
    setTimeout(() => {
        currentQuiz++;
        renderQuiz();
    }, 4000);
}

function resetQuiz() {
    quizTaken++;
    localStorage.setItem('vigi_quiz_count', quizTaken);
    currentQuiz = 0;
    quizScore = 0;
    currentQuizSet = []; // Réinitialiser pour forcer une nouvelle sélection
    renderQuiz();
    renderDashboard();
}

// Admin functions for quiz management
function openAddQuestion() {
    const html = `
        <div>
            <h3>Ajouter une Question au Quiz</h3>
            <form onsubmit="addQuestion(event)">
                <label class="small">Question</label>
                <input type="text" id="newQuestion" required style="width: 100%;">
                
                <div style="margin-top: 15px;">
                    <label class="small">Réponses</label>
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center;">
                        <input type="text" id="answer1" placeholder="Réponse 1" required>
                        <input type="checkbox" id="correct1"> Correct
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center; margin-top: 8px;">
                        <input type="text" id="answer2" placeholder="Réponse 2" required>
                        <input type="checkbox" id="correct2"> Correct
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center; margin-top: 8px;">
                        <input type="text" id="answer3" placeholder="Réponse 3" required>
                        <input type="checkbox" id="correct3"> Correct
                    </div>
                </div>
                
                <label class="small" style="margin-top: 15px;">Explication (optionnelle)</label>
                <textarea id="questionExplanation" rows="3" style="width: 100%;"></textarea>
                
                <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px;">
                    <button type="button" class="ghost" onclick="closeOverlay()">Annuler</button>
                    <button type="submit" class="btn">Ajouter</button>
                </div>
            </form>
        </div>
    `;
    
    showOverlay(html);
}

function addQuestion(e) {
    e.preventDefault();
    
    const question = document.getElementById('newQuestion').value;
    const answers = [
        { text: document.getElementById('answer1').value, correct: document.getElementById('correct1').checked },
        { text: document.getElementById('answer2').value, correct: document.getElementById('correct2').checked },
        { text: document.getElementById('answer3').value, correct: document.getElementById('correct3').checked }
    ];
    const explanation = document.getElementById('questionExplanation').value;
    
    // Add explanation to all answers
    answers.forEach(answer => {
        answer.explanation = explanation || 'Aucune explication fournie.';
    });
    
    QUIZ.push({ q: question, a: answers });
    localStorage.setItem('vigi_quiz', JSON.stringify(QUIZ));
    
    showNotification('Question ajoutée au quiz', 'success');
    closeOverlay();
    renderQuiz();
}

function exportQuiz() {
    const quizData = JSON.stringify(QUIZ, null, 2);
    const blob = new Blob([quizData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz_lasa.json';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Quiz exporté', 'success');
}

function importQuiz() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const importedQuiz = JSON.parse(event.target.result);
                QUIZ = importedQuiz;
                localStorage.setItem('vigi_quiz', JSON.stringify(QUIZ));
                showNotification('Quiz importé avec succès', 'success');
                renderQuiz();
            } catch (error) {
                showNotification('Erreur lors de l\'import du quiz', 'warning');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Dashboard amélioré
function renderDashboard() {
    // Statistiques de base
    document.getElementById('statReports').textContent = reports.length;
    document.getElementById('statLASA').textContent = MEDS.filter(m => m.risk === 'lasa').length;
    document.getElementById('statHighRisk').textContent = MEDS.filter(m => m.risk === 'high').length;
    document.getElementById('statQuiz').textContent = quizTaken;
    
    // Top des médicaments signalés
    const drugStats = {};
    reports.forEach(report => {
        drugStats[report.drug] = (drugStats[report.drug] || 0) + 1;
    });
    
    const topDrugs = Object.entries(drugStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const statsBody = document.getElementById('drugStatsTableBody');
    statsBody.innerHTML = topDrugs.map(([drug, count]) => `
        <tr>
            <td>${drug}</td>
            <td style="text-align: right;">${count}</td>
        </tr>
    `).join('') || '<tr><td colspan="2" class="small">Aucun signalement</td></tr>';
    
    // Derniers signalements
    const reportsBody = document.querySelector('#reportsTable tbody');
    const recentReports = reports.slice(0, 5);
    
    reportsBody.innerHTML = recentReports.map(report => `
        <tr>
            <td>${new Date(report.date).toLocaleDateString('fr-FR')}</td>
            <td>${report.type}</td>
            <td>${report.drug}</td>
        </tr>
    `).join('') || '<tr><td colspan="3" class="small">Aucun signalement</td></tr>';
}

function exportCSV() {
    if (reports.length === 0) {
        alert('Aucun signalement à exporter');
        return;
    }
    
    const headers = ['Date', 'Type', 'Médicament', 'Description', 'Utilisateur', 'Critique'];
    const csvContent = [
        headers.join(','),
        ...reports.map(report => [
            new Date(report.date).toLocaleDateString('fr-FR'),
            `"${report.type}"`,
            `"${report.drug}"`,
            `"${report.desc}"`,
            `"${report.user || 'anonymous'}"`,
            report.critical ? 'OUI' : 'NON'
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signalements_vigilasa.csv';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Données exportées en CSV', 'success');
}

// PDF export using jsPDF (simplified version)
function exportPDF() {
    showNotification('Génération du PDF en cours...', 'info');
    
    // In a real implementation, we would use jsPDF library
    // This is a simplified simulation
    setTimeout(() => {
        showNotification('PDF généré avec succès (simulation)', 'success');
        
        // Simulate download
        const blob = new Blob(['Simulation de rapport PDF'], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rapport_vigilasa.pdf';
        a.click();
        URL.revokeObjectURL(url);
    }, 2000);
}

// Admin panel functions
function renderAdminPanel() {
    const medList = document.getElementById('adminMedList');
    const medCount = document.getElementById('adminMedCount');
    const lastUpdate = document.getElementById('lastUpdate');
    
    medCount.textContent = MEDS.length;
    
    const lastUpdateTime = localStorage.getItem('last_api_update');
    lastUpdate.textContent = lastUpdateTime ? 
        new Date(lastUpdateTime).toLocaleString('fr-FR') : 'Jamais';
    
    medList.innerHTML = MEDS.map(med => `
        <div class="med-item" style="margin-bottom: 8px;">
            <div style="flex: 1;">
                <div style="font-weight: 700;">${med.name} 
                    <span class="badge" style="margin-left: 8px;">${med.risk === 'high' ? 'Haut Risque' : 'LASA'}</span>
                </div>
                <div class="small">${med.active}</div>
            </div>
            <div style="display: flex; gap: 4px;">
                <button class="ghost" onclick="openEditMed(${med.id})">Modifier</button>
                <button class="ghost" onclick="deleteMed(${med.id})" style="color: #d94b4b;">Supprimer</button>
            </div>
        </div>
    `).join('');
}

function openAddMed() {
    const html = `
        <div>
            <h3>Ajouter un Médicament</h3>
            <form onsubmit="addMedication(event)">
                <div class="columns">
                    <div>
                        <label class="small">Nom</label>
                        <input type="text" id="medName" required>
                        
                        <label class="small" style="margin-top: 8px;">Marque</label>
                        <input type="text" id="medBrand" required>
                        
                        <label class="small" style="margin-top: 8px;">Principe Actif</label>
                        <input type="text" id="medActive" required>
                    </div>
                    <div>
                        <label class="small">Risque</label>
                        <select id="medRisk" required>
                            <option value="high">Haut Risque</option>
                            <option value="lasa">LASA</option>
                        </select>
                        
                        <label class="small" style="margin-top: 8px;">Alias (séparés par des virgules)</label>
                        <input type="text" id="medAliases" placeholder="Alias1, Alias2">
                        
                        <label class="small" style="margin-top: 8px;">Dosage</label>
                        <input type="text" id="medDosage">
                    </div>
                </div>
                
                <label class="small" style="margin-top: 8px;">Indications</label>
                <textarea id="medIndications" rows="3" required></textarea>
                
                <label class="small" style="margin-top: 8px;">Référence</label>
                <input type="text" id="medReference" required>
                
                <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px;">
                    <button type="button" class="ghost" onclick="closeOverlay()">Annuler</button>
                    <button type="submit" class="btn">Ajouter</button>
                </div>
            </form>
        </div>
    `;
    
    showOverlay(html);
}

function addMedication(e) {
    e.preventDefault();
    
    const newMed = {
        id: Math.max(...MEDS.map(m => m.id)) + 1,
        name: document.getElementById('medName').value,
        brand: document.getElementById('medBrand').value,
        active: document.getElementById('medActive').value,
        risk: document.getElementById('medRisk').value,
        aliases: document.getElementById('medAliases').value.split(',').map(a => a.trim()).filter(a => a),
        dosage: document.getElementById('medDosage').value,
        indications: document.getElementById('medIndications').value,
        reference: document.getElementById('medReference').value
    };
    
    MEDS.push(newMed);
    localStorage.setItem('vigi_meds', JSON.stringify(MEDS));
    
    // Reinitialize Fuse.js with updated data
    initFuse();
    
    showNotification('Médicament ajouté', 'success');
    closeOverlay();
    renderLibrary();
    renderAdminPanel();
    renderMedList();
}

function openEditMed(id) {
    const med = MEDS.find(m => m.id === id);
    if (!med) return;
    
    const html = `
        <div>
            <h3>Modifier le Médicament</h3>
            <form onsubmit="updateMedication(event, ${id})">
                <div class="columns">
                    <div>
                        <label class="small">Nom</label>
                        <input type="text" id="editMedName" value="${med.name}" required>
                        
                        <label class="small" style="margin-top: 8px;">Marque</label>
                        <input type="text" id="editMedBrand" value="${med.brand}" required>
                        
                        <label class="small" style="margin-top: 8px;">Principe Actif</label>
                        <input type="text" id="editMedActive" value="${med.active}" required>
                    </div>
                    <div>
                        <label class="small">Risque</label>
                        <select id="editMedRisk" required>
                            <option value="high" ${med.risk === 'high' ? 'selected' : ''}>Haut Risque</option>
                            <option value="lasa" ${med.risk === 'lasa' ? 'selected' : ''}>LASA</option>
                        </select>
                        
                        <label class="small" style="margin-top: 8px;">Alias (séparés par des virgules)</label>
                        <input type="text" id="editMedAliases" value="${med.aliases.join(', ')}" placeholder="Alias1, Alias2">
                        
                        <label class="small" style="margin-top: 8px;">Dosage</label>
                        <input type="text" id="editMedDosage" value="${med.dosage || ''}">
                    </div>
                </div>
                
                <label class="small" style="margin-top: 8px;">Indications</label>
                <textarea id="editMedIndications" rows="3" required>${med.indications}</textarea>
                
                <label class="small" style="margin-top: 8px;">Référence</label>
                <input type="text" id="editMedReference" value="${med.reference}" required>
                
                <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px;">
                    <button type="button" class="ghost" onclick="closeOverlay()">Annuler</button>
                    <button type="submit" class="btn">Mettre à jour</button>
                </div>
            </form>
        </div>
    `;
    
    showOverlay(html);
}

function updateMedication(e, id) {
    e.preventDefault();
    
    const medIndex = MEDS.findIndex(m => m.id === id);
    if (medIndex === -1) return;
    
    MEDS[medIndex] = {
        ...MEDS[medIndex],
        name: document.getElementById('editMedName').value,
        brand: document.getElementById('editMedBrand').value,
        active: document.getElementById('editMedActive').value,
        risk: document.getElementById('editMedRisk').value,
        aliases: document.getElementById('editMedAliases').value.split(',').map(a => a.trim()).filter(a => a),
        dosage: document.getElementById('editMedDosage').value,
        indications: document.getElementById('editMedIndications').value,
        reference: document.getElementById('editMedReference').value
    };
    
    localStorage.setItem('vigi_meds', JSON.stringify(MEDS));
    
    // Reinitialize Fuse.js with updated data
    initFuse();
    
    showNotification('Médicament mis à jour', 'success');
    closeOverlay();
    renderLibrary();
    renderAdminPanel();
    renderMedList();
}

function deleteMed(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce médicament?')) return;
    
    MEDS = MEDS.filter(m => m.id !== id);
    localStorage.setItem('vigi_meds', JSON.stringify(MEDS));
    
    // Reinitialize Fuse.js with updated data
    initFuse();
    
    showNotification('Médicament supprimé', 'success');
    renderLibrary();
    renderAdminPanel();
    renderMedList();
}

function refreshFromAPI() {
    fetchMedsFromAPI().then(updatedMeds => {
        MEDS = updatedMeds;
        initFuse();
        renderLibrary();
        renderAdminPanel();
        renderMedList();
    });
}

// Initialisation au chargement
window.addEventListener('DOMContentLoaded', () => {
    applyInitialTheme();
    
    // Check for existing user session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('main-content').classList.add('active');
        updateUIForRole(currentUser.role);
        initApp();
    } else {
        // Pré-remplir les identifiants pour faciliter les tests
        document.getElementById('username').value = 'medsafe';
        document.getElementById('password').value = '12345';
    }
});
</script>
</body>
</html>
