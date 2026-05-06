import heroFlatlay from './Gemini_Generated_Image_jg3jkvjg3jkvjg3j.jpg';
import bottleCopy from './BOTTLE copy.jpg';
import BOTTLE from './BOTTLE.jpg';
import bottomPaintCharcoal from './BOTTOM PAINT CHARCOAL.jpg';
import bottomPaintFibre from './BOTTOM PAINT FIBRE.jpg';
import cCurveToothbrush from './C CURVE TOOTHBRUSH.jpg';
import coffeeMug from './COFFEE MUG.jpg';
import corkMug from './CORK MUG.jpg';
import dairyWithPen from './DAIRY WITH PEN.jpg';
import giftSet1 from './GIFT SET 1.jpg';
import giftSet2 from './GIFT SET 2.jpg';
import kidsCharcoal from './KIDS CHARCOAL.jpg';
import kidsFibre from './KIDS FIBRE.jpg';
import neemDualLily from './NEEM DUAL LILY.jpg';
import neemPocketComb from './NEEM POCKET COMB.jpg';
import neemrubycomb from './NEEM RUBY COMB.jpg';
import neemShampooComb from './NEEM SHAMPOO COMB.jpg';
import neemTailComb from './NEEM TAIL COMB.jpg';
import penWithBox from './PEN WITH BOX.jpg';
import plantableA5Notebook from './PLANTABLE A5 NOTEBOOK.jpg';
import plantableCalendar from './PLANTABLE CALENDAR.jpg';
import seedColorPencils from './SEED COLOR PENCILS.jpg';
import seedPencil from './SEED PENCIL.jpg';
import seedpen from './SEEDPEN.jpg';
import tongueCleaner from './TONGUE CLEANER.jpg';
import toothbrushImg from './TOOTHBRUSH.png';
import toothbrushImg1 from './TOOTHBRUSH_1.png';
import tumbler1 from './TUMBLER 1.jpg';
import tumbler2 from './TUMBLER 2.jpg';
import amritaLogo from './amritaLogo.jpeg';
import earth from './earth.jpg';
import earthClouds from './earth_clouds.png';
import earthPollutedFinal from './earth_polluted_final.png';
import earthPristineFinal from './earth_pristine_final.png';
import gubbLogo from './gubbLogo.jpeg';
import logo from './logo.png';
import midazzleLogo from './midazzleLogo.jpeg';
import namanLogo from './namanLogo.jpeg';
import sarvodayaLogo from './sarvodayaLogo.jpeg';
import unitedLogo from './unitedLogo.jpeg';
import websiteCstImage from './website cst image.png';
import cvent from './Cvent Logo.png';
import sf from './SF logo.png';
import ajay from './ajay.png';
import daisy from './Daisy Website.png';
import sanchu from './Sanchu Website.png';
import pawan from './pawan.png';
import aboutHero from './about_hero.png';


export const assets = {
    heroFlatlay,
    bottleCopy,
    BOTTLE,
    bottomPaintCharcoal,
    bottomPaintFibre,
    cCurveToothbrush,
    coffeeMug,
    corkMug,
    dairyWithPen,
    giftSet1,
    giftSet2,
    kidsCharcoal,
    kidsFibre,
    neemDualLily,
    neemPocketComb,
    neemrubycomb,
    neemShampooComb,
    neemTailComb,
    penWithBox,
    plantableA5Notebook,
    plantableCalendar,
    seedColorPencils,
    seedPencil,
    seedpen,
    tongueCleaner,
    toothbrushImg,
    toothbrushImg1,
    tumbler1,
    tumbler2,
    amritaLogo,
    earth,
    earthClouds,
    earthPollutedFinal,
    earthPristineFinal,
    gubbLogo,
    logo,
    midazzleLogo,
    namanLogo,
    sarvodayaLogo,
    unitedLogo,
    websiteCstImage,
    cvent,
    sf,
    daisy,
    sanchu,
    ajay,
    pawan,
    aboutHero,
    cursor: '/cursor.png',
};

export const getProductImage = (imageStr) => {
    const API_BASE = (import.meta.env.VITE_API_URL || '/api/v1').replace('/api/v1', '');
    const FALLBACK = 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?q=80&w=800';
    if (!imageStr || typeof imageStr !== 'string') return FALLBACK;
    // Already a key in the assets map
    if (assets[imageStr]) return assets[imageStr];
    // Vite-resolved local asset paths — browser can load these directly
    if (imageStr.startsWith('/src/') || imageStr.startsWith('/@fs/') || imageStr.startsWith('/assets/')) return imageStr;
    // Backend API relative path (e.g. /image/product.jpg)
    if (imageStr.startsWith('/')) return `${API_BASE}${imageStr}`;
    // Absolute URL
    if (imageStr.startsWith('http')) return imageStr;
    return FALLBACK;
};
