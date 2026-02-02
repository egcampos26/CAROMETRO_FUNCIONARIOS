
export const convertToWebP = (file: File | string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }
            ctx.drawImage(img, 0, 0);
            const webpDataUrl = canvas.toDataURL('image/webp', 0.8);
            resolve(webpDataUrl);
        };
        img.onerror = (err) => reject(err);

        if (typeof file === 'string') {
            img.src = file;
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    });
};
