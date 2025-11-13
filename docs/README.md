# Documentation

This folder contains the documentation for the Travel Blog project, built using [Just the Docs](https://just-the-docs.github.io/just-the-docs/) Jekyll theme.

## Building Locally

To build and preview the documentation locally:

### Prerequisites

- Ruby 2.7 or higher
- Bundler

### Setup

```bash
# Install Ruby dependencies
cd docs
bundle install

# Serve the documentation
bundle exec jekyll serve

# Or serve with live reload
bundle exec jekyll serve --livereload
```

Open your browser to [http://localhost:4000/firstSpecKitProject/](http://localhost:4000/firstSpecKitProject/) to view the documentation.

## Structure

- `_config.yml` - Jekyll configuration
- `index.md` - Documentation homepage
- `quickstart.md` - Quick start guide
- `architecture.md` - System architecture and design
- `development.md` - Development workflow and contributing
- `deployment.md` - Deployment guide
- `README.md` - This file

## Deployment

Documentation is automatically built and deployed to GitHub Pages when changes are pushed to the `main` branch. The workflow is defined in `.github/workflows/docs.yml`.

### Manual Deployment

```bash
# Build the site
bundle exec jekyll build

# Output will be in _site/
```

## Live Site

The documentation is available at:
**https://andreas-ludviksen.github.io/firstSpecKitProject/**

## Contributing

To add or update documentation:

1. Edit the relevant Markdown file
2. Test locally with `bundle exec jekyll serve`
3. Commit and push to the `main` branch
4. GitHub Actions will automatically deploy the changes

## Theme

This documentation uses the [Just the Docs](https://just-the-docs.github.io/just-the-docs/) theme, which provides:

- Clean, professional design
- Built-in search
- Responsive layout
- Syntax highlighting
- Navigation structure
- Dark mode support

## Customization

To customize the theme, edit `_config.yml`:

- Change colors: `color_scheme`
- Update navigation: `nav_sort`, `nav_external_links`
- Configure search: `search_enabled`, `search` options
- Modify footer: `footer_content`
