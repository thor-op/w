# Automated Wallpaper Metadata Generator

This repository contains a collection of wallpapers with an automated system that generates metadata for each wallpaper and stores it in a JSON file. This JSON file can then be used by your own website to display the wallpapers.

## Features

- Automatically generates metadata when new wallpapers are added
- Creates a comprehensive `wallpapers.json` file with:
  - File paths
  - Image resolutions
  - File sizes
  - AI-generated titles and descriptions
  - AI-generated tags
  - Device compatibility recommendations

## How It Works

1. When you upload new wallpapers to this repository, a GitHub Actions workflow is triggered
2. The workflow runs a script that:
   - Scans the repository for image files
   - Extracts metadata (resolution, file size)
   - Uses OpenRouter API to generate titles, descriptions, and tags for each wallpaper
   - Updates the `wallpapers.json` file
3. You can then use this JSON file in your own website to display the wallpapers

## Setup Instructions

### 1. Repository Setup

1. Clone this repository
2. Add your wallpaper images to the root directory (supported formats: jpg, jpeg, png, webp)
3. Push the changes to GitHub

### 2. OpenRouter API Setup (Optional)

To enable AI-generated titles, descriptions, and tags:

1. Create an account on [OpenRouter](https://openrouter.ai/)
2. Get your API key (the script uses the free Mistral 7B Instruct model)
3. Add the API key as a repository secret in GitHub:
   - Go to your repository on GitHub
   - Click on "Settings" > "Secrets and variables" > "Actions"
   - Click "New repository secret"
   - Name: `OPENROUTER_API_KEY`
   - Value: Your OpenRouter API key
   - Click "Add secret"

## Adding New Wallpapers

Simply add new image files to the repository and push them to GitHub. The `wallpapers.json` file will be updated automatically.

## Using the JSON File

The generated `wallpapers.json` file has the following structure:

```json
{
  "lastUpdated": "2025-07-22T04:06:39.842Z",
  "count": 172,
  "wallpapers": [
    {
      "name": "wallpaper1.jpg",
      "path": "wallpaper1.jpg",
      "size": "1024 KB",
      "resolution": "1920x1080",
      "metadata": {
        "title": "Creative Title Here",
        "description": "Brief description of the wallpaper",
        "tags": ["nature", "landscape", "mountains"],
        "recommendedDevices": ["desktop", "mobile"]
      }
    },
    // More wallpapers...
  ]
}
```

You can fetch this JSON file from your GitHub repository and use it in your own website to display the wallpapers.

## Customization

- Modify `generate-wallpapers.js` to change how metadata is generated
- Update `.github/workflows/update-wallpapers.yml` to change the automation workflow

## License

This project is licensed under the MIT License - see the LICENSE file for details.