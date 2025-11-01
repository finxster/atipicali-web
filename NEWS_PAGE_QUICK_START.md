# News Page - Quick Start Guide

## Accessing the News Page

1. **From Navigation Bar**: Click the "News" link in the top navigation bar
2. **Direct URL**: Navigate to `http://localhost:5173/news` (dev) or `/news` (production)

## Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        Navbar with News Link                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ News & Blog                                                  │
│ Stay updated with the latest news and insights...            │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┬──────────────────────────┐
│                                  │                          │
│  MAIN CONTENT                    │   SIDEBAR                │
│  ├─ Article 1                    │   ├─ All Articles        │
│  │  ├─ Date: Nov 01, 2025        │   │  └─ 12 articles      │
│  │  ├─ Author: John              │   │                      │
│  │  ├─ Reading: 5 min            │   ├─ Article 1           │
│  │  ├─ Title                     │   │  └─ Nov 01, 2025     │
│  │  ├─ Summary                   │   ├─ Article 2           │
│  │  └─ [Read Article →]          │   │  └─ Oct 31, 2025     │
│  │                               │   ├─ Article 3           │
│  ├─ Article 2                    │   │  └─ Oct 30, 2025     │
│  ├─ Article 3                    │   └─ ... (scrollable)    │
│  ├─ Article 4                    │                          │
│  └─ Article 5                    │   (sticky on desktop)    │
│                                  │                          │
│  Pagination                      │                          │
│  [Previous] [1] [2] [3] [Next]   │                          │
└──────────────────────────────────┴──────────────────────────┘
```

## User Interactions

### Article List (Main Content)
- **Click "Read Article"** → Opens full article modal
- **Click "Previous/Next"** → Navigate between pages
- **Click page number** → Jump to specific page

### Sidebar
- **Click any article** → Opens that article in modal
- **Scroll** → See all available articles
- **Current article** → Highlighted with blue accent

### Full Article Modal
- **Previous/Next buttons** → Navigate between articles
- **"Back to List"** → Return to article list and close modal
- **Close button (×)** → Close modal without navigation
- **Scroll** → Read long articles with proper formatting

## Responsive Behavior

### Desktop (1024px+)
- Main content: 66% width
- Sidebar: 33% width (sticky position)
- Full navigation bar visible

### Tablet (768px-1023px)
- Adjusted spacing
- Sidebar still visible
- Navigation optimized

### Mobile (< 768px)
- Full-width stacked layout
- Sidebar below main content
- "News" link hidden in navbar (space-saving)
- Touch-friendly button sizing

## Data Flow

```
┌─────────────────┐
│  NewsPage.vue   │
└────────┬────────┘
         │ onMounted
         ├──> fetchNews()
         └──> GET /api/public/news
              │
              ├─> Success: Parse & store articles
              ├─> Error: Show error message + retry button
              └─> Display loading skeleton
```

## Features Explained

### Pagination
- **5 articles per page** (configurable in component)
- Shows numbered page buttons
- Intelligently displays up to 5 page numbers
- Disabled state for boundary pages

### Sidebar Navigation
- **Quick access** to all articles
- **Max height with scrolling** for organized view
- **Current selection highlighting** (blue background + left border)
- **Sticky position** on desktop (stays visible while scrolling)

### Article Modal
- **Full HTML support** with safe sanitization
- **Metadata display**: Author, publication date, reading time
- **Article navigation**: Move between articles without closing modal
- **Summary styling**: Italicized with visual accent
- **Professional typography**: Proper styling for all HTML elements

### Translations
- All text automatically translates based on user's language selection
- Supports: English (🇺🇸) and Portuguese (🇧🇷)

## Installation & Setup

### Dependencies Added
```bash
npm install dompurify
```

### Route Added
- Path: `/news`
- Component: `NewsPage.vue`
- Name: `NewsPage`
- No authentication required

### Translations Added
Both English and Portuguese translations include:
- Page title & subtitle
- Article metadata labels
- Button labels
- Navigation text
- Error messages
- Pagination text

## API Requirements

Your backend must provide:

**Endpoint**: `GET /api/public/news`

**Response Format**:
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "title": "Article Title",
    "summary": "Brief summary of the article",
    "content": "<h2>HTML Content</h2><p>Full article body...</p>",
    "readingTime": "5 min read",
    "author": "Author Name",
    "createdAt": "2025-11-01T21:33:37.654Z",
    "updatedAt": "2025-11-01T21:33:37.655Z"
  }
]
```

**Status Codes**:
- `200 OK`: Articles retrieved successfully
- `500 Internal Server Error`: Server error (will show error state)
- No pagination parameters needed (all articles returned at once, pagination handled client-side)

## Testing Checklist

- [ ] Navigate to `/news` route
- [ ] Articles load and display correctly
- [ ] Pagination works (Previous/Next/page numbers)
- [ ] Click sidebar article - opens in modal
- [ ] HTML content renders properly
- [ ] Close modal and verify
- [ ] Article navigation (prev/next in modal) works
- [ ] Language switching updates all text
- [ ] Mobile layout stacks properly
- [ ] Sidebar is sticky on desktop
- [ ] Error state shows with retry button
- [ ] Empty state shows when no articles
