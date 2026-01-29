import { useEffect, useRef, useState } from "react";
import {
  createListItem,
  deleteListItemById,
  markItemCompleted,
  markItemIncomplete,
  updateListItemById,
  useListMutation,
  useListQuery,
  type ListItem,
} from "../../services/lists";
import { useSpaceQuery } from "../../services/spaces";
import { useForm } from "@tanstack/react-form";

import styles from "./list.module.css";
import { Button } from "../../components/Button/Button";
import { CheckIcon, PencilIcon, Plus, X } from "lucide-react";

type Props = {
  listId: string;
};

export const List = ({ listId }: Props) => {
  const { data: spaceData } = useSpaceQuery();
  const { data: listData, isLoading } = useListQuery(listId, spaceData?.id);
  const { mutateAsync: updateList, isPending } = useListMutation(
    spaceData?.id,
    listId,
  );

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isEditingItem, setIsEditingItem] = useState<ListItem | null>(null);

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
    if (!isLoading) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    }
  }, [isLoading]);

  // useEffect(() => {
  //   if (listData?.title) {
  //     setIsAddingItem(false);
  //   }

  //   if (listData?.data) {
  //     setIsEditingTitle(false);
  //   }
  // }, [listData?.title, listData?.data, isPending, isLoading]);

  const form = useForm({
    defaultValues: {
      title: listData?.title || "",
      listItem: "",
      editListItem: "",
    },
    onSubmit: async (_form) => {
      if (listData) {
        const listUpdate = {
          ...listData,
        };

        if (listData?.title !== _form.value.title) {
          listUpdate.title = _form.value.title;
          setIsEditingTitle(false);
        }

        if (_form.value.listItem) {
          const listItem = createListItem();
          listItem.content = _form.value.listItem;
          listUpdate.data = listData?.data
            ? [...listData.data, listItem]
            : [listItem];
        }

        if (_form.value.editListItem && isEditingItem) {
          listUpdate.data = updateListItemById(
            isEditingItem.id,
            listData.data,
            {
              content: _form.value.editListItem,
            },
          );
          setIsEditingItem(null);
        }

        if (
          listData?.title !== _form.value.title ||
          !!_form.value.listItem ||
          (isEditingItem && !!_form.value.editListItem)
        ) {
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
    if (isEditingTitle || isAddingItem || isEditingItem) {
      form.reset();
    }
  }, [listData?.id, listData?.title, listData?.data, isPending, isLoading]);

  const handleTitleEdit = () => {
    setIsAddingItem(false);
    setIsEditingTitle(true);
    setTimeout(() => {
      focusRef.current?.focus();
    }, 0);
  };

  const handleItemEdit = (item: ListItem) => {
    setIsEditingTitle(false);
    setIsAddingItem(false);
    setIsEditingItem(item);
    setTimeout(() => {
      focusRef.current?.focus();
    }, 0);
  };

  const handleItemDelete = async (itemId: string) => {
    if (!listData) return;

    await updateList({
      data: deleteListItemById(itemId, listData.data),
      title: listData?.title || "",
      space_id: listData?.space_id || "",
    });
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

  const handleEditItemBlur = async (value: string, defaultValue?: string) => {
    if (value !== defaultValue) {
      await form.handleSubmit();
    }

    setIsEditingItem(null);
  };

  const getCheckMark = () => {
    return (
      <span className={styles.checkmark}>
        <CheckIcon size={16} strokeWidth={4} />
      </span>
    );
  };

  const getAddEditItemInput = (mode: "add" | "edit", defaultValue?: string) => {
    return (
      <form.Field
        name={mode === "add" ? "listItem" : "editListItem"}
        children={(field) => {
          return (
            <>
              {mode === "edit" && isEditingItem && (
                <div className={styles.checkboxContainer}>
                  <input
                    id={`item-${isEditingItem.id}`}
                    name={field.name}
                    type="checkbox"
                    checked={isEditingItem.completed}
                    disabled
                  />
                  {getCheckMark()}
                </div>
              )}
              <input
                ref={focusRef}
                onFocus={
                  mode === "add"
                    ? () => {
                        const lastItem =
                          document.querySelector(`li:last-of-type`);
                        console.log(lastItem);
                        lastItem?.scrollIntoView({
                          behavior: "smooth",
                          block: "nearest",
                        });
                      }
                    : undefined
                }
                className={styles.addItemInput}
                type="text"
                name={field.name}
                placeholder={
                  mode === "add" ? "New List Item" : "Edit List Item"
                }
                value={mode === "add" ? field.state.value : undefined}
                defaultValue={defaultValue}
                onBlur={(e) => handleEditItemBlur(e.target.value, defaultValue)}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </>
          );
        }}
      />
    );
  };

  return (
    <div className={styles.list}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit(e);
        }}
      >
        <div>
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
                {listData?.title}{" "}
                <PencilIcon
                  className={styles.editIcon}
                  strokeWidth={2}
                  size={18}
                />
              </h2>
            )}
          </div>
          <ul className={styles.listItems}>
            {listData?.data.map((item, index) => (
              <li className={styles.listItem} key={index}>
                {isEditingItem?.id === item.id ? (
                  getAddEditItemInput("edit", item.content)
                ) : (
                  <form.Field
                    name="listItem"
                    children={(field) => {
                      return (
                        <>
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
                                    : markItemIncomplete(
                                        item.id,
                                        listData.data,
                                      );

                                  updateList({
                                    data: listItems,
                                    title: listData?.title || "",
                                    space_id: listData?.space_id || "",
                                  });
                                }}
                              />
                              {getCheckMark()}
                            </div>
                          </label>
                          <span className={styles.labelText}>
                            {item.content}
                          </span>
                          <span
                            tabIndex={0}
                            role="button"
                            className={styles.editItem}
                            onClick={() => handleItemEdit(item)}
                          >
                            <PencilIcon size={14} />
                          </span>
                          <span
                            tabIndex={0}
                            role="button"
                            className={styles.deleteItem}
                            onClick={() => handleItemDelete(item.id)}
                          >
                            <X size={16} />
                          </span>
                        </>
                      );
                    }}
                  />
                )}
              </li>
            ))}
            {/* {pendingItem && (
            <li className={styles.listItem} key={pendingItem.id}>
              <label htmlFor={`item-${pendingItem.id}`}>
                <div className={styles.checkboxContainer}>
                  <input
                    id={`item-${pendingItem.id}`}
                    name="listItem"
                    type="checkbox"
                    checked={pendingItem.completed}
                    disabled
                  />
                  <span className={styles.checkmark}></span>
                </div>
                <span className={styles.labelText}>{pendingItem.content}</span>
              </label>
            </li>
          )} */}
          </ul>
        </div>
        <div className={styles.addItem}>
          {isAddingItem ? (
            getAddEditItemInput("add")
          ) : (
            <Button
              disabled={isPending || isLoading}
              variant="secondary"
              type="button"
              icon={<Plus size={16} />}
              onClick={handleItemAddClick}
            >
              Add Item
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
