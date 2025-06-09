import { writable } from 'svelte/store';
export const activeTab = writable('overview');
export const currentImage = writable(1);

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

export const setActiveTab = (tab) => {
    activeTab.set(tab);
};

export const setCurrentImage = (imageIndex) => {
    currentImage.set(Math.max(1, Math.min(150, imageIndex)));
};

export const addMapPoint = (point) => {
    mapData.update(data => ({
        ...data,
        points: [...data.points, point]
    }));
};

export const getImagePath = (imageNumber, config) => {
    return `${config.imageBasePath}${config.imagePrefix}${imageNumber}${config.imageExtension}`;
};