const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');
const { execSync } = require('child_process');

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''; // Set this in GitHub secrets
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Function to get image dimensions using ImageMagick (if available)
function getImageDimensions(imagePath) {
    try {
        // Try to use ImageMagick's identify command if available
        const output = execSync(`identify -format "%wx%h" "${imagePath}"`).toString().trim();
        const [width, height] = output.split('x').map(Number);
        return { width, height };
    } catch (error) {
        console.warn(`Could not get dimensions for ${imagePath}: ${error.message}`);
        return { width: 0, height: 0 };
    }
}

// Function to get file size in KB
function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return Math.round(stats.size / 1024); // Convert bytes to KB
    } catch (error) {
        console.warn(`Could not get file size for ${filePath}: ${error.message}`);
        return 0;
    }
}

// Function to analyze image with OpenRouter API
async function analyzeImage(imagePath, fileName) {
    if (!OPENROUTER_API_KEY) {
        console.log('OpenRouter API key not provided, skipping image analysis');
        return {
            title: path.parse(fileName).name,
            description: 'Beautiful wallpaper',
            tags: ['wallpaper'],
            recommendedDevices: ['desktop', 'mobile']
        };
    }

    return new Promise((resolve, reject) => {
        // Prepare the request payload
        const payload = JSON.stringify({
            model: 'mistralai/mistral-7b-instruct',  // Free model on OpenRouter
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert at analyzing wallpaper images. Provide a concise title, brief description, relevant tags, and device recommendations based on the image filename.'
                },
                {
                    role: 'user',
                    content: `Analyze this wallpaper image filename: ${fileName}. 
                    Provide the following in JSON format:
                    1. A creative title (max 5 words)
                    2. A brief description (max 15 words)
                    3. 3-5 relevant tags
                    4. Recommended devices (desktop, mobile, tablet, etc.)
                    
                    Respond ONLY with valid JSON like this:
                    {
                        "title": "Creative Title Here",
                        "description": "Brief description of the wallpaper",
                        "tags": ["tag1", "tag2", "tag3"],
                        "recommendedDevices": ["desktop", "mobile"]
                    }`
                }
            ]
        });

        // Set up the request options
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://github.com/thor-op/w',
                'X-Title': 'Wallpaper Collection'
            }
        };

        // Make the request
        const req = https.request(OPENROUTER_API_URL, options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.choices && response.choices[0] && response.choices[0].message) {
                        const content = response.choices[0].message.content;
                        // Extract JSON from the response
                        const jsonMatch = content.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            const metadata = JSON.parse(jsonMatch[0]);
                            resolve(metadata);
                        } else {
                            console.warn(`Could not extract JSON from API response for ${fileName}`);
                            resolve({
                                title: path.parse(fileName).name,
                                description: 'Beautiful wallpaper',
                                tags: ['wallpaper'],
                                recommendedDevices: ['desktop', 'mobile']
                            });
                        }
                    } else {
                        console.warn(`Invalid API response format for ${fileName}`);
                        resolve({
                            title: path.parse(fileName).name,
                            description: 'Beautiful wallpaper',
                            tags: ['wallpaper'],
                            recommendedDevices: ['desktop', 'mobile']
                        });
                    }
                } catch (error) {
                    console.error(`Error parsing API response for ${fileName}: ${error.message}`);
                    resolve({
                        title: path.parse(fileName).name,
                        description: 'Beautiful wallpaper',
                        tags: ['wallpaper'],
                        recommendedDevices: ['desktop', 'mobile']
                    });
                }
            });
        });

        req.on('error', (error) => {
            console.error(`API request error for ${fileName}: ${error.message}`);
            resolve({
                title: path.parse(fileName).name,
                description: 'Beautiful wallpaper',
                tags: ['wallpaper'],
                recommendedDevices: ['desktop', 'mobile']
            });
        });

        req.write(payload);
        req.end();
    });
}

// Function to get all wallpaper files with enhanced metadata
async function getWallpapers() {
    const files = fs.readdirSync('.');
    const wallpapers = [];

    // Filter for image files (jpg, png, etc.)
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

    // Get existing metadata if available
    let existingData = {};
    try {
        if (fs.existsSync('wallpapers.json')) {
            const existingJson = JSON.parse(fs.readFileSync('wallpapers.json', 'utf8'));
            existingData = existingJson.wallpapers.reduce((acc, wp) => {
                acc[wp.name] = wp;
                return acc;
            }, {});
        }
    } catch (error) {
        console.warn('Could not read existing wallpapers.json:', error.message);
    }

    // Process each image file
    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
    });

    console.log(`Found ${imageFiles.length} image files`);

    // Process files in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < imageFiles.length; i += batchSize) {
        const batch = imageFiles.slice(i, i + batchSize);
        const batchPromises = batch.map(async (file) => {
            const ext = path.extname(file).toLowerCase();

            // Check if we already have metadata for this file
            if (existingData[file] && existingData[file].metadata) {
                console.log(`Using existing metadata for ${file}`);
                return existingData[file];
            }

            // Get basic file info
            const filePath = path.join('.', file);
            const dimensions = getImageDimensions(filePath);
            const fileSize = getFileSize(filePath);

            // Get AI-generated metadata
            console.log(`Analyzing ${file}...`);
            const metadata = await analyzeImage(filePath, file);

            return {
                name: file,
                path: file,
                size: `${fileSize} KB`,
                resolution: `${dimensions.width}x${dimensions.height}`,
                metadata: metadata
            };
        });

        const batchResults = await Promise.all(batchPromises);
        wallpapers.push(...batchResults);

        console.log(`Processed batch ${Math.ceil(i / batchSize) + 1}/${Math.ceil(imageFiles.length / batchSize)}`);
    }

    // Sort wallpapers by name
    wallpapers.sort((a, b) => a.name.localeCompare(b.name));

    return wallpapers;
}

// Generate the JSON file
async function generateWallpapersJson() {
    const wallpapers = await getWallpapers();
    const data = {
        lastUpdated: new Date().toISOString(),
        count: wallpapers.length,
        wallpapers: wallpapers
    };

    fs.writeFileSync('wallpapers.json', JSON.stringify(data, null, 2));
    console.log(`Generated wallpapers.json with ${wallpapers.length} wallpapers`);
}

// Run the generator
generateWallpapersJson().catch(error => {
    console.error('Error generating wallpapers.json:', error);
    process.exit(1);
});