import React, { useState, useEffect, useCallback } from "react";
import { Search, Add, Edit, Delete } from "@mui/icons-material";
import { getAllEmotionCategory } from "src/lib/service/EmotionDrinkCategoryService";
import { CircularProgress, Pagination } from "@mui/material";
import { message } from "antd";
import AddEmotionCategory from "./components/AddEmotionCategory";
import EditEmotionCategory from "./components/EditEmotionCategory";
import DeleteEmotionCategory from "./components/DeleteEmotionCategory";
import useDebounce from "src/lib/hooks/useDebounce";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEmotionCategories = useCallback(async (search = '', page = currentPage) => {
    setIsLoading(true);
    setEmotionCategories([]);
    try {
      const response = await getAllEmotionCategory(page, undefined, search);
      console.log('API Response:', response);

      if (response?.data?.data?.emotionCategoryResponses) {
        setEmotionCategories(response.data.data.emotionCategoryResponses);
        setTotalItems(response.data.data.totalItems);
        setTotalPages(response.data.data.totalPages);
      } else {
        console.error('Invalid response structure:', response);
        setEmotionCategories([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching emotion categories:", error);
      message.error("Có lỗi xảy ra khi tải danh sách danh mục cảm xúc.");
      setEmotionCategories([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchEmotionCategories(debouncedSearchTerm, currentPage);
  }, [debouncedSearchTerm, currentPage, fetchEmotionCategories]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAddSuccess = useCallback(async () => {
    setIsAdding(false);
    setCurrentPage(1);
    await fetchEmotionCategories(searchTerm);
  }, [fetchEmotionCategories, searchTerm]);

  const handleEdit = (category) => {
    setCurrentEditCategory(category);
    setIsEditing(true);
  };

  const handleEditSuccess = async () => {
    setIsEditing(false);
    await fetchEmotionCategories(searchTerm);
  };

  const handleDelete = (category) => {
    setCurrentDeleteCategory(category);
    setIsDeleting(true);
  };

  const handleDeleteSuccess = async () => {
    setIsDeleting(false);
    if (emotionCategories.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
    await fetchEmotionCategories(searchTerm, currentPage);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <main className="overflow-hidden pt-2 px-5 bg-white max-md:pr-5">
      <div className="flex flex-col gap-0 max-md:flex-col">
        <div className="flex justify-between gap-4 mx-4 my-6">
          <div className="relative w-[300px]">
            <input
              type="text"
              placeholder="Tìm kiếm danh mục cảm xúc..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            className="flex items-center gap-2 px-6 py-2 text-base text-black bg-white rounded-full border border-sky-900 shadow hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsAdding(true)}
          >
            <Add className="w-5 h-5" />
            <span>Thêm Cảm Xúc</span>
          </button>
        </div>

        <h2 className="text-2xl font-notoSansSC font-bold text-blue-600 mb-4 text-center">
          Danh Sách Danh Mục Cảm Xúc
        </h2>
        
        <div className="flex flex-col mb-5 w-full max-md:mt-4 max-md:max-w-full gap-4 p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <CircularProgress />
            </div>
          ) : !Array.isArray(emotionCategories) || emotionCategories.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-red-500 text-lg font-semibold">
                Không tìm thấy danh mục cảm xúc!
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {emotionCategories.map((category) => (
                  <EmotionCategoryCard
                    key={category.emotionalDrinksCategoryId}
                    category={category}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                />
              </div>
            </>
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
