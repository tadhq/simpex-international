'use client';

import { getDirectusFile } from '@/lib/directus/utils';
import Image from '@/lib/mantine/Image';
import { Menu } from '@mantine/core';

export default function CategoryDropdown() {
  //TODO: Make Dynamic
  const categories: {
    Food: {
      title: string;
      image: string;
      link: string;
      subcategories: { name: string; link: string }[];
    }[];
    Drinks: never[];
    Households: never[];
    Drugstore: never[];
    Overig: never[];
  } = {
    Food: [
      {
        title: 'Fruits & Vegetables',
        image: 'eed1e74a-2540-49ab-9612-8458309c34b0',
        link: '/categories/fruits-and-vegetables',
        subcategories: [
          { name: 'Fresh Fruits', link: '/categories/fruits-and-vegetables/fresh-fruits' },
          { name: 'Fresh Vegetables', link: '/categories/fruits-and-vegetables/fresh-vegetables' },
          { name: 'Organic Options', link: '/categories/fruits-and-vegetables/organic-options' },
        ],
      },
      {
        title: 'Meat & Poultry',
        image: 'eed1e74a-2540-49ab-9612-8458309c34b0',
        link: '/categories/meat-and-poultry',
        subcategories: [
          { name: 'Chicken', link: '/categories/meat-and-poultry/chicken' },
          { name: 'Beef', link: '/categories/meat-and-poultry/beef' },
          { name: 'Seafood', link: '/categories/meat-and-poultry/seafood' },
        ],
      },
      {
        title: 'Snacks & Beverages',
        image: 'eed1e74a-2540-49ab-9612-8458309c34b0',
        link: '/categories/snacks-and-beverages',
        subcategories: [
          { name: 'Chips', link: '/categories/snacks-and-beverages/chips' },
          { name: 'Sodas', link: '/categories/snacks-and-beverages/sodas' },
          { name: 'Energy Drinks', link: '/categories/snacks-and-beverages/energy-drinks' },
        ],
      },
    ],
    Drinks: [],
    Households: [],
    Drugstore: [],
    Overig: [],
  };

  const categoryKeys = Object.keys(categories) as (keyof typeof categories)[];

  return (
    <div className="flex font-extrabold gap-4 xl:gap-14 cursor-pointer text-primary-600 group">
      {categoryKeys.map((item) => (
        <Menu key={item} position="bottom-start" trigger="hover">
          <Menu.Target>
            <a
              className="hover:scale-125 transition-transform duration-300 group-hover:text-gray-400 hover:!text-primary-700"
              href="#"
            >
              {item}
            </a>
          </Menu.Target>
          <Menu.Dropdown
            className="bg-white shadow-lg rounded-lg p-6 cursor-pointer mt-5"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          >
            {categories[item].length > 0 ? (
              <div className="grid grid-cols-3 gap-6">
                {categories[item].map((category, index) => (
                  <div key={index} className="flex flex-col">
                    <a
                      className="h-28 w-52 lg:h-32 lg:w-[270px] relative cursor-pointer overflow-hidden rounded-lg block"
                      href={category.link}
                    >
                      <Image
                        fill
                        alt={category.title}
                        className="object-cover shadow"
                        fallbackSrc="https://placehold.co/000000/FFFFFF/150x150?text=No+image"
                        src={getDirectusFile(category.image)}
                      />
                    </a>
                    <a
                      className="mt-6 text-xl font-extrabold hover:text-primary-700 transition-colors"
                      href={category.link}
                    >
                      {category.title}
                    </a>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      {category.subcategories.map((subcat, subIndex) => (
                        <li key={subIndex}>
                          <a
                            className="hover:text-primary-700 transition-colors"
                            href={subcat.link}
                          >
                            {subcat.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 px-64 lg:px-[356px] py-4 font-extrabold">
                No categories found
              </div>
            )}
          </Menu.Dropdown>
        </Menu>
      ))}
    </div>
  );
}
