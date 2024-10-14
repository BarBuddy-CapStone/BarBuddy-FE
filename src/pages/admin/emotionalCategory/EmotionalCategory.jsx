import React, { useState, useEffect, useCallback } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { AddEmotionCategory, EditEmotionCategory, DeleteEmotionCategory } from "src/pages";
import { getAllEmotionCategory } from "src/lib/service/EmotionDrinkCategoryService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

function EmotionCategoryButton({ category, onEdit, onDelete, onView }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-lg font-aBeeZee text-black bg-white rounded-md border border-black shadow-md hover:shadow-lg transition-shadow max-md:px-5">
      <button onClick={() => onView(category.emotionalDrinksCategoryId)}>
        <span className="flex-grow">{category.categoryName}</span>
      </button>
      <div className="flex items-center gap-2">
        <button className="p-1 hover:bg-gray-200 rounded" onClick={() => onEdit(category)}>
          <EditIcon className="w-5 h-5" />
        </button>
        <div className="h-5 w-px bg-gray-500"></div>
        <button className="p-1 hover:bg-gray-200 rounded" onClick={() => onDelete(category)}>
          <DeleteIcon className="w-5 h-5" />
        </button>
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

  const redirect = useNavigate();
  const fetchEmotionCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllEmotionCategory();
      const categories = response.data?.data?.result || [];
      setEmotionCategories(categories);
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

  const handleAddSuccess = useCallback(async (success, message) => {
    setIsAdding(false);
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
    fetchEmotionCategories(); // Refresh categories after adding
  }, [fetchEmotionCategories]);

  const handleEdit = (category) => {
    setCurrentEditCategory({ id: category.emotionalDrinksCategoryId, name: category.categoryName });
    setIsEditing(true);
  };

  const handleView = (emoId) => {
    redirect(`/admin/emotional/drinkBaseEmo?emoId=${emoId}`)
  }

  const handleEditSuccess = () => {
    setIsEditing(false);
    fetchEmotionCategories(); // Refresh categories after editing
  };

  const handleDelete = (category) => {
    setCurrentDeleteCategory({ id: category.emotionalDrinksCategoryId, name: category.categoryName });
    setIsDeleting(true); // Open the delete popup
  };

  const handleDeleteSuccess = () => {
    setIsDeleting(false);
    fetchEmotionCategories(); // Refresh categories after deleting
  };

  return (
    <main className="flex flex-col w-full max-md:max-w-full">
      <section className="flex flex-col pr-8 pl-8 mt-4 w-full max-md:px-5 max-md:mt-6 max-md:max-w-full">
        <div className="flex flex-wrap justify-between w-full text-black mb-4">
          <h2 className="self-start text-3xl font-bold font-notoSansSC">Danh Mục Cảm Xúc</h2>
          <button
            className="flex items-center gap-2 px-4 py-3 text-lg bg-white rounded-md border border-black shadow-md hover:shadow-lg transition-shadow"
            onClick={() => setIsAdding(true)}
          >
            <span className="text-lg">+</span>
            <span className="text-sm font-notoSansSC">Thêm danh mục cảm xúc</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <CircularProgress />
          </div>
        ) : emotionCategories.length === 0 ? (
          <div className="text-red-500 text-center text-lg">Không có loại cảm xúc</div>
        ) : (
          <div className="grid grid-cols-4 gap-8 mt-6 max-md:grid-cols-2 max-sm:grid-cols-1">
            {emotionCategories.map((category) => (
              <EmotionCategoryButton
                key={category.emotionalDrinksCategoryId}
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </section>

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
    </main>
  );
}

export default EmotionalCategory;
