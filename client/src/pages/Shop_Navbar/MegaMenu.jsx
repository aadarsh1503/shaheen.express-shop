// src/components/MegaMenu.jsx

import React, { useState } from 'react';
import { X, User, Heart, ChevronRight } from 'lucide-react';
import BrandFilter from './BrandFilter';

// ... (brandsData and menuData remain exactly the same) ...
const brandsData = [
  '7ryms', 'AGFA', 'Alient Film', 'Amaran', 'Ambitful', 'Andycine', 'Angelbird', 'aochaun', 'Aputure', 'Atomos',
  'Blackmagic', 'Canon', 'Comica', 'DJI', 'Elinchrom', 'Fimi', 'Fujifilm', 'Godox', 'GoPro', 'Hasselblad',
  'Hollyland', 'Ilford', 'Insta360', 'Joby', 'K&F Concept', 'Kodak', 'Laowa', 'Leica', 'Lexar', 'Logitech',
  'Lomography', 'Lowepro', 'Manfrotto', 'Meike', 'Moza', 'Nanlite', 'Nikon', 'Olympus', 'Panasonic', 'Peak Design',
  'Pentax', 'Polaroid', 'Profoto', 'Ricoh', 'Rode', 'Samyang', 'SanDisk', 'Saramonic', 'Sekonic', 'Sigma',
  'SmallRig', 'Sony', 'Tamron', 'Tascam', 'Think Tank', 'Tilta', 'Tokina', 'Viltrox', 'Voigtlander', 'Zhiyun', 'Zoom'
];
const menuData = {
  CATEGORIES: [
    {
      title: 'ACCESSORIES',
      links: ['LENSES & ACCESSORIES', 'FOLLOW FOCUS', 'INSTANT CAMERA ACCESSORIES', 'SPEEDLITE MODIFIERS', 'ROTATABLES', 'LENS MUGS', 'INSTANT / DISPOSABLE CAMERA', 'STUDIO FLASH / WIRELESS FLASH', 'PHONE GIMBALS', 'WIRED MICS'],
    },
    {
      title: 'AUDIO',
      links: ['GIMBALS', 'LENS ADAPTERS', 'LCD PROTECTORS', 'UNCATEGORIZED', 'USB MICROPHONES', 'REFLECTORS', 'AUDIO RECORDER', 'VINTAGE CAMERAS (FOR DECOR)', 'CLEANING KIT', 'RINGLIGHTS & VLOGGING'],
    },
    {
      title: 'CAMERAS',
      links: ['SLIDER', 'TRIGGERS', 'UNCATEGORIZED', 'INTERCOMS', 'ON-CAMERA SPEEDLITES', 'GIMBAL ACCESSORIES', 'CAPTURE CARDS & VIDEO MIXERS', 'ON-CAMERA MICS', 'UMBRELLAS', 'MONITORS'],
    },
  ],
};


const MegaMenu = ({ isOpen, onClose }) => {
  // --- CHANGE 1: Set initial state to null ---
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <div
      className={`fixed inset-0 bg-[#EC2027] text-white z-50 flex
                 transition-transform duration-500 ease-in-out
                 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Thin Icon Sidebar */}
      <div className="w-20 bg-black bg-opacity-10 flex-shrink-0 flex flex-col items-center py-8 space-y-10">
  {/* Close Button */}
  <a
    href="#"
    onClick={onClose}
    className="hover:opacity-75 transition-opacity"
  >
    <X size={28} />
  </a>

  {/* User */}
  <a
    href="/login-shop"
    className="hover:opacity-75 transition-opacity"
  >
    <User size={28} />
  </a>

  {/* Heart */}
  <a
    href="/wishlist"
    className="hover:opacity-75 transition-opacity"
  >
    <Heart size={28} />
  </a>
</div>


      {/* --- CHANGE 2: Add onMouseLeave to this container --- */}
      <div 
        className="flex-grow flex overflow-y-auto"
        onMouseLeave={() => setActiveMenu(null)}
      >
        {/* Primary Navigation */}
        <div className="w-64 flex-shrink-0 p-12 font-thin tracking-widest">
          <ul className="space-y-6 text-lg">
            {/* onMouseEnter on these now just clears the active menu */}
            <li onMouseEnter={() => setActiveMenu(null)}><a href="/shop" className="hover:text-gray-200">HOME</a></li>
            <li onMouseEnter={() => setActiveMenu(null)}><a href="#" className="hover:text-gray-200 pb-1 border-b-2 border-white">SHOP</a></li>
            <li onMouseEnter={() => setActiveMenu(null)}><a href="#" className="hover:text-gray-200">OFFERS</a></li>
            
            {/* These set the active menu */}
            <li onMouseEnter={() => setActiveMenu('CATEGORIES')}>
              <a href="#" className={`flex justify-between items-center hover:text-gray-200 ${activeMenu === 'CATEGORIES' ? 'pb-1 border-b-2 border-white' : ''}`}>
                <span>CATEGORIES</span>
                <ChevronRight size={18} className=""/>
              </a>
            </li>
            <li onMouseEnter={() => setActiveMenu('BRANDS')}>
              <a href="#" className={`flex justify-between items-center hover:text-gray-200 ${activeMenu === 'BRANDS' ? 'pb-1 border-b-2 border-white' : ''}`}>
                <span>BRANDS</span>
                <ChevronRight size={18} />
              </a>
            </li>
          </ul>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-grow p-12 pr-20">
            {activeMenu === 'CATEGORIES' && (
                <div className="grid grid-cols-3 gap-x-12 gap-y-8">
                    {menuData.CATEGORIES.map((column) => (
                        <div key={column.title}>
                            <h3 className="font-semibold tracking-widest mb-4 text-sm">{column.title}</h3>
                            <ul className="space-y-3 font-light tracking-wider text-xs">
                                {column.links.map((link) => (
                                    <li key={link}><a href="#" className="hover:text-gray-200">{link}</a></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {activeMenu === 'BRANDS' && (
                <BrandFilter title="Filter by attribute" items={brandsData} />
            )}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;