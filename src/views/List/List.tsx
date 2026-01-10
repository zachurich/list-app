import { useEffect, useRef, useState } from "react";
import {
  createListItem,
  markItemCompleted,
  markItemIncomplete,
  useListMutation,
  useListQuery,
} from "../../services/lists";
import { useSpaceQuery } from "../../services/spaces";
import { useForm } from "@tanstack/react-form";

import styles from "./list.module.css";

type Props = {
  listId: string;
};

export const List = ({ listId }: Props) => {
  const { data: spaceData } = useSpaceQuery();
  const { data: listData } = useListQuery(listId, spaceData?.id);
  const { mutateAsync: updateList } = useListMutation(spaceData?.id, listId);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const focusRef = useRef<HTMLInputElement>(null);

  const handleUpdateList = async (list: typeof listData) => {
    if (!list) return;

    try {
      await updateList(list);
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };

  useEffect(() => {
    if (listData?.title || listData?.data) {
      setIsEditingTitle(false);
      setIsAddingItem(false);
    }
  }, [listData?.title, listData?.data]);

  const form = useForm({
    defaultValues: {
      title: listData?.title || "",
      listItem: "",
    },
    onSubmit: async (_form) => {
      console.log(_form.value.listItem);
      if (listData) {
        const listUpdate = {
          ...listData,
        };

        if (listData?.title !== _form.value.title) {
          listUpdate.title = _form.value.title;
        }

        if (_form.value.listItem) {
          const listItem = createListItem();
          listItem.content = _form.value.listItem;
          listUpdate.data = listData?.data
            ? [...listData.data, listItem]
            : [listItem];
        }

        if (listData?.title !== _form.value.title || !!_form.value.listItem) {
          try {
            await handleUpdateList(listUpdate);
          } catch (error) {
            console.error("Error creating space:", error);
          }
        }
      }
    },
  });

  useEffect(() => {
    if (isEditingTitle || isAddingItem) {
      form.reset();
    }
  }, [listData?.id]);

  const handleTitleEdit = () => {
    setIsAddingItem(false);
    setIsEditingTitle(true);
    setTimeout(() => {
      focusRef.current?.focus();
    }, 0);
  };

  const handleItemAddClick = () => {
    setIsEditingTitle(false);
    setIsAddingItem(true);
    setTimeout(() => {
      focusRef.current?.focus();
    }, 0);
  };

  const handleTitleBlur = async () => {
    if (
      form.getFieldValue("title") !== listData?.title &&
      !!form.getFieldValue("title")
    ) {
      form.handleSubmit();
    } else {
      setIsEditingTitle(false);
    }
  };

  const handleItemAddBlur = async () => {
    if (form.getFieldValue("listItem")) {
      form.handleSubmit();
    } else {
      setIsAddingItem(false);
    }
  };

  return (
    <div className={styles.list}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("ZACH", e);
          form.handleSubmit(e);
        }}
      >
        <div className={styles.listTitle}>
          {isEditingTitle ? (
            <form.Field
              name="title"
              children={(field) => {
                return (
                  <input
                    className="h2"
                    type="text"
                    ref={focusRef}
                    name={field.name}
                    value={field.state.value}
                    onBlur={handleTitleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                );
              }}
            />
          ) : (
            <h2 ref={focusRef} onClick={handleTitleEdit}>
              {listData?.title}
            </h2>
          )}
        </div>
        <ul className={styles.listItems}>
          {listData?.data.map((item, index) => (
            <li className={styles.listItem} key={index}>
              <form.Field
                name="listItem"
                children={(field) => {
                  return (
                    <label htmlFor={`item-${item.id}`}>
                      <div className={styles.checkboxContainer}>
                        <input
                          id={`item-${item.id}`}
                          name={field.name}
                          type="checkbox"
                          checked={item.completed}
                          onChange={(e) => {
                            const listItems = e.target.checked
                              ? markItemCompleted(item.id, listData.data)
                              : markItemIncomplete(item.id, listData.data);

                            updateList({
                              data: listItems,
                              title: listData?.title || "",
                              space_id: listData?.space_id || "",
                            });
                          }}
                        />
                        <span className={styles.checkmark}></span>
                      </div>
                      <span className={styles.labelText}>{item.content}</span>
                    </label>
                  );
                }}
              />
            </li>
          ))}
        </ul>
        <div className={styles.addItem}>
          {isAddingItem ? (
            <form.Field
              name="listItem"
              children={(field) => {
                return (
                  <input
                    ref={focusRef}
                    className={styles.addItemInput}
                    type="text"
                    name={field.name}
                    placeholder="New List Item"
                    value={field.state.value}
                    onBlur={handleItemAddBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                );
              }}
            />
          ) : (
            <button
              className="secondary"
              type="button"
              onClick={handleItemAddClick}
            >
              + Add Item
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
