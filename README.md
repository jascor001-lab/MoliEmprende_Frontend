# MoliEmprende Frontend

Formulario web de registro dinámico para emprendedores y artesanos del distrito de La Molina.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Framer Motion
- Lucide Icons

## Inicio rápido

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura

```
src/
├── app/                    # App Router (layout, page, globals)
├── components/
│   ├── form/
│   │   ├── MoliEmprendeWizard.tsx   # Wizard principal
│   │   ├── ProgressBar.tsx
│   │   ├── NotResidentScreen.tsx    # Pantalla no residentes + WhatsApp
│   │   ├── SuccessScreen.tsx
│   │   └── steps/                   # Pasos del formulario
│   └── ui/
│       ├── RadioCardGroup.tsx       # Radio cards + Checkbox cards
│       └── FileDropzone.tsx
├── lib/
│   └── validations.ts               # Esquemas Zod por paso
└── types/
    └── form.ts                      # Tipos e interfaces
```

## Flujo del formulario

1. **Paso 0** — Verificación de residencia (DNI + adjunto + confirmación La Molina)
2. **Paso 1** — Grupo de pertenencia (Emprendedor / Artesano + subclasificación)
3. **Paso 2** — Datos dinámicos según clasificación (RUC, RNA, contacto)
4. **Paso 3** — Información comercial y intereses de participación

Si el usuario no confirma residencia en La Molina, se muestra pantalla con enlace a WhatsApp oficial.

## Configuración

Actualiza el enlace de WhatsApp en `src/types/form.ts`:

```ts
export const WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/TU_ENLACE";
```
