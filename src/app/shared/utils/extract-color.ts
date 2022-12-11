// @ts-ignore: Unreachable code error
import ColorThief from '../libraries/color-thief.js';

export function extractColor(imageURL: string) {
      const image = new Image();
      const thief = new ColorThief();

      image.crossOrigin = 'anonymous';
      image.src = imageURL;

      return new Promise((resolve) => {
            const getPalette = () => {
                  return thief.getPalette(image, 4);
            };

            if (image.complete) {
                  return resolve(getPalette());
            }

            image.onload = () => {
                  resolve(getPalette());
            };
      });
}