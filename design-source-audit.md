# Source design and implementation audit

This audit was written before application code. The supplied archive is Creative Tim Argon Design System v1.0.0, a Bootstrap 4 design-system template—not an existing Gilead Medical Centre application. The archive, extracted files, CSS, SCSS, HTML, JavaScript, vendor assets, and original package manifest are retained as the source of truth.

## Design source findings

- Exact visual source: Argon Design System v1.0.0 (`index.html`, `examples/`, `assets/css/argon.css`, `assets/scss/`).
- Source font link: Open Sans, weights 300, 400, 600, 700 (`https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700`). No local Open Sans files or `@font-face` rule are supplied.
- Original breakpoint tokens are Bootstrap/Argon values (0, 576px, 768px, 992px, 1200px); the application may add responsive rules without changing source tokens.
- Argon CSS custom properties are reproduced by retaining/loading the original stylesheet. The complete Sass design token source remains in `assets/scss/custom/_variables.scss` and `assets/scss/bootstrap/_variables.scss`.
- No Canva link or separate reference site was supplied. The ZIP is the only design source available.

### Verbatim Argon `:root` CSS custom properties

```css
:root
{
    --blue: #5e72e4;
    --indigo: #5603ad;
    --purple: #8965e0;
    --pink: #f3a4b5;
    --red: #f5365c;
    --orange: #fb6340;
    --yellow: #ffd600;
    --green: #2dce89;
    --teal: #11cdef;
    --cyan: #2bffc6;
    --white: #fff;
    --gray: #8898aa;
    --gray-dark: #32325d;
    --light: #ced4da;
    --lighter: #e9ecef;
    --primary: #5e72e4;
    --secondary: #f4f5f7;
    --success: #2dce89;
    --info: #11cdef;
    --warning: #fb6340;
    --danger: #f5365c;
    --light: #adb5bd;
    --dark: #212529;
    --default: #172b4d;
    --white: #fff;
    --neutral: #fff;
    --darker: black;
    --breakpoint-xs: 0;
    --breakpoint-sm: 576px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 992px;
    --breakpoint-xl: 1200px;
    --font-family-sans-serif: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}
```

### Other CSS custom-property declarations in the archive

- `assets/css/argon.css:20` `--blue: #5e72e4;`
- `assets/css/argon.css:21` `--indigo: #5603ad;`
- `assets/css/argon.css:22` `--purple: #8965e0;`
- `assets/css/argon.css:23` `--pink: #f3a4b5;`
- `assets/css/argon.css:24` `--red: #f5365c;`
- `assets/css/argon.css:25` `--orange: #fb6340;`
- `assets/css/argon.css:26` `--yellow: #ffd600;`
- `assets/css/argon.css:27` `--green: #2dce89;`
- `assets/css/argon.css:28` `--teal: #11cdef;`
- `assets/css/argon.css:29` `--cyan: #2bffc6;`
- `assets/css/argon.css:30` `--white: #fff;`
- `assets/css/argon.css:31` `--gray: #8898aa;`
- `assets/css/argon.css:32` `--gray-dark: #32325d;`
- `assets/css/argon.css:33` `--light: #ced4da;`
- `assets/css/argon.css:34` `--lighter: #e9ecef;`
- `assets/css/argon.css:35` `--primary: #5e72e4;`
- `assets/css/argon.css:36` `--secondary: #f4f5f7;`
- `assets/css/argon.css:37` `--success: #2dce89;`
- `assets/css/argon.css:38` `--info: #11cdef;`
- `assets/css/argon.css:39` `--warning: #fb6340;`
- `assets/css/argon.css:40` `--danger: #f5365c;`
- `assets/css/argon.css:41` `--light: #adb5bd;`
- `assets/css/argon.css:42` `--dark: #212529;`
- `assets/css/argon.css:43` `--default: #172b4d;`
- `assets/css/argon.css:44` `--white: #fff;`
- `assets/css/argon.css:45` `--neutral: #fff;`
- `assets/css/argon.css:46` `--darker: black;`
- `assets/css/argon.css:47` `--breakpoint-xs: 0;`
- `assets/css/argon.css:48` `--breakpoint-sm: 576px;`
- `assets/css/argon.css:49` `--breakpoint-md: 768px;`
- `assets/css/argon.css:50` `--breakpoint-lg: 992px;`
- `assets/css/argon.css:51` `--breakpoint-xl: 1200px;`
- `assets/css/argon.css:52` `--font-family-sans-serif: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';`
- `assets/css/argon.css:53` `--font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;`
- `assets/css/argon.css:12645` `--icon-size: 5rem;`
- `assets/css/argon.css:12646` `--icon-sm-size: 3.75rem;`
- `assets/css/argon.css:12647` `--gutter: 7rem;`

### Every source `@font-face` rule

The original rules below are retained in the supplied vendor CSS. Neither source rule defines `font-display`; both use `font-weight: normal` and `font-style: normal`. The HTML separately links Open Sans from Google Fonts as above.

#### `assets/vendor/font-awesome/css/font-awesome.css` (rule 1)

```css
@font-face {
  font-family: 'FontAwesome';
  src: url('../fonts/fontawesome-webfont.eot?v=4.7.0');
  src: url('../fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'), url('../fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'), url('../fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'), url('../fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'), url('../fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg');
  font-weight: normal;
  font-style: normal;
}
```

#### `assets/vendor/font-awesome/css/font-awesome.min.css` (rule 1)

```css
@font-face{font-family:'FontAwesome';src:url('../fonts/fontawesome-webfont.eot?v=4.7.0');src:url('../fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'),url('../fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'),url('../fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'),url('../fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'),url('../fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg');font-weight:normal;font-style:normal}
```

#### `assets/vendor/nucleo/css/nucleo.css` (rule 1)

```css
@font-face {
  font-family: 'NucleoIcons';
  src: url('../fonts/nucleo-icons.eot');
  src: url('../fonts/nucleo-icons.eot') format('embedded-opentype'), url('../fonts/nucleo-icons.woff2') format('woff2'), url('../fonts/nucleo-icons.woff') format('woff'), url('../fonts/nucleo-icons.ttf') format('truetype'), url('../fonts/nucleo-icons.svg') format('svg');
  font-weight: normal;
  font-style: normal;
}
```

## Original package versions (verbatim from the archive)

- `name`: `argon-design-system`
- `version`: `1.0.0`
- `main`: `gulpfile.js`

### dependencies

- `del`: `^3.0.0`
- `gulp-cache`: `^1.0.2`
- `gulp-csscomb`: `^3.0.8`
- `gulp-cssnano`: `^2.1.3`
- `gulp-html-prettify`: `0.0.1`
- `gulp-npm-dist`: `^1.0.1`
- `gulp-postcss`: `^7.0.1`
- `gulp-rename`: `^1.2.2`
- `gulp-run`: `^1.7.1`
- `gulp-uglify`: `^3.0.0`
- `gulp-useref-plus`: `0.0.8`
- `gulp-wait`: `0.0.2`
- `postcss-flexbugs-fixes`: `^3.3.1`
- `pump`: `^3.0.0`
- `run-sequence`: `^2.2.1`

### devDependencies

- `browser-sync`: `^2.24.4`
- `gulp`: `^3.9.1`
- `gulp-autoprefixer`: `^5.0.0`
- `gulp-clean-css`: `^3.9.4`
- `gulp-imagemin`: `^4.1.0`
- `gulp-sass`: `^3.2.1`
- `gulp-util`: `^3.0.8`

## Feature and route inventory

The archive contains no Gilead-branded loading screen/preloader, cookie banner or consent logic, CAPTCHA integration, legal pages, custom 404/500 pages, API routes, environment-variable names, authentication, booking, insurance pre-authorisation, patient portal, or medical content. `index.html` is the Argon component showcase; `examples/` contains Argon landing, login, profile, and register pages. The only package manifest is the original Gulp/Bootstrap-era `package.json` above. The source’s `@font-face` rules contain no `font-display` declarations.

## Required application additions (not present in source)

Implement the clinical pages and features from the brief as new application code, leaving the Argon design source intact. Add a Gilead layer that references the original Argon tokens rather than overwriting them. Where the archive has no behavior to clone, use the user-specified fallback behavior and make external integrations configurable through environment variables.
