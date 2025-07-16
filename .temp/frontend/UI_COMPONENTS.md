# FereeLAB CMS UI Component System

This document outlines the standardized UI component system used throughout the FereeLAB CMS application.

## Panel System

The application uses a consistent panel system with two main variants:

### Panel Variants

1. **Translucent Panel** (`.panel-translucent`)
   - Semi-transparent background with backdrop blur
   - Used for modal dialogs and floating panels
   - Example: Model Panel

2. **Solid Panel** (`.panel-solid`) 
   - Solid background color with border
   - Used for menus and sidebar elements
   - Example: User Menu Panel

### Panel Structure

Panels use a consistent structure with these components:

- `.panel-layout-default` - The base flex column layout
- `.panel-header` - The panel header with title and close button
- `.panel-content` - The main content area with automatic scrolling
- `.panel-footer` - The action buttons area at the bottom

## Button System

Buttons follow a consistent style system:

### Button Sizes

- `.btn-sm` - Small buttons
- `.btn-md` - Medium buttons (default)
- `.btn-lg` - Large buttons

### Button Variants

- `.btn-primary` - Main action buttons
- `.btn-secondary` - Secondary action buttons
- `.btn-outline` - Bordered buttons
- `.btn-ghost` - Text-only buttons that show background on hover
- `.btn-icon` - Circular icon buttons

## CSS Variables

The UI system uses CSS variables organized by component type in `variables.css`:

- Panel system variables control panel appearance
- Button system variables control button styles
- Form element variables control input styling

## Usage Example

```jsx
<div className="panel-translucent panel-layout-default">
  <div className="panel-header">
    <h2>Panel Title</h2>
    <button className="btn btn-icon btn-ghost">
      <X size={20} />
    </button>
  </div>
  
  <div className="panel-content">
    Content goes here...
  </div>
  
  <div className="panel-footer">
    <button className="btn btn-md btn-primary">
      Submit
    </button>
  </div>
</div>
```

## Best Practices

1. Use the panel system for all dialog and menu UIs
2. Prefer translucent panels for modals and solid panels for menus
3. Use standardized button styles throughout the application
4. Follow the header/content/footer structure for consistency
