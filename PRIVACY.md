# Política de Privacitat i Protecció de Dades

## 1. Titular i responsable del tractament

**Autor i responsable:** @5085
**DNI:** 
**Contacte:** aadsuarg@gmail.com

---

## 2. Política de no retenció de dades (Zero Data Retention)

Aquesta aplicació ha estat desplegada amb la configuració de **retenció zero de dades** de Firebase/Google Cloud:

- **Firebase Hosting** no emmagatzema cap dada d'usuari. Serveix fitxers estàtics i no registra contingut de les sessions.
- **Google Gemini API** opera sota la política oficial de Google per a clients d'API: *"Les dades enviades a l'API no s'utilitzen per entrenar models de Google."* ([Política oficial Google AI](https://ai.google.dev/gemini-api/terms))
- **Firestore** està configurat amb el **Google Cloud Data Processing Addendum (DPA/GDPR mode)**, que obliga Google a processar les dades únicament seguint les instruccions del responsable i a no retenir-les fora dels fins del servei.
- Les sol·licituds a l'API de Gemini no es registren (logging desactivat per defecte en mode producció).

---

## 3. Encriptació de les dades

Totes les dades es protegeixen amb:

- **En trànsit:** TLS 1.3 (HTTPS obligatori — Firebase Hosting aplica HSTS per defecte)
- **En repòs:** AES-256 (estàndard de Google Cloud / Firebase Firestore)
- **Claus d'API:** emmagatzemades com a variables d'entorn del servidor, mai exposades al client

---

## 4. No alimentació de models d'IA

Queda expressament prohibit i tècnicament impedit que les dades introduïdes pels usuaris s'utilitzin per:

- Entrenar, ajustar o millorar models d'intel·ligència artificial
- Compartir-les amb tercers amb finalitats comercials
- Generar perfils d'usuari

L'API de Gemini utilitzada és la versió de pagament (API Key privada), que garanteix per contracte que les dades **no s'utilitzen per entrenar models** ([Google Generative AI Additional Terms](https://ai.google.dev/gemini-api/terms#data-use-unpaid)).

---

## 5. Auditoria

Aquesta aplicació es troba sotmesa a:

- **Auditoria interna periòdica** de seguretat i accés per part de l'autor
- Les regles de Firestore (`firestore.rules`) defineixen i limiten l'accés a les dades
- Les capçaleres HTTP de seguretat estan configurades al `firebase.json` de cada desplegament

### 5.1. Accés temporal per a auditories de tercers legítims

L'autor reconeix el dret de tercers legitimament interessats a verificar el funcionament tècnic de l'aplicació en el marc d'auditories formals. En particular:

- **Registre de la Propietat Intel·lectual** (Generalitat de Catalunya / Ministerio de Cultura)
- **Agencia Española de Protección de Datos (AEPD)** o autoritats autonòmiques equivalents
- **Perits judicials** designats per òrgans jurisdiccionals
- **Auditors interns** dels Mossos d'Esquadra o de la Generalitat de Catalunya en el marc de les seves competències

A petició formal i motivada dirigida a `aadsuarg@gmail.com`, l'autor facilitarà **credencials d'accés temporal** (TIP de demostració amb PIN específic) per al període mínim necessari per a la realització de l'auditoria. Aquestes credencials caducaran automàticament al cap de **7 dies naturals** des de la seva emissió, llevat que l'auditor justifiqui raonadament la necessitat d'una pròrroga.

Tots els accessos efectuats amb credencials de demostració queden registrats al sistema de logs de Firestore (col·lecció `activity_log`) amb marca temporal, i l'autor es reserva el dret a revisar i auditar aquests accessos per garantir l'exclusiva utilització en el marc declarat.

L'aplicació, **per disseny, no processa dades personals reals**: la introducció, processament i emmagatzematge de dades identificatives està tècnica i contractualment impedida. En conseqüència, qualsevol auditoria sobre dades personals té un abast funcional limitat per la pròpia naturalesa de l'eina.

---

## 6. Recomanació d'ús — Privacitat per Disseny (Art. 25 RGPD)

Aquesta aplicació ha estat dissenyada seguint els principis de **Privacitat per Disseny i per Defecte** (Art. 25 del Reglament (UE) 2016/679 — RGPD):

> ⚠️ **Es recomana expressament no introduir dades de caràcter personal** (noms, DNI, domicilis, dades mèdiques, matrícules de vehicles, etc.) en cap camp de l'aplicació.
>
> Per a la identificació de persones o vehicles, utiliseu codis interns, referències numèriques o l'identificador intern del cas.

---

## 7. Marc legal aplicable

- Reglament (UE) 2016/679 del Parlament Europeu — **RGPD**
- Llei Orgànica 3/2018, de 5 de desembre — **LOPDGDD**
- Reial Decret Legislatiu 1/1996 — **Llei de Propietat Intel·lectual**
- Google Cloud Data Processing Addendum — **DPA GDPR**

---

*Document generat el 26 d'abril de 2026. Versió 1.0.*
