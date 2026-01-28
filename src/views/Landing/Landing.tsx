import { useSpaceMutation, useSpaceQuery } from "../../services/spaces";
import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import { useNavigate } from "react-router";

import styles from "./landing.module.css";
import { Button } from "../../components/Button/Button";

export const Landing = () => {
  const { data: existingSpace, error, isLoading } = useSpaceQuery();
  const { mutateAsync } = useSpaceMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (existingSpace) {
      navigate(`/${existingSpace.id}/`);
    }
  }, [existingSpace, navigate]);

  const form = useForm({
    defaultValues: {
      author: "",
    },
    onSubmit: async (_form) => {
      if (!_form.value.author) {
        alert("Author name is required");
        return;
      }
      const newSpace = {
        author: _form.value.author,
      };
      try {
        const createdSpace = await mutateAsync(newSpace);
        navigate(`/${createdSpace.id}/`);
      } catch (error) {
        console.error("Error creating space:", error);
      }
    },
  });

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  if (isLoading) {
    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>Welcome</h1>
        <h2>Create a new Space to start making lists!</h2>
      </div>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="author"
          children={(field) => {
            return (
              <input
                type="text"
                name={field.name}
                placeholder="Your Name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            );
          }}
        />
        <Button type="submit" onClick={form.handleSubmit}>
          Create Space
        </Button>
      </form>
    </div>
  );
};
