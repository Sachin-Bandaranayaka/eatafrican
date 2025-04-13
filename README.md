# African Restaurant Website

This is a website for an African restaurant, built with Next.js and Tailwind CSS.

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install` or `yarn install` or `pnpm install`
3. Run the development server: `npm run dev` or `yarn dev` or `pnpm dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Replacing Images

### Logo
Replace the placeholder logo with your actual logo:
- Copy your logo file to `/public/images/logo.png`

### Chef Images
Replace the placeholder chef images with your actual chef images:
- Copy chef image 1 to `/public/images/chefs1.png` (used in the main content area on both desktop and mobile)
- Copy chef image 2 to `/public/images/chefs2.png` (used in the mobile "How it works" tab content)

### Food Background Images
Replace the placeholder food images with your actual food images:
- For desktop: Copy food images to `/public/images/food1.jpg` through `/public/images/food9.jpg` (background grid)
- For mobile: Copy food images to `/public/images/food1.jpg` through `/public/images/food6.jpg` (background grid)

### Image Requirements
- Logo: PNG format with transparent background recommended
- Chef images: PNG format with transparent background (if applicable)
- Food images: JPG format, recommended size 800x800px or larger

## Features

- Responsive design (mobile and desktop)
- Interactive tabs for "How It Works" and "Customer Feedback"
- Location selector
- Modern UI with image grid background
- Tailwind CSS for styling

## Hydration Issues

If you encounter React hydration errors like this:
```
Error: A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
```

This is usually caused by browser extensions adding attributes to HTML elements. We've implemented these solutions:

1. Added `suppressHydrationWarning` to the html element in `app/layout.tsx`
2. Created a `ClientOnly` component that only renders content on the client side
3. Modified hooks to safely handle client-side rendering
4. Disabled React strict mode in development

## Customization

- Edit text content in `app/page.tsx`
- Modify styles in `app/globals.css` and component files
- Update customer feedback in the relevant section of `app/page.tsx`
- Add or modify locations in the locations array in `app/page.tsx` 