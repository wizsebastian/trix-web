# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based landing page for TRIX, a geospatial technology company that combines GIS (Geographic Information Systems) with AI. The project represents a company evolution from Geomatrix to TRIX, focusing on spatial intelligence and artificial intelligence solutions.

## Architecture

### Current State
- **Single Component Structure**: The codebase currently contains one main React component (`example.tsx`) that serves as a complete landing page
- **Self-Contained Styling**: CSS animations and styles are injected directly into the DOM via JavaScript, rather than using external stylesheets
- **No Build System**: No package.json, build tools, or dependency management system is currently configured

### Key Components

**Main Component**: `example.tsx` (1,084 lines)
- `TrixLanding`: Main landing page component with multiple sections
- `GISMapVisualization`: Interactive GIS map visualization component with animated layers and data points
- `AIGISConvergence`: Component showing the convergence of AI and GIS technologies

### Technologies Used
- React with Hooks (useState, useEffect)
- Lucide React for icons
- Tailwind CSS classes for styling
- Custom CSS animations (injected via JavaScript)
- SVG for map visualizations and geometric graphics

## Project Purpose

According to the readme.md, this is a development example for creating a functional React web application that:
- Takes a design model and creates a functional app
- Runs locally 
- Integrates an image into the GTS product view

The landing page showcases TRIX's services including:
- Precision geomatics and topographic surveys
- Spatial intelligence combined with AI
- Technological solutions and GIS platforms
- Project management and strategic consulting

## Development Commands

### Essential Commands
- `npm run dev` - Start development server (runs on http://localhost:5173)
- `npm run build` - Build for production 
- `npm run preview` - Preview production build locally
- `npm install` - Install dependencies

### Development Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open browser to http://localhost:5173

### Project Dependencies
- React 18 with TypeScript
- Vite for build tooling and development server
- Tailwind CSS for styling
- Lucide React for icons
- ESLint for code linting

### Code Organization
The current single-file approach should be refactored into:
- Separate components for different sections
- External CSS files for custom animations
- Proper asset management for images
- Component-based architecture for maintainability

### Key Features to Maintain
- Interactive GIS map visualizations
- Smooth animations and transitions
- Responsive design for mobile and desktop
- Contact form with email integration
- Multi-section layout with navigation