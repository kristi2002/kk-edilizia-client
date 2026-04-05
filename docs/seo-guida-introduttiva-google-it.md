# Guida introduttiva all’ottimizzazione per i motori di ricerca (SEO)

> **Fonte:** materiale di riferimento basato sulle [Nozioni di base sulla Ricerca Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) (Google Search Central). Per norme e aggiornamenti ufficiali consultare sempre la documentazione Google in lingua preferita. Questo file serve come **lettura di contesto** accanto a [`SEO-PATTERNS.md`](../SEO-PATTERNS.md), che descrive cosa è implementato in questo progetto.

---

## Perché la SEO

Quando hai creato il tuo sito web, probabilmente lo hai fatto pensando ai tuoi utenti, in modo che sia facile per loro trovare ed esplorare più facilmente i tuoi contenuti. Anche un motore di ricerca, che aiuta le persone a scoprire questi contenuti, può essere considerato un utente. La SEO (l’acronimo di *search engine optimization*, ottimizzazione per i motori di ricerca) serve ad aiutare i motori di ricerca a comprendere i tuoi contenuti, nonché aiutare gli utenti a trovare il tuo sito e decidere se visitarlo tramite un motore di ricerca.

Le **Nozioni di base sulla Ricerca** definiscono gli elementi più importanti che rendono il tuo sito web idoneo a essere mostrato nella Ricerca Google. Anche se non è garantito che un determinato sito venga aggiunto all’indice di Google, i siti che seguono le Nozioni di base sulla Ricerca Google hanno maggiori probabilità di comparire nei risultati di ricerca di Google. La SEO riguarda il passo successivo: impegnarsi per migliorare la presenza del tuo sito nella Ricerca. Questa guida illustra alcuni dei miglioramenti più comuni ed efficaci che puoi apportare al tuo sito.

Siamo spiacenti, ma non ci sono segreti per far raggiungere automaticamente la prima posizione nei risultati di Google al tuo sito. In realtà, alcuni dei suggerimenti potrebbero non essere nemmeno validi per la tua attività; tuttavia, se segui le best practice, magari sarà più facile per i motori di ricerca (non solo Google) eseguire la scansione, indicizzare e comprendere i tuoi contenuti.

### Professionisti e tempi

**Hai poco tempo o non te la senti di fare tutto in autonomia?** Valuta la possibilità di rivolgerti a un professionista.

**Quanto tempo devo aspettare prima di osservare gli effetti sui risultati di ricerca?** Sarà necessario un po’ di tempo prima che ogni modifica apportata venga applicata da Google. Alcune modifiche potrebbero essere applicate entro poche ore, altre potrebbero richiedere diversi mesi. In generale, ti consigliamo di attendere alcune settimane per valutare se il tuo lavoro ha avuto effetti positivi nei risultati della Ricerca Google. Tieni presente che non tutte le modifiche che apporti al tuo sito web avranno un impatto tangibile sui risultati di ricerca; se i risultati non ti soddisfano e le tue strategie di business lo consentono, prova a ripetere le modifiche e vedi se fanno la differenza.

---

## Come funziona la Ricerca Google?

Google è un motore di ricerca completamente automatizzato che utilizza dei programmi chiamati **crawler** per esplorare regolarmente il web e cercare pagine da aggiungere al suo indice. Di solito non devi fare nulla, se non pubblicare il sito sul web. In effetti, la maggior parte dei siti riportati nei nostri risultati viene trovata e aggiunta automaticamente durante la scansione del web. Se vuoi saperne di più, puoi consultare la documentazione ufficiale, che spiega come Google rileva le pagine web, ne esegue la scansione e le pubblica.

---

## Aiutare Google a trovare i tuoi contenuti

Prima di intraprendere qualsiasi azione tra quelle contenute in questa sezione, verifica se Google ha già trovato i tuoi contenuti (magari non devi fare nulla). Prova a cercare il tuo sito su Google con l’operatore **`site:`** (es. `site:tuodominio.it`). Se vedi risultati che rimandano al tuo sito, significa che sei nell’indice.

Google trova le pagine principalmente tramite **link** da altre pagine di cui ha già eseguito la scansione. In molti casi, si tratta di altri siti web che rimandano alle tue pagine. Avere altri siti che rimandano al tuo è qualcosa che avviene naturalmente nel tempo. Puoi anche incentivare le persone a scoprire i tuoi contenuti promuovendo il sito.

Se vuoi affrontare una piccola sfida tecnica, potresti anche **inviare una Sitemap** (file con gli URL importanti). Alcuni CMS lo fanno automaticamente. L’invio della Sitemap non è obbligatorio; dovresti innanzitutto assicurarti che le persone conoscano il tuo sito.

---

## Verificare se Google può vedere la tua pagina come la vede un utente

Quando Google esegue la scansione di una pagina, idealmente dovrebbe vederla come la vede un utente medio. Google deve poter accedere alle stesse risorse del browser dell’utente. Se il tuo sito nasconde componenti importanti (CSS e JavaScript), Google potrebbe non riuscire a comprendere le tue pagine.

Se le pagine contengono informazioni diverse a seconda dell’ubicazione fisica dell’utente, assicurati che siano soddisfatte le informazioni che Google vede dalla posizione del suo crawler (in genere equivale agli Stati Uniti).

Per verificare in che modo Google vede la tua pagina, utilizza lo strumento **Controllo URL** in Search Console.

---

## Non vuoi che una pagina compaia nei risultati?

Google mette a disposizione vari modi per disattivare la scansione e l’indicizzazione degli URL. Se devi bloccare file, directory o l’intero sito, consulta la guida ufficiale su come impedire la visualizzazione di contenuti nei risultati di ricerca.

---

## Organizzare il sito

Quando configuri o rinnovi il tuo sito, può essere utile organizzarlo in modo logico, perché aiuta motori di ricerca e utenti a comprendere la correlazione tra le pagine. Non serve “mollare tutto e riorganizzare subito”: i motori di ricerca probabilmente comprenderanno le tue pagine così come sono, indipendentemente dall’organizzazione.

### URL descrittivi

Delle parti dell’URL possono essere visualizzate nei risultati di ricerca come **breadcrumb**. Google viene a conoscenza automaticamente dei breadcrumb in base alle parole nell’URL, ma puoi anche influenzarli con i **dati strutturati** se hai le competenze tecniche. Prova a includere nell’URL parole utili per gli utenti, ad esempio:

- Utile: `https://www.example.com/pets/cats.html`
- Meno utile (solo identificatori casuali): `https://www.example.com/2/6772756D707920636174`

### Raggruppare in directory le pagini simili per argomento

Se il tuo sito include molte migliaia di URL, la struttura può influire su come Google esegue scansione e indicizzazione. Raggruppare argomenti simili in directory può aiutare Google a capire la frequenza con cui cambiano gli URL nelle singole directory (es. `/policies/` vs `/promotions/`).

### Ridurre i contenuti duplicati

Alcuni siti mostrano gli stessi contenuti con URL diversi (**contenuti duplicati**). Per ogni contenuto, i motori di ricerca scelgono un singolo URL (**canonico**) da mostrare.

La duplicazione non è di per sé spam, ma può creare esperienza utente negativa e sprecare risorse di scansione. Se puoi, specifica una **versione canonica**; in alternativa Google proverà a farlo automaticamente. Idealmente ogni contenuto è accessibile tramite **un solo URL**; altrimenti reindirizzamenti o `link rel="canonical"`.

---

## Creare un sito utile e interessante

Creare contenuti che le persone trovano interessanti e utili probabilmente incide sulla presenza nei risultati di ricerca più di qualsiasi altro suggerimento. Contenuti utili tendono ad avere:

- Testo **facile da leggere** e ben organizzato; linguaggio naturale; paragrafi e **intestazioni** chiare.
- Contenuti **unici** (non copiati da altri); basati su ciò che sai sull’argomento.
- Contenuti **aggiornati** nel tempo o rimossi se non più rilevanti.
- Contenuti **utili e affidabili**, eventualmente con fonti esperte.

### Pensare ai termini di ricerca

Pensa a quali termini potrebbe usare un utente per trovare i tuoi contenuti. Esperti e neofiti possono usare query diverse (es. “salumi” vs “tagliere di formaggio”). Non serve prevedere ogni variante: i sistemi di Google sono in grado di mettere in relazione la pagina con molte query anche senza ripetere esattamente ogni parola.

### Evitare pubblicità che distraggano

Evita che annunci o interstitial rendano difficile leggere i contenuti o usare il sito.

### Inserire link a risorse pertinenti

I link collegano utenti e motori di ricerca ad altre parti del tuo sito o a pagine esterne rilevanti. Google scopre molte pagine nuove tramite link.

### Scrivere testo per i link efficace (anchor text)

Il testo del link comunica agli utenti e a Google cosa contiene la pagina di destinazione. Anchor text appropriato aiuta a capire le pagine collegate prima di visitarle.

### Link esterni e `nofollow`

Quando colleghi siti di cui non controlli l’affidabilità, considera `rel="nofollow"` (o equivalenti) per non associare il tuo sito a risorse non attendibili. Per contenuti generati dagli utenti (forum, commenti), il CMS dovrebbe aggiungere `nofollow` ai link utente per limitare spam e associazioni indesiderate.

---

## Influenzare l’aspetto del sito nella Ricerca Google

Elementi che puoi influenzare: in particolare **titolo** e **snippet**.

### Titoli

Google può usare diverse fonti, incluso l’elemento `<title>`. Scrivi titoli **unici per pagina**, chiari, concisi, che descrivano il contenuto; possono includere nome del sito, attività, località, offerta della pagina.

### Snippet

Lo snippet è la descrizione sotto il titolo. Viene spesso ricavata dal contenuto della pagina; a volte dalla **meta description**. Una meta description efficace è breve, unica per pagina e riassume i punti salienti.

---

## Immagini

- Immagini di qualità vicino al testo pertinente.
- Testo **alt** descrittivo (`<img alt="...">`) per accessibilità e comprensione del contesto dell’immagine.

---

## Video

Per pagine incentrate su un video: video di qualità in pagina con testo pertinente; titoli e descrizioni del video descrittivi (le best practice sui titoli valgono anche qui).

---

## Promuovere il sito web

Promozione efficace accelera la scoperta da parte di utenti e motori di ricerca: social, community, pubblicità online/offline, passaparola. Il passaparola è spesso efficace nel tempo. Indica l’URL su biglietti da visita, carta intestata, manifesti, newsletter (se autorizzato).

Non esagerare: promozione eccessiva può stancare gli utenti e alcune pratiche possono essere percepite come manipolazione dei risultati.

---

## Aspetti su cui non soffermarsi (miti e priorità)

- **Meta tag keywords** — La Ricerca Google non usa il meta tag keywords.
- **Keyword stuffing** — Ripetere eccessivamente le stesse parole può danneggiare l’esperienza ed è considerato spam.
- **Solo parole chiave nel dominio/URL** — Poco effetto sul ranking da solo; utile soprattutto per breadcrumb/chiarezza.
- **TLD (.com, .it, …)** — Importante soprattutto se il target è un paese specifico; spesso è un segnale a basso impatto.
- **Lunghezza minima/massima contenuti** — Non esiste un numero magico di parole; scrivi in modo naturale.
- **Sottodomini vs sottodirectory** — Scegli ciò che è meglio per il business e la manutenzione.
- **PageRank** — È uno dei tanti segnali; la Ricerca usa molti indicatori.
- **“Penalità” duplicazione** — Contenuto accessibile da più URL *sul tuo sito* non è automaticamente penalità; copiare contenuti da *altri* siti è un altro discorso.
- **Ordine delle intestazioni H1–H6** — Utile per accessibilità (screen reader); la Ricerca non dipende da un ordine semantico rigido.
- **EEAT come fattore di ranking diretto** — Non nel modo in cui a volte si narra; resta importante qualità percepita e affidabilità nel lungo periodo.

---

## Passaggi successivi

1. Configurare **Google Search Console** per monitorare prestazioni e problemi tecnici.
2. Gestire la SEO nel tempo: migrazioni di sito, multilingua, contenuti strutturati.
3. Migliorare l’aspetto nei risultati con **dati strutturati** validi dove applicabile (snippet arricchiti, ecc.).

Link utili (ufficiali):

- [Guida introduttiva SEO (Google, inglese)](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Search Console](https://search.google.com/search-console)

---

*Documento interno di progetto — testo rielaborato dalla guida pubblica Google per comodità di lettura offline. Per vincoli legali e aggiornamenti normativi fare sempre riferimento alle fonti ufficiali Google.*
