# Dive Pal - Your Ultimate Diving Companion

A comprehensive, modern web application that helps divers find perfect dive sites, plan dives with essential tools, share experiences, and connect with the diving community. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🌊 **Smart Dive Site Discovery**
- Conversational 7-step questionnaire to understand your diving preferences
- Smart filtering by temperature, marine life, coral types, visibility, and more
- Beautiful dive site cards with detailed information and imagery
- Dual data sources: mock data and live Supabase integration

### 🧮 **Essential Dive Planning Tools**
- **Air Consumption Calculator** - Estimate tank duration at specific depths
- **SAC Rate Calculator** - Track your personal air consumption rate
- **NDL Reference Table** - Quick no-decompression limit lookup
- **MOD Calculator** - Maximum operating depth for nitrox diving
- **Weighting Calculator** - Estimate proper buoyancy weights

### ⭐ **Community Reviews & Ratings**
- Read detailed reviews from fellow divers
- Star rating system with average ratings display
- Write and share your own dive site experiences
- Interactive review submission with photos

### 📱 **Social Features**
- Community dive feed with photo sharing
- User profiles and dive logging
- Interactive map view of dive sites
- Mobile-first responsive design with ocean-themed UI

### ⚡ **Modern Performance**
- Skeleton loading states for smooth user experience
- Fast navigation with Next.js App Router
- Optimized images and responsive design
- Real-time data integration capabilities

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone or download the project
2. Install dependencies:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Using Mock Data vs Supabase

### Mock Data (Default)
The app comes with comprehensive sample data including dive sites, user reviews, and community posts that work out of the box. No setup required!

### Supabase Integration

To use live Supabase data:

1. **Setup Environment Variables** (optional):
   Create a `.env.local` file:
   \`\`\`
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_KEY=your-publishable-key
   \`\`\`

2. **Or Configure in UI**:
   - Click the settings icon in the "Data Source" card
   - Enter your Supabase URL and publishable key
   - Toggle "Use Live Supabase" to enable

3. **Database Setup**:
   Your Supabase database needs a function called `search_dive_sites_json` that accepts these parameters:

\`\`\`sql
-- Example function signature
CREATE OR REPLACE FUNCTION search_dive_sites_json(p jsonb)
RETURNS TABLE(
  id integer,
  name text,
  location text,
  lat numeric,
  lon numeric,
  temp_min integer,
  temp_max integer,
  marine_life text[],
  coral_type text[],
  visibility_min integer,
  site_type text[],
  access_type text,
  entry_difficulty text,
  description text,
  image_url text
)
\`\`\`

### Supabase Fetch Implementation

The app uses this exact fetch pattern for Supabase integration:

\`\`\`javascript
const payload = {
  p_temp_min: 25,
  p_temp_max: null,
  p_marine_life: ["sharks"],
  p_coral_type: null,
  p_visibility_min: null,
  p_site_type: null,
  p_access_type: null,
  p_entry_difficulty: null
};

const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/search_dive_sites_json`, {
  method: "POST",
  headers: {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ p: payload })
});

const data = await resp.json();
\`\`\`

## Project Structure

\`\`\`
src/
├── components/
│   ├── ChatFlow.tsx          # 7-question conversational form
│   ├── Results.tsx           # Dive site results with loading states
│   ├── SiteSummary.tsx       # Detailed site view with reviews
│   ├── Tools.tsx             # Dive planning calculators
│   ├── Feed.tsx              # Community dive feed
│   ├── Profile.tsx           # User profiles and dive logs
│   ├── LoadingStates.tsx     # Skeleton components for smooth UX
│   └── SupabaseToggle.tsx    # Data source configuration
├── mock/
│   ├── dive_sites.json       # Sample dive site data
│   └── feed.json             # Sample community posts
app/
├── layout.tsx                # Root layout with fonts and theme
├── page.tsx                  # Main application logic and routing
└── globals.css               # Ocean-themed styling with design tokens
\`\`\`

## Key Components

### Dive Planning Tools
- **Air Calculator**: Estimates tank duration based on depth, tank size, and consumption
- **SAC Calculator**: Calculates Surface Air Consumption rate from dive data
- **MOD Calculator**: Determines maximum operating depth for nitrox mixes
- **Weighting Calculator**: Estimates proper weight for different suit types and conditions

### Community Features
- **Reviews System**: Star ratings and detailed text reviews for dive sites
- **Social Feed**: Photo sharing and dive experience posts
- **User Profiles**: Personal dive statistics and logged dives

## Customization

### Adding More Mock Data
Edit `src/mock/dive_sites.json` to add more dive sites with this structure:

\`\`\`json
{
  "id": 1,
  "name": "Site Name",
  "location": "Location",
  "lat": -8.7274,
  "lon": 115.5442,
  "temp_min": 24,
  "temp_max": 28,
  "marine_life": ["turtles", "sharks"],
  "coral_type": ["table", "branching"],
  "visibility_min": 20,
  "site_type": ["wall", "reef"],
  "access_type": "boat",
  "entry_difficulty": "intermediate",
  "description": "Description of the dive site",
  "image_url": "/placeholder.svg?height=200&width=300"
}
\`\`\`

### Theming
The app uses a comprehensive ocean-themed design system defined in `app/globals.css`. Modify the CSS custom properties to change colors:

\`\`\`css
:root {
  --background: oklch(0.98 0.01 200); /* Light blue-white */
  --primary: oklch(0.55 0.15 200);    /* Ocean blue */
  --accent: oklch(0.75 0.12 180);     /* Turquoise */
  --ocean-50: oklch(0.97 0.02 200);   /* Very light ocean */
  --ocean-500: oklch(0.55 0.15 200);  /* Main ocean blue */
  --ocean-900: oklch(0.25 0.08 200);  /* Dark ocean */
  /* ... more colors */
}
\`\`\`

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The app is a standard Next.js application and can be deployed to any platform that supports Node.js.

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS v4** - Utility-first CSS framework with design tokens
- **shadcn/ui** - High-quality React components
- **Geist Font** - Modern typography
- **Lucide Icons** - Beautiful, consistent icons
- **React Hooks** - Modern state management and effects

## Performance Features

- **Skeleton Loading States** - Smooth loading experience with animated placeholders
- **Optimized Images** - Next.js Image component with lazy loading
- **Responsive Design** - Mobile-first approach with breakpoint optimization
- **Code Splitting** - Automatic route-based code splitting
- **Caching** - Efficient data fetching and caching strategies

## License

MIT License - feel free to use this project for your own diving adventures!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Roadmap

- [ ] Offline support for dive planning tools
- [ ] GPS integration for dive site check-ins
- [ ] Advanced dive log analytics
- [ ] Integration with dive computer data
- [ ] Multi-language support
- [ ] Dark mode theme option
