// Full UI translation dictionary. Six languages, chosen on first launch,
// changeable later in Settings: English, Croatian, Spanish, German, French, Italian.
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hr', label: 'Hrvatski' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'it', label: 'Italiano' },
];

const en = {
  nav_court: 'Court', nav_leagues: 'Leagues', nav_chat: 'Chat', nav_profile: 'Profile',

  auth_welcome_title: 'Pickup basketball, organised.',
  auth_welcome_sub: 'Find hoopers near you, run leagues, track your shot.',
  auth_email: 'Email', auth_password: 'Password',
  auth_sign_in: 'Sign in', auth_sign_up: 'Create account', auth_or: 'or',
  auth_continue_google: 'Continue with Google',
  auth_email_link: 'Email me a sign-in link',
  auth_email_link_sent: 'Check your email for a sign-in link.',
  auth_choose_language: 'Choose your language',
  auth_no_account: "Don't have an account?", auth_have_account: 'Already have an account?',

  common_save: 'Save', common_cancel: 'Cancel', common_delete: 'Delete',
  common_loading: 'Loading…', common_search: 'Search', common_close: 'Close',
  common_send: 'Send', common_create: 'Create', common_join: 'Join',
  common_confirm: 'Confirm', common_dispute: 'Dispute', common_back: 'Back',
  common_settings: 'Settings', common_signout: 'Sign out',
  common_install_app: 'Add Hoops to your home screen',
  common_install_ios_hint: 'Tap Share, then "Add to Home Screen".',
  common_edit: 'Edit', common_add: 'Add', common_none: 'Nothing here yet',
  common_error_generic: 'Something went wrong. Try again.',

  court_title: 'Court', court_courts_near: 'Courts near you', court_players_near: 'Players near you',
  court_checkin: 'Check in', court_checkout: 'Check out', court_call_sesh: 'Call for a hoop sesh',
  court_hoopers_now: 'hooping now', court_away_km: 'km away',
  court_no_courts: 'No courts found nearby yet.', court_invite_sent: 'Invite sent.',
  court_verify_badge: 'games to verify',

  league_title: 'Leagues', league_create: 'Create league', league_join: 'Join league',
  league_join_code: 'Join code', league_leaderboard: 'Leaderboard', league_teams: 'Teams',
  league_games: 'Games', league_log_game: 'Log a game', league_chat: 'League chat',
  league_members: 'Members', league_owner: 'Owner', league_win_loss: 'W–L',
  league_win_pct: 'Win %', league_ppg: 'PPG', league_rpg: 'RPG', league_apg: 'APG',
  league_spg: 'SPG', league_bpg: 'BPG', league_format: 'Format', league_pick_format: 'Pick a format',
  league_pick_teams: 'Set teams', league_score: 'Score', league_your_leagues: 'Your leagues',
  league_no_leagues: "You haven't joined a league yet.",
  league_invite_link: 'Invite link', league_copy_link: 'Copy link',
  league_joined_message: 'joined the league',

  verify_title: 'Verify game', verify_score_required: 'Confirm the score',
  verify_stats_optional: 'Confirm stats (optional)', verify_approve: 'Approve',
  verify_dispute_note: 'Explain what looks wrong', verify_pending: 'Waiting on other players',

  chat_title: 'Chat', chat_direct: 'Direct', chat_leagues: 'Leagues',
  chat_new_message: 'Message', chat_attach_photo: 'Attach photo', chat_no_messages: 'No messages yet.',

  profile_title: 'Profile', profile_playstyle: 'Playstyle', profile_height: 'Height',
  profile_vertical: 'Vertical', profile_weight: 'Weight', profile_offense: 'Offense',
  profile_defense: 'Defense', profile_badges: 'Badges', profile_shot_rating: 'Shot rating',
  profile_three_pt: '3PT', profile_mid_range: 'Mid-range', profile_shot_chart: 'Shot chart',
  profile_rate_player: 'Rate this player', profile_recent_ratings: 'Ratings you\u2019ve given',
  profile_bronze: 'Bronze', profile_silver: 'Silver', profile_gold: 'Gold', profile_hof: 'Hall of Fame',
  profile_edit: 'Edit profile',

  drills_title: 'Shooting drills', drills_log_session: 'Log a session', drills_history: 'History',
  drills_makes: 'Makes', drills_attempts: 'Attempts',
  drills_spot_corner3: 'Corner three', drills_spot_wing3: 'Wing three', drills_spot_top_key: 'Top of the key',
  drills_spot_deep_left: 'Deep three (left)', drills_spot_deep_top: 'Deep three (top)',
  drills_spot_deep_right: 'Deep three (right)', drills_spot_elbow: 'Mid-range elbow',
  drills_spot_baseline: 'Mid-range baseline', drills_spot_ft: 'Free throw', drills_spot_paint: 'Paint',
  drills_session_saved: 'Session saved',

  settings_title: 'Settings', settings_language: 'Language', settings_theme: 'Theme',
  settings_light: 'Light', settings_dark: 'Dark', settings_radius: 'Search radius',
  settings_alert_threshold: 'Court-alert threshold', settings_notifications: 'Push notifications',
  settings_enable_push: 'Enable notifications', settings_push_enabled: 'Notifications on',

  notif_court_surge: 'is filling up', notif_verify_game: 'logged a game with you',
  notif_league_join: 'joined via your invite link', notif_hoop_sesh: 'is calling you for a hoop sesh',
};

const hr = {
  nav_court: 'Teren', nav_leagues: 'Lige', nav_chat: 'Poruke', nav_profile: 'Profil',

  auth_welcome_title: 'Uličarska košarka, organizirano.',
  auth_welcome_sub: 'Pronađi igrače u blizini, vodi lige, prati svoj šut.',
  auth_email: 'Email', auth_password: 'Lozinka',
  auth_sign_in: 'Prijava', auth_sign_up: 'Napravi račun', auth_or: 'ili',
  auth_continue_google: 'Nastavi s Googleom',
  auth_email_link: 'Pošalji mi link za prijavu',
  auth_email_link_sent: 'Provjeri email za link za prijavu.',
  auth_choose_language: 'Odaberi jezik',
  auth_no_account: 'Nemaš račun?', auth_have_account: 'Već imaš račun?',

  common_save: 'Spremi', common_cancel: 'Odustani', common_delete: 'Izbriši',
  common_loading: 'Učitavanje…', common_search: 'Pretraži', common_close: 'Zatvori',
  common_send: 'Pošalji', common_create: 'Kreiraj', common_join: 'Pridruži se',
  common_confirm: 'Potvrdi', common_dispute: 'Osporavaj', common_back: 'Natrag',
  common_settings: 'Postavke', common_signout: 'Odjava',
  common_install_app: 'Dodaj Hoops na početni zaslon',
  common_install_ios_hint: 'Dodirni Podijeli, zatim "Dodaj na početni zaslon".',
  common_edit: 'Uredi', common_add: 'Dodaj', common_none: 'Ovdje još ništa nema',
  common_error_generic: 'Nešto je pošlo po zlu. Pokušaj ponovno.',

  court_title: 'Teren', court_courts_near: 'Tereni u blizini', court_players_near: 'Igrači u blizini',
  court_checkin: 'Prijava na teren', court_checkout: 'Odjava s terena', court_call_sesh: 'Pozovi na igru',
  court_hoopers_now: 'igra sad', court_away_km: 'km udaljeno',
  court_no_courts: 'Još nema terena u blizini.', court_invite_sent: 'Poziv poslan.',
  court_verify_badge: 'utakmica za potvrdu',

  league_title: 'Lige', league_create: 'Kreiraj ligu', league_join: 'Pridruži se ligi',
  league_join_code: 'Kod za pridruživanje', league_leaderboard: 'Ljestvica', league_teams: 'Ekipe',
  league_games: 'Utakmice', league_log_game: 'Unesi utakmicu', league_chat: 'Chat lige',
  league_members: 'Članovi', league_owner: 'Vlasnik', league_win_loss: 'Pob–Por',
  league_win_pct: '% pobjeda', league_ppg: 'Poeni/ut', league_rpg: 'Skok/ut', league_apg: 'Ass/ut',
  league_spg: 'Ukr/ut', league_bpg: 'Blok/ut', league_format: 'Format', league_pick_format: 'Odaberi format',
  league_pick_teams: 'Postavi ekipe', league_score: 'Rezultat', league_your_leagues: 'Tvoje lige',
  league_no_leagues: 'Još se nisi pridružio nijednoj ligi.',
  league_invite_link: 'Link za poziv', league_copy_link: 'Kopiraj link',
  league_joined_message: 'pridružio se ligi',

  verify_title: 'Potvrdi utakmicu', verify_score_required: 'Potvrdi rezultat',
  verify_stats_optional: 'Potvrdi statistiku (opcionalno)', verify_approve: 'Odobri',
  verify_dispute_note: 'Objasni što nije u redu', verify_pending: 'Čeka se na ostale igrače',

  chat_title: 'Poruke', chat_direct: 'Izravno', chat_leagues: 'Lige',
  chat_new_message: 'Poruka', chat_attach_photo: 'Dodaj fotografiju', chat_no_messages: 'Još nema poruka.',

  profile_title: 'Profil', profile_playstyle: 'Stil igre', profile_height: 'Visina',
  profile_vertical: 'Skok', profile_weight: 'Težina', profile_offense: 'Napad',
  profile_defense: 'Obrana', profile_badges: 'Značke', profile_shot_rating: 'Ocjena šuta',
  profile_three_pt: 'Trica', profile_mid_range: 'Srednja udaljenost', profile_shot_chart: 'Karta šuteva',
  profile_rate_player: 'Ocijeni igrača', profile_recent_ratings: 'Ocjene koje si dao/la',
  profile_bronze: 'Brončana', profile_silver: 'Srebrna', profile_gold: 'Zlatna', profile_hof: 'Kuća slavnih',
  profile_edit: 'Uredi profil',

  drills_title: 'Trening šuta', drills_log_session: 'Unesi trening', drills_history: 'Povijest',
  drills_makes: 'Pogoci', drills_attempts: 'Pokušaji',
  drills_spot_corner3: 'Kutna trica', drills_spot_wing3: 'Krilna trica', drills_spot_top_key: 'Vrh reketa',
  drills_spot_deep_left: 'Duboka trica (lijevo)', drills_spot_deep_top: 'Duboka trica (sredina)',
  drills_spot_deep_right: 'Duboka trica (desno)', drills_spot_elbow: 'Srednja udaljenost (lakat)',
  drills_spot_baseline: 'Srednja udaljenost (osnovna linija)', drills_spot_ft: 'Slobodno bacanje',
  drills_spot_paint: 'Reket', drills_session_saved: 'Trening spremljen',

  settings_title: 'Postavke', settings_language: 'Jezik', settings_theme: 'Tema',
  settings_light: 'Svijetla', settings_dark: 'Tamna', settings_radius: 'Radijus pretrage',
  settings_alert_threshold: 'Prag za obavijest o terenu', settings_notifications: 'Push obavijesti',
  settings_enable_push: 'Omogući obavijesti', settings_push_enabled: 'Obavijesti uključene',

  notif_court_surge: 'se puni', notif_verify_game: 'je unio/unijela utakmicu s tobom',
  notif_league_join: 'pridružio se preko tvog linka', notif_hoop_sesh: 'te zove na igru',
};

const es = {
  nav_court: 'Cancha', nav_leagues: 'Ligas', nav_chat: 'Chat', nav_profile: 'Perfil',

  auth_welcome_title: 'Baloncesto callejero, organizado.',
  auth_welcome_sub: 'Encuentra jugadores cerca, organiza ligas, mejora tu tiro.',
  auth_email: 'Correo', auth_password: 'Contraseña',
  auth_sign_in: 'Iniciar sesión', auth_sign_up: 'Crear cuenta', auth_or: 'o',
  auth_continue_google: 'Continuar con Google',
  auth_email_link: 'Enviarme un enlace de acceso',
  auth_email_link_sent: 'Revisa tu correo para el enlace de acceso.',
  auth_choose_language: 'Elige tu idioma',
  auth_no_account: '¿No tienes cuenta?', auth_have_account: '¿Ya tienes cuenta?',

  common_save: 'Guardar', common_cancel: 'Cancelar', common_delete: 'Eliminar',
  common_loading: 'Cargando…', common_search: 'Buscar', common_close: 'Cerrar',
  common_send: 'Enviar', common_create: 'Crear', common_join: 'Unirse',
  common_confirm: 'Confirmar', common_dispute: 'Disputar', common_back: 'Atrás',
  common_settings: 'Ajustes', common_signout: 'Cerrar sesión',
  common_install_app: 'Añade Hoops a tu pantalla de inicio',
  common_install_ios_hint: 'Toca Compartir y luego "Añadir a pantalla de inicio".',
  common_edit: 'Editar', common_add: 'Añadir', common_none: 'Todavía no hay nada aquí',
  common_error_generic: 'Algo salió mal. Inténtalo de nuevo.',

  court_title: 'Cancha', court_courts_near: 'Canchas cerca de ti', court_players_near: 'Jugadores cerca de ti',
  court_checkin: 'Registrarse', court_checkout: 'Salir', court_call_sesh: 'Convocar una pachanga',
  court_hoopers_now: 'jugando ahora', court_away_km: 'km de distancia',
  court_no_courts: 'Aún no hay canchas cerca.', court_invite_sent: 'Invitación enviada.',
  court_verify_badge: 'partidos por verificar',

  league_title: 'Ligas', league_create: 'Crear liga', league_join: 'Unirse a una liga',
  league_join_code: 'Código de acceso', league_leaderboard: 'Clasificación', league_teams: 'Equipos',
  league_games: 'Partidos', league_log_game: 'Registrar partido', league_chat: 'Chat de la liga',
  league_members: 'Miembros', league_owner: 'Propietario', league_win_loss: 'G–P',
  league_win_pct: '% victorias', league_ppg: 'PPP', league_rpg: 'RPP', league_apg: 'APP',
  league_spg: 'RPP rob.', league_bpg: 'TPP', league_format: 'Formato', league_pick_format: 'Elige un formato',
  league_pick_teams: 'Definir equipos', league_score: 'Marcador', league_your_leagues: 'Tus ligas',
  league_no_leagues: 'Aún no te has unido a ninguna liga.',
  league_invite_link: 'Enlace de invitación', league_copy_link: 'Copiar enlace',
  league_joined_message: 'se unió a la liga',

  verify_title: 'Verificar partido', verify_score_required: 'Confirma el marcador',
  verify_stats_optional: 'Confirma las estadísticas (opcional)', verify_approve: 'Aprobar',
  verify_dispute_note: 'Explica qué está mal', verify_pending: 'Esperando a otros jugadores',

  chat_title: 'Chat', chat_direct: 'Directo', chat_leagues: 'Ligas',
  chat_new_message: 'Mensaje', chat_attach_photo: 'Adjuntar foto', chat_no_messages: 'Aún no hay mensajes.',

  profile_title: 'Perfil', profile_playstyle: 'Estilo de juego', profile_height: 'Altura',
  profile_vertical: 'Salto vertical', profile_weight: 'Peso', profile_offense: 'Ataque',
  profile_defense: 'Defensa', profile_badges: 'Insignias', profile_shot_rating: 'Valoración de tiro',
  profile_three_pt: 'Triples', profile_mid_range: 'Media distancia', profile_shot_chart: 'Mapa de tiros',
  profile_rate_player: 'Valorar a este jugador', profile_recent_ratings: 'Valoraciones que has dado',
  profile_bronze: 'Bronce', profile_silver: 'Plata', profile_gold: 'Oro', profile_hof: 'Salón de la fama',
  profile_edit: 'Editar perfil',

  drills_title: 'Ejercicios de tiro', drills_log_session: 'Registrar sesión', drills_history: 'Historial',
  drills_makes: 'Aciertos', drills_attempts: 'Intentos',
  drills_spot_corner3: 'Triple de esquina', drills_spot_wing3: 'Triple de ala', drills_spot_top_key: 'Parte alta de la zona',
  drills_spot_deep_left: 'Triple lejano (izquierda)', drills_spot_deep_top: 'Triple lejano (centro)',
  drills_spot_deep_right: 'Triple lejano (derecha)', drills_spot_elbow: 'Media distancia (codo)',
  drills_spot_baseline: 'Media distancia (línea de fondo)', drills_spot_ft: 'Tiro libre', drills_spot_paint: 'Zona pintada',
  drills_session_saved: 'Sesión guardada',

  settings_title: 'Ajustes', settings_language: 'Idioma', settings_theme: 'Tema',
  settings_light: 'Claro', settings_dark: 'Oscuro', settings_radius: 'Radio de búsqueda',
  settings_alert_threshold: 'Umbral de alerta de cancha', settings_notifications: 'Notificaciones push',
  settings_enable_push: 'Activar notificaciones', settings_push_enabled: 'Notificaciones activadas',

  notif_court_surge: 'se está llenando', notif_verify_game: 'registró un partido contigo',
  notif_league_join: 'se unió con tu enlace de invitación', notif_hoop_sesh: 'te está convocando a una pachanga',
};

const de = {
  nav_court: 'Platz', nav_leagues: 'Ligen', nav_chat: 'Chat', nav_profile: 'Profil',

  auth_welcome_title: 'Streetball, organisiert.',
  auth_welcome_sub: 'Finde Spieler in deiner Nähe, leite Ligen, verfolge deinen Wurf.',
  auth_email: 'E-Mail', auth_password: 'Passwort',
  auth_sign_in: 'Anmelden', auth_sign_up: 'Konto erstellen', auth_or: 'oder',
  auth_continue_google: 'Weiter mit Google',
  auth_email_link: 'Anmeldelink per E-Mail senden',
  auth_email_link_sent: 'Schau in dein E-Mail-Postfach für den Anmeldelink.',
  auth_choose_language: 'Sprache wählen',
  auth_no_account: 'Noch kein Konto?', auth_have_account: 'Schon ein Konto?',

  common_save: 'Speichern', common_cancel: 'Abbrechen', common_delete: 'Löschen',
  common_loading: 'Lädt…', common_search: 'Suchen', common_close: 'Schließen',
  common_send: 'Senden', common_create: 'Erstellen', common_join: 'Beitreten',
  common_confirm: 'Bestätigen', common_dispute: 'Anfechten', common_back: 'Zurück',
  common_settings: 'Einstellungen', common_signout: 'Abmelden',
  common_install_app: 'Hoops zum Startbildschirm hinzufügen',
  common_install_ios_hint: 'Tippe auf Teilen, dann "Zum Home-Bildschirm".',
  common_edit: 'Bearbeiten', common_add: 'Hinzufügen', common_none: 'Hier ist noch nichts',
  common_error_generic: 'Etwas ist schiefgelaufen. Versuch es erneut.',

  court_title: 'Platz', court_courts_near: 'Plätze in deiner Nähe', court_players_near: 'Spieler in deiner Nähe',
  court_checkin: 'Einchecken', court_checkout: 'Auschecken', court_call_sesh: 'Zum Zocken rufen',
  court_hoopers_now: 'spielen gerade', court_away_km: 'km entfernt',
  court_no_courts: 'Noch keine Plätze in der Nähe gefunden.', court_invite_sent: 'Einladung gesendet.',
  court_verify_badge: 'Spiele zu bestätigen',

  league_title: 'Ligen', league_create: 'Liga erstellen', league_join: 'Liga beitreten',
  league_join_code: 'Beitrittscode', league_leaderboard: 'Rangliste', league_teams: 'Teams',
  league_games: 'Spiele', league_log_game: 'Spiel eintragen', league_chat: 'Liga-Chat',
  league_members: 'Mitglieder', league_owner: 'Besitzer', league_win_loss: 'S–N',
  league_win_pct: 'Sieg-%', league_ppg: 'Punkte/Sp', league_rpg: 'Rebounds/Sp', league_apg: 'Assists/Sp',
  league_spg: 'Steals/Sp', league_bpg: 'Blocks/Sp', league_format: 'Format', league_pick_format: 'Format wählen',
  league_pick_teams: 'Teams festlegen', league_score: 'Punktestand', league_your_leagues: 'Deine Ligen',
  league_no_leagues: 'Du bist noch keiner Liga beigetreten.',
  league_invite_link: 'Einladungslink', league_copy_link: 'Link kopieren',
  league_joined_message: 'ist der Liga beigetreten',

  verify_title: 'Spiel bestätigen', verify_score_required: 'Punktestand bestätigen',
  verify_stats_optional: 'Statistiken bestätigen (optional)', verify_approve: 'Bestätigen',
  verify_dispute_note: 'Erkläre, was nicht stimmt', verify_pending: 'Warten auf andere Spieler',

  chat_title: 'Chat', chat_direct: 'Direkt', chat_leagues: 'Ligen',
  chat_new_message: 'Nachricht', chat_attach_photo: 'Foto anhängen', chat_no_messages: 'Noch keine Nachrichten.',

  profile_title: 'Profil', profile_playstyle: 'Spielstil', profile_height: 'Größe',
  profile_vertical: 'Sprungkraft', profile_weight: 'Gewicht', profile_offense: 'Offense',
  profile_defense: 'Defense', profile_badges: 'Abzeichen', profile_shot_rating: 'Wurf-Rating',
  profile_three_pt: 'Dreier', profile_mid_range: 'Mitteldistanz', profile_shot_chart: 'Wurfkarte',
  profile_rate_player: 'Spieler bewerten', profile_recent_ratings: 'Von dir vergebene Bewertungen',
  profile_bronze: 'Bronze', profile_silver: 'Silber', profile_gold: 'Gold', profile_hof: 'Hall of Fame',
  profile_edit: 'Profil bearbeiten',

  drills_title: 'Wurftraining', drills_log_session: 'Einheit eintragen', drills_history: 'Verlauf',
  drills_makes: 'Treffer', drills_attempts: 'Versuche',
  drills_spot_corner3: 'Ecken-Dreier', drills_spot_wing3: 'Flügel-Dreier', drills_spot_top_key: 'Zonenspitze',
  drills_spot_deep_left: 'Weiter Dreier (links)', drills_spot_deep_top: 'Weiter Dreier (Mitte)',
  drills_spot_deep_right: 'Weiter Dreier (rechts)', drills_spot_elbow: 'Mitteldistanz (Ellbogen)',
  drills_spot_baseline: 'Mitteldistanz (Grundlinie)', drills_spot_ft: 'Freiwurf', drills_spot_paint: 'Zone',
  drills_session_saved: 'Einheit gespeichert',

  settings_title: 'Einstellungen', settings_language: 'Sprache', settings_theme: 'Design',
  settings_light: 'Hell', settings_dark: 'Dunkel', settings_radius: 'Suchradius',
  settings_alert_threshold: 'Platz-Alarm-Schwelle', settings_notifications: 'Push-Benachrichtigungen',
  settings_enable_push: 'Benachrichtigungen aktivieren', settings_push_enabled: 'Benachrichtigungen an',

  notif_court_surge: 'füllt sich', notif_verify_game: 'hat ein Spiel mit dir eingetragen',
  notif_league_join: 'ist über deinen Einladungslink beigetreten', notif_hoop_sesh: 'ruft dich zum Zocken',
};

const fr = {
  nav_court: 'Terrain', nav_leagues: 'Ligues', nav_chat: 'Chat', nav_profile: 'Profil',

  auth_welcome_title: 'Le basket de rue, organisé.',
  auth_welcome_sub: 'Trouve des joueurs près de toi, gère des ligues, suis ton tir.',
  auth_email: 'E-mail', auth_password: 'Mot de passe',
  auth_sign_in: 'Se connecter', auth_sign_up: 'Créer un compte', auth_or: 'ou',
  auth_continue_google: 'Continuer avec Google',
  auth_email_link: 'M\u2019envoyer un lien de connexion',
  auth_email_link_sent: 'Consulte ton e-mail pour le lien de connexion.',
  auth_choose_language: 'Choisis ta langue',
  auth_no_account: 'Pas encore de compte ?', auth_have_account: 'Déjà un compte ?',

  common_save: 'Enregistrer', common_cancel: 'Annuler', common_delete: 'Supprimer',
  common_loading: 'Chargement…', common_search: 'Rechercher', common_close: 'Fermer',
  common_send: 'Envoyer', common_create: 'Créer', common_join: 'Rejoindre',
  common_confirm: 'Confirmer', common_dispute: 'Contester', common_back: 'Retour',
  common_settings: 'Réglages', common_signout: 'Se déconnecter',
  common_install_app: "Ajouter Hoops à l'écran d'accueil",
  common_install_ios_hint: 'Appuie sur Partager, puis "Sur l\u2019écran d\u2019accueil".',
  common_edit: 'Modifier', common_add: 'Ajouter', common_none: "Rien ici pour l'instant",
  common_error_generic: "Un problème est survenu. Réessaie.",

  court_title: 'Terrain', court_courts_near: 'Terrains proches', court_players_near: 'Joueurs proches',
  court_checkin: 'Pointer', court_checkout: 'Quitter', court_call_sesh: 'Appeler pour une session',
  court_hoopers_now: 'joueurs sur place', court_away_km: 'km',
  court_no_courts: 'Aucun terrain trouvé à proximité.', court_invite_sent: 'Invitation envoyée.',
  court_verify_badge: 'matchs à confirmer',

  league_title: 'Ligues', league_create: 'Créer une ligue', league_join: 'Rejoindre une ligue',
  league_join_code: 'Code d\u2019invitation', league_leaderboard: 'Classement', league_teams: 'Équipes',
  league_games: 'Matchs', league_log_game: 'Enregistrer un match', league_chat: 'Chat de la ligue',
  league_members: 'Membres', league_owner: 'Propriétaire', league_win_loss: 'V–D',
  league_win_pct: '% victoires', league_ppg: 'Pts/match', league_rpg: 'Reb/match', league_apg: 'Pd/match',
  league_spg: 'Int/match', league_bpg: 'Ctr/match', league_format: 'Format', league_pick_format: 'Choisir un format',
  league_pick_teams: 'Définir les équipes', league_score: 'Score', league_your_leagues: 'Tes ligues',
  league_no_leagues: "Tu n'as encore rejoint aucune ligue.",
  league_invite_link: "Lien d'invitation", league_copy_link: 'Copier le lien',
  league_joined_message: 'a rejoint la ligue',

  verify_title: 'Confirmer le match', verify_score_required: 'Confirme le score',
  verify_stats_optional: 'Confirme les statistiques (optionnel)', verify_approve: 'Approuver',
  verify_dispute_note: 'Explique ce qui ne va pas', verify_pending: "En attente des autres joueurs",

  chat_title: 'Chat', chat_direct: 'Direct', chat_leagues: 'Ligues',
  chat_new_message: 'Message', chat_attach_photo: 'Joindre une photo', chat_no_messages: 'Aucun message pour l\u2019instant.',

  profile_title: 'Profil', profile_playstyle: 'Style de jeu', profile_height: 'Taille',
  profile_vertical: 'Détente verticale', profile_weight: 'Poids', profile_offense: 'Attaque',
  profile_defense: 'Défense', profile_badges: 'Badges', profile_shot_rating: 'Note de tir',
  profile_three_pt: 'Tir à 3 pts', profile_mid_range: 'Mi-distance', profile_shot_chart: 'Carte des tirs',
  profile_rate_player: 'Noter ce joueur', profile_recent_ratings: 'Notes que tu as données',
  profile_bronze: 'Bronze', profile_silver: 'Argent', profile_gold: 'Or', profile_hof: 'Temple de la renommée',
  profile_edit: 'Modifier le profil',

  drills_title: 'Entraînement au tir', drills_log_session: 'Enregistrer une séance', drills_history: 'Historique',
  drills_makes: 'Réussis', drills_attempts: 'Tentatives',
  drills_spot_corner3: 'Corner à 3 pts', drills_spot_wing3: 'Aile à 3 pts', drills_spot_top_key: 'Haut de la raquette',
  drills_spot_deep_left: 'Tir longue distance (gauche)', drills_spot_deep_top: 'Tir longue distance (centre)',
  drills_spot_deep_right: 'Tir longue distance (droite)', drills_spot_elbow: 'Mi-distance (coude)',
  drills_spot_baseline: 'Mi-distance (ligne de fond)', drills_spot_ft: 'Lancer franc', drills_spot_paint: 'Raquette',
  drills_session_saved: 'Séance enregistrée',

  settings_title: 'Réglages', settings_language: 'Langue', settings_theme: 'Thème',
  settings_light: 'Clair', settings_dark: 'Sombre', settings_radius: 'Rayon de recherche',
  settings_alert_threshold: "Seuil d'alerte de terrain", settings_notifications: 'Notifications push',
  settings_enable_push: 'Activer les notifications', settings_push_enabled: 'Notifications activées',

  notif_court_surge: 'se remplit', notif_verify_game: 'a enregistré un match avec toi',
  notif_league_join: 'a rejoint via ton lien d\u2019invitation', notif_hoop_sesh: "t'appelle pour une session",
};

const it = {
  nav_court: 'Campo', nav_leagues: 'Leghe', nav_chat: 'Chat', nav_profile: 'Profilo',

  auth_welcome_title: 'Basket di strada, organizzato.',
  auth_welcome_sub: 'Trova giocatori vicino a te, gestisci leghe, migliora il tuo tiro.',
  auth_email: 'Email', auth_password: 'Password',
  auth_sign_in: 'Accedi', auth_sign_up: 'Crea account', auth_or: 'oppure',
  auth_continue_google: 'Continua con Google',
  auth_email_link: 'Inviami un link di accesso',
  auth_email_link_sent: "Controlla la tua email per il link di accesso.",
  auth_choose_language: 'Scegli la lingua',
  auth_no_account: 'Non hai un account?', auth_have_account: 'Hai già un account?',

  common_save: 'Salva', common_cancel: 'Annulla', common_delete: 'Elimina',
  common_loading: 'Caricamento…', common_search: 'Cerca', common_close: 'Chiudi',
  common_send: 'Invia', common_create: 'Crea', common_join: 'Unisciti',
  common_confirm: 'Conferma', common_dispute: 'Contesta', common_back: 'Indietro',
  common_settings: 'Impostazioni', common_signout: 'Esci',
  common_install_app: 'Aggiungi Hoops alla schermata Home',
  common_install_ios_hint: 'Tocca Condividi, poi "Aggiungi a Home".',
  common_edit: 'Modifica', common_add: 'Aggiungi', common_none: "Ancora niente qui",
  common_error_generic: 'Qualcosa è andato storto. Riprova.',

  court_title: 'Campo', court_courts_near: 'Campi vicini', court_players_near: 'Giocatori vicini',
  court_checkin: 'Check-in', court_checkout: 'Check-out', court_call_sesh: 'Chiama per una partita',
  court_hoopers_now: 'in campo ora', court_away_km: 'km di distanza',
  court_no_courts: 'Nessun campo trovato nelle vicinanze.', court_invite_sent: 'Invito inviato.',
  court_verify_badge: 'partite da verificare',

  league_title: 'Leghe', league_create: 'Crea lega', league_join: 'Unisciti a una lega',
  league_join_code: 'Codice di accesso', league_leaderboard: 'Classifica', league_teams: 'Squadre',
  league_games: 'Partite', league_log_game: 'Registra partita', league_chat: 'Chat della lega',
  league_members: 'Membri', league_owner: 'Proprietario', league_win_loss: 'V–P',
  league_win_pct: '% vittorie', league_ppg: 'Punti/gara', league_rpg: 'Rimbalzi/gara', league_apg: 'Assist/gara',
  league_spg: 'Palle rubate/gara', league_bpg: 'Stoppate/gara', league_format: 'Formato', league_pick_format: 'Scegli un formato',
  league_pick_teams: 'Imposta le squadre', league_score: 'Punteggio', league_your_leagues: 'Le tue leghe',
  league_no_leagues: 'Non ti sei ancora unito a nessuna lega.',
  league_invite_link: 'Link di invito', league_copy_link: 'Copia link',
  league_joined_message: 'si è unito alla lega',

  verify_title: 'Verifica partita', verify_score_required: 'Conferma il punteggio',
  verify_stats_optional: 'Conferma le statistiche (facoltativo)', verify_approve: 'Approva',
  verify_dispute_note: 'Spiega cosa non va', verify_pending: 'In attesa degli altri giocatori',

  chat_title: 'Chat', chat_direct: 'Diretti', chat_leagues: 'Leghe',
  chat_new_message: 'Messaggio', chat_attach_photo: 'Allega foto', chat_no_messages: 'Ancora nessun messaggio.',

  profile_title: 'Profilo', profile_playstyle: 'Stile di gioco', profile_height: 'Altezza',
  profile_vertical: 'Elevazione', profile_weight: 'Peso', profile_offense: 'Attacco',
  profile_defense: 'Difesa', profile_badges: 'Badge', profile_shot_rating: 'Valutazione tiro',
  profile_three_pt: 'Tiro da tre', profile_mid_range: 'Media distanza', profile_shot_chart: 'Mappa dei tiri',
  profile_rate_player: 'Valuta questo giocatore', profile_recent_ratings: 'Valutazioni che hai dato',
  profile_bronze: 'Bronzo', profile_silver: 'Argento', profile_gold: 'Oro', profile_hof: 'Hall of Fame',
  profile_edit: 'Modifica profilo',

  drills_title: 'Allenamento al tiro', drills_log_session: 'Registra sessione', drills_history: 'Cronologia',
  drills_makes: 'Canestri', drills_attempts: 'Tentativi',
  drills_spot_corner3: 'Triplo d\u2019angolo', drills_spot_wing3: 'Triplo laterale', drills_spot_top_key: 'Vertice dell\u2019area',
  drills_spot_deep_left: 'Triplo profondo (sinistra)', drills_spot_deep_top: 'Triplo profondo (centro)',
  drills_spot_deep_right: 'Triplo profondo (destra)', drills_spot_elbow: 'Media distanza (gomito)',
  drills_spot_baseline: 'Media distanza (linea di fondo)', drills_spot_ft: 'Tiro libero', drills_spot_paint: 'Area',
  drills_session_saved: 'Sessione salvata',

  settings_title: 'Impostazioni', settings_language: 'Lingua', settings_theme: 'Tema',
  settings_light: 'Chiaro', settings_dark: 'Scuro', settings_radius: 'Raggio di ricerca',
  settings_alert_threshold: 'Soglia avviso campo', settings_notifications: 'Notifiche push',
  settings_enable_push: 'Attiva notifiche', settings_push_enabled: 'Notifiche attive',

  notif_court_surge: 'si sta riempiendo', notif_verify_game: 'ha registrato una partita con te',
  notif_league_join: 'si è unito tramite il tuo link di invito', notif_hoop_sesh: 'ti chiama per una partita',
};

export const STRINGS = { en, hr, es, de, fr, it };

let currentLang = 'en';
export function setLang(code) {
  currentLang = STRINGS[code] ? code : 'en';
  document.documentElement.lang = currentLang;
}
export function getLang() {
  return currentLang;
}
export function t(key) {
  return STRINGS[currentLang]?.[key] ?? STRINGS.en[key] ?? key;
}
