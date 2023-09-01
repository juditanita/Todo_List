import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(
    JSON.parse(localStorage.getItem("list")) || []
  );

  const [isEdited, setIsEdited] = useState(false);
  const [editedId, setEditedId] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    type: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      //tell the user the input box is empty
      showAlert(true, "danger", "Enter data to the box");
    } else if (name && isEdited) {
      //this is for editing

      setList(
        list.map((item) => {
          if (item.id === editedId) {
            return { ...item, title: name };
          }

          return item;
        })
      );
      setName("");
      setIsEdited(false);
      setEditedId(null);
      showAlert(true, "success", "Item modified");
    } else {
      //item is added to the list and add some alert to tell the user that it is happening
      const newItem = {
        id: new Date().getTime().toString(),
        title: name,
      };
      setList([...list, newItem]);
      setName("");
      showAlert(true, "success", `${newItem.title} added to the list`);
    }
  };

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };

  const clearList = () => {
    showAlert(true, "danger", "Items deleted");
    setList([]);
  };

  const removeItem = (id) => {
    console.log("button clicked");
    const newList = list.filter((item) => item.id !== id);
    setList(newList);
    showAlert(true, "danger", "item removed");
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEdited(true);
    setEditedId(id);
    const newName = specificItem.title;
    setName((prevName) => newName);
    showAlert(true, "success", `${newName} added to the list`);
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <form onSubmit={handleSubmit} className="grocery-form">
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>Just some todos</h3>

        <div className="form-control">
          <input
            type="text"
            className="grocery"
            value={name}
            onChange={(event) => setName((prev) => event.target.value)}
            placeholder="e.g. grocery"
          />
          <button type="submit" className="submit-btn">
            {isEdited ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            clear items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
