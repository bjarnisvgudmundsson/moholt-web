export const FF = "'DM Serif Display', Georgia, serif";

export interface AssessmentOption {
  label: string;
  explain: string;
}

export interface AssessmentQuestion {
  id: number;
  text: string;
  opts: AssessmentOption[];
}

export interface AssessmentSection {
  key: string;
  name: string;
  color: string;
  desc: string;
  questions: AssessmentQuestion[];
}

export const ASSESSMENT_SECTIONS: AssessmentSection[] = [
  { key: "A", name: "Ferli & Verkflæði", color: "#2d5a6b",
    desc: "Hvernig eru mál skilgreind, ræst og meðhöndluð í daglegum rekstri?",
    questions: [
      { id: 1, text: "Hvernig eru mál – erindi, kærur eða verkbeiðnir – ræst hjá þér?",
        opts: [
          {label:"Óformlega – í tölvupósti eða munnlega, engin samræmd leið", explain:"Þetta þýðir að mál geta glatast á milli, engin sjálfvirk tilkynning berst og erfitt er að rekja uppruna málsins síðar."},
          {label:"Hluti mála fara í gegnum kerfi en aðrir koma inn á óskipulegan hátt", explain:"Blandað ferli skapar blindur svæði – þau mál sem fara ekki í gegnum kerfið hafa enga skráða sögu eða ábyrgðaraðila."},
          {label:"Flest mál ræst í kerfi en nokkrar undantekningar eru til staðar", explain:"Góður grunnur. Undantekningarnar eru yfirleitt bráðamál eða sértilfelli sem ætti að skilgreina ferli fyrir."},
          {label:"Öll mál ræst með stöðluðum hætti í einu kerfi", explain:"Fullur rekjanleiki frá upphafi – öll mál fá auðkenni, tímastimpil og ábyrgðaraðila sjálfkrafa."}
        ] },
      { id: 2, text: "Hvernig er ákvarðanataka og stigmögnun (escalation) skilgreind í ferlinu?",
        opts: [
          {label:"Engar formlegar reglur – þetta fer eftir dómskynbragði hvers starfsmanns", explain:"Hætta á ójöfnuði í meðhöndlun – útkoma fer eftir reynslu einstaklingsins fremur en skilgreindum viðmiðum."},
          {label:"Lauslegar leiðbeiningar eru til en þær eru ekki kerfisbundnar", explain:"Reglurnar eru til á pappír eða í tölvupósti en kerfið framfylgir þeim ekki sjálfkrafa – auðvelt að gleyma eða víkja frá."},
          {label:"Flest stigmögnunarstig eru skilgreind og studd af kerfinu", explain:"Kerfið veit hvenær mál þarf athygli yfirmanns og getur sent tilkynningar sjálfkrafa á rétta aðila."},
          {label:"Öll stigmögnun er sjálfvirk og reglubundin með yfirliti og viðvörunum", explain:"Engin mál falla á milli – sjálfvirk stigmögnun tryggir að mál nái til rétts aðila á réttum tíma."}
        ] },
      { id: 3, text: "Hvernig eru handanfarir (handoffs) milli deilda eða starfsmanna meðhöndlaðar?",
        opts: [
          {label:"Tölvupóstur eða munnlegar samskipti – engin spora í kerfi", explain:"Þegar mál ferst milli aðila er engin formleg skráning – upplýsingar geta glatast og ábyrgð er óskýr."},
          {label:"Sumar handanfarir eru skráðar en oft er mannlegur milliliður nauðsynlegur", explain:"Sumir hlutar ferlisins eru raknir en handvirk þátttaka eykur hættu á töfum og misskilningi."},
          {label:"Handanfarir eru að mestu skráðar og raktar í kerfinu", explain:"Flestir flutningar á milli aðila skráðir sjálfkrafa – spora og tímalínur eru aðgengilegar."},
          {label:"Öll verkflæði eru sjálfvirk með fullu auðkenni og endurgjöf", explain:"Hvert skref í ferlinu er rakið, viðtakandi fær tilkynningu og sendandi sér staðfestingu á móttöku."}
        ] },
      { id: 4, text: "Hversu vel eru frestir og biðtímar (SLA) skilgreindir og fylgst með?",
        opts: [
          {label:"Engar formlegar SLA-reglur eða frestaskilgreiningar", explain:"Enginn mælikvarði er til staðar – ómögulegt að vita hvort afgreiðslutímar eru ásættanlegir eða versnandi."},
          {label:"Frestarnir eru skilgreindir á pappír en ekki fylgst með þeim kerfisbundið", explain:"Markmiðin eru þekkt en enginn sér sjálfkrafa þegar þau eru brotin – greining byggist á handvirkum athugunum."},
          {label:"Kerfið minnir á frestum og gefur tilkynningar", explain:"Sjálfvirkar áminningar hjálpa starfsmönnum að bregðast við en heildaryfirsýn og þróunargreining vantar."},
          {label:"SLA-fylgni er mæld, skráð og notuð til umbóta í rauntíma", explain:"Mælaborð sýna frammistöðu á SLA í rauntíma og nýtist til stöðugra umbóta og ábyrgðaraðila."}
        ] },
      { id: 5, text: "Eru skilgreind skilyrði og reglur (business rules) sem stjórna ferlunum sjálfkrafa?",
        opts: [
          {label:"Nei – allar ákvarðanir eru teknar af starfsmanni í hverju tilviki", explain:"Allar ákvarðanir byggja á innsæi – samræmi er ekki tryggt og nýir starfsmenn þurfa langa þjálfun."},
          {label:"Einstakar einfaldar reglur eru forritaðar en meirihluti er handvirkur", explain:"Nokkrar sjálfvirkar reglur eru til en þær ná ekki yfir flóknari tilfelli – meirihluti ákvörðunarferlisins er enn handvirkur."},
          {label:"Margar reglur eru sjálfvirkar en kerfið þarfnast reglubundinnar yfirferðar", explain:"Meginhluti daglegra ákvarðana er sjálfvirkur en reglurnar þurfa viðhald og uppfærslu til að halda í takt við stefnubreytingar."},
          {label:"Heildarferlið er stjórnað af stillanlegum reglum sem eru haldið uppfærðum", explain:"Regluvélin er miðlæg, stillanleg og uppfærð reglulega – breytingar á stefnu endurspeglast sjálfkrafa í ferlum."}
        ] },
    ] },
  { key: "B", name: "Gögn & Leitarleikni", color: "#c8a96e",
    desc: "Hversu aðgengileg og nothæf eru gögnin þín þegar á þarf að halda?",
    questions: [
      { id: 6, text: "Hvernig geturðu leitað að máli, skjali eða atviki úr fortíðinni?",
        opts: [
          {label:"Þarf að leita handvirkt í möppum, tölvupósti eða hjá samstarfsmönnum", explain:"Stofnanaminni er dreift og persónuháð – ef lykilstarfsmaður fer er þekking glötuð."},
          {label:"Grunnleit í kerfi en niðurstöður eru oft ófullnægjandi eða of margar", explain:"Leit skilar of mörgum niðurstöðum eða of fáum – starfsmenn eyða tíma í síun fremur en úrlausn."},
          {label:"Góð leit eftir lykilsvæðum (nafn, dagsetning, málsnúmer)", explain:"Hægt er að finna mál eftir lykilsvæðum en samhengisleit (t.d. 'svipuð mál') er ekki möguleg."},
          {label:"Þemaleg leit (full-text eða vector) sem finnur mál eftir samhengi", explain:"Kerfið finnur tengd mál eftir innihaldi og samhengi – styður við betri ákvarðanatöku og fordæmagreiningu."}
        ] },
      { id: 7, text: "Hvar eru skjöl og fylgigögn mála geymd?",
        opts: [
          {label:"Dreifð á netdrif, tölvupóst og einstaka tölvur starfsmanna", explain:"Mikil áhætta á gagnatapi og útgáfaóreiðu – enginn veit hvar nýjasta útgáfan er."},
          {label:"Hluti í miðlægri skjalageymslum en ekki tengt málakerfinu", explain:"Skjöl eru til en tengingin við málið sjálft er handvirk – starfsmaður þarf að vita hvar á að leita."},
          {label:"Skjöl tengd málum í kerfi en útgáfastjórnun er takmörkuð", explain:"Skjöl eru tengd máli en erfitt er að sjá breytingasögu eða hvort eldri útgáfur séu í umferð."},
          {label:"Miðlæg geymsla með útgáfustjórnun, aðgangi og endurskoðunarleiðum", explain:"Full rekjanleiki skjala – hver breytti, hvenær og af hverju. Aðgangsstýring tryggir trúnað."}
        ] },
      { id: 8, text: "Hvernig eru gæðavísir og mælikvarðar á málastjórnun mældir?",
        opts: [
          {label:"Engin formleg mæling – aðeins tilfinningu fyrir stöðunni", explain:"Ómögulegt að sanna framfarir eða greina vandamál fyrr en þau verða alvarleg."},
          {label:"Handvirkar Excel-skýrslur á reglulegu fresti", explain:"Handvirkar skýrslur eru betri en ekkert en þær eru tímafrekar, viðkvæmar fyrir villum og oft úreltar þegar þær berast."},
          {label:"Kerfið gefur af sér grunnstöðuskýrslur", explain:"Stöðuskýrslur gefa yfirlit en vantar þróunar- og samanburðargreiningu til að drífa umbætur."},
          {label:"Mælaborð í rauntíma með þróunar- og samanburðargreiningu", explain:"Rauntímagreining gefur stjórnendum sjálfvirkt yfirlit og greinir þróun – grundvöllur fyrir stöðugum umbótum."}
        ] },
      { id: 9, text: "Hvernig er gagnagæði og samræmi í málum tryggt?",
        opts: [
          {label:"Ekkert kerfi – gæðin fara eftir vandvirkni hvers starfsmanns", explain:"Samræmi er tilviljanakennt – sumir starfsmenn skrá vel en aðrir ekki, sem skapar ójafna gagnagæði."},
          {label:"Leiðbeiningar eru til en villur greinast oft ekki fyrr en síðar", explain:"Reglur eru til en engin sjálfvirk sannprófun – villur finnast yfirleitt þegar of seint er að leiðrétta þær."},
          {label:"Kerfið sér um grunnvilluleit við innslátt", explain:"Sjálfvirk athugun hindrar algengustu villurnar (tóm svæði, rangt snið) en flóknari gæðavandamál sleppa í gegn."},
          {label:"Sjálfvirk gæðastjórnun með reglum, sannprófun og endurgjöf", explain:"Kerfið framfylgir gæðareglum í rauntíma – starfsmaður fær tafarlaust endurgjöf ef eitthvað vantar eða er rangt."}
        ] },
      { id: 10, text: "Er til tengsl (samþætting) við önnur kerfi eins og tölvupóst, bókhald eða mannauðskerfi?",
        opts: [
          {label:"Engin tengsl – öll kerfi eru fullkomlega aðskilin og gögn afrituð handvirkt", explain:"Starfsmenn flytja gögn handvirkt á milli kerfa – tvöföld vinna, villuhætta og tímasóun."},
          {label:"Einstök ad-hoc tengsl eða skráarflutningur", explain:"Einstaka tengingar eru til (t.d. CSV-innflutningur) en þær eru viðkvæmar og krefjast handvirkrar umsjónar."},
          {label:"Nokkur kerfi eru tengd en heildarsamþætting vantar", explain:"Helstu tengingar virka en upplýsingaflæðið er enn rofið á nokkrum stöðum – handvirk vinna er enn nauðsynleg."},
          {label:"Yfirgripsmikil API-samþætting við öll helstu kerfi", explain:"Gögn flæða sjálfkrafa á milli kerfa – eitt sannleikspunkt (single source of truth) og engin tvöföld innslátt."}
        ] },
    ] },
  { key: "C", name: "Stjórnun & Reglufylgni", color: "#2e7d52",
    desc: "Hvernig er eftirliti, heimildum og endurskoðanleika háttað?",
    questions: [
      { id: 11, text: "Hvernig eru aðgangsheimildir og notendahlutverk skilgreind?",
        opts: [
          {label:"Allir hafa aðgang að öllu – engin hlutverkatengd takmörkun", explain:"Alvarleg áhætta – viðkvæm gögn eru aðgengileg öllum og erfitt er að rekja misnotkun."},
          {label:"Grunnhlutverk eru til en þau eru ekki reglubundið uppfærð", explain:"Hlutverk voru sett upp en hafa ekki verið endurskoðuð – starfsmenn sem skiptu um stöðu hafa enn gömul réttindi."},
          {label:"Hlutverkatengd aðgangsstjórnun (RBAC) er til staðar", explain:"Aðgangur er takmarkaður eftir hlutverki og uppfærður reglulega – grunnkrafa flestra reglugerða."},
          {label:"Granular RBAC með reglubundinni endurskoðun og skráningu aðgangslykla", explain:"Fínkornótt aðgangsstýring með reglubundinni yfirferð – uppfyllir ISO 27001 og GDPR kröfur."}
        ] },
      { id: 12, text: "Hvernig er audit-trail og skráning breytinga á málum tryggð?",
        opts: [
          {label:"Engar sjálfvirkar breytingaskráningar – erfitt að vita hvað gerðist", explain:"Ef deilt er um breytingu eða villa kemur upp er ómögulegt að rekja hvað gerðist og af hverjum."},
          {label:"Helstu breytingar eru skráðar en ekki með fullnægjandi smáatriðum", explain:"Stórar breytingar eru sýnilegar en smávægilegri atriði (t.d. svæðisbreytingar) eru ekki rakin."},
          {label:"Heildar audit-trail er til staðar og aðgengileg stjórnendum", explain:"Allar breytingar eru skráðar og stjórnendur geta skoðað heildarferilinn – nægilegt fyrir flestar úttektir."},
          {label:"Óbreytanlegt log sem uppfyllir kröfur reglugerða (ISO, GDPR o.fl.)", explain:"Skráningin er óbreytanleg (immutable) – enginn getur eytt eða breytt henni, sem er krafa í ströngum reglumhverfjum."}
        ] },
      { id: 13, text: "Eru formleg verklagsreglur og stefnur tengdar málakerfinu?",
        opts: [
          {label:"Reglurnar eru í Word-skrám eða á pappír – ótengdar kerfinu", explain:"Starfsmenn þurfa að muna eða leita uppi reglurnar sjálfir – engin trygging á að réttum reglum sé fylgt."},
          {label:"Hluti reglna eru vísað í í kerfinu en ekki kerfisbundið innleiddar", explain:"Kerfið bendir á reglur en framfylgir þeim ekki – starfsmenn geta farið framhjá þeim án tilkynningar."},
          {label:"Stefnur eru innbyggðar í verkflæðið en uppfærsluferli er handvirkt", explain:"Reglurnar stjórna ferlinu en þegar þær breytast þarf handvirka uppfærslu – hætta á úreldum reglum."},
          {label:"Kerfið beitir reglum sjálfkrafa og lætur vita þegar uppfærsla þarf", explain:"Reglurnar eru lifandi og kerfið tilkynnir sjálfkrafa þegar endurskoðun er á dagskrá."}
        ] },
      { id: 14, text: "Hvernig er persónuverndarreglum (GDPR) og gagnaflokkunar háttað?",
        opts: [
          {label:"Engin formleg flokkun – allt er meðhöndlað eins", explain:"Viðkvæm persónugögn fá sömu meðhöndlun og almenn gögn – brot á GDPR getur leitt til sekta."},
          {label:"Flokkun er til í stefnum en ekki framfylgt kerfisbundið", explain:"Stefnan segir hvernig á að flokka gögn en kerfið tryggir ekki framkvæmdina – mannleg villa er líkleg."},
          {label:"Kerfið styður flokkun og sér um eyðingu gagna við lok varðveislutíma", explain:"Sjálfvirk gagnaflokkun og eyðing við lok varðveislutíma – grunnkrafa GDPR er uppfyllt."},
          {label:"Sjálfvirk GDPR-stjórnun með samþykki, skráningu og reglubundinni endurskoðun", explain:"Full GDPR-virkni: samþykkisstjórnun, vinnsluferill, sjálfvirk eyðing og endurskoðunaráætlun."}
        ] },
      { id: 15, text: "Hvernig er upplýsingaöryggi og aðgangsstjórnun að kerfinu tryggð?",
        opts: [
          {label:"Einungis grunnskilríki (lykilorð) – engin MFA eða sérstakt eftirlit", explain:"Lykilorð ein og sér eru ekki lengur nægjanlegt öryggi – áhætta á óheimilum aðgangi er veruleg."},
          {label:"MFA er til en ekki notað af öllum eða ekki á öllum aðgangsslóðum", explain:"Sumir aðgangsstaðir eru varðir en aðrir ekki – ójafnt öryggi skapar blindur svæði sem hægt er að misnota."},
          {label:"MFA og reglubundnar öryggisendurskoðanir eru til staðar", explain:"Tvíþátta auðkenning og reglulegar úttektir – uppfyllir grunn ISO 27001 og GDPR öryggiskröfur."},
          {label:"Zero-trust öryggi með reglubundnum innbrotisprófum og skráningu atburða", explain:"Öll samskipti eru sannprófuð, innbrotspróf eru reglubundin og öryggisatburðir eru skráðir sjálfkrafa."}
        ] },
    ] },
  { key: "D", name: "Tækni & Þróunargeta", color: "#6b3d2d",
    desc: "Hversu sveigjanleg og framtíðarlæg er tæknigrunngeta þín?",
    questions: [
      { id: 16, text: "Hvernig er málakerfið þitt þróað og haldið við?",
        opts: [
          {label:"Gamalt kerfi (legacy) sem er erfitt að uppfæra eða breyta", explain:"Arfleifðarkerfi eru dýr í viðhaldi og hindra nýsköpun – oft stærsta tæknilega áhættan í rekstrinum."},
          {label:"Skynsamlegt kerfi en uppfærslur eru tímafrekar og dýrar", explain:"Kerfið virkar en breytingar taka of langan tíma og kosta of mikið – sveigjanleiki er takmarkaður."},
          {label:"Nútímalegt kerfi með reglubundnum uppfærslum og API-viðmóti", explain:"Reglulegar uppfærslur og opið API – hægt að tengja við önnur kerfi og bæta virkni án stórra inngripa."},
          {label:"Cloud-native kerfi með CI/CD, API-first og einingalegar uppfærslur", explain:"Kerfið er smíðað á nútímavísi – breytingar fara hratt í framleiðslu, einar einingar uppfærast án þess að raska heildinni."}
        ] },
      { id: 17, text: "Hversu auðvelt er að aðlaga og stilla kerfið að nýjum þörfum án kóðabreytinga?",
        opts: [
          {label:"Hvert einasta breyting þarf forritara – mjög takmarkaður sveigjanleiki", explain:"Allar stillingar krefjast forritara – langar biðlistur og háir þróunarkostnaðir."},
          {label:"Suma hluti má breyta í stillingum en flókið krefst forritara", explain:"Einfaldar breytingar hægt að gera sjálfur en flóknari kröfur krefjast tækniaðstoðar – flöskuháls myndast."},
          {label:"Flest flæðis- og eyðublaðseiningar eru stillanlegar af sérfræðingum", explain:"Sérfræðingar geta stillt flæði, eyðublöð og reglur sjálfir – dregur verulega úr háð forritara."},
          {label:"Low-code/no-code stillingar sem þjónustuaðilar stjórna sjálfir", explain:"Notendur stilla kerfið sjálfir – hraðari viðbrögð við breyttum þörfum og lægri rekstrarkostnaður."}
        ] },
      { id: 18, text: "Hefur stofnunin þín notað eða skoðað gervigreind (AI) í tengslum við málastjórnun?",
        opts: [
          {label:"Nei – gervigreind hefur ekki verið til skoðunar", explain:"AI er ekki á dagskrá – en samkeppnisaðilar eru líklega þegar farnir að nýta sér þessa tækni."},
          {label:"Við höfum rætt þetta en engar tilraunir eða innleiðing", explain:"Áhugi er til staðar en engin hagnýt reynsla – tilraunaverkefni (PoC) gæti gefið skýra mynd af möguleikum."},
          {label:"Við höfum gert einstaka tilraunir (t.d. sjálfvirk flokkun eða tillögur)", explain:"Tilraunir sýna framtíðargetu – næsta skref er að formgera og innleiða þær í framleiðsluumhverfi."},
          {label:"AI er hluti af reglulegu verkflæði – leit, flokkun og ákvarðanahjálp", explain:"AI er innbyggt í daglega vinnu – sparar tíma, bætir gæði og gefur betri grundvöll fyrir ákvarðanir."}
        ] },
      { id: 19, text: "Hvernig er þjálfun og þekkingarflutningur á milli starfsmanna háttað?",
        opts: [
          {label:"Óformlegar ráðleggingar frá reyndari samstarfsmönnum – ekkert skráð", explain:"Þekking er bundin við einstaklinga – ef reyndir starfsmenn fara tapast þekking varanlega."},
          {label:"Einstök þjálfunargögn en þau eru oft úrelt", explain:"Þjálfunargögn eru til en þau endurspegla ekki núverandi ferla – nýliðar fá ranga mynd."},
          {label:"Uppfærðar handbækur og reglubundnar þjálfunarlotur", explain:"Skipulögð þjálfun tryggir samræmi – nýir starfsmenn nýtast hratt og eldri starfsmenn uppfæra þekkingu sína."},
          {label:"Þekkingargrunnur innbyggður í kerfið með leit, hjálparefni og þjálfunareiningum", explain:"Þekkingin er aðgengileg í samhengi – starfsmaður fær hjálp nákvæmlega þar sem hann þarf á henni að halda."}
        ] },
      { id: 20, text: "Hvernig myndir þú lýsa heildarsátt haghafa á núverandi kerfið?",
        opts: [
          {label:"Almenn óánægja – kerfið er þröskuldur frekar en tól", explain:"Starfsmenn líta á kerfið sem hindrun – lítil notkun, mikil hjáleið og neikvæð afstaða til stafrænna lausna."},
          {label:"Blandaðar tilfinningar – þægilegt á sumum sviðum en langt frá ágætum", explain:"Sumir hlutar virka vel en aðrir valda gremju – einkenni kerfis sem hefur vaxið óskipulega."},
          {label:"Ánægja með grunnvirkni en flestar deildir vilja fleiri möguleika", explain:"Grunnurinn er traustur og starfsmenn sáttir – þörf er á nýjum eiginleikum til að halda í ánægju."},
          {label:"Kerfið er metið sem lykilverkfæri og ánægja er almenn", explain:"Kerfið er hluti af daglegri vinnu og metið til verðleika – merki um vel heppnaða innleiðingu og þjálfun."}
        ] },
    ] },
];

export const MATURITY_LEVELS = [
  { label:"Grunn", min:20, max:34, desc:"Ferlarnir eru óformlegir og háðir einstaklingum. Veruleg áhætta á villum, töfum og þekkingarmisstöpum.", color:"#c0392b" },
  { label:"Þróunar", min:35, max:47, desc:"Nokkur skipulag er til staðar en samræmi og stöðugleiki skortir. Grunnur er til að byggja á.", color:"#d68910" },
  { label:"Skilgreint", min:48, max:59, desc:"Helstu ferlar eru skjalfestir og fylgt er eftir. Nokkur líkur eru á stöðugum rekstri.", color:"#2980b9" },
  { label:"Stjórnað", min:60, max:71, desc:"Ferlarnir eru mælanlegir og tæknin styður við stjórnun. Góður grunnur fyrir stækkun.", color:"#27ae60" },
  { label:"Bestu venjur", min:72, max:80, desc:"Stofnunin er á stigi bestu venja í greininni. Kerfið er sjálfbært og framsækið.", color:"#8e44ad" },
];

export const SERVICE_PACKAGES = [
  { id:"VP01", slug:"gervigreind-og-greining", title:"Gervigreind & Greining", category:"ai",
    tagline:"Umbreytum gögnum í greind með AI-knúnum lausnum",
    description:"Við greinum gögn þín, byggjum mælaborð og innleiðum gervigreindarlausnir sem spara tíma og auka gæði ákvarðana.",
    color:"#2563eb", price:"1.200.000 – 2.400.000 ISK", duration:"4–8 vikur",
    deliverables:["Gagnagreining og AI-hæfnismat","Sérsniðið mælaborð (Power BI / Metabase)","AI-sjálfvirkni á 2–3 verkferlum","Þjálfun og þekkingarflutningur"],
    phases:["Gagnaúttekt","Hönnun","Þróun","Prófanir","Afhending"] },
  { id:"VP02", slug:"reglufylgni-og-stjornun", title:"Reglufylgni & Stjórnun", category:"compliance",
    tagline:"ISO 27001, GDPR og innri stjórnun á einum stað",
    description:"Frá gap-greiningu til fullrar vottunargetu. Við tryggjum að öryggiskerfi og reglufylgni séu í lagi.",
    color:"#059669", price:"950.000 – 1.800.000 ISK", duration:"3–6 vikur",
    deliverables:["Gap-greining (ISO 27001 / GDPR)","Öryggisstefna og viðbragðsáætlun","Áhættumat og aðgerðaáætlun","Innri úttekt og vottunarstuðningur"],
    phases:["Greining","Stefnumótun","Innleiðing","Úttekt"] },
  { id:"VP03", slug:"upplifun-og-samthaetting", title:"Upplifun & Samþætting", category:"ux",
    tagline:"Notendamiðuð hönnun og kerfissamþætting",
    description:"Við bætum notendaupplifun, samþættum kerfi og fjarlægjum flöskuhálsa í stafrænum ferlum.",
    color:"#7c3aed", price:"1.400.000 – 2.600.000 ISK", duration:"6–12 vikur",
    deliverables:["Notendarannsókn og ferlagreining","UX-endurhönnun á lykilskjámyndum","API-samþætting milli kerfa","Prófanir og frammistöðubestun"],
    phases:["Rannsókn","Hönnun","Þróun","Samþætting","Afhending"] },
  { id:"VP04", slug:"radgjof-og-stefnumotun", title:"Ráðgjöf & Stefnumótun", category:"advisory",
    tagline:"Stefnumiðuð ráðgjöf fyrir stafræna umbreytingu",
    description:"Óháð ráðgjöf sem styður leiðtoga við að taka réttari ákvarðanir um tækni, skipulag og fjárfestingar.",
    color:"#dc2626", price:"800.000 – 1.600.000 ISK", duration:"2–4 vikur",
    deliverables:["Stöðumat og tækifæragreining","Stefnumiðuð vegvísiskort (roadmap)","Viðskiptarök (business case)","Stjórnendakynning og næstu skref"],
    phases:["Viðtöl","Greining","Tillaga","Kynning"] },
  { id:"M01", slug:"iso-27001-innleiding", title:"ISO 27001 Innleiðing", category:"compliance",
    tagline:"Frá grunni að vottun á 12 vikum",
    description:"Heildstæð innleiðing ISO 27001 upplýsingaöryggisstaðalsins, frá gap-greiningu til vottunarhæfni.",
    color:"#059669", price:"2.200.000 – 3.800.000 ISK", duration:"8–12 vikur",
    deliverables:["Gap-greining og áhættumat","ISMS stefnuskjöl og verklag","Innri úttektarferli","Vottunarstuðningur og þjálfun"],
    phases:["Gap-greining","Hönnun ISMS","Innleiðing","Innri úttekt","Vottun"] },
  { id:"M02", slug:"stafraen-heilsufarssk", title:"Stafræn Heilsufarsskoðun", category:"advisory",
    tagline:"Hvar stendur þín stafræna vegferð?",
    description:"Ítarleg greining á stafrænum þroska, kerfum, ferlum og hæfni. Skýr vegvísir til framfara.",
    color:"#dc2626", price:"650.000 – 950.000 ISK", duration:"2–3 vikur",
    deliverables:["Stafrænt þroskamat","Kerfis- og ferlagreining","Forgangsröðuð aðgerðaáætlun","Stjórnendaskýrsla"],
    phases:["Viðtöl","Greining","Skýrsla","Kynning"] },
  { id:"M03", slug:"verkefnastjornun", title:"Verkefnastjórnun", category:"advisory",
    tagline:"Fagleg verkefnastjórnun frá upphafi til enda",
    description:"Reynslumikil verkefnastjórnun sem tryggir tímasetningar, gæði og samskipti.",
    color:"#7c3aed", price:"Samkvæmt samkomulagi", duration:"Eftir verkefni",
    deliverables:["Verkáætlun og áfangaskipting","Stýrihópaupplýsingar og framvinduskýrslur","Áhættustýring og aðgerðaáætlun","Lokaafhending og skjölun"],
    phases:["Verkáætlun","Framkvæmd","Eftirfylgni","Lokaafhending"] },
];

export const RETAINERS = [
  { id:"R01", slug:"manadarlegt-raduneyti", title:"Mánaðarlegt Ráðuneyti",
    tagline:"Fasti ráðgjafinn þinn í síma og tölvupósti", color:"#2563eb",
    tiers:[
      { name:"Grunnur", hours:10, price:"180.000 ISK/mán.", features:["Tölvupóst- og símastuðningur","Forgangssvörun innan 24 klst.","Mánaðarleg stöðuyfirferð"] },
      { name:"Miðja", hours:20, price:"320.000 ISK/mán.", features:["Allt í Grunni","Vikulegir stuttfundir (30 mín.)","Aðgangur að sniðmátasafni","Ársfjórðungsleg stefnuyfirferð"] },
      { name:"Úrvals", hours:40, price:"560.000 ISK/mán.", features:["Allt í Miðju","Daglegur aðgangur","Viðveruráðgjöf á staðnum","Stjórnendakynningar","AI-verkfærastuðningur"] },
    ] },
  { id:"R02", slug:"iso-vidhald", title:"ISO Viðhald & Eftirlit",
    tagline:"Tryggðu stöðuga reglufylgni allan ársins hring", color:"#059669",
    tiers:[
      { name:"Grunneftirlit", hours:5, price:"95.000 ISK/mán.", features:["Mánaðarleg áhættuskoðun","Uppfærsla á stefnuskjölum","Tilkynningastuðningur"] },
      { name:"Full eftirfylgni", hours:15, price:"240.000 ISK/mán.", features:["Allt í Grunneftirliti","Ársfjórðungsleg innri úttekt","Starfsmannaþjálfun","Atvikastjórnun og viðbragð"] },
    ] },
];

export const BYRDING_FLOWS = [
  { id:"B01", slug:"ai-greining", title:"AI & Greining — Byrðing", forPackages:["VP01"],
    tagline:"Undirbúðu þig fyrir AI-innleiðingu",
    steps:[
      { title:"Gagnastaða", description:"Hvar eru gögnin þín og í hvaða formi?",
        checklist:[{item:"Yfirsýn yfir gagnagrunna og skrár",required:true},{item:"Listi yfir lykilmælingar (KPIs)",required:true},{item:"Aðgangur að prófunargögnum",required:true},{item:"Skilgreining á gagnaverndarreglum",required:false}] },
      { title:"Tækniumhverfi", description:"Hvaða kerfi og verkfæri eru í notkun?",
        checklist:[{item:"Kerfislisti (ERP, CRM, CMS, o.fl.)",required:true},{item:"API-skjölun ef til staðar",required:false},{item:"Tæknilegt tengiliðtilnefnt",required:true}] },
      { title:"Markmið & Forgangsröðun", description:"Hvað viljið þið ná fram?",
        checklist:[{item:"Skilgreind 3 helstu markmið",required:true},{item:"Árangursmælingar samþykktar",required:true},{item:"Tímalínuvæntingar staðfestar",required:false},{item:"Fjárhagsáætlun samþykkt",required:true}] },
    ] },
  { id:"B02", slug:"reglufylgni", title:"Reglufylgni — Byrðing", forPackages:["VP02","M01"],
    tagline:"Undirbúðu ISO / GDPR ferðalagið",
    steps:[
      { title:"Núverandi staða", description:"Hvar eruð þið í dag?",
        checklist:[{item:"Fyrirliggjandi öryggisstefna (ef til)",required:false},{item:"Listi yfir upplýsingaeignir",required:true},{item:"Skipurit upplýsingatæknideildar",required:true},{item:"Þekkt vandamál eða atvik",required:false}] },
      { title:"Haghafar & Hlutverk", description:"Hverjir koma að verkefninu?",
        checklist:[{item:"Verkefnisstjóri tilnefndur",required:true},{item:"Yfirstjórn hefur samþykkt",required:true},{item:"Tengiliðir deilda skilgreindir",required:true}] },
      { title:"Skjöl & Aðgangur", description:"Hvað þurfum við frá ykkur?",
        checklist:[{item:"Aðgangur að innri kerfum (lesaðgangur)",required:true},{item:"Fyrri úttektarskýrslur ef til",required:false},{item:"Fundarherbergi og tímarammi staðfest",required:true}] },
    ] },
];

export const CSAT_Q: Record<string, Array<{id:string;label:string;type:string}>> = {
  service:[{id:"overall",label:"Heildaránægja með þjónustuna",type:"rating"},{id:"quality",label:"Gæði afurða og afhendingar",type:"rating"},{id:"communication",label:"Samskipti og upplýsingaflæði",type:"rating"},{id:"value",label:"Verðmæti miðað við verð",type:"rating"},{id:"recommend",label:"Myndir þú mæla með okkur?",type:"nps"},{id:"comment",label:"Athugasemdir eða tillögur",type:"text"}],
  retainer:[{id:"response",label:"Svartími og aðgengi",type:"rating"},{id:"expertise",label:"Sérþekking ráðgjafa",type:"rating"},{id:"proactive",label:"Frumkvæði og tillögur",type:"rating"},{id:"recommend",label:"Myndir þú mæla með okkur?",type:"nps"},{id:"comment",label:"Hvað getum við gert betur?",type:"text"}],
  byrding:[{id:"clarity",label:"Skýrleiki leiðbeininga",type:"rating"},{id:"preparation",label:"Undirbúningurinn hjálpaði mér",type:"rating"},{id:"effort",label:"Fyrirhöfn var hófleg",type:"rating"},{id:"comment",label:"Hvað hefði mátt vera öðruvísi?",type:"text"}],
};

export const card = { background:"white", border:"1px solid #e2e8f0", borderRadius:12, padding:24, transition:"all .2s" } as const;
export const hoverCard = (e: React.MouseEvent) => { const t = e.currentTarget as HTMLElement; t.style.borderColor="#cbd5e1"; t.style.transform="translateY(-2px)"; t.style.boxShadow="0 8px 24px rgba(0,0,0,.06)"; };
export const unhoverCard = (e: React.MouseEvent) => { const t = e.currentTarget as HTMLElement; t.style.borderColor="#e2e8f0"; t.style.transform="translateY(0)"; t.style.boxShadow="none"; };
