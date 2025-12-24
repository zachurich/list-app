import { useSpaceMutation, useSpaceQuery } from "../../services/spaces";
import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import { useNavigate } from "react-router";

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
    <div>
      <h1>Landing Page</h1>
      <form
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
                name={field.name}
                placeholder="Author Name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            );
          }}
        />
        <button type="submit" onClick={form.handleSubmit}>
          Create Space
        </button>
      </form>
    </div>
  );
};
