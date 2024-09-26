import React, { useState } from 'react';
import drinkCategories from 'src/lib/service/managerDrinkService';
import AddDrinkCategoryForm  from './PopUpCreate';
import UpdDrinkCategoryForm from './PopUpUpdate';
import PopupConfirmDelete from 'src/components/popupConfirm/popupCfDelete';

const CategoryCard = ({ type, description }) => {
    
    const [isPopupUpdate, setIsPopupUpdate] = useState(false)
    const [isPopupDelete, setIsPopupDelete] = useState(false)

    return (
        <article className="flex flex-col px-4 pt-4 pb-7 mx-auto w-full rounded-xl bg-zinc-300 bg-opacity-50 max-md:mt-10">
            <div className="flex gap-5 justify-between w-full">
                <div className="flex gap-3 self-start text-2xl text-black">
                    <span>Loại:</span>
                    <strong className="font-bold basis-auto">{type}</strong>
                </div>
                <div className="flex gap-2.5">
                    <button onClick={() => setIsPopupUpdate(true)}>
                        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/c8cbc0617bbf4cea08e0f760c9ed54871eff30c88a2b82e5a58df10ceab29920?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f" className="object-contain shrink-0 w-8 aspect-square" alt="" />
                    </button>
                    {isPopupUpdate && (
                        <UpdDrinkCategoryForm onClose={() => setIsPopupUpdate(false)}/>
                    )}
                    <button onClick={() => setIsPopupDelete(true)}>
                        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/5d3fb9fd18a0fb1e7d875875fa44b2cbdcbad34296a336f1231fc65df95315a1?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f" className="object-contain shrink-0 w-8 aspect-square" alt="" />
                    </button>
                    {isPopupDelete && (
                        <PopupConfirmDelete onClose={() => setIsPopupDelete(false)}/>
                    )}
                </div>
            </div>
            <div className="flex gap-3 mt-3 w-full text-lg text-black">
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/1e2a568ee4fc18b3ebd3b96ec24c6285c3f03c41f2b949ffc5bc1e20431c5b66?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f" className="object-contain shrink-0 self-start mt-2 w-6 aspect-square" alt="" />
                <p className="flex-auto gap-6 self-stretch min-h-[99px] w-[293px]">{description}</p>
            </div>
        </article>
    )
};

const AddCategoryButton = () => {
    const [isPopupCreate, setIsPopupCreate] = useState(false);
  
    return (
      <>
        <button 
          onClick={() => setIsPopupCreate(true)}
          className="flex gap-2.5 px-2.5 py-2 text-xl bg-white rounded-md border border-black border-solid shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-gray-100 hover:border-gray-500 hover:shadow-lg transition-all duration-200">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/05719b0bc8adf147a0e97f780bea0ba2d2f701cac417ada50303bc5f38458fc4?placeholderIfAbsent=true&apiKey=4ba6ce2eac644223baba8a7b3bc4374f"
            className="object-contain shrink-0 my-auto w-6 aspect-square"
            alt="Add category"
          />
          <span className="basis-auto">Thêm danh mục</span>
        </button>
  
        {isPopupCreate && (
          <AddDrinkCategoryForm onClose={() => setIsPopupCreate(false)} />
        )}
      </>
    );
  };



const DrinkCategories = () => {
    return (
        <main className="flex overflow-hidden flex-col">
            <header className="flex z-10 flex-wrap gap-5 justify-between items-start w-full text-black max-md:max-w-full">
                <h1 className="text-3xl font-bold">Danh mục thức uống</h1>
                <AddCategoryButton />
            </header>
            <section className="mt-11 w-full max-md:mt-10 max-md:max-w-full">
                <div className="flex gap-5 max-md:flex-col">
                    {drinkCategories.slice(0, 4).map((category, index) => (
                        <CategoryCard 
                            key={index} 
                            type={category.type} 
                            description={category.description}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
};

export default DrinkCategories;