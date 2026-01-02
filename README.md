# AI Agent Prompt Creator

Profesionalna aplikacija za kreiranje detaljnih promptova za AI agente sa neograničenim kategorijama i importom fajlova.

## 🚀 Karakteristike

- **Neograničene kategorije i podkategorije** - Kreirajte hijerarhijsku strukturu bilo koje dubine
- **Import fajlova** - Dodajte fajlove na bilo kom nivou kategorije/podkategorije za AI obuku
- **Moderan UI** - Elegantan interfejs inspirisan TSX aplikacijama
- **Live preview** - Trenutni pregled generisanog prompta
- **Export opcije** - Kopirajte u clipboard ili preuzmite kao Markdown fajl
- **Statistika** - Pratite broj reči i karaktera
- **Drag-and-drop** - Intuitivno dodavanje fajlova
- **Dark/Light mode** - Automatska prilagođava se sistemskim podešavanjima

## 📦 Instalacija

```bash
npm install
```

## 🛠️ Razvoj

Pokrenite razvojni server:

```bash
npm run dev
```

Aplikacija će biti dostupna na `http://localhost:5173/` (ili sledećem slobodnom portu).

## 🏗️ Build

Kreirajte produkcijsku verziju:

```bash
npm run build
```

Pregledate produkcijsku verziju:

```bash
npm run preview
```

## 📖 Kako koristiti

### 1. Kreiranje kategorija

- Kliknite na **+** dugme pored "Kategorije" da dodate root kategoriju
- Kliknite na **+** dugme pored bilo koje kategorije da dodate podkategoriju
- Podkategorije mogu imati svoje podkategorije (neograničena dubina)

### 2. Organizacija sadržaja

- Kliknite na naziv kategorije da ga izmenite
- Unesite sadržaj prompta u tekstualno polje
- Svaka kategorija/podkategorija može imati sopstveni sadržaj

### 3. Import fajlova

- Kliknite na "Klikni da izabereš fajlove" ili prevucite fajlove
- Možete dodati bilo koji tekstualni fajl (.txt, .md, .json, .ts, .jsx, itd.)
- Fajlovi se mogu dodati na bilo kom nivou kategorije/podkategorije
- Svaki fajl se prikazuje sa nazivom i veličinom

### 4. Export

**Kopiraj u clipboard:**
- Kliknite "Kopiraj" dugme u Export panelu

**Preuzmi kao fajl:**
- Kliknite "Preuzmi .md" dugme da sačuvate kao Markdown fajl

**Format exporta:**
```markdown
# AI Agent Prompt

## Kategorija 1
Sadržaj kategorije...

**Importovani fajlovi:**
- **file.txt**
\`\`\`
Sadržaj fajla...
\`\`\`

### Podkategorija 1.1
Sadržaj podkategorije...
```

## 🎯 Struktura projekta

```
PromptApp/
├── src/
│   ├── components/
│   │   ├── CategoryTree.tsx      # Stablo kategorija
│   │   ├── PromptEditor.tsx      # Editor za sadržaj
│   │   └── ExportPanel.tsx       # Panel za export
│   ├── types.ts                  # TypeScript definicije
│   ├── App.tsx                   # Glavna komponenta
│   └── main.tsx                  # Entry point
├── public/
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🔧 Tehnologije

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool i dev server
- **Lucide React** - Ikone
- **CSS3** - Stilizovanje

## 💡 Primer upotrebe

1. Kreirajte glavne kategorije za različite aspekte AI agenta:
   - Kontekst i pozadina
   - Pravila i ograničenja
   - Primeri i obuka
   - Outputi i formatiranje

2. Za svaku kategoriju dodajte podkategorije za specificnije teme

3. Importujte relevantne fajlove sa primerima, dokumentacijom ili obukom

4. Dodajte tekstualne instrukcije i opise u svaku kategoriju

5. Eksportujte finalni prompt kao Markdown fajl ili kopirajte direktno

## 📝 Licenca

MIT License

## 🤝 Doprinos

Pull requests su dobrodošli! Za velike izmene, molimo prvo otvorite issue da diskutujemo šta biste želeli da promenite.

---

Razvijeno sa ❤️ za potrebe kreiranja kvalitetnih AI Agent promptova
