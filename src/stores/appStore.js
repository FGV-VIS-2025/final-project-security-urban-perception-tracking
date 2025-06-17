import { writable } from 'svelte/store';

export const activeTab = writable('overview');
export const currentImage = writable(1); // Para Interactive Map (1-150)
export const eyeTrackingImage = writable(1); // Para Eye Tracking (1-150)

export const mapData = writable({
    points: [
        {name: 'Centro', coords: [-43.1729, -22.9068], id: 0},
        {name: 'Copacabana', coords: [-43.1951, -22.9711], id: 1},
        {name: 'Ipanema', coords: [-43.2096, -22.9838], id: 2},
        {name: 'Barra da Tijuca', coords: [-43.3647, -23.0184], id: 3},
        {name: 'Tijuca', coords: [-43.2385, -22.9249], id: 4},
        {name: 'Botafogo', coords: [-43.1822, -22.9519], id: 5},
        {name: 'Flamengo', coords: [-43.1756, -22.9311], id: 6},
        {name: 'Lagoa', coords: [-43.2058, -22.9711], id: 7}
    ],
    center: [-43.1729, -22.9068],
    zoom: 1
});

export const config = writable({
    imageCount: 150,
    imageBasePath: './assets/images/',
    imagePrefix: '',              
    imageExtension: '.jpg',
    paperTitle: 'SECURITY URBAN PERCEPTION TRACKING',
    paperSubtitle: 'Eye-tracking visualization'
});

// Guardar punto seleccionado del mapa
export const selectedMapPoint = writable(null);

export const setActiveTab = (tab) => {
    activeTab.set(tab);
};

// Funcionalidad de Interactive Map (1-150)
export const setCurrentImage = (imageIndex) => {
    currentImage.set(Math.max(1, Math.min(150, imageIndex)));
};

// Funcionalidad para Eye Tracking Vis (1-150)
export const setEyeTrackingImage = (imageIndex) => {
    eyeTrackingImage.set(Math.max(1, Math.min(150, imageIndex)));
};

export const addMapPoint = (point) => {
    mapData.update(data => ({
        ...data,
        points: [...data.points, point]
    }));
};

// Función helper para convertir número de imagen (1-150) a nombre de archivo (0-149)
export const getImagePath = (imageNumber, config) => {
    const fileIndex = imageNumber - 1; // Convertir de 1-150 a 0-149
    return `${config.imageBasePath}${config.imagePrefix}${fileIndex}${config.imageExtension}`;
};

// Función helper para convertir nombre de archivo (0-149) a número de imagen (1-150)
export const getImageNumberFromFileName = (fileName) => {
    const match = fileName.match(/(\d+)/);
    if (match) {
        return parseInt(match[1]) + 1; // Convertir de 0-149 a 1-150
    }
    return 1;
};