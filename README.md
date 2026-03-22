# Webshop Project

Ovo je **React + Vite** projekat za webshop sa podrškom za backend preko **Vercel Functions** i bazom podataka preko **Supabase**.  
Projekt je dizajniran kao SPA (Single Page Application) sa dinamičkim rutama za korisnike, admin, i inbox/support sistem.

---

## 🛠 Tehnologije

- **Frontend:** React 19 + Vite 7  
- **Routing:** React Router Dom 7  
- **Backend:** Vercel Serverless Functions (`/api`)  
- **Baza podataka:** Supabase  
- **CSS:** TailwindCSS + PostCSS  
- **Linting:** ESLint  
- **Deploy:** Vercel  

---

## 🚀 Instalacija i lokalni razvoj

1. Kloniraj repo:

```bash
git clone https://github.com/hanscmd/webshop-project.git
cd webshop-project
```

2. Instaliraj dependencies:

```bash
npm install
```

3. Pokreni lokalno frontend i API:

```bash
npm run dev:all
```

4. Opcije:

# Samo frontend

```bash
npm run dev
```

# Samo API

```bash
npm run dev:api
```