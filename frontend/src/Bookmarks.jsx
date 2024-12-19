import React, { useState, useEffect } from "react";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // Fetch initial bookmarks from the server
  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const response = await fetch("/bookmarks");
        const data = await response.json();
        setBookmarks(data.bookmarks || []);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    }

    fetchBookmarks();
  }, []);

  const handleAddBookmark = () => {
    if (!title || !url) return;

    const newBookmark = { title, url };
    // Save bookmark to server (if backend logic exists)
    fetch("/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBookmark),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setBookmarks((prev) => [...prev, newBookmark]);
          setTitle("");
          setUrl("");
        } else {
          console.error("Error adding bookmark:", result.message);
        }
      })
      .catch((error) => console.error("Error adding bookmark:", error));
  };

  const handleDeleteBookmark = (index) => {
    const updatedBookmarks = bookmarks.filter((_, i) => i !== index);
    setBookmarks(updatedBookmarks);
    // Optional: Notify backend to delete bookmark
  };

  return (
    <div className="container">
      <h1 className="title">Bookmarks</h1>
      <form
        id="addBookmarkForm"
        className="box"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="field">
          <label className="label" htmlFor="title">
            Bookmark Name
          </label>
          <div className="control">
            <input
              className="input"
              type="text"
              id="title"
              name="title"
              placeholder="Enter bookmark name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="url">
            Bookmark URL
          </label>
          <div className="control">
            <input
              className="input"
              type="url"
              id="url"
              name="url"
              placeholder="Enter bookmark URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="control">
          <button
            className="button is-primary"
            id="addBookmarkBtn"
            type="button"
            onClick={handleAddBookmark}
          >
            Add Bookmark
          </button>
        </div>
      </form>

      <table className="table is-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="bookmarkTable">
          {bookmarks.map((bookmark, index) => (
            <tr key={index}>
              <td>{bookmark.title}</td>
              <td>
                <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                  {bookmark.url}
                </a>
              </td>
              <td>
                <button
                  className="button is-danger is-small"
                  onClick={() => handleDeleteBookmark(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bookmarks;
