# 🔧 FlashTastic Embed Troubleshooting Guide

## Common Embed Issues & Solutions

### Issue 1: "This site can't be embedded"
**Cause**: X-Frame-Options header blocking iframe embedding
**Solution**: Server headers have been updated to allow iframe embedding

### Issue 2: Iframe shows blank or loading forever
**Cause**: Incorrect URL or server not responding
**Solutions**:
1. **Check URL**: Replace `https://your-replit-domain.replit.app` with your actual Replit URL
2. **Test direct access**: Ensure the app loads directly in browser first
3. **Use correct domain**: For Replit, use `https://workspace.replit.dev` or your custom domain

### Issue 3: HTTPS Mixed Content Errors
**Cause**: Embedding HTTP content in HTTPS site
**Solution**: Always use HTTPS URLs in embed codes

## Working Embed Code Templates

### Basic Responsive Embed
```html
<iframe 
    src="https://workspace.replit.dev" 
    width="100%" 
    height="600" 
    frameborder="0"
    allowfullscreen
    title="FlashTastic - Educational Flash Cards"
    style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <p>Your browser doesn't support iframes. <a href="https://workspace.replit.dev">Visit FlashTastic</a></p>
</iframe>
```

### Mobile-Optimized Responsive Embed
```html
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
    <iframe 
        src="https://workspace.replit.dev" 
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 8px;"
        allowfullscreen
        title="FlashTastic - Educational Flash Cards">
        <p><a href="https://workspace.replit.dev">Open FlashTastic</a></p>
    </iframe>
</div>
```

### Study Mode Direct Link
```html
<iframe 
    src="https://workspace.replit.dev/study" 
    width="100%" 
    height="500" 
    frameborder="0"
    title="FlashTastic Study Mode"
    style="border-radius: 8px; border: 2px solid #e5e7eb;">
    <p><a href="https://workspace.replit.dev/study">Start studying with FlashTastic</a></p>
</iframe>
```

### Quiz Mode Direct Link
```html
<iframe 
    src="https://workspace.replit.dev/quiz" 
    width="100%" 
    height="550" 
    frameborder="0"
    title="FlashTastic Quiz Mode"
    style="border-radius: 8px; border: 2px solid #fbbf24;">
    <p><a href="https://workspace.replit.dev/quiz">Take a quiz with FlashTastic</a></p>
</iframe>
```

## Testing Your Embed

### Step 1: Test Direct Access
Before embedding, ensure FlashTastic loads directly:
1. Open `https://workspace.replit.dev` in your browser
2. Verify the app loads completely
3. Test navigation (study, quiz, profile pages)

### Step 2: Test Basic Embed
1. Create a simple HTML file with the basic embed code
2. Open it in your browser
3. Check if the iframe loads the app properly

### Step 3: Test on Target Website
1. Add the embed code to your website
2. Test on different devices (desktop, mobile, tablet)
3. Check browser console for any errors

## WordPress Integration

### Using HTML Block
1. Add an HTML block to your page
2. Paste the embed code
3. Preview and publish

### Custom Shortcode (Advanced)
Add to your theme's `functions.php`:

```php
function flashtastic_shortcode($atts) {
    $atts = shortcode_atts(array(
        'width' => '100%',
        'height' => '600',
        'mode' => 'app' // app, study, quiz
    ), $atts);
    
    $url = 'https://workspace.replit.dev';
    if ($atts['mode'] === 'study') $url .= '/study';
    if ($atts['mode'] === 'quiz') $url .= '/quiz';
    
    return '<iframe src="' . $url . '" width="' . $atts['width'] . '" height="' . $atts['height'] . '" frameborder="0" title="FlashTastic" style="border-radius: 8px;"></iframe>';
}
add_shortcode('flashtastic', 'flashtastic_shortcode');
```

Usage: `[flashtastic width="100%" height="500" mode="study"]`

## Troubleshooting Checklist

- [ ] **URL Correct**: Using actual Replit domain (not placeholder)
- [ ] **HTTPS**: All URLs use HTTPS protocol
- [ ] **Direct Access**: App loads when accessed directly
- [ ] **Console Errors**: No JavaScript errors in browser console
- [ ] **Network**: No network connectivity issues
- [ ] **Mobile Test**: Embed works on mobile devices
- [ ] **Cross-browser**: Test in Chrome, Firefox, Safari

## Browser-Specific Issues

### Safari
- May block iframes from different domains by default
- Test with "Prevent cross-site tracking" disabled

### Chrome
- Strong iframe security policies
- Check for mixed content warnings

### Firefox
- Enhanced tracking protection may interfere
- Test in private browsing mode

## Security Considerations

### Content Security Policy (CSP)
If your website has CSP headers, add:
```
frame-src https://workspace.replit.dev;
```

### X-Frame-Options
FlashTastic server now allows iframe embedding with proper headers.

## Performance Optimization

### Lazy Loading
```html
<iframe 
    src="https://workspace.replit.dev" 
    loading="lazy"
    width="100%" 
    height="600">
</iframe>
```

### Preload Critical Resources
```html
<link rel="preconnect" href="https://workspace.replit.dev">
```

## Need Help?

If embedding still doesn't work:
1. Check the browser's developer console for error messages
2. Test the direct URL in an incognito/private browser window
3. Verify your website doesn't have conflicting CSP or frame policies
4. Try the test embed page (`test-embed.html`) to diagnose issues

The FlashTastic server has been configured to allow iframe embedding across all domains.