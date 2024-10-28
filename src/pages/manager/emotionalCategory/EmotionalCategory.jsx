import React, { useState, useEffect, useCallback } from "react";
import { Search, Add, Delete, Edit } from "@mui/icons-material";
import { getAllEmotionCategory } from "src/lib/service/EmotionDrinkCategoryService";
import { CircularProgress } from "@mui/material";
import { message } from "antd";
import AddEmotionCategory from "./components/AddEmotionCategory";
import EditEmotionCategory from "./components/EditEmotionCategory";
import DeleteEmotionCategory from "./components/DeleteEmotionCategory";
import useAuthStore from "src/lib/hooks/useUserStore";

function EmotionCategoryCard({ category, onEdit, onDelete }) {
  return (
    <div className="flex flex-col p-4 w-full rounded-xl bg-neutral-200 bg-opacity-50 transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
        <div className="flex items-center gap-1 flex-grow">
          <span className='text-lg font-bold whitespace-nowrap'>Cảm Xúc:</span>
          <span className="text-lg break-words">{category.categoryName}</span>
        </div>

        <div className="flex gap-2 flex-shrink-0 items-center">
          <button onClick={() => onEdit(category)} className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200 flex items-center justify-center">
            <Edit className="w-5 h-5 text-gray-600" />
          </button>
          <button onClick={() => onDelete(category)} className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200 flex items-center justify-center">
            <Delete className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="flex gap-3 w-full text-base text-black">
        <img 
          loading="lazy" 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/1e2a568ee4fc18b3ebd3b96ec24c6285c3f03c41f2b949ffc5bc1e20431c5b66" 
          className="object-contain shrink-0 self-start mt-1 w-6 aspect-square" 
          alt="" 
        />
        <p className="flex-1 min-h-[60px] break-words">{category.description}</p>
      </div>
    </div>
  );
}

function EmotionalCategory() {
  const [emotionCategories, setEmotionCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentEditCategory, setCurrentEditCategory] = useState(null);
  const [currentDeleteCategory, setCurrentDeleteCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);

  const { userInfo } = useAuthStore();
  const barId = userInfo?.identityId;

  const fetchEmotionCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllEmotionCategory();
      const categories = response.data?.data || [];
      setEmotionCategories(categories);
      setFilteredCategories(categories);
    } catch (error) {
      console.error("Error fetching emotion categories:", error);
      message.error("Không thể tải danh sách danh mục cảm xúc.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmotionCategories();
  }, [fetchEmotionCategories]);

  const handleSearch = () => {
    const filtered = emotionCategories.filter(category =>
      category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleAddSuccess = useCallback(async () => {
    setIsAdding(false);
    await fetchEmotionCategories();
  }, [fetchEmotionCategories]);

  const handleEdit = (category) => {
    setCurrentEditCategory(category);
    setIsEditing(true);
  };

  const handleEditSuccess = async () => {
    setIsEditing(false);
    await fetchEmotionCategories();
  };

  const handleDelete = (category) => {
    setCurrentDeleteCategory(category);
    setIsDeleting(true);
  };

  const handleDeleteSuccess = async () => {
    setIsDeleting(false);
    await fetchEmotionCategories();
  };

  return (
    <main className="overflow-hidden pt-2 px-5 bg-white max-md:pr-5">
      <div className="flex flex-col gap-0 max-md:flex-col">
        <div className="flex flex-col md:flex-row items-center justify-between ml-4 mr-4 mt-6 gap-4 mb-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Tìm kiếm danh mục cảm xúc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 pr-10 border border-sky-900 rounded-full w-full"
            />
            <Search 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" 
              onClick={handleSearch}
            />
          </div>

          <button
            className="flex items-center gap-2 px-6 py-2 text-base text-black bg-white rounded-full border border-sky-900 shadow hover:bg-gray-100 transition-colors duration-200 w-full md:w-auto"
            onClick={() => setIsAdding(true)}
          >
            <Add className="w-5 h-5" />
            <span>Thêm Cảm Xúc</span>
          </button>
        </div>

        <div className="flex flex-col mb-5 w-full max-md:mt-4 max-md:max-w-full gap-4 p-4">
          <h2 className="text-2xl font-notoSansSC font-bold text-blue-600 mb-4 text-center">
            Danh Sách Danh Mục Cảm Xúc
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <CircularProgress />
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-red-500 text-lg font-semibold">Không có danh mục cảm xúc</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((category) => (
                <EmotionCategoryCard
                  key={category.emotionalDrinksCategoryId}
                  category={category}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <AddEmotionCategory onClose={() => setIsAdding(false)} onAddSuccess={handleAddSuccess} />
        </div>
      )}

      {isEditing && currentEditCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <EditEmotionCategory
            emotionId={currentEditCategory.emotionalDrinksCategoryId}
            emotionName={currentEditCategory.categoryName}
            emotionDescription={currentEditCategory.description}
            onClose={() => setIsEditing(false)}
            onEditSuccess={handleEditSuccess}
          />
        </div>
      )}

      {isDeleting && currentDeleteCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <DeleteEmotionCategory
            emotionId={currentDeleteCategory.emotionalDrinksCategoryId}
            emotionName={currentDeleteCategory.categoryName}
            emotionDescription={currentDeleteCategory.description}
            onConfirm={handleDeleteSuccess}
            onCancel={() => setIsDeleting(false)}
          />
        </div>
      )}
    </main>
  );
}

export default EmotionalCategory;
