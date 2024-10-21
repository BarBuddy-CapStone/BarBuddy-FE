import React, { useState, useEffect, useCallback } from "react";
import { Search, Add, Delete, Edit } from "@mui/icons-material";
import { AddEmotionCategory, EditEmotionCategory, DeleteEmotionCategory } from "src/pages";
import { getAllEmotionCategory } from "src/lib/service/EmotionDrinkCategoryService";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

function EmotionCategoryCard({ category, onEdit, onDelete }) {
  return (
    <div className="flex flex-col w-full rounded-xl bg-neutral-200 bg-opacity-50 shadow-md text-base overflow-hidden">
      <div className="px-4 py-5">
        <div className="flex justify-between items-center w-full">
          <div className="text-lg font-bold text-black truncate overflow-hidden pr-2 flex-1" title={category.categoryName}>
            {category.categoryName}
          </div>
          <div className="flex items-center gap-2">
            <Edit className="cursor-pointer text-black hover:text-gray-700" onClick={() => onEdit(category)} />
            <Delete className="cursor-pointer text-black hover:text-gray-700" onClick={() => onDelete(category)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmotionalCategory() {
  const [emotionCategories, setEmotionCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentEditCategory, setCurrentEditCategory] = useState({ id: '', name: '' });
  const [currentDeleteCategory, setCurrentDeleteCategory] = useState({ id: '', name: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);

  const navigate = useNavigate();

  const fetchEmotionCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllEmotionCategory();
      const categories = response.data?.data || [];
      setEmotionCategories(categories);
      setFilteredCategories(categories);
    } catch (error) {
      console.error("Error fetching emotion categories:", error);
      toast.error("Không thể tải danh sách danh mục cảm xúc.");
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

  const handleAddSuccess = useCallback(async (success, message) => {
    setIsAdding(false);
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
    fetchEmotionCategories();
  }, [fetchEmotionCategories]);

  const handleEdit = (category) => {
    setCurrentEditCategory({ id: category.emotionalDrinksCategoryId, name: category.categoryName });
    setIsEditing(true);
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    fetchEmotionCategories();
  };

  const handleDelete = (category) => {
    setCurrentDeleteCategory({ id: category.emotionalDrinksCategoryId, name: category.categoryName });
    setIsDeleting(true);
  };

  const handleDeleteSuccess = () => {
    setIsDeleting(false);
    fetchEmotionCategories();
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
            <span>Thêm danh mục cảm xúc</span>
          </button>
        </div>

        <div className="flex flex-col mb-5 w-full max-md:mt-4 max-md:max-w-full gap-4 p-4">
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

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <EditEmotionCategory
            emotionId={currentEditCategory.id}
            emotionName={currentEditCategory.name}
            onClose={() => setIsEditing(false)}
            onEditSuccess={handleEditSuccess}
          />
        </div>
      )}

      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <DeleteEmotionCategory
            emotionId={currentDeleteCategory.id}
            emotionName={currentDeleteCategory.name}
            onConfirm={handleDeleteSuccess}
            onCancel={() => setIsDeleting(false)}
          />
        </div>
      )}

      <ToastContainer />
    </main>
  );
}

export default EmotionalCategory;
