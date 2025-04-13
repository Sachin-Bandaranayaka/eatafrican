import React from 'react';
import Image from 'next/image';

const ImageCollage = () => {
    const foodImages = [
        {
            src: '/images/food1.jpg',
            alt: 'Traditional African stew',
            className: 'col-span-1 row-span-1 md:col-span-1 md:row-span-1'
        },
        {
            src: '/images/food2.jpg',
            alt: 'African street food',
            className: 'col-span-1 row-span-1 md:col-span-1 md:row-span-2'
        },
        {
            src: '/images/food3.jpg',
            alt: 'Authentic African dish',
            className: 'col-span-1 row-span-1 md:col-span-1 md:row-span-1'
        },
        {
            src: '/images/food4.jpg',
            alt: 'African spices and ingredients',
            className: 'col-span-2 row-span-1 md:col-span-2 md:row-span-1'
        },
        {
            src: '/images/food5.jpg',
            alt: 'Traditional preparation methods',
            className: 'col-span-1 row-span-1 md:col-span-1 md:row-span-1'
        },
        {
            src: '/images/food6.jpg',
            alt: 'African dessert',
            className: 'col-span-1 row-span-1 md:col-span-1 md:row-span-1'
        },
        {
            src: '/images/food7.jpg',
            alt: 'Savory African cuisine',
            className: 'col-span-1 row-span-1 md:col-span-1 md:row-span-1'
        },
        {
            src: '/images/food8.jpg',
            alt: 'Local African delicacy',
            className: 'col-span-2 row-span-1 md:col-span-2 md:row-span-1'
        },
        {
            src: '/images/food9.jpg',
            alt: 'Fresh African produce',
            className: 'col-span-1 row-span-1 md:col-span-1 md:row-span-1'
        }
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[minmax(200px,auto)]">
                {foodImages.map((image, index) => (
                    <div
                        key={index}
                        className={`${image.className} group relative overflow-hidden rounded-lg shadow-lg`}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={index < 6}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <p className="text-white font-semibold text-lg">{image.alt}</p>
                                <div className="w-0 h-0.5 bg-white group-hover:w-full transition-all duration-500 mt-1"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageCollage; 