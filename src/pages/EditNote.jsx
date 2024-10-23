import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import EditNoteForm from "../forms/EditNoteForm";
import Loader from "../styles/Loader";

const EditNote = ({ darkMode }) => {
  const { id } = useParams(); // Extracting the note ID from the URL
  const navigate = useNavigate();

  const [note, setNote] = useState(null); // State to store the fetched note
  const [loading, setLoading] = useState(true); // State to handle loading

  // Fetch the note when the component mounts or when the id changes

  // Handle the update submission logic
  const handleUpdate = async (formData) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `https://chambray-warp-runner.glitch.me/api/note/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      // console.log("Respnse of edit note ----->", response.data);
      toast.success(response.data?.message);
      navigate("/notes");
    } catch (error) {
      toast.error("Failed to update note.");
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchNoteById = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://chambray-warp-runner.glitch.me/api/note/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setNote(response.data.note);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching note:", error);
        toast.error("Failed to fetch note");
        setLoading(false);
      }
    };

    fetchNoteById();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  return (
    note && (
      <EditNoteForm darkMode={darkMode} note={note} onSubmit={handleUpdate} />
    )
  );
};

export default EditNote;
