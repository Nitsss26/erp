import React, { useState } from 'react';
import { PhotoIcon, PlusIcon, XIcon } from '../Icons';

const galleryItems = [
    { id: 1, src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=870", alt: "Students in a classroom", title: "Classroom Session" },
    { id: 2, src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=870", alt: "Students studying together", title: "Library Study Group" },
    { id: 3, src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=870", alt: "Graduation ceremony", title: "Graduation Day 2023" },
    { id: 4, src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=870", alt: "Students in graduation gowns", title: "Proud Graduates" },
    { id: 5, src: "https://images.unsplash.com/photo-1616512659455-111d3367649f?q=80&w=870", alt: "School sports day", title: "Annual Sports Meet" },
    { id: 6, src: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?q=80&w=871", alt: "Science fair project", title: "Science Exhibition" },
];


const ImageGallery: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        if(selectedImage) {
            // Mock upload logic
            alert(`Uploading ${selectedImage.name}...`);
            setIsModalOpen(false);
            setSelectedImage(null);
        }
    }

  return (
    <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[--text-primary]">Image Gallery</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-[--primary] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[--primary-hover] transition">
            <PlusIcon className="w-5 h-5" /> Upload Image
        </button>
      </div>
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryItems.map(item => (
                <div key={item.id} className="group relative overflow-hidden rounded-lg shadow-sm">
                    <img src={item.src} alt={item.alt} className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end p-4">
                        <p className="text-white font-semibold text-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">{item.title}</p>
                    </div>
                </div>
            ))}
        </div>
        {isModalOpen && (
             <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40">
                <div className="bg-[--card] p-8 rounded-xl shadow-2xl w-full max-w-lg border border-[--card-border]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-[--text-primary]">Upload New Image</h3>
                        <button onClick={() => setIsModalOpen(false)}><XIcon className="w-6 h-6 text-[--text-secondary] hover:text-[--text-primary]"/></button>
                    </div>
                    <div className="space-y-4">
                        <input type="text" placeholder="Image Title" className="w-full p-2 border border-[--card-border] rounded bg-[--background]" />
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[--card-border] border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <PhotoIcon className="mx-auto h-12 w-12 text-[--text-secondary]" />
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[--primary] hover:text-[--primary-hover] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                        {selectedImage && <p className="text-sm text-center text-green-600">Selected: {selectedImage.name}</p>}
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                        <button type="button" onClick={handleUpload} className="px-6 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary-hover]">Upload</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ImageGallery;
