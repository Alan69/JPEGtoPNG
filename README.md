# Image Converter React App

A modern, responsive React web application for converting images between JPEG and PNG formats using HTML5 Canvas API. Features Google AdSense integration and a clean, mobile-friendly UI built with TailwindCSS.

## Features

### 🖼️ Image Conversion
- **Upload multiple images**: Support for JPEG and PNG formats
- **Drag & drop interface**: Easy file selection with visual feedback
- **Instant conversion**: Convert JPEG ↔ PNG using HTML5 Canvas API
- **Batch processing**: Handle multiple images simultaneously
- **Client-side processing**: No data sent to servers - all processing happens locally

### 📱 User Experience
- **Responsive design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean interface built with TailwindCSS
- **Loading states**: Visual feedback during image processing
- **Error handling**: Graceful error handling with user-friendly messages
- **Progress tracking**: Real-time progress indicators

### 💰 Monetization
- **Google AdSense integration**: Ready-to-use ad placement components
- **Strategic ad placement**: Ads above upload section and below results
- **Placeholder system**: Easy to replace with real AdSense client ID

## Tech Stack

- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons
- **HTML5 Canvas API**: Client-side image processing

## Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd /path/to/your/project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Configuration

### Google AdSense Setup

1. **Replace placeholder client ID** in `index.html`:
   ```html
   <!-- Replace ca-pub-xxxxxxxxxxxxxx with your actual AdSense client ID -->
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR-CLIENT-ID" crossorigin="anonymous"></script>
   ```

2. **Update AdBanner components** in `src/App.jsx`:
   ```jsx
   <AdBanner 
     clientId="ca-pub-YOUR-CLIENT-ID"
     slot="YOUR-SLOT-ID"
   />
   ```

### Customization

- **Styling**: Modify TailwindCSS classes in components
- **Colors**: Update CSS variables in `src/index.css`
- **Layout**: Adjust grid layouts and spacing in components
- **Features**: Add new conversion formats or processing options

## Project Structure

```
src/
├── components/
│   ├── AdBanner.jsx          # Google AdSense integration
│   ├── ImageUploader.jsx     # File upload with drag & drop
│   └── ImagePreview.jsx      # Image display and download
├── lib/
│   └── utils.js              # Utility functions
├── App.jsx                   # Main application component
├── main.jsx                  # React entry point
└── index.css                 # Global styles and TailwindCSS
```

## Key Components

### AdBanner
- Reusable Google AdSense component
- Automatic script loading
- Placeholder support for development
- Responsive ad display

### ImageUploader
- Drag and drop file selection
- File validation (JPEG/PNG only)
- Multiple file support
- Visual feedback and error handling

### ImagePreview
- Grid layout for converted images
- Download functionality with proper file naming
- Conversion status indicators
- Batch download option

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile browsers**: Responsive design works on all modern mobile browsers

## Performance Features

- **Lazy loading**: Images loaded only when needed
- **Memory management**: Proper cleanup of object URLs
- **Efficient processing**: Canvas API for fast image conversion
- **Optimized builds**: Vite for fast development and production builds

## SEO Features

- **Meta tags**: Proper description and keywords
- **Semantic HTML**: Accessible markup structure
- **Fast loading**: Optimized for Core Web Vitals
- **Mobile-first**: Responsive design for all devices

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please check the code comments or create an issue in the project repository.