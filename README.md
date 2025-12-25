# Wavo Wallpaper Collection

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/thor-op/files@main/Wavo-OG.png" alt="Wavo Wallpaper Collection" width="600">
</p>

This repository contains a curated collection of wallpapers with an automated system that generates a simple manifest file listing all available wallpapers. This JSON file powers the [Wavo](https://wovo.thorxop.com) wallpaper gallery and can be used by other websites to display the wallpapers.

## Features

- Automatically generates a manifest when new wallpapers are added
- Creates a simple `wallpapers.json` file with:
  - Total count of wallpapers
  - Last updated timestamp
  - List of all wallpaper filenames

## How It Works

1. When you upload new image files to this repository, a GitHub Actions workflow is triggered
2. The workflow automatically:
   - Uses git history to find all image files (JPG, JPEG, PNG, WebP, GIF, BMP)
   - Sorts files by when they were added (newest first)
   - Counts the total number of wallpapers
   - Generates a timestamp
   - Updates the `wallpapers.json` manifest file
3. You can then use this JSON file in your own website to display the wallpapers, just like how it powers the Wavo wallpaper gallery

## Setup Instructions

1. Clone this repository
2. Add your wallpaper images to the root directory (supported formats: JPG, JPEG, PNG, WebP, GIF, BMP)
3. Push the changes to GitHub - the manifest will be generated automatically

## Adding New Wallpapers

Simply add new image files to the repository and push them to GitHub. The `wallpapers.json` manifest will be updated automatically.

Supported formats: JPG, JPEG, PNG, WebP, GIF, BMP

## Contributing Wallpapers

We welcome contributions from the community! Here's how you can contribute your wallpapers:

### Contribution Guidelines

1. **File Format**: Supported formats are JPG, JPEG, PNG, WebP, GIF, and BMP
2. **File Naming**: You can use any descriptive filename (e.g., `sunset-mountains.jpg`, `abstract-blue.png`, `nature-forest.webp`)
3. **No Duplicates**: Please check existing wallpapers to avoid uploading duplicates
4. **Quality**: Ensure your wallpapers are high quality and appropriate for public use
5. **Rights**: Only submit wallpapers you own or have permission to share

### How to Contribute

1. Fork this repository
2. Add your wallpaper files to the root directory
3. Create a pull request with a brief description of the wallpapers you're adding
4. Wait for review and approval

### What Happens After Contribution

Once your pull request is merged, the automated workflow will:
- Update the wallpaper count
- Add your files to the manifest
- Make them available through the JSON API

Thank you for helping grow the Wavo wallpaper collection!

## Using the JSON File

The generated `wallpapers.json` file has the following structure:

```json
{
  "count": 172,
  "updated": "2025-12-21T10:30:00Z",
  "files": [
    "latest-wallpaper.png",
    "recent-abstract.webp", 
    "older-nature.jpg",
    // More files ordered by when they were added (newest first)...
  ]
}
```

You can fetch this JSON file from your GitHub repository and use it in your own website to display the wallpapers. The files are ordered by when they were added to the repository, with the newest wallpapers appearing first in the list.

## Customization

- Modify `.github/workflows/generate-wallpapers.yml` to change the automation workflow
- The workflow supports JPG, JPEG, PNG, WebP, GIF, and BMP formats - modify the file patterns if you need other formats

## License

This project is licensed under the MIT License - see the LICENSE file for details.