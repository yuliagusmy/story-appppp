import sharp from 'sharp';

async function convertSvgToPng() {
  try {
    await sharp('public/icons/add-icon.svg')
      .png()
      .toFile('public/icons/add-96x96.png');
    console.log('Icon converted successfully!');
  } catch (error) {
    console.error('Error converting icon:', error);
  }
}

convertSvgToPng();