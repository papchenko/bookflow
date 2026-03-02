import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { db } from '../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { uploadAvatar as uploadToCloudinary } from '../../utils/cloudinary';
import { FaTimes } from "react-icons/fa";

const GENRES = [
  "Fantasy",
  "Science Fiction",
  "Drama",
  "Romance",
  "Mystery",
  "Detective",
  "Thriller",
  "Horror",
  "Historical",
  "Adventure",
  "Dystopian",
  "Post-Apocalyptic",
  "Magical Realism",
  "Cyberpunk",
  "Biography",
  "Self-Help",
  "History",
  "Philosophy",
  "Psychology",
  "Crime Fiction",
  "Business",
  "Science & Technology",
  "Health & Fitness",
  "Travel",
  "Children’s",
  "Young Adult",
  "Educational",
  "Poetry",
  "Comics"
];

const CreatePostForm = ({ onClose }) => {
  const { user, userProfile } = useAuth();
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [priceLending, setPriceLending] = useState('');
  const [unit, setUnit] = useState('/ 30 Days');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 6) {
      toast.error("Maximum 6 images allowed");
      return;
    }
    const urls = await Promise.all(files.map(f => uploadToCloudinary(f)));
    setImages(prev => [...prev, ...urls]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !author || !genre || !year || !price || !priceLending || images.length < 3 || !description) {
      toast.error("Please fill all fields and add 3–6 images");
      return;
    }

    await addDoc(collection(db, 'books'), {
      name,
      author,
      genre,
      year,
      price,
      priceLending: Number(priceLending),
      unit,
      description,
      images,
      sellerId: user.uid,
      sellerName: userProfile.name,
      sellerPhoto: userProfile.photoURL,
      rating: 0,
      ratingCount: 0,
      soldCount: 0,
      createdAt: serverTimestamp()
    });

    toast.success("Book posted!");
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={onClose}>
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-auto max-h-[90vh] p-6" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
          <FaTimes className="w-5 h-5 text-gray-700 dark:text-gray-300"/>
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Create Book Post</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded"/>
          <input placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} className="w-full p-2 border rounded"/>
          
          {/* Select Genre */}
          <select value={genre} onChange={e => setGenre(e.target.value)} className="w-full p-2 border rounded">
            <option value="">Select Genre</option>
            {GENRES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <input placeholder="Year" type="number" value={year} onChange={e => setYear(e.target.value)} className="w-full p-2 border rounded"/>
          <input placeholder="Price (UAH)" type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-2 border rounded"/>
          <input placeholder="Lending Price" type="number" value={priceLending} onChange={e => setPriceLending(e.target.value)} className="w-full p-2 border rounded"/>
          <input placeholder="Unit" value={unit} onChange={e => setUnit(e.target.value)} className="w-full p-2 border rounded"/>
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded"/>
          <input type="file" multiple onChange={handleImagesUpload} className="w-full"/>
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {images.map((img, idx) => <img key={idx} src={img} alt="preview" className="w-full h-20 object-cover rounded"/>)}
            </div>
          )}
          <button type="submit" className="w-full bg-[var(--accept-color)] hover:[var(--accept-color-hover)] text-white py-2 rounded">Create Post</button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CreatePostForm;