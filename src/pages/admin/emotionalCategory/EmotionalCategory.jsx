import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { AddEmotionCategory, EditEmotionCategory, DeleteEmotionCategory } from "src/pages"; // Import the components

// Array of emotion categories
const emotionCategories = [
  "Vui Vẻ",
  "Giận dữ",
  "Hạnh phúc",
  "Buồn bã",
  "Phấn khích",
  "Bối rối",
  "Đau khổ",
  "Tự hào",
];

// Individual Emotion Category Button with Edit and Delete icons
function EmotionCategoryButton({ emotion, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-lg font-aBeeZee text-black bg-white rounded-md border border-black shadow-md hover:shadow-lg transition-shadow max-md:px-5">
      {/* Emotion name */}
      <span className="flex-grow">{emotion}</span>

      {/* Edit and Delete icons with a divider */}
      <div className="flex items-center gap-2">
        <button className="p-1 hover:bg-gray-200 rounded" onClick={() => onEdit(emotion)}>
          <EditIcon className="w-5 h-5" />
        </button>
        {/* Divider */}
        <div className="h-5 w-px bg-gray-500"></div>
        <button className="p-1 hover:bg-gray-200 rounded" onClick={() => onDelete(emotion)}>
          <DeleteIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Main component that renders the grid of emotion categories and handles edit/add/delete form display
function EmotionalCategory() {
  const [editingEmotion, setEditingEmotion] = useState(null); // State to track which emotion is being edited
  const [isAdding, setIsAdding] = useState(false); // State to track if adding new emotion
  const [deletingEmotion, setDeletingEmotion] = useState(null); // State to track which emotion is being deleted

  const handleEdit = (emotion) => {
    setEditingEmotion(emotion); // Set the current emotion to edit
  };

  const handleDelete = (emotion) => {
    setDeletingEmotion(emotion); // Set the current emotion to delete
  };

  const handleCloseEdit = () => {
    setEditingEmotion(null); // Close the edit form
  };

  const handleCloseAdd = () => {
    setIsAdding(false); // Close the AddEmotionCategory form
  };

  const handleCloseDelete = () => {
    setDeletingEmotion(null); // Close the DeleteEmotionCategory form
  };

  const handleDeleteConfirm = () => {
    // Logic to delete the emotion can be added here
    console.log(`Deleted emotion: ${deletingEmotion}`);
    handleCloseDelete(); // Close the delete form after confirming
  };

  const handleAddNew = () => {
    setIsAdding(true); // Open the AddEmotionCategory form
  };

  return (
    <main className="flex flex-col w-full max-md:max-w-full">
      <section className="flex flex-col pr-8 pl-8 mt-4 w-full max-md:px-5 max-md:mt-6 max-md:max-w-full">
        {/* Header with title and add category button */}
        <div className="flex flex-wrap justify-between w-full text-black mb-4">
          <h2 className="self-start text-3xl font-bold font-notoSansSC">Danh Mục Cảm Xúc</h2>
          <button
            className="flex items-center gap-2 px-4 py-3 text-lg bg-white rounded-md border border-black shadow-md hover:shadow-lg transition-shadow"
            onClick={handleAddNew} // Open add popup
          >
            <span className="text-lg">+</span>
            <span className="text-sm font-notoSansSC">Thêm danh mục cảm xúc</span>
          </button>
        </div>

        {/* Grid for Emotion Category Buttons */}
        <div className="grid grid-cols-4 gap-8 mt-6 max-md:grid-cols-2 max-sm:grid-cols-1">
          {emotionCategories.map((emotion, index) => (
            <EmotionCategoryButton
              key={index}
              emotion={emotion}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </section>

      {/* Display the edit form when an emotion is being edited */}
      {editingEmotion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <EditEmotionCategory
              emotionName={editingEmotion}
              onClose={handleCloseEdit}
            />
          </div>
        </div>
      )}

      {/* Display the add form when adding a new emotion */}
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <AddEmotionCategory onClose={handleCloseAdd} />
          </div>
        </div>
      )}

      {/* Display the delete confirmation when an emotion is being deleted */}
      {deletingEmotion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <DeleteEmotionCategory
              emotionName={deletingEmotion} // Pass the emotionName to DeleteEmotionCategory
              onConfirm={handleDeleteConfirm}
              onCancel={handleCloseDelete}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default EmotionalCategory;
